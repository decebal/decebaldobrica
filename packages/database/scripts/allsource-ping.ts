#!/usr/bin/env bun
/**
 * AllSource connectivity smoke check.
 *
 * Constructs the shared AllSource client from env, hits the tenant's health
 * endpoint and runs a bounded event query, then prints a clear ✅ / ❌.
 *
 * Usage (env is loaded from apps/web/.env.local automatically by Bun when run
 * from that directory, or pass the vars through):
 *
 *   bun run packages/database/scripts/allsource-ping.ts
 *
 * Never prints the API key. If it must be referenced it is redacted to the
 * first 12 characters.
 */
import { AllSourceError } from '@allsource/client'
import { getAllSourceClient } from '../src/allsource'

function redact(secret: string | undefined): string {
  if (!secret) return '(unset)'
  return `${secret.slice(0, 12)}…`
}

async function main(): Promise<number> {
  const baseUrl = process.env.ALLSOURCE_API_URL
  const tenantId = process.env.ALLSOURCE_TENANT_ID

  console.log('AllSource connectivity smoke check')
  console.log(`  API URL : ${baseUrl ?? '(unset)'}`)
  console.log(`  Tenant  : ${tenantId ?? '(unset)'}`)
  console.log(`  API Key : ${redact(process.env.ALLSOURCE_API_KEY)}`)
  console.log('')

  let client: ReturnType<typeof getAllSourceClient>
  try {
    client = getAllSourceClient()
  } catch (error) {
    console.error('❌ Failed to construct client:', (error as Error).message)
    return 1
  }

  // 1) Health endpoint
  try {
    const health = await client.getHealth()
    console.log('✅ Health:', JSON.stringify(health))
  } catch (error) {
    if (error instanceof AllSourceError) {
      console.error(`❌ Health check failed: ${error.status}`, error.body)
    } else {
      console.error('❌ Health check failed:', error)
    }
    return 1
  }

  // 2) Authenticated query against the tenant (proves the API key works)
  try {
    const { events, count } = await client.queryEvents({ limit: 1 })
    console.log(`✅ Tenant query OK: count=${count}, returned=${events.length} event(s)`)
  } catch (error) {
    if (error instanceof AllSourceError) {
      if (error.isUnauthorized() || error.isForbidden()) {
        console.error(
          `❌ Tenant query rejected (${error.status}): API key/tenant invalid`,
          error.body
        )
      } else {
        console.error(`❌ Tenant query failed (${error.status}):`, error.body)
      }
    } else {
      console.error('❌ Tenant query failed:', error)
    }
    return 1
  }

  console.log('')
  console.log('✅ AllSource connectivity OK')
  return 0
}

main().then((code) => process.exit(code))
