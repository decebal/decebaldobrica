# WolvenTech Fly.io Deployment

WolvenTech runs as standalone Next.js app `wolventech-web` in Fly.io personal
organization. Public canonical origin is `https://wolventech.com`; `www` returns
permanent redirect to apex.

## Deploy

Run from repository root:

```bash
flyctl deploy . --config apps/wolventech/fly.toml --remote-only --ha=false
```

Runtime health endpoint:

```bash
curl -fsS https://wolventech-web.fly.dev/api/healthz
flyctl checks list --app wolventech-web
```

## Runtime configuration

Public build configuration:

- `NEXT_PUBLIC_APP_URL=https://wolventech.com`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` when Turnstile is enabled

Booking flow requires these Fly secrets/config values:

- `RESEND_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_REDIRECT_URI`
- `CALENDAR_OWNER_EMAIL`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `TURNSTILE_SECRET_KEY` when Turnstile is enabled

Never copy `.env` files into container images. Root `.dockerignore` excludes all
local environment files.

## DNS and TLS

Unstoppable Domains nameservers remain authoritative. Configure:

| Name | Type | Value |
|---|---|---|
| `@` | A | `66.241.124.93` |
| `@` | AAAA | `2a09:8280:1::180:3c17:0` |
| `www` | A | `66.241.124.93` |
| `www` | AAAA | `2a09:8280:1::180:3c17:0` |

Fly certificates:

```bash
flyctl certs check wolventech.com --app wolventech-web
flyctl certs check www.wolventech.com --app wolventech-web
```

Detach `wolventech.com` and `www.wolventech.com` from Vercel project
`decebaldobrica-wolventech` after Fly verification. Keep project undeleted for
one release cycle as rollback source.

## Production verification

```bash
curl -fsS https://wolventech.com/api/healthz
curl -fsS https://wolventech.com/sitemap.xml >/dev/null
curl -fsS https://wolventech.com/robots.txt >/dev/null
curl -fsSI https://www.wolventech.com/
```

Expected `www` response is permanent redirect to `https://wolventech.com/`.
