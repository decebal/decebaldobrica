/**
 * Unified Payment Configuration
 * Central source of truth for all payment types and pricing
 *
 * This replaces:
 * - lib/meetingPayments.ts (meeting pricing)
 * - lib/serviceAccessConfig.ts (service pricing)
 * - app/newsletter/pricing/page.tsx (newsletter pricing)
 */

// ============================================================================
// TYPES
// ============================================================================

export type PaymentType = 'meeting' | 'service_access' | 'newsletter_subscription' | 'deposit' | 'tip'

export type Currency = 'SOL' | 'BTC' | 'ETH' | 'USDC' | 'USD'

export type CurrencyType = 'crypto' | 'fiat'

export type Chain = 'solana' | 'ethereum' | 'bitcoin' | 'polygon' | 'arbitrum' | 'base'

export type Network = 'mainnet' | 'devnet' | 'lightning' | 'polygon' | 'arbitrum' | 'base'

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded' | 'expired'

export interface PaymentConfig {
  // Identification
  configType: 'meeting_type' | 'service_tier' | 'newsletter_tier' | 'deposit_type'
  slug: string

  // Display
  name: string
  description: string

  // Pricing (all prices are optional, use what's available)
  priceSol?: number
  priceUsd?: number
  priceBtc?: number
  priceEth?: number

  // Additional config
  durationMinutes?: number // For meetings
  benefits?: string[]
  metadata?: Record<string, any>

  // Status
  isActive?: boolean
  isPopular?: boolean
}

// ============================================================================
// MEETING TYPES
// ============================================================================

export const MEETING_TYPES: Record<string, PaymentConfig> = {
  'quick-chat-15min': {
    configType: 'meeting_type',
    slug: 'quick-chat-15min',
    name: 'Quick Chat (15 min)',
    description: 'Free discovery call to discuss your needs',
    priceSol: 0,
    priceUsd: 0,
    durationMinutes: 15,
    benefits: ['Free discovery call to discuss your needs'],
    isActive: true,
  },

  'discovery-call-30min': {
    configType: 'meeting_type',
    slug: 'discovery-call-30min',
    name: 'Discovery Call (30 min)',
    description: 'Initial project scoping and feasibility analysis',
    priceSol: 0.7, // ~$150 at $215/SOL
    priceUsd: 150,
    durationMinutes: 30,
    benefits: ['Initial project scoping and feasibility analysis'],
    isActive: true,
  },

  'strategy-session-60min': {
    configType: 'meeting_type',
    slug: 'strategy-session-60min',
    name: 'Strategy Session (60 min)',
    description: 'Architecture review, tech stack decisions, and roadmap planning',
    priceSol: 1.9, // ~$400 at $215/SOL
    priceUsd: 400,
    durationMinutes: 60,
    benefits: [
      'Architecture review',
      'Tech stack decisions',
      'Roadmap planning',
    ],
    isActive: true,
  },

  'deep-dive-90min': {
    configType: 'meeting_type',
    slug: 'deep-dive-90min',
    name: 'Deep Dive (90 min)',
    description: 'Comprehensive system architecture review and detailed technical planning',
    priceSol: 3.3, // ~$700 at $215/SOL
    priceUsd: 700,
    durationMinutes: 90,
    benefits: [
      'Comprehensive system architecture review',
      'Detailed technical planning',
    ],
    isActive: true,
  },
}

// ============================================================================
// SERVICE ACCESS TIERS
// ============================================================================

export const SERVICE_TIERS: Record<string, PaymentConfig> = {
  'all-pricing': {
    configType: 'service_tier',
    slug: 'all-pricing',
    name: 'Unlock All Pricing',
    description: 'View transparent pricing for all my services',
    priceSol: 0.023, // ~$5 at $215/SOL
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

// ============================================================================
// NEWSLETTER TIERS
// ============================================================================

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
    priceSol: 0.07, // ~$15 at $215/SOL
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
    priceSol: 1.4, // ~$300 at $215/SOL
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

// ============================================================================
// DEPOSIT TYPES
// ============================================================================

export const DEPOSIT_TYPES: Record<string, PaymentConfig> = {
  'fractional-cto': {
    configType: 'deposit_type',
    slug: 'fractional-cto',
    name: 'Fractional CTO Deposit',
    description:
      'Refundable deposit for Fractional CTO services - shows serious interest and gets priority scheduling',
    priceSol: 2.3, // ~$500 at $215/SOL
    priceUsd: 500,
    isActive: true,
  },

  'case-study': {
    configType: 'deposit_type',
    slug: 'case-study',
    name: 'Case Study Deposit',
    description: 'Refundable deposit for case study projects - secures your spot in the queue',
    priceSol: 1.4, // ~$300 at $215/SOL
    priceUsd: 300,
    isActive: true,
  },

  'technical-writing': {
    configType: 'deposit_type',
    slug: 'technical-writing',
    name: 'Technical Writing Deposit',
    description:
      'Refundable deposit for content creation projects - priority scheduling for articles and tutorials',
    priceSol: 0.9, // ~$200 at $215/SOL
    priceUsd: 200,
    isActive: true,
  },

  'architecture-docs': {
    configType: 'deposit_type',
    slug: 'architecture-docs',
    name: 'Architecture Docs Deposit',
    description:
      'Refundable deposit for documentation projects - get started faster with priority onboarding',
    priceSol: 1.4, // ~$300 at $215/SOL
    priceUsd: 300,
    isActive: true,
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get payment configuration by type and slug
 */
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

/**
 * Get all configs of a specific type
 */
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

/**
 * Check if a meeting/service requires payment
 */
export function requiresPayment(configType: PaymentConfig['configType'], slug: string): boolean {
  const config = getPaymentConfig(configType, slug)
  if (!config) return false

  return (config.priceSol ?? 0) > 0 || (config.priceUsd ?? 0) > 0
}

/**
 * Get price in specific currency
 */
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

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: Currency): string {
  switch (currency) {
    case 'SOL':
      return `${amount.toFixed(3)} SOL`
    case 'BTC':
      return `${amount.toFixed(8)} BTC`
    case 'ETH':
      return `${amount.toFixed(6)} ETH`
    case 'USDC':
      return `${amount.toFixed(2)} USDC`
    case 'USD':
      return `$${amount.toFixed(2)}`
    default:
      return `${amount} ${currency}`
  }
}

/**
 * Get all active meeting types (for backward compatibility)
 */
export function getAllMeetingTypes(): PaymentConfig[] {
  return Object.values(MEETING_TYPES).filter((config) => config.isActive !== false)
}

/**
 * Get meeting config by display name (for backward compatibility)
 */
export function getMeetingByName(name: string): PaymentConfig | null {
  return Object.values(MEETING_TYPES).find((config) => config.name === name) || null
}
