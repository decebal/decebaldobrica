/**
 * Database Adapter Tests
 */

import { beforeEach, describe, expect, it } from 'vitest'
import type { PaymentResponse, Subscription } from '../../src/core/types'
import { MockDatabaseAdapter } from '../mocks/database'

describe('DatabaseAdapter', () => {
  let adapter: MockDatabaseAdapter

  beforeEach(() => {
    adapter = new MockDatabaseAdapter()
  })

  describe('payment operations', () => {
    const mockPayment: Omit<PaymentResponse, 'createdAt'> = {
      paymentId: 'payment-123',
      amount: 0.1,
      currency: 'SOL',
      chain: 'solana',
      status: 'pending',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      solana: {
        recipient: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
        reference: 'ref-123',
        qrCode: 'qr-data',
      },
    }

    it('should create payment', async () => {
      const payment = await adapter.createPayment(mockPayment)

      expect(payment).toBeDefined()
      expect(payment.paymentId).toBe(mockPayment.paymentId)
      expect(payment.createdAt).toBeInstanceOf(Date)
    })

    it('should get payment by ID', async () => {
      await adapter.createPayment(mockPayment)
      const payment = await adapter.getPayment(mockPayment.paymentId)

      expect(payment).toBeDefined()
      expect(payment?.paymentId).toBe(mockPayment.paymentId)
    })

    it('should return null for non-existent payment', async () => {
      const payment = await adapter.getPayment('non-existent')
      expect(payment).toBeNull()
    })

    it('should update payment status', async () => {
      await adapter.createPayment(mockPayment)
      await adapter.updatePaymentStatus(mockPayment.paymentId, 'confirmed')

      const payment = await adapter.getPayment(mockPayment.paymentId)
      expect(payment?.status).toBe('confirmed')
    })

    it('should store multiple payments', async () => {
      const payment1 = { ...mockPayment, paymentId: 'payment-1' }
      const payment2 = { ...mockPayment, paymentId: 'payment-2' }

      await adapter.createPayment(payment1)
      await adapter.createPayment(payment2)

      const allPayments = adapter.getAllPayments()
      expect(allPayments).toHaveLength(2)
    })
  })

  describe('subscription operations', () => {
    const mockSubscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> = {
      subscriberId: 'user-123',
      tier: 'premium',
      interval: 'monthly',
      status: 'active',
      chain: 'solana',
      amount: 0.1,
      currency: 'SOL',
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      paymentId: 'payment-123',
    }

    it('should create subscription', async () => {
      const subscription = await adapter.createSubscription(mockSubscription)

      expect(subscription).toBeDefined()
      expect(subscription.id).toBeDefined()
      expect(subscription.id).toMatch(/^sub_/)
      expect(subscription.subscriberId).toBe(mockSubscription.subscriberId)
      expect(subscription.createdAt).toBeInstanceOf(Date)
      expect(subscription.updatedAt).toBeInstanceOf(Date)
    })

    it('should get subscription by subscriber ID', async () => {
      await adapter.createSubscription(mockSubscription)
      const subscription = await adapter.getSubscription(mockSubscription.subscriberId)

      expect(subscription).toBeDefined()
      expect(subscription?.subscriberId).toBe(mockSubscription.subscriberId)
    })

    it('should return null for non-existent subscription', async () => {
      const subscription = await adapter.getSubscription('non-existent')
      expect(subscription).toBeNull()
    })

    it('should update subscription', async () => {
      const created = await adapter.createSubscription(mockSubscription)
      await adapter.updateSubscription(created.id, {
        tier: 'pro',
        amount: 0.3,
      })

      const updated = await adapter.getSubscription(mockSubscription.subscriberId)
      expect(updated?.tier).toBe('pro')
      expect(updated?.amount).toBe(0.3)
      expect(updated?.updatedAt).not.toEqual(created.updatedAt)
    })

    it('should cancel subscription', async () => {
      const created = await adapter.createSubscription(mockSubscription)
      await adapter.cancelSubscription(created.id)

      const cancelled = await adapter.getSubscription(mockSubscription.subscriberId)
      expect(cancelled?.status).toBe('cancelled')
      expect(cancelled?.cancelAtPeriodEnd).toBe(true)
    })

    it('should override subscription for same subscriber', async () => {
      await adapter.createSubscription(mockSubscription)
      await adapter.createSubscription({
        ...mockSubscription,
        tier: 'pro',
      })

      const subscription = await adapter.getSubscription(mockSubscription.subscriberId)
      expect(subscription?.tier).toBe('pro')

      const allSubscriptions = adapter.getAllSubscriptions()
      expect(allSubscriptions).toHaveLength(1)
    })
  })

  describe('test utilities', () => {
    it('should clear all data', async () => {
      const mockPayment: Omit<PaymentResponse, 'createdAt'> = {
        paymentId: 'payment-123',
        amount: 0.1,
        currency: 'SOL',
        chain: 'solana',
        status: 'pending',
        expiresAt: new Date(),
      }

      const mockSub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> = {
        subscriberId: 'user-123',
        tier: 'premium',
        interval: 'monthly',
        status: 'active',
        chain: 'solana',
        amount: 0.1,
        currency: 'SOL',
        startDate: new Date(),
        cancelAtPeriodEnd: false,
        paymentId: 'payment-123',
      }

      await adapter.createPayment(mockPayment)
      await adapter.createSubscription(mockSub)

      adapter.clear()

      const payment = await adapter.getPayment('payment-123')
      const subscription = await adapter.getSubscription('user-123')

      expect(payment).toBeNull()
      expect(subscription).toBeNull()
      expect(adapter.getAllPayments()).toHaveLength(0)
      expect(adapter.getAllSubscriptions()).toHaveLength(0)
    })

    it('should get all payments', async () => {
      const payment1: Omit<PaymentResponse, 'createdAt'> = {
        paymentId: 'payment-1',
        amount: 0.1,
        currency: 'SOL',
        chain: 'solana',
        status: 'pending',
        expiresAt: new Date(),
      }

      const payment2: Omit<PaymentResponse, 'createdAt'> = {
        paymentId: 'payment-2',
        amount: 0.2,
        currency: 'BTC',
        chain: 'lightning',
        status: 'confirmed',
        expiresAt: new Date(),
      }

      await adapter.createPayment(payment1)
      await adapter.createPayment(payment2)

      const allPayments = adapter.getAllPayments()
      expect(allPayments).toHaveLength(2)
      expect(allPayments.map((p) => p.paymentId)).toContain('payment-1')
      expect(allPayments.map((p) => p.paymentId)).toContain('payment-2')
    })
  })
})
