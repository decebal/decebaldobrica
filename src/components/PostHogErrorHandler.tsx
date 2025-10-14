'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

/**
 * Global error handler that captures unhandled errors and promise rejections
 * and sends them to PostHog
 */
export function PostHogErrorHandler() {
  useEffect(() => {
    // Handler for unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      if (posthog) {
        posthog.capture('$exception', {
          $exception_type: event.error?.name || 'Error',
          $exception_message: event.message,
          $exception_stack_trace_raw: event.error?.stack || '',
          $exception_source: event.filename,
          $exception_lineno: event.lineno,
          $exception_colno: event.colno,
          $exception_level: 'error',
          $exception_handled: false,
          page: window.location.pathname,
        })
      }
    }

    // Handler for unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      if (posthog) {
        const error = event.reason

        posthog.capture('$exception', {
          $exception_type: error?.name || 'UnhandledRejection',
          $exception_message: error?.message || error?.toString() || 'Unhandled promise rejection',
          $exception_stack_trace_raw: error?.stack || '',
          $exception_level: 'error',
          $exception_handled: false,
          rejection_type: 'unhandledrejection',
          page: window.location.pathname,
        })
      }
    }

    // Add event listeners
    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', rejectionHandler)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', rejectionHandler)
    }
  }, [])

  return null
}
