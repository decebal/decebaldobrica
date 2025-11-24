// src/actions/payment-action.ts
// Server Action for Unified Payment System with Solana Pay integration

'use server'

import {
  createPayment,
  getPayment,
  getPaymentByReference,
  grantServiceAccess,
  updatePaymentStatus,
  getPaymentConfig,
  requiresPayment as checkRequiresPayment,
} from '@/lib/payments'
import {
  FindReferenceError,
  createQR,
  encodeURL,
  findReference,
  validateTransfer,
} from '@solana/pay'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { z } from 'zod'

// ============================================================================
// SOLANA CONNECTION & UTILITIES
// ============================================================================

function getSolanaConnection(): Connection {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  return new Connection(rpcUrl, 'confirmed')
}

function getMerchantWallet(): PublicKey {
  const walletAddress = process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS
  if (!walletAddress) {
    throw new Error('Merchant wallet address not configured')
  }
  return new PublicKey(walletAddress)
}

// ============================================================================
// MEETING PAYMENT ACTIONS
// ============================================================================

const paymentInitSchema = z.object({
  meetingType: z.string(),
  meetingId: z.string(),
  walletAddress: z.string().optional(),
  conversationId: z.string().optional(),
})

const paymentVerifySchema = z.object({
  reference: z.string(),
  paymentId: z.string(),
})

/**
 * Initialize a payment for a meeting booking
 * Creates payment transaction in Supabase and generates QR code
 */
export async function initializePayment(input: z.infer<typeof paymentInitSchema>) {
  try {
    const { meetingType, meetingId, walletAddress, conversationId } = paymentInitSchema.parse(input)

    // Get meeting configuration from unified config
    const config = getPaymentConfig('meeting_type', meetingType)

    if (!config) {
      return {
        success: false,
        error: 'Meeting type not found',
      }
    }

    // Check if payment is required
    if (!checkRequiresPayment('meeting_type', meetingType)) {
      return {
        success: false,
        error: 'This meeting type does not require payment',
      }
    }

    // Generate unique reference for this payment
    const reference = Keypair.generate().publicKey

    // Create payment in Supabase (replaces in-memory storage)
    const payment = await createPayment({
      walletAddress: walletAddress || 'pending', // Will be updated when user connects wallet
      paymentType: 'meeting',
      entityType: 'meeting',
      entityId: meetingId,
      amount: config.priceSol || 0,
      currency: 'SOL',
      chain: 'solana',
      reference: reference.toString(),
      description: `Payment for ${config.name}`,
      metadata: {
        meetingType,
        meetingId,
        conversationId,
        durationMinutes: config.durationMinutes,
      },
    })

    // Create Solana Pay URL
    const recipient = getMerchantWallet()
    const amount = config.priceSol || 0
    const label = `Meeting: ${config.name}`
    const message = `Payment for ${config.durationMinutes} minute meeting`

    const url = encodeURL({
      recipient,
      amount,
      reference,
      label,
      message,
    })

    // Generate QR code as base64
    const qrCode = createQR(url, 512, 'transparent')
    const qrBuffer = await qrCode.getRawData('png')
    const qrBase64 = qrBuffer ? Buffer.from(qrBuffer).toString('base64') : null

    return {
      success: true,
      payment: {
        id: payment.id,
        reference: reference.toString(),
        amount: config.priceSol || 0,
        meetingType,
        url: url.toString(),
        qrCode: qrBase64 ? `data:image/png;base64,${qrBase64}` : null,
      },
    }
  } catch (error) {
    console.error('Payment initialization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize payment',
    }
  }
}

/**
 * Verify a payment on the blockchain
 * Checks if transaction with reference exists and has correct amount
 */
export async function verifyPayment(input: z.infer<typeof paymentVerifySchema>) {
  try {
    const { reference, paymentId } = paymentVerifySchema.parse(input)

    // Get payment from Supabase (not in-memory)
    const payment = await getPayment(paymentId)
    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      }
    }

    if (payment.status === 'confirmed') {
      return {
        success: true,
        status: 'confirmed',
        signature: payment.signature,
      }
    }

    // Connect to Solana
    const connection = getSolanaConnection()
    const referencePublicKey = new PublicKey(reference)
    const recipient = getMerchantWallet()

    try {
      // Find transaction reference on blockchain
      const signatureInfo = await findReference(connection, referencePublicKey, {
        finality: 'confirmed',
      })

      // Validate the transaction
      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient,
          amount: payment.amount,
          reference: referencePublicKey,
        },
        { commitment: 'confirmed' }
      )

      // Update payment status in Supabase
      await updatePaymentStatus(paymentId, 'confirmed', signatureInfo.signature)

      return {
        success: true,
        status: 'confirmed',
        signature: signatureInfo.signature,
      }
    } catch (error) {
      if (error instanceof FindReferenceError) {
        // Transaction not found yet - still pending
        return {
          success: true,
          status: 'pending',
        }
      }
      throw error
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment',
    }
  }
}

/**
 * Get payment status
 * Returns current status of a payment transaction from Supabase
 */
export async function getPaymentStatus(paymentId: string) {
  try {
    const payment = await getPayment(paymentId)

    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      }
    }

    return {
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        timestamp: payment.createdAt,
        signature: payment.signature,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get payment status',
    }
  }
}

/**
 * Cancel a pending payment
 * Marks payment as failed if it's still pending
 */
export async function cancelPayment(paymentId: string) {
  try {
    const payment = await getPayment(paymentId)

    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      }
    }

    if (payment.status !== 'pending') {
      return {
        success: false,
        error: `Cannot cancel payment with status: ${payment.status}`,
      }
    }

    await updatePaymentStatus(paymentId, 'failed')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel payment',
    }
  }
}

/**
 * Get payment statistics from Supabase
 * Returns analytics data for all payments
 */
export async function getPaymentAnalytics() {
  try {
    // Use Supabase function for stats
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('get_payment_stats', {
      p_payment_type: 'meeting',
    })

    if (error) throw error

    return {
      success: true,
      analytics: {
        totalPayments: Number(data[0]?.total_payments || 0),
        confirmedPayments: Number(data[0]?.confirmed_payments || 0),
        pendingPayments: Number(data[0]?.pending_payments || 0),
        totalRevenue: Number(data[0]?.total_revenue_sol || 0),
      },
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get analytics',
    }
  }
}

// ============================================================================
// SERVICE ACCESS PAYMENT ACTIONS
// ============================================================================

const servicePaymentInitSchema = z.object({
  walletAddress: z.string().min(32),
  serviceSlug: z.string(),
  amount: z.number().positive(),
})

const servicePaymentVerifySchema = z.object({
  reference: z.string(),
  dbPaymentId: z.string(),
  walletAddress: z.string(),
  serviceSlug: z.string(),
})

/**
 * Initialize a service access payment
 * Used for unlocking pricing and content
 */
export async function initializeServicePayment(input: z.infer<typeof servicePaymentInitSchema>) {
  try {
    const { walletAddress, serviceSlug, amount } = servicePaymentInitSchema.parse(input)

    // Generate unique reference for this payment
    const reference = Keypair.generate().publicKey

    // Create payment in unified Supabase table
    const payment = await createPayment({
      walletAddress,
      paymentType: 'service_access',
      entityType: 'service',
      entityId: serviceSlug,
      amount,
      currency: 'SOL',
      chain: 'solana',
      reference: reference.toString(),
      description: `Unlock service: ${serviceSlug}`,
      metadata: {
        serviceSlug,
      },
    })

    // Create Solana Pay URL
    const recipient = getMerchantWallet()
    const label = `Unlock: ${serviceSlug}`
    const message = `Payment to unlock ${serviceSlug} on decebaldobrica.com`

    const url = encodeURL({
      recipient,
      amount,
      reference,
      label,
      message,
    })

    // Generate QR code as base64
    const qrCode = createQR(url, 512, 'transparent')
    const qrBuffer = await qrCode.getRawData('png')
    const qrBase64 = qrBuffer ? Buffer.from(qrBuffer).toString('base64') : null

    return {
      success: true,
      payment: {
        dbPaymentId: payment.id,
        reference: reference.toString(),
        amount,
        serviceSlug,
        url: url.toString(),
        qrCode: qrBase64 ? `data:image/png;base64,${qrBase64}` : null,
      },
    }
  } catch (error) {
    console.error('Service payment initialization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize payment',
    }
  }
}

/**
 * Verify service payment and grant access
 */
export async function verifyServicePayment(input: z.infer<typeof servicePaymentVerifySchema>) {
  try {
    const { reference, dbPaymentId, walletAddress, serviceSlug } =
      servicePaymentVerifySchema.parse(input)

    // Connect to Solana
    const connection = getSolanaConnection()
    const referencePublicKey = new PublicKey(reference)
    const recipient = getMerchantWallet()

    try {
      // Find transaction reference on blockchain
      const signatureInfo = await findReference(connection, referencePublicKey, {
        finality: 'confirmed',
      })

      // Get payment from unified table
      const payment = await getPayment(dbPaymentId)
      if (!payment) {
        throw new Error('Payment record not found')
      }

      // Validate the transaction
      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient,
          amount: payment.amount,
          reference: referencePublicKey,
        },
        { commitment: 'confirmed' }
      )

      // Update payment status in unified table
      await updatePaymentStatus(dbPaymentId, 'confirmed', signatureInfo.signature)

      // Grant service access using unified function
      await grantServiceAccess({
        walletAddress,
        serviceSlug,
        paymentId: dbPaymentId,
        serviceType: 'one_time', // Lifetime access
        expiresAt: null, // Never expires
      })

      return {
        success: true,
        status: 'confirmed',
        signature: signatureInfo.signature,
      }
    } catch (error) {
      if (error instanceof FindReferenceError) {
        // Transaction not found yet - still pending
        return {
          success: true,
          status: 'pending',
        }
      }
      throw error
    }
  } catch (error) {
    console.error('Service payment verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment',
    }
  }
}
