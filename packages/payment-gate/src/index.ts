/**
 * @decebal/payment-gate
 * Multi-chain HTTP 402 payment protocol for API monetization
 *
 * @author Decebal Dobrica
 * @license MIT
 */

// Core exports
export { PaymentGate } from './core/PaymentGate'
export { Http402Handler } from './core/Http402Handler'

// Type exports
export type {
  // Configuration
  PaymentGateConfig,
  EndpointPricing,
  SolanaGateConfig,
  LightningGateConfig,
  EthereumGateConfig,
  RateLimitConfig,
  NextJsMiddlewareOptions,
  // Payment chains
  PaymentChain,
  PaymentCurrency,
  // HTTP 402
  Http402Response,
  PaymentOption,
  // Verification
  PaymentVerification,
  PaymentState,
  // Context
  PaymentGateContext,
  // Client SDK
  PaymentGateClientConfig,
  ApiResponse,
  WalletAdapter,
  // Errors
  PaymentError,
  PaymentErrorCode,
  // Utilities
  RateLimitHandler,
  RateLimitResult,
} from './core/types'

// Re-export middleware (will be imported as @decebal/payment-gate/middleware/nextjs)
// This is handled by tsup exports

// Re-export client SDK (will be imported as @decebal/payment-gate/client)
// This is handled by tsup exports
