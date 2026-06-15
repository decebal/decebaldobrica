'use server'

import {
  ensureUserProfile,
  getUserProfile,
  grantServiceAccess,
  hasServiceAccess,
} from '@/lib/payments'
import { z } from 'zod'

const walletAuthSchema = z.object({
  walletAddress: z.string().min(32),
})

const checkAccessSchema = z.object({
  walletAddress: z.string().min(32),
  serviceSlug: z.string(),
})

const grantAccessSchema = z.object({
  walletAddress: z.string().min(32),
  serviceSlug: z.string(),
  paymentId: z.string(),
})

const currentWalletSchema = z.object({
  walletAddress: z.string().min(32),
})

/**
 * Establish a wallet identity server-side.
 *
 * Migration note (event model §2): Supabase GoTrue Web3 auth has been removed.
 * Identity is now the wallet address itself — the wallet signature is verified
 * client-side by the wallet adapter, and the server simply ensures a profile
 * exists in AllSource (stream `wallet:<address>`). There is no server session.
 */
export async function authenticateWallet(input: z.infer<typeof walletAuthSchema>) {
  try {
    const { walletAddress } = walletAuthSchema.parse(input)

    // Ensure the user profile exists (AllSource get-or-create).
    const userId = await ensureUserProfile(walletAddress, 'solana')

    return {
      success: true,
      userId,
      walletAddress,
    }
  } catch (error) {
    console.error('Wallet authentication error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    }
  }
}

/**
 * Check if a wallet has access to a service (AllSource service-access fold).
 */
export async function checkWalletAccess(input: z.infer<typeof checkAccessSchema>) {
  try {
    const { walletAddress, serviceSlug } = checkAccessSchema.parse(input)

    const hasAccess = await hasServiceAccess(walletAddress, serviceSlug)

    return {
      success: true,
      hasAccess,
    }
  } catch (error) {
    console.error('Check access error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check access',
      hasAccess: false,
    }
  }
}

/**
 * Grant service access after payment confirmation (AllSource event append).
 */
export async function grantWalletAccess(input: z.infer<typeof grantAccessSchema>) {
  try {
    const { walletAddress, serviceSlug, paymentId } = grantAccessSchema.parse(input)

    await grantServiceAccess({
      walletAddress,
      serviceSlug,
      paymentId,
      serviceType: 'one_time', // Lifetime access
      expiresAt: null, // Never expires
    })

    return {
      success: true,
      message: 'Access granted successfully',
    }
  } catch (error) {
    console.error('Grant access error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to grant access',
    }
  }
}

/**
 * Resolve the user profile for a wallet address.
 *
 * Migration note: previously read the connected wallet from a Supabase session.
 * Without server sessions the wallet address now comes from the caller (the
 * client wallet adapter is the source of truth); this confirms a profile exists
 * and echoes the canonical address back.
 */
export async function getCurrentWalletAddress(input: z.infer<typeof currentWalletSchema>) {
  try {
    const { walletAddress } = currentWalletSchema.parse(input)

    const profile = await getUserProfile(walletAddress)

    return {
      success: true,
      walletAddress: profile?.walletAddress ?? walletAddress,
      userId: profile?.id ?? null,
    }
  } catch (error) {
    return {
      success: false,
      walletAddress: null,
      error: error instanceof Error ? error.message : 'Failed to get wallet address',
    }
  }
}
