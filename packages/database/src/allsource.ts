import { AllSourceClient } from '@allsource/client'

/**
 * Construct a configured AllSource client from environment variables.
 *
 * AllSource is the event-sourced store that replaces the dead Supabase
 * project. The tenant is scoped by the API key itself (sent as the
 * `X-API-Key` header), so `ALLSOURCE_TENANT_ID` is informational/diagnostic
 * only — it is not passed to the client constructor.
 *
 * Throws a clear error when any required variable is missing, mirroring the
 * `getSupabaseAdmin()` guard style in `./client.ts`.
 */
export function getAllSourceClient(): AllSourceClient {
  const baseUrl = process.env.ALLSOURCE_API_URL
  const apiKey = process.env.ALLSOURCE_API_KEY

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Missing AllSource environment variables (ALLSOURCE_API_URL, ALLSOURCE_API_KEY)'
    )
  }

  return new AllSourceClient({ baseUrl, apiKey })
}

/**
 * The configured tenant id for this deployment. Diagnostic only — AllSource
 * derives the real tenant from the API key. Throws when unset so wiring
 * problems surface early.
 */
export function getAllSourceTenantId(): string {
  const tenantId = process.env.ALLSOURCE_TENANT_ID
  if (!tenantId) {
    throw new Error('Missing AllSource environment variable (ALLSOURCE_TENANT_ID)')
  }
  return tenantId
}

export type { AllSourceClient } from '@allsource/client'
