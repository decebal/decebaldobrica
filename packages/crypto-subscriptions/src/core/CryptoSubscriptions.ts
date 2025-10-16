/**
 * Unified Crypto Subscriptions API
 * Main class for managing multi-chain crypto subscription payments
 */

import { SolanaPayHandler } from '../solana'
import { LightningHandler } from '../lightning'
import { EthereumHandler } from '../ethereum'
import type {
  CryptoSubscriptionsConfig,
  CreatePaymentRequest,
  PaymentResponse,
  PaymentVerification,
  Subscription,
  PaymentChain,
  TierPricing,
  SubscriptionInterval,
} from './types'

export class CryptoSubscriptions {
  private solanaHandler?: SolanaPayHandler
  private lightningHandler?: LightningHandler
  private ethereumHandler?: EthereumHandler

  constructor(private config: CryptoSubscriptionsConfig) {
    // Initialize handlers based on config
    if (config.solana) {
      this.solanaHandler = new SolanaPayHandler(config.solana)
    }
    if (config.lightning) {
      this.lightningHandler = new LightningHandler(config.lightning)
    }
    if (config.ethereum) {
      this.ethereumHandler = new EthereumHandler(config.ethereum)
    }

    if (!this.solanaHandler && !this.lightningHandler && !this.ethereumHandler) {
      throw new Error('At least one payment chain must be configured')
    }
  }

  /**
   * Create a subscription payment
   */
  async createSubscriptionPayment(
    request: CreatePaymentRequest,
    pricing: TierPricing
  ): Promise<PaymentResponse> {
    const { chain, interval } = request

    // Get price for the selected interval
    const priceData = pricing.prices[interval]
    if (!priceData) {
      throw new Error(`Pricing not configured for ${interval} interval`)
    }

    let payment: PaymentResponse

    switch (chain) {
      case 'solana': {
        if (!this.solanaHandler) {
          throw new Error('Solana not configured')
        }

        const amount = priceData.sol || await this.solanaHandler.convertUSDToSOL(priceData.usd)
        payment = await this.solanaHandler.createPayment(request, amount)
        break
      }

      case 'lightning': {
        if (!this.lightningHandler) {
          throw new Error('Lightning not configured')
        }

        const amountSats = priceData.btc
          ? Math.round(priceData.btc * 100000000)
          : await this.lightningHandler.convertUSDToSats(priceData.usd)

        payment = await this.lightningHandler.createPayment(request, amountSats)
        break
      }

      case 'ethereum': {
        if (!this.ethereumHandler) {
          throw new Error('Ethereum not configured')
        }

        const amount = priceData.eth || await this.ethereumHandler.convertUSDToETH(priceData.usd)
        payment = await this.ethereumHandler.createPayment(request, amount, 'ETH')
        break
      }

      default:
        throw new Error(`Unsupported chain: ${chain}`)
    }

    // Store payment in database if adapter provided
    if (this.config.database) {
      await this.config.database.createPayment(payment)
    }

    return payment
  }

  /**
   * Verify a payment
   */
  async verifyPayment(
    paymentId: string,
    chain: PaymentChain,
    expectedAmount: number
  ): Promise<PaymentVerification> {
    let verification: PaymentVerification

    switch (chain) {
      case 'solana':
        if (!this.solanaHandler) throw new Error('Solana not configured')
        verification = await this.solanaHandler.verifyPayment(paymentId, expectedAmount)
        break

      case 'lightning':
        if (!this.lightningHandler) throw new Error('Lightning not configured')
        verification = await this.lightningHandler.verifyPayment(paymentId)
        break

      case 'ethereum':
        if (!this.ethereumHandler) throw new Error('Ethereum not configured')
        verification = await this.ethereumHandler.verifyPayment(
          paymentId as `0x${string}`,
          expectedAmount,
          'ETH'
        )
        break

      default:
        throw new Error(`Unsupported chain: ${chain}`)
    }

    // Update payment status in database
    if (this.config.database && verification.verified) {
      await this.config.database.updatePaymentStatus(paymentId, 'confirmed')
    }

    return verification
  }

  /**
   * Create a subscription after payment confirmation
   */
  async activateSubscription(
    subscriberId: string,
    request: CreatePaymentRequest,
    paymentVerification: PaymentVerification
  ): Promise<Subscription> {
    if (!paymentVerification.verified) {
      throw new Error('Payment not verified')
    }

    const now = new Date()
    const expiresAt = this.calculateExpiryDate(request.interval, now)
    const nextBillingDate = request.interval !== 'lifetime'
      ? expiresAt
      : undefined

    const subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> = {
      subscriberId,
      tier: request.tier,
      interval: request.interval,
      status: 'active',
      chain: request.chain,
      amount: paymentVerification.amount,
      currency: paymentVerification.currency,
      startDate: now,
      expiresAt: request.interval !== 'lifetime' ? expiresAt : undefined,
      nextBillingDate,
      cancelAtPeriodEnd: false,
      paymentId: paymentVerification.paymentId,
    }

    if (!this.config.database) {
      throw new Error('Database adapter required for subscription management')
    }

    return await this.config.database.createSubscription(subscription)
  }

  /**
   * Get subscription by subscriber ID
   */
  async getSubscription(subscriberId: string): Promise<Subscription | null> {
    if (!this.config.database) {
      throw new Error('Database adapter required')
    }

    return await this.config.database.getSubscription(subscriberId)
  }

  /**
   * Cancel a subscription (at period end)
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    if (!this.config.database) {
      throw new Error('Database adapter required')
    }

    await this.config.database.updateSubscription(subscriptionId, {
      cancelAtPeriodEnd: true,
    })
  }

  /**
   * Upgrade a subscription tier
   */
  async upgradeSubscription(
    subscriptionId: string,
    newTier: string,
    paymentId: string
  ): Promise<void> {
    if (!this.config.database) {
      throw new Error('Database adapter required')
    }

    await this.config.database.updateSubscription(subscriptionId, {
      tier: newTier,
      paymentId,
      updatedAt: new Date(),
    })
  }

  /**
   * Check if subscription is active and not expired
   */
  async isSubscriptionActive(subscriberId: string): Promise<boolean> {
    const subscription = await this.getSubscription(subscriberId)

    if (!subscription || subscription.status !== 'active') {
      return false
    }

    if (subscription.expiresAt && subscription.expiresAt < new Date()) {
      return false
    }

    return true
  }

  /**
   * Get price conversion for all chains
   */
  async getPriceConversions(usdAmount: number): Promise<{
    usd: number
    sol: number
    btc: number
    eth: number
  }> {
    const [sol, btc, eth] = await Promise.all([
      this.solanaHandler?.convertUSDToSOL(usdAmount),
      this.lightningHandler?.convertUSDToSats(usdAmount).then(sats => sats / 100000000),
      this.ethereumHandler?.convertUSDToETH(usdAmount),
    ])

    return {
      usd: usdAmount,
      sol: sol || 0,
      btc: btc || 0,
      eth: eth || 0,
    }
  }

  // ============= Private Helper Methods =============

  private calculateExpiryDate(
    interval: SubscriptionInterval,
    startDate: Date
  ): Date {
    const expiry = new Date(startDate)

    switch (interval) {
      case 'monthly':
        expiry.setMonth(expiry.getMonth() + 1)
        break
      case 'yearly':
        expiry.setFullYear(expiry.getFullYear() + 1)
        break
      case 'lifetime':
        // 100 years in the future
        expiry.setFullYear(expiry.getFullYear() + 100)
        break
    }

    return expiry
  }
}
