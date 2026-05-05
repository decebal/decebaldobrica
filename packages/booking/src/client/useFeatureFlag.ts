'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

export const FEATURE_FLAGS = {
  ENABLE_PAID_MEETINGS: 'enable-paid-meetings',
  ENABLE_HOMEPAGE_VIDEO: 'enable-homepage-video',
  PREMIUM_SUBSCRIPTIONS: 'premium-subscriptions-enabled',
  FOUNDING_MEMBER: 'founding-member-enabled',
} as const

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS]

export function useFeatureFlag(flagKey: FeatureFlagKey, defaultValue = false): boolean {
  const posthog = usePostHog()
  const [isEnabled, setIsEnabled] = useState(defaultValue)
  const [, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!posthog) {
      setIsEnabled(defaultValue)
      setIsLoaded(true)
      return
    }

    const checkFlag = () => {
      const flagValue = posthog.isFeatureEnabled(flagKey)
      setIsEnabled(flagValue ?? defaultValue)
      setIsLoaded(true)
    }

    checkFlag()
    posthog.onFeatureFlags(checkFlag)
  }, [posthog, flagKey, defaultValue])

  return isEnabled
}

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

export function getServerFeatureFlag(flagKey: FeatureFlagKey): boolean {
  const envMap: Record<FeatureFlagKey, string> = {
    [FEATURE_FLAGS.ENABLE_PAID_MEETINGS]: process.env.NEXT_PUBLIC_ENABLE_PAID_MEETINGS || 'false',
    [FEATURE_FLAGS.ENABLE_HOMEPAGE_VIDEO]: process.env.NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO || 'false',
    [FEATURE_FLAGS.PREMIUM_SUBSCRIPTIONS]:
      process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTIONS_ENABLED || 'false',
    [FEATURE_FLAGS.FOUNDING_MEMBER]: process.env.NEXT_PUBLIC_FOUNDING_MEMBER_ENABLED || 'false',
  }

  return envMap[flagKey] === 'true'
}
