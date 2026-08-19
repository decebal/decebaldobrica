import { PostHog } from 'posthog-node'
import {
  SUPPRESSION_EVENT,
  matchExceptionSuppression,
  normalizeUnknownReason,
  toCapturableError,
} from './exceptions'

/**
 * Server-side PostHog client.
 *
 * Browser instrumentation only ever sees half the picture: a failed Server Action, a throwing
 * route handler or a Server Component render error never reaches `window`. This module is the
 * server half, and it reuses the same suppression rules so both halves stay consistent.
 */

export interface ServerExceptionContext {
  /** Route pattern the error belongs to, e.g. `/blog/[slug]`. */
  route?: string
  method?: string
  /** `App Router` or `Pages Router`. */
  routerKind?: string
  /** `render` | `route` | `action` | `middleware`. */
  routeType?: string
  renderSource?: string
  revalidateReason?: string
  /** Whom to attribute the error to. Defaults to an anonymous, person-less server id. */
  distinctId?: string
  /** Anything else worth keeping: request ids, payload sizes, feature flags. */
  extra?: Record<string, unknown>
}

const ANONYMOUS_SERVER_DISTINCT_ID = 'server'

let client: PostHog | null | undefined

function isDisabled(): boolean {
  return !process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_DISABLED === 'true'
}

/**
 * Shared server client. Returns `null` when analytics are not configured, so callers can stay
 * unconditional. Serverless functions can be frozen at any moment, so events are flushed
 * eagerly rather than batched on a timer.
 */
export function getServerAnalytics(): PostHog | null {
  if (client !== undefined) return client

  if (isDisabled()) {
    client = null
    return client
  }

  client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    // Region matters: an EU project key is rejected by US cloud (app.posthog.com)
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
    before_send: (event) => {
      if (!event || event.event !== '$exception') return event

      const rule = matchExceptionSuppression(event.properties)
      if (!rule) return event

      // Keep the drop visible, same contract as the browser hook.
      client?.capture({
        distinctId: event.distinctId || ANONYMOUS_SERVER_DISTINCT_ID,
        event: SUPPRESSION_EVENT,
        properties: {
          suppression_rule: rule.name,
          suppression_reason: rule.reason,
          capture_source: 'server',
          $process_person_profile: false,
        },
      })

      return null
    },
  })

  return client
}

/** Where the error happened, on which build, in which runtime. */
export function collectServerExceptionContext(
  context: ServerExceptionContext = {}
): Record<string, unknown> {
  return {
    capture_source: 'server',
    route: context.route,
    http_method: context.method,
    router_kind: context.routerKind,
    route_type: context.routeType,
    render_source: context.renderSource,
    revalidate_reason: context.revalidateReason,

    runtime: process.env.NEXT_RUNTIME || 'nodejs',
    node_version: typeof process.version === 'string' ? process.version : undefined,
    app_environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    app_release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID,
    region: process.env.VERCEL_REGION,

    $process_person_profile: Boolean(context.distinctId),
    ...context.extra,
  }
}

/**
 * Capture a server-side exception and wait for it to leave the process.
 *
 * Awaiting matters: a serverless function that returns before the request lands drops the
 * event, which is exactly the case where we most want the error.
 */
export async function captureServerException(
  error: unknown,
  context: ServerExceptionContext = {}
): Promise<void> {
  const posthog = getServerAnalytics()
  if (!posthog) return

  const normalized = normalizeUnknownReason(error)

  // Suppression normally runs in before_send, but non-Error values are wrapped below and would
  // lose the original text, so third-party noise is matched up front too.
  if (matchSuppressionForReason(normalized)) return

  try {
    await posthog.captureExceptionImmediate(
      toCapturableError(error, 'ServerError'),
      context.distinctId || ANONYMOUS_SERVER_DISTINCT_ID,
      {
        ...collectServerExceptionContext(context),
        exception_reason_type: normalized.type,
        exception_reason_raw: normalized.raw,
      }
    )
  } catch (captureError) {
    // Never let error reporting become the error.
    console.error('Failed to report exception to PostHog:', captureError)
  }
}

function matchSuppressionForReason(normalized: {
  type: string
  message: string
  stack?: string
}): boolean {
  return (
    matchExceptionSuppression({
      $exception_type: normalized.type,
      $exception_message: normalized.message,
      $exception_stack_trace_raw: normalized.stack,
    }) !== null
  )
}

/**
 * Flush pending events without tearing the client down.
 *
 * Serverless handlers must await this before returning: the platform can freeze the process
 * the moment the response is sent. Never call `shutdown()` per request - the client is a
 * module singleton and a shutdown one silently drops every later event.
 */
export async function flushServerAnalytics(): Promise<void> {
  if (!client) return
  try {
    await client.flush()
  } catch (error) {
    console.error('Failed to flush analytics:', error)
  }
}

/** Flush and tear down. Call before a long-lived process exits. */
export async function shutdownServerAnalytics(): Promise<void> {
  if (!client) return
  await client.shutdown()
  client = undefined
}
