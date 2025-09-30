// src/actions/payment.ts
// Server Action for Solana Pay integration

'use server'

import { z } from 'zod'
import {
  createPaymentTransaction,
  updatePaymentStatus,
  getPaymentTransaction,
  getMeetingConfig,
  type PaymentTransaction,
} from '@/lib/meetingPayments'
import { savePayment, updatePaymentStatus as updateDbPaymentStatus } from '@/lib/chatHistory'
import { Connection, PublicKey } from '@solana/web3.js'
import { encodeURL, createQR, findReference, validateTransfer, FindReferenceError } from '@solana/pay'
import { Keypair } from '@solana/web3.js'

const paymentInitSchema = z.object({
  meetingType: z.string(),
  meetingId: z.string(),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
})

const paymentVerifySchema = z.object({
  reference: z.string(),
  paymentId: z.string(),
})

// Initialize Solana connection
function getSolanaConnection(): Connection {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  return new Connection(rpcUrl, 'confirmed')
}

// Get merchant wallet from environment
function getMerchantWallet(): PublicKey {
  const walletAddress = process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS
  if (!walletAddress) {
    throw new Error('Merchant wallet address not configured')
  }
  return new PublicKey(walletAddress)
}

/**
 * Initialize a payment for a meeting booking
 * Creates payment transaction and generates QR code
 */
export async function initializePayment(input: z.infer<typeof paymentInitSchema>) {
  try {
    const { meetingType, meetingId, conversationId, userId } = paymentInitSchema.parse(input)

    // Get meeting configuration
    const config = getMeetingConfig(meetingType)

    if (!config.requiresPayment) {
      return {
        success: false,
        error: 'This meeting type does not require payment',
      }
    }

    // Generate unique reference for this payment
    const reference = Keypair.generate().publicKey

    // Create payment transaction in memory
    const paymentTransaction = createPaymentTransaction(
      meetingId,
      config.price,
      reference,
      userId
    )

    // Save to database
    const dbPaymentId = savePayment(
      meetingId,
      config.price,
      reference.toString(),
      conversationId,
      userId
    )

    // Create Solana Pay URL
    const recipient = getMerchantWallet()
    const amount = config.price
    const label = `Meeting: ${meetingType}`
    const message = `Payment for ${config.duration} minute meeting`

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
        id: paymentTransaction.id,
        dbPaymentId,
        reference: reference.toString(),
        amount: config.price,
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

    // Get payment transaction
    const payment = getPaymentTransaction(paymentId)
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

      // Update payment status
      updatePaymentStatus(paymentId, 'confirmed', signatureInfo.signature)
      updateDbPaymentStatus(payment.meetingId, 'confirmed', signatureInfo.signature)

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
 * Returns current status of a payment transaction
 */
export async function getPaymentStatus(paymentId: string) {
  try {
    const payment = getPaymentTransaction(paymentId)

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
        timestamp: payment.timestamp,
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
    const payment = getPaymentTransaction(paymentId)

    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      }
    }

    if (payment.status !== 'pending') {
      return {
        success: false,
        error: 'Cannot cancel payment with status: ' + payment.status,
      }
    }

    updatePaymentStatus(paymentId, 'failed')
    updateDbPaymentStatus(payment.meetingId, 'failed')

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
 * Get payment statistics
 * Returns analytics data for all payments
 */
export async function getPaymentAnalytics() {
  try {
    const { getPaymentStatistics } = await import('@/lib/chatHistory')
    const stats = getPaymentStatistics()

    return {
      success: true,
      analytics: stats,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get analytics',
    }
  }
}
