/**
 * Solana Pay Handler Unit Tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SolanaPayHandler } from '../../src/solana'
import { TEST_SOLANA_CONFIG } from '../fixtures/config'
import { createTestPaymentRequest } from '../fixtures/requests'

describe('SolanaPayHandler', () => {
  let handler: SolanaPayHandler

  beforeEach(() => {
    handler = new SolanaPayHandler(TEST_SOLANA_CONFIG)
  })

  describe('constructor', () => {
    it('should initialize with correct network', () => {
      expect(handler).toBeDefined()
    })

    it('should throw error with invalid wallet address', () => {
      expect(() => {
        new SolanaPayHandler({
          ...TEST_SOLANA_CONFIG,
          merchantWallet: 'invalid-address',
        })
      }).toThrow()
    })
  })

  describe('createPayment', () => {
    it('should create a payment with valid request', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const amount = 0.1 // 0.1 SOL

      const payment = await handler.createPayment(request, amount)

      expect(payment).toBeDefined()
      expect(payment.paymentId).toBeDefined()
      expect(payment.amount).toBe(amount)
      expect(payment.currency).toBe('SOL')
      expect(payment.chain).toBe('solana')
      expect(payment.status).toBe('pending')
      expect(payment.solana).toBeDefined()
      expect(payment.solana?.recipient).toBe(TEST_SOLANA_CONFIG.merchantWallet)
      expect(payment.solana?.reference).toBeDefined()
      expect(payment.solana?.qrCode).toBeDefined()
    })

    it('should generate unique payment IDs', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const payment1 = await handler.createPayment(request, 0.1)
      const payment2 = await handler.createPayment(request, 0.1)

      expect(payment1.paymentId).not.toBe(payment2.paymentId)
    })

    it('should create QR code for payment', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const payment = await handler.createPayment(request, 0.1)

      expect(payment.solana?.qrCode).toBeDefined()
      expect(typeof payment.solana?.qrCode).toBe('string')
      expect(payment.solana?.qrCode.length).toBeGreaterThan(0)
    })

    it('should set expiry time correctly', async () => {
      const request = createTestPaymentRequest({ chain: 'solana' })
      const before = new Date()
      const payment = await handler.createPayment(request, 0.1)
      const after = new Date()

      const expectedExpiry = new Date(before.getTime() + 15 * 60 * 1000)
      expect(payment.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedExpiry.getTime() - 1000)
      expect(payment.expiresAt.getTime()).toBeLessThanOrEqual(
        new Date(after.getTime() + 15 * 60 * 1000).getTime() + 1000
      )
    })

    it('should include metadata in payment', async () => {
      const request = createTestPaymentRequest({
        chain: 'solana',
        metadata: { customField: 'test-value' },
      })
      const payment = await handler.createPayment(request, 0.1)

      expect(payment.metadata).toBeDefined()
      expect(payment.metadata?.customField).toBe('test-value')
    })
  })

  describe('verifyPayment', () => {
    it('should return unverified for non-existent payment', async () => {
      const fakeReference = 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
      const verification = await handler.verifyPayment(fakeReference, 0.1)

      expect(verification.verified).toBe(false)
      expect(verification.error).toBeDefined()
    })
  })

  describe('USD to SOL conversion', () => {
    it('should convert USD to SOL', async () => {
      // Mock fetch for price API
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ solana: { usd: 100 } }),
      } as Response)

      const solAmount = await handler.convertUSDToSOL(10)
      expect(solAmount).toBe(0.1) // $10 / $100 = 0.1 SOL
    })

    it('should handle price fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(handler.convertUSDToSOL(10)).rejects.toThrow()
    })
  })

  describe('getBalance', () => {
    it('should get wallet balance', async () => {
      const balance = await handler.getBalance(TEST_SOLANA_CONFIG.merchantWallet)
      expect(typeof balance).toBe('number')
      expect(balance).toBeGreaterThanOrEqual(0)
    })

    it('should throw error for invalid address', async () => {
      await expect(handler.getBalance('invalid-address')).rejects.toThrow()
    })
  })

  describe('pollPayment', () => {
    it('should timeout if payment not found', async () => {
      const fakeReference = 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'

      const verification = await handler.pollPayment(
        fakeReference,
        0.1,
        5000, // 5 second timeout
        1000 // 1 second interval
      )

      expect(verification.verified).toBe(false)
      expect(verification.error).toContain('timeout')
    }, 10000) // 10 second test timeout
  })
})
