/**
 * HTTP 402 Payment Required Handler
 * Generates standardized 402 responses with payment options
 */

import { Keypair } from '@solana/web3.js'
import type {
  EndpointPricing,
  Http402Response,
  PaymentChain,
  PaymentGateConfig,
  PaymentOption,
  PaymentState,
} from './types'

export class Http402Handler {
  constructor(private config: PaymentGateConfig) {}

  /**
   * Generate HTTP 402 response with payment options
   */
  async generatePaymentRequired(
    endpoint: string,
    pricing: EndpointPricing,
    requestMetadata?: PaymentState['requestMetadata']
  ): Promise<Http402Response> {
    // Generate unique payment ID
    const paymentId = this.generatePaymentId()

    // Calculate expiration (default 15 minutes)
    const expiresAt = Date.now() + (this.config.paymentTimeout || 900000)

    // Generate payment options for each configured chain
    const paymentOptions = await this.generatePaymentOptions(paymentId, pricing)

    // Create payment state (to be stored by middleware)
    const paymentState: PaymentState = {
      id: paymentId,
      status: 'pending',
      endpoint,
      amountUsd: pricing.usd || 0,
      createdAt: Date.now(),
      expiresAt,
      requestMetadata,
    }

    // Store payment state (middleware will handle this)
    await this.storePaymentState(paymentState)

    return {
      status: 402,
      message: 'Payment required to access this endpoint',
      paymentOptions,
      paymentId,
      expiresAt,
      retryAfterPayment: {
        method: requestMetadata?.method || 'GET',
        url: requestMetadata?.url || endpoint,
        headers: {
          'X-Payment-Id': paymentId,
        },
      },
    }
  }

  /**
   * Generate payment options for all configured chains
   */
  private async generatePaymentOptions(
    paymentId: string,
    pricing: EndpointPricing
  ): Promise<PaymentOption[]> {
    const options: PaymentOption[] = []

    for (const chain of this.config.chains) {
      const option = await this.generateChainPaymentOption(paymentId, chain, pricing)
      if (option) {
        options.push(option)
      }
    }

    return options
  }

  /**
   * Generate payment option for specific chain
   */
  private async generateChainPaymentOption(
    paymentId: string,
    chain: PaymentChain,
    pricing: EndpointPricing
  ): Promise<PaymentOption | null> {
    switch (chain) {
      case 'solana':
        return this.generateSolanaOption(paymentId, pricing)

      case 'lightning':
        return this.generateLightningOption(paymentId, pricing)

      case 'ethereum':
      case 'base':
      case 'arbitrum':
      case 'optimism':
        return this.generateEthereumOption(paymentId, chain, pricing)

      default:
        return null
    }
  }

  /**
   * Generate Solana payment option
   */
  private async generateSolanaOption(
    paymentId: string,
    pricing: EndpointPricing
  ): Promise<PaymentOption | null> {
    const solanaConfig = this.config.chainConfig.solana
    if (!solanaConfig) return null

    // Get amount in SOL
    const amount = pricing.sol || (await this.convertUsdToSol(pricing.usd || 0))

    // Generate unique reference
    const reference = Keypair.generate().publicKey.toString()

    // Create Solana Pay URL
    const paymentUrl = this.createSolanaPayUrl({
      recipient: solanaConfig.merchantWallet,
      amount,
      reference,
      label: `Payment for ${paymentId}`,
    })

    return {
      chain: 'solana',
      amount,
      currency: 'SOL',
      paymentUrl,
      reference,
      recipient: solanaConfig.merchantWallet,
      label: `Payment for API access`,
      message: `Pay ${amount} SOL to access this endpoint`,
    }
  }

  /**
   * Generate Lightning payment option
   */
  private async generateLightningOption(
    paymentId: string,
    pricing: EndpointPricing
  ): Promise<PaymentOption | null> {
    const lightningConfig = this.config.chainConfig.lightning
    if (!lightningConfig) return null

    // Get amount in satoshis
    const btcAmount = pricing.btc || (await this.convertUsdToBtc(pricing.usd || 0))
    const amountSats = Math.round(btcAmount * 100000000)

    // Generate invoice via provider (LNBits or BTCPay)
    const invoice = await this.createLightningInvoice(amountSats, paymentId)

    return {
      chain: 'lightning',
      amount: btcAmount,
      currency: 'BTC',
      paymentUrl: invoice.paymentRequest,
      reference: invoice.paymentHash,
      recipient: lightningConfig.apiUrl,
      label: 'Lightning Payment',
      message: `Pay ${amountSats} sats via Lightning`,
    }
  }

  /**
   * Generate Ethereum/L2 payment option
   */
  private async generateEthereumOption(
    paymentId: string,
    chain: PaymentChain,
    pricing: EndpointPricing
  ): Promise<PaymentOption | null> {
    const ethereumConfig = this.config.chainConfig.ethereum
    if (!ethereumConfig) return null

    // Get amount in ETH or USDC
    const amount = pricing.eth || (await this.convertUsdToEth(pricing.usd || 0))

    // Use USDC if configured, otherwise ETH
    const currency = ethereumConfig.acceptedTokens?.includes('USDC') ? 'USDC' : 'ETH'

    // Generate unique reference
    const reference = `0x${Buffer.from(paymentId).toString('hex')}`

    return {
      chain,
      amount,
      currency,
      paymentUrl: `ethereum:${ethereumConfig.merchantWallet}?value=${amount}`,
      reference,
      recipient: ethereumConfig.merchantWallet,
      label: `${chain.toUpperCase()} Payment`,
      message: `Pay ${amount} ${currency}`,
    }
  }

  /**
   * Create Solana Pay URL
   */
  private createSolanaPayUrl(params: {
    recipient: string
    amount: number
    reference: string
    label: string
  }): string {
    const { recipient, amount, reference, label } = params
    const url = new URL('solana:' + recipient)
    url.searchParams.set('amount', amount.toString())
    url.searchParams.set('reference', reference)
    url.searchParams.set('label', label)
    return url.toString()
  }

  /**
   * Create Lightning invoice
   */
  private async createLightningInvoice(
    amountSats: number,
    memo: string
  ): Promise<{ paymentRequest: string; paymentHash: string }> {
    const config = this.config.chainConfig.lightning
    if (!config) {
      throw new Error('Lightning not configured')
    }

    // Implementation depends on provider (LNBits or BTCPay)
    if (config.provider === 'lnbits') {
      return this.createLnbitsInvoice(amountSats, memo)
    }

    if (config.provider === 'btcpay') {
      return this.createBtcpayInvoice(amountSats, memo)
    }

    throw new Error(`Unsupported Lightning provider: ${config.provider}`)
  }

  /**
   * Create LNBits invoice
   */
  private async createLnbitsInvoice(
    amountSats: number,
    memo: string
  ): Promise<{ paymentRequest: string; paymentHash: string }> {
    const config = this.config.chainConfig.lightning
    if (!config) throw new Error('Lightning not configured')

    const response = await fetch(`${config.apiUrl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': config.apiKey,
      },
      body: JSON.stringify({
        out: false,
        amount: amountSats,
        memo,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create LNBits invoice')
    }

    const data = await response.json()
    return {
      paymentRequest: data.payment_request,
      paymentHash: data.payment_hash,
    }
  }

  /**
   * Create BTCPay invoice
   */
  private async createBtcpayInvoice(
    amountSats: number,
    memo: string
  ): Promise<{ paymentRequest: string; paymentHash: string }> {
    const config = this.config.chainConfig.lightning
    if (!config || !config.storeId) {
      throw new Error('BTCPay not properly configured')
    }

    const response = await fetch(`${config.apiUrl}/api/v1/stores/${config.storeId}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${config.apiKey}`,
      },
      body: JSON.stringify({
        amount: amountSats / 100000000, // Convert to BTC
        currency: 'BTC',
        metadata: { memo },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create BTCPay invoice')
    }

    const data = await response.json()
    return {
      paymentRequest: data.lightningInvoice || data.id,
      paymentHash: data.id,
    }
  }

  // ============================================================================
  // CURRENCY CONVERSION
  // ============================================================================

  private async convertUsdToSol(usd: number): Promise<number> {
    // Use CoinGecko or similar API for real-time conversion
    // For now, using approximate rate (update with actual API)
    const SOL_USD_RATE = 150 // $150 per SOL (example)
    return Number((usd / SOL_USD_RATE).toFixed(6))
  }

  private async convertUsdToBtc(usd: number): Promise<number> {
    const BTC_USD_RATE = 65000 // $65k per BTC (example)
    return Number((usd / BTC_USD_RATE).toFixed(8))
  }

  private async convertUsdToEth(usd: number): Promise<number> {
    const ETH_USD_RATE = 3500 // $3.5k per ETH (example)
    return Number((usd / ETH_USD_RATE).toFixed(6))
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private generatePaymentId(): string {
    return `pg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private async storePaymentState(state: PaymentState): Promise<void> {
    // This will be implemented by middleware
    // For now, we'll use in-memory storage
    if (typeof globalThis !== 'undefined') {
      ;(globalThis as any).__paymentGateStates =
        (globalThis as any).__paymentGateStates || new Map()
      ;(globalThis as any).__paymentGateStates.set(state.id, state)
    }
  }

  /**
   * Get payment state
   */
  async getPaymentState(paymentId: string): Promise<PaymentState | null> {
    if (typeof globalThis !== 'undefined') {
      const states = (globalThis as any).__paymentGateStates
      return states?.get(paymentId) || null
    }
    return null
  }

  /**
   * Update payment state
   */
  async updatePaymentState(paymentId: string, updates: Partial<PaymentState>): Promise<void> {
    const state = await this.getPaymentState(paymentId)
    if (state && typeof globalThis !== 'undefined') {
      const updatedState = { ...state, ...updates }
      ;(globalThis as any).__paymentGateStates.set(paymentId, updatedState)
    }
  }
}
