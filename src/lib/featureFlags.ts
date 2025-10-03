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
} as const

export type FeatureFlags = typeof featureFlags
