'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { collectExceptionContext, normalizeUnknownReason, toCapturableError } from '../exceptions'

/**
 * Captures unhandled errors and promise rejections.
 *
 * posthog-js captures both natively, but it loads its exception-autocapture bundle from its
 * asset host, which ad blockers and strict CSPs routinely block - leaving error tracking
 * silently switched off for a chunk of real users. So this handler stays armed regardless, and
 * the resulting duplicates are collapsed in `before_send` (see DEDUPE_WINDOW_MS in
 * `exceptions.ts`) rather than by disabling one of the two paths.
 *
 * Third-party noise is not filtered here either: `before_send` is the single chokepoint that
 * drops it, so every drop gets counted and reported instead of vanishing.
 */
export function PostHogErrorHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const errorHandler = (event: ErrorEvent) => {
      posthog.captureException(
        toCapturableError(event.error ?? event.message, 'Error'),
        collectExceptionContext({
          $exception_level: 'error',
          $exception_handled: false,
          $exception_source: event.filename,
          $exception_lineno: event.lineno,
          $exception_colno: event.colno,
          capture_source: 'window.onerror',
        })
      )
    }

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const reason = normalizeUnknownReason(event.reason)

      posthog.captureException(
        toCapturableError(event.reason, 'UnhandledRejection'),
        collectExceptionContext({
          $exception_level: 'error',
          $exception_handled: false,
          capture_source: 'window.onunhandledrejection',
          rejection_reason_type: reason.type,
          rejection_reason_raw: reason.raw,
        })
      )
    }

    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', rejectionHandler)

    return () => {
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', rejectionHandler)
    }
  }, [])

  return null
}
