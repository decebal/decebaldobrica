/**
 * Newsletter domain → aggregates `subscriber` and `issue`.
 *
 * Covers four Supabase tables (event model §4.1–4.4):
 *   - newsletter_subscribers  → subscriber.* lifecycle (fan-out: 1 row → 1..N)
 *   - newsletter_issues       → issue.* lifecycle
 *   - newsletter_events       → subscriber.message-event
 *   - newsletter_subscriptions→ subscriber.subscription-*
 *
 * `newsletter_events` and `newsletter_subscriptions` reference a subscriber by
 * UUID; we resolve that to the subscriber's email (the stream key) using the
 * subscribers table so all of a subscriber's facts live in one stream.
 */
import {
  type DomainMigrator,
  type MigrationEvent,
  compact,
  migrationMetadata,
  pgTimestampToIso,
  toNumber,
} from './common'
import type { DumpRow } from './dump'

const subscriberStream = (email: string): string => `subscriber:${email}`
const issueStream = (uuid: string): string => `issue:${uuid}`

/**
 * Subscribers. Fan-out: each row emits `subscribed` plus optional lifecycle
 * events derived from which columns are populated, preserving the original
 * timestamps as event time. Idempotency key per event is
 * `sub:<email>:<state>` (one of each state per subscriber by construction).
 */
export function transformSubscribers(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const email = r.email
    if (!email) continue
    const stream = subscriberStream(email)
    const supabaseId = r.id

    const subscribedAt = pgTimestampToIso(r.subscribed_at) ?? pgTimestampToIso(r.created_at)

    // subscribed — always
    events.push({
      event_type: 'subscriber.subscribed',
      entity_id: stream,
      idempotency_key: `sub:${email}:subscribed`,
      payload: compact({
        email,
        name: r.name || null,
        tier: r.tier ?? 'free',
        status: r.status ?? 'pending',
        frequency: r.frequency ?? 'weekly',
        interests: r.interests || null,
        utm_source: r.utm_source,
        utm_medium: r.utm_medium,
        utm_campaign: r.utm_campaign,
        subscribed_at: subscribedAt,
      }),
      metadata: migrationMetadata(`sub:${email}:subscribed`, supabaseId),
    })

    // confirmation-requested — if a token is present
    if (r.confirmation_token) {
      const key = `sub:${email}:confirmation-requested`
      events.push({
        event_type: 'subscriber.confirmation_requested',
        entity_id: stream,
        idempotency_key: key,
        payload: compact({
          confirmation_token: r.confirmation_token,
          confirmation_token_expires_at: pgTimestampToIso(r.confirmation_token_expires_at),
        }),
        metadata: migrationMetadata(key, supabaseId),
      })
    }

    // confirmed
    if (r.confirmed_at) {
      const key = `sub:${email}:confirmed`
      events.push({
        event_type: 'subscriber.confirmed',
        entity_id: stream,
        idempotency_key: key,
        payload: { confirmed_at: pgTimestampToIso(r.confirmed_at) },
        metadata: migrationMetadata(key, supabaseId),
      })
    }

    // unsubscribed
    if (r.unsubscribed_at) {
      const key = `sub:${email}:unsubscribed`
      events.push({
        event_type: 'subscriber.unsubscribed',
        entity_id: stream,
        idempotency_key: key,
        payload: { unsubscribed_at: pgTimestampToIso(r.unsubscribed_at) },
        metadata: migrationMetadata(key, supabaseId),
      })
    }

    // tier-changed — only when not the default free tier
    if (r.tier && r.tier !== 'free') {
      const key = `sub:${email}:tier-changed`
      events.push({
        event_type: 'subscriber.tier_changed',
        entity_id: stream,
        idempotency_key: key,
        payload: compact({
          from_tier: 'free',
          to_tier: r.tier,
          subscription_expires_at: pgTimestampToIso(r.subscription_expires_at),
          stripe_customer_id: r.stripe_customer_id,
          stripe_subscription_id: r.stripe_subscription_id,
          solana_wallet_address: r.solana_wallet_address,
        }),
        metadata: migrationMetadata(key, supabaseId),
      })
    }

    // engagement-updated — only when there is real engagement data
    const openRate = toNumber(r.open_rate)
    const clickRate = toNumber(r.click_rate)
    const hasEngagement =
      (openRate !== null && openRate > 0) ||
      (clickRate !== null && clickRate > 0) ||
      Boolean(r.last_opened_at)
    if (hasEngagement) {
      const key = `sub:${email}:engagement-updated`
      events.push({
        event_type: 'subscriber.engagement_updated',
        entity_id: stream,
        idempotency_key: key,
        payload: compact({
          open_rate: openRate,
          click_rate: clickRate,
          last_opened_at: pgTimestampToIso(r.last_opened_at),
        }),
        metadata: migrationMetadata(key, supabaseId),
      })
    }
  }

  return events
}

/** Newsletter issues → `issue` aggregate. */
export function transformIssues(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const uuid = r.id
    if (!uuid) continue
    const stream = issueStream(uuid)

    const createdKey = `issue:${uuid}:created`
    events.push({
      event_type: 'issue.created',
      entity_id: stream,
      idempotency_key: createdKey,
      payload: compact({
        title: r.title,
        subject: r.subject,
        preview_text: r.preview_text,
        content_html: r.content_html,
        content_text: r.content_text,
        tier: r.tier ?? 'free',
        blog_post_slug: r.blog_post_slug,
        scheduled_for: pgTimestampToIso(r.scheduled_for),
        status: r.status ?? 'draft',
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(createdKey, uuid),
    })

    if (r.sent_at) {
      const key = `issue:${uuid}:sent`
      events.push({
        event_type: 'issue.sent',
        entity_id: stream,
        idempotency_key: key,
        payload: compact({
          sent_at: pgTimestampToIso(r.sent_at),
          recipients_count: toNumber(r.recipients_count),
        }),
        metadata: migrationMetadata(key, uuid),
      })
    }

    const opens = toNumber(r.opens_count) ?? 0
    const clicks = toNumber(r.clicks_count) ?? 0
    const unsubs = toNumber(r.unsubscribes_count) ?? 0
    if (opens > 0 || clicks > 0 || unsubs > 0) {
      const key = `issue:${uuid}:metrics-updated`
      events.push({
        event_type: 'issue.metrics_updated',
        entity_id: stream,
        idempotency_key: key,
        payload: { opens_count: opens, clicks_count: clicks, unsubscribes_count: unsubs },
        metadata: migrationMetadata(key, uuid),
      })
    }
  }

  return events
}

/**
 * Newsletter message events → `subscriber.message-event` on the subscriber's
 * stream. Needs a subscriber_id→email resolver. Idempotency key
 * `nlevent:<supabase_id>` (the original event UUID) prevents double-count.
 */
export function transformNewsletterEvents(
  rows: DumpRow[],
  emailBySubscriberId: Map<string, string>
): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const subId = r.subscriber_id
    const email = subId ? emailBySubscriberId.get(subId) : undefined
    if (!email) {
      throw new Error(
        `newsletter_events row ${r.id}: cannot resolve subscriber_id=${subId} to an email`
      )
    }
    const key = `nlevent:${r.id}`
    events.push({
      event_type: 'subscriber.message_event',
      entity_id: subscriberStream(email),
      idempotency_key: key,
      payload: compact({
        issue_id: r.issue_id,
        kind: r.event_type,
        link_url: r.link_url,
        user_agent: r.user_agent,
        ip_address: r.ip_address,
        occurred_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(key, r.id),
    })
  }

  return events
}

/**
 * Newsletter subscriptions (billing) → `subscriber.subscription-*` events on
 * the subscriber's stream. Resolves subscriber_id→email. Emits
 * `subscription-started` always, plus `cancelled`/`status-changed` per state.
 */
export function transformSubscriptions(
  rows: DumpRow[],
  emailBySubscriberId: Map<string, string>
): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const subId = r.subscriber_id
    const email = subId ? emailBySubscriberId.get(subId) : undefined
    if (!email) {
      throw new Error(
        `newsletter_subscriptions row ${r.id}: cannot resolve subscriber_id=${subId} to an email`
      )
    }
    const stream = subscriberStream(email)
    const uuid = r.id as string

    const startKey = `subscription:${uuid}:started`
    events.push({
      event_type: 'subscriber.subscription_started',
      entity_id: stream,
      idempotency_key: startKey,
      payload: compact({
        subscription_uuid: uuid,
        provider: r.provider,
        provider_subscription_id: r.provider_subscription_id,
        tier: r.tier,
        amount: toNumber(r.amount),
        currency: r.currency,
        interval: r.interval,
        current_period_start: pgTimestampToIso(r.current_period_start),
        current_period_end: pgTimestampToIso(r.current_period_end),
      }),
      metadata: migrationMetadata(startKey, uuid),
    })

    if (r.cancelled_at) {
      const key = `subscription:${uuid}:cancelled`
      events.push({
        event_type: 'subscriber.subscription_cancelled',
        entity_id: stream,
        idempotency_key: key,
        payload: compact({
          subscription_uuid: uuid,
          cancel_at_period_end: r.cancel_at_period_end === 't',
          cancelled_at: pgTimestampToIso(r.cancelled_at),
        }),
        metadata: migrationMetadata(key, uuid),
      })
    }

    if (r.status && r.status !== 'active') {
      const key = `subscription:${uuid}:status-changed`
      events.push({
        event_type: 'subscriber.subscription_status_changed',
        entity_id: stream,
        idempotency_key: key,
        payload: { subscription_uuid: uuid, status: r.status },
        metadata: migrationMetadata(key, uuid),
      })
    }
  }

  return events
}

/** Build the subscriber_id → email resolver from the subscribers rows. */
export function buildEmailResolver(subscriberRows: DumpRow[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const r of subscriberRows) {
    if (r.id && r.email) map.set(r.id, r.email)
  }
  return map
}

export const subscribersMigrator: DomainMigrator = {
  table: 'newsletter_subscribers',
  label: 'Newsletter subscribers',
  transform: transformSubscribers,
}

export const issuesMigrator: DomainMigrator = {
  table: 'newsletter_issues',
  label: 'Newsletter issues',
  transform: transformIssues,
}
