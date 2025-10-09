/**
 * Multi-chain cryptocurrency payment support
 * Fee-efficient solutions for BTC, ETH, USDC
 */

export type CryptoPaymentMethod = 'btc' | 'eth' | 'usdc' | 'sol'

export interface CryptoPaymentConfig {
  id: CryptoPaymentMethod
  name: string
  symbol: string
  network?: string
  icon: string
  feeEstimate: string
  recommended: boolean
  description: string
}

export const CRYPTO_PAYMENT_METHODS: Record<CryptoPaymentMethod, CryptoPaymentConfig> = {
  // Bitcoin - Lightning Network for low fees
  btc: {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Lightning Network',
    icon: '₿',
    feeEstimate: '< $0.01',
    recommended: true,
    description: 'Ultra-low fees via Lightning Network',
  },

  // Ethereum - Layer 2 solutions
  eth: {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Arbitrum / Polygon',
    icon: 'Ξ',
    feeEstimate: '$0.01 - $0.50',
    recommended: true,
    description: 'Low fees on Layer 2 networks',
  },

  // USDC - Multiple networks
  usdc: {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    network: 'Polygon / Base',
    icon: '$',
    feeEstimate: '$0.01 - $0.10',
    recommended: true,
    description: 'Stablecoin on low-fee networks',
  },

  // Solana - Already implemented
  sol: {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana',
    icon: '◎',
    feeEstimate: '< $0.001',
    recommended: true,
    description: 'Fastest and cheapest option',
  },
}

/**
 * Payment gateway options ranked by fee efficiency
 */
export interface PaymentGateway {
  name: string
  supportedCurrencies: CryptoPaymentMethod[]
  fees: string
  integration: 'api' | 'widget' | 'self-hosted'
  recommended: boolean
  pros: string[]
  cons: string[]
  setupUrl?: string
}

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    name: 'Request Network',
    supportedCurrencies: ['eth', 'usdc'],
    fees: '0.1% (max $2)',
    integration: 'api',
    recommended: true,
    pros: [
      'Decentralized - no intermediary',
      'Very low fees (0.1%)',
      'Supports invoicing',
      'Multi-chain (Ethereum, Polygon, etc.)',
      'Self-custody',
    ],
    cons: ['Requires technical integration', 'No BTC support yet'],
    setupUrl: 'https://docs.request.network',
  },
  {
    name: 'BTCPay Server',
    supportedCurrencies: ['btc'],
    fees: '0% (self-hosted)',
    integration: 'self-hosted',
    recommended: true,
    pros: [
      'Zero fees',
      'Lightning Network support',
      'Full self-custody',
      'No KYC required',
      'Open source',
    ],
    cons: ['Requires server setup', 'Only supports Bitcoin', 'Technical knowledge needed'],
    setupUrl: 'https://btcpayserver.org',
  },
  {
    name: 'NOWPayments',
    supportedCurrencies: ['btc', 'eth', 'usdc', 'sol'],
    fees: '0.5% - 1%',
    integration: 'api',
    recommended: true,
    pros: [
      'Supports 200+ cryptocurrencies',
      'Auto-conversion to fiat',
      'Easy API integration',
      'Lightning Network support',
    ],
    cons: ['Higher fees than self-hosted', 'KYC may be required', 'Custodial'],
    setupUrl: 'https://nowpayments.io',
  },
  {
    name: 'Coinbase Commerce',
    supportedCurrencies: ['btc', 'eth', 'usdc'],
    fees: '1%',
    integration: 'widget',
    recommended: false,
    pros: ['Trusted brand', 'Easy integration', 'No setup required', 'Automatic USDC settlements'],
    cons: ['Higher fees (1%)', 'Custodial', 'KYC required for large amounts'],
    setupUrl: 'https://commerce.coinbase.com',
  },
  {
    name: 'Web3 Direct Integration',
    supportedCurrencies: ['eth', 'usdc'],
    fees: 'Network fees only',
    integration: 'api',
    recommended: true,
    pros: ['No intermediary fees', 'Full control', 'Can use Layer 2', 'Self-custody'],
    cons: ['Requires wallet connection', 'More complex UX', 'Need to handle payment verification'],
  },
]

/**
 * Network configurations for fee optimization
 */
export interface NetworkConfig {
  chainId: number
  name: string
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  contracts?: {
    usdc?: string
  }
}

export const L2_NETWORKS: Record<string, NetworkConfig> = {
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    contracts: {
      usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    },
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    },
  },
  base: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  },
}

/**
 * Calculate estimated fees for different networks
 */
export function estimateTransactionFee(
  currency: CryptoPaymentMethod,
  network?: string
): { gasPrice: string; totalFee: string; usdValue: string } {
  // Rough estimates - should be fetched from actual gas oracles in production
  const estimates = {
    btc: { gasPrice: '1 sat/vB', totalFee: '~200 sats', usdValue: '$0.01' },
    'btc-lightning': { gasPrice: 'N/A', totalFee: '~1 sat', usdValue: '<$0.001' },
    'eth-mainnet': { gasPrice: '~20 gwei', totalFee: '~21,000 gas', usdValue: '$2-10' },
    'eth-arbitrum': { gasPrice: '~0.1 gwei', totalFee: '~21,000 gas', usdValue: '$0.01-0.50' },
    'eth-polygon': { gasPrice: '~30 gwei', totalFee: '~21,000 gas', usdValue: '$0.01-0.10' },
    'eth-base': { gasPrice: '~0.1 gwei', totalFee: '~21,000 gas', usdValue: '$0.01-0.30' },
    usdc: { gasPrice: '~30 gwei', totalFee: '~50,000 gas', usdValue: '$0.05-0.30' },
    sol: { gasPrice: '~5,000 lamports', totalFee: '5,000 lamports', usdValue: '<$0.001' },
  }

  const key = network ? `${currency}-${network}` : currency
  return estimates[key as keyof typeof estimates] || estimates[currency]
}

/**
 * Recommended payment method based on amount and user preferences
 */
export function recommendPaymentMethod(
  amountUsd: number,
  userPreference?: CryptoPaymentMethod
): {
  primary: CryptoPaymentMethod
  alternatives: CryptoPaymentMethod[]
  reasoning: string
} {
  if (userPreference) {
    const alternatives = Object.keys(CRYPTO_PAYMENT_METHODS).filter(
      (m) => m !== userPreference
    ) as CryptoPaymentMethod[]

    return {
      primary: userPreference,
      alternatives,
      reasoning: 'Based on your preference',
    }
  }

  // For small amounts, use fastest/cheapest
  if (amountUsd < 50) {
    return {
      primary: 'sol',
      alternatives: ['btc', 'usdc'],
      reasoning: 'Lowest fees for small transactions',
    }
  }

  // For medium amounts, USDC on L2 for stability
  if (amountUsd < 500) {
    return {
      primary: 'usdc',
      alternatives: ['btc', 'eth', 'sol'],
      reasoning: 'Stable value with low fees on Layer 2',
    }
  }

  // For large amounts, Bitcoin for security
  return {
    primary: 'btc',
    alternatives: ['usdc', 'eth'],
    reasoning: 'Most secure for large transactions',
  }
}
