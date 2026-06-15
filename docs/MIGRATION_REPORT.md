# Supabase → AllSource Migration Report

Migration of the dead Supabase project's data into the AllSource tenant
`decebal-dobrica-at-gmail-com` (front door `https://allsource-query.fly.dev`,
gateway `0.22.0`), per `docs/ALLSOURCE_EVENT_MODEL.md`.

- Orchestrator: `packages/database/scripts/migrate-supabase-to-allsource.ts`
- Per-domain modules: `packages/database/scripts/migrate/`
- Source dump (read-only): `db_cluster-04-11-2025@22-40-01.backup.gz`
  (gzipped `pg_dumpall` plaintext; read via `gunzip -c`, never decompressed to
  disk or mutated).
- Run from `apps/web` so Bun loads `.env.local`.

---

## DRY-RUN section (this run)

Command:

```bash
cd apps/web && bun ../../packages/database/scripts/migrate-supabase-to-allsource.ts
```

Default mode is **dry-run** — it transforms and validates every row and reports
what *would* be written. No data is written without the explicit `--commit`
flag. The run below completed successfully with no writes.

### Pre-migration inventory (baseline truth — dump row counts)

| `public.*` table | Dump rows |
| --- | ---: |
| `admin_users` | 1 |
| `admin_activity_log` | 0 |
| `meeting_bookings` | 0 |
| `newsletter_subscribers` | 2 |
| `newsletter_issues` | 0 |
| `newsletter_events` | 0 |
| `newsletter_subscriptions` | 0 |
| `payment_config` | 8 |
| `payments` | 0 |
| `plan_interest` | 1 |
| `service_access` | 0 |
| `social_posts` | 0 |
| `user_profiles` | 0 |
| **Total** | **12** |

`auth.*` (all 19 tables) is **excluded** — `auth.users` has 0 rows; identity is
wallet + email + service-key. `admin_users.auth_user_id` is carried as an opaque
payload attribute only (settled decision, event model §2).

### Transform: source rows → projected events (what WOULD be written)

| Table | Source rows | Events | Event-type breakdown |
| --- | ---: | ---: | --- |
| `admin_users` | 1 | 1 | `admin.registered`×1 |
| `admin_activity_log` | 0 | 0 | — |
| `newsletter_subscribers` | 2 | 4 | `subscriber.subscribed`×2, `subscriber.confirmed`×1, `subscriber.confirmation-requested`×1 |
| `newsletter_issues` | 0 | 0 | — |
| `newsletter_events` | 0 | 0 | — |
| `newsletter_subscriptions` | 0 | 0 | — |
| `user_profiles` | 0 | 0 | — |
| `payments` | 0 | 0 | — |
| `service_access` | 0 | 0 | — |
| `meeting_bookings` | 0 | 0 | — |
| `plan_interest` | 1 | 1 | `plan-interest.registered`×1 |
| `social_posts` | 0 | 0 | — |
| `payment_config` | 8 | 8 | `payment-config.defined`×8 (audit-only) |
| **Total** | **12** | **14** | |

### Fan-out explained (1 row → N events)

Only `newsletter_subscribers` fans out. Each subscriber row emits
`subscriber.subscribed` always, plus one lifecycle event per populated column:

- Row `decebal1988@gmail.com` (status `active`, `confirmed_at` set, no token) →
  `subscriber.subscribed` + `subscriber.confirmed` = **2 events**.
- Row `decebal.dobrica@gmail.com` (status `pending`, `confirmation_token` set,
  no `confirmed_at`) → `subscriber.subscribed` +
  `subscriber.confirmation-requested` = **2 events**.
- Total 4. Both rows are `free` tier with `open_rate`/`click_rate` = 0 and no
  `last_opened_at`, so no `tier-changed` or `engagement-updated` events fire.

Every other non-empty table is a straight 1 row → 1 creation event in this dump
(no terminal/secondary columns populated): `admin_users`, `plan_interest`, and
the 8 `payment_config` rows. Their transforms *do* support fan-out (e.g.
`admin.activated`, `plan-interest.notified`, terminal payment/meeting events) —
those branches simply don't trigger because the columns are null in this dump.

### Stream-id + idempotency-key examples (deterministic, re-run-safe)

| Aggregate | Example stream id (`entity_id`) | Example idempotency key |
| --- | --- | --- |
| `admin` | `admin:decebal.dobrica@gmail.com` | `admin:decebal.dobrica@gmail.com:registered` |
| `subscriber` | `subscriber:decebal1988@gmail.com` | `sub:decebal1988@gmail.com:subscribed` |
| `subscriber` | `subscriber:decebal.dobrica@gmail.com` | `sub:decebal.dobrica@gmail.com:confirmation-requested` |
| `plan-interest` | `plan-interest:decebal1988@gmail.com:premium` | `planinterest:decebal1988@gmail.com:premium` |
| `payment-config` | `payment-config:meeting_type:quick-chat-15min` | `config:meeting_type:quick-chat-15min:defined` |

**Dedupe strategy:** every event carries `metadata.idempotency_key`, derived
deterministically from the source row's natural identity (email, plan id,
config type+slug, payment reference, wallet, UUID PK). On `--commit`, the
orchestrator `queryEvents({ entity_id })` for each target stream first, collects
the idempotency keys already present, and writes only events whose key is
absent. Re-runs therefore never duplicate and any stream left unfinished by a
partial run is completed on the next run.

**Timestamps:** original Postgres timestamps (`subscribed_at`, `confirmed_at`,
`created_at`, …) are preserved as event payload time, normalized to ISO-8601.
The migration never stamps "now".

### Connectivity

Verified before the run via `packages/database/scripts/allsource-ping.ts`:
`/health` 200 (gateway `0.22.0`) and an authenticated `queryEvents` succeeded
(the gateway 0.22.0 auth fix is live; the key in `apps/web/.env.local`
authenticates to data endpoints). The dry-run itself performs **no** network
writes.

---

## COMMIT section — completed 2026-06-15

Command run from `apps/web` (env loaded from `.env.local`):

```bash
bun ../../packages/database/scripts/migrate-supabase-to-allsource.ts --commit
```

### Bug found and fixed during commit
The first `--commit` pass wrote 3 events then failed 11 streams with **HTTP 422**.
Root cause was ours, not the gateway: AllSource enforces `event_type` to be
lowercase with **dots/underscores only — no hyphens** (`namespace.entity.action`;
hyphens → 422). Several transforms emitted hyphenated types
(`subscriber.confirmation-requested`, `plan-interest.registered`,
`payment-config.defined`, …). All event_type identifiers were corrected to
underscores across the migrate modules and `docs/ALLSOURCE_EVENT_MODEL.md`
(stream/entity ids keep their legal hyphens). The fix is idempotency-safe — the
3 already-written events used valid types and were skipped on re-run.

### Final totals
- Pass 1: 3 written, 11 failed (pre-fix).
- Pass 2 (post-fix): 10 written, 4 skipped, 0 failed.
- Pass 3 (idempotency proof): **0 written, 14 skipped, 0 failed.**
- **Net: 14/14 events committed to tenant `decebal-dobrica-at-gmail-com`.**

### Parity — live read-back through the SDK
`queryEvents({ entity_id })` per migrated stream returns exactly the expected
events with valid types:

| Stream | Events |
|--------|--------|
| `admin:decebal.dobrica@gmail.com` | `admin.registered` |
| `subscriber:decebal1988@gmail.com` | `subscriber.subscribed`, `subscriber.confirmed` |
| `subscriber:decebal.dobrica@gmail.com` | `subscriber.subscribed`, `subscriber.confirmation_requested` |
| `plan-interest:decebal1988@gmail.com:premium` | `plan_interest.registered` |
| `payment-config:*` (8 configs) | `payment_config.defined` ×8 |

Source rows = 12 → events = 14 (2-subscriber fan-out: active→subscribed+confirmed,
pending→subscribed+confirmation_requested). 9 empty tables contributed 0, as expected.

### Idempotency proof
A second `--commit` immediately after wrote **0** events (all 14 skipped) — the
query-then-skip dedupe on `metadata.idempotency_key` holds. Migration is
safe to re-run.
