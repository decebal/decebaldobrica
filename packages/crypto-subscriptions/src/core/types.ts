/**
 * Core types for @decebal/crypto-subscriptions
 * Production-ready crypto subscription payments
 */

// Supported payment chains
export type PaymentChain = 'solana' | 'lightning' | 'ethereum'

// Subscription tiers
export type SubscriptionTier = 'free' | 'premium' | 'pro' | 'enterprise' | string

// Subscription intervals
export type SubscriptionInterval = 'monthly' | 'yearly' | 'lifetime'

// Payment status
export type PaymentStatus =
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'expired'

// Subscription status
export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'pending'

/**
 * Pricing configuration for a subscription tier
 */
export interface TierPricing {
  tier: SubscriptionTier
  name: string
  description: string
  features: string[]
  prices: {
    monthly?: {
      usd: number
      sol?: number
      btc?: number
      eth?: number
    }
    yearly?: {
      usd: number
      sol?: number
      btc?: number
      eth?: number
    }
    lifetime?: {
      usd: number
      sol?: number
      btc?: number
      eth?: number
    }
  }
}

/**
 * Payment request to create a new subscription payment
 */
export interface CreatePaymentRequest {
  subscriberId: string
  subscriberEmail: string
  tier: SubscriptionTier
  interval: SubscriptionInterval
  chain: PaymentChain
  successUrl?: string
  cancelUrl?: string
  metadata?: Record<string, unknown>
}

/**
 * Payment response with payment details
 */
export interface PaymentResponse {
  paymentId: string
  amount: number
  currency: string
  chain: PaymentChain
  status: PaymentStatus
  expiresAt: Date

  // Chain-specific payment details
  solana?: {
    recipient: string
    reference: string
    qrCode: string
  }
  lightning?: {
    invoice: string
    qrCode: string
    hash: string
  }
  ethereum?: {
    recipient: string
    chainId: number
    token?: string
    qrCode: string
  }

  metadata?: Record<string, unknown>
  createdAt: Date
}

/**
 * Subscription data
 */
export interface Subscription {
  id: string
  subscriberId: string
  tier: SubscriptionTier
  interval: SubscriptionInterval
  status: SubscriptionStatus
  chain: PaymentChain
  amount: number
  currency: string
  startDate: Date
  expiresAt?: Date
  nextBillingDate?: Date
  cancelAtPeriodEnd: boolean
  paymentId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment verification result
 */
export interface PaymentVerification {
  verified: boolean
  paymentId: string
  transactionHash?: string
  amount: number
  currency: string
  chain: PaymentChain
  timestamp: Date
  error?: string
}

/**
 * Webhook event payload
 */
export interface WebhookEvent {
  type: 'payment.confirmed' | 'payment.failed' | 'subscription.renewed' | 'subscription.cancelled'
  paymentId: string
  subscriberId: string
  data: PaymentVerification | Subscription
  timestamp: Date
}

/**
 * Configuration for the crypto subscriptions package
 */
export interface CryptoSubscriptionsConfig {
  // Solana configuration
  solana?: {
    network: 'mainnet-beta' | 'devnet' | 'testnet'
    merchantWallet: string
    rpcUrl?: string
  }

  // Bitcoin Lightning configuration
  lightning?: {
    network: 'mainnet' | 'testnet'
    provider: 'lnbits' | 'btcpay'
    // LNBits configuration
    lnbitsUrl?: string
    lnbitsApiKey?: string
    // BTCPay Server configuration
    btcpayUrl?: string
    btcpayApiKey?: string
    btcpayStoreId?: string
  }

  // Ethereum L2 configuration (Base recommended)
  ethereum?: {
    network: 'base' | 'arbitrum' | 'optimism'
    merchantWallet: `0x${string}`
    rpcUrl?: string
    usdcTokenAddress?: `0x${string}`
  }

  // Webhook configuration
  webhooks?: {
    url: string
    secret: string
  }

  // Database adapter (optional - use your own DB)
  database?: DatabaseAdapter
}

/**
 * Database adapter interface
 * Implement this to use your own database (Supabase, PostgreSQL, etc.)
 */
export interface DatabaseAdapter {
  // Payment operations
  createPayment(payment: Omit<PaymentResponse, 'createdAt'>): Promise<PaymentResponse>
  getPayment(paymentId: string): Promise<PaymentResponse | null>
  updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void>

  // Subscription operations
  createSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription>
  getSubscription(subscriberId: string): Promise<Subscription | null>
  updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<void>
  cancelSubscription(subscriptionId: string): Promise<void>
}

/**
 * Error types
 */
export class CryptoSubscriptionError extends Error {
  constructor(
    message: string,
    public code: string,
    public chain?: PaymentChain
  ) {
    super(message)
    this.name = 'CryptoSubscriptionError'
  }
}
