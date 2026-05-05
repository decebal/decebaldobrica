export type PaymentType =
  | 'meeting'
  | 'service_access'
  | 'newsletter_subscription'
  | 'deposit'
  | 'tip'

export type Currency = 'SOL' | 'BTC' | 'ETH' | 'USDC' | 'USD'

export type CurrencyType = 'crypto' | 'fiat'

export type Chain = 'solana' | 'ethereum' | 'bitcoin' | 'polygon' | 'arbitrum' | 'base'

export type Network = 'mainnet' | 'devnet' | 'lightning' | 'polygon' | 'arbitrum' | 'base'

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded' | 'expired'

export interface PaymentConfig {
  configType: 'meeting_type' | 'service_tier' | 'newsletter_tier' | 'deposit_type'
  slug: string
  name: string
  description: string
  priceSol?: number
  priceUsd?: number
  priceBtc?: number
  priceEth?: number
  durationMinutes?: number
  benefits?: string[]
  metadata?: Record<string, unknown>
  isActive?: boolean
  isPopular?: boolean
}

export type MeetingType = PaymentConfig & { configType: 'meeting_type' }

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
    priceSol: 0.7,
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
    priceSol: 1.9,
    priceUsd: 400,
    durationMinutes: 60,
    benefits: ['Architecture review', 'Tech stack decisions', 'Roadmap planning'],
    isActive: true,
  },

  'deep-dive-90min': {
    configType: 'meeting_type',
    slug: 'deep-dive-90min',
    name: 'Deep Dive (90 min)',
    description: 'Comprehensive system architecture review and detailed technical planning',
    priceSol: 3.3,
    priceUsd: 700,
    durationMinutes: 90,
    benefits: ['Comprehensive system architecture review', 'Detailed technical planning'],
    isActive: true,
  },
}

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

export function getAllMeetingTypes(): PaymentConfig[] {
  return Object.values(MEETING_TYPES).filter((config) => config.isActive !== false)
}

export function getMeetingByName(name: string): PaymentConfig | null {
  return Object.values(MEETING_TYPES).find((config) => config.name === name) || null
}
