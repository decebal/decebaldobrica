/**
 * Mock database adapter for testing
 */

import type {
  DatabaseAdapter,
  PaymentResponse,
  PaymentStatus,
  Subscription,
} from '../../src/core/types'

export class MockDatabaseAdapter implements DatabaseAdapter {
  private payments: Map<string, PaymentResponse> = new Map()
  private subscriptions: Map<string, Subscription> = new Map()

  // Payment operations
  async createPayment(payment: Omit<PaymentResponse, 'createdAt'>): Promise<PaymentResponse> {
    const fullPayment: PaymentResponse = {
      ...payment,
      createdAt: new Date(),
    }
    this.payments.set(payment.paymentId, fullPayment)
    return fullPayment
  }

  async getPayment(paymentId: string): Promise<PaymentResponse | null> {
    return this.payments.get(paymentId) || null
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    const payment = this.payments.get(paymentId)
    if (payment) {
      payment.status = status
      this.payments.set(paymentId, payment)
    }
  }

  // Subscription operations
  async createSubscription(
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Subscription> {
    const fullSubscription: Subscription = {
      ...subscription,
      id: `sub_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptions.set(subscription.subscriberId, fullSubscription)
    return fullSubscription
  }

  async getSubscription(subscriberId: string): Promise<Subscription | null> {
    return this.subscriptions.get(subscriberId) || null
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<void> {
    for (const [subscriberId, subscription] of this.subscriptions.entries()) {
      if (subscription.id === subscriptionId) {
        this.subscriptions.set(subscriberId, {
          ...subscription,
          ...updates,
          updatedAt: new Date(),
        })
        break
      }
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.updateSubscription(subscriptionId, {
      status: 'cancelled',
      cancelAtPeriodEnd: true,
    })
  }

  // Test utilities
  clear() {
    this.payments.clear()
    this.subscriptions.clear()
  }

  getAllPayments(): PaymentResponse[] {
    return Array.from(this.payments.values())
  }

  getAllSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values())
  }
}
