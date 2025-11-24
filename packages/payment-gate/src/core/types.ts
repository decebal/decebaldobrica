/**
 * Core type definitions for Payment Gate
 * Multi-chain HTTP 402 payment protocol
 */

// ============================================================================
// PAYMENT CHAINS
// ============================================================================

export type PaymentChain = 'solana' | 'lightning' | 'ethereum' | 'base' | 'arbitrum' | 'optimism'

export type PaymentCurrency = 'SOL' | 'BTC' | 'ETH' | 'USDC' | 'USDT'

// ============================================================================
// PAYMENT GATE CONFIGURATION
// ============================================================================

export interface PaymentGateConfig {
  /**
   * Pricing configuration for endpoints
   * Key: endpoint path (supports wildcards)
   * Value: pricing in USD or specific currencies
   */
  pricing: Record<string, EndpointPricing>

  /**
   * Supported payment chains
   * Order determines fallback priority
   */
  chains: PaymentChain[]

  /**
   * Chain-specific configuration
   */
  chainConfig: {
    solana?: SolanaGateConfig
    lightning?: LightningGateConfig
    ethereum?: EthereumGateConfig
  }

  /**
   * Optional: Payment timeout in milliseconds
   * Default: 900000 (15 minutes)
   */
  paymentTimeout?: number

  /**
   * Optional: Enable analytics tracking
   */
  analytics?: {
    enabled: boolean
    provider?: 'posthog' | 'custom'
    apiKey?: string
  }

  /**
   * Optional: Rate limiting configuration
   */
  rateLimit?: RateLimitConfig

  /**
   * Optional: Custom payment verification
   */
  onPaymentVerified?: (payment: PaymentVerification) => Promise<void> | void

  /**
   * Optional: Custom error handling
   */
  onPaymentFailed?: (error: PaymentError) => Promise<void> | void
}

export interface EndpointPricing {
  /**
   * Price in USD (will be converted to crypto)
   */
  usd?: number

  /**
   * Fixed prices in specific currencies (optional)
   */
  sol?: number
  btc?: number
  eth?: number
  usdc?: number

  /**
   * Optional: Free tier rate limit
   */
  freeLimit?: {
    requests: number
    window: number // in milliseconds
  }

  /**
   * Optional: Subscription tier that grants access
   */
  requiredTier?: string
}

export interface SolanaGateConfig {
  /**
   * Merchant wallet address to receive payments
   */
  merchantWallet: string

  /**
   * Solana network: mainnet-beta, devnet, testnet
   */
  network: 'mainnet-beta' | 'devnet' | 'testnet'

  /**
   * Optional: Custom RPC endpoint
   */
  rpcUrl?: string

  /**
   * Optional: Commitment level for transaction confirmation
   */
  commitment?: 'processed' | 'confirmed' | 'finalized'
}

export interface LightningGateConfig {
  /**
   * Lightning provider: lnbits, btcpay
   */
  provider: 'lnbits' | 'btcpay'

  /**
   * Provider API URL
   */
  apiUrl: string

  /**
   * API key for authentication
   */
  apiKey: string

  /**
   * Optional: Store ID (for BTCPay)
   */
  storeId?: string
}

export interface EthereumGateConfig {
  /**
   * Merchant wallet address
   */
  merchantWallet: string

  /**
   * L2 Network
   */
  network: 'base' | 'arbitrum' | 'optimism' | 'ethereum'

  /**
   * Optional: Custom RPC endpoint
   */
  rpcUrl?: string

  /**
   * Optional: Accepted tokens
   */
  acceptedTokens?: ('ETH' | 'USDC' | 'USDT')[]
}

export interface RateLimitConfig {
  /**
   * Free tier rate limit (requests per window)
   */
  free?: {
    requests: number
    window: number // milliseconds
  }

  /**
   * Paid tier rate limit (requests per window)
   */
  paid?: {
    requests: number
    window: number
  }

  /**
   * Rate limit storage (default: in-memory)
   */
  storage?: 'memory' | 'redis' | 'custom'

  /**
   * Optional: Custom rate limit handler
   */
  customHandler?: RateLimitHandler
}

export interface RateLimitHandler {
  check: (key: string, limit: number, window: number) => Promise<RateLimitResult>
  increment: (key: string, window: number) => Promise<void>
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

// ============================================================================
// HTTP 402 RESPONSE
// ============================================================================

export interface Http402Response {
  /**
   * HTTP status code (always 402)
   */
  status: 402

  /**
   * Payment required message
   */
  message: string

  /**
   * Payment details for each supported chain
   */
  paymentOptions: PaymentOption[]

  /**
   * Payment reference ID for tracking
   */
  paymentId: string

  /**
   * Expiration timestamp
   */
  expiresAt: number

  /**
   * Retry endpoint after payment
   */
  retryAfterPayment: {
    method: string
    url: string
    headers: Record<string, string>
  }
}

export interface PaymentOption {
  /**
   * Payment chain
   */
  chain: PaymentChain

  /**
   * Amount in native currency
   */
  amount: number

  /**
   * Currency symbol
   */
  currency: PaymentCurrency

  /**
   * Payment address/URL
   */
  paymentUrl: string

  /**
   * Optional: QR code data URL
   */
  qrCode?: string

  /**
   * Payment reference for verification
   */
  reference: string

  /**
   * Recipient address
   */
  recipient: string

  /**
   * Optional: Payment memo/label
   */
  label?: string
  message?: string
}

// ============================================================================
// PAYMENT VERIFICATION
// ============================================================================

export interface PaymentVerification {
  /**
   * Payment reference ID
   */
  paymentId: string

  /**
   * Verification status
   */
  verified: boolean

  /**
   * Payment chain used
   */
  chain: PaymentChain

  /**
   * Amount paid
   */
  amount: number

  /**
   * Currency
   */
  currency: PaymentCurrency

  /**
   * Transaction signature/hash
   */
  signature?: string

  /**
   * Payer wallet address
   */
  payer?: string

  /**
   * Verification timestamp
   */
  verifiedAt?: number

  /**
   * Error if verification failed
   */
  error?: string
}

// ============================================================================
// PAYMENT STATE
// ============================================================================

export interface PaymentState {
  /**
   * Unique payment ID
   */
  id: string

  /**
   * Payment status
   */
  status: 'pending' | 'verifying' | 'confirmed' | 'failed' | 'expired'

  /**
   * Endpoint being accessed
   */
  endpoint: string

  /**
   * Expected amount (USD)
   */
  amountUsd: number

  /**
   * Selected chain
   */
  chain?: PaymentChain

  /**
   * Payment reference
   */
  reference?: string

  /**
   * Created timestamp
   */
  createdAt: number

  /**
   * Expiration timestamp
   */
  expiresAt: number

  /**
   * Optional: Original request details
   */
  requestMetadata?: {
    method: string
    url: string
    headers: Record<string, string>
    userAgent?: string
    ip?: string
  }

  /**
   * Optional: Verification result
   */
  verification?: PaymentVerification
}

// ============================================================================
// ERRORS
// ============================================================================

export class PaymentError extends Error {
  constructor(
    message: string,
    public code: PaymentErrorCode,
    public details?: unknown
  ) {
    super(message)
    this.name = 'PaymentError'
  }
}

export type PaymentErrorCode =
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_NOT_FOUND'
  | 'PAYMENT_EXPIRED'
  | 'PAYMENT_VERIFICATION_FAILED'
  | 'INVALID_AMOUNT'
  | 'INVALID_CHAIN'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONFIGURATION_ERROR'
  | 'NETWORK_ERROR'

// ============================================================================
// MIDDLEWARE TYPES
// ============================================================================

export interface PaymentGateContext {
  /**
   * Payment state for current request
   */
  payment?: PaymentState

  /**
   * Whether payment is required
   */
  paymentRequired: boolean

  /**
   * Whether payment has been verified
   */
  paymentVerified: boolean

  /**
   * Rate limit status
   */
  rateLimit?: RateLimitResult

  /**
   * Skip payment (for testing/development)
   */
  skipPayment?: boolean
}

export interface NextJsMiddlewareOptions {
  /**
   * Payment gate configuration
   */
  config: PaymentGateConfig

  /**
   * Optional: Paths to exclude from payment gate
   */
  excludePaths?: string[]

  /**
   * Optional: Development mode (skip payments)
   */
  development?: boolean
}

// ============================================================================
// CLIENT SDK TYPES
// ============================================================================

export interface PaymentGateClientConfig {
  /**
   * Preferred payment chain
   */
  preferredChain?: PaymentChain

  /**
   * Auto-retry on 402
   */
  autoRetry?: boolean

  /**
   * Wallet adapter (for browser)
   */
  walletAdapter?: WalletAdapter

  /**
   * Payment polling interval (ms)
   */
  pollingInterval?: number

  /**
   * Payment timeout (ms)
   */
  timeout?: number
}

export interface WalletAdapter {
  /**
   * Connect wallet
   */
  connect: () => Promise<void>

  /**
   * Disconnect wallet
   */
  disconnect: () => Promise<void>

  /**
   * Send payment
   */
  sendPayment: (option: PaymentOption) => Promise<string>

  /**
   * Get connected address
   */
  getAddress: () => Promise<string | null>

  /**
   * Check if wallet is connected
   */
  isConnected: () => boolean
}

export interface ApiResponse<T = unknown> {
  /**
   * Response data
   */
  data?: T

  /**
   * Error message
   */
  error?: string

  /**
   * HTTP status code
   */
  status: number

  /**
   * Payment required info (if 402)
   */
  payment?: Http402Response
}
