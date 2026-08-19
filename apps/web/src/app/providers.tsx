// src/app/providers.tsx
// Client-side providers wrapper

'use client'

import { SolanaWalletProvider } from '@/components/wallet/WalletProvider'
import { createExceptionBeforeSend, getSuppressionCounts } from '@decebal/analytics/exceptions'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useState } from 'react'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Initialize PostHog with cookieless tracking for privacy
  // Note: Ensure "Cookieless server hash mode" is enabled in PostHog Project Settings > Web analytics
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_DISABLED !== 'true'
    ) {
      try {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          // Region matters: an EU project key is rejected by US cloud (app.posthog.com)
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',

          // Cookieless tracking - privacy-preserving hash mode
          cookieless_mode: 'always',

          // Page tracking - disable auto-capture, we handle it with PostHogPageView
          capture_pageview: false, // We capture manually via PostHogPageView component
          capture_pageleave: true, // Track when users leave pages

          // Session recording - ENABLED for comprehensive analytics
          disable_session_recording: false,
          session_recording: {
            maskAllInputs: true, // Mask all input fields for privacy
            maskTextSelector: '[data-private]', // Additional mask selector
            recordCrossOriginIframes: false,
          },

          // Autocapture - ENABLED for all interactions
          autocapture: true, // Enable full autocapture

          // Error tracking - capture natively instead of relying on remote config, so that
          // PostHogErrorHandler knows to stand down and we never report an incident twice
          capture_exceptions: {
            capture_unhandled_errors: true,
            capture_unhandled_rejections: true,
            capture_console_errors: false,
          },
          error_tracking: {
            // Errors thrown by browser extensions are not ours to fix
            captureExtensionExceptions: false,
          },

          // Performance and network
          capture_performance: true, // Capture web vitals and performance metrics

          // Advanced options - sanitize sensitive data, then filter and enrich exceptions
          before_send: [
            (event) => {
              if (!event) return event
              // Remove sensitive data if needed
              if (event.properties?.email) {
                event.properties.email = (event.properties.email as string).replace(/@.*$/, '@***')
              }
              return event
            },
            createExceptionBeforeSend(posthog),
          ],

          loaded: (posthog) => {
            // Match the PostHog snippet so `posthog.debug()` and friends work from the console
            ;(window as Window & { posthog?: typeof posthog }).posthog ??= posthog

            // Support hook: run `__posthogSuppressions()` in the console to see what the
            // exception noise filter has dropped on this page
            ;(
              window as Window & { __posthogSuppressions?: () => Record<string, number> }
            ).__posthogSuppressions = getSuppressionCounts

            if (process.env.NODE_ENV === 'development') {
              console.log('✅ PostHog loaded with cookieless tracking')
              posthog.debug() // Enable debug mode in development
            }
          },
        })
      } catch (error) {
        console.warn('⚠️  PostHog initialization failed:', error)
      }
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <SolanaWalletProvider>{children}</SolanaWalletProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PostHogProvider>
  )
}
