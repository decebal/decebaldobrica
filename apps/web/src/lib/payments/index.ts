/**
 * Unified Payment System — AllSource event-sourced.
 *
 * Reads fold an aggregate's event stream into the current-state read shapes
 * below; writes append events. Stream ids and event types match the migrated
 * model exactly (docs/ALLSOURCE_EVENT_MODEL.md §4.5–4.8, §4.11) — event types
 * use underscores only (the gateway rejects hyphens with 422).
 *
 * Replaces the previous Supabase-backed implementation. The `payment.id`
 * surfaced to callers is the AllSource stream id (`payment:<reference|uuid>`),
 * so existing `getPayment(id)` / `updatePaymentStatus(id, …)` round-trips work
 * without callers changing.
 */

import { type AllSourceClient, type Event, getAllSourceClient } from '@decebal/database'
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
// SHARED HELPERS
// ============================================================================

type Payload = Record<string, unknown>

function pstr(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined
}

function pnum(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function isCryptoCurrency(currency: Currency): boolean {
  return ['BTC', 'ETH', 'SOL', 'USDC'].includes(currency)
}

function normalizeEvents(res: unknown): Event[] {
  if (Array.isArray(res)) return res as Event[]
  if (res && typeof res === 'object') {
    const obj = res as Record<string, unknown>
    if (Array.isArray(obj.events)) return obj.events as Event[]
    if (Array.isArray(obj.data)) return obj.data as Event[]
  }
  return []
}

async function queryAllEvents(
  client: AllSourceClient,
  params: { entity_id?: string; event_type?: string }
): Promise<Event[]> {
  const pageSize = 500
  let offset = 0
  const all: Event[] = []
  while (true) {
    const res = (await client.queryEvents({ ...params, limit: pageSize, offset })) as unknown
    const page = normalizeEvents(res)
    all.push(...page)
    if (page.length < pageSize) break
    offset += pageSize
  }
  return all
}

// ============================================================================
// USER PROFILES — aggregate `wallet` (stream wallet:<wallet_address>)
// ============================================================================

const WALLET_STREAM = (wallet: string): string => `wallet:${wallet}`

function foldUserProfile(wallet: string, events: Event[]): UserProfile | null {
  let seeded = false
  const profile: UserProfile = {
    id: WALLET_STREAM(wallet),
    walletAddress: wallet,
    walletChain: 'solana',
    email: null,
    name: null,
    preferredPaymentMethod: 'SOL',
    createdAt: '',
    updatedAt: '',
  }
  for (const ev of events) {
    const p = (ev.payload ?? {}) as Payload
    if (ev.event_type === 'profile.created') {
      seeded = true
      profile.walletChain = (pstr(p.wallet_chain) as Chain) ?? 'solana'
      profile.email = pstr(p.email) ?? null
      profile.name = pstr(p.name) ?? null
      profile.preferredPaymentMethod = (pstr(p.preferred_payment_method) as Currency) ?? 'SOL'
      profile.createdAt = pstr(p.created_at) ?? ev.timestamp
    } else if (ev.event_type === 'profile.updated') {
      if (p.email !== undefined) profile.email = pstr(p.email) ?? null
      if (p.name !== undefined) profile.name = pstr(p.name) ?? null
      if (p.preferred_payment_method !== undefined) {
        profile.preferredPaymentMethod =
          (pstr(p.preferred_payment_method) as Currency) ?? profile.preferredPaymentMethod
      }
    }
    profile.updatedAt = ev.timestamp
  }
  if (!seeded) return null
  if (!profile.createdAt) profile.createdAt = profile.updatedAt
  return profile
}

/**
 * Ensure a user profile exists for a wallet (get-or-create). Returns the stream
 * id, which is the profile's stable identifier. Event model §4.8.
 */
export async function ensureUserProfile(
  walletAddress: string,
  chain: Chain = 'solana'
): Promise<string> {
  const client = getAllSourceClient()
  const stream = WALLET_STREAM(walletAddress)
  const events = await queryAllEvents(client, { entity_id: stream })
  if (foldUserProfile(walletAddress, events)) return stream

  await client.ingestEvent({
    event_type: 'profile.created',
    entity_id: stream,
    payload: {
      wallet_address: walletAddress,
      wallet_chain: chain,
      preferred_payment_method: 'SOL',
      created_at: new Date().toISOString(),
    },
    metadata: { source: 'app', schema_version: 1 },
  })
  return stream
}

export async function getUserProfile(walletAddress: string): Promise<UserProfile | null> {
  const client = getAllSourceClient()
  const events = await queryAllEvents(client, { entity_id: WALLET_STREAM(walletAddress) })
  return foldUserProfile(walletAddress, events)
}

export async function updateUserProfile(
  walletAddress: string,
  updates: Partial<Omit<UserProfile, 'id' | 'walletAddress' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const client = getAllSourceClient()
  await client.ingestEvent({
    event_type: 'profile.updated',
    entity_id: WALLET_STREAM(walletAddress),
    payload: {
      email: updates.email ?? undefined,
      name: updates.name ?? undefined,
      preferred_payment_method: updates.preferredPaymentMethod ?? undefined,
    },
    metadata: { source: 'app', schema_version: 1 },
  })
}

// ============================================================================
// PAYMENTS — aggregate `payment` (stream payment:<reference|uuid>)
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

function paymentStream(referenceOrUuid: string): string {
  return `payment:${referenceOrUuid}`
}

function foldPayment(streamId: string, events: Event[]): Payment | null {
  let seeded = false
  const payment: Payment = {
    id: streamId,
    userId: null,
    walletAddress: '',
    paymentType: 'meeting',
    entityType: null,
    entityId: null,
    amount: 0,
    currency: 'SOL',
    currencyType: 'crypto',
    chain: 'solana',
    network: null,
    reference: null,
    signature: null,
    provider: 'solana_pay',
    providerPaymentId: null,
    status: 'pending',
    description: null,
    metadata: null,
    createdAt: '',
    confirmedAt: null,
    expiresAt: null,
    updatedAt: '',
  }

  for (const ev of events) {
    const p = (ev.payload ?? {}) as Payload
    switch (ev.event_type) {
      case 'payment.initiated': {
        seeded = true
        payment.userId = pstr(p.user_id) ?? null
        payment.walletAddress = pstr(p.wallet_address) ?? ''
        payment.paymentType = (pstr(p.payment_type) as PaymentType) ?? 'meeting'
        payment.entityType = pstr(p.entity_type) ?? null
        payment.entityId = pstr(p.entity_id) ?? null
        payment.amount = pnum(p.amount) ?? 0
        payment.currency = (pstr(p.currency) as Currency) ?? 'SOL'
        payment.currencyType = (pstr(p.currency_type) as CurrencyType) ?? 'crypto'
        payment.chain = (pstr(p.chain) as Chain) ?? 'solana'
        payment.network = (pstr(p.network) as Network) ?? null
        payment.reference = pstr(p.reference) ?? null
        payment.provider = pstr(p.provider) ?? 'solana_pay'
        payment.providerPaymentId = pstr(p.provider_payment_id) ?? null
        payment.description = pstr(p.description) ?? null
        payment.metadata = (p.metadata as Record<string, any>) ?? null
        payment.createdAt = pstr(p.created_at) ?? ev.timestamp
        payment.expiresAt = pstr(p.expires_at) ?? null
        break
      }
      case 'payment.confirmed': {
        payment.status = 'confirmed'
        payment.signature = pstr(p.signature) ?? payment.signature
        payment.confirmedAt = pstr(p.confirmed_at) ?? ev.timestamp
        break
      }
      case 'payment.failed': {
        payment.status = 'failed'
        break
      }
      case 'payment.refunded': {
        payment.status = 'refunded'
        payment.signature = pstr(p.signature) ?? payment.signature
        break
      }
      case 'payment.expired': {
        payment.status = 'expired'
        break
      }
      default:
        break
    }
    payment.updatedAt = ev.timestamp
  }

  if (!seeded) return null
  if (!payment.createdAt) payment.createdAt = payment.updatedAt
  return payment
}

/**
 * Create a payment record. Appends `payment.initiated` to a `payment:<reference>`
 * stream (or `payment:<uuid>` when no reference). The returned `Payment.id` is
 * the stream id, so later `getPayment(id)` / `updatePaymentStatus(id, …)` calls
 * address the same stream. Event model §4.5.
 */
export async function createPayment(params: CreatePaymentParams): Promise<Payment> {
  const client = getAllSourceClient()
  const chain = params.chain || 'solana'

  // Ensure the user profile exists (mirrors the prior FK side effect).
  const userId = await ensureUserProfile(params.walletAddress, chain)

  const uuid = crypto.randomUUID()
  const streamKey = params.reference || uuid
  const stream = paymentStream(streamKey)
  const now = new Date().toISOString()

  await client.ingestEvent({
    event_type: 'payment.initiated',
    entity_id: stream,
    payload: {
      payment_uuid: uuid,
      user_id: userId,
      wallet_address: params.walletAddress,
      payment_type: params.paymentType,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      amount: params.amount,
      currency: params.currency,
      currency_type: isCryptoCurrency(params.currency) ? 'crypto' : 'fiat',
      chain,
      network: params.network ?? null,
      reference: params.reference ?? null,
      provider: 'solana_pay',
      description: params.description ?? null,
      metadata: params.metadata ?? null,
      created_at: now,
    },
    metadata: { source: 'app', schema_version: 1 },
  })

  return {
    id: stream,
    userId,
    walletAddress: params.walletAddress,
    paymentType: params.paymentType,
    entityType: params.entityType ?? null,
    entityId: params.entityId ?? null,
    amount: params.amount,
    currency: params.currency,
    currencyType: isCryptoCurrency(params.currency) ? 'crypto' : 'fiat',
    chain,
    network: params.network ?? null,
    reference: params.reference ?? null,
    signature: null,
    provider: 'solana_pay',
    providerPaymentId: null,
    status: 'pending',
    description: params.description ?? null,
    metadata: params.metadata ?? null,
    createdAt: now,
    confirmedAt: null,
    expiresAt: null,
    updatedAt: now,
  }
}

/**
 * Get a payment by id. The id is the AllSource stream id
 * (`payment:<reference|uuid>`); also accepts a bare reference/uuid for
 * convenience. Empty stream → null (payments table was empty in the dump).
 */
export async function getPayment(paymentId: string): Promise<Payment | null> {
  const client = getAllSourceClient()
  const stream = paymentId.startsWith('payment:') ? paymentId : paymentStream(paymentId)
  const events = await queryAllEvents(client, { entity_id: stream })
  return foldPayment(stream, events)
}

/**
 * Get a payment by Solana reference (the stream key when set).
 */
export async function getPaymentByReference(reference: string): Promise<Payment | null> {
  const client = getAllSourceClient()
  const stream = paymentStream(reference)
  const events = await queryAllEvents(client, { entity_id: stream })
  return foldPayment(stream, events)
}

/**
 * Update payment status by appending the matching terminal event
 * (`payment.confirmed` / `.failed` / `.refunded` / `.expired`). Event model §4.5.
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  signature?: string
): Promise<void> {
  const client = getAllSourceClient()
  const stream = paymentId.startsWith('payment:') ? paymentId : paymentStream(paymentId)
  const now = new Date().toISOString()

  if (status === 'confirmed') {
    await client.ingestEvent({
      event_type: 'payment.confirmed',
      entity_id: stream,
      payload: { signature: signature ?? null, confirmed_at: now },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (status === 'failed') {
    await client.ingestEvent({
      event_type: 'payment.failed',
      entity_id: stream,
      payload: { at: now },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (status === 'refunded') {
    await client.ingestEvent({
      event_type: 'payment.refunded',
      entity_id: stream,
      payload: { at: now, signature: signature ?? null },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (status === 'expired') {
    await client.ingestEvent({
      event_type: 'payment.expired',
      entity_id: stream,
      payload: { at: now },
      metadata: { source: 'app', schema_version: 1 },
    })
  }
  // status 'pending' has no terminal event — nothing to append.
}

/**
 * Get a wallet's payment history. Cross-aggregate read: query
 * `payment.initiated` events, filter by wallet, fold each matching stream.
 */
export async function getUserPayments(walletAddress: string, limit = 50): Promise<Payment[]> {
  const client = getAllSourceClient()
  const initiated = await queryAllEvents(client, { event_type: 'payment.initiated' })
  const streams = initiated
    .filter((ev) => pstr((ev.payload as Payload).wallet_address) === walletAddress)
    .map((ev) => ev.entity_id)

  const payments = await foldStreams(client, [...new Set(streams)])
  return payments
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, limit)
}

/**
 * Get payments by entity (e.g. all payments for a meeting). Cross-aggregate
 * read over `payment.initiated` filtered by entity_type + entity_id.
 */
export async function getPaymentsByEntity(
  entityType: string,
  entityId: string
): Promise<Payment[]> {
  const client = getAllSourceClient()
  const initiated = await queryAllEvents(client, { event_type: 'payment.initiated' })
  const streams = initiated
    .filter((ev) => {
      const p = ev.payload as Payload
      return pstr(p.entity_type) === entityType && pstr(p.entity_id) === entityId
    })
    .map((ev) => ev.entity_id)

  const payments = await foldStreams(client, [...new Set(streams)])
  return payments.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

/**
 * Get all payments of a given type (e.g. `meeting`). Cross-aggregate read over
 * `payment.initiated` filtered by payment_type, folded per stream. Powers
 * analytics; returns empty cleanly when no payments exist.
 */
export async function getPaymentsByType(paymentType: PaymentType): Promise<Payment[]> {
  const client = getAllSourceClient()
  const initiated = await queryAllEvents(client, { event_type: 'payment.initiated' })
  const streams = initiated
    .filter((ev) => pstr((ev.payload as Payload).payment_type) === paymentType)
    .map((ev) => ev.entity_id)
  return foldStreams(client, [...new Set(streams)])
}

async function foldStreams(client: AllSourceClient, streams: string[]): Promise<Payment[]> {
  const out: Payment[] = []
  for (const stream of streams) {
    const events = await queryAllEvents(client, { entity_id: stream })
    const payment = foldPayment(stream, events)
    if (payment) out.push(payment)
  }
  return out
}

// ============================================================================
// SERVICE ACCESS — aggregate `service-access`
// (stream service-access:<wallet>:<service_slug>)
// ============================================================================

export interface GrantServiceAccessParams {
  walletAddress: string
  serviceSlug: string
  paymentId: string
  serviceType?: 'one_time' | 'subscription' | 'time_limited'
  expiresAt?: Date | null
}

const SERVICE_ACCESS_STREAM = (wallet: string, slug: string): string =>
  `service-access:${wallet}:${slug}`

function foldServiceAccess(wallet: string, slug: string, events: Event[]): ServiceAccess | null {
  let seeded = false
  const access: ServiceAccess = {
    id: SERVICE_ACCESS_STREAM(wallet, slug),
    userId: null,
    walletAddress: wallet,
    serviceSlug: slug,
    serviceType: 'one_time',
    paymentId: null,
    grantedAt: '',
    expiresAt: null,
    isActive: false,
    revokedAt: null,
    revokeReason: null,
    createdAt: '',
    updatedAt: '',
  }

  for (const ev of events) {
    const p = (ev.payload ?? {}) as Payload
    switch (ev.event_type) {
      case 'service_access.granted': {
        seeded = true
        access.userId = pstr(p.user_id) ?? null
        access.serviceType = (pstr(p.service_type) as ServiceAccess['serviceType']) ?? 'one_time'
        access.paymentId = pstr(p.payment_id) ?? null
        access.grantedAt = pstr(p.granted_at) ?? ev.timestamp
        access.expiresAt = pstr(p.expires_at) ?? null
        access.isActive = true
        access.revokedAt = null
        access.revokeReason = null
        access.createdAt = access.createdAt || access.grantedAt
        break
      }
      case 'service_access.revoked': {
        access.isActive = false
        access.revokedAt = pstr(p.revoked_at) ?? ev.timestamp
        access.revokeReason = pstr(p.revoke_reason) ?? null
        break
      }
      case 'service_access.expired': {
        access.isActive = false
        break
      }
      default:
        break
    }
    access.updatedAt = ev.timestamp
  }

  if (!seeded) return null
  if (!access.createdAt) access.createdAt = access.grantedAt || access.updatedAt
  return access
}

function accessIsActive(access: ServiceAccess): boolean {
  if (!access.isActive) return false
  if (access.expiresAt && new Date(access.expiresAt) < new Date()) return false
  return true
}

/**
 * Grant service access (append `service_access.granted`). Upsert-equivalent: the
 * stream is keyed on (wallet, slug); re-granting appends a fresh grant that the
 * fold treats as the current active state. Event model §4.6.
 */
export async function grantServiceAccess(params: GrantServiceAccessParams): Promise<ServiceAccess> {
  const client = getAllSourceClient()
  const userId = await ensureUserProfile(params.walletAddress)
  const stream = SERVICE_ACCESS_STREAM(params.walletAddress, params.serviceSlug)
  const now = new Date().toISOString()

  await client.ingestEvent({
    event_type: 'service_access.granted',
    entity_id: stream,
    payload: {
      user_id: userId,
      service_slug: params.serviceSlug,
      service_type: params.serviceType || 'one_time',
      payment_id: params.paymentId,
      granted_at: now,
      expires_at: params.expiresAt ? params.expiresAt.toISOString() : null,
    },
    metadata: { source: 'app', schema_version: 1 },
  })

  return {
    id: stream,
    userId,
    walletAddress: params.walletAddress,
    serviceSlug: params.serviceSlug,
    serviceType: params.serviceType || 'one_time',
    paymentId: params.paymentId,
    grantedAt: now,
    expiresAt: params.expiresAt ? params.expiresAt.toISOString() : null,
    isActive: true,
    revokedAt: null,
    revokeReason: null,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Whether a wallet has active (granted, not revoked, not expired) access to a
 * service. This is the fold's boolean. Event model §4.6.
 */
export async function hasServiceAccess(
  walletAddress: string,
  serviceSlug: string
): Promise<boolean> {
  const client = getAllSourceClient()
  const stream = SERVICE_ACCESS_STREAM(walletAddress, serviceSlug)
  const events = await queryAllEvents(client, { entity_id: stream })
  const access = foldServiceAccess(walletAddress, serviceSlug, events)
  if (!access) return false
  return accessIsActive(access)
}

/**
 * Get a wallet's active service-access grants. Cross-aggregate read over
 * `service_access.granted`, folded per stream, filtered to active.
 */
export async function getUserServiceAccess(walletAddress: string): Promise<ServiceAccess[]> {
  const client = getAllSourceClient()
  const granted = await queryAllEvents(client, { event_type: 'service_access.granted' })
  const prefix = `service-access:${walletAddress}:`
  const streams = [
    ...new Set(granted.map((ev) => ev.entity_id).filter((id) => id.startsWith(prefix))),
  ]

  const out: ServiceAccess[] = []
  for (const stream of streams) {
    const slug = stream.slice(prefix.length)
    const events = await queryAllEvents(client, { entity_id: stream })
    const access = foldServiceAccess(walletAddress, slug, events)
    if (access && accessIsActive(access)) out.push(access)
  }
  return out
}

/**
 * Revoke service access (append `service_access.revoked`). Event model §4.6.
 */
export async function revokeServiceAccess(
  walletAddress: string,
  serviceSlug: string,
  reason?: string
): Promise<void> {
  const client = getAllSourceClient()
  await client.ingestEvent({
    event_type: 'service_access.revoked',
    entity_id: SERVICE_ACCESS_STREAM(walletAddress, serviceSlug),
    payload: { revoked_at: new Date().toISOString(), revoke_reason: reason ?? null },
    metadata: { source: 'app', schema_version: 1 },
  })
}

// ============================================================================
// MEETING BOOKINGS — aggregate `meeting` (stream meeting:<meeting_id>)
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

const MEETING_STREAM = (meetingId: string): string => `meeting:${meetingId}`

function foldMeeting(meetingId: string, events: Event[]): MeetingBooking | null {
  let seeded = false
  const booking: MeetingBooking = {
    id: MEETING_STREAM(meetingId),
    meetingType: '',
    meetingId,
    userId: null,
    walletAddress: null,
    email: '',
    name: null,
    scheduledAt: '',
    durationMinutes: 0,
    timezone: 'UTC',
    paymentId: null,
    requiresPayment: false,
    paymentAmount: null,
    paymentCurrency: null,
    status: 'pending',
    googleCalendarEventId: null,
    notes: null,
    conversationId: null,
    metadata: null,
    createdAt: '',
    confirmedAt: null,
    cancelledAt: null,
    updatedAt: '',
  }

  for (const ev of events) {
    const p = (ev.payload ?? {}) as Payload
    switch (ev.event_type) {
      case 'meeting.booked': {
        seeded = true
        booking.meetingType = pstr(p.meeting_type) ?? ''
        booking.userId = pstr(p.user_id) ?? null
        booking.walletAddress = pstr(p.wallet_address) ?? null
        booking.email = pstr(p.email) ?? ''
        booking.name = pstr(p.name) ?? null
        booking.scheduledAt = pstr(p.scheduled_at) ?? ''
        booking.durationMinutes = pnum(p.duration_minutes) ?? 0
        booking.timezone = pstr(p.timezone) ?? 'UTC'
        booking.requiresPayment = p.requires_payment === true
        booking.paymentAmount = pnum(p.payment_amount) ?? null
        booking.paymentCurrency = pstr(p.payment_currency) ?? null
        booking.notes = pstr(p.notes) ?? null
        booking.conversationId = pstr(p.conversation_id) ?? null
        booking.metadata = (p.metadata as Record<string, any>) ?? null
        booking.createdAt = pstr(p.created_at) ?? ev.timestamp
        break
      }
      case 'meeting.payment_linked': {
        booking.paymentId = pstr(p.payment_id) ?? booking.paymentId
        break
      }
      case 'meeting.confirmed': {
        booking.status = 'confirmed'
        booking.confirmedAt = pstr(p.confirmed_at) ?? ev.timestamp
        booking.googleCalendarEventId =
          pstr(p.google_calendar_event_id) ?? booking.googleCalendarEventId
        break
      }
      case 'meeting.cancelled': {
        booking.status = 'cancelled'
        booking.cancelledAt = pstr(p.cancelled_at) ?? ev.timestamp
        break
      }
      case 'meeting.completed': {
        booking.status = 'completed'
        break
      }
      case 'meeting.no_show': {
        booking.status = 'no_show'
        break
      }
      default:
        break
    }
    booking.updatedAt = ev.timestamp
  }

  if (!seeded) return null
  if (!booking.createdAt) booking.createdAt = booking.updatedAt
  return booking
}

/**
 * Create a meeting booking (append `meeting.booked`). Event model §4.7.
 */
export async function createMeetingBooking(
  params: CreateMeetingBookingParams
): Promise<MeetingBooking> {
  const client = getAllSourceClient()

  let userId: string | null = null
  if (params.walletAddress) {
    userId = await ensureUserProfile(params.walletAddress)
  }

  const stream = MEETING_STREAM(params.meetingId)
  const now = new Date().toISOString()
  const scheduledAt = params.scheduledAt.toISOString()

  await client.ingestEvent({
    event_type: 'meeting.booked',
    entity_id: stream,
    payload: {
      meeting_type: params.meetingType,
      meeting_id: params.meetingId,
      user_id: userId,
      wallet_address: params.walletAddress ?? null,
      email: params.email,
      name: params.name ?? null,
      scheduled_at: scheduledAt,
      duration_minutes: params.durationMinutes,
      timezone: params.timezone ?? 'UTC',
      requires_payment: params.requiresPayment,
      payment_amount: params.paymentAmount ?? null,
      payment_currency: params.paymentCurrency ?? null,
      notes: params.notes ?? null,
      conversation_id: params.conversationId ?? null,
      metadata: params.metadata ?? null,
      created_at: now,
    },
    metadata: { source: 'app', schema_version: 1 },
  })

  return {
    id: stream,
    meetingType: params.meetingType,
    meetingId: params.meetingId,
    userId,
    walletAddress: params.walletAddress ?? null,
    email: params.email,
    name: params.name ?? null,
    scheduledAt,
    durationMinutes: params.durationMinutes,
    timezone: params.timezone ?? 'UTC',
    paymentId: null,
    requiresPayment: params.requiresPayment,
    paymentAmount: params.paymentAmount ?? null,
    paymentCurrency: params.paymentCurrency ?? null,
    status: 'pending',
    googleCalendarEventId: null,
    notes: params.notes ?? null,
    conversationId: params.conversationId ?? null,
    metadata: params.metadata ?? null,
    createdAt: now,
    confirmedAt: null,
    cancelledAt: null,
    updatedAt: now,
  }
}

export async function getMeetingBooking(meetingId: string): Promise<MeetingBooking | null> {
  const client = getAllSourceClient()
  const events = await queryAllEvents(client, { entity_id: MEETING_STREAM(meetingId) })
  return foldMeeting(meetingId, events)
}

/**
 * Update a meeting booking by appending the matching lifecycle event. Supports
 * the status transitions and the google-calendar/payment links the app uses.
 */
export async function updateMeetingBooking(
  meetingId: string,
  updates: Partial<MeetingBooking>
): Promise<void> {
  const client = getAllSourceClient()
  const stream = MEETING_STREAM(meetingId)
  const now = new Date().toISOString()

  if (updates.status === 'confirmed') {
    await client.ingestEvent({
      event_type: 'meeting.confirmed',
      entity_id: stream,
      payload: {
        confirmed_at: updates.confirmedAt ?? now,
        google_calendar_event_id: updates.googleCalendarEventId ?? null,
      },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (updates.status === 'cancelled') {
    await client.ingestEvent({
      event_type: 'meeting.cancelled',
      entity_id: stream,
      payload: { cancelled_at: updates.cancelledAt ?? now },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (updates.status === 'completed') {
    await client.ingestEvent({
      event_type: 'meeting.completed',
      entity_id: stream,
      payload: { at: now },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (updates.status === 'no_show') {
    await client.ingestEvent({
      event_type: 'meeting.no_show',
      entity_id: stream,
      payload: { at: now },
      metadata: { source: 'app', schema_version: 1 },
    })
  } else if (updates.googleCalendarEventId) {
    // Calendar id set without a status change still flows as a confirmation fact.
    await client.ingestEvent({
      event_type: 'meeting.confirmed',
      entity_id: stream,
      payload: { confirmed_at: now, google_calendar_event_id: updates.googleCalendarEventId },
      metadata: { source: 'app', schema_version: 1 },
    })
  }
}

/**
 * Link a payment to a meeting (append `meeting.payment_linked`). Event model §4.7.
 */
export async function linkPaymentToMeeting(meetingId: string, paymentId: string): Promise<void> {
  const client = getAllSourceClient()
  await client.ingestEvent({
    event_type: 'meeting.payment_linked',
    entity_id: MEETING_STREAM(meetingId),
    payload: { payment_id: paymentId },
    metadata: { source: 'app', schema_version: 1 },
  })
}

/**
 * Get a wallet's meeting bookings. Cross-aggregate read over `meeting.booked`
 * filtered by wallet, folded per stream, newest first.
 */
export async function getUserMeetings(walletAddress: string): Promise<MeetingBooking[]> {
  const client = getAllSourceClient()
  const booked = await queryAllEvents(client, { event_type: 'meeting.booked' })
  const streams = booked
    .filter((ev) => pstr((ev.payload as Payload).wallet_address) === walletAddress)
    .map((ev) => ev.entity_id)

  const out: MeetingBooking[] = []
  for (const stream of [...new Set(streams)]) {
    const meetingId = stream.slice('meeting:'.length)
    const events = await queryAllEvents(client, { entity_id: stream })
    const booking = foldMeeting(meetingId, events)
    if (booking) out.push(booking)
  }
  return out.sort((a, b) => (b.scheduledAt || '').localeCompare(a.scheduledAt || ''))
}

// ============================================================================
// PAYMENT CONFIG — aggregate `payment-config` (AUDIT-ONLY; code is source of truth)
// ============================================================================

/**
 * Get a payment config from the AllSource audit stream. The source of truth is
 * code (`./config`); these `payment_config.defined` events are an optional audit
 * trail (event model §4.11/§6). Returns null when no audit event exists.
 */
export async function getPaymentConfigFromDB(
  configType: string,
  slug: string
): Promise<PaymentConfig | null> {
  const client = getAllSourceClient()
  const stream = `payment-config:${configType}:${slug}`
  const events = await queryAllEvents(client, { entity_id: stream })
  if (events.length === 0) return null

  // Fold to the latest defined/updated state.
  const merged: Payload = {}
  for (const ev of events) {
    if (ev.event_type === 'payment_config.defined' || ev.event_type === 'payment_config.updated') {
      Object.assign(merged, ev.payload ?? {})
    }
    if (ev.event_type === 'payment_config.deactivated') {
      merged.is_active = false
    }
  }
  if (merged.is_active === false) return null

  return {
    configType: configType as PaymentConfig['configType'],
    slug,
    name: pstr(merged.name) ?? slug,
    description: pstr(merged.description) ?? '',
    priceSol: pnum(merged.price_sol),
    priceUsd: pnum(merged.price_usd),
    priceBtc: pnum(merged.price_btc),
    priceEth: pnum(merged.price_eth),
    durationMinutes: pnum(merged.duration_minutes),
    benefits: Array.isArray(merged.benefits) ? (merged.benefits as string[]) : [],
    metadata: (merged.metadata as Record<string, any>) ?? {},
    isActive: merged.is_active !== false,
    isPopular: merged.is_popular === true,
  }
}

/**
 * Emit an audit `payment_config.defined` event for a code-defined config. The
 * code config remains the source of truth; this just records it in AllSource.
 */
export async function syncPaymentConfigToDB(config: PaymentConfig): Promise<void> {
  const client = getAllSourceClient()
  await client.ingestEvent({
    event_type: 'payment_config.defined',
    entity_id: `payment-config:${config.configType}:${config.slug}`,
    payload: {
      config_type: config.configType,
      config_slug: config.slug,
      name: config.name,
      description: config.description,
      price_sol: config.priceSol ?? null,
      price_usd: config.priceUsd ?? null,
      price_btc: config.priceBtc ?? null,
      price_eth: config.priceEth ?? null,
      duration_minutes: config.durationMinutes ?? null,
      benefits: config.benefits ?? null,
      metadata: config.metadata ?? null,
      is_active: config.isActive ?? true,
      is_popular: config.isPopular ?? false,
    },
    metadata: { source: 'app', schema_version: 1 },
  })
}

// Re-export config types and functions
export * from './config'
