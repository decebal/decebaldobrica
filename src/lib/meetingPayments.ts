import type { PublicKey } from '@solana/web3.js'

/**
 * Meeting payment configuration
 */
export interface MeetingPaymentConfig {
  meetingType: string
  price: number // in SOL
  priceUSD: number // in USD (base price, before geo-pricing)
  duration: number // in minutes
  requiresPayment: boolean
  description?: string // Optional description of what's included
}

/**
 * Meeting types with pricing
 * Prices reflect market rates for Fractional CTO services
 * SOL prices calculated at ~$215/SOL (update as needed)
 */
export const MEETING_TYPES_WITH_PRICING: Record<string, MeetingPaymentConfig> = {
  'Quick Chat (15 min)': {
    meetingType: 'Quick Chat (15 min)',
    price: 0, // Free
    priceUSD: 0,
    duration: 15,
    requiresPayment: false,
    description: 'Free discovery call to discuss your needs',
  },
  'Discovery Call (30 min)': {
    meetingType: 'Discovery Call (30 min)',
    price: 0.7, // ~$150 at $215/SOL
    priceUSD: 150,
    duration: 30,
    requiresPayment: true,
    description: 'Initial project scoping and feasibility analysis',
  },
  'Strategy Session (60 min)': {
    meetingType: 'Strategy Session (60 min)',
    price: 1.9, // ~$400 at $215/SOL
    priceUSD: 400,
    duration: 60,
    requiresPayment: true,
    description: 'Architecture review, tech stack decisions, and roadmap planning',
  },
  'Deep Dive (90 min)': {
    meetingType: 'Deep Dive (90 min)',
    price: 3.3, // ~$700 at $215/SOL
    priceUSD: 700,
    duration: 90,
    requiresPayment: true,
    description: 'Comprehensive system architecture review and detailed technical planning',
  },
}

/**
 * Service deposit amounts (refundable)
 * Used to show serious interest and skip the queue
 */
export const SERVICE_DEPOSITS: Record<string, MeetingPaymentConfig> = {
  'Fractional CTO Deposit': {
    meetingType: 'Fractional CTO Deposit',
    price: 2.3, // ~$500 at $215/SOL
    priceUSD: 500,
    duration: 0,
    requiresPayment: true,
    description:
      'Refundable deposit for Fractional CTO services - shows serious interest and gets priority scheduling',
  },
  'Case Study Deposit': {
    meetingType: 'Case Study Deposit',
    price: 1.4, // ~$300 at $215/SOL
    priceUSD: 300,
    duration: 0,
    requiresPayment: true,
    description: 'Refundable deposit for case study projects - secures your spot in the queue',
  },
  'Technical Writing Deposit': {
    meetingType: 'Technical Writing Deposit',
    price: 0.9, // ~$200 at $215/SOL
    priceUSD: 200,
    duration: 0,
    requiresPayment: true,
    description:
      'Refundable deposit for content creation projects - priority scheduling for articles and tutorials',
  },
  'Architecture Docs Deposit': {
    meetingType: 'Architecture Docs Deposit',
    price: 1.4, // ~$300 at $215/SOL
    priceUSD: 300,
    duration: 0,
    requiresPayment: true,
    description:
      'Refundable deposit for documentation projects - get started faster with priority onboarding',
  },
}

/**
 * Get meeting config by type
 */
export function getMeetingConfig(meetingType: string): MeetingPaymentConfig | undefined {
  return MEETING_TYPES_WITH_PRICING[meetingType]
}

/**
 * Check if meeting type requires payment
 */
export function requiresPayment(meetingType: string): boolean {
  const config = getMeetingConfig(meetingType)
  return config?.requiresPayment ?? false
}

/**
 * Get meeting price
 */
export function getMeetingPrice(meetingType: string): number {
  const config = getMeetingConfig(meetingType)
  return config?.price ?? 0
}

/**
 * Format SOL amount for display
 */
export function formatSOL(amount: number): string {
  return `${amount.toFixed(3)} SOL`
}

/**
 * Format USD equivalent (approximate)
 */
export function formatUSDEquivalent(solAmount: number, solPriceUSD = 100): string {
  const usd = solAmount * solPriceUSD
  return `~$${usd.toFixed(2)}`
}

/**
 * Payment transaction record
 */
export interface PaymentTransaction {
  id: string
  meetingId: string
  amount: number // SOL
  reference: string // PublicKey as string
  status: 'pending' | 'confirmed' | 'failed'
  signature?: string
  timestamp: number
  userId?: string
}

/**
 * Store payment transactions (in-memory for now, should be in database)
 */
const paymentTransactions: PaymentTransaction[] = []

/**
 * Create a payment transaction record
 */
export function createPaymentTransaction(
  meetingId: string,
  amount: number,
  reference: PublicKey,
  userId?: string
): PaymentTransaction {
  const transaction: PaymentTransaction = {
    id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    meetingId,
    amount,
    reference: reference.toString(),
    status: 'pending',
    timestamp: Date.now(),
    userId,
  }

  paymentTransactions.push(transaction)
  return transaction
}

/**
 * Update payment transaction status
 */
export function updatePaymentStatus(
  transactionId: string,
  status: PaymentTransaction['status'],
  signature?: string
): boolean {
  const transaction = paymentTransactions.find((t) => t.id === transactionId)
  if (transaction) {
    transaction.status = status
    if (signature) {
      transaction.signature = signature
    }
    return true
  }
  return false
}

/**
 * Get payment transaction by ID
 */
export function getPaymentTransaction(paymentId: string): PaymentTransaction | undefined {
  return paymentTransactions.find((t) => t.id === paymentId)
}

/**
 * Get payment transaction by meeting ID
 */
export function getPaymentByMeetingId(meetingId: string): PaymentTransaction | undefined {
  return paymentTransactions.find((t) => t.meetingId === meetingId)
}

/**
 * Get payment transaction by reference
 */
export function getPaymentByReference(reference: string): PaymentTransaction | undefined {
  return paymentTransactions.find((t) => t.reference === reference)
}

/**
 * Check if meeting is paid
 */
export function isMeetingPaid(meetingId: string): boolean {
  const payment = getPaymentByMeetingId(meetingId)
  return payment?.status === 'confirmed'
}

/**
 * Get all payment transactions
 */
export function getAllPayments(): PaymentTransaction[] {
  return [...paymentTransactions]
}

/**
 * Get payments by status
 */
export function getPaymentsByStatus(status: PaymentTransaction['status']): PaymentTransaction[] {
  return paymentTransactions.filter((t) => t.status === status)
}

/**
 * Calculate total revenue in SOL
 */
export function calculateTotalRevenue(): number {
  return paymentTransactions
    .filter((t) => t.status === 'confirmed')
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Get payment statistics
 */
export function getPaymentStatistics() {
  const all = paymentTransactions.length
  const confirmed = paymentTransactions.filter((t) => t.status === 'confirmed').length
  const pending = paymentTransactions.filter((t) => t.status === 'pending').length
  const failed = paymentTransactions.filter((t) => t.status === 'failed').length
  const totalRevenue = calculateTotalRevenue()

  return {
    total: all,
    confirmed,
    pending,
    failed,
    totalRevenue,
    averagePayment: confirmed > 0 ? totalRevenue / confirmed : 0,
  }
}

/**
 * Get meeting price in USD (base price, before geo-pricing)
 */
export function getMeetingPriceUSD(meetingType: string): number {
  const config = getMeetingConfig(meetingType)
  return config?.priceUSD ?? 0
}

/**
 * Format USD price for display
 */
export function formatUSD(amount: number): string {
  return `$${amount.toFixed(0)}`
}
