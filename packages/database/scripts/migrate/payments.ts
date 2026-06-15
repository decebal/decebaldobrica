/**
 * Payments & access domain (event model §4.5–4.8, §4.10, §4.11).
 *
 *   - payments         → payment.* (stream payment:<reference|uuid>)
 *   - service_access   → service-access.* (stream service-access:<wallet>:<slug>)
 *   - meeting_bookings → meeting.* (stream meeting:<meeting_id>)
 *   - user_profiles    → profile.* (stream wallet:<wallet_address>)
 *   - social_posts     → social-post.* (stream social-post:<uuid>)
 *   - payment_config   → payment-config.* (AUDIT-ONLY; source of truth stays in code)
 *
 * Each transactional table emits one creation event plus one terminal event
 * matching the row's current status, preserving the original timestamps.
 */
import {
  type DomainMigrator,
  type MigrationEvent,
  compact,
  migrationMetadata,
  pgTimestampToIso,
  toBool,
  toJson,
  toNumber,
} from './common'
import type { DumpRow } from './dump'

/**
 * Payments. Stream id is `payment:<reference>` when reference is set (the
 * UNIQUE Solana lookup key) else `payment:<uuid>`. Emits `initiated` always and
 * one terminal event matching `status`. Idempotency: `payment:<key>:<state>`.
 */
export function transformPayments(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const ref = r.reference
    const uuid = r.id as string
    const key = ref ?? uuid
    const stream = `payment:${key}`

    const initKey = `payment:${key}:initiated`
    events.push({
      event_type: 'payment.initiated',
      entity_id: stream,
      idempotency_key: initKey,
      payload: compact({
        payment_uuid: uuid,
        user_id: r.user_id,
        wallet_address: r.wallet_address,
        payment_type: r.payment_type,
        entity_type: r.entity_type,
        entity_id: r.entity_id,
        amount: toNumber(r.amount),
        currency: r.currency,
        currency_type: r.currency_type,
        chain: r.chain,
        network: r.network,
        reference: ref,
        provider: r.provider,
        provider_payment_id: r.provider_payment_id,
        description: r.description,
        metadata: toJson(r.metadata),
        created_at: pgTimestampToIso(r.created_at),
        expires_at: pgTimestampToIso(r.expires_at),
      }),
      metadata: migrationMetadata(initKey, uuid),
    })

    const status = r.status
    if (status === 'confirmed' || status === 'completed') {
      const k = `payment:${key}:confirmed`
      events.push({
        event_type: 'payment.confirmed',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({
          signature: r.signature,
          confirmed_at: pgTimestampToIso(r.confirmed_at),
        }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'failed') {
      const k = `payment:${key}:failed`
      events.push({
        event_type: 'payment.failed',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({ at: pgTimestampToIso(r.updated_at) }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'refunded') {
      const k = `payment:${key}:refunded`
      events.push({
        event_type: 'payment.refunded',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({
          at: pgTimestampToIso(r.updated_at),
          signature: r.signature,
        }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'expired') {
      const k = `payment:${key}:expired`
      events.push({
        event_type: 'payment.expired',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({ at: pgTimestampToIso(r.expires_at) }),
        metadata: migrationMetadata(k, uuid),
      })
    }
  }

  return events
}

/** Service access grants. Stream service-access:<wallet>:<slug>. */
export function transformServiceAccess(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const wallet = r.wallet_address
    const slug = r.service_slug
    if (!wallet || !slug) continue
    const stream = `service-access:${wallet}:${slug}`
    const uuid = r.id

    const grantKey = `access:${wallet}:${slug}:granted`
    events.push({
      event_type: 'service_access.granted',
      entity_id: stream,
      idempotency_key: grantKey,
      payload: compact({
        user_id: r.user_id,
        service_slug: slug,
        service_type: r.service_type,
        payment_id: r.payment_id,
        granted_at: pgTimestampToIso(r.granted_at),
        expires_at: pgTimestampToIso(r.expires_at),
      }),
      metadata: migrationMetadata(grantKey, uuid),
    })

    if (r.revoked_at) {
      const k = `access:${wallet}:${slug}:revoked`
      events.push({
        event_type: 'service_access.revoked',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({
          revoked_at: pgTimestampToIso(r.revoked_at),
          revoke_reason: r.revoke_reason,
        }),
        metadata: migrationMetadata(k, uuid),
      })
    }
  }

  return events
}

/** Meeting bookings. Stream meeting:<meeting_id>. */
export function transformMeetings(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const meetingId = r.meeting_id
    if (!meetingId) continue
    const stream = `meeting:${meetingId}`
    const uuid = r.id

    const bookedKey = `meeting:${meetingId}:booked`
    events.push({
      event_type: 'meeting.booked',
      entity_id: stream,
      idempotency_key: bookedKey,
      payload: compact({
        meeting_type: r.meeting_type,
        meeting_id: meetingId,
        user_id: r.user_id,
        wallet_address: r.wallet_address,
        email: r.email,
        name: r.name,
        scheduled_at: pgTimestampToIso(r.scheduled_at),
        duration_minutes: toNumber(r.duration_minutes),
        timezone: r.timezone,
        requires_payment: toBool(r.requires_payment),
        payment_amount: toNumber(r.payment_amount),
        payment_currency: r.payment_currency,
        notes: r.notes,
        conversation_id: r.conversation_id,
        metadata: toJson(r.metadata),
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(bookedKey, uuid),
    })

    if (r.payment_id) {
      const k = `meeting:${meetingId}:payment-linked`
      events.push({
        event_type: 'meeting.payment_linked',
        entity_id: stream,
        idempotency_key: k,
        payload: { payment_id: r.payment_id },
        metadata: migrationMetadata(k, uuid),
      })
    }

    const status = r.status
    if (status === 'confirmed') {
      const k = `meeting:${meetingId}:confirmed`
      events.push({
        event_type: 'meeting.confirmed',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({
          confirmed_at: pgTimestampToIso(r.confirmed_at),
          google_calendar_event_id: r.google_calendar_event_id,
        }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'cancelled') {
      const k = `meeting:${meetingId}:cancelled`
      events.push({
        event_type: 'meeting.cancelled',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({ cancelled_at: pgTimestampToIso(r.cancelled_at) }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'completed') {
      const k = `meeting:${meetingId}:completed`
      events.push({
        event_type: 'meeting.completed',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({ at: pgTimestampToIso(r.updated_at) }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'no_show' || status === 'no-show') {
      const k = `meeting:${meetingId}:no-show`
      events.push({
        event_type: 'meeting.no_show',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({ at: pgTimestampToIso(r.updated_at) }),
        metadata: migrationMetadata(k, uuid),
      })
    }
  }

  return events
}

/** User profiles. Stream wallet:<wallet_address>. */
export function transformUserProfiles(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const wallet = r.wallet_address
    if (!wallet) continue
    const key = `profile:${wallet}:created`
    events.push({
      event_type: 'profile.created',
      entity_id: `wallet:${wallet}`,
      idempotency_key: key,
      payload: compact({
        wallet_address: wallet,
        wallet_chain: r.wallet_chain,
        email: r.email,
        name: r.name,
        preferred_payment_method: r.preferred_payment_method,
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(key, r.id),
    })
  }

  return events
}

/** Social posts. Stream social-post:<uuid>. */
export function transformSocialPosts(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const uuid = r.id
    if (!uuid) continue
    const stream = `social-post:${uuid}`

    const draftKey = `social:${uuid}:drafted`
    events.push({
      event_type: 'social_post.drafted',
      entity_id: stream,
      idempotency_key: draftKey,
      payload: compact({
        blog_post_slug: r.blog_post_slug,
        platform: r.platform,
        content: r.content,
        media_url: r.media_url,
        scheduled_for: pgTimestampToIso(r.scheduled_for),
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(draftKey, uuid),
    })

    const status = r.status
    if (status === 'published') {
      const k = `social:${uuid}:published`
      events.push({
        event_type: 'social_post.published',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({
          published_at: pgTimestampToIso(r.published_at),
          platform_post_id: r.platform_post_id,
          platform_url: r.platform_url,
        }),
        metadata: migrationMetadata(k, uuid),
      })
    } else if (status === 'failed') {
      const k = `social:${uuid}:failed`
      events.push({
        event_type: 'social_post.failed',
        entity_id: stream,
        idempotency_key: k,
        payload: compact({
          error_message: r.error_message,
          retry_count: toNumber(r.retry_count),
        }),
        metadata: migrationMetadata(k, uuid),
      })
    }

    const likes = toNumber(r.likes_count) ?? 0
    const comments = toNumber(r.comments_count) ?? 0
    const shares = toNumber(r.shares_count) ?? 0
    if (likes > 0 || comments > 0 || shares > 0) {
      const k = `social:${uuid}:engagement-updated`
      events.push({
        event_type: 'social_post.engagement_updated',
        entity_id: stream,
        idempotency_key: k,
        payload: { likes_count: likes, comments_count: comments, shares_count: shares },
        metadata: migrationMetadata(k, uuid),
      })
    }
  }

  return events
}

/**
 * Payment config — AUDIT-ONLY (event model §4.11/§6). The source of truth stays
 * in application code; these `payment-config.defined` events are an optional
 * audit trail so the historical seeded config survives in AllSource too.
 * Stream payment-config:<config_type>:<config_slug>.
 */
export function transformPaymentConfig(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const type = r.config_type
    const slug = r.config_slug
    if (!type || !slug) continue
    const key = `config:${type}:${slug}:defined`
    events.push({
      event_type: 'payment_config.defined',
      entity_id: `payment-config:${type}:${slug}`,
      idempotency_key: key,
      payload: compact({
        config_type: type,
        config_slug: slug,
        name: r.name,
        description: r.description,
        price_sol: toNumber(r.price_sol),
        price_usd: toNumber(r.price_usd),
        price_btc: toNumber(r.price_btc),
        price_eth: toNumber(r.price_eth),
        duration_minutes: toNumber(r.duration_minutes),
        benefits: toJson(r.benefits),
        metadata: toJson(r.metadata),
        is_active: toBool(r.is_active),
        is_popular: toBool(r.is_popular),
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(key, r.id),
    })
  }

  return events
}

export const paymentsMigrator: DomainMigrator = {
  table: 'payments',
  label: 'Payments',
  transform: transformPayments,
}
export const serviceAccessMigrator: DomainMigrator = {
  table: 'service_access',
  label: 'Service access',
  transform: transformServiceAccess,
}
export const meetingsMigrator: DomainMigrator = {
  table: 'meeting_bookings',
  label: 'Meeting bookings',
  transform: transformMeetings,
}
export const userProfilesMigrator: DomainMigrator = {
  table: 'user_profiles',
  label: 'User profiles',
  transform: transformUserProfiles,
}
export const socialPostsMigrator: DomainMigrator = {
  table: 'social_posts',
  label: 'Social posts',
  transform: transformSocialPosts,
}
export const paymentConfigMigrator: DomainMigrator = {
  table: 'payment_config',
  label: 'Payment config (audit-only)',
  transform: transformPaymentConfig,
}
