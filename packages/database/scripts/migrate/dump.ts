/**
 * Supabase cluster-dump parser.
 *
 * The dump is a gzipped `pg_dumpall` plaintext file. Table data lives in
 * `COPY public.<table> (col1, col2, ...) FROM stdin;` blocks that end at a line
 * containing only `\.`. Columns are tab-separated; `\N` is SQL NULL; standard
 * pg COPY backslash escapes apply (`\t`, `\n`, `\r`, `\\`).
 *
 * This module never mutates the dump: it reads it via `gunzip -c` into memory
 * (the dump is tiny — tens of KB) and parses the COPY blocks into row objects
 * keyed by the COPY header column names (authoritative column order).
 */
import { spawnSync } from 'node:child_process'

export type DumpRow = Record<string, string | null>

export interface ParsedTable {
  table: string
  columns: string[]
  rows: DumpRow[]
}

/** Decode pg COPY field escapes. `\N` is handled by the caller (NULL). */
function decodeField(raw: string): string {
  let out = ''
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (ch === '\\' && i + 1 < raw.length) {
      const next = raw[i + 1]
      i++
      switch (next) {
        case 't':
          out += '\t'
          break
        case 'n':
          out += '\n'
          break
        case 'r':
          out += '\r'
          break
        case '\\':
          out += '\\'
          break
        default:
          out += next
      }
    } else {
      out += ch
    }
  }
  return out
}

/**
 * Read the gzipped dump into a single string via `gunzip -c`. Does not write
 * any decompressed copy to disk and does not touch the source file.
 */
export function readDump(dumpPath: string): string {
  const result = spawnSync('gunzip', ['-c', dumpPath], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
  if (result.status !== 0) {
    throw new Error(
      `Failed to read dump at ${dumpPath}: ${result.stderr || `exit ${result.status}`}`
    )
  }
  return result.stdout
}

/**
 * Parse one `COPY public.<table>` block out of the dump text. Returns the
 * column list (from the COPY header) and the row objects. Returns `rows: []`
 * for an empty table. Throws if the table's COPY block is not found.
 */
export function parseTable(dumpText: string, table: string): ParsedTable {
  const lines = dumpText.split('\n')
  const headerPrefix = `COPY public.${table} (`
  const startIdx = lines.findIndex((l) => l.startsWith(headerPrefix))
  if (startIdx === -1) {
    throw new Error(`COPY block for public.${table} not found in dump`)
  }

  const header = lines[startIdx] as string
  const colsRaw = header.slice(header.indexOf('(') + 1, header.indexOf(')'))
  const columns = colsRaw.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))

  const rows: DumpRow[] = []
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i] as string
    if (line === '\\.') break
    // pg COPY does not emit blank data lines; guard against a stray trailing one.
    if (line === '') continue
    const fields = line.split('\t')
    const row: DumpRow = {}
    columns.forEach((col, idx) => {
      const value = fields[idx]
      row[col] = value === undefined || value === '\\N' ? null : decodeField(value)
    })
    rows.push(row)
  }

  return { table, columns, rows }
}

/** Every `public.*` table the migration is responsible for (13 total). */
export const PUBLIC_TABLES = [
  'admin_users',
  'admin_activity_log',
  'meeting_bookings',
  'newsletter_subscribers',
  'newsletter_issues',
  'newsletter_events',
  'newsletter_subscriptions',
  'payment_config',
  'payments',
  'plan_interest',
  'service_access',
  'social_posts',
  'user_profiles',
] as const

export type PublicTable = (typeof PUBLIC_TABLES)[number]
