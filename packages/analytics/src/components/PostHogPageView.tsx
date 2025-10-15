'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'

/**
 * Inner component that handles the actual pageview tracking
 * Wrapped in Suspense to handle searchParams
 */
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    // Track pageview on mount and when pathname changes
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = `${url}?${searchParams.toString()}`
      }

      // Capture pageview with additional context
      posthog.capture('$pageview', {
        $current_url: url,
        path: pathname,
        search: searchParams?.toString() || '',
      })

      // Also capture pageleave when component unmounts
      return () => {
        posthog.capture('$pageleave', {
          $current_url: url,
          path: pathname,
        })
      }
    }
  }, [pathname, searchParams, posthog])

  return null
}

/**
 * Component to track page views in Next.js App Router
 * Add this to your root layout to track all page navigations
 */
export function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  )
}
