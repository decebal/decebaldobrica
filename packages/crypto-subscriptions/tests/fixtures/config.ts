/**
 * Test configuration fixtures
 */

import type { CryptoSubscriptionsConfig, TierPricing } from '../../src/core/types'

// Test wallet addresses (DO NOT USE IN PRODUCTION)
export const TEST_WALLETS = {
  solana: {
    merchant: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    customer: 'GZqKfL6p6Z1jNjXf7rFN9vWvD3Pj2VkC6H5t4Qm8KfLp',
  },
  ethereum: {
    merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1' as `0x${string}`,
    customer: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed' as `0x${string}`,
  },
  lightning: {
    // LNBits test instance
    lnbitsUrl: 'https://legend.lnbits.com',
    lnbitsApiKey: 'test-api-key',
  },
}

// Test configuration for Solana (devnet)
export const TEST_SOLANA_CONFIG: CryptoSubscriptionsConfig['solana'] = {
  network: 'devnet',
  merchantWallet: TEST_WALLETS.solana.merchant,
  rpcUrl: 'https://api.devnet.solana.com',
}

// Test configuration for Lightning (testnet)
export const TEST_LIGHTNING_CONFIG: CryptoSubscriptionsConfig['lightning'] = {
  network: 'testnet',
  provider: 'lnbits',
  lnbitsUrl: TEST_WALLETS.lightning.lnbitsUrl,
  lnbitsApiKey: TEST_WALLETS.lightning.lnbitsApiKey,
}

// Test configuration for Ethereum (Base testnet)
export const TEST_ETHEREUM_CONFIG: CryptoSubscriptionsConfig['ethereum'] = {
  network: 'base',
  merchantWallet: TEST_WALLETS.ethereum.merchant,
  rpcUrl: 'https://sepolia.base.org',
}

// Full test configuration
export const TEST_CONFIG: CryptoSubscriptionsConfig = {
  solana: TEST_SOLANA_CONFIG,
  lightning: TEST_LIGHTNING_CONFIG,
  ethereum: TEST_ETHEREUM_CONFIG,
}

// Test pricing tiers
export const TEST_PRICING: Record<string, TierPricing> = {
  free: {
    tier: 'free',
    name: 'Free',
    description: 'Basic features',
    features: ['Feature 1', 'Feature 2'],
    prices: {
      monthly: { usd: 0 },
    },
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    description: 'All features',
    features: ['Everything in Free', 'Feature 3', 'Feature 4'],
    prices: {
      monthly: { usd: 9.99 },
      yearly: { usd: 99.90 },
    },
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    description: 'Unlimited everything',
    features: ['Everything in Premium', 'Feature 5', 'Priority support'],
    prices: {
      monthly: { usd: 29.99 },
      yearly: { usd: 299.90 },
      lifetime: { usd: 999.00 },
    },
  },
}
