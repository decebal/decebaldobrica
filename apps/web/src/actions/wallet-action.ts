'use server'

import { checkAccess, ensureUserProfile, grantServiceAccess } from '@/lib/supabase/payments'
import { createClient } from '@/lib/supabase/server'
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

/**
 * Authenticate user with Solana wallet via Supabase
 * This should be called after wallet connection on the client
 */
export async function authenticateWallet(input: z.infer<typeof walletAuthSchema>) {
  try {
    const { walletAddress } = walletAuthSchema.parse(input)

    const supabase = await createClient()

    // Sign in with Web3 - Supabase handles the wallet signature verification
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithWeb3({
      chain: 'solana',
      statement: 'Access premium content on decebaldobrica.com',
    })

    if (error) throw error
    if (!user) throw new Error('Failed to authenticate')

    // Ensure user profile exists
    await ensureUserProfile(walletAddress, user.id)

    return {
      success: true,
      userId: user.id,
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
 * Check if wallet has access to a service
 */
export async function checkWalletAccess(input: z.infer<typeof checkAccessSchema>) {
  try {
    const { walletAddress, serviceSlug } = checkAccessSchema.parse(input)

    const { hasAccess, access } = await checkAccess(walletAddress, serviceSlug)

    return {
      success: true,
      hasAccess,
      access,
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
 * Grant service access after payment confirmation
 */
export async function grantWalletAccess(input: z.infer<typeof grantAccessSchema>) {
  try {
    const { walletAddress, serviceSlug, paymentId } = grantAccessSchema.parse(input)

    await grantServiceAccess(walletAddress, serviceSlug, paymentId)

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
 * Get current user's wallet address from session
 */
export async function getCurrentWalletAddress() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        walletAddress: null,
      }
    }

    // Get wallet address from user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('wallet_address')
      .eq('id', user.id)
      .single()

    return {
      success: true,
      walletAddress: profile?.wallet_address || null,
      userId: user.id,
    }
  } catch (error) {
    return {
      success: false,
      walletAddress: null,
      error: error instanceof Error ? error.message : 'Failed to get wallet address',
    }
  }
}
