# Social posting setup (LinkedIn + Twitter/X)

`task publish -- <slug>` runs `bun run publish-post`, which calls `postToAllPlatforms()` in
`packages/social`. If you see:

```
❌ LinkedIn: LinkedIn credentials not configured
❌ Twitter: Twitter credentials not configured
```

…it just means the required env vars are missing. They're read from `process.env`, and Bun auto-loads
the repo-root `.env` (already gitignored). Add the variables below to that `.env`. A template lives in
`.env.social.example`.

The exact variables the code expects (from `packages/social/src/twitter.ts` and `linkedin.ts`):

| Platform | Variables |
|---|---|
| Twitter/X | `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET` |
| LinkedIn | `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN` (+ `LINKEDIN_CLIENT_ID`/`LINKEDIN_CLIENT_SECRET` only for token refresh) |

---

## Twitter / X

The code uses `twitter-api-v2` with OAuth 1.0a user context (the four keys above), which is what's
required to post on your behalf.

1. Go to the X developer portal: https://developer.x.com → sign in → create a **Project**, then an
   **App** inside it. (Posting needs at least the Free tier, ~50 posts/day — enough for a weekly issue.)
2. In the App, open **User authentication settings** and set **App permissions = Read and Write**.
   Do this *before* the next step.
3. Under **Keys and tokens**:
   - Copy **API Key** → `TWITTER_API_KEY` and **API Key Secret** → `TWITTER_API_SECRET`.
   - Generate **Access Token and Secret** → `TWITTER_ACCESS_TOKEN` / `TWITTER_ACCESS_SECRET`.
   - ⚠️ If you generated the access token *before* enabling Read+Write, **regenerate** it now, or
     posts will fail with a permissions error.

---

## LinkedIn

The code posts via the UGC Posts API and needs an OAuth 2.0 access token with the `w_member_social`
scope, plus your member URN.

1. Create an app at https://www.linkedin.com/developers/apps (associate it with a Company Page you
   admin — LinkedIn requires this).
2. On the app's **Products** tab, add **"Share on LinkedIn"** (grants `w_member_social`) and
   **"Sign In with LinkedIn using OpenID Connect"** (grants `openid profile`, used to fetch your URN).
3. Mint an access token via the OAuth flow (authorization-code). Quickest path: use the app's
   **Auth → OAuth 2.0 token generator / tools**, select the `w_member_social openid profile` scopes,
   authorize, and copy the resulting token → `LINKEDIN_ACCESS_TOKEN`.
4. Get your member URN: call `GET https://api.linkedin.com/v2/userinfo` with
   `Authorization: Bearer <token>`. Take the `sub` field and set
   `LINKEDIN_PERSON_URN=urn:li:person:<sub>`.
5. Tokens expire in ~60 days (refresh tokens ~365 days). If you want auto-refresh via
   `refreshLinkedInToken()`, also set `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` from the app's
   **Auth** tab.

---

## Verify without spamming subscribers

The publish script has guard flags so you can exercise the full path safely:

```bash
# Dry run — logs intended actions/recipients, sends nothing:
PUBLISH_DRY_RUN=1 task publish -- 2026-06-19-rust-ai-weekly-1

# Or send the newsletter only to yourself while testing:
task publish -- 2026-06-19-rust-ai-weekly-1 --test-recipient=decebal@technical-leaders.com
```

When credentials are present, the `❌ … not configured` lines become real posts. Until then the script
still succeeds for everything else — the social step just no-ops.

> Note: don't run `task publish` for an issue you've already sent to subscribers on Substack — it would
> send a second newsletter. Use it for issues you want delivered through your own newsletter/social path.
