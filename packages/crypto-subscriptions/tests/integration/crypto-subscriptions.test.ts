/**
 * CryptoSubscriptions Integration Tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CryptoSubscriptions } from '../../src/core/CryptoSubscriptions'
import { TEST_CONFIG, TEST_PRICING } from '../fixtures/config'
import { createTestPaymentRequest } from '../fixtures/requests'
import { MockDatabaseAdapter } from '../mocks/database'

describe('CryptoSubscriptions Integration', () => {
  let subscriptions: CryptoSubscriptions
  let database: MockDatabaseAdapter

  beforeEach(() => {
    database = new MockDatabaseAdapter()
    subscriptions = new CryptoSubscriptions({
      ...TEST_CONFIG,
      database,
    })

    // Mock crypto price APIs
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('solana')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ solana: { usd: 100 } }),
        } as Response)
      }
      if (url.includes('bitcoin')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ bitcoin: { usd: 50000 } }),
        } as Response)
      }
      if (url.includes('ethereum')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ ethereum: { usd: 2000 } }),
        } as Response)
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  describe('constructor', () => {
    it('should initialize with all chains', () => {
      expect(subscriptions).toBeDefined()
    })

    it('should throw error if no chains configured', () => {
      expect(() => {
        new CryptoSubscriptions({})
      }).toThrow('At least one payment chain must be configured')
    })

    it('should work with only Solana configured', () => {
      const solanaSubs = new CryptoSubscriptions({
        solana: TEST_CONFIG.solana,
      })
      expect(solanaSubs).toBeDefined()
    })
  })

  describe('createSubscriptionPayment', () => {
    it('should create Solana payment with USD conversion', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      expect(payment).toBeDefined()
      expect(payment.chain).toBe('solana')
      expect(payment.currency).toBe('SOL')
      // $9.99 / $100 = 0.0999 SOL
      expect(payment.amount).toBeCloseTo(0.0999, 3)
      expect(payment.solana).toBeDefined()
    })

    it('should create Lightning payment with USD conversion', async () => {
      // Mock LNBits API
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('bitcoin')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ bitcoin: { usd: 50000 } }),
          } as Response)
        }
        if (url.includes('lnbits')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              payment_hash: 'test-hash',
              payment_request: 'lnbc1test',
              checking_id: 'check-123',
              lnurl_response: null,
              qr_code: 'qr-data',
            }),
          } as Response)
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const request = createTestPaymentRequest({ chain: 'lightning' })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      expect(payment).toBeDefined()
      expect(payment.chain).toBe('lightning')
      expect(payment.currency).toBe('BTC')
      expect(payment.lightning).toBeDefined()
    })

    it('should create Ethereum payment with USD conversion', async () => {
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      expect(payment).toBeDefined()
      expect(payment.chain).toBe('ethereum')
      expect(payment.currency).toBe('ETH')
      // $9.99 / $2000 = 0.004995 ETH
      expect(payment.amount).toBeCloseTo(0.004995, 5)
      expect(payment.ethereum).toBeDefined()
    })

    it('should store payment in database if adapter provided', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      const storedPayment = await database.getPayment(payment.paymentId)
      expect(storedPayment).toBeDefined()
      expect(storedPayment?.paymentId).toBe(payment.paymentId)
    })

    it('should support yearly subscription', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        interval: 'yearly',
      })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      expect(payment).toBeDefined()
      // $99.90 / $100 = 0.999 SOL
      expect(payment.amount).toBeCloseTo(0.999, 3)
    })

    it('should support lifetime subscription', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        interval: 'lifetime',
      })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.pro)

      expect(payment).toBeDefined()
      // $999 / $100 = 9.99 SOL
      expect(payment.amount).toBeCloseTo(9.99, 2)
    })

    it('should throw error for unsupported chain', async () => {
      const request = createTestPaymentRequest({ chain: 'bitcoin' as any })

      await expect(
        subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)
      ).rejects.toThrow('Unsupported chain')
    })

    it('should throw error if pricing not configured for interval', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        interval: 'yearly',
      })

      // Free tier has no yearly pricing
      await expect(
        subscriptions.createSubscriptionPayment(request, TEST_PRICING.free)
      ).rejects.toThrow('Pricing not configured')
    })
  })

  describe('activateSubscription', () => {
    it('should create subscription after payment verification', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        transactionHash: 'tx-hash-123',
        amount: payment.amount,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
      }

      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      expect(subscription).toBeDefined()
      expect(subscription.subscriberId).toBe(request.subscriberId)
      expect(subscription.tier).toBe(request.tier)
      expect(subscription.interval).toBe(request.interval)
      expect(subscription.status).toBe('active')
      expect(subscription.chain).toBe('solana')
      expect(subscription.paymentId).toBe(mockVerification.paymentId)
    })

    it('should set correct expiry for monthly subscription', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        interval: 'monthly',
      })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
      }

      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      const expectedExpiry = new Date()
      expectedExpiry.setMonth(expectedExpiry.getMonth() + 1)

      expect(subscription.expiresAt).toBeDefined()
      expect(subscription.expiresAt?.getMonth()).toBe(expectedExpiry.getMonth())
    })

    it('should set correct expiry for yearly subscription', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        interval: 'yearly',
      })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
      }

      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      const expectedExpiry = new Date()
      expectedExpiry.setFullYear(expectedExpiry.getFullYear() + 1)

      expect(subscription.expiresAt).toBeDefined()
      expect(subscription.expiresAt?.getFullYear()).toBe(expectedExpiry.getFullYear())
    })

    it('should handle lifetime subscription correctly', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        interval: 'lifetime',
      })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.pro)

      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
      }

      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      expect(subscription.expiresAt).toBeUndefined()
      expect(subscription.nextBillingDate).toBeUndefined()
    })

    it('should throw error if payment not verified', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })

      const mockVerification = {
        verified: false,
        paymentId: 'fake-id',
        amount: 0.1,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
        error: 'Payment not found',
      }

      await expect(
        subscriptions.activateSubscription(request.subscriberId, request, mockVerification)
      ).rejects.toThrow('Payment not verified')
    })
  })

  describe('subscription management', () => {
    let testSubscription: any

    beforeEach(async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const payment = await subscriptions.createSubscriptionPayment(request, TEST_PRICING.premium)

      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
      }

      testSubscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )
    })

    it('should get subscription by subscriber ID', async () => {
      const subscription = await subscriptions.getSubscription(testSubscription.subscriberId)

      expect(subscription).toBeDefined()
      expect(subscription?.id).toBe(testSubscription.id)
      expect(subscription?.subscriberId).toBe(testSubscription.subscriberId)
    })

    it('should check if subscription is active', async () => {
      const isActive = await subscriptions.isSubscriptionActive(testSubscription.subscriberId)
      expect(isActive).toBe(true)
    })

    it('should cancel subscription', async () => {
      await subscriptions.cancelSubscription(testSubscription.id)

      const subscription = await database.getSubscription(testSubscription.subscriberId)
      expect(subscription?.cancelAtPeriodEnd).toBe(true)
    })

    it('should upgrade subscription tier', async () => {
      await subscriptions.upgradeSubscription(testSubscription.id, 'pro', 'new-payment-id')

      const subscription = await database.getSubscription(testSubscription.subscriberId)
      expect(subscription?.tier).toBe('pro')
      expect(subscription?.paymentId).toBe('new-payment-id')
    })
  })

  describe('getPriceConversions', () => {
    it('should get prices in all currencies', async () => {
      const conversions = await subscriptions.getPriceConversions(10)

      expect(conversions).toBeDefined()
      expect(conversions.usd).toBe(10)
      expect(conversions.sol).toBeCloseTo(0.1, 3) // $10 / $100
      expect(conversions.btc).toBeCloseTo(0.0002, 6) // $10 / $50000
      expect(conversions.eth).toBeCloseTo(0.005, 5) // $10 / $2000
    })
  })

  describe('error handling', () => {
    it('should handle unconfigured chain', async () => {
      const solanaSubs = new CryptoSubscriptions({
        solana: TEST_CONFIG.solana,
      })

      const request = createTestPaymentRequest({ chain: 'lightning' })

      await expect(
        solanaSubs.createSubscriptionPayment(request, TEST_PRICING.premium)
      ).rejects.toThrow('Lightning not configured')
    })

    it('should require database for subscription operations', async () => {
      const subsWithoutDb = new CryptoSubscriptions({
        solana: TEST_CONFIG.solana,
      })

      const request = createTestPaymentRequest({ chain: 'solana' })
      const mockVerification = {
        verified: true,
        paymentId: 'test-id',
        amount: 0.1,
        currency: 'SOL',
        chain: 'solana' as const,
        timestamp: new Date(),
      }

      await expect(
        subsWithoutDb.activateSubscription(request.subscriberId, request, mockVerification)
      ).rejects.toThrow('Database adapter required')
    })
  })
})
