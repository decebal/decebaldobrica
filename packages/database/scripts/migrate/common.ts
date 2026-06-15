/**
 * Shared transform helpers and the migration event shape.
 *
 * Each per-domain module turns dump rows into `MigrationEvent[]`. A
 * MigrationEvent is an `IngestEventInput` plus the deterministic
 * `idempotency_key` lifted out for the orchestrator's dedupe pass. The
 * orchestrator queries the target stream once, builds the set of
 * already-present idempotency keys, and skips any event whose key is present —
 * so re-runs never duplicate (see the orchestrator's dedupe comment).
 */
import type { IngestEventInput } from '@allsourcedev/client'
import type { DumpRow } from './dump'

export const MIGRATION_SOURCE = 'supabase-migration'
export const SCHEMA_VERSION = 1

/**
 * A value read out of a parsed dump row. Indexing a `DumpRow`
 * (`Record<string, string | null>`) under `noUncheckedIndexedAccess` widens to
 * include `undefined`, so the column-parse helpers accept it explicitly.
 */
export type DumpValue = string | null | undefined

export interface MigrationEvent extends IngestEventInput {
  /**
   * Deterministic idempotency key derived from the source row's natural
   * identity. Stored at `metadata.idempotency_key`. Lifted to the top level so
   * the orchestrator can dedupe without re-reading metadata.
   */
  idempotency_key: string
}

/**
 * Build the standard metadata envelope every migrated event carries.
 * `supabase_id` preserves the original UUID PK for traceability even though it
 * is not the addressing key.
 */
export function migrationMetadata(
  idempotencyKey: string,
  supabaseId: DumpValue
): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    source: MIGRATION_SOURCE,
    idempotency_key: idempotencyKey,
    schema_version: SCHEMA_VERSION,
  }
  if (supabaseId) meta.supabase_id = supabaseId
  return meta
}

/**
 * Convert a Postgres timestamp string (e.g. `2025-10-16 21:33:24.11904+00`) to
 * ISO-8601. Returns null for null/empty. Preserves the original instant — the
 * migration never stamps "now".
 */
export function pgTimestampToIso(value: DumpValue): string | null {
  if (!value) return null
  // Postgres dumps `YYYY-MM-DD HH:MM:SS[.ffffff]±HH[:MM]`. JS `Date` needs an
  // ISO string: space → `T`, fractional seconds clamped to milliseconds (JS
  // rejects microseconds), and a bare `±HH` offset expanded to `±HH:MM`.
  let s = value.replace(' ', 'T')
  s = s.replace(/(\.\d{3})\d+/, '$1') // trim sub-millisecond digits
  s = s.replace(/([+-]\d{2})$/, '$1:00') // `+00` → `+00:00`
  const date = new Date(s)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Unparseable timestamp: ${value}`)
  }
  return date.toISOString()
}

/** Parse a numeric column; null-safe. */
export function toNumber(value: DumpValue): number | null {
  if (value === null || value === '') return null
  const n = Number(value)
  if (Number.isNaN(n)) throw new Error(`Unparseable number: ${value}`)
  return n
}

/** Parse a Postgres boolean dump value (`t`/`f`); null-safe. */
export function toBool(value: DumpValue): boolean | null {
  if (value === null || value === undefined) return null
  return value === 't' || value === 'true'
}

/** Parse a JSON/JSONB column; null-safe. Returns the raw string on parse fail. */
export function toJson(value: DumpValue): unknown {
  if (value === null || value === undefined) return null
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

/** Drop null/undefined entries so payloads stay tight. */
export function compact(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v
  }
  return out
}

/** The contract every per-domain migrator implements. */
export interface DomainMigrator {
  /** Supabase table this migrator consumes. */
  table: string
  /** Human label for the report. */
  label: string
  /** Transform parsed rows into the events that would be written. */
  transform(rows: DumpRow[]): MigrationEvent[]
}
