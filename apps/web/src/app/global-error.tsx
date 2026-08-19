'use client'

import { collectExceptionContext } from '@decebal/analytics/exceptions'
import posthog from 'posthog-js'
import { useEffect } from 'react'

/**
 * Last-resort error boundary.
 *
 * `PostHogErrorBoundary` lives inside the root layout, so it cannot catch an error thrown by
 * the layout itself or by the providers above it. Next renders this file instead, replacing the
 * whole document - which is why it ships its own <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(
      error,
      collectExceptionContext({
        $exception_level: 'fatal',
        $exception_handled: true,
        capture_source: 'global-error',
        react_error_digest: error.digest,
      })
    )
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-brand-darknavy p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-4">We've been notified and are looking into the issue.</p>
          {error.digest && <p className="text-xs text-gray-500 mb-4">Reference: {error.digest}</p>}
          <button
            type="button"
            onClick={reset}
            className="bg-brand-teal hover:bg-brand-teal/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
