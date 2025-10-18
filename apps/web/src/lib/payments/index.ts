/**
 * Unified Payment System
 * Supabase-backed payment operations for all payment types
 *
 * This replaces:
 * - lib/meetingPayments.ts (in-memory storage)
 * - lib/supabase/payments.ts (partial implementation)
 * - actions/payment-action.ts (duplicated logic)
 */

import { createClient } from '@/lib/supabase/server'
import type {
  Chain,
  Currency,
  CurrencyType,
  Network,
  PaymentConfig,
  PaymentStatus,
  PaymentType,
} from './config'

// ============================================================================
// TYPES
// ============================================================================

export interface Payment {
  id: string
  userId: string | null
  walletAddress: string
  paymentType: PaymentType
  entityType: string | null
  entityId: string | null
  amount: number
  currency: Currency
  currencyType: CurrencyType
  chain: Chain
  network: Network | null
  reference: string | null
  signature: string | null
  provider: string
  providerPaymentId: string | null
  status: PaymentStatus
  description: string | null
  metadata: Record<string, any> | null
  createdAt: string
  confirmedAt: string | null
  expiresAt: string | null
  updatedAt: string
}

export interface ServiceAccess {
  id: string
  userId: string | null
  walletAddress: string
  serviceSlug: string
  serviceType: 'one_time' | 'subscription' | 'time_limited'
  paymentId: string | null
  grantedAt: string
  expiresAt: string | null
  isActive: boolean
  revokedAt: string | null
  revokeReason: string | null
  createdAt: string
  updatedAt: string
}

export interface MeetingBooking {
  id: string
  meetingType: string
  meetingId: string
  userId: string | null
  walletAddress: string | null
  email: string
  name: string | null
  scheduledAt: string
  durationMinutes: number
  timezone: string
  paymentId: string | null
  requiresPayment: boolean
  paymentAmount: number | null
  paymentCurrency: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  googleCalendarEventId: string | null
  notes: string | null
  conversationId: string | null
  metadata: Record<string, any> | null
  createdAt: string
  confirmedAt: string | null
  cancelledAt: string | null
  updatedAt: string
}

export interface UserProfile {
  id: string
  walletAddress: string
  walletChain: Chain
  email: string | null
  name: string | null
  preferredPaymentMethod: Currency
  createdAt: string
  updatedAt: string
}

// ============================================================================
// USER PROFILES
// ============================================================================

/**
 * Ensure user profile exists for wallet address
 */
export async function ensureUserProfile(
  walletAddress: string,
  chain: Chain = 'solana'
): Promise<string> {
  const supabase = await createClient()

  // Check if profile exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (existing) return existing.id

  // Create profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      wallet_address: walletAddress,
      wallet_chain: chain,
    })
    .select()
    .single()

  if (error) throw error
  return data.id
}

/**
 * Get user profile by wallet address
 */
export async function getUserProfile(walletAddress: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (error) return null
  return data
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  walletAddress: string,
  updates: Partial<Omit<UserProfile, 'id' | 'walletAddress' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('wallet_address', walletAddress)

  if (error) throw error
}

// ============================================================================
// PAYMENTS
// ============================================================================

export interface CreatePaymentParams {
  walletAddress: string
  paymentType: PaymentType
  entityType?: string
  entityId?: string
  amount: number
  currency: Currency
  chain?: Chain
  network?: Network
  reference?: string
  description?: string
  metadata?: Record<string, any>
}

/**
 * Create a payment record
 */
export async function createPayment(params: CreatePaymentParams): Promise<Payment> {
  const supabase = await createClient()

  // Ensure user profile exists
  const userId = await ensureUserProfile(params.walletAddress, params.chain || 'solana')

  const paymentData = {
    user_id: userId,
    wallet_address: params.walletAddress,
    payment_type: params.paymentType,
    entity_type: params.entityType || null,
    entity_id: params.entityId || null,
    amount: params.amount,
    currency: params.currency,
    currency_type: ['BTC', 'ETH', 'SOL', 'USDC'].includes(params.currency) ? 'crypto' : 'fiat',
    chain: params.chain || 'solana',
    network: params.network || null,
    reference: params.reference || null,
    provider: 'solana_pay',
    status: 'pending',
    description: params.description || null,
    metadata: params.metadata || null,
  }

  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get payment by ID
 */
export async function getPayment(paymentId: string): Promise<Payment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single()

  if (error) return null
  return data
}

/**
 * Get payment by reference
 */
export async function getPaymentByReference(reference: string): Promise<Payment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('reference', reference)
    .single()

  if (error) return null
  return data
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  signature?: string
): Promise<void> {
  const supabase = await createClient()

  const updates: any = {
    status,
  }

  if (signature) {
    updates.signature = signature
  }

  if (status === 'confirmed') {
    updates.confirmed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', paymentId)

  if (error) throw error
}

/**
 * Get user's payment history
 */
export async function getUserPayments(
  walletAddress: string,
  limit = 50
): Promise<Payment[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get payments by entity
 */
export async function getPaymentsByEntity(
  entityType: string,
  entityId: string
): Promise<Payment[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// SERVICE ACCESS
// ============================================================================

export interface GrantServiceAccessParams {
  walletAddress: string
  serviceSlug: string
  paymentId: string
  serviceType?: 'one_time' | 'subscription' | 'time_limited'
  expiresAt?: Date | null
}

/**
 * Grant service access to user
 */
export async function grantServiceAccess(
  params: GrantServiceAccessParams
): Promise<ServiceAccess> {
  const supabase = await createClient()

  // Ensure user profile exists
  const userId = await ensureUserProfile(params.walletAddress)

  const accessData = {
    user_id: userId,
    wallet_address: params.walletAddress,
    service_slug: params.serviceSlug,
    service_type: params.serviceType || 'one_time',
    payment_id: params.paymentId,
    granted_at: new Date().toISOString(),
    expires_at: params.expiresAt ? params.expiresAt.toISOString() : null,
    is_active: true,
  }

  const { data, error } = await supabase
    .from('service_access')
    .upsert(accessData, {
      onConflict: 'wallet_address,service_slug',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Check if user has access to service
 */
export async function hasServiceAccess(
  walletAddress: string,
  serviceSlug: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('service_access')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('service_slug', serviceSlug)
    .eq('is_active', true)
    .single()

  if (!data) return false

  // Check if expired
  if (data.expires_at) {
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return false
    }
  }

  return true
}

/**
 * Get user's service access
 */
export async function getUserServiceAccess(walletAddress: string): Promise<ServiceAccess[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_access')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('is_active', true)

  if (error) throw error
  return data || []
}

/**
 * Revoke service access
 */
export async function revokeServiceAccess(
  walletAddress: string,
  serviceSlug: string,
  reason?: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('service_access')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoke_reason: reason || null,
    })
    .eq('wallet_address', walletAddress)
    .eq('service_slug', serviceSlug)

  if (error) throw error
}

// ============================================================================
// MEETING BOOKINGS
// ============================================================================

export interface CreateMeetingBookingParams {
  meetingType: string
  meetingId: string
  email: string
  name?: string
  scheduledAt: Date
  durationMinutes: number
  timezone?: string
  walletAddress?: string
  requiresPayment: boolean
  paymentAmount?: number
  paymentCurrency?: Currency
  notes?: string
  conversationId?: string
  metadata?: Record<string, any>
}

/**
 * Create meeting booking
 */
export async function createMeetingBooking(
  params: CreateMeetingBookingParams
): Promise<MeetingBooking> {
  const supabase = await createClient()

  let userId: string | null = null
  if (params.walletAddress) {
    userId = await ensureUserProfile(params.walletAddress)
  }

  const bookingData = {
    meeting_type: params.meetingType,
    meeting_id: params.meetingId,
    user_id: userId,
    wallet_address: params.walletAddress || null,
    email: params.email,
    name: params.name || null,
    scheduled_at: params.scheduledAt.toISOString(),
    duration_minutes: params.durationMinutes,
    timezone: params.timezone || 'UTC',
    requires_payment: params.requiresPayment,
    payment_amount: params.paymentAmount || null,
    payment_currency: params.paymentCurrency || null,
    status: 'pending',
    notes: params.notes || null,
    conversation_id: params.conversationId || null,
    metadata: params.metadata || null,
  }

  const { data, error } = await supabase
    .from('meeting_bookings')
    .insert(bookingData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get meeting booking by ID
 */
export async function getMeetingBooking(meetingId: string): Promise<MeetingBooking | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('meeting_bookings')
    .select('*')
    .eq('meeting_id', meetingId)
    .single()

  if (error) return null
  return data
}

/**
 * Update meeting booking
 */
export async function updateMeetingBooking(
  meetingId: string,
  updates: Partial<MeetingBooking>
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('meeting_bookings')
    .update(updates)
    .eq('meeting_id', meetingId)

  if (error) throw error
}

/**
 * Link payment to meeting booking
 */
export async function linkPaymentToMeeting(
  meetingId: string,
  paymentId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('meeting_bookings')
    .update({
      payment_id: paymentId,
    })
    .eq('meeting_id', meetingId)

  if (error) throw error
}

/**
 * Get user's meeting bookings
 */
export async function getUserMeetings(walletAddress: string): Promise<MeetingBooking[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('meeting_bookings')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('scheduled_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// PAYMENT CONFIG
// ============================================================================

/**
 * Get payment config from database
 * Falls back to code-defined config if not found
 */
export async function getPaymentConfigFromDB(
  configType: string,
  slug: string
): Promise<PaymentConfig | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payment_config')
    .select('*')
    .eq('config_type', configType)
    .eq('config_slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null

  // Transform DB format to PaymentConfig format
  return {
    configType: data.config_type as any,
    slug: data.config_slug,
    name: data.name,
    description: data.description || '',
    priceSol: data.price_sol ? Number.parseFloat(data.price_sol) : undefined,
    priceUsd: data.price_usd ? Number.parseFloat(data.price_usd) : undefined,
    priceBtc: data.price_btc ? Number.parseFloat(data.price_btc) : undefined,
    priceEth: data.price_eth ? Number.parseFloat(data.price_eth) : undefined,
    durationMinutes: data.duration_minutes || undefined,
    benefits: data.benefits || [],
    metadata: data.metadata || {},
    isActive: data.is_active,
    isPopular: data.is_popular,
  }
}

/**
 * Sync payment config to database
 * Useful for seeding or updating from code
 */
export async function syncPaymentConfigToDB(config: PaymentConfig): Promise<void> {
  const supabase = await createClient()

  const dbData = {
    config_type: config.configType,
    config_slug: config.slug,
    name: config.name,
    description: config.description,
    price_sol: config.priceSol || null,
    price_usd: config.priceUsd || null,
    price_btc: config.priceBtc || null,
    price_eth: config.priceEth || null,
    duration_minutes: config.durationMinutes || null,
    benefits: config.benefits || null,
    metadata: config.metadata || null,
    is_active: config.isActive ?? true,
    is_popular: config.isPopular ?? false,
  }

  const { error } = await supabase
    .from('payment_config')
    .upsert(dbData, {
      onConflict: 'config_type,config_slug',
    })

  if (error) throw error
}

// Re-export config types and functions
export * from './config'
