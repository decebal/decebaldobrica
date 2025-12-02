/**
 * Payment Gate Integration Helpers
 * Functions to integrate Payment Gate with existing Supabase payment system
 */

import { hasServiceAccess } from '@/lib/payments'

/**
 * Check if user has access to services pricing
 * Integrates with existing Supabase service_access table
 */
export async function hasServicesPricingAccess(walletAddress: string): Promise<boolean> {
  try {
    return await hasServiceAccess(walletAddress, 'all-pricing')
  } catch (error) {
    console.error('Error checking services pricing access:', error)
    return false
  }
}

/**
 * Check if user has newsletter access (Phase 2)
 */
export async function hasNewsletterAccess(
  walletAddress: string,
  tier: 'premium' | 'founding'
): Promise<boolean> {
  try {
    // TODO: Implement newsletter subscription check in Supabase
    // For now, return false (Phase 2)
    return false
  } catch (error) {
    console.error('Error checking newsletter access:', error)
    return false
  }
}

/**
 * Get wallet address from request headers
 */
export function getWalletAddressFromRequest(request: Request): string | null {
  // Try to get wallet address from various headers
  const walletHeader = request.headers.get('X-Wallet-Address')
  if (walletHeader) return walletHeader

  // Could also check Authorization header for signed messages
  return null
}

/**
 * Get client identifier for rate limiting
 * Uses wallet address if available, otherwise IP address
 */
export function getClientIdentifier(request: Request): string {
  const walletAddress = getWalletAddressFromRequest(request)
  if (walletAddress) return `wallet:${walletAddress}`

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim() ?? 'unknown'
    return `ip:${ip}`
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return `ip:${realIp}`

  return 'ip:unknown'
}
