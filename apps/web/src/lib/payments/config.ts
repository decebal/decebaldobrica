/**
 * Unified Payment Configuration
 *
 * Booking-related types + MEETING_TYPES + formatPrice live in @decebal/booking/config
 * (so apps/wolventech can reuse them). Service, newsletter, and deposit tiers remain
 * app-local because only apps/web monetizes those.
 */

export {
  formatPrice,
  getAllMeetingTypes,
  getMeetingByName,
  MEETING_TYPES,
  type Chain,
  type Currency,
  type CurrencyType,
  type MeetingType,
  type Network,
  type PaymentConfig,
  type PaymentStatus,
  type PaymentType,
} from '@decebal/booking/config'

import type { Currency, PaymentConfig } from '@decebal/booking/config'
import { MEETING_TYPES } from '@decebal/booking/config'

export const SERVICE_TIERS: Record<string, PaymentConfig> = {
  'all-pricing': {
    configType: 'service_tier',
    slug: 'all-pricing',
    name: 'Unlock All Pricing',
    description: 'View transparent pricing for all my services',
    priceSol: 0.023,
    priceUsd: 5,
    benefits: [
      'View all Fractional CTO packages & pricing',
      'See Technical Writing rates',
      'Access Case Study pricing',
      'View Architecture Documentation costs',
      'Lifetime access - never expires',
    ],
    isActive: true,
    isPopular: true,
  },
}

export const NEWSLETTER_TIERS: Record<string, PaymentConfig> = {
  free: {
    configType: 'newsletter_tier',
    slug: 'free',
    name: 'Free',
    description: 'Get weekly insights delivered to your inbox',
    priceSol: 0,
    priceUsd: 0,
    benefits: [
      'Weekly newsletter with latest articles',
      'Curated tech insights and tips',
      'Access to free content',
      'No spam, unsubscribe anytime',
    ],
    metadata: {
      interval: 'forever',
    },
    isActive: true,
  },

  premium: {
    configType: 'newsletter_tier',
    slug: 'premium',
    name: 'Premium',
    description: 'Unlock exclusive content and deep dives',
    priceSol: 0.07,
    priceUsd: 14.99,
    benefits: [
      'All free benefits',
      'Exclusive premium content and tutorials',
      'In-depth technical deep dives',
      'Code examples and projects',
      'Early access to new articles',
      'Priority email support',
    ],
    metadata: {
      interval: 'month',
    },
    isActive: true,
    isPopular: true,
  },

  founding: {
    configType: 'newsletter_tier',
    slug: 'founding',
    name: 'Founding Member',
    description: 'One-time payment for lifetime access',
    priceSol: 1.4,
    priceUsd: 300,
    benefits: [
      'All premium benefits',
      'Lifetime access - pay once, access forever',
      'Direct access for questions',
      'Founding member community',
      'Your name in supporters list (optional)',
      '1:1 consultation call (60 min)',
    ],
    metadata: {
      interval: 'lifetime',
    },
    isActive: true,
  },
}

export const DEPOSIT_TYPES: Record<string, PaymentConfig> = {
  'fractional-cto': {
    configType: 'deposit_type',
    slug: 'fractional-cto',
    name: 'Fractional CTO Deposit',
    description:
      'Refundable deposit for Fractional CTO services - shows serious interest and gets priority scheduling',
    priceSol: 2.3,
    priceUsd: 500,
    isActive: true,
  },

  'case-study': {
    configType: 'deposit_type',
    slug: 'case-study',
    name: 'Case Study Deposit',
    description: 'Refundable deposit for case study projects - secures your spot in the queue',
    priceSol: 1.4,
    priceUsd: 300,
    isActive: true,
  },

  'technical-writing': {
    configType: 'deposit_type',
    slug: 'technical-writing',
    name: 'Technical Writing Deposit',
    description:
      'Refundable deposit for content creation projects - priority scheduling for articles and tutorials',
    priceSol: 0.9,
    priceUsd: 200,
    isActive: true,
  },

  'architecture-docs': {
    configType: 'deposit_type',
    slug: 'architecture-docs',
    name: 'Architecture Docs Deposit',
    description:
      'Refundable deposit for documentation projects - get started faster with priority onboarding',
    priceSol: 1.4,
    priceUsd: 300,
    isActive: true,
  },
}

export function getPaymentConfig(
  configType: PaymentConfig['configType'],
  slug: string
): PaymentConfig | null {
  switch (configType) {
    case 'meeting_type':
      return MEETING_TYPES[slug] || null
    case 'service_tier':
      return SERVICE_TIERS[slug] || null
    case 'newsletter_tier':
      return NEWSLETTER_TIERS[slug] || null
    case 'deposit_type':
      return DEPOSIT_TYPES[slug] || null
    default:
      return null
  }
}

export function getPaymentConfigs(configType: PaymentConfig['configType']): PaymentConfig[] {
  switch (configType) {
    case 'meeting_type':
      return Object.values(MEETING_TYPES)
    case 'service_tier':
      return Object.values(SERVICE_TIERS)
    case 'newsletter_tier':
      return Object.values(NEWSLETTER_TIERS)
    case 'deposit_type':
      return Object.values(DEPOSIT_TYPES)
    default:
      return []
  }
}

export function requiresPayment(configType: PaymentConfig['configType'], slug: string): boolean {
  const config = getPaymentConfig(configType, slug)
  if (!config) return false

  return (config.priceSol ?? 0) > 0 || (config.priceUsd ?? 0) > 0
}

export function getPrice(
  configType: PaymentConfig['configType'],
  slug: string,
  currency: Currency
): number | null {
  const config = getPaymentConfig(configType, slug)
  if (!config) return null

  switch (currency) {
    case 'SOL':
      return config.priceSol ?? null
    case 'USD':
      return config.priceUsd ?? null
    case 'BTC':
      return config.priceBtc ?? null
    case 'ETH':
      return config.priceEth ?? null
    default:
      return null
  }
}
