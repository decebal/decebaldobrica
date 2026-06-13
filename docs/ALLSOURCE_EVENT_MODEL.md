# AllSource Event Model

Data-layer foundation for migrating this monorepo off the dead Supabase project
(`jhtjrotugaluuixjmbiw.supabase.co`, NXDOMAIN) onto the AllSource event store.

This document is the contract that prompts 002 (data migration) and 003 (app
cutover) build on. It maps every Supabase `public.*` table onto AllSource
streams, event types, payloads, and the projection that reconstructs the read
shape each consumer needs.

## 1. What AllSource gives us (verified against the real SDK)

Source: `@allsource/client@0.22.0`, vendored from
`all-source-os/all-source` → `sdks/typescript` into
`packages/allsource-client` (see §8 for why it is vendored).

AllSource is an append-only event store behind one HTTP front door
(`ALLSOURCE_API_URL`). The tenant is derived from the API key (a tenant-scoped
JWT with `is_api_key: true`, `role: serviceaccount`, `tenant_id`), sent as
`X-API-Key`. There is no per-call tenant argument.

Relevant client surface (exact signatures from the SDK source):

| Method | Purpose |
| --- | --- |
| `ingestEvent({ event_type, entity_id, payload, metadata? })` | Append one event. Returns `{ event_id, timestamp }`. |
| `ingestBatch(events[])` | Append many events. Returns `{ total, ingested, events[] }`. **Batch IS supported** — use it for migration. |
| `queryEvents({ entity_id?, event_type?, limit?, offset?, since?, until? })` | Read events. Returns `{ events, count }`. |
| `queryAndFold(params, folder)` | Query + fold into a state via an `EventFolder<S>` (`apply`/`finalize`). This is how projections are computed client-side. |
| `listProjections()` / `listPrimeProjections()` / `definePrimeProjection()` / `projectNode()` / `nodeFieldProvenance()` | Server-side "Prime" projections with per-field merge policies + provenance. Optional; our app reads via client-side folds. |
| `getHealth()` | Liveness. No auth dependency on tenant data. |

The stored `Event` shape is `{ id, event_type, entity_id, payload, metadata,
timestamp, stream_id?, version?, tenant_id? }`. **The only first-class
addressing dimension for reads is `entity_id`** (plus `event_type`). There is no
server-side secondary index on arbitrary payload fields exposed by the SDK. This
is the single most important constraint for the model below: **the stream key
must be the value you will look a record up by.**

### Modelling implications

- **`entity_id` = the stream id.** One aggregate per `entity_id`. To rebuild an
  aggregate's current state, `queryEvents({ entity_id })` then fold.
- **Natural keys, not UUIDs, are the stream ids** wherever the app looks rows up
  by a natural key (email, wallet, reference, slug). UUID PKs from Supabase are
  preserved inside payloads for traceability but are not the addressing key.
- **Cross-aggregate "list all" queries** (e.g. "all active subscribers") cannot
  be done by `entity_id`. They are served by `queryEvents({ event_type, ... })`
  with a fold that de-duplicates by `entity_id`, or by a Prime projection. See
  §6 for the two tables where this matters.
- **Idempotency:** migration (002) must be re-runnable. Every migrated event
  carries `metadata.idempotency_key`. Re-running 002 should `queryEvents` for
  the stream first and skip events whose `idempotency_key` already exists.
  Idempotency keys are deterministic from the source row (see each table).

### Naming conventions

- `event_type`: dotted, `aggregate.past-tense-verb`, e.g. `subscriber.subscribed`.
- `stream_id` (= `entity_id`): `<aggregate>:<natural-key>`, e.g.
  `subscriber:jane@example.com`. Prefixing keeps streams from different
  aggregates from colliding in a shared key space.
- `metadata` always carries: `{ source: 'supabase-migration' | 'app',
  idempotency_key, supabase_id?, schema_version: 1 }`.

## 2. auth.* decision

**Decision: do NOT migrate the `auth.*` schema. Treat wallet address and the
AllSource service-account key as the real identity. Carry only the
`auth.users.id` value as an opaque attribute where an existing `public.*` row
references it.**

Rationale, backed by the cluster dump
(`db_cluster-04-11-2025@22-40-01.backup.gz`, row counts via `gunzip | awk`):

- `auth.users`: **0 rows.** Every other `auth.*` table (`identities`,
  `sessions`, `refresh_tokens`, `mfa_*`, `sso_*`, `oauth_*`, …): **0 rows.**
  Only `auth.schema_migrations` has rows (67), which is Supabase-internal
  plumbing with no business meaning.
- There is **no identity data to migrate.** Migrating an empty Supabase GoTrue
  schema into an event store would be pure ceremony.
- The only `public.*` rows that reference `auth.users(id)` are
  `admin_users.auth_user_id` and (transitively) `admin_activity_log`. In the
  dump `admin_users` has **1 row**; its `auth_user_id` is preserved verbatim in
  the `admin.registered` event payload as an opaque string. No join target is
  required because the app authorizes admins by **email**, not by the GoTrue
  UUID (`admin_users.email` is `UNIQUE NOT NULL`; the admin lookup key is email).
- Going forward, identity is established by:
  - **Wallet address** for payment/service-access/meeting flows
    (`wallet-action.ts` already authenticates by wallet; `user_profiles` keys on
    `wallet_address UNIQUE`).
  - **Email** for newsletter, plan interest, and admin.
  - **AllSource service-account key** for all server-side writes (the app is the
    only writer; there is no end-user AllSource auth).

Net: `auth.*` is **excluded** from the event model. `auth_user_id` survives as a
payload attribute only.

## 3. Stream-id and idempotency summary

| Aggregate | Stream id (`entity_id`) | Idempotency key strategy |
| --- | --- | --- |
| Newsletter subscriber | `subscriber:<email>` | `sub:<email>:<state>` for lifecycle; per-event natural key otherwise |
| Newsletter issue | `issue:<uuid>` | `issue:<uuid>:<event>` |
| Newsletter event (open/click/…) | `subscriber:<email>` (events also queryable by `issue:<uuid>`) | `nlevent:<supabase_id>` (UUID PK) |
| Newsletter subscription (billing) | `subscriber:<email>` | `subscription:<uuid>:<event>` |
| Payment | `payment:<reference>` (fallback `payment:<uuid>` when reference null) | `payment:<reference|uuid>:<status>` |
| Service access | `service-access:<wallet>:<service_slug>` | `access:<wallet>:<slug>:<event>` |
| Meeting booking | `meeting:<meeting_id>` | `meeting:<meeting_id>:<event>` |
| User profile | `wallet:<wallet_address>` | `profile:<wallet>:<event>` |
| Plan interest | `plan-interest:<email>:<plan_id>` | `planinterest:<email>:<plan_id>` |
| Social post | `social-post:<uuid>` | `social:<uuid>:<event>` |
| Payment config | `payment-config:<config_type>:<config_slug>` | `config:<type>:<slug>:<event>` |
| Admin user | `admin:<email>` | `admin:<email>:<event>` |
| Admin activity log | `admin:<email>` (append-only audit) | `adminlog:<supabase_id>` |

## 4. Per-table event model

Column inventories below were taken from the cluster dump `COPY` lines
(authoritative) and cross-checked against the schema SQL. Every event payload is
JSON; timestamps are ISO-8601 strings.

### 4.1 `newsletter_subscribers` → aggregate `subscriber`

Read shapes used by consumers (`packages/newsletter/src/index.ts`,
`apps/web/src/lib/newsletter.ts`): `getSubscriberByEmail`,
`getActiveSubscribers(tier)`, `getSubscriberCount(tier)`, `subscribeToNewsletter`
(upsert by email), `confirmSubscription`, `unsubscribeFromNewsletter`,
`trackNewsletterEvent` (updates `last_opened_at`).

- **Stream id:** `subscriber:<email>` (email is `UNIQUE`; it is the lookup key).
- **Events:**
  - `subscriber.subscribed` — `{ email, name?, tier, status:'pending', frequency, interests?, utm_source?, utm_medium?, utm_campaign?, subscribed_at }`
  - `subscriber.confirmation-requested` — `{ confirmation_token, confirmation_token_expires_at }`
  - `subscriber.confirmed` — `{ confirmed_at }` (status → active)
  - `subscriber.unsubscribed` — `{ unsubscribed_at }` (status → unsubscribed)
  - `subscriber.bounced` — `{ at }` (status → bounced)
  - `subscriber.tier-changed` — `{ from_tier, to_tier, subscription_expires_at?, stripe_customer_id?, stripe_subscription_id?, solana_wallet_address? }`
  - `subscriber.engagement-updated` — `{ open_rate, click_rate, last_opened_at }`
- **Projection (fold):** start empty; `subscribed` seeds the record;
  `confirmed`/`unsubscribed`/`bounced` set `status` + the matching timestamp;
  `tier-changed` sets `tier` + billing fields; `engagement-updated` sets rates
  and `last_opened_at`. Final state == the `NewsletterSubscriber` interface.
- **List/count by tier:** not an `entity_id` lookup → served by a fold over
  `queryEvents({ event_type })` for the lifecycle types, reduced per
  `entity_id`, then filtered on `status === 'active'` and `tier`. (Candidate for
  a Prime projection in 003 if volume grows; current volume is ~2 rows.)
- **Idempotency:** `sub:<email>:subscribed`, `sub:<email>:confirmed`, etc.
- **Migration mapping:** one row → `subscribed` (+ `confirmation-requested` if a
  token is present) (+ `confirmed` if `confirmed_at`) (+ `unsubscribed` if
  `unsubscribed_at`) (+ `tier-changed` if `tier != 'free'`) (+
  `engagement-updated` if `open_rate`/`click_rate`/`last_opened_at` set).

### 4.2 `newsletter_issues` → aggregate `issue`

Consumers: `createNewsletterIssue` (insert; status `draft`/`scheduled`),
`getNewsletterStats` (count of issues).

- **Stream id:** `issue:<uuid>` (issues have no natural key; UUID PK is fine —
  the app references them by id).
- **Events:**
  - `issue.created` — `{ title, subject, preview_text?, content_html, content_text, tier, blog_post_slug?, scheduled_for?, status }`
  - `issue.scheduled` — `{ scheduled_for }`
  - `issue.sent` — `{ sent_at, recipients_count }`
  - `issue.metrics-updated` — `{ opens_count, clicks_count, unsubscribes_count }`
- **Projection:** fold to the `NewsletterIssue` interface.
- **Idempotency:** `issue:<uuid>:created`, `:sent`, etc.
- **Migration:** `created` always; `sent` if `sent_at`; `metrics-updated` if any
  count > 0.

### 4.3 `newsletter_events` → events on aggregate `subscriber`

Consumers: `trackNewsletterEvent` (insert; on `opened` also bumps subscriber
`last_opened_at`), open-rate analytics keyed by `issue_id`.

- **Stream id:** `subscriber:<email>` (so a subscriber's full timeline,
  including engagement, lives in one stream and folds in 4.1).
- **Event type:** `subscriber.message-event` — `{ issue_id, kind:
  'sent'|'delivered'|'opened'|'clicked'|'bounced'|'complained', link_url?,
  user_agent?, ip_address?, occurred_at }`.
- **Cross-cut by issue:** analytics that count opens per issue use
  `queryEvents({ event_type: 'subscriber.message-event' })` filtered on
  `payload.issue_id`, or a Prime projection keyed by issue. (Volume currently 0
  rows.)
- **Idempotency:** `nlevent:<supabase_id>` (the original `newsletter_events.id`
  UUID — guarantees no double-count on re-run).
- **Note:** the derived `last_opened_at` is NOT stored as a separate fact; it is
  recomputed in the subscriber fold from the latest `opened` message-event,
  which is more correct than the Supabase trigger that overwrote a column.

### 4.4 `newsletter_subscriptions` → events on aggregate `subscriber`

Billing/subscription records (Stripe/Solana) tied to a subscriber.

- **Stream id:** `subscriber:<email>` (resolve `subscriber_id` → email at
  migration time from `newsletter_subscribers`).
- **Events:**
  - `subscriber.subscription-started` — `{ subscription_uuid, provider, provider_subscription_id?, tier, amount, currency, interval, current_period_start, current_period_end }`
  - `subscriber.subscription-renewed` — `{ subscription_uuid, current_period_start, current_period_end }`
  - `subscriber.subscription-cancelled` — `{ subscription_uuid, cancel_at_period_end, cancelled_at }`
  - `subscriber.subscription-status-changed` — `{ subscription_uuid, status: 'active'|'cancelled'|'past_due'|'expired' }`
- **Projection:** folds into a `subscriptions[]` slice of the subscriber state
  (or a standalone `NewsletterSubscription` per `subscription_uuid`).
- **Idempotency:** `subscription:<subscription_uuid>:<event>`.
- **Migration:** 0 rows currently; mapping defined for completeness.

### 4.5 `payments` → aggregate `payment`

Consumers (`apps/web/src/lib/payments/index.ts`, `payment-action.ts`):
`createPayment` (insert pending), `getPayment(id)`, `getPaymentByReference`,
`updatePaymentStatus(id, status, signature?)`, `getUserPayments(wallet)`,
`getPaymentsByEntity(type,id)`, `get_payment_stats` RPC.

- **Stream id:** `payment:<reference>` when `reference` is set (it is `UNIQUE`
  and is the Solana lookup key the verify flow uses); else `payment:<uuid>`.
- **Events:**
  - `payment.initiated` — `{ payment_uuid, user_id?, wallet_address, payment_type, entity_type?, entity_id?, amount, currency, currency_type, chain, network?, reference?, provider, provider_payment_id?, description?, metadata?, created_at, expires_at? }`
  - `payment.confirmed` — `{ signature, confirmed_at }`
  - `payment.failed` — `{ at, reason? }`
  - `payment.refunded` — `{ at, signature? }`
  - `payment.expired` — `{ at }`
- **Projection:** fold to the `Payment` interface; `status` is the last terminal
  event (`confirmed`/`failed`/`refunded`/`expired`) else `pending`.
- **Lookups:** by reference → stream id directly. By id →
  `payment:<uuid>` or carry `payment_uuid` in payload and query by event_type.
  By wallet / by entity → `queryEvents({ event_type: 'payment.initiated' })`
  filtered on `payload.wallet_address` / `payload.entity_*`, then fold each
  matching stream. (Volume 0 rows now; Prime projection candidate for
  high-volume analytics.)
- **Idempotency:** `payment:<reference|uuid>:initiated`, `:confirmed`, …
- **Migration:** `initiated` always; one terminal event matching `status`.

### 4.6 `service_access` → aggregate `service-access`

Consumers: `grantServiceAccess` (upsert on `wallet_address,service_slug`),
`hasServiceAccess(wallet,slug)`, `getUserServiceAccess(wallet)`,
`revokeServiceAccess`.

- **Stream id:** `service-access:<wallet_address>:<service_slug>` (matches the
  `UNIQUE(wallet_address, service_slug)` constraint — one stream per grant).
- **Events:**
  - `service-access.granted` — `{ user_id?, service_slug, service_type, payment_id?, granted_at, expires_at? }`
  - `service-access.revoked` — `{ revoked_at, revoke_reason? }`
  - `service-access.expired` — `{ at }` (derived; emitted lazily or computed in fold)
- **Projection:** fold to `ServiceAccess`; `is_active` = granted and not
  revoked and (`expires_at` null or future). The `hasServiceAccess` check is the
  fold's boolean.
- **Idempotency:** `access:<wallet>:<slug>:granted`, `:revoked`.
- **Migration:** `granted` always; `revoked` if `revoked_at`.

### 4.7 `meeting_bookings` → aggregate `meeting`

Consumers: `createMeetingBooking`, `getMeetingBooking(meetingId)`,
`updateMeetingBooking`, `linkPaymentToMeeting`, `getUserMeetings(wallet)`.

- **Stream id:** `meeting:<meeting_id>` (`meeting_id` is `UNIQUE NOT NULL` and is
  the app's lookup key).
- **Events:**
  - `meeting.booked` — `{ meeting_type, meeting_id, user_id?, wallet_address?, email, name?, scheduled_at, duration_minutes, timezone, requires_payment, payment_amount?, payment_currency?, notes?, conversation_id?, metadata? }`
  - `meeting.payment-linked` — `{ payment_id }`
  - `meeting.confirmed` — `{ confirmed_at, google_calendar_event_id? }`
  - `meeting.cancelled` — `{ cancelled_at }`
  - `meeting.completed` — `{ at }`
  - `meeting.no-show` — `{ at }`
- **Projection:** fold to `MeetingBooking`; `status` from the last lifecycle
  event.
- **Lookup by wallet:** `queryEvents({ event_type: 'meeting.booked' })` filtered
  on `payload.wallet_address`, fold each stream.
- **Idempotency:** `meeting:<meeting_id>:booked`, `:confirmed`, …
- **Migration:** `booked`; `payment-linked` if `payment_id`; one terminal status
  event matching `status`.

### 4.8 `user_profiles` → aggregate `wallet` (user profile)

Consumers: `ensureUserProfile(wallet, chain)` (get-or-create),
`getUserProfile(wallet)`, `updateUserProfile`. Also `wallet-action.ts`
`getCurrentWalletAddress`.

- **Stream id:** `wallet:<wallet_address>` (`wallet_address` is `UNIQUE NOT
  NULL`).
- **Events:**
  - `profile.created` — `{ wallet_address, wallet_chain, email?, name?, preferred_payment_method, created_at }`
  - `profile.updated` — `{ ...changed fields }`
- **Projection:** fold to `UserProfile`. `ensureUserProfile` becomes: fold the
  stream; if empty, emit `profile.created`.
- **Idempotency:** `profile:<wallet>:created`.
- **Migration:** 0 rows now; `created` per row.

### 4.9 `plan_interest` → aggregate `plan-interest`

Schema: `UNIQUE(email, plan_id)`; tracks interest in `premium`/`founding`.

- **Stream id:** `plan-interest:<email>:<plan_id>`.
- **Events:**
  - `plan-interest.registered` — `{ email, plan_id, plan_name, created_at }`
  - `plan-interest.notified` — `{ notified_at }`
- **Projection:** fold to `{ email, plan_id, plan_name, created_at,
  notified_at? }`.
- **Idempotency:** `planinterest:<email>:<plan_id>` (registration is naturally
  unique per the constraint).
- **Migration:** `registered`; `notified` if `notified_at`. 1 row in dump.

### 4.10 `social_posts` → aggregate `social-post`

Automation tracking for LinkedIn/Twitter posts per blog slug.

- **Stream id:** `social-post:<uuid>` (no stable natural key — a slug can have
  many posts across platforms/retries).
- **Events:**
  - `social-post.drafted` — `{ blog_post_slug, platform, content, media_url?, scheduled_for? }`
  - `social-post.scheduled` — `{ scheduled_for }`
  - `social-post.published` — `{ published_at, platform_post_id?, platform_url? }`
  - `social-post.failed` — `{ error_message, retry_count }`
  - `social-post.engagement-updated` — `{ likes_count, comments_count, shares_count }`
- **Projection:** fold to the social-post read shape; `status` from last
  lifecycle event.
- **Query by slug:** `queryEvents({ event_type: 'social-post.drafted' })`
  filtered on `payload.blog_post_slug`.
- **Idempotency:** `social:<uuid>:drafted`, `:published`, …
- **Migration:** 0 rows now.

### 4.11 `payment_config` → aggregate `payment-config`

Reference/config data, not transactional. Consumers: `getPaymentConfigFromDB`,
`syncPaymentConfigToDB` (upsert on `config_type,config_slug`).

- **Stream id:** `payment-config:<config_type>:<config_slug>` (matches
  `UNIQUE(config_type, config_slug)`).
- **Events:**
  - `payment-config.defined` — `{ config_type, config_slug, name, description?, price_sol?, price_usd?, price_btc?, price_eth?, duration_minutes?, benefits?, metadata?, is_active, is_popular }`
  - `payment-config.updated` — `{ ...changed fields }`
  - `payment-config.deactivated` — `{ at }`
- **Projection:** fold to `PaymentConfig`.
- **Idempotency:** `config:<type>:<slug>:defined`.
- **Caveat (see §6):** this is effectively current-state reference data, also
  defined in code (`payment-action.ts`/config). Event-sourcing it is low-value;
  acceptable to model as `defined` + `updated` only, or to keep config in code
  and NOT migrate. 8 rows in dump (the seeded meeting/service/newsletter tiers).
  **Recommendation: keep `payment_config` defined in code** (it already is) and
  treat AllSource events as an optional audit trail, not the source of truth.

### 4.12 `admin_users` → aggregate `admin`

Schema: `email UNIQUE NOT NULL`, `role`, `permissions JSONB`, `is_super_admin`,
`auth_user_id` (→ `auth.users`, see §2).

- **Stream id:** `admin:<email>` (email is the authorization key).
- **Events:**
  - `admin.registered` — `{ email, full_name?, avatar_url?, role, permissions, is_active, is_super_admin, auth_user_id?, created_at }`
  - `admin.role-changed` — `{ role, permissions }`
  - `admin.activated` / `admin.deactivated` — `{ at }`
  - `admin.login-recorded` — `{ last_login_at, login_count }`
- **Projection:** fold to the admin read shape.
- **Idempotency:** `admin:<email>:registered`, `:role-changed`, …
- **Migration:** `registered` per row (1 row). `auth_user_id` carried as opaque
  attribute; no FK rebuilt.

### 4.13 `admin_activity_log` → events on aggregate `admin`

Append-only audit. Originally `admin_user_id` FK → `admin_users`.

- **Stream id:** `admin:<email>` (resolve `admin_user_id` → email at migration
  time). Audit lives alongside the admin it concerns.
- **Event type:** `admin.activity-logged` — `{ action, resource_type?,
  resource_id?, old_data?, new_data?, ip_address?, user_agent?, occurred_at }`.
- **Projection:** these are pure facts; "read" = `queryEvents({ entity_id:
  'admin:<email>', event_type: 'admin.activity-logged' })`, no fold needed.
- **Idempotency:** `adminlog:<supabase_id>`.
- **Migration:** 0 rows now.

## 5. Coverage matrix (all 13 public tables)

| Supabase `public.*` table | Aggregate | Source-of-truth in AllSource? | Dump rows |
| --- | --- | --- | --- |
| `newsletter_subscribers` | `subscriber` | Yes | 2 |
| `newsletter_issues` | `issue` | Yes | 0 |
| `newsletter_events` | `subscriber` (message-event) | Yes | 0 |
| `newsletter_subscriptions` | `subscriber` (subscription-*) | Yes | 0 |
| `payments` | `payment` | Yes | 0 |
| `service_access` | `service-access` | Yes | 0 |
| `meeting_bookings` | `meeting` | Yes | 0 |
| `user_profiles` | `wallet` | Yes | 0 |
| `plan_interest` | `plan-interest` | Yes | 1 |
| `social_posts` | `social-post` | Yes | 0 |
| `payment_config` | `payment-config` | **No — keep in code** (audit only) | 8 |
| `admin_users` | `admin` | Yes | 1 |
| `admin_activity_log` | `admin` (activity-logged) | Yes (append-only) | 0 |

`auth.*` (all 19 tables): **excluded** — see §2. Only `auth.schema_migrations`
(67 rows) and `auth.users` (0 rows) had any presence; neither carries business
data.

**Total: 13/13 public tables covered. 12 event-sourced, 1 (`payment_config`)
explicitly kept in code with optional audit events.**

## 6. Tables that don't fit event sourcing cleanly

- **`payment_config`** — reference/config data with a current-state read pattern
  and an existing code-defined source (`payment-action.ts` seeds + reads). Event
  sourcing adds no value (no meaningful history, no concurrency). **Keep in code;
  optionally emit `payment-config.defined/updated` as an audit trail.**
- **Cross-aggregate list/aggregate reads** (`getActiveSubscribers`,
  `getSubscriberCount`, `get_payment_stats`, payment/meeting analytics views).
  AllSource addresses by `entity_id`; "all rows matching a predicate" is served
  by `queryEvents({ event_type })` + de-dup fold, or by a **Prime projection**
  (`definePrimeProjection` + `projectNode`). At current volumes (single-digit
  rows) the event-query fold is sufficient; 003 should introduce Prime
  projections only if a read path gets hot.
- **Derived columns** Supabase maintained via triggers (`updated_at`,
  `open_rate`, `click_rate`, `last_opened_at`, issue `*_count`) are **not stored
  as facts**; they are recomputed in the projection fold from the underlying
  events, which is strictly more correct.

## 7. Read contract prompts 002/003 must preserve

The fold for each aggregate must reproduce these exact behaviours (today on
Supabase):

- `subscribeToNewsletter`: upsert by email; reject if already `active`/`pending`;
  allow resubscribe if `unsubscribed`. → fold subscriber stream, branch on
  current `status`.
- `confirmSubscription`: token valid + unexpired → status `active`, clear token.
- `getActiveSubscribers(tier)` / `getSubscriberCount(tier)`: status `active`,
  optional tier filter. → event-type query + de-dup fold + filter.
- `createNewsletterIssue`: status `draft` or `scheduled` (if `scheduled_for`).
- `trackNewsletterEvent('opened')`: also surfaces latest `last_opened_at`.
- `createPayment`: pending; `updatePaymentStatus('confirmed', sig)`: set
  signature + `confirmed_at`. Lookup by reference and by id both required.
- `grantServiceAccess`: upsert per `(wallet, slug)`; `hasServiceAccess`: active
  and not expired.
- `ensureUserProfile`: get-or-create by wallet.
- `createMeetingBooking` / `getMeetingBooking(meetingId)` /
  `linkPaymentToMeeting` / `getUserMeetings(wallet)`.

## 8. SDK packaging note (why vendored)

The prompt's install spec
`github:all-source-os/all-source#workspace=@allsource/client` does not resolve:
Bun interprets the `#…` fragment as a git ref/tag, not a workspace selector, so
`codeload.github.com/.../legacy.tar.gz/workspace%3D%40allsource/client` 404s.
`#path:sdks/typescript` 404s the same way (Bun has no subdir-of-monorepo git
install). `@allsource/client` is **not published to npm** (`registry.npmjs.org`
→ 404).

The real SDK is the workspace package `@allsource/client@0.22.0` living at
`sdks/typescript` inside the public monorepo `all-source-os/all-source`. To use
the genuine SDK (not a fabricated client) it is **vendored verbatim** into this
repo as a workspace package:

- `packages/allsource-client/` — the upstream SDK source copied 1:1 (client,
  circuit breaker, retry/backoff, fold helpers, Prime projection methods, error
  types). `name: "@allsource/client"`, version `0.22.0`.
- `packages/database` depends on it via `workspace:*`.

If/when upstream publishes to npm or tags a release, swap the `workspace:*` dep
for the registry/git version and delete `packages/allsource-client`. The import
surface (`import { AllSourceClient } from '@allsource/client'`) stays identical.

## 9. Connectivity status (smoke check)

Ping script: `packages/database/scripts/allsource-ping.ts` (run from `apps/web`
so Bun loads `.env.local`).

- `/health` (or `/api/v1/health`): **✅ 200**, real tenant response —
  `{"status":"healthy","version":"0.21.5","service":"query_service_ex",
  "checks":{"websocket":"healthy","backend":"healthy"},"core_nodes":[{...
  "lag_ms":0}]}`. Client construction + transport + the tenant front door are
  proven working.
- `/api/v1/events/query`, `/api/v1/events`, `/api/v1/events/batch`,
  `/api/v1/projections`, `/api/v1/prime/projections`: **❌ 401
  `{"code":"unauthorized","message":"invalid API key"}`** with the provided
  `ALLSOURCE_API_KEY`, across every `X-API-Key` header-case variant.

The key is well-formed and unexpired: it decodes to
`{ is_api_key:true, role:"serviceaccount", name:"DecebalDobrica Blog",
tenant_id:"decebal-dobrica-at-gmail-com", exp:1812833971 (2027) }` — exactly the
documented service account. It is sent in the correct header. `/health` accepts
it; every authenticated data endpoint rejects it.

**BLOCKER for 002:** the gateway rejects this valid, tenant-scoped key on all
data endpoints. This is a server-side key-state/authorization issue on
`allsource-query.fly.dev` (the deployment's `version` is `0.21.5`), not a client
wiring problem — the SDK, env wiring, and request shape are correct and proven
against `/health`. 002 cannot ingest or read tenant data until the key is
accepted on `/api/v1/events*`. Action needed before 002: re-mint / re-activate
the service-account API key for tenant `decebal-dobrica-at-gmail-com` (dashboard
Settings → API Keys, or `POST /api/v1/auth/api-keys` with an admin token), then
re-run the ping — it must print `✅ Tenant query OK` before migration starts.
