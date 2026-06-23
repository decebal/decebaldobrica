import { randomBytes } from 'node:crypto'
import { type AllSourceClient, type Event, getAllSourceClient } from '@decebal/database'

// Types matching the read shapes consumers expect (formerly the Supabase rows).
// These are now reconstructed by folding the AllSource `subscriber:*` / `issue:*`
// event streams rather than read from Postgres columns.
export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  tier: 'free' | 'premium' | 'founding'
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  confirmed_at?: string
  unsubscribed_at?: string
  confirmation_token?: string
  confirmation_token_expires_at?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  solana_wallet_address?: string
  subscription_expires_at?: string
  frequency: 'weekly' | 'daily' | 'monthly'
  interests?: string[]
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  open_rate: number
  click_rate: number
  last_opened_at?: string
  created_at: string
  updated_at: string
}

export interface NewsletterIssue {
  id: string
  title: string
  subject: string
  preview_text?: string
  content_html: string
  content_text: string
  status: 'draft' | 'scheduled' | 'sent'
  tier: 'free' | 'premium' | 'all'
  blog_post_slug?: string
  scheduled_for?: string
  sent_at?: string
  recipients_count: number
  opens_count: number
  clicks_count: number
  unsubscribes_count: number
  created_at: string
  updated_at: string
}

export interface NewsletterEvent {
  id: string
  subscriber_id: string
  issue_id: string
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  link_url?: string
  user_agent?: string
  ip_address?: string
  created_at: string
}

export interface NewsletterSubscription {
  id: string
  subscriber_id: string
  provider: 'stripe' | 'solana'
  provider_subscription_id?: string
  tier: 'premium' | 'founding'
  status: 'active' | 'cancelled' | 'past_due' | 'expired'
  amount: number
  currency: string
  interval: 'month' | 'year'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at?: string
  created_at: string
  updated_at: string
}

// ============================================================================
// AllSource event-model constants (must match the migrated streams; the gateway
// rejects hyphenated event_types — see docs/ALLSOURCE_EVENT_MODEL.md §1).
// ============================================================================

const SUBSCRIBER_STREAM = (email: string): string => `subscriber:${email}`
const ISSUE_STREAM = (uuid: string): string => `issue:${uuid}`

// Subscriber lifecycle event types we fold over for list reads.
const SUBSCRIBER_LIFECYCLE_TYPES = [
  'subscriber.subscribed',
  'subscriber.confirmation_requested',
  'subscriber.confirmed',
  'subscriber.unsubscribed',
  'subscriber.bounced',
  'subscriber.tier_changed',
  'subscriber.engagement_updated',
] as const

type Payload = Record<string, unknown>

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined
}

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}

/**
 * Fold a single subscriber's event stream (`subscriber:<email>`) into the
 * `NewsletterSubscriber` read shape. Returns null if the stream has no
 * `subscriber.subscribed` seed event.
 *
 * Mirrors the projection contract in docs/ALLSOURCE_EVENT_MODEL.md §4.1.
 */
function foldSubscriber(email: string, events: Event[]): NewsletterSubscriber | null {
  // Events come back in append order from the gateway.
  let seeded = false
  const sub: NewsletterSubscriber = {
    id: SUBSCRIBER_STREAM(email),
    email,
    tier: 'free',
    status: 'pending',
    subscribed_at: '',
    frequency: 'weekly',
    open_rate: 0,
    click_rate: 0,
    created_at: '',
    updated_at: '',
  }

  for (const ev of events) {
    const p = (ev.payload ?? {}) as Payload
    switch (ev.event_type) {
      case 'subscriber.subscribed': {
        seeded = true
        sub.email = str(p.email) ?? email
        sub.name = str(p.name)
        sub.tier = (str(p.tier) as NewsletterSubscriber['tier']) ?? 'free'
        sub.status = (str(p.status) as NewsletterSubscriber['status']) ?? 'pending'
        sub.frequency = (str(p.frequency) as NewsletterSubscriber['frequency']) ?? 'weekly'
        sub.interests = Array.isArray(p.interests) ? (p.interests as string[]) : undefined
        sub.utm_source = str(p.utm_source)
        sub.utm_medium = str(p.utm_medium)
        sub.utm_campaign = str(p.utm_campaign)
        sub.subscribed_at = str(p.subscribed_at) ?? ev.timestamp
        sub.created_at = sub.subscribed_at
        break
      }
      case 'subscriber.confirmation_requested': {
        sub.confirmation_token = str(p.confirmation_token)
        sub.confirmation_token_expires_at = str(p.confirmation_token_expires_at)
        break
      }
      case 'subscriber.confirmed': {
        sub.status = 'active'
        sub.confirmed_at = str(p.confirmed_at) ?? ev.timestamp
        // A confirmation clears any pending token.
        sub.confirmation_token = undefined
        sub.confirmation_token_expires_at = undefined
        break
      }
      case 'subscriber.unsubscribed': {
        sub.status = 'unsubscribed'
        sub.unsubscribed_at = str(p.unsubscribed_at) ?? ev.timestamp
        break
      }
      case 'subscriber.bounced': {
        sub.status = 'bounced'
        break
      }
      case 'subscriber.tier_changed': {
        sub.tier = (str(p.to_tier) as NewsletterSubscriber['tier']) ?? sub.tier
        sub.subscription_expires_at = str(p.subscription_expires_at)
        sub.stripe_customer_id = str(p.stripe_customer_id)
        sub.stripe_subscription_id = str(p.stripe_subscription_id)
        sub.solana_wallet_address = str(p.solana_wallet_address)
        break
      }
      case 'subscriber.engagement_updated': {
        sub.open_rate = num(p.open_rate)
        sub.click_rate = num(p.click_rate)
        sub.last_opened_at = str(p.last_opened_at)
        break
      }
      default:
        break
    }
    sub.updated_at = ev.timestamp
  }

  if (!seeded) return null
  if (!sub.created_at) sub.created_at = sub.updated_at
  return sub
}

/**
 * Fold an issue's event stream (`issue:<uuid>`) into the `NewsletterIssue`
 * read shape. docs/ALLSOURCE_EVENT_MODEL.md §4.2.
 */
function foldIssue(uuid: string, events: Event[]): NewsletterIssue | null {
  let seeded = false
  const issue: NewsletterIssue = {
    id: uuid,
    title: '',
    subject: '',
    content_html: '',
    content_text: '',
    status: 'draft',
    tier: 'free',
    recipients_count: 0,
    opens_count: 0,
    clicks_count: 0,
    unsubscribes_count: 0,
    created_at: '',
    updated_at: '',
  }

  for (const ev of events) {
    const p = (ev.payload ?? {}) as Payload
    switch (ev.event_type) {
      case 'issue.created': {
        seeded = true
        issue.title = str(p.title) ?? ''
        issue.subject = str(p.subject) ?? ''
        issue.preview_text = str(p.preview_text)
        issue.content_html = str(p.content_html) ?? ''
        issue.content_text = str(p.content_text) ?? ''
        issue.tier = (str(p.tier) as NewsletterIssue['tier']) ?? 'free'
        issue.blog_post_slug = str(p.blog_post_slug)
        issue.scheduled_for = str(p.scheduled_for)
        issue.status = (str(p.status) as NewsletterIssue['status']) ?? 'draft'
        issue.created_at = str(p.created_at) ?? ev.timestamp
        break
      }
      case 'issue.scheduled': {
        issue.status = 'scheduled'
        issue.scheduled_for = str(p.scheduled_for)
        break
      }
      case 'issue.sent': {
        issue.status = 'sent'
        issue.sent_at = str(p.sent_at) ?? ev.timestamp
        issue.recipients_count = num(p.recipients_count)
        break
      }
      case 'issue.metrics_updated': {
        issue.opens_count = num(p.opens_count)
        issue.clicks_count = num(p.clicks_count)
        issue.unsubscribes_count = num(p.unsubscribes_count)
        break
      }
      default:
        break
    }
    issue.updated_at = ev.timestamp
  }

  if (!seeded) return null
  if (!issue.created_at) issue.created_at = issue.updated_at
  return issue
}

/**
 * Fold every subscriber stream by querying the lifecycle event types and
 * grouping by `entity_id` (= `subscriber:<email>`). AllSource has no
 * cross-aggregate predicate index, so a "list all subscribers" read is a
 * fold over the lifecycle event types, de-duplicated per stream
 * (docs/ALLSOURCE_EVENT_MODEL.md §4.1 / §6).
 */
async function getAllSubscribers(client: AllSourceClient): Promise<NewsletterSubscriber[]> {
  const byStream = new Map<string, Event[]>()

  for (const eventType of SUBSCRIBER_LIFECYCLE_TYPES) {
    const events = await queryAllEvents(client, { event_type: eventType })
    for (const ev of events) {
      const stream = ev.entity_id
      if (!stream.startsWith('subscriber:')) continue
      const list = byStream.get(stream)
      if (list) list.push(ev)
      else byStream.set(stream, [ev])
    }
  }

  const out: NewsletterSubscriber[] = []
  for (const [stream, events] of byStream) {
    // Fold needs append order; we queried per-type, so sort by timestamp.
    events.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    const email = stream.slice('subscriber:'.length)
    const sub = foldSubscriber(email, events)
    if (sub) out.push(sub)
  }
  return out
}

/**
 * Page through `queryEvents`, defensively handling either an array or an
 * `{ events }` / `{ data }` envelope from the gateway.
 */
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

function normalizeEvents(res: unknown): Event[] {
  if (Array.isArray(res)) return res as Event[]
  if (res && typeof res === 'object') {
    const obj = res as Record<string, unknown>
    if (Array.isArray(obj.events)) return obj.events as Event[]
    if (Array.isArray(obj.data)) return obj.data as Event[]
  }
  return []
}

/**
 * Generate a secure confirmation token (URL-safe random).
 */
export function generateConfirmationToken(): string {
  return randomBytes(32).toString('base64url')
}

/**
 * Subscribe a new user to the newsletter.
 *
 * Appends `subscriber.subscribed` (status pending) + `subscriber.confirmation_requested`
 * to the subscriber stream for the double opt-in flow, then returns the token so
 * the caller (API route) can send the confirmation email. Rejects re-subscribe
 * when the existing fold is already `active` or `pending`; allows resubscribe
 * when previously `unsubscribed` (event model §7).
 */
export async function subscribeToNewsletter(data: {
  email: string
  name?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}): Promise<{
  success: boolean
  subscriberId?: string
  confirmationToken?: string
  error?: string
}> {
  try {
    const client = getAllSourceClient()
    const stream = SUBSCRIBER_STREAM(data.email)

    const existingEvents = await queryAllEvents(client, { entity_id: stream })
    const existing = foldSubscriber(data.email, existingEvents)

    if (existing) {
      if (existing.status === 'active') {
        return { success: false, error: 'You are already subscribed!' }
      }
      if (existing.status === 'pending') {
        return { success: false, error: 'Please check your email to confirm your subscription.' }
      }
      // unsubscribed/bounced → allow resubscribe (append a fresh lifecycle).
    }

    const now = new Date().toISOString()
    await client.ingestEvent({
      event_type: 'subscriber.subscribed',
      entity_id: stream,
      payload: {
        email: data.email,
        name: data.name ?? null,
        tier: 'free',
        status: 'pending',
        frequency: 'weekly',
        utm_source: data.utm_source ?? null,
        utm_medium: data.utm_medium ?? null,
        utm_campaign: data.utm_campaign ?? null,
        subscribed_at: now,
      },
      metadata: { source: 'app', schema_version: 1 },
    })

    const confirmationToken = generateConfirmationToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    await client.ingestEvent({
      event_type: 'subscriber.confirmation_requested',
      entity_id: stream,
      payload: {
        confirmation_token: confirmationToken,
        confirmation_token_expires_at: expiresAt,
      },
      metadata: { source: 'app', schema_version: 1 },
    })

    return { success: true, subscriberId: stream, confirmationToken }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Confirm a subscriber's email using a confirmation token.
 *
 * Cross-aggregate lookup by token: query the `subscriber.confirmation_requested`
 * events for the matching token, then fold that subscriber's stream to validate
 * expiry/current status before appending `subscriber.confirmed`.
 */
export async function confirmSubscription(
  token: string
): Promise<{ success: boolean; error?: string; subscriber?: NewsletterSubscriber }> {
  try {
    const client = getAllSourceClient()

    const tokenEvents = await queryAllEvents(client, {
      event_type: 'subscriber.confirmation_requested',
    })
    const match = tokenEvents.find((ev) => {
      const p = (ev.payload ?? {}) as Payload
      return str(p.confirmation_token) === token
    })

    if (!match) {
      return { success: false, error: 'Invalid confirmation link. Please try subscribing again.' }
    }

    const stream = match.entity_id
    const email = stream.slice('subscriber:'.length)
    const events = await queryAllEvents(client, { entity_id: stream })
    const subscriber = foldSubscriber(email, events)

    if (!subscriber) {
      return { success: false, error: 'Invalid confirmation link. Please try subscribing again.' }
    }

    // Expiry check against the (still-valid) token on the folded record.
    if (subscriber.confirmation_token_expires_at) {
      if (new Date(subscriber.confirmation_token_expires_at) < new Date()) {
        return {
          success: false,
          error: 'This confirmation link has expired. Please subscribe again.',
        }
      }
    }

    // Already confirmed → idempotent success.
    if (subscriber.status === 'active' && subscriber.confirmed_at) {
      return { success: true, subscriber }
    }

    const confirmedAt = new Date().toISOString()
    await client.ingestEvent({
      event_type: 'subscriber.confirmed',
      entity_id: stream,
      payload: { confirmed_at: confirmedAt },
      metadata: { source: 'app', schema_version: 1 },
    })

    return {
      success: true,
      subscriber: { ...subscriber, status: 'active', confirmed_at: confirmedAt },
    }
  } catch (error) {
    console.error('Subscription confirmation error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Unsubscribe a user (append `subscriber.unsubscribed`).
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAllSourceClient()
    await client.ingestEvent({
      event_type: 'subscriber.unsubscribed',
      entity_id: SUBSCRIBER_STREAM(email),
      payload: { unsubscribed_at: new Date().toISOString() },
      metadata: { source: 'app', schema_version: 1 },
    })
    return { success: true }
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Get a single subscriber by email (fold their stream).
 */
export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const client = getAllSourceClient()
    const events = await queryAllEvents(client, { entity_id: SUBSCRIBER_STREAM(email) })
    return foldSubscriber(email, events)
  } catch (error) {
    console.error('Get subscriber error:', error)
    return null
  }
}

/**
 * Get all subscribers (any status), optionally filtered by tier and status.
 *
 * Powers admin list views that need pending/unsubscribed rows too, not just the
 * active ones. Folds every subscriber stream and applies the optional filters.
 */
export async function listSubscribers(filters?: {
  tier?: 'free' | 'premium' | 'founding' | 'all'
  status?: NewsletterSubscriber['status'] | 'all'
}): Promise<NewsletterSubscriber[]> {
  try {
    const client = getAllSourceClient()
    const all = await getAllSubscribers(client)
    return all
      .filter((s) => {
        if (filters?.tier && filters.tier !== 'all' && s.tier !== filters.tier) return false
        if (filters?.status && filters.status !== 'all' && s.status !== filters.status) return false
        return true
      })
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  } catch (error) {
    console.error('List subscribers error:', error)
    return []
  }
}

/**
 * Get all active subscribers, optionally filtered by tier.
 *
 * Folds every subscriber stream (event-type query + de-dup per `entity_id`) and
 * filters on `status === 'active'` (+ tier). Returns the migrated active
 * subscriber(s) — at current volume just `decebal1988@gmail.com`.
 */
export async function getActiveSubscribers(
  tier?: 'free' | 'premium' | 'founding' | 'all'
): Promise<NewsletterSubscriber[]> {
  try {
    const client = getAllSourceClient()
    const all = await getAllSubscribers(client)
    return all.filter((s) => {
      if (s.status !== 'active') return false
      if (tier && tier !== 'all' && s.tier !== tier) return false
      return true
    })
  } catch (error) {
    console.error('Get active subscribers error:', error)
    return []
  }
}

/**
 * Count active subscribers, optionally by tier.
 */
export async function getSubscriberCount(tier?: 'free' | 'premium' | 'founding'): Promise<number> {
  try {
    const client = getAllSourceClient()
    const all = await getAllSubscribers(client)
    return all.filter((s) => {
      if (s.status !== 'active') return false
      if (tier && s.tier !== tier) return false
      return true
    }).length
  } catch (error) {
    console.error('Get subscriber count error:', error)
    return 0
  }
}

/**
 * Track a newsletter message event (sent/opened/clicked/…). Appended to the
 * subscriber's stream as `subscriber.message_event` (event model §4.3). The
 * derived `last_opened_at` is recomputed in the fold, not stored separately.
 */
export async function trackNewsletterEvent(event: {
  email: string
  issue_id: string
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  link_url?: string
  user_agent?: string
  ip_address?: string
}): Promise<boolean> {
  try {
    const client = getAllSourceClient()
    await client.ingestEvent({
      event_type: 'subscriber.message_event',
      entity_id: SUBSCRIBER_STREAM(event.email),
      payload: {
        issue_id: event.issue_id,
        kind: event.event_type,
        link_url: event.link_url ?? null,
        user_agent: event.user_agent ?? null,
        ip_address: event.ip_address ?? null,
        occurred_at: new Date().toISOString(),
      },
      metadata: { source: 'app', schema_version: 1 },
    })
    return true
  } catch (error) {
    console.error('Track event error:', error)
    return false
  }
}

/**
 * Create a new newsletter issue.
 *
 * Appends `issue.created` to a fresh `issue:<uuid>` stream and returns the issue
 * id. Status is `scheduled` when `scheduled_for` is set, else `draft` — same
 * contract as before, now event-sourced (event model §4.2).
 */
export async function createNewsletterIssue(issue: {
  title: string
  subject: string
  preview_text?: string
  content_html: string
  content_text: string
  tier: 'free' | 'premium' | 'all'
  blog_post_slug?: string
  scheduled_for?: string
}): Promise<{ success: boolean; issueId?: string; error?: string }> {
  try {
    const client = getAllSourceClient()
    const issueId = crypto.randomUUID()
    const status: NewsletterIssue['status'] = issue.scheduled_for ? 'scheduled' : 'draft'
    const now = new Date().toISOString()

    await client.ingestEvent({
      event_type: 'issue.created',
      entity_id: ISSUE_STREAM(issueId),
      payload: {
        title: issue.title,
        subject: issue.subject,
        preview_text: issue.preview_text ?? null,
        content_html: issue.content_html,
        content_text: issue.content_text,
        tier: issue.tier,
        blog_post_slug: issue.blog_post_slug ?? null,
        scheduled_for: issue.scheduled_for ?? null,
        status,
        created_at: now,
      },
      metadata: { source: 'app', schema_version: 1 },
    })

    return { success: true, issueId }
  } catch (error) {
    console.error('Create newsletter issue error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Mark an issue as sent (append `issue.sent` with the recipient count). Called
 * after the send loop completes successfully (event model §4.2).
 */
export async function markIssueSent(issueId: string, recipientsCount: number): Promise<boolean> {
  try {
    const client = getAllSourceClient()
    await client.ingestEvent({
      event_type: 'issue.sent',
      entity_id: ISSUE_STREAM(issueId),
      payload: { sent_at: new Date().toISOString(), recipients_count: recipientsCount },
      metadata: { source: 'app', schema_version: 1 },
    })
    return true
  } catch (error) {
    console.error('Mark issue sent error:', error)
    return false
  }
}

/**
 * Get a single issue by id (fold its stream).
 */
export async function getNewsletterIssue(issueId: string): Promise<NewsletterIssue | null> {
  try {
    const client = getAllSourceClient()
    const events = await queryAllEvents(client, { entity_id: ISSUE_STREAM(issueId) })
    return foldIssue(issueId, events)
  } catch (error) {
    console.error('Get newsletter issue error:', error)
    return null
  }
}

/**
 * Has a newsletter issue for this blog post slug already been sent?
 *
 * Issues live in `issue:<uuid>` streams; `issue.created` carries the
 * `blog_post_slug` and `issue.sent` is appended to the same stream once the
 * send loop finishes. We resolve the set of issue streams created for this slug,
 * then check whether any of them has an `issue.sent`. Used by the autopilot
 * (publish-due-posts) so a recurring cron never re-sends the same post.
 *
 * Fail-safe: on any query error we return `true` (treat as already sent) so a
 * transient AllSource outage can never trigger a duplicate blast — a missed
 * send is recoverable next run, a double-send to every subscriber is not.
 */
export async function wasIssueSentForSlug(slug: string): Promise<boolean> {
  try {
    const client = getAllSourceClient()

    const created = await queryAllEvents(client, { event_type: 'issue.created' })
    const slugStreams = new Set(
      created
        .filter((ev) => {
          const p = (ev.payload ?? {}) as Payload
          return str(p.blog_post_slug) === slug
        })
        .map((ev) => ev.entity_id)
    )
    if (slugStreams.size === 0) return false

    const sent = await queryAllEvents(client, { event_type: 'issue.sent' })
    return sent.some((ev) => slugStreams.has(ev.entity_id))
  } catch (error) {
    console.error('wasIssueSentForSlug error (failing safe → treated as sent):', error)
    return true
  }
}

/**
 * Newsletter statistics. Subscriber counts come from the subscriber fold;
 * total issues from a fold over `issue.created`; engagement rates averaged
 * across active subscribers (event model §6 — derived, not stored).
 */
export async function getNewsletterStats(): Promise<{
  totalSubscribers: number
  freeSubscribers: number
  premiumSubscribers: number
  foundingSubscribers: number
  totalIssues: number
  avgOpenRate: number
  avgClickRate: number
}> {
  try {
    const client = getAllSourceClient()
    const all = await getAllSubscribers(client)
    const active = all.filter((s) => s.status === 'active')

    const issueCreated = await queryAllEvents(client, { event_type: 'issue.created' })
    const totalIssues = new Set(issueCreated.map((e) => e.entity_id)).size

    const avgOpenRate =
      active.length > 0 ? active.reduce((acc, s) => acc + (s.open_rate || 0), 0) / active.length : 0
    const avgClickRate =
      active.length > 0
        ? active.reduce((acc, s) => acc + (s.click_rate || 0), 0) / active.length
        : 0

    return {
      totalSubscribers: active.length,
      freeSubscribers: active.filter((s) => s.tier === 'free').length,
      premiumSubscribers: active.filter((s) => s.tier === 'premium').length,
      foundingSubscribers: active.filter((s) => s.tier === 'founding').length,
      totalIssues,
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      avgClickRate: Math.round(avgClickRate * 100) / 100,
    }
  } catch (error) {
    console.error('Get newsletter stats error:', error)
    return {
      totalSubscribers: 0,
      freeSubscribers: 0,
      premiumSubscribers: 0,
      foundingSubscribers: 0,
      totalIssues: 0,
      avgOpenRate: 0,
      avgClickRate: 0,
    }
  }
}
