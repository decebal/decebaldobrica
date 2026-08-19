# Observability: error tracking

How errors reach PostHog, how noise is kept out without going blind, and how to verify the
whole thing still works.

## What is instrumented

| Where errors happen | What captures them | Source |
| --- | --- | --- |
| Browser: unhandled errors + promise rejections | posthog-js native autocapture (`capture_exceptions`) | `apps/web/src/app/providers.tsx` |
| Browser: errors below the root layout | `PostHogErrorBoundary` | `packages/analytics/src/components/PostHogErrorBoundary.tsx` |
| Browser: errors in the root layout or providers | `app/global-error.tsx` | `apps/web/src/app/global-error.tsx` |
| Browser: fallback when native capture is off | `PostHogErrorHandler` | `packages/analytics/src/components/PostHogErrorHandler.tsx` |
| Server: RSC render, Server Actions, route handlers, middleware | `onRequestError` | `apps/web/src/instrumentation.ts` |
| Server: explicit capture in a handler | `captureServerException()` | `packages/analytics/src/server.ts` |

Every path funnels through the same suppression rules and context builder in
`packages/analytics/src/exceptions.ts`.

### No duplicates, no blind spot

posthog-js autocapture and `PostHogErrorHandler` both listen for `error` and
`unhandledrejection`. Standing one of them down would be simpler, but posthog-js loads its
exception-autocapture bundle from its asset host, and ad blockers and strict CSPs routinely
block it - which switches error tracking off silently for a share of real users. So both paths
stay armed, and duplicates are collapsed in `before_send`: identical exceptions inside
`DEDUPE_WINDOW_MS` (2s) count as one incident. The dedupe key normalizes the wording difference
between the two paths (`Non-Error promise rejection captured with value: x` vs `x`).

Collapsed duplicates are reported like any other drop, under the `duplicate-exception` rule.
A sudden climb there means one path started reporting something the other does not - worth a
look, not an outage.

`before_send` is also the **only** place that drops noise. Individual capture paths deliberately
do not pre-filter: a drop that happens before `before_send` is a drop nobody can count.

### Context attached to every exception

Where (`$current_url`, path, search, hash, title, referrer, visibility), on what (user agent,
language, viewport, screen, DPR, device memory, cores), over what (online, connection type,
downlink, RTT, save-data), and against which build (`app_environment`, `app_release`,
`time_on_page_ms`). Server exceptions add route, method, router kind, route type, render source,
revalidate reason, runtime, region, deployment id and correlation headers (`x-vercel-id`,
`x-request-id`).

Non-`Error` rejections are normalized before capture: circular objects, `Response`, DOM events
and primitives all produce a readable message, and the original value is kept as the error
`cause` plus `exception_reason_raw`.

## Suppression: filtering noise without going blind

Scripts injected into the page by link scanners and browser extensions throw errors we cannot
fix. They are dropped in `before_send`, which is the only place that catches native autocapture
too. Current rules live in `SUPPRESSION_RULES` (`packages/analytics/src/exceptions.ts`), each
with a stable `name` and a `reason` explaining why it is not our bug.

Dropping is **not** silent:

- Every drop increments a per-rule counter for the page load.
- The first drop per rule, and then each power of ten (1, 10, 100, …), emits a
  `client_exception_suppressed` event carrying `suppression_rule`, `suppressed_count` and a
  truncated `exception_message`.
- `__posthogSuppressions()` in the browser console returns the live counts for the page.

So the noise volume stays measurable in PostHog while staying out of error tracking. If a
suppression rule starts eating real errors, `client_exception_suppressed` volume climbs and the
truncated messages show what is being eaten.

### Adding a rule

1. Add an entry to `SUPPRESSION_RULES` with a kebab-case `name` and a `reason` that says whose
   code it is.
2. Add a test to `packages/analytics/tests/exceptions.test.ts` - both that the noise is dropped
   and that a similar-looking real error is not.
3. Run `task pkg:analytics:test`.

Prefer a `message` rule for a known string, a `source` rule when the giveaway is the script
origin.

## Verifying it works

```bash
task pkg:analytics:test                       # suppression rules, normalization, before_send
bun run --cwd apps/web test:e2e error-tracking # live bundle: native capture on, noise dropped
```

The e2e spec asserts against the real page: that native capture is configured, that dispatching
the same incident twice reports it once, that a dispatched Outlook SafeLinks rejection increments
the suppression counter, and that a real application exception survives `before_send` with
enrichment attached.

Two things to know when writing more of these:

- PostHog classifies headless browsers as bots and drops their events **before** `before_send`
  runs, so the spec calls `posthog.set_config({ opt_out_useragent_filter: true })` first.
  Without it the assertions pass vacuously.
- `task test:install` is needed once for the Firefox and WebKit projects.

Manual check in any environment - paste into the console:

```js
const reason = 'Object Not Found Matching Id:3, MethodName:update, ParamCount:4'
const p = Promise.reject(reason); p.catch(() => {})
window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', { promise: p, reason }))
__posthogSuppressions()   // -> { 'outlook-safelinks': 1 }
```

## Readable stack traces

Production bundles are minified, so frames arrive as `chunk-4f2a.js:1:98213`. To symbolicate:

```bash
UPLOAD_SOURCEMAPS=true task build         # emits browser source maps
bunx @posthog/cli sourcemap inject --directory apps/web/.next
bunx @posthog/cli sourcemap upload --directory apps/web/.next
```

`productionBrowserSourceMaps` stays off by default because it publishes the maps with the
bundle; the inject/upload flow gives PostHog the maps without serving them publicly. Requires
`POSTHOG_CLI_TOKEN` (personal API key) and `POSTHOG_CLI_ENV_ID`.

## Region matters

`NEXT_PUBLIC_POSTHOG_HOST` must match the region the project lives in. This project is on **EU
cloud**, so every fallback in the code is `https://eu.i.posthog.com`.

`https://app.posthog.com` routes to US cloud: an EU project key sent there gets a
`401 authentication_error` on every request and all analytics are silently lost. If PostHog shows
no data from an environment, check this first - the browser console prints the 401. Confirm a
key's region with:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://eu.i.posthog.com/flags/?v=2 \
  -H 'Content-Type: application/json' -d '{"api_key":"phc_...","distinct_id":"host-check"}'
```

## PostHog project settings worth having

- **Alert** on `client_exception_suppressed` volume - a spike means either a new crawler or a
  rule that started matching real errors.
- **Alert** on `$exception` volume per release, so a bad deploy is visible before users report.
- Error tracking **suppression rules** in the PostHog UI are the server-side equivalent of
  `SUPPRESSION_RULES`; keep new rules in code so they are versioned, tested and apply before the
  event leaves the browser.

## Server client lifecycle

`getServerAnalytics()` returns a module singleton configured with `flushAt: 1`. Handlers must
`await flushServerAnalytics()` before returning - a serverless function can be frozen the moment
the response is sent. Never call `shutdown()` per request: it tears down the shared client and
every later request on that warm instance silently loses analytics.
