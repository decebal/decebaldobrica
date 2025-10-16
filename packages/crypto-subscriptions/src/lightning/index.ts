/**
 * Bitcoin Lightning Network integration for crypto subscriptions
 * Instant payments with fees <$0.01
 * Supports LNBits and BTCPay Server
 */

import type { CreatePaymentRequest, PaymentResponse, PaymentVerification } from '../core/types'

export interface LightningConfig {
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

interface LNBitsInvoice {
  payment_hash: string
  payment_request: string
  checking_id: string
  lnurl_response: string | null
  qr_code: string
}

interface LNBitsPaymentStatus {
  paid: boolean
  preimage: string | null
  details: {
    checking_id: string
    pending: boolean
    amount: number
    fee: number
    memo: string
    time: number
    bolt11: string
    preimage: string | null
    payment_hash: string
  }
}

interface BTCPayInvoice {
  id: string
  storeId: string
  amount: string
  currency: string
  type: 'Standard'
  checkoutLink: string
  status: 'New' | 'Processing' | 'Settled' | 'Invalid' | 'Expired'
  additionalStatus: string
  availableStatusesForManualMarking: string[]
  archived: boolean
  createdTime: number
  expirationTime: number
  monitoringExpiration: number
  metadata: Record<string, unknown>
}

export class LightningHandler {
  constructor(private config: LightningConfig) {
    if (config.provider === 'lnbits' && (!config.lnbitsUrl || !config.lnbitsApiKey)) {
      throw new Error('LNBits URL and API key are required for LNBits provider')
    }
    if (
      config.provider === 'btcpay' &&
      (!config.btcpayUrl || !config.btcpayApiKey || !config.btcpayStoreId)
    ) {
      throw new Error('BTCPay URL, API key, and Store ID are required for BTCPay provider')
    }
  }

  /**
   * Create a Lightning Network payment invoice
   */
  async createPayment(request: CreatePaymentRequest, amountSats: number): Promise<PaymentResponse> {
    if (this.config.provider === 'lnbits') {
      return this.createLNBitsPayment(request, amountSats)
    }
    return this.createBTCPayPayment(request, amountSats)
  }

  /**
   * Verify a Lightning Network payment
   */
  async verifyPayment(paymentHash: string): Promise<PaymentVerification> {
    if (this.config.provider === 'lnbits') {
      return this.verifyLNBitsPayment(paymentHash)
    }
    return this.verifyBTCPayPayment(paymentHash)
  }

  /**
   * Poll for payment confirmation
   */
  async pollPayment(
    paymentHash: string,
    expectedAmount: number,
    timeoutMs = 300000, // 5 minutes for Lightning
    intervalMs = 3000
  ): Promise<PaymentVerification> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeoutMs) {
      const verification = await this.verifyPayment(paymentHash)

      if (verification.verified) {
        return verification
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    return {
      verified: false,
      paymentId: paymentHash,
      amount: expectedAmount,
      currency: 'BTC',
      chain: 'lightning',
      timestamp: new Date(),
      error: 'Payment timeout',
    }
  }

  /**
   * Get current BTC price in USD
   */
  async getBtcPriceUSD(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      )
      const data = await response.json()
      return data.bitcoin.usd
    } catch (error) {
      throw new Error(`Failed to fetch BTC price: ${error}`)
    }
  }

  /**
   * Convert USD to satoshis
   */
  async convertUSDToSats(usdAmount: number): Promise<number> {
    const btcPrice = await this.getBtcPriceUSD()
    const btcAmount = usdAmount / btcPrice
    return Math.round(btcAmount * 100000000) // BTC to sats
  }

  // ============= LNBits Implementation =============

  private async createLNBitsPayment(
    request: CreatePaymentRequest,
    amountSats: number
  ): Promise<PaymentResponse> {
    try {
      const apiKey = this.config.lnbitsApiKey
      if (!apiKey) throw new Error('LNBits API key is required')

      const response = await fetch(`${this.config.lnbitsUrl}/api/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          out: false,
          amount: amountSats,
          memo: `${request.tier} subscription - ${request.interval}`,
          expiry: 900, // 15 minutes
        }),
      })

      if (!response.ok) {
        throw new Error(`LNBits API error: ${response.statusText}`)
      }

      const invoice: LNBitsInvoice = await response.json()

      return {
        paymentId: invoice.payment_hash,
        amount: amountSats / 100000000, // sats to BTC
        currency: 'BTC',
        chain: 'lightning',
        status: 'pending',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        lightning: {
          invoice: invoice.payment_request,
          qrCode: invoice.qr_code,
          hash: invoice.payment_hash,
        },
        metadata: request.metadata,
        createdAt: new Date(),
      }
    } catch (error) {
      throw new Error(`Failed to create LNBits payment: ${error}`)
    }
  }

  private async verifyLNBitsPayment(paymentHash: string): Promise<PaymentVerification> {
    try {
      const apiKey = this.config.lnbitsApiKey
      if (!apiKey) throw new Error('LNBits API key is required')

      const response = await fetch(`${this.config.lnbitsUrl}/api/v1/payments/${paymentHash}`, {
        headers: {
          'X-Api-Key': apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`LNBits API error: ${response.statusText}`)
      }

      const status: LNBitsPaymentStatus = await response.json()

      return {
        verified: status.paid,
        paymentId: paymentHash,
        transactionHash: status.preimage || undefined,
        amount: status.details.amount / 100000000, // sats to BTC
        currency: 'BTC',
        chain: 'lightning',
        timestamp: new Date(status.details.time * 1000),
        error: !status.paid ? 'Payment not confirmed' : undefined,
      }
    } catch (error) {
      return {
        verified: false,
        paymentId: paymentHash,
        amount: 0,
        currency: 'BTC',
        chain: 'lightning',
        timestamp: new Date(),
        error: `Verification failed: ${error}`,
      }
    }
  }

  // ============= BTCPay Server Implementation =============

  private async createBTCPayPayment(
    request: CreatePaymentRequest,
    amountSats: number
  ): Promise<PaymentResponse> {
    try {
      const btcAmount = amountSats / 100000000 // sats to BTC

      const response = await fetch(
        `${this.config.btcpayUrl}/api/v1/stores/${this.config.btcpayStoreId}/invoices`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${this.config.btcpayApiKey}`,
          },
          body: JSON.stringify({
            amount: btcAmount.toString(),
            currency: 'BTC',
            metadata: {
              subscriberId: request.subscriberId,
              tier: request.tier,
              interval: request.interval,
              ...request.metadata,
            },
            checkout: {
              speedPolicy: 'HighSpeed',
              paymentMethods: ['BTC-LightningNetwork'],
              expirationMinutes: 15,
              redirectURL: request.successUrl,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`BTCPay API error: ${response.statusText}`)
      }

      const invoice: BTCPayInvoice = await response.json()

      // Extract Lightning invoice from checkout link
      const checkoutResponse = await fetch(invoice.checkoutLink)
      const checkoutData = await checkoutResponse.json()
      const lightningInvoice = checkoutData.paymentMethods?.find(
        (pm: any) => pm.paymentMethod === 'BTC-LightningNetwork'
      )?.destination

      return {
        paymentId: invoice.id,
        amount: btcAmount,
        currency: 'BTC',
        chain: 'lightning',
        status: 'pending',
        expiresAt: new Date(invoice.expirationTime),
        lightning: {
          invoice: lightningInvoice || '',
          qrCode: invoice.checkoutLink, // BTCPay handles QR generation
          hash: invoice.id,
        },
        metadata: request.metadata,
        createdAt: new Date(invoice.createdTime),
      }
    } catch (error) {
      throw new Error(`Failed to create BTCPay payment: ${error}`)
    }
  }

  private async verifyBTCPayPayment(invoiceId: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(
        `${this.config.btcpayUrl}/api/v1/stores/${this.config.btcpayStoreId}/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `token ${this.config.btcpayApiKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`BTCPay API error: ${response.statusText}`)
      }

      const invoice: BTCPayInvoice = await response.json()

      return {
        verified: invoice.status === 'Settled',
        paymentId: invoiceId,
        amount: Number.parseFloat(invoice.amount),
        currency: 'BTC',
        chain: 'lightning',
        timestamp: new Date(invoice.createdTime),
        error: invoice.status !== 'Settled' ? `Status: ${invoice.status}` : undefined,
      }
    } catch (error) {
      return {
        verified: false,
        paymentId: invoiceId,
        amount: 0,
        currency: 'BTC',
        chain: 'lightning',
        timestamp: new Date(),
        error: `Verification failed: ${error}`,
      }
    }
  }
}
