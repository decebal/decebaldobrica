/**
 * Payment Gate Client SDK
 * Auto-retry API calls with payment
 */

import type {
  ApiResponse,
  Http402Response,
  PaymentGateClientConfig,
  PaymentOption,
} from '../core/types'

export class PaymentGateClient {
  private config: Required<PaymentGateClientConfig>

  constructor(config: PaymentGateClientConfig = {}) {
    this.config = {
      preferredChain: config.preferredChain || 'solana',
      autoRetry: config.autoRetry ?? true,
      walletAdapter: config.walletAdapter || null,
      pollingInterval: config.pollingInterval || 2000,
      timeout: config.timeout || 300000, // 5 minutes
    } as Required<PaymentGateClientConfig>
  }

  /**
   * Make API request with automatic payment handling
   */
  async fetch<T = unknown>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, init)

      // Success - return data
      if (response.ok) {
        const data = await response.json()
        return { data, status: response.status }
      }

      // Payment required
      if (response.status === 402) {
        const payment: Http402Response = await response.json()

        if (this.config.autoRetry) {
          // Automatically handle payment and retry
          return this.handlePaymentAndRetry<T>(url, init, payment)
        }

        // Return payment info for manual handling
        return {
          status: 402,
          payment,
          error: 'Payment required',
        }
      }

      // Other error
      const error = await response.text()
      return {
        status: response.status,
        error: error || `Request failed with status ${response.status}`,
      }
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  /**
   * Handle payment and retry request
   */
  private async handlePaymentAndRetry<T>(
    url: string,
    init: RequestInit | undefined,
    payment: Http402Response
  ): Promise<ApiResponse<T>> {
    // Select payment option
    const option = this.selectPaymentOption(payment.paymentOptions)
    if (!option) {
      return {
        status: 402,
        payment,
        error: 'No supported payment method available',
      }
    }

    // Process payment
    const paymentResult = await this.processPayment(option)
    if (!paymentResult.success) {
      return {
        status: 402,
        payment,
        error: paymentResult.error || 'Payment failed',
      }
    }

    // Wait for confirmation
    const verified = await this.waitForPaymentConfirmation(payment.paymentId, option)
    if (!verified) {
      return {
        status: 402,
        payment,
        error: 'Payment verification timeout',
      }
    }

    // Retry original request with payment ID
    const retryHeaders = {
      ...(init?.headers || {}),
      'X-Payment-Id': payment.paymentId,
    }

    const retryResponse = await fetch(url, {
      ...init,
      headers: retryHeaders,
    })

    if (retryResponse.ok) {
      const data = await retryResponse.json()
      return { data, status: retryResponse.status }
    }

    const error = await retryResponse.text()
    return {
      status: retryResponse.status,
      error: error || 'Request failed after payment',
    }
  }

  /**
   * Select preferred payment option
   */
  private selectPaymentOption(options: PaymentOption[]): PaymentOption | null {
    // Try preferred chain first
    const preferred = options.find((opt) => opt.chain === this.config.preferredChain)
    if (preferred) return preferred

    // Fall back to first available
    return options[0] || null
  }

  /**
   * Process payment using wallet adapter
   */
  private async processPayment(
    option: PaymentOption
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.config.walletAdapter) {
      // No wallet adapter - user must pay manually
      // Show QR code or payment URL
      console.log('Payment required:', option.paymentUrl)
      if (option.qrCode) {
        console.log('QR Code:', option.qrCode)
      }
      return { success: false, error: 'No wallet adapter configured' }
    }

    try {
      // Connect wallet if not connected
      if (!this.config.walletAdapter.isConnected()) {
        await this.config.walletAdapter.connect()
      }

      // Send payment
      await this.config.walletAdapter.sendPayment(option)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      }
    }
  }

  /**
   * Wait for payment confirmation
   */
  private async waitForPaymentConfirmation(
    paymentId: string,
    option: PaymentOption
  ): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < this.config.timeout) {
      // Poll payment status (this would call a verification endpoint)
      // For now, we'll wait for blockchain confirmation
      await new Promise((resolve) => setTimeout(resolve, this.config.pollingInterval))

      // Check if payment is confirmed
      // This is placeholder - actual implementation would verify on-chain
      const confirmed = await this.checkPaymentStatus(paymentId, option)
      if (confirmed) {
        return true
      }
    }

    return false
  }

  /**
   * Check payment status
   */
  private async checkPaymentStatus(paymentId: string, option: PaymentOption): Promise<boolean> {
    // Placeholder - implement actual verification
    // This would check the blockchain or call a verification endpoint
    return false
  }
}

/**
 * Create a fetch function with payment gate support
 */
export function createPaymentGateFetch(config: PaymentGateClientConfig = {}) {
  const client = new PaymentGateClient(config)
  return <T = unknown>(url: string, init?: RequestInit) => client.fetch<T>(url, init)
}
