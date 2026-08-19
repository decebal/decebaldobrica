import { beforeEach, describe, expect, it } from 'bun:test'
import {
  SUPPRESSION_EVENT,
  SUPPRESSION_RULES,
  collectExceptionContext,
  createExceptionBeforeSend,
  getSuppressionCounts,
  matchExceptionSuppression,
  matchSuppressionRule,
  normalizeUnknownReason,
  resetExceptionDedupe,
  resetSuppressionCounts,
  shouldDropException,
  toCapturableError,
} from '../src/exceptions'

const exceptionEvent = (properties: Record<string, unknown>) =>
  ({ uuid: 'test', event: '$exception', properties }) as never

/** The exact payload posthog-js autocapture builds for the reported issue. */
const OUTLOOK_EVENT = {
  $exception_list: [
    {
      type: 'UnhandledRejection',
      value:
        'Non-Error promise rejection captured with value: Object Not Found Matching Id:3, MethodName:update, ParamCount:4',
      stacktrace: { frames: [] },
    },
  ],
}

const APP_EVENT = {
  $exception_list: [
    {
      type: 'TypeError',
      value: "Cannot read properties of undefined (reading 'slug')",
      stacktrace: { frames: [{ filename: 'https://site.com/_next/static/chunks/main.js' }] },
    },
  ],
}

describe('suppression rules', () => {
  it('has unique, low-cardinality rule names', () => {
    const names = SUPPRESSION_RULES.map((rule) => rule.name)
    expect(new Set(names).size).toBe(names.length)
    for (const name of names) expect(name).toMatch(/^[a-z0-9-]+$/)
  })

  it('every rule documents why it is not our bug', () => {
    for (const rule of SUPPRESSION_RULES) expect(rule.reason.length).toBeGreaterThan(20)
  })
})

describe('matchExceptionSuppression', () => {
  it('matches the Outlook SafeLinks rejection in the exception_list shape', () => {
    expect(matchExceptionSuppression(OUTLOOK_EVENT)?.name).toBe('outlook-safelinks')
  })

  it('matches the Outlook SafeLinks rejection in the legacy property shape', () => {
    expect(
      matchExceptionSuppression({
        $exception_type: 'UnhandledRejection',
        $exception_message: 'Object Not Found Matching Id:12, MethodName:update, ParamCount:4',
      })?.name
    ).toBe('outlook-safelinks')
  })

  it('matches noise by stack frame origin', () => {
    expect(
      matchExceptionSuppression({
        $exception_list: [
          {
            type: 'TypeError',
            value: 'x is not a function',
            stacktrace: { frames: [{ filename: 'chrome-extension://abcd/inject.js' }] },
          },
        ],
      })?.name
    ).toBe('browser-extension-source')
  })

  it('matches ResizeObserver and cross-origin script noise', () => {
    expect(matchSuppressionRule({ message: 'ResizeObserver loop limit exceeded' })?.name).toBe(
      'resize-observer-loop'
    )
    expect(matchSuppressionRule({ message: 'Script error.' })?.name).toBe(
      'cross-origin-script-error'
    )
  })

  it('leaves real application errors alone', () => {
    expect(matchExceptionSuppression(APP_EVENT)).toBeNull()
    expect(shouldDropException(APP_EVENT)).toBe(false)
    expect(matchExceptionSuppression(undefined)).toBeNull()
  })

  it('does not suppress an app error that merely mentions an extension in prose', () => {
    expect(
      matchExceptionSuppression({
        $exception_type: 'Error',
        $exception_message: 'Failed to load the file extension list',
      })
    ).toBeNull()
  })
})

describe('createExceptionBeforeSend', () => {
  beforeEach(() => {
    resetSuppressionCounts()
    resetExceptionDedupe()
  })

  it('drops suppressed exceptions', () => {
    expect(createExceptionBeforeSend()(exceptionEvent(OUTLOOK_EVENT))).toBeNull()
  })

  it('passes non-exception events straight through', () => {
    const event = { uuid: 'test', event: '$pageview', properties: {} } as never
    expect(createExceptionBeforeSend()(event)).toBe(event)
  })

  it('enriches real exceptions without overwriting resolved properties', () => {
    const result = createExceptionBeforeSend()(
      exceptionEvent({ ...APP_EVENT, $current_url: 'https://site.com/keep-me' })
    )
    expect(result).not.toBeNull()
    expect(result?.properties.$current_url).toBe('https://site.com/keep-me')
    expect(result?.properties.$exception_list).toBeDefined()
  })

  it('counts every drop', () => {
    const beforeSend = createExceptionBeforeSend()
    for (let i = 0; i < 3; i++) beforeSend(exceptionEvent(OUTLOOK_EVENT))
    expect(getSuppressionCounts()['outlook-safelinks']).toBe(3)
  })

  it('reports suppression volume on the first drop and each power of ten', async () => {
    const captured: Array<{ event: string; properties?: Record<string, unknown> }> = []
    const beforeSend = createExceptionBeforeSend({
      capture: (event, properties) => captured.push({ event, properties }),
    })

    for (let i = 0; i < 100; i++) beforeSend(exceptionEvent(OUTLOOK_EVENT))
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(captured.map((entry) => entry.properties?.suppressed_count)).toEqual([1, 10, 100])
    expect(captured[0].event).toBe(SUPPRESSION_EVENT)
    expect(captured[0].properties?.suppression_rule).toBe('outlook-safelinks')
    expect(String(captured[0].properties?.exception_message)).toContain('Object Not Found')
  })
})

describe('cross-path deduplication', () => {
  beforeEach(() => {
    resetSuppressionCounts()
    resetExceptionDedupe()
  })

  /** posthog-js native autocapture and PostHogErrorHandler word the same rejection differently. */
  const nativeShape = {
    $exception_type: 'UnhandledRejection',
    $exception_list: [
      {
        type: 'UnhandledRejection',
        value: 'Non-Error promise rejection captured with value: payment gateway timed out',
        stacktrace: { frames: [{ filename: 'https://site.com/_next/static/chunk.js' }] },
      },
    ],
  }
  const fallbackShape = {
    $exception_type: 'UnhandledRejection',
    $exception_list: [
      {
        type: 'UnhandledRejection',
        value: 'payment gateway timed out',
        stacktrace: { frames: [{ filename: 'https://site.com/_next/static/chunk.js' }] },
      },
    ],
  }

  it('keeps one report when both capture paths see the same incident', () => {
    let now = 1_000
    const beforeSend = createExceptionBeforeSend(undefined, () => now)

    expect(beforeSend(exceptionEvent(nativeShape))).not.toBeNull()
    now += 5
    expect(beforeSend(exceptionEvent(fallbackShape))).toBeNull()
    expect(getSuppressionCounts()['duplicate-exception']).toBe(1)
  })

  it('keeps distinct exceptions', () => {
    const beforeSend = createExceptionBeforeSend(undefined, () => 1_000)

    expect(beforeSend(exceptionEvent(nativeShape))).not.toBeNull()
    expect(beforeSend(exceptionEvent(APP_EVENT))).not.toBeNull()
  })

  it('reports the same error again once the window has passed', () => {
    let now = 1_000
    const beforeSend = createExceptionBeforeSend(undefined, () => now)

    expect(beforeSend(exceptionEvent(nativeShape))).not.toBeNull()
    now += 2_500
    expect(beforeSend(exceptionEvent(nativeShape))).not.toBeNull()
  })

  it('separates identical messages thrown from different places', () => {
    const beforeSend = createExceptionBeforeSend(undefined, () => 1_000)
    const at = (filename: string) => ({
      $exception_type: 'TypeError',
      $exception_list: [
        { type: 'TypeError', value: 'x is not a function', stacktrace: { frames: [{ filename }] } },
      ],
    })

    expect(beforeSend(exceptionEvent(at('https://site.com/a.js')))).not.toBeNull()
    expect(beforeSend(exceptionEvent(at('https://site.com/b.js')))).not.toBeNull()
  })
})

describe('normalizeUnknownReason', () => {
  it('keeps string rejections verbatim', () => {
    expect(normalizeUnknownReason('boom')).toMatchObject({ message: 'boom', raw: 'boom' })
  })

  it('describes empty rejections', () => {
    expect(normalizeUnknownReason(undefined).message).toBe('Promise rejected with undefined')
    expect(normalizeUnknownReason(null).message).toBe('Promise rejected with null')
  })

  it('survives circular objects', () => {
    const circular: Record<string, unknown> = { a: 1 }
    circular.self = circular
    expect(normalizeUnknownReason(circular).raw).toContain('[Circular]')
  })

  it('survives values that cannot be stringified', () => {
    const hostile = Object.create(null)
    expect(() => normalizeUnknownReason(hostile)).not.toThrow()
  })

  it('reads name, message and stack off error-like objects', () => {
    expect(normalizeUnknownReason({ name: 'HttpError', message: 'nope', stack: 'at x' })).toEqual({
      type: 'HttpError',
      message: 'nope',
      stack: 'at x',
      raw: expect.any(String),
    })
  })

  it('keeps real errors intact', () => {
    const error = new TypeError('nope')
    expect(normalizeUnknownReason(error)).toMatchObject({ type: 'TypeError', message: 'nope' })
  })
})

describe('toCapturableError', () => {
  it('passes real errors through untouched', () => {
    const error = new TypeError('nope')
    expect(toCapturableError(error, 'Error')).toBe(error)
  })

  it('wraps non-errors and keeps the original value as the cause', () => {
    const wrapped = toCapturableError({ code: 42 }, 'UnhandledRejection') as Error & {
      cause?: unknown
    }
    expect(wrapped).toBeInstanceOf(Error)
    expect(wrapped.name).toBe('UnhandledRejection')
    expect(wrapped.cause).toEqual({ code: 42 })
  })
})

describe('collectExceptionContext', () => {
  it('is safe outside the browser and always keeps caller properties', () => {
    expect(collectExceptionContext({ capture_source: 'test' })).toMatchObject({
      capture_source: 'test',
    })
  })
})
