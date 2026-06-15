# AllSource Cutover (Prompt 003)

The application now talks to the AllSource event store instead of the dead
Supabase project. 001 built the shared client (`getAllSourceClient()` in
`packages/database/src/allsource.ts`), 002 migrated the data (14 events in tenant
`decebal-dobrica-at-gmail-com`), and this cutover rewires every Supabase-backed
runtime path onto the AllSource TS SDK (`@allsourcedev/client@0.23.0`).

Reads fold an aggregate's event stream into the current-state read shape; writes
append events. Event types use **lowercase dots/underscores only** — the gateway
rejects any hyphenated `event_type` with HTTP 422 (entity ids may contain
hyphens). All types/streams match `docs/ALLSOURCE_EVENT_MODEL.md` and the
migrate transforms exactly.

## What changed per domain

### Newsletter (`packages/newsletter/src/index.ts`)
The canonical, AllSource-backed implementation.

- `createNewsletterIssue` → appends `issue.created` to a fresh `issue:<uuid>`
  stream (status `scheduled` if `scheduled_for`, else `draft`), returns the
  issue id. New `markIssueSent(issueId, n)` appends `issue.sent` after a real
  send.
- `getActiveSubscribers(tier)` / `getSubscriberCount(tier)` / `listSubscribers`
  → cross-aggregate read: query the subscriber lifecycle event types, group by
  `entity_id` (`subscriber:<email>`), fold each stream, filter on
  `status === 'active'` (+ tier). `listSubscribers` keeps any status for admin
  views.
- `subscribeToNewsletter` → folds the subscriber stream to enforce the
  re-subscribe rules (reject when already active/pending, allow when
  unsubscribed), then appends `subscriber.subscribed` (pending) +
  `subscriber.confirmation_requested` and returns the token.
- `confirmSubscription(token)` → finds the matching
  `subscriber.confirmation_requested` event by token, folds the stream to check
  expiry/idempotency, appends `subscriber.confirmed`.
- `unsubscribeFromNewsletter` → `subscriber.unsubscribed`.
- `trackNewsletterEvent` → `subscriber.message_event` (now keyed by email, not a
  Supabase UUID; `last_opened_at` is derived in the fold, not stored).
- `getSubscriberByEmail` / `getNewsletterIssue` → single-stream fold.
- `getNewsletterStats` → subscriber counts from the fold, total issues from a
  fold over `issue.created`, engagement rates averaged over active subscribers.

### Newsletter (app duplicate, `apps/web/src/lib/newsletter.ts`)
Was a stale Supabase duplicate with no importers. Now re-exports
`@decebal/newsletter` so any lingering `@/lib/newsletter` import is AllSource-backed.

### Newsletter routes
- `api/newsletter/interest` → `plan_interest.registered` on
  `plan-interest:<email>:<plan_id>`; existence check via `queryEvents`.
- `api/newsletter/upgrade` → `subscriber.tier_changed` +
  `subscriber.subscription_started`; subscriber addressed by email
  (`subscriberId`, when present, is the `subscriber:<email>` stream id).
- `api/newsletter/subscribers` → `listSubscribers` projection with tier/status
  filters.

### Payments + access (`apps/web/src/lib/payments/index.ts`)
Full rewrite, public signatures preserved.

- `createPayment` → `payment.initiated` on `payment:<reference|uuid>`; returns
  `Payment.id` = the stream id so later reads/updates address the same stream.
- `getPayment(id)` / `getPaymentByReference(ref)` → single-stream fold.
- `updatePaymentStatus(id, status, sig?)` → appends the matching terminal event
  (`payment.confirmed` / `.failed` / `.refunded` / `.expired`).
- `getUserPayments` / `getPaymentsByEntity` / `getPaymentsByType` (new) →
  cross-aggregate read over `payment.initiated` filtered by
  wallet/entity/type, fold each stream.
- Service access: `grantServiceAccess` → `service_access.granted`,
  `revokeServiceAccess` → `service_access.revoked`, `hasServiceAccess` /
  `getUserServiceAccess` fold to the active boolean (granted, not revoked, not
  expired).
- Meetings: `createMeetingBooking` → `meeting.booked`, `linkPaymentToMeeting` →
  `meeting.payment_linked`, `updateMeetingBooking` maps status to the lifecycle
  event, reads fold the stream.
- User profiles: `ensureUserProfile` get-or-create on `wallet:<address>`,
  `getUserProfile` / `updateUserProfile` via `profile.created` / `profile.updated`.
- Payment config: source of truth stays in code (`./config`);
  `getPaymentConfigFromDB` / `syncPaymentConfigToDB` read/write the audit-only
  `payment_config.defined` events.

### Payment action (`apps/web/src/actions/payment-action.ts`)
Only `getPaymentAnalytics` touched Supabase directly (the `get_payment_stats`
RPC). It now folds meeting payments via `getPaymentsByType('meeting')` and
aggregates counts/revenue client-side. The rest already flowed through
`@/lib/payments`.

### Wallet action (`apps/web/src/actions/wallet-action.ts`)
Supabase GoTrue Web3 auth removed (event model §2: identity = wallet address,
verified client-side by the wallet adapter; there is no server session).

- `authenticateWallet` ensures the AllSource profile and echoes the wallet.
- `checkWalletAccess` / `grantWalletAccess` use the AllSource service-access fold.
- `getCurrentWalletAddress` now takes the wallet address as input (no server
  session to read it from) and confirms the profile.

### UserMenu (`apps/web/src/components/UserMenu.tsx`)
`'use client'` component. Dropped the Supabase browser client entirely; identity
is the connected Solana wallet from `useWallet()`. It holds NO server
credentials and never imports the AllSource client/key — see Security.

## Supabase removal
- Deleted `packages/database/src/client.ts` (`getSupabaseAdmin`/`getSupabaseClient`)
  and `apps/web/src/lib/supabase/` (`server.ts`, `client.ts`, `wallet-auth.ts`).
- Dropped `@supabase/supabase-js` + `@supabase/ssr` from `packages/database`,
  `packages/newsletter`, and `apps/web` package.json (grepped: no remaining
  runtime imports).
- Removed `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` from `apps/web/.env.example`.
- The only residual `supabase` string in app code is a case-study reference URL
  (`https://supabase.com/pricing`) in `apps/web/src/data/caseStudies.ts` — content,
  not a dependency. The `packages/database/scripts/migrate/*` modules still
  reference Supabase because they read the dump; they are intentionally untouched.

## Security
The AllSource service key is server-only. `getAllSourceClient()` reads
`ALLSOURCE_API_KEY` from the server environment and is imported only by server
actions (`'use server'`), route handlers, the newsletter package (server-only),
and the publish script. No `'use client'` component imports it — `UserMenu.tsx`
gets its identity from the wallet adapter and would obtain any server data via a
server action.

## Guarded publish
`apps/web/scripts/publish-blog-post.ts` has a documented send guard so the full
publish path can be exercised without emailing real subscribers:

- `PUBLISH_DRY_RUN=1` (or `--dry-run`): runs load post → create `issue.created`
  in AllSource → resolve active subscribers → reach the send loop, but logs each
  intended recipient instead of calling the real email send. Social posting is
  skipped and `issue.sent` is NOT recorded.
- `--test-recipient=<addr>` (or `PUBLISH_TEST_RECIPIENT`): sends a single email
  to that address only, never to the resolved subscriber list.
- With neither flag the real, unguarded send path runs (for a human to publish
  for real) and records `issue.sent` with the delivered count.

`task publish -- <slug>` is unchanged; the guard is opt-in via env/flag.

## Behaviour deltas
- `confirmSubscription` takes a confirmation **token** (double opt-in), not a
  subscriber id (the old app-local duplicate took an id; the package always took
  a token).
- `Payment.id` / `ServiceAccess.id` / `MeetingBooking.id` / `UserProfile.id` are
  now AllSource stream ids, not Supabase UUIDs. Callers round-trip them
  unchanged.
- `getCurrentWalletAddress` requires the wallet address as input (no server
  session).
- Derived fields Supabase maintained via triggers (`last_opened_at`,
  `open_rate`, issue `*_count`, `updated_at`) are recomputed in the fold.

## Rollback
Revert this change set and restore the Supabase deps + env vars. The migrated
AllSource events are append-only and untouched by a rollback. Because the
migration is idempotent (002), re-pointing at AllSource after a rollback needs no
data changes. Note that Supabase itself is dead (NXDOMAIN), so a rollback only
makes sense paired with restoring a Supabase project — the forward path
(AllSource) is the supported one.
