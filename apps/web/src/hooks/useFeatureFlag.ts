/**
 * PostHog Feature Flags Hook
 * Use this to check feature flags in React components
 */

'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

/**
 * Available feature flag keys
 */
export const FEATURE_FLAGS = {
  ENABLE_PAID_MEETINGS: 'enable-paid-meetings',
  ENABLE_HOMEPAGE_VIDEO: 'enable-homepage-video',
  PREMIUM_SUBSCRIPTIONS: 'premium-subscriptions-enabled',
  FOUNDING_MEMBER: 'founding-member-enabled',
} as const

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS]

/**
 * Hook to check if a feature flag is enabled
 *
 * @param flagKey - The feature flag key to check
 * @param defaultValue - Default value if PostHog is not available (defaults to false)
 * @returns boolean indicating if the feature is enabled
 *
 * @example
 * const isPaidMeetingsEnabled = useFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)
 *
 * if (isPaidMeetingsEnabled) {
 *   // Show paid meeting options
 * }
 */
export function useFeatureFlag(flagKey: FeatureFlagKey, defaultValue = false): boolean {
  const posthog = usePostHog()
  const [isEnabled, setIsEnabled] = useState(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!posthog) {
      setIsEnabled(defaultValue)
      setIsLoaded(true)
      return
    }

    // Check feature flag from PostHog
    const checkFlag = () => {
      const flagValue = posthog.isFeatureEnabled(flagKey)
      setIsEnabled(flagValue ?? defaultValue)
      setIsLoaded(true)
    }

    // Check immediately
    checkFlag()

    // Listen for feature flag updates
    posthog.onFeatureFlags(checkFlag)

    return () => {
      // Cleanup if needed
    }
  }, [posthog, flagKey, defaultValue])

  return isEnabled
}

/**
 * Hook to get all feature flags at once
 * Useful for checking multiple flags efficiently
 *
 * @returns Object with all feature flag states
 *
 * @example
 * const flags = useAllFeatureFlags()
 *
 * if (flags.isPaidMeetingsEnabled) {
 *   // Show paid meetings
 * }
 */
export function useAllFeatureFlags() {
  const isPaidMeetingsEnabled = useFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)
  const isHomepageVideoEnabled = useFeatureFlag(FEATURE_FLAGS.ENABLE_HOMEPAGE_VIDEO)
  const isPremiumSubscriptionsEnabled = useFeatureFlag(FEATURE_FLAGS.PREMIUM_SUBSCRIPTIONS)
  const isFoundingMemberEnabled = useFeatureFlag(FEATURE_FLAGS.FOUNDING_MEMBER)

  return {
    isPaidMeetingsEnabled,
    isHomepageVideoEnabled,
    isPremiumSubscriptionsEnabled,
    isFoundingMemberEnabled,
  }
}

/**
 * Server-side feature flag check (using environment variables as fallback)
 * Use this for server components or when you need SSR support
 *
 * @param flagKey - The feature flag key to check
 * @returns boolean indicating if the feature is enabled
 */
export function getServerFeatureFlag(flagKey: FeatureFlagKey): boolean {
  // Map PostHog flag keys to environment variables for SSR/SSG fallback
  const envMap: Record<FeatureFlagKey, string> = {
    [FEATURE_FLAGS.ENABLE_PAID_MEETINGS]: process.env.NEXT_PUBLIC_ENABLE_PAID_MEETINGS || 'false',
    [FEATURE_FLAGS.ENABLE_HOMEPAGE_VIDEO]: process.env.NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO || 'false',
    [FEATURE_FLAGS.PREMIUM_SUBSCRIPTIONS]:
      process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTIONS_ENABLED || 'false',
    [FEATURE_FLAGS.FOUNDING_MEMBER]: process.env.NEXT_PUBLIC_FOUNDING_MEMBER_ENABLED || 'false',
  }

  return envMap[flagKey] === 'true'
}
