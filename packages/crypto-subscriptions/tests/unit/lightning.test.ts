/**
 * Lightning Network Handler Unit Tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LightningHandler } from '../../src/lightning'
import { TEST_LIGHTNING_CONFIG } from '../fixtures/config'
import { createTestPaymentRequest } from '../fixtures/requests'

describe('LightningHandler', () => {
  let handler: LightningHandler

  beforeEach(() => {
    handler = new LightningHandler(TEST_LIGHTNING_CONFIG)
  })

  describe('constructor', () => {
    it('should initialize with LNBits provider', () => {
      expect(handler).toBeDefined()
    })

    it('should throw error if LNBits config is missing', () => {
      expect(() => {
        new LightningHandler({
          network: 'testnet',
          provider: 'lnbits',
          // Missing lnbitsUrl and lnbitsApiKey
        } as any)
      }).toThrow()
    })

    it('should initialize with BTCPay provider', () => {
      const btcpayHandler = new LightningHandler({
        network: 'testnet',
        provider: 'btcpay',
        btcpayUrl: 'https://test-btcpay.com',
        btcpayApiKey: 'test-key',
        btcpayStoreId: 'test-store',
      })
      expect(btcpayHandler).toBeDefined()
    })

    it('should throw error if BTCPay config is incomplete', () => {
      expect(() => {
        new LightningHandler({
          network: 'testnet',
          provider: 'btcpay',
          btcpayUrl: 'https://test-btcpay.com',
          // Missing btcpayApiKey and btcpayStoreId
        } as any)
      }).toThrow()
    })
  })

  describe('USD to Satoshis conversion', () => {
    it('should convert USD to satoshis', async () => {
      // Mock fetch for BTC price API
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ bitcoin: { usd: 50000 } }),
      } as Response)

      const sats = await handler.convertUSDToSats(10)
      // $10 / $50,000 = 0.0002 BTC = 20,000 sats
      expect(sats).toBe(20000)
    })

    it('should handle price fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(handler.convertUSDToSats(10)).rejects.toThrow()
    })

    it('should round satoshis to integer', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ bitcoin: { usd: 33333 } }),
      } as Response)

      const sats = await handler.convertUSDToSats(10)
      expect(Number.isInteger(sats)).toBe(true)
    })
  })

  describe('createPayment - LNBits', () => {
    it('should create invoice with correct amount', async () => {
      const mockInvoice = {
        payment_hash: 'test-hash-123',
        payment_request: 'lnbc1test',
        checking_id: 'check-123',
        lnurl_response: null,
        qr_code: 'data:image/svg+xml;base64,test',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockInvoice,
      } as Response)

      const request = createTestPaymentRequest({ chain: 'lightning' })
      const payment = await handler.createPayment(request, 10000) // 10,000 sats

      expect(payment).toBeDefined()
      expect(payment.paymentId).toBe(mockInvoice.payment_hash)
      expect(payment.currency).toBe('BTC')
      expect(payment.chain).toBe('lightning')
      expect(payment.status).toBe('pending')
      expect(payment.lightning).toBeDefined()
      expect(payment.lightning?.invoice).toBe(mockInvoice.payment_request)
      expect(payment.lightning?.hash).toBe(mockInvoice.payment_hash)
      expect(payment.lightning?.qrCode).toBe(mockInvoice.qr_code)
    })

    it('should convert sats to BTC correctly', async () => {
      const mockInvoice = {
        payment_hash: 'test-hash',
        payment_request: 'lnbc1test',
        checking_id: 'check-123',
        lnurl_response: null,
        qr_code: 'qr-data',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockInvoice,
      } as Response)

      const request = createTestPaymentRequest({ chain: 'lightning' })
      const payment = await handler.createPayment(request, 100000000) // 1 BTC in sats

      expect(payment.amount).toBe(1.0) // Should be 1 BTC
    })

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Unauthorized',
      } as Response)

      const request = createTestPaymentRequest({ chain: 'lightning' })
      await expect(handler.createPayment(request, 10000)).rejects.toThrow()
    })
  })

  describe('verifyPayment - LNBits', () => {
    it('should verify paid invoice', async () => {
      const mockStatus = {
        paid: true,
        preimage: 'preimage-data',
        details: {
          checking_id: 'check-123',
          pending: false,
          amount: 10000,
          fee: 1,
          memo: 'Test payment',
          time: Date.now() / 1000,
          bolt11: 'lnbc1test',
          preimage: 'preimage-data',
          payment_hash: 'hash-123',
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStatus,
      } as Response)

      const verification = await handler.verifyPayment('hash-123')

      expect(verification.verified).toBe(true)
      expect(verification.paymentId).toBe('hash-123')
      expect(verification.transactionHash).toBe('preimage-data')
      expect(verification.currency).toBe('BTC')
      expect(verification.chain).toBe('lightning')
    })

    it('should return unverified for unpaid invoice', async () => {
      const mockStatus = {
        paid: false,
        preimage: null,
        details: {
          checking_id: 'check-123',
          pending: true,
          amount: 10000,
          fee: 0,
          memo: 'Test payment',
          time: Date.now() / 1000,
          bolt11: 'lnbc1test',
          preimage: null,
          payment_hash: 'hash-123',
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStatus,
      } as Response)

      const verification = await handler.verifyPayment('hash-123')

      expect(verification.verified).toBe(false)
      expect(verification.error).toBeDefined()
    })
  })

  describe('pollPayment', () => {
    it('should detect payment when paid', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++
        const paid = callCount > 2 // Simulate payment after 2 polls

        return Promise.resolve({
          ok: true,
          json: async () => ({
            paid,
            preimage: paid ? 'preimage' : null,
            details: {
              checking_id: 'check-123',
              pending: !paid,
              amount: 10000,
              fee: 1,
              memo: 'Test',
              time: Date.now() / 1000,
              bolt11: 'lnbc1test',
              preimage: paid ? 'preimage' : null,
              payment_hash: 'hash-123',
            },
          }),
        } as Response)
      })

      const verification = await handler.pollPayment('hash-123', 10000, 10000, 1000)

      expect(verification.verified).toBe(true)
      expect(callCount).toBeGreaterThan(2)
    }, 15000)

    it('should timeout if not paid', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          paid: false,
          preimage: null,
          details: {
            checking_id: 'check-123',
            pending: true,
            amount: 10000,
            fee: 0,
            memo: 'Test',
            time: Date.now() / 1000,
            bolt11: 'lnbc1test',
            preimage: null,
            payment_hash: 'hash-123',
          },
        }),
      } as Response)

      const verification = await handler.pollPayment('hash-123', 10000, 3000, 1000)

      expect(verification.verified).toBe(false)
      expect(verification.error).toContain('timeout')
    }, 10000)
  })
})
