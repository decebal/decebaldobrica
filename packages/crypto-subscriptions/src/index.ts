/**
 * @decebal/crypto-subscriptions
 * Production-ready crypto subscription payments for Solana, Bitcoin Lightning, and Ethereum L2
 *
 * @author Decebal Dobrica
 * @license MIT
 */

// Main API
export { CryptoSubscriptions } from './core/CryptoSubscriptions'

// Individual handlers (for advanced usage)
export { SolanaPayHandler } from './solana'
export { LightningHandler } from './lightning'
export { EthereumHandler } from './ethereum'

// Types
export type {
  // Core types
  PaymentChain,
  SubscriptionTier,
  SubscriptionInterval,
  PaymentStatus,
  SubscriptionStatus,

  // Configuration
  CryptoSubscriptionsConfig,
  TierPricing,

  // Payment types
  CreatePaymentRequest,
  PaymentResponse,
  PaymentVerification,

  // Subscription types
  Subscription,

  // Database adapter
  DatabaseAdapter,

  // Webhook types
  WebhookEvent,

  // Error types
  CryptoSubscriptionError,
} from './core/types'

// Chain-specific types
export type { SolanaPayConfig } from './solana'
export type { LightningConfig } from './lightning'
export type { EthereumConfig, L2Network } from './ethereum'
