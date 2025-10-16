/**
 * End-to-End Full Flow Tests
 * These tests simulate complete user journeys through the subscription system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CryptoSubscriptions } from '../../src/core/CryptoSubscriptions'
import { MockDatabaseAdapter } from '../mocks/database'
import { TEST_CONFIG, TEST_PRICING } from '../fixtures/config'
import { createTestPaymentRequest } from '../fixtures/requests'

describe('E2E: Complete Subscription Flows', () => {
  let subscriptions: CryptoSubscriptions
  let database: MockDatabaseAdapter

  beforeEach(() => {
    database = new MockDatabaseAdapter()
    subscriptions = new CryptoSubscriptions({
      ...TEST_CONFIG,
      database,
    })

    // Mock all crypto price APIs
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
  })

  describe('Solana Monthly Premium Subscription', () => {
    it('should complete full flow: create payment -> verify -> activate subscription', async () => {
      // Step 1: User selects premium monthly plan with Solana
      const request = createTestPaymentRequest({
        chain: 'solana',
        tier: 'premium',
        interval: 'monthly',
        subscriberId: 'alice-123',
        subscriberEmail: 'alice@example.com',
      })

      // Step 2: Create payment
      const payment = await subscriptions.createSubscriptionPayment(
        request,
        TEST_PRICING.premium
      )

      expect(payment).toBeDefined()
      expect(payment.chain).toBe('solana')
      expect(payment.status).toBe('pending')
      expect(payment.solana?.qrCode).toBeDefined()

      // Step 3: User pays (simulated)
      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        transactionHash: '5YNmS1R9nNSCDzJ1a7PAvMHJGrcQZGi6Wkx1xQiR8cAJfM7JZ2B',
        amount: payment.amount,
        currency: payment.currency,
        chain: payment.chain,
        timestamp: new Date(),
      }

      // Step 4: Activate subscription
      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      expect(subscription).toBeDefined()
      expect(subscription.status).toBe('active')
      expect(subscription.tier).toBe('premium')
      expect(subscription.interval).toBe('monthly')

      // Step 5: Verify subscription is active
      const isActive = await subscriptions.isSubscriptionActive('alice-123')
      expect(isActive).toBe(true)

      // Step 6: Check subscription details
      const retrievedSub = await subscriptions.getSubscription('alice-123')
      expect(retrievedSub).toBeDefined()
      expect(retrievedSub?.subscriberId).toBe('alice-123')
      expect(retrievedSub?.paymentId).toBe(mockVerification.paymentId)
    })
  })

  describe('Lightning Yearly Pro Subscription', () => {
    it('should complete full flow with Lightning Network', async () => {
      // User selects pro yearly plan with Lightning
      const request = createTestPaymentRequest({
        chain: 'lightning',
        tier: 'pro',
        interval: 'yearly',
        subscriberId: 'bob-456',
        subscriberEmail: 'bob@example.com',
      })

      // Create payment
      const payment = await subscriptions.createSubscriptionPayment(
        request,
        TEST_PRICING.pro
      )

      expect(payment).toBeDefined()
      expect(payment.chain).toBe('lightning')
      expect(payment.lightning?.invoice).toBeDefined()

      // Simulate payment verification
      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        transactionHash: 'lightning-preimage-abc123',
        amount: payment.amount,
        currency: payment.currency,
        chain: payment.chain,
        timestamp: new Date(),
      }

      // Activate subscription
      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      expect(subscription).toBeDefined()
      expect(subscription.tier).toBe('pro')
      expect(subscription.interval).toBe('yearly')

      // Verify yearly expiry (approximately 1 year from now)
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

      expect(subscription.expiresAt).toBeDefined()
      expect(subscription.expiresAt!.getFullYear()).toBe(oneYearFromNow.getFullYear())
    })
  })

  describe('Ethereum Lifetime Subscription', () => {
    it('should complete full flow with Ethereum L2', async () => {
      // User selects pro lifetime plan with Ethereum
      const request = createTestPaymentRequest({
        chain: 'ethereum',
        tier: 'pro',
        interval: 'lifetime',
        subscriberId: 'charlie-789',
        subscriberEmail: 'charlie@example.com',
      })

      // Create payment
      const payment = await subscriptions.createSubscriptionPayment(
        request,
        TEST_PRICING.pro
      )

      expect(payment).toBeDefined()
      expect(payment.chain).toBe('ethereum')
      expect(payment.ethereum?.qrCode).toContain('ethereum:')

      // Simulate payment verification
      const mockVerification = {
        verified: true,
        paymentId: payment.paymentId,
        transactionHash: '0x123abc',
        amount: payment.amount,
        currency: payment.currency,
        chain: payment.chain,
        timestamp: new Date(),
      }

      // Activate subscription
      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        mockVerification
      )

      expect(subscription).toBeDefined()
      expect(subscription.interval).toBe('lifetime')
      expect(subscription.expiresAt).toBeUndefined()
      expect(subscription.nextBillingDate).toBeUndefined()
    })
  })

  describe('Subscription Upgrades', () => {
    it('should upgrade from premium to pro', async () => {
      // Create initial premium subscription
      const premiumRequest = createTestPaymentRequest({
        chain: 'solana',
        tier: 'premium',
        interval: 'monthly',
        subscriberId: 'dave-999',
      })

      const premiumPayment = await subscriptions.createSubscriptionPayment(
        premiumRequest,
        TEST_PRICING.premium
      )

      const premiumVerification = {
        verified: true,
        paymentId: premiumPayment.paymentId,
        amount: premiumPayment.amount,
        currency: premiumPayment.currency,
        chain: premiumPayment.chain,
        timestamp: new Date(),
      }

      const premiumSub = await subscriptions.activateSubscription(
        premiumRequest.subscriberId,
        premiumRequest,
        premiumVerification
      )

      expect(premiumSub.tier).toBe('premium')

      // Upgrade to pro
      const proRequest = createTestPaymentRequest({
        chain: 'solana',
        tier: 'pro',
        interval: 'monthly',
        subscriberId: 'dave-999',
      })

      const proPayment = await subscriptions.createSubscriptionPayment(
        proRequest,
        TEST_PRICING.pro
      )

      await subscriptions.upgradeSubscription(
        premiumSub.id,
        'pro',
        proPayment.paymentId
      )

      const upgradedSub = await subscriptions.getSubscription('dave-999')
      expect(upgradedSub?.tier).toBe('pro')
      expect(upgradedSub?.paymentId).toBe(proPayment.paymentId)
    })
  })

  describe('Subscription Cancellation', () => {
    it('should cancel subscription at period end', async () => {
      // Create subscription
      const request = createTestPaymentRequest({
        chain: 'solana',
        tier: 'premium',
        interval: 'monthly',
        subscriberId: 'eve-111',
      })

      const payment = await subscriptions.createSubscriptionPayment(
        request,
        TEST_PRICING.premium
      )

      const verification = {
        verified: true,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        chain: payment.chain,
        timestamp: new Date(),
      }

      const subscription = await subscriptions.activateSubscription(
        request.subscriberId,
        request,
        verification
      )

      // Cancel subscription
      await subscriptions.cancelSubscription(subscription.id)

      const cancelledSub = await subscriptions.getSubscription('eve-111')
      expect(cancelledSub?.cancelAtPeriodEnd).toBe(true)

      // Should still be active until period end
      const isStillActive = await subscriptions.isSubscriptionActive('eve-111')
      expect(isStillActive).toBe(true)
    })
  })

  describe('Multi-User Scenarios', () => {
    it('should handle multiple users with different subscriptions', async () => {
      // User 1: Solana Premium
      const user1Request = createTestPaymentRequest({
        chain: 'solana',
        tier: 'premium',
        interval: 'monthly',
        subscriberId: 'user-1',
        subscriberEmail: 'user1@example.com',
      })

      const user1Payment = await subscriptions.createSubscriptionPayment(
        user1Request,
        TEST_PRICING.premium
      )

      await subscriptions.activateSubscription(
        'user-1',
        user1Request,
        {
          verified: true,
          paymentId: user1Payment.paymentId,
          amount: user1Payment.amount,
          currency: user1Payment.currency,
          chain: user1Payment.chain,
          timestamp: new Date(),
        }
      )

      // User 2: Lightning Pro
      const user2Request = createTestPaymentRequest({
        chain: 'lightning',
        tier: 'pro',
        interval: 'yearly',
        subscriberId: 'user-2',
        subscriberEmail: 'user2@example.com',
      })

      const user2Payment = await subscriptions.createSubscriptionPayment(
        user2Request,
        TEST_PRICING.pro
      )

      await subscriptions.activateSubscription(
        'user-2',
        user2Request,
        {
          verified: true,
          paymentId: user2Payment.paymentId,
          amount: user2Payment.amount,
          currency: user2Payment.currency,
          chain: user2Payment.chain,
          timestamp: new Date(),
        }
      )

      // User 3: Ethereum Lifetime
      const user3Request = createTestPaymentRequest({
        chain: 'ethereum',
        tier: 'pro',
        interval: 'lifetime',
        subscriberId: 'user-3',
        subscriberEmail: 'user3@example.com',
      })

      const user3Payment = await subscriptions.createSubscriptionPayment(
        user3Request,
        TEST_PRICING.pro
      )

      await subscriptions.activateSubscription(
        'user-3',
        user3Request,
        {
          verified: true,
          paymentId: user3Payment.paymentId,
          amount: user3Payment.amount,
          currency: user3Payment.currency,
          chain: user3Payment.chain,
          timestamp: new Date(),
        }
      )

      // Verify all subscriptions
      const allSubs = database.getAllSubscriptions()
      expect(allSubs).toHaveLength(3)

      const user1Sub = await subscriptions.getSubscription('user-1')
      const user2Sub = await subscriptions.getSubscription('user-2')
      const user3Sub = await subscriptions.getSubscription('user-3')

      expect(user1Sub?.chain).toBe('solana')
      expect(user2Sub?.chain).toBe('lightning')
      expect(user3Sub?.chain).toBe('ethereum')

      expect(user1Sub?.interval).toBe('monthly')
      expect(user2Sub?.interval).toBe('yearly')
      expect(user3Sub?.interval).toBe('lifetime')
    })
  })

  describe('Error Recovery', () => {
    it('should handle failed payment verification', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        tier: 'premium',
        interval: 'monthly',
        subscriberId: 'failed-user',
      })

      const payment = await subscriptions.createSubscriptionPayment(
        request,
        TEST_PRICING.premium
      )

      // Attempt to activate with failed verification
      const failedVerification = {
        verified: false,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        chain: payment.chain,
        timestamp: new Date(),
        error: 'Payment not found',
      }

      await expect(
        subscriptions.activateSubscription(
          request.subscriberId,
          request,
          failedVerification
        )
      ).rejects.toThrow('Payment not verified')

      // Subscription should not exist
      const sub = await subscriptions.getSubscription('failed-user')
      expect(sub).toBeNull()
    })
  })
})
