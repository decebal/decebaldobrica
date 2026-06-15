import { getAllSourceClient } from '@decebal/database'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const interestSchema = z.object({
  email: z.string().email('Invalid email address'),
  planId: z.enum(['premium', 'founding']),
  planName: z.string(),
})

/**
 * Register interest in a paid plan tier.
 *
 * AllSource event model §4.9: stream `plan-interest:<email>:<plan_id>` (hyphens
 * are legal in entity_id), event type `plan_interest.registered` (underscores
 * only — hyphenated event_types are rejected with 422). Registration is unique
 * per stream, so a non-empty stream means interest already exists.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, planId, planName } = interestSchema.parse(body)

    const client = getAllSourceClient()
    const stream = `plan-interest:${email}:${planId}`

    // Already registered? The stream carries a `plan_interest.registered` event.
    const existing = await client.queryEvents({ entity_id: stream, limit: 1 })
    const existingCount = Array.isArray(existing)
      ? existing.length
      : (existing?.events?.length ?? 0)
    if (existingCount > 0) {
      return NextResponse.json(
        { error: 'Interest already registered for this plan' },
        { status: 400 }
      )
    }

    await client.ingestEvent({
      event_type: 'plan_interest.registered',
      entity_id: stream,
      payload: {
        email,
        plan_id: planId,
        plan_name: planName,
        created_at: new Date().toISOString(),
      },
      metadata: { source: 'app', schema_version: 1 },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Validation error' },
        { status: 400 }
      )
    }

    console.error('[Interest] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
