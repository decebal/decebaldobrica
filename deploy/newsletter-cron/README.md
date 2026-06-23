# Newsletter autopilot (Fly cron)

Sends the newsletter **off your laptop**, on a schedule, with the correct
production URL — fixing the bug where running `task publish` locally shipped
`http://localhost:3000/blog/...` links to real subscribers.

## What it is

A tiny [supercronic](https://github.com/aptible/supercronic) worker on Fly. On
each tick it runs `bun run publish-due` (`apps/web/scripts/publish-due-posts.ts`),
which:

1. Loads every post in `apps/web/content/blog`.
2. Keeps the ones that are `published` **and** dated within the last
   `PUBLISH_LOOKBACK_DAYS` (default **7**).
3. Skips any already sent — `wasIssueSentForSlug` checks the AllSource
   `issue.created` / `issue.sent` events, so **re-runs never double-send**.
4. Sends the rest as branded newsletter issues, then posts to LinkedIn / Twitter.

Two rails make a runaway blast impossible:

- **Lookback window** — the first run can't fire the whole 39-post archive; only
  recently-dated posts are eligible.
- **`assertProductionBaseUrl`** — the send path *refuses* to email localhost
  links to real subscribers. Because `[env].NEXT_PUBLIC_APP_URL` is
  `https://decebaldobrica.com` and `.dockerignore` keeps every `.env*` file out
  of the image, the URL is always production here.

## Scheduling model

- **Self-contained**: the repo (incl. blog content) is baked into the image.
  Publishing a **new** post means **re-deploy** so its `.mdx` ships:
  `git push` → `fly deploy` (or wire it into CI).
- **Schedule** lives in [`crontab`](./crontab) — default **Mondays 14:00 UTC**.
- **Future-dating a post schedules it**: a post dated in the future is skipped
  until its date enters the window.
- **Opt a post out**: add `newsletter: false` to its frontmatter and the
  autopilot never sends it — for posts that shouldn't go to the list at all. (The
  manual `publish-post --slug=…` path ignores this flag; it sends what you ask.)

## First-time setup

Prereqs: `flyctl` installed and logged in (`fly auth login`).

### 1. Create the app

```bash
fly apps create decebal-newsletter-cron
```

### 2. Set secrets

Non-secret config (`NEXT_PUBLIC_APP_URL`, `PUBLISH_LOOKBACK_DAYS`, `TZ`) is in
`fly.toml`. The rest are secrets:

```bash
fly secrets set --config deploy/newsletter-cron/fly.toml \
  RESEND_API_KEY=...           \
  EMAIL_FROM='Decebal Dobrica <newsletter@decebaldobrica.com>' \
  EMAIL_REPLY_TO='you@decebaldobrica.com' \
  ALLSOURCE_API_URL=https://allsource-query.fly.dev \
  ALLSOURCE_API_KEY=...        \
  ALLSOURCE_TENANT_ID=...      \
  LINKEDIN_ACCESS_TOKEN=...    \
  LINKEDIN_CLIENT_ID=...       \
  LINKEDIN_CLIENT_SECRET=...   \
  LINKEDIN_PERSON_URN=...      \
  TWITTER_API_KEY=...          \
  TWITTER_API_SECRET=...       \
  TWITTER_ACCESS_TOKEN=...     \
  TWITTER_ACCESS_SECRET=...
```

Required: `RESEND_API_KEY`, `EMAIL_FROM`, `ALLSOURCE_API_URL`, `ALLSOURCE_API_KEY`,
`ALLSOURCE_TENANT_ID`. Social vars are optional — without them the newsletter
still sends and the social step just reports failures.

**Shortcut** — import from your existing env file (filters out a localhost URL
and the cron's own config so they don't clobber `fly.toml`):

```bash
grep -vE '^\s*(#|NEXT_PUBLIC_APP_URL|PUBLISH_|TZ=)' apps/web/.env \
  | fly secrets import --config deploy/newsletter-cron/fly.toml
```

### 3. Deploy (from the repo root)

```bash
fly deploy --config deploy/newsletter-cron/fly.toml .
fly scale count 1 --config deploy/newsletter-cron/fly.toml
```

## Verify before trusting it

**Dry run inside the deployed machine** — full path (load → dedupe → resolve
subscribers) but sends nothing:

```bash
fly ssh console --config deploy/newsletter-cron/fly.toml \
  -C "/bin/sh -c 'cd /app/apps/web && PUBLISH_DRY_RUN=1 bun run publish-due'"
```

It prints the candidate posts and which are skipped as already-sent. Or send a
single real email to yourself instead of the list:

```bash
fly ssh console --config deploy/newsletter-cron/fly.toml \
  -C "/bin/sh -c 'cd /app/apps/web && PUBLISH_TEST_RECIPIENT=you@example.com bun run publish-due'"
```

Locally (uses your laptop env, where `NEXT_PUBLIC_APP_URL` may be localhost — the
dry-run guard allows it but warns):

```bash
PUBLISH_DRY_RUN=1 bun run --cwd apps/web publish-due
```

## Operate

```bash
fly logs   --config deploy/newsletter-cron/fly.toml   # watch ticks + send output
fly status --config deploy/newsletter-cron/fly.toml
```

- **Change the schedule**: edit [`crontab`](./crontab), redeploy.
- **Backfill a wider window once**: set a bigger `PUBLISH_LOOKBACK_DAYS` for one
  run via `fly ssh console` (the dedupe still prevents resends).
- **Pause it**: `fly scale count 0 …`. Resume: `fly scale count 1 …`.

## Env reference

| Var | Where | Purpose |
|-----|-------|---------|
| `NEXT_PUBLIC_APP_URL` | `fly.toml` | Canonical site URL — never localhost here. |
| `PUBLISH_LOOKBACK_DAYS` | `fly.toml` | Due-scan window (days, default 7). |
| `PUBLISH_DRY_RUN` | ad-hoc | `1` = log only, send nothing. |
| `PUBLISH_TEST_RECIPIENT` | ad-hoc | Send only to this address. |
| `PUBLISH_ALLOW_LOCALHOST` | ad-hoc | Escape hatch to permit localhost links (local testing only). |
| `RESEND_API_KEY`, `EMAIL_*` | secret | Email delivery. |
| `ALLSOURCE_API_*`, `ALLSOURCE_TENANT_ID` | secret | Subscribers + issue dedupe. |
| `LINKEDIN_*`, `TWITTER_*` | secret | Social posting (optional). |
