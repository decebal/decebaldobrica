/**
 * Admin domain → aggregate `admin` (event model §4.12–4.13).
 *
 *   - admin_users        → admin.registered (stream admin:<email>)
 *   - admin_activity_log → admin.activity-logged (same stream, append-only audit)
 *
 * Per the settled auth decision (§2), `auth_user_id` is carried as an opaque
 * payload attribute only — no `auth.*` row is migrated and no FK is rebuilt.
 * `admin_activity_log.admin_user_id` (UUID FK) is resolved to the admin's email
 * (the stream key) using the admin_users rows.
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

const adminStream = (email: string): string => `admin:${email}`

/** Admin users → `admin.registered`. Idempotency `admin:<email>:registered`. */
export function transformAdminUsers(rows: DumpRow[]): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const email = r.email
    if (!email) continue
    const key = `admin:${email}:registered`
    events.push({
      event_type: 'admin.registered',
      entity_id: adminStream(email),
      idempotency_key: key,
      payload: compact({
        email,
        full_name: r.full_name,
        avatar_url: r.avatar_url,
        role: r.role,
        permissions: toJson(r.permissions),
        is_active: toBool(r.is_active),
        is_super_admin: toBool(r.is_super_admin),
        // Opaque attribute only — see auth decision §2. No auth.* migration.
        auth_user_id: r.auth_user_id,
        login_count: toNumber(r.login_count),
        last_login_at: pgTimestampToIso(r.last_login_at),
        created_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(key, r.id),
    })
  }

  return events
}

/**
 * Admin activity log → `admin.activity-logged` on the admin's stream.
 * Idempotency `adminlog:<supabase_id>` (the original log row UUID).
 */
export function transformAdminActivityLog(
  rows: DumpRow[],
  emailByAdminId: Map<string, string>
): MigrationEvent[] {
  const events: MigrationEvent[] = []

  for (const r of rows) {
    const adminId = r.admin_user_id
    const email = adminId ? emailByAdminId.get(adminId) : undefined
    if (!email) {
      throw new Error(
        `admin_activity_log row ${r.id}: cannot resolve admin_user_id=${adminId} to an email`
      )
    }
    const key = `adminlog:${r.id}`
    events.push({
      event_type: 'admin.activity_logged',
      entity_id: adminStream(email),
      idempotency_key: key,
      payload: compact({
        action: r.action,
        resource_type: r.resource_type,
        resource_id: r.resource_id,
        old_data: toJson(r.old_data),
        new_data: toJson(r.new_data),
        ip_address: r.ip_address,
        user_agent: r.user_agent,
        occurred_at: pgTimestampToIso(r.created_at),
      }),
      metadata: migrationMetadata(key, r.id),
    })
  }

  return events
}

/** Build the admin_user_id → email resolver from the admin_users rows. */
export function buildAdminEmailResolver(adminRows: DumpRow[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const r of adminRows) {
    if (r.id && r.email) map.set(r.id, r.email)
  }
  return map
}

export const adminUsersMigrator: DomainMigrator = {
  table: 'admin_users',
  label: 'Admin users',
  transform: transformAdminUsers,
}
