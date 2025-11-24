/**
 * PaymentGate - Main orchestrator for multi-chain HTTP 402 payments
 */

import { Connection, PublicKey } from '@solana/web3.js'
import { findReference, validateTransfer } from '@solana/pay'
import { Http402Handler } from './Http402Handler'
import type {
  EndpointPricing,
  Http402Response,
  PaymentChain,
  PaymentError,
  PaymentGateConfig,
  PaymentState,
  PaymentVerification,
  RateLimitResult,
} from './types'

export class PaymentGate {
  private http402Handler: Http402Handler
  private rateLimitStore = new Map<string, { count: number; resetAt: number }>()

  constructor(private config: PaymentGateConfig) {
    this.http402Handler = new Http402Handler(config)
  }

  // ============================================================================
  // PAYMENT REQUIRED
  // ============================================================================

  /**
   * Check if endpoint requires payment
   */
  requiresPayment(endpoint: string): boolean {
    const pricing = this.getPricingForEndpoint(endpoint)
    return pricing !== null && (pricing.usd || 0) > 0
  }

  /**
   * Generate HTTP 402 response for endpoint
   */
  async generatePaymentRequired(
    endpoint: string,
    requestMetadata?: PaymentState['requestMetadata']
  ): Promise<Http402Response> {
    const pricing = this.getPricingForEndpoint(endpoint)

    if (!pricing) {
      throw new Error(`No pricing configured for endpoint: ${endpoint}`)
    }

    return this.http402Handler.generatePaymentRequired(endpoint, pricing, requestMetadata)
  }

  // ============================================================================
  // PAYMENT VERIFICATION
  // ============================================================================

  /**
   * Verify payment for a given payment ID
   */
  async verifyPayment(paymentId: string, chain?: PaymentChain): Promise<PaymentVerification> {
    const paymentState = await this.http402Handler.getPaymentState(paymentId)

    if (!paymentState) {
      return {
        paymentId,
        verified: false,
        chain: chain || 'solana',
        amount: 0,
        currency: 'SOL',
        error: 'Payment not found',
      }
    }

    // Check if payment is expired
    if (paymentState.expiresAt < Date.now()) {
      await this.http402Handler.updatePaymentState(paymentId, { status: 'expired' })
      return {
        paymentId,
        verified: false,
        chain: chain || 'solana',
        amount: 0,
        currency: 'SOL',
        error: 'Payment expired',
      }
    }

    // Check if already verified
    if (paymentState.status === 'confirmed' && paymentState.verification) {
      return paymentState.verification
    }

    // Determine which chain to verify
    const verificationChain = chain || paymentState.chain || this.config.chains[0]

    // Update status to verifying
    await this.http402Handler.updatePaymentState(paymentId, { status: 'verifying' })

    try {
      let verification: PaymentVerification

      switch (verificationChain) {
        case 'solana':
          verification = await this.verifySolanaPayment(paymentState)
          break

        case 'lightning':
          verification = await this.verifyLightningPayment(paymentState)
          break

        case 'ethereum':
        case 'base':
        case 'arbitrum':
        case 'optimism':
          verification = await this.verifyEthereumPayment(paymentState, verificationChain as PaymentChain)
          break

        default:
          throw new Error(`Unsupported chain: ${String(verificationChain)}`)
      }

      // Update payment state with verification result
      if (verification.verified) {
        await this.http402Handler.updatePaymentState(paymentId, {
          status: 'confirmed',
          verification,
        })

        // Call custom handler if provided
        if (this.config.onPaymentVerified) {
          await this.config.onPaymentVerified(verification)
        }

        // Track analytics
        this.trackPayment(verification)
      } else {
        await this.http402Handler.updatePaymentState(paymentId, { status: 'failed' })
      }

      return verification
    } catch (error) {
      const verification: PaymentVerification = {
        paymentId,
        verified: false,
        chain: verificationChain as PaymentChain,
        amount: paymentState.amountUsd,
        currency: 'SOL',
        error: error instanceof Error ? error.message : 'Verification failed',
      }

      await this.http402Handler.updatePaymentState(paymentId, { status: 'failed' })

      if (this.config.onPaymentFailed) {
        await this.config.onPaymentFailed(error as PaymentError)
      }

      return verification
    }
  }

  /**
   * Verify Solana payment
   */
  private async verifySolanaPayment(state: PaymentState): Promise<PaymentVerification> {
    const config = this.config.chainConfig.solana
    if (!config) {
      throw new Error('Solana not configured')
    }

    // Get payment option from stored state
    const pricing = this.getPricingForEndpoint(state.endpoint)
    if (!pricing) {
      throw new Error('Pricing not found')
    }

    const expectedAmount = pricing.sol || 0

    // Connect to Solana
    const rpcUrl = config.rpcUrl || this.getDefaultSolanaRpc(config.network)
    const connection = new Connection(rpcUrl, config.commitment || 'confirmed')

    try {
      // Find reference on-chain
      const referencePublicKey = new PublicKey(state.reference || '')
      const signatureInfo = await findReference(connection, referencePublicKey, {
        finality: (config.commitment || 'confirmed') as 'finalized' | 'confirmed',
      })

      // Validate transfer
      // Convert SOL to lamports for validation
      // @solana/pay uses bignumber.js BigNumber, not native bigint
      const amountLamports = expectedAmount * 1e9

      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient: new PublicKey(config.merchantWallet),
          amount: amountLamports as any, // Type coercion for bignumber.js compatibility
          reference: referencePublicKey,
        },
        { commitment: (config.commitment || 'confirmed') as 'finalized' | 'confirmed' }
      )

      // Get transaction details for payer address
      const tx = await connection.getTransaction(signatureInfo.signature, {
        commitment: (config.commitment || 'confirmed') as 'finalized' | 'confirmed',
        maxSupportedTransactionVersion: 0,
      })

      return {
        paymentId: state.id,
        verified: true,
        chain: 'solana',
        amount: expectedAmount,
        currency: 'SOL',
        signature: signatureInfo.signature,
        payer: tx?.transaction.message.getAccountKeys().get(0)?.toString(),
        verifiedAt: Date.now(),
      }
    } catch (error) {
      return {
        paymentId: state.id,
        verified: false,
        chain: 'solana',
        amount: expectedAmount,
        currency: 'SOL',
        error: error instanceof Error ? error.message : 'Verification failed',
      }
    }
  }

  /**
   * Verify Lightning payment
   */
  private async verifyLightningPayment(state: PaymentState): Promise<PaymentVerification> {
    const config = this.config.chainConfig.lightning
    if (!config) {
      throw new Error('Lightning not configured')
    }

    const pricing = this.getPricingForEndpoint(state.endpoint)
    if (!pricing) {
      throw new Error('Pricing not found')
    }

    const expectedAmount = pricing.btc || 0

    // Check invoice status via provider
    const paymentHash = state.reference || ''

    if (config.provider === 'lnbits') {
      return this.verifyLnbitsPayment(state.id, paymentHash, expectedAmount)
    }

    if (config.provider === 'btcpay') {
      return this.verifyBtcpayPayment(state.id, paymentHash, expectedAmount)
    }

    throw new Error(`Unsupported Lightning provider: ${config.provider}`)
  }

  /**
   * Verify LNBits payment
   */
  private async verifyLnbitsPayment(
    paymentId: string,
    paymentHash: string,
    expectedAmount: number
  ): Promise<PaymentVerification> {
    const config = this.config.chainConfig.lightning
    if (!config) throw new Error('Lightning not configured')

    const response = await fetch(`${config.apiUrl}/api/v1/payments/${paymentHash}`, {
      headers: {
        'X-Api-Key': config.apiKey,
      },
    })

    if (!response.ok) {
      return {
        paymentId,
        verified: false,
        chain: 'lightning',
        amount: expectedAmount,
        currency: 'BTC',
        error: 'Payment not found',
      }
    }

    const data = await response.json()

    return {
      paymentId,
      verified: data.paid === true,
      chain: 'lightning',
      amount: expectedAmount,
      currency: 'BTC',
      signature: paymentHash,
      verifiedAt: data.paid ? Date.now() : undefined,
    }
  }

  /**
   * Verify BTCPay payment
   */
  private async verifyBtcpayPayment(
    paymentId: string,
    invoiceId: string,
    expectedAmount: number
  ): Promise<PaymentVerification> {
    const config = this.config.chainConfig.lightning
    if (!config || !config.storeId) {
      throw new Error('BTCPay not properly configured')
    }

    const response = await fetch(
      `${config.apiUrl}/api/v1/stores/${config.storeId}/invoices/${invoiceId}`,
      {
        headers: {
          Authorization: `token ${config.apiKey}`,
        },
      }
    )

    if (!response.ok) {
      return {
        paymentId,
        verified: false,
        chain: 'lightning',
        amount: expectedAmount,
        currency: 'BTC',
        error: 'Invoice not found',
      }
    }

    const data = await response.json()

    return {
      paymentId,
      verified: data.status === 'Settled',
      chain: 'lightning',
      amount: expectedAmount,
      currency: 'BTC',
      signature: invoiceId,
      verifiedAt: data.status === 'Settled' ? Date.now() : undefined,
    }
  }

  /**
   * Verify Ethereum/L2 payment
   */
  private async verifyEthereumPayment(
    state: PaymentState,
    chain: PaymentChain
  ): Promise<PaymentVerification> {
    // Placeholder - implement Ethereum verification
    // This would use ethers.js or viem to check transaction on L2
    return {
      paymentId: state.id,
      verified: false,
      chain,
      amount: 0,
      currency: 'ETH',
      error: 'Ethereum verification not yet implemented',
    }
  }

  // ============================================================================
  // RATE LIMITING
  // ============================================================================

  /**
   * Check rate limit for endpoint
   */
  async checkRateLimit(key: string, endpoint: string, isPaid: boolean): Promise<RateLimitResult> {
    if (!this.config.rateLimit) {
      return { allowed: true, remaining: Infinity, resetAt: 0 }
    }

    // Use custom handler if provided
    if (this.config.rateLimit.customHandler) {
      const limit = isPaid ? this.config.rateLimit.paid : this.config.rateLimit.free
      if (!limit) {
        return { allowed: true, remaining: Infinity, resetAt: 0 }
      }
      return this.config.rateLimit.customHandler.check(key, limit.requests, limit.window)
    }

    // Use built-in in-memory rate limiting
    const limit = isPaid ? this.config.rateLimit.paid : this.config.rateLimit.free
    if (!limit) {
      return { allowed: true, remaining: Infinity, resetAt: 0 }
    }

    const now = Date.now()
    const stored = this.rateLimitStore.get(key)

    if (!stored || stored.resetAt < now) {
      // Reset window
      this.rateLimitStore.set(key, { count: 1, resetAt: now + limit.window })
      return { allowed: true, remaining: limit.requests - 1, resetAt: now + limit.window }
    }

    if (stored.count >= limit.requests) {
      return { allowed: false, remaining: 0, resetAt: stored.resetAt }
    }

    // Increment count
    stored.count++
    return { allowed: true, remaining: limit.requests - stored.count, resetAt: stored.resetAt }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Get pricing for endpoint (supports wildcards)
   */
  private getPricingForEndpoint(endpoint: string): EndpointPricing | null {
    // Exact match first
    if (this.config.pricing[endpoint]) {
      return this.config.pricing[endpoint]
    }

    // Wildcard match
    for (const [pattern, pricing] of Object.entries(this.config.pricing)) {
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
        if (regex.test(endpoint)) {
          return pricing
        }
      }
    }

    return null
  }

  private getDefaultSolanaRpc(network: 'mainnet-beta' | 'devnet' | 'testnet'): string {
    switch (network) {
      case 'mainnet-beta':
        return 'https://api.mainnet-beta.solana.com'
      case 'devnet':
        return 'https://api.devnet.solana.com'
      case 'testnet':
        return 'https://api.testnet.solana.com'
    }
  }

  private trackPayment(verification: PaymentVerification): void {
    if (!this.config.analytics?.enabled) return

    // Track with PostHog or custom analytics
    console.log('[PaymentGate] Payment verified:', verification)
  }
}
