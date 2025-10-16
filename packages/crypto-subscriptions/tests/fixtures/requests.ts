/**
 * Test request fixtures
 */

import type { CreatePaymentRequest } from '../../src/core/types'

export const createTestPaymentRequest = (
  overrides?: Partial<CreatePaymentRequest>
): CreatePaymentRequest => ({
  subscriberId: 'test-user-123',
  subscriberEmail: 'test@example.com',
  tier: 'premium',
  interval: 'monthly',
  chain: 'solana',
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
  metadata: {
    testMode: true,
  },
  ...overrides,
})

export const TEST_REQUESTS = {
  solanaPremiumMonthly: createTestPaymentRequest({
    chain: 'solana',
    tier: 'premium',
    interval: 'monthly',
  }),
  lightningProYearly: createTestPaymentRequest({
    chain: 'lightning',
    tier: 'pro',
    interval: 'yearly',
  }),
  ethereumPremiumLifetime: createTestPaymentRequest({
    chain: 'ethereum',
    tier: 'premium',
    interval: 'monthly',
  }),
}
