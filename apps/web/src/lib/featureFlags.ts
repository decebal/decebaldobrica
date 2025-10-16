/**
 * Feature flags configuration
 * These can be controlled via environment variables
 */

export const featureFlags = {
  /**
   * Enable paid meetings and payment options
   * When disabled, only free meetings are shown
   */
  enablePaidMeetings: process.env.NEXT_PUBLIC_ENABLE_PAID_MEETINGS === 'true',

  /**
   * Enable video on homepage
   * When disabled, shows static image instead
   */
  enableHomepageVideo: process.env.NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO === 'true',

  /**
   * Enable premium newsletter subscriptions
   * When disabled, shows "coming soon" modal instead
   */
  premiumSubscriptionsEnabled: process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTIONS_ENABLED === 'true',

  /**
   * Enable founding member subscriptions
   * When disabled, shows "coming soon" modal instead
   */
  foundingMemberEnabled: process.env.NEXT_PUBLIC_FOUNDING_MEMBER_ENABLED === 'true',
} as const

export type FeatureFlags = typeof featureFlags
export type FeatureFlag = keyof typeof featureFlags

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag]
}
