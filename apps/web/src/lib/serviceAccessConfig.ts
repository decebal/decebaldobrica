/**
 * Service Access Configuration
 * Defines pricing and benefits for unlocking services
 */

export interface ServiceAccessTier {
  slug: string
  name: string
  description: string
  price: number // in SOL
  priceUSD: number // approximate USD
  benefits: string[]
  popular?: boolean
}

export const SERVICE_ACCESS_TIERS: Record<string, ServiceAccessTier> = {
  'all-pricing': {
    slug: 'all-pricing',
    name: 'Unlock All Pricing',
    description: 'View transparent pricing for all my services',
    price: 0.023, // ~$5 at $215/SOL
    priceUSD: 5,
    benefits: [
      'View all Fractional CTO packages & pricing',
      'See Technical Writing rates',
      'Access Case Study pricing',
      'View Architecture Documentation costs',
      'Lifetime access - never expires',
    ],
    popular: true,
  },
}

export function getServiceAccessTier(slug: string): ServiceAccessTier | null {
  return SERVICE_ACCESS_TIERS[slug] || null
}
