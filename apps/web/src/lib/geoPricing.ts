/**
 * Geo-based pricing system for consultation services
 * Detects user location and provides pricing information
 * Note: Discounts are not automatic - users must contact for adjusted pricing
 */

export interface GeoPricingConfig {
  region: string
  city: string
  country: string
  countryCode: string
  multiplier: number
  currency: 'USD' | 'EUR' | 'GBP' | 'SGD' | 'JPY' | 'AUD'
  tier: 1 | 2 | 3 | 4
  tierName:
    | 'Premium Financial Center'
    | 'Major Financial Center'
    | 'Emerging Tech Hub'
    | 'Developing Market'
  discountEligible: boolean // Whether user can request location-based pricing
}

/**
 * Geo-pricing tiers for major financial centers and regions
 */
export const GEO_PRICING_MAP: Record<string, GeoPricingConfig> = {
  // Tier 1: Premium Financial Centers (1.5x-2.0x base price)
  'US-NY': {
    region: 'North America',
    city: 'New York City',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.8,
    currency: 'USD',
    tier: 1,
    tierName: 'Premium Financial Center',
    discountEligible: false,
  },
  'US-CA-SF': {
    region: 'North America',
    city: 'San Francisco / Silicon Valley',
    country: 'United States',
    countryCode: 'US',
    multiplier: 2.0,
    currency: 'USD',
    tier: 1,
    tierName: 'Premium Financial Center',
    discountEligible: false,
  },
  'GB-LDN': {
    region: 'Europe',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    multiplier: 1.7,
    currency: 'GBP',
    tier: 1,
    tierName: 'Premium Financial Center',
    discountEligible: false,
  },
  'CH-ZRH': {
    region: 'Europe',
    city: 'Zurich',
    country: 'Switzerland',
    countryCode: 'CH',
    multiplier: 1.8,
    currency: 'USD',
    tier: 1,
    tierName: 'Premium Financial Center',
    discountEligible: false,
  },
  SG: {
    region: 'Asia',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    multiplier: 1.6,
    currency: 'SGD',
    tier: 1,
    tierName: 'Premium Financial Center',
    discountEligible: false,
  },
  HK: {
    region: 'Asia',
    city: 'Hong Kong',
    country: 'Hong Kong',
    countryCode: 'HK',
    multiplier: 1.6,
    currency: 'USD',
    tier: 1,
    tierName: 'Premium Financial Center',
    discountEligible: false,
  },

  // Tier 2: Major Financial Centers (1.2x-1.4x base price)
  'US-MA': {
    region: 'North America',
    city: 'Boston',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.4,
    currency: 'USD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'US-IL': {
    region: 'North America',
    city: 'Chicago',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.3,
    currency: 'USD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'US-WA': {
    region: 'North America',
    city: 'Seattle',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.4,
    currency: 'USD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'CA-ON': {
    region: 'North America',
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    multiplier: 1.3,
    currency: 'USD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'DE-HE': {
    region: 'Europe',
    city: 'Frankfurt',
    country: 'Germany',
    countryCode: 'DE',
    multiplier: 1.4,
    currency: 'EUR',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'NL-NH': {
    region: 'Europe',
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    multiplier: 1.3,
    currency: 'EUR',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'IE-L': {
    region: 'Europe',
    city: 'Dublin',
    country: 'Ireland',
    countryCode: 'IE',
    multiplier: 1.3,
    currency: 'EUR',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'JP-13': {
    region: 'Asia',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    multiplier: 1.4,
    currency: 'JPY',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  'AU-NSW': {
    region: 'Asia-Pacific',
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    multiplier: 1.3,
    currency: 'AUD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },

  // Tier 3: Emerging Tech Hubs (1.0x base price)
  'US-TX': {
    region: 'North America',
    city: 'Austin',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.0,
    currency: 'USD',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },
  'US-CO': {
    region: 'North America',
    city: 'Denver',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.0,
    currency: 'USD',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },
  'US-FL': {
    region: 'North America',
    city: 'Miami',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.0,
    currency: 'USD',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },
  'DE-BE': {
    region: 'Europe',
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    multiplier: 1.0,
    currency: 'EUR',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },
  'ES-CT': {
    region: 'Europe',
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    multiplier: 1.0,
    currency: 'EUR',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },
  'IL-TA': {
    region: 'Middle East',
    city: 'Tel Aviv',
    country: 'Israel',
    countryCode: 'IL',
    multiplier: 1.0,
    currency: 'USD',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },
  'AE-DU': {
    region: 'Middle East',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    multiplier: 1.0,
    currency: 'USD',
    tier: 3,
    tierName: 'Emerging Tech Hub',
    discountEligible: false,
  },

  // Tier 4: Developing Markets (0.7x-0.9x base price - eligible for discounts)
  PL: {
    region: 'Europe',
    city: 'Poland',
    country: 'Poland',
    countryCode: 'PL',
    multiplier: 0.8,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  RO: {
    region: 'Europe',
    city: 'Romania',
    country: 'Romania',
    countryCode: 'RO',
    multiplier: 0.7,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  UA: {
    region: 'Europe',
    city: 'Ukraine',
    country: 'Ukraine',
    countryCode: 'UA',
    multiplier: 0.7,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  BR: {
    region: 'Latin America',
    city: 'Brazil',
    country: 'Brazil',
    countryCode: 'BR',
    multiplier: 0.8,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  MX: {
    region: 'Latin America',
    city: 'Mexico',
    country: 'Mexico',
    countryCode: 'MX',
    multiplier: 0.8,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  AR: {
    region: 'Latin America',
    city: 'Argentina',
    country: 'Argentina',
    countryCode: 'AR',
    multiplier: 0.7,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  VN: {
    region: 'Asia',
    city: 'Vietnam',
    country: 'Vietnam',
    countryCode: 'VN',
    multiplier: 0.7,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  PH: {
    region: 'Asia',
    city: 'Philippines',
    country: 'Philippines',
    countryCode: 'PH',
    multiplier: 0.7,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
  IN: {
    region: 'Asia',
    city: 'India',
    country: 'India',
    countryCode: 'IN',
    multiplier: 0.8,
    currency: 'USD',
    tier: 4,
    tierName: 'Developing Market',
    discountEligible: true,
  },
}

/**
 * Default config for unknown locations (base pricing)
 */
export const DEFAULT_GEO_CONFIG: GeoPricingConfig = {
  region: 'Global',
  city: 'Unknown',
  country: 'Unknown',
  countryCode: 'XX',
  multiplier: 1.0,
  currency: 'USD',
  tier: 3,
  tierName: 'Emerging Tech Hub',
  discountEligible: false,
}

/**
 * Country-level fallback mapping (when region/city not available)
 */
export const COUNTRY_FALLBACK_MAP: Record<string, GeoPricingConfig> = {
  US: {
    region: 'North America',
    city: 'United States',
    country: 'United States',
    countryCode: 'US',
    multiplier: 1.2,
    currency: 'USD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  GB: {
    region: 'Europe',
    city: 'United Kingdom',
    country: 'United Kingdom',
    countryCode: 'GB',
    multiplier: 1.4,
    currency: 'GBP',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  CA: {
    region: 'North America',
    city: 'Canada',
    country: 'Canada',
    countryCode: 'CA',
    multiplier: 1.2,
    currency: 'USD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  DE: {
    region: 'Europe',
    city: 'Germany',
    country: 'Germany',
    countryCode: 'DE',
    multiplier: 1.2,
    currency: 'EUR',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  FR: {
    region: 'Europe',
    city: 'France',
    country: 'France',
    countryCode: 'FR',
    multiplier: 1.2,
    currency: 'EUR',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
  AU: {
    region: 'Asia-Pacific',
    city: 'Australia',
    country: 'Australia',
    countryCode: 'AU',
    multiplier: 1.2,
    currency: 'AUD',
    tier: 2,
    tierName: 'Major Financial Center',
    discountEligible: false,
  },
}

/**
 * Location information detected from headers
 */
export interface DetectedLocation {
  country?: string
  countryCode?: string
  region?: string
  city?: string
  timezone?: string
  ip?: string
}

/**
 * Detect user location from Next.js headers
 * Uses Vercel's geo headers or Cloudflare headers
 */
export function detectLocationFromHeaders(headers: Headers): DetectedLocation {
  // Vercel geo headers
  const vercelCountry = headers.get('x-vercel-ip-country')
  const vercelRegion = headers.get('x-vercel-ip-country-region')
  const vercelCity = headers.get('x-vercel-ip-city')
  const vercelTimezone = headers.get('x-vercel-ip-timezone')

  // Cloudflare headers
  const cfCountry = headers.get('cf-ipcountry')
  const cfCity = headers.get('cf-ipcity')
  const cfRegion = headers.get('cf-region')
  const cfTimezone = headers.get('cf-timezone')

  // Client IP
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip')

  return {
    countryCode: vercelCountry || cfCountry || undefined,
    country: vercelCountry || cfCountry || undefined,
    region: vercelRegion || cfRegion || undefined,
    city: vercelCity || cfCity || undefined,
    timezone: vercelTimezone || cfTimezone || undefined,
    ip: ip || undefined,
  }
}

/**
 * Get geo pricing config based on detected location
 */
export function getGeoPricingConfig(location: DetectedLocation): GeoPricingConfig {
  if (!location.countryCode) {
    return DEFAULT_GEO_CONFIG
  }

  // Try to match specific region/city first
  const regionKey = `${location.countryCode}-${location.region}`.toUpperCase()
  if (GEO_PRICING_MAP[regionKey]) {
    return GEO_PRICING_MAP[regionKey]
  }

  // Try country-specific mapping
  if (GEO_PRICING_MAP[location.countryCode]) {
    return GEO_PRICING_MAP[location.countryCode]
  }

  // Fallback to country-level config
  if (COUNTRY_FALLBACK_MAP[location.countryCode]) {
    return COUNTRY_FALLBACK_MAP[location.countryCode]
  }

  // Default config
  return DEFAULT_GEO_CONFIG
}

/**
 * Calculate meeting price with geo multiplier
 */
export function calculateGeoPrice(basePriceUSD: number, geoConfig: GeoPricingConfig): number {
  return Math.round(basePriceUSD * geoConfig.multiplier)
}

/**
 * Format price with currency symbol
 */
export function formatPriceWithCurrency(price: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    SGD: 'S$',
    JPY: '¥',
    AUD: 'A$',
  }

  const symbol = symbols[currency] || '$'

  if (currency === 'JPY') {
    return `${symbol}${Math.round(price * 150)}` // Approximate conversion
  }

  return `${symbol}${price}`
}

/**
 * Get discount eligibility message
 */
export function getDiscountMessage(geoConfig: GeoPricingConfig): string | null {
  if (geoConfig.discountEligible) {
    return `Located in ${geoConfig.country}? Contact us for location-based pricing adjustments.`
  }

  if (geoConfig.tier === 4) {
    return 'Special pricing may be available for your region. Please contact us.'
  }

  return null
}

/**
 * Get pricing tier description
 */
export function getPricingTierDescription(tier: 1 | 2 | 3 | 4): string {
  const descriptions = {
    1: 'Premium market pricing for major financial centers',
    2: 'Standard pricing for established tech hubs',
    3: 'Base pricing for emerging markets',
    4: 'Adjusted pricing available - contact us for details',
  }

  return descriptions[tier]
}
