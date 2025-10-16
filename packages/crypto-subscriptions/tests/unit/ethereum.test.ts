/**
 * Ethereum L2 Handler Unit Tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EthereumHandler } from '../../src/ethereum'
import { TEST_ETHEREUM_CONFIG } from '../fixtures/config'
import { createTestPaymentRequest } from '../fixtures/requests'

describe('EthereumHandler', () => {
  let handler: EthereumHandler

  beforeEach(() => {
    handler = new EthereumHandler(TEST_ETHEREUM_CONFIG)
  })

  describe('constructor', () => {
    it('should initialize with Base network', () => {
      expect(handler).toBeDefined()
    })

    it('should initialize with Arbitrum network', () => {
      const arbHandler = new EthereumHandler({
        network: 'arbitrum',
        merchantWallet: TEST_ETHEREUM_CONFIG.merchantWallet,
      })
      expect(arbHandler).toBeDefined()
    })

    it('should initialize with Optimism network', () => {
      const opHandler = new EthereumHandler({
        network: 'optimism',
        merchantWallet: TEST_ETHEREUM_CONFIG.merchantWallet,
      })
      expect(opHandler).toBeDefined()
    })
  })

  describe('createPayment', () => {
    it('should create ETH payment', async () => {
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const amount = 0.01 // 0.01 ETH

      const payment = await handler.createPayment(request, amount, 'ETH')

      expect(payment).toBeDefined()
      expect(payment.paymentId).toBeDefined()
      expect(payment.amount).toBe(amount)
      expect(payment.currency).toBe('ETH')
      expect(payment.chain).toBe('ethereum')
      expect(payment.status).toBe('pending')
      expect(payment.ethereum).toBeDefined()
      expect(payment.ethereum?.recipient).toBe(TEST_ETHEREUM_CONFIG.merchantWallet)
      expect(payment.ethereum?.chainId).toBeDefined()
      expect(payment.ethereum?.qrCode).toBeDefined()
      expect(payment.ethereum?.token).toBeUndefined() // No token for ETH
    })

    it('should create USDC payment', async () => {
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const amount = 10 // 10 USDC

      const payment = await handler.createPayment(request, amount, 'USDC')

      expect(payment).toBeDefined()
      expect(payment.amount).toBe(amount)
      expect(payment.currency).toBe('USDC')
      expect(payment.ethereum?.token).toBeDefined()
      expect(payment.ethereum?.token).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it('should generate EIP-681 payment URL', async () => {
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const payment = await handler.createPayment(request, 0.01, 'ETH')

      expect(payment.ethereum?.qrCode).toBeDefined()
      expect(payment.ethereum?.qrCode).toContain('ethereum:')
      expect(payment.ethereum?.qrCode).toContain(TEST_ETHEREUM_CONFIG.merchantWallet)
    })

    it('should set 15 minute expiry', async () => {
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const before = new Date()
      const payment = await handler.createPayment(request, 0.01, 'ETH')
      const after = new Date()

      const expectedExpiry = new Date(before.getTime() + 15 * 60 * 1000)
      expect(payment.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedExpiry.getTime() - 1000)
      expect(payment.expiresAt.getTime()).toBeLessThanOrEqual(
        new Date(after.getTime() + 15 * 60 * 1000).getTime() + 1000
      )
    })
  })

  describe('USD to ETH conversion', () => {
    it('should convert USD to ETH', async () => {
      // Mock fetch for ETH price API
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ethereum: { usd: 2000 } }),
      } as Response)

      const ethAmount = await handler.convertUSDToETH(100)
      expect(ethAmount).toBe(0.05) // $100 / $2000 = 0.05 ETH
    })

    it('should handle price fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(handler.convertUSDToETH(100)).rejects.toThrow()
    })
  })

  describe('estimateGasFees', () => {
    it('should estimate gas for ETH transfer', async () => {
      const estimate = await handler.estimateGasFees('ETH')

      expect(estimate).toBeDefined()
      expect(estimate.gasPrice).toBeDefined()
      expect(estimate.estimatedFee).toBeDefined()
      expect(estimate.usdValue).toBeDefined()

      // Check format
      expect(estimate.gasPrice).toContain('Gwei')
      expect(estimate.estimatedFee).toContain('ETH')
      expect(estimate.usdValue).toContain('$')
    })

    it('should estimate higher gas for USDC transfer', async () => {
      const ethEstimate = await handler.estimateGasFees('ETH')
      const usdcEstimate = await handler.estimateGasFees('USDC')

      // USDC (ERC-20) should have higher gas estimate than native ETH
      const ethFee = Number.parseFloat(ethEstimate.estimatedFee.replace(' ETH', ''))
      const usdcFee = Number.parseFloat(usdcEstimate.estimatedFee.replace(' ETH', ''))

      expect(usdcFee).toBeGreaterThan(ethFee)
    })
  })

  describe('getBalance', () => {
    it('should get ETH balance', async () => {
      const balance = await handler.getBalance(TEST_ETHEREUM_CONFIG.merchantWallet, 'ETH')

      expect(typeof balance).toBe('bigint')
      expect(balance).toBeGreaterThanOrEqual(0n)
    })

    it('should get USDC balance', async () => {
      const balance = await handler.getBalance(TEST_ETHEREUM_CONFIG.merchantWallet, 'USDC')

      expect(typeof balance).toBe('bigint')
      expect(balance).toBeGreaterThanOrEqual(0n)
    })
  })

  describe('verifyPayment', () => {
    it('should return unverified for non-existent transaction', async () => {
      const fakeTxHash =
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as const

      const verification = await handler.verifyPayment(fakeTxHash, 0.01, 'ETH')

      expect(verification.verified).toBe(false)
      expect(verification.error).toBeDefined()
    })
  })

  describe('pollPayment', () => {
    it('should timeout if payment not received', async () => {
      const initialBalance = await handler.getBalance(TEST_ETHEREUM_CONFIG.merchantWallet, 'ETH')

      const verification = await handler.pollPayment(
        initialBalance,
        0.01,
        'ETH',
        3000, // 3 second timeout
        1000 // 1 second interval
      )

      expect(verification.verified).toBe(false)
      expect(verification.error).toContain('timeout')
    }, 10000)
  })

  describe('chain selection', () => {
    it('should use Base chain by default', async () => {
      const baseHandler = new EthereumHandler({
        network: 'base',
        merchantWallet: TEST_ETHEREUM_CONFIG.merchantWallet,
      })
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const payment = await baseHandler.createPayment(request, 0.01, 'ETH')

      expect(payment.ethereum?.chainId).toBe(8453) // Base mainnet chain ID
    })

    it('should support Arbitrum chain', async () => {
      const arbHandler = new EthereumHandler({
        network: 'arbitrum',
        merchantWallet: TEST_ETHEREUM_CONFIG.merchantWallet,
      })
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const payment = await arbHandler.createPayment(request, 0.01, 'ETH')

      expect(payment.ethereum?.chainId).toBe(42161) // Arbitrum One chain ID
    })

    it('should support Optimism chain', async () => {
      const opHandler = new EthereumHandler({
        network: 'optimism',
        merchantWallet: TEST_ETHEREUM_CONFIG.merchantWallet,
      })
      const request = createTestPaymentRequest({ chain: 'ethereum' })
      const payment = await opHandler.createPayment(request, 0.01, 'ETH')

      expect(payment.ethereum?.chainId).toBe(10) // Optimism mainnet chain ID
    })
  })
})
