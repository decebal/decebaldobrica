/**
 * Global test setup
 */

import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Set test environment variables
beforeAll(() => {
  process.env.NODE_ENV = 'test'

  // Mock global fetch for price APIs
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (typeof url === 'string') {
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
    }
    return Promise.reject(new Error('Unknown URL'))
  })
})

afterEach(() => {
  // Clear any mocks after each test
  vi.clearAllMocks()
})

afterAll(() => {
  // Cleanup
  vi.restoreAllMocks()
})
