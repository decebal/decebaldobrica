import { expect, test } from '@playwright/test'

/**
 * Guards the exception pipeline against regressions.
 *
 * The failure this protects against is silent in both directions: a broken filter floods error
 * tracking with injected-script noise, and an over-eager one hides real bugs. Both only show up
 * in PostHog days later, so they are asserted here against the real bundle.
 */

const OUTLOOK_REJECTION = 'Object Not Found Matching Id:3, MethodName:update, ParamCount:4'

type PostHogWindow = Window & {
  posthog?: {
    __loaded?: boolean
    config?: Record<string, unknown>
  }
  __posthogSuppressions?: () => Record<string, number>
}

/** PostHog is optional in local envs - skip rather than fail when it is not configured. */
async function requirePostHog(page: import('@playwright/test').Page) {
  const loaded = await page
    .waitForFunction(() => Boolean((window as PostHogWindow).posthog?.__loaded), null, {
      timeout: 15_000,
    })
    .then(
      () => true,
      () => false
    )

  test.skip(!loaded, 'PostHog is not configured in this environment (NEXT_PUBLIC_POSTHOG_KEY)')
}

test.describe('exception tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Stub ingestion only, so no test data reaches the real project while posthog-js can still
    // download the exception-autocapture bundle it needs to do its job
    await page.route(/posthog\.com\/(?:i\/v0\/e|e|batch|s)\/?(?:\?|$)/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"status":1}' })
    )

    await page.goto('/')
    await requirePostHog(page)

    // PostHog classifies headless browsers as bots and drops their events before `before_send`
    // ever runs, which would make every assertion below vacuously pass.
    await page.evaluate(() =>
      (
        window as PostHogWindow & { posthog?: { set_config?: (c: object) => void } }
      ).posthog?.set_config?.({ opt_out_useragent_filter: true })
    )
  })

  test('asks posthog-js to capture exceptions natively', async ({ page }) => {
    const captureExceptions = await page.evaluate(
      () => (window as PostHogWindow).posthog?.config?.capture_exceptions
    )

    expect(captureExceptions).toBeTruthy()
  })

  test('reports one incident once, even though two capture paths are armed', async ({ page }) => {
    const duplicates = await page.evaluate(async () => {
      const win = window as PostHogWindow
      const before = win.__posthogSuppressions?.()['duplicate-exception'] ?? 0
      const reason = new Error('e2e duplicate canary')

      for (let i = 0; i < 2; i++) {
        const promise = Promise.reject(reason)
        promise.catch(() => undefined)
        window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', { promise, reason }))
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      return (win.__posthogSuppressions?.()['duplicate-exception'] ?? 0) - before
    })

    expect(duplicates).toBeGreaterThan(0)
  })

  test('drops injected third-party noise before it leaves the browser', async ({ page }) => {
    const suppressed = await page.evaluate(async (reason) => {
      const win = window as PostHogWindow
      const before = win.__posthogSuppressions?.()['outlook-safelinks'] ?? 0

      // Exactly what the Outlook SafeLinks scanner does to the page
      const promise = Promise.reject(reason)
      promise.catch(() => undefined)
      window.dispatchEvent(
        new PromiseRejectionEvent('unhandledrejection', { promise, reason, cancelable: true })
      )

      await new Promise((resolve) => setTimeout(resolve, 500))
      return (win.__posthogSuppressions?.()['outlook-safelinks'] ?? 0) - before
    }, OUTLOOK_REJECTION)

    expect(suppressed).toBeGreaterThan(0)
  })

  test('keeps real application exceptions and enriches them', async ({ page }) => {
    const result = await page.evaluate(() => {
      const win = window as PostHogWindow
      const beforeSend = win.posthog?.config?.before_send
      const hooks = Array.isArray(beforeSend) ? beforeSend : beforeSend ? [beforeSend] : []

      const event = {
        uuid: 'e2e',
        event: '$exception',
        properties: {
          $exception_list: [
            {
              type: 'TypeError',
              value: "Cannot read properties of undefined (reading 'slug')",
              stacktrace: { frames: [{ filename: `${location.origin}/_next/static/chunk.js` }] },
            },
          ],
        },
      }

      const sent = hooks.reduce<typeof event | null>(
        (current, hook) =>
          current ? (hook as (e: unknown) => typeof event | null)(current) : null,
        event
      )

      return {
        hookCount: hooks.length,
        kept: sent !== null,
        hasUserAgent: Boolean(sent?.properties && 'user_agent' in sent.properties),
        hasRelease: Boolean(sent?.properties && 'app_environment' in sent.properties),
      }
    })

    expect(result.hookCount).toBeGreaterThan(0)
    expect(result.kept).toBe(true)
    expect(result.hasUserAgent).toBe(true)
    expect(result.hasRelease).toBe(true)
  })
})
