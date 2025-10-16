/**
 * Mock handlers for blockchain operations
 * These replace real network calls in tests
 */

import { vi } from 'vitest'

// Mock crypto.randomUUID for consistent reference generation
export const mockCrypto = () => {
  if (typeof global.crypto === 'undefined') {
    global.crypto = {
      randomUUID: () => '12345678-1234-1234-1234-123456789012',
      // @ts-ignore
      getRandomValues: (arr) => arr,
    }
  } else {
    vi.spyOn(global.crypto, 'randomUUID').mockReturnValue('12345678-1234-1234-1234-123456789012')
  }
}

// Mock Solana connection methods
export const mockSolanaConnection = () => {
  return {
    getSignaturesForAddress: vi.fn().mockResolvedValue([]),
    getBalance: vi.fn().mockResolvedValue(1000000000), // 1 SOL in lamports
  }
}

// Mock viem public client
export const mockViemPublicClient = () => {
  return {
    getBalance: vi.fn().mockResolvedValue(1000000000000000000n), // 1 ETH in wei
    getGasPrice: vi.fn().mockResolvedValue(1000000000n), // 1 Gwei
    getTransactionReceipt: vi.fn().mockResolvedValue(null),
    getTransaction: vi.fn().mockResolvedValue(null),
    getBlock: vi.fn().mockResolvedValue({
      timestamp: BigInt(Math.floor(Date.now() / 1000)),
    }),
    readContract: vi.fn().mockResolvedValue(1000000000n), // 1000 USDC (6 decimals)
  }
}
