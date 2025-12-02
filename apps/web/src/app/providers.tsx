// src/app/providers.tsx
// Client-side providers wrapper

'use client'

import { SolanaWalletProvider } from '@/components/wallet/WalletProvider'
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
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',

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

          // Performance and network
          capture_performance: true, // Capture web vitals and performance metrics

          // Advanced options - sanitize sensitive data before sending
          before_send: (event) => {
            if (!event) return event
            // Remove sensitive data if needed
            if (event.properties?.email) {
              event.properties.email = (event.properties.email as string).replace(/@.*$/, '@***')
            }
            return event
          },

          loaded: (posthog) => {
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
