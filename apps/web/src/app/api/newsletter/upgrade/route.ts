import { getAllSourceClient } from '@decebal/database'
import { getSubscriberByEmail } from '@decebal/newsletter'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const upgradeSchema = z.object({
  email: z.string().email().optional(),
  tier: z.enum(['premium', 'founding']),
  paymentId: z.string(),
  chain: z.string(),
  amount: z.number(),
  subscriberId: z.string().optional(),
})

/**
 * Upgrade a newsletter subscriber to a paid tier after crypto payment.
 *
 * AllSource event model §4.1/§4.4: appends `subscriber.tier_changed` (sets the
 * new tier + expiry/billing fields) and `subscriber.subscription_started` (the
 * billing record) to the subscriber's stream. The subscriber is addressed by
 * email — `subscriberId`, when present, is the `subscriber:<email>` stream id,
 * so we derive the email from it.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = upgradeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message ?? 'Validation error' },
        { status: 400 }
      )
    }

    const { email, tier, paymentId, chain, amount, subscriberId } = result.data

    // Resolve the subscriber's email (the stream key).
    let subscriberEmail = email
    if (!subscriberEmail && subscriberId?.startsWith('subscriber:')) {
      subscriberEmail = subscriberId.slice('subscriber:'.length)
    }

    if (!subscriberEmail) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    const subscriber = await getSubscriberByEmail(subscriberEmail)
    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    const client = getAllSourceClient()
    const stream = `subscriber:${subscriberEmail}`
    const now = new Date().toISOString()
    const expiresAt =
      tier === 'founding'
        ? null // Lifetime access
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

    await client.ingestEvent({
      event_type: 'subscriber.tier_changed',
      entity_id: stream,
      payload: {
        from_tier: subscriber.tier,
        to_tier: tier,
        subscription_expires_at: expiresAt,
      },
      metadata: { source: 'app', schema_version: 1 },
    })

    // Billing record (subscription_started) — best-effort, never fails the upgrade.
    try {
      await client.ingestEvent({
        event_type: 'subscriber.subscription_started',
        entity_id: stream,
        payload: {
          subscription_uuid: crypto.randomUUID(),
          provider: 'solana',
          provider_subscription_id: paymentId,
          tier,
          amount,
          currency: chain.toUpperCase(),
          interval: tier === 'founding' ? 'lifetime' : 'month',
          current_period_start: now,
          current_period_end: expiresAt,
        },
        metadata: { source: 'app', schema_version: 1 },
      })
    } catch (subError) {
      console.error('Error recording subscription billing event:', subError)
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription upgraded successfully',
      tier,
      expiresAt: expiresAt ?? 'lifetime',
    })
  } catch (error) {
    console.error('Newsletter upgrade error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
