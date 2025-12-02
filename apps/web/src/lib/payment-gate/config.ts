/**
 * Payment Gate Configuration
 * Multi-chain HTTP 402 payment protocol for API monetization
 */

import { createPayment, grantServiceAccess } from '@/lib/payments'
import { SERVICE_TIERS } from '@/lib/payments/config'
import type { PaymentGateConfig } from '@decebal/payment-gate'

// ============================================================================
// SERVICES PRICING API CONFIGURATION
// ============================================================================

export const servicesGateConfig: PaymentGateConfig = {
  pricing: {
    // Unlock all services pricing - $5 one-time payment
    '/api/services/pricing': {
      usd: 5,
      sol: 0.023, // ~$5 at $215/SOL
    },
  },

  // Start with Solana only
  chains: ['solana'],

  chainConfig: {
    solana: {
      merchantWallet: process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS!,
      network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet-beta' | 'devnet') || 'devnet',
      commitment: 'confirmed',
    },
  },

  // Optional: Payment timeout (default 15 minutes)
  paymentTimeout: 900000, // 15 minutes

  // Integration with existing Supabase payment system
  onPaymentVerified: async (verification) => {
    try {
      if (!verification.payer) {
        console.error('Payment verified but no payer address')
        return
      }

      // Log payment in Supabase (existing system)
      const payment = await createPayment({
        walletAddress: verification.payer,
        paymentType: 'service_access',
        entityType: 'service',
        entityId: 'all-pricing',
        amount: verification.amount,
        currency: verification.currency,
        chain: verification.chain,
        reference: verification.paymentId,
        description: 'Services pricing unlock via Payment Gate',
        metadata: {
          paymentGateId: verification.paymentId,
          chain: verification.chain,
          signature: verification.signature,
        },
      })

      // Grant lifetime access to pricing
      await grantServiceAccess({
        walletAddress: verification.payer,
        serviceSlug: 'all-pricing',
        paymentId: payment.id,
        serviceType: 'one_time', // Lifetime access
        expiresAt: null, // Never expires
      })

      console.log('Payment verified and access granted:', {
        paymentId: payment.id,
        wallet: verification.payer,
        amount: verification.amount,
        chain: verification.chain,
      })
    } catch (error) {
      console.error('Error in onPaymentVerified:', error)
      throw error
    }
  },

  // Optional: Handle payment failures
  onPaymentFailed: async (error) => {
    console.error('Payment verification failed:', error)
  },
}

// ============================================================================
// NEWSLETTER API CONFIGURATION (Phase 2 - Future)
// ============================================================================

export const newsletterGateConfig: PaymentGateConfig = {
  pricing: {
    // Premium newsletter content - $14.99/month
    '/api/newsletter/premium/*': {
      usd: 14.99,
      sol: 0.07,
      freeLimit: {
        requests: 5, // 5 free articles per day
        window: 86400000, // 24 hours
      },
    },

    // Founding member content - $300 lifetime
    '/api/newsletter/founding/*': {
      usd: 300,
      sol: 1.4,
    },
  },

  chains: ['solana'],

  chainConfig: {
    solana: {
      merchantWallet: process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS!,
      network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet-beta' | 'devnet') || 'devnet',
      commitment: 'confirmed',
    },
  },

  // Rate limiting for free tier
  rateLimit: {
    free: {
      requests: 5,
      window: 86400000, // 5 articles per day
    },
    paid: {
      requests: 1000,
      window: 86400000, // 1000 per day for subscribers
    },
  },

  onPaymentVerified: async (verification) => {
    // Implementation for newsletter access (Phase 2)
    console.log('Newsletter payment verified:', verification)
    // TODO: Grant newsletter access in Supabase
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get services pricing configuration
 */
export function getServicesPricingConfig() {
  return SERVICE_TIERS
}

/**
 * Validate environment variables
 */
export function validatePaymentGateEnv() {
  const required = ['NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS']

  for (const env of required) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`)
    }
  }

  return true
}
