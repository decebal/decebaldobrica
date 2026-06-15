#!/usr/bin/env bun
/**
 * Supabase → AllSource migration orchestrator.
 *
 * Transforms every row in the Supabase cluster dump into the AllSource event
 * streams defined by docs/ALLSOURCE_EVENT_MODEL.md and loads them through the
 * shared AllSource TS SDK client (packages/database/src/allsource.ts).
 *
 * Safety / idempotency:
 *   - DEFAULT mode is dry-run. Writing requires the explicit `--commit` flag.
 *   - Every event carries a deterministic `metadata.idempotency_key` derived
 *     from the source row's natural identity (email, reference, wallet, uuid).
 *     Before writing a stream, the orchestrator `queryEvents({ entity_id })`,
 *     collects the idempotency keys already present, and skips any event whose
 *     key exists. So a re-run never duplicates and completes any streams a
 *     previous partial run left unfinished.
 *   - The dump is read read-only via `gunzip -c`; it is never decompressed to
 *     disk or mutated.
 *   - FK ordering: subscribers before newsletter events/subscriptions; admin
 *     users before activity log; profiles/payments before access. Resolvers
 *     (subscriber_id→email, admin_user_id→email) are built from the parent rows
 *     first.
 *
 * The API key is never printed. Run from apps/web so Bun loads .env.local:
 *
 *   cd apps/web && bun ../../packages/database/scripts/migrate-supabase-to-allsource.ts            # dry-run
 *   cd apps/web && bun ../../packages/database/scripts/migrate-supabase-to-allsource.ts --commit   # write
 */
import { AllSourceError } from '@allsourcedev/client'
import { getAllSourceClient } from '../src/allsource'
import {
  buildAdminEmailResolver,
  transformAdminActivityLog,
  transformAdminUsers,
} from './migrate/admin'
import type { MigrationEvent } from './migrate/common'
import { type DumpRow, PUBLIC_TABLES, type ParsedTable, parseTable, readDump } from './migrate/dump'
import {
  buildEmailResolver,
  transformIssues,
  transformNewsletterEvents,
  transformSubscribers,
  transformSubscriptions,
} from './migrate/newsletter'
import {
  transformMeetings,
  transformPaymentConfig,
  transformPayments,
  transformServiceAccess,
  transformSocialPosts,
  transformUserProfiles,
} from './migrate/payments'
import { transformPlanInterest } from './migrate/plan-interest'

const DEFAULT_DUMP = '/Users/decebaldobrica/Downloads/db_cluster-04-11-2025@22-40-01.backup.gz'
const BATCH_SIZE = 100

interface DomainResult {
  label: string
  table: string
  sourceRows: number
  events: MigrationEvent[]
}

/** Group transformed events by their target stream (entity_id). */
function groupByStream(events: MigrationEvent[]): Map<string, MigrationEvent[]> {
  const map = new Map<string, MigrationEvent[]>()
  for (const e of events) {
    const list = map.get(e.entity_id)
    if (list) list.push(e)
    else map.set(e.entity_id, [e])
  }
  return map
}

async function main(): Promise<number> {
  const args = process.argv.slice(2)
  const commit = args.includes('--commit')
  const dumpArg = args.find((a) => a.startsWith('--dump='))
  const dumpPath = dumpArg ? dumpArg.slice('--dump='.length) : DEFAULT_DUMP
  const mode = commit ? 'COMMIT (WRITES ENABLED)' : 'DRY-RUN (no writes)'

  console.log('Supabase → AllSource migration')
  console.log(`  Mode : ${mode}`)
  console.log(`  Dump : ${dumpPath}`)
  console.log('')

  // 1) Read + parse the dump (read-only).
  let dumpText: string
  try {
    dumpText = readDump(dumpPath)
  } catch (error) {
    console.error('❌ Failed to read dump:', (error as Error).message)
    return 1
  }

  const parsed = new Map<string, ParsedTable>()
  for (const table of PUBLIC_TABLES) {
    parsed.set(table, parseTable(dumpText, table))
  }

  // 2) Pre-migration inventory (baseline truth).
  console.log('Pre-migration inventory (dump row counts):')
  for (const table of PUBLIC_TABLES) {
    const t = parsed.get(table) as ParsedTable
    const note = t.rows.length === 0 ? ' (empty)' : ''
    console.log(`  ${table.padEnd(26)} ${String(t.rows.length).padStart(4)}${note}`)
  }
  console.log('')

  const rowsOf = (table: string): DumpRow[] => (parsed.get(table) as ParsedTable).rows

  // 3) Transform — FK-respecting order. Resolvers built from parent rows first.
  const subscriberRows = rowsOf('newsletter_subscribers')
  const emailBySubscriberId = buildEmailResolver(subscriberRows)
  const adminRows = rowsOf('admin_users')
  const emailByAdminId = buildAdminEmailResolver(adminRows)

  const results: DomainResult[] = [
    // Parents first.
    {
      label: 'Admin users',
      table: 'admin_users',
      sourceRows: adminRows.length,
      events: transformAdminUsers(adminRows),
    },
    {
      label: 'Admin activity log',
      table: 'admin_activity_log',
      sourceRows: rowsOf('admin_activity_log').length,
      events: transformAdminActivityLog(rowsOf('admin_activity_log'), emailByAdminId),
    },
    {
      label: 'Newsletter subscribers',
      table: 'newsletter_subscribers',
      sourceRows: subscriberRows.length,
      events: transformSubscribers(subscriberRows),
    },
    {
      label: 'Newsletter issues',
      table: 'newsletter_issues',
      sourceRows: rowsOf('newsletter_issues').length,
      events: transformIssues(rowsOf('newsletter_issues')),
    },
    {
      label: 'Newsletter events',
      table: 'newsletter_events',
      sourceRows: rowsOf('newsletter_events').length,
      events: transformNewsletterEvents(rowsOf('newsletter_events'), emailBySubscriberId),
    },
    {
      label: 'Newsletter subscriptions',
      table: 'newsletter_subscriptions',
      sourceRows: rowsOf('newsletter_subscriptions').length,
      events: transformSubscriptions(rowsOf('newsletter_subscriptions'), emailBySubscriberId),
    },
    {
      label: 'User profiles',
      table: 'user_profiles',
      sourceRows: rowsOf('user_profiles').length,
      events: transformUserProfiles(rowsOf('user_profiles')),
    },
    {
      label: 'Payments',
      table: 'payments',
      sourceRows: rowsOf('payments').length,
      events: transformPayments(rowsOf('payments')),
    },
    {
      label: 'Service access',
      table: 'service_access',
      sourceRows: rowsOf('service_access').length,
      events: transformServiceAccess(rowsOf('service_access')),
    },
    {
      label: 'Meeting bookings',
      table: 'meeting_bookings',
      sourceRows: rowsOf('meeting_bookings').length,
      events: transformMeetings(rowsOf('meeting_bookings')),
    },
    {
      label: 'Plan interest',
      table: 'plan_interest',
      sourceRows: rowsOf('plan_interest').length,
      events: transformPlanInterest(rowsOf('plan_interest')),
    },
    {
      label: 'Social posts',
      table: 'social_posts',
      sourceRows: rowsOf('social_posts').length,
      events: transformSocialPosts(rowsOf('social_posts')),
    },
    {
      label: 'Payment config (audit-only)',
      table: 'payment_config',
      sourceRows: rowsOf('payment_config').length,
      events: transformPaymentConfig(rowsOf('payment_config')),
    },
  ]

  // 4) Transform report.
  console.log('Transform (rows → events that WOULD be written):')
  let totalEvents = 0
  for (const r of results) {
    totalEvents += r.events.length
    const byType = new Map<string, number>()
    for (const e of r.events) byType.set(e.event_type, (byType.get(e.event_type) ?? 0) + 1)
    const breakdown =
      byType.size === 0 ? '—' : [...byType.entries()].map(([t, c]) => `${t}×${c}`).join(', ')
    console.log(
      `  ${r.table.padEnd(26)} ${String(r.sourceRows).padStart(3)} row(s) → ${String(r.events.length).padStart(3)} event(s)  [${breakdown}]`
    )
    // Example stream id + idempotency key for the first event.
    const first = r.events[0]
    if (first) {
      console.log(`      e.g. stream=${first.entity_id}  idem=${first.idempotency_key}`)
    }
  }
  console.log('')
  console.log(`Total events that would be written: ${totalEvents}`)
  console.log('')

  if (!commit) {
    console.log('✅ DRY-RUN complete. No data written. Re-run with --commit to write.')
    return 0
  }

  // 5) COMMIT path — idempotent, batched, partial-failure aware.
  const client = getAllSourceClient()
  const allEvents = results.flatMap((r) => r.events)
  const byStream = groupByStream(allEvents)

  let written = 0
  let skipped = 0
  const failedStreams: { stream: string; remaining: number; error: string }[] = []

  for (const [stream, events] of byStream) {
    // Dedupe: read the stream once, collect present idempotency keys.
    let presentKeys: Set<string>
    try {
      const existing = await client.queryEvents({ entity_id: stream, limit: 1000 })
      presentKeys = new Set(
        existing.events
          .map((e) => e.metadata?.idempotency_key)
          .filter((k): k is string => typeof k === 'string')
      )
    } catch (error) {
      const msg = error instanceof AllSourceError ? `${error.status}` : String(error)
      failedStreams.push({ stream, remaining: events.length, error: `query failed: ${msg}` })
      continue
    }

    const toWrite = events.filter((e) => !presentKeys.has(e.idempotency_key))
    skipped += events.length - toWrite.length
    if (toWrite.length === 0) continue

    // Batch writes; on failure record what remains so a re-run completes it.
    for (let i = 0; i < toWrite.length; i += BATCH_SIZE) {
      const batch = toWrite.slice(i, i + BATCH_SIZE)
      try {
        const ack = await client.ingestBatch(batch.map(({ idempotency_key: _k, ...e }) => e))
        written += ack.count
      } catch (error) {
        const msg = error instanceof AllSourceError ? `${error.status}` : String(error)
        failedStreams.push({
          stream,
          remaining: toWrite.length - i,
          error: `ingest failed: ${msg}`,
        })
        break
      }
    }
  }

  console.log('Commit results:')
  console.log(`  events written : ${written}`)
  console.log(`  events skipped (already present): ${skipped}`)
  console.log(`  streams failed : ${failedStreams.length}`)
  for (const f of failedStreams) {
    console.log(`    ${f.stream}: ${f.remaining} remaining — ${f.error}`)
  }
  console.log('')

  if (failedStreams.length > 0) {
    console.log('⚠️  Partial failure. Re-run (idempotent) to complete remaining streams.')
    return 1
  }

  console.log('✅ COMMIT complete.')
  return 0
}

main().then((code) => process.exit(code))
