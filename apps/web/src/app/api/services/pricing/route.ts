/**
 * Services Pricing API
 * Protected by HTTP 402 Payment Required
 *
 * Users must pay $5 (0.023 SOL) to unlock pricing information
 * Payment is one-time, access is lifetime
 */

import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { requirePayment } from '@decebal/payment-gate/middleware/nextjs'
import { servicesGateConfig } from '@/lib/payment-gate/config'
import { hasServicesPricingAccess, getWalletAddressFromRequest } from '@/lib/payment-gate/helpers'
import { SERVICE_TIERS } from '@/lib/payments/config'

// Initialize Payment Gate
const gate = new PaymentGate(servicesGateConfig)

/**
 * GET /api/services/pricing
 *
 * Returns services pricing information if user has access
 * Otherwise returns HTTP 402 with payment options
 */
export async function GET(request: NextRequest) {
  try {
    // Get wallet address from request
    const walletAddress = getWalletAddressFromRequest(request)

    // Check if user already has access (paid in the past)
    if (walletAddress) {
      const hasAccess = await hasServicesPricingAccess(walletAddress)

      if (hasAccess) {
        // User has lifetime access - return pricing
        return NextResponse.json({
          success: true,
          access: 'granted',
          pricing: SERVICE_TIERS,
          message: 'You have lifetime access to services pricing',
        })
      }
    }

    // No access - require payment via HTTP 402
    const auth = await requirePayment(request, gate, '/api/services/pricing')

    if (!auth.authorized) {
      // Returns 402 Payment Required with payment options
      return auth.response
    }

    // Payment verified - return pricing
    return NextResponse.json({
      success: true,
      access: 'granted',
      pricing: SERVICE_TIERS,
      message: 'Payment verified - you now have lifetime access',
    })
  } catch (error) {
    console.error('Services pricing API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/services/pricing
 *
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Wallet-Address, X-Payment-Id',
    },
  })
}
