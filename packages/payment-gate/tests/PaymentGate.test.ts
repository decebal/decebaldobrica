import { describe, expect, it } from 'vitest'
import { PaymentGate } from '../src/core/PaymentGate'
import type { PaymentGateConfig } from '../src/core/types'

describe('PaymentGate', () => {
  const mockConfig: PaymentGateConfig = {
    pricing: {
      '/api/chat': { usd: 0.02 },
      '/api/premium/*': { usd: 0.1 },
    },
    chains: ['solana'],
    chainConfig: {
      solana: {
        merchantWallet: 'FakeWalletAddress123456789',
        network: 'devnet',
      },
    },
  }

  it('should create instance with valid config', () => {
    const gate = new PaymentGate(mockConfig)
    expect(gate).toBeDefined()
  })

  it('should detect endpoints requiring payment', () => {
    const gate = new PaymentGate(mockConfig)
    expect(gate.requiresPayment('/api/chat')).toBe(true)
    expect(gate.requiresPayment('/api/public')).toBe(false)
  })

  it('should match wildcard patterns', () => {
    const gate = new PaymentGate(mockConfig)
    expect(gate.requiresPayment('/api/premium/feature1')).toBe(true)
    expect(gate.requiresPayment('/api/premium/feature2')).toBe(true)
  })

  it('should generate 402 response with payment options', async () => {
    const gate = new PaymentGate(mockConfig)
    const response = await gate.generatePaymentRequired('/api/chat')

    expect(response.status).toBe(402)
    expect(response.message).toBe('Payment required to access this endpoint')
    expect(response.paymentOptions).toHaveLength(1)
    expect(response.paymentOptions[0].chain).toBe('solana')
    expect(response.paymentId).toBeDefined()
    expect(response.expiresAt).toBeGreaterThan(Date.now())
  })

  it('should enforce rate limits for free tier', async () => {
    const configWithRateLimit: PaymentGateConfig = {
      ...mockConfig,
      rateLimit: {
        free: {
          requests: 2,
          window: 60000,
        },
      },
    }

    const gate = new PaymentGate(configWithRateLimit)

    // First request - should allow
    const result1 = await gate.checkRateLimit('test-key', '/api/chat', false)
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBe(1)

    // Second request - should allow
    const result2 = await gate.checkRateLimit('test-key', '/api/chat', false)
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBe(0)

    // Third request - should block
    const result3 = await gate.checkRateLimit('test-key', '/api/chat', false)
    expect(result3.allowed).toBe(false)
    expect(result3.remaining).toBe(0)
  })
})
