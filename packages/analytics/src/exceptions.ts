import type { BeforeSendFn, Properties } from 'posthog-js'

/**
 * Shared exception plumbing for PostHog error tracking.
 *
 * Three client paths emit `$exception` events (posthog-js native autocapture,
 * `PostHogErrorHandler`, `PostHogErrorBoundary`) and one server path does (`instrumentation.ts`
 * via `@decebal/analytics/server`). This module gives all of them one suppression list, one
 * context builder and one normalizer, so that:
 *
 * 1. Errors thrown by scripts injected into the page (link scanners, browser extensions,
 *    cross-origin scripts) never become issues we cannot act on.
 * 2. Suppression stays visible: every drop is counted and reported as its own low-volume event,
 *    so a filter that starts eating real errors shows up instead of hiding.
 * 3. Everything that does get reported arrives with enough detail to reproduce it.
 */

const MAX_SERIALIZED_LENGTH = 2000
const MAX_SUPPRESSION_MESSAGE_LENGTH = 200

/** Event name used to report suppressed exceptions. Kept out of error tracking on purpose. */
export const SUPPRESSION_EVENT = 'client_exception_suppressed'

export interface SuppressionRule {
  /** Stable, low-cardinality id. Used as the `suppression_rule` property in PostHog. */
  name: string
  /** What the pattern is matched against. */
  target: 'message' | 'source'
  pattern: RegExp
  /** Why this is not our bug. Documentation for whoever reads the list next. */
  reason: string
}

/**
 * Exceptions raised by code that is not part of this app and that we cannot fix.
 *
 * Adding a rule is a deliberate act: every drop is still counted and reported under
 * `SUPPRESSION_EVENT`, so volume stays observable in PostHog.
 */
export const SUPPRESSION_RULES: SuppressionRule[] = [
  {
    name: 'outlook-safelinks',
    target: 'message',
    // "Object Not Found Matching Id:3, MethodName:update, ParamCount:4"
    pattern: /Object Not Found Matching Id:\s*\d+/i,
    reason:
      'Microsoft Outlook / Office 365 SafeLinks scanner renders the page in an embedded webview and injects a script that calls a host bridge only present inside Outlook. Rejects with a bare string, no app frames.',
  },
  {
    name: 'resize-observer-loop',
    target: 'message',
    pattern: /ResizeObserver loop (?:limit exceeded|completed with undelivered notifications)/i,
    reason: 'Browser tells us a ResizeObserver callback needs another frame. Benign by spec.',
  },
  {
    name: 'cross-origin-script-error',
    target: 'message',
    pattern: /^Script error\.?$/i,
    reason: 'Cross-origin script without CORS headers - the browser strips every useful detail.',
  },
  {
    name: 'wallet-extension-conflict',
    target: 'message',
    pattern: /Cannot redefine property: (?:ethereum|solana|phantom|solflare)/i,
    reason: 'Two wallet extensions fighting over the same window global.',
  },
  {
    name: 'extension-context-invalidated',
    target: 'message',
    pattern: /Extension context invalidated/i,
    reason: 'Extension content script outliving the page it was injected into.',
  },
  {
    name: 'browser-extension-source',
    target: 'source',
    pattern: /(?:chrome|moz|safari-web|safari|ms-browser)-extension:\/\//i,
    reason: 'Stack frame belongs to a browser extension bundle, not ours.',
  },
  {
    name: 'browser-internal-source',
    target: 'source',
    pattern: /^(?:chrome|resource):\/\/|extensions::|webkit-masked-url:/i,
    reason: 'Stack frame belongs to browser internals, not ours.',
  },
]

export interface NormalizedReason {
  /** Best available error name, e.g. `TypeError` or `UnhandledRejection`. */
  type: string
  /** Human readable message, always non-empty. */
  message: string
  /** Stack trace when the rejection value carried one. */
  stack?: string
  /** Serialized original value, kept for non-Error rejections. */
  raw?: string
}

function truncate(value: string, max = MAX_SERIALIZED_LENGTH): string {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

/** `String(value)` that cannot throw (null-prototype objects, hostile toString, symbols). */
function stringifyLoose(value: unknown): string {
  try {
    return String(value)
  } catch {
    return Object.prototype.toString.call(value)
  }
}

/** JSON serialization that survives circular references, bigints, functions and errors. */
function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>()

  try {
    const json = JSON.stringify(value, (_key, val) => {
      if (typeof val === 'bigint') return `${val}n`
      if (typeof val === 'function') return `[Function ${val.name || 'anonymous'}]`
      if (val instanceof Error) return { name: val.name, message: val.message, stack: val.stack }
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]'
        seen.add(val)
      }
      return val
    })

    return truncate(json ?? stringifyLoose(value))
  } catch {
    return truncate(stringifyLoose(value))
  }
}

/**
 * Find the suppression rule an exception matches, if any.
 */
export function matchSuppressionRule(input: {
  message?: string | null
  source?: string | null
  stack?: string | null
}): SuppressionRule | null {
  const message = input.message ?? ''
  const origins = [input.source, input.stack].filter((value): value is string => Boolean(value))

  for (const rule of SUPPRESSION_RULES) {
    if (rule.target === 'message') {
      if (message && rule.pattern.test(message)) return rule
    } else if (origins.some((origin) => rule.pattern.test(origin))) {
      return rule
    }
  }

  return null
}

/**
 * Whether an exception comes from injected third-party code rather than from us.
 */
export function isThirdPartyNoise(input: {
  message?: string | null
  source?: string | null
  stack?: string | null
}): boolean {
  return matchSuppressionRule(input) !== null
}

function collectStrings(values: unknown[]): string[] {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0)
}

/** Pull every message-ish string out of a `$exception` event, old and new payload formats. */
function exceptionMessages(properties: Properties): string[] {
  const messages: unknown[] = [properties.$exception_message, properties.$exception_type]
  const list = properties.$exception_list

  if (Array.isArray(list)) {
    for (const entry of list) {
      messages.push(entry?.value, entry?.type)
    }
  }

  return collectStrings(messages)
}

/** Pull every script origin out of a `$exception` event, old and new payload formats. */
function exceptionSources(properties: Properties): string[] {
  const sources: unknown[] = [properties.$exception_source, properties.$exception_stack_trace_raw]
  const list = properties.$exception_list

  if (Array.isArray(list)) {
    for (const entry of list) {
      const frames = entry?.stacktrace?.frames

      if (Array.isArray(frames)) {
        for (const frame of frames) {
          sources.push(frame?.filename, frame?.source, frame?.abs_path)
        }
      }
    }
  }

  return collectStrings(sources)
}

/**
 * Match a captured `$exception` event payload against the suppression list.
 * Works for both the client (`posthog-js`) and server (`posthog-node`) property shapes.
 */
export function matchExceptionSuppression(
  properties: Properties | undefined
): SuppressionRule | null {
  if (!properties) return null

  for (const message of exceptionMessages(properties)) {
    const rule = matchSuppressionRule({ message })
    if (rule) return rule
  }

  for (const source of exceptionSources(properties)) {
    const rule = matchSuppressionRule({ source })
    if (rule) return rule
  }

  return null
}

/** True when a captured `$exception` event should be dropped instead of sent to PostHog. */
export function shouldDropException(properties: Properties | undefined): boolean {
  return matchExceptionSuppression(properties) !== null
}

/**
 * Environment detail attached to every exception so an issue can be reproduced from PostHog
 * alone: where it happened, on what, over what connection, and against which build.
 */
export function collectExceptionContext(extra: Properties = {}): Properties {
  if (typeof window === 'undefined') {
    return { ...extra }
  }

  const nav = window.navigator as Navigator & {
    connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean }
    deviceMemory?: number
  }
  const connection = nav.connection

  return {
    // Where
    $current_url: window.location.href,
    page: window.location.pathname,
    page_search: window.location.search || undefined,
    page_hash: window.location.hash || undefined,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
    referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    visibility_state: typeof document !== 'undefined' ? document.visibilityState : undefined,

    // On what
    user_agent: nav.userAgent,
    language: nav.language,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width: window.screen?.width,
    screen_height: window.screen?.height,
    device_pixel_ratio: window.devicePixelRatio,
    device_memory_gb: nav.deviceMemory,
    hardware_concurrency: nav.hardwareConcurrency,

    // Over what
    online: nav.onLine,
    connection_type: connection?.effectiveType,
    connection_downlink: connection?.downlink,
    connection_rtt_ms: connection?.rtt,
    save_data: connection?.saveData,

    // Against which build, and how long the page had been open
    time_on_page_ms: typeof performance !== 'undefined' ? Math.round(performance.now()) : undefined,
    app_environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    app_release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7),

    ...extra,
  }
}

/**
 * Turn an arbitrary rejection value into something describable. Promise rejections are not
 * required to carry an Error, and the interesting ones in practice do not.
 */
export function normalizeUnknownReason(reason: unknown): NormalizedReason {
  if (reason instanceof Error) {
    return {
      type: reason.name || 'Error',
      message: reason.message || stringifyLoose(reason),
      stack: reason.stack,
    }
  }

  if (typeof reason === 'string') {
    return { type: 'UnhandledRejection', message: reason, raw: reason }
  }

  if (reason === null || reason === undefined) {
    return {
      type: 'UnhandledRejection',
      message: `Promise rejected with ${stringifyLoose(reason)}`,
    }
  }

  if (typeof reason !== 'object') {
    const raw = stringifyLoose(reason)
    return {
      type: 'UnhandledRejection',
      message: `Promise rejected with ${typeof reason} ${raw}`,
      raw,
    }
  }

  if (typeof Response !== 'undefined' && reason instanceof Response) {
    return {
      type: 'HttpError',
      message: `Promise rejected with HTTP ${reason.status} ${reason.statusText} from ${reason.url}`,
      raw: safeStringify({ status: reason.status, url: reason.url, type: reason.type }),
    }
  }

  if (typeof Event !== 'undefined' && reason instanceof Event) {
    const target = reason.target as { src?: string; href?: string; nodeName?: string } | null
    return {
      type: 'UnhandledRejection',
      message: `Promise rejected with ${reason.type} event from ${target?.nodeName || 'unknown'}`,
      raw: safeStringify({ type: reason.type, src: target?.src, href: target?.href }),
    }
  }

  const record = reason as Record<string, unknown>
  const raw = safeStringify(reason)
  const name = typeof record.name === 'string' ? record.name : undefined
  const message = typeof record.message === 'string' ? record.message : undefined
  const stack = typeof record.stack === 'string' ? record.stack : undefined

  return {
    type: name || 'UnhandledRejection',
    message: message || `Non-Error promise rejection captured with value: ${raw}`,
    stack,
    raw,
  }
}

/**
 * `posthog.captureException` needs a real Error to build a typed, stack-parsed payload.
 * Non-Error values get wrapped, keeping the original value as the error cause.
 */
export function toCapturableError(reason: unknown, fallbackType: string): Error {
  if (reason instanceof Error) return reason

  const normalized = normalizeUnknownReason(reason)
  const error = new Error(normalized.message)

  error.name = normalized.type === 'UnhandledRejection' ? fallbackType : normalized.type
  if (normalized.stack) error.stack = normalized.stack
  ;(error as Error & { cause?: unknown }).cause = reason

  return error
}

/**
 * How long two identical exceptions are treated as the same incident.
 *
 * posthog-js native autocapture and `PostHogErrorHandler` both listen for `error` and
 * `unhandledrejection`. Standing one of them down would be simpler, but posthog-js loads its
 * autocapture bundle from its asset host, which ad blockers and strict CSPs routinely block -
 * so the fallback has to stay armed, and duplicates are resolved here instead.
 */
const DEDUPE_WINDOW_MS = 2000
const MAX_TRACKED_EXCEPTIONS = 100

/** Reported like a suppression rule so all dropped exceptions show up in one place. */
export const DUPLICATE_RULE: SuppressionRule = {
  name: 'duplicate-exception',
  target: 'message',
  pattern: /$^/,
  reason: `The same exception was already captured within ${DEDUPE_WINDOW_MS}ms, by the other capture path.`,
}

const recentExceptions = new Map<string, number>()

/**
 * Identity of an incident, stable across capture paths.
 *
 * The two paths word non-Error rejections differently ("Non-Error promise rejection captured
 * with value: x" vs "x"), so that prefix is normalized away before comparing.
 */
function exceptionDedupeKey(properties: Properties): string | null {
  const [message] = exceptionMessages(properties)
  if (!message) return null

  const normalized = message
    .replace(/^Non-Error promise rejection captured with value:\s*/i, '')
    .trim()
    .toLowerCase()

  const [source] = exceptionSources(properties)

  return `${properties.$exception_type ?? ''}|${normalized}|${source ?? ''}`
}

function isDuplicateException(properties: Properties, now: number): boolean {
  const key = exceptionDedupeKey(properties)
  if (!key) return false

  for (const [seen, at] of recentExceptions) {
    if (now - at > DEDUPE_WINDOW_MS) recentExceptions.delete(seen)
  }

  const seenAt = recentExceptions.get(key)
  recentExceptions.set(key, now)

  if (recentExceptions.size > MAX_TRACKED_EXCEPTIONS) {
    const oldest = recentExceptions.keys().next().value
    if (oldest !== undefined) recentExceptions.delete(oldest)
  }

  return seenAt !== undefined && now - seenAt <= DEDUPE_WINDOW_MS
}

/** Test seam. */
export function resetExceptionDedupe(): void {
  recentExceptions.clear()
}

const suppressionCounts = new Map<string, number>()

/** Suppression counts for this page load, keyed by rule name. Exposed for tests and debugging. */
export function getSuppressionCounts(): Record<string, number> {
  return Object.fromEntries(suppressionCounts)
}

/** Test seam. */
export function resetSuppressionCounts(): void {
  suppressionCounts.clear()
}

/**
 * Report the first drop per rule, then at each power of ten. Suppression must stay observable
 * without turning into the noise it exists to remove.
 */
function shouldReportSuppression(count: number): boolean {
  if (count === 1) return true
  const log = Math.log10(count)
  return Number.isInteger(log)
}

interface ExceptionCaptureClient {
  capture: (event: string, properties?: Properties) => unknown
}

/**
 * PostHog `before_send` hook: drop third-party exception noise, enrich the rest.
 *
 * Runs for every client capture path including posthog-js native autocapture, which is the only
 * place where injected-script rejections can be filtered before they reach the project.
 *
 * @param client - PostHog client used to report suppression volume. Reporting is skipped when
 * omitted, which keeps the hook usable in tests and in non-browser contexts.
 */
export function createExceptionBeforeSend(
  client?: ExceptionCaptureClient,
  now: () => number = Date.now
): BeforeSendFn {
  return (event) => {
    if (!event || event.event !== '$exception') return event

    const rule =
      matchExceptionSuppression(event.properties) ??
      (isDuplicateException(event.properties ?? {}, now()) ? DUPLICATE_RULE : null)

    if (rule) {
      const count = (suppressionCounts.get(rule.name) ?? 0) + 1
      suppressionCounts.set(rule.name, count)

      if (client && shouldReportSuppression(count)) {
        const properties = event.properties ?? {}
        const [message] = exceptionMessages(properties)

        // Deferred so the capture does not re-enter before_send from inside before_send.
        setTimeout(() => {
          client.capture(SUPPRESSION_EVENT, {
            suppression_rule: rule.name,
            suppression_reason: rule.reason,
            suppressed_count: count,
            exception_type: properties.$exception_type,
            exception_message: message
              ? truncate(message, MAX_SUPPRESSION_MESSAGE_LENGTH)
              : undefined,
            $current_url: typeof window === 'undefined' ? undefined : window.location.href,
          })
        }, 0)
      }

      return null
    }

    // Existing properties win: never overwrite what posthog-js already resolved.
    event.properties = { ...collectExceptionContext(), ...event.properties }

    return event
  }
}

/** Suppression + enrichment hook without suppression reporting. */
export const exceptionBeforeSend: BeforeSendFn = createExceptionBeforeSend()
