/**
 * Plan interest domain → aggregate `plan-interest` (event model §4.9).
 *
 *   - plan_interest → plan-interest.registered (+ .notified when notified_at)
 *
 * Stream id `plan-interest:<email>:<plan_id>` matches the UNIQUE(email, plan_id)
 * constraint, so registration is naturally unique per stream. Idempotency key
 * `planinterest:<email>:<plan_id>`.
 */
import {
  type DomainMigrator,
  type MigrationEvent,
  compact,
  migrationMetadata,
  pgTimestampToIso,
} from './common'
import type { DumpRow } from './dump'

export function transformPlanInterest(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const email = r.email
    const planId = r.plan_id
    if (!email || !planId) continue
    const stream = `plan-interest:${email}:${planId}`

    const regKey = `planinterest:${email}:${planId}`
    events.push({
      event_type: 'plan_interest.registered',
      entity_id: stream,
      idempotency_key: regKey,
      payload: compact({
        email,
        plan_id: planId,
        plan_name: r.plan_name,
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(regKey, r.id),
    })

    if (r.notified_at) {
      const k = `planinterest:${email}:${planId}:notified`
      events.push({
        event_type: 'plan_interest.notified',
        entity_id: stream,
        idempotency_key: k,
        payload: { notified_at: pgTimestampToIso(r.notified_at) },
        metadata: migrationMetadata(k, r.id),
      })
    }
  }

  return events
}

export const planInterestMigrator: DomainMigrator = {
  table: 'plan_interest',
  label: 'Plan interest',
  transform: transformPlanInterest,
}
