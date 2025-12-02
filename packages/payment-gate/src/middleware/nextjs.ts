/**
 * Next.js App Router Middleware for Payment Gate
 * Intercepts requests and enforces HTTP 402 payment requirement
 */

import { type NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '../core/PaymentGate'
import type { NextJsMiddlewareOptions, PaymentGateContext } from '../core/types'

/**
 * Create Payment Gate middleware for Next.js
 */
export function createPaymentGateMiddleware(options: NextJsMiddlewareOptions) {
  const gate = new PaymentGate(options.config)

  return async function paymentGateMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip excluded paths
    if (options.excludePaths?.some((path) => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Skip in development if configured
    if (options.development && process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }

    // Check if endpoint requires payment
    if (!gate.requiresPayment(pathname)) {
      return NextResponse.next()
    }

    // Get payment ID from headers (if retrying after payment)
    const paymentId = request.headers.get('X-Payment-Id')

    // If payment ID provided, verify payment
    if (paymentId) {
      const verification = await gate.verifyPayment(paymentId)

      if (verification.verified) {
        // Payment verified - allow request
        const response = NextResponse.next()
        response.headers.set('X-Payment-Verified', 'true')
        response.headers.set('X-Payment-Chain', verification.chain)
        response.headers.set('X-Payment-Amount', verification.amount.toString())
        return response
      }

      // Payment verification failed
      return NextResponse.json(
        {
          error: 'Payment verification failed',
          details: verification.error,
        },
        { status: 400 }
      )
    }

    // Check rate limit (free tier)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `${clientIp}:${pathname}`
    const rateLimit = await gate.checkRateLimit(rateLimitKey, pathname, false)

    if (rateLimit.allowed) {
      // Within free tier limit - allow request
      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimit.resetAt.toString())
      return response
    }

    // Rate limit exceeded - require payment
    const payment402 = await gate.generatePaymentRequired(pathname, {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      userAgent: request.headers.get('user-agent') || undefined,
      ip: clientIp,
    })

    return NextResponse.json(payment402, {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Payment required',
        'X-Payment-Required': 'true',
        'X-Payment-Id': payment402.paymentId,
        'X-Payment-Expires': payment402.expiresAt.toString(),
      },
    })
  }
}

/**
 * Helper to check payment in API routes
 */
export async function requirePayment(
  request: NextRequest,
  gate: PaymentGate,
  endpoint: string
): Promise<
  { authorized: true; context: PaymentGateContext } | { authorized: false; response: NextResponse }
> {
  // Check if endpoint requires payment
  if (!gate.requiresPayment(endpoint)) {
    return {
      authorized: true,
      context: {
        paymentRequired: false,
        paymentVerified: false,
      },
    }
  }

  // Get payment ID from headers
  const paymentId = request.headers.get('X-Payment-Id')

  if (paymentId) {
    const verification = await gate.verifyPayment(paymentId)

    if (verification.verified) {
      return {
        authorized: true,
        context: {
          paymentRequired: true,
          paymentVerified: true,
        },
      }
    }

    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Payment verification failed', details: verification.error },
        { status: 400 }
      ),
    }
  }

  // Generate payment requirement
  const payment402 = await gate.generatePaymentRequired(endpoint, {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  })

  return {
    authorized: false,
    response: NextResponse.json(payment402, {
      status: 402,
      headers: {
        'WWW-Authenticate': 'Payment required',
        'X-Payment-Id': payment402.paymentId,
      },
    }),
  }
}
