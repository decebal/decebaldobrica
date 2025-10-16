import { getSupabaseAdmin } from '@decebal/database'
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = upgradeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
    }

    const { email, tier, paymentId, chain, amount, subscriberId } = result.data
    const supabase = getSupabaseAdmin()

    // If we have subscriberId, use it; otherwise find by email
    let subscriber: Record<string, unknown> | null = null
    if (subscriberId) {
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('id', subscriberId)
        .single()
      subscriber = data
    } else if (email) {
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single()
      subscriber = data
    }

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    // Update subscriber tier
    const expiresAt =
      tier === 'founding'
        ? null // Lifetime access
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days for premium

    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        tier,
        subscription_expires_at: expiresAt?.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Error upgrading subscriber:', updateError)
      return NextResponse.json({ error: 'Failed to upgrade subscription' }, { status: 500 })
    }

    // Record payment in subscriptions table
    const { error: paymentError } = await supabase.from('newsletter_subscriptions').insert({
      subscriber_id: subscriber.id,
      provider: 'crypto',
      provider_subscription_id: paymentId,
      tier,
      status: 'active',
      amount,
      currency: chain.toUpperCase(),
      interval: tier === 'founding' ? 'lifetime' : 'month',
      current_period_start: new Date().toISOString(),
      current_period_end: expiresAt?.toISOString() || null,
      cancel_at_period_end: false,
    })

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
      // Don't fail the upgrade, just log the error
    }

    // TODO: Send upgrade confirmation email

    return NextResponse.json({
      success: true,
      message: 'Subscription upgraded successfully',
      tier,
      expiresAt: expiresAt?.toISOString() || 'lifetime',
    })
  } catch (error) {
    console.error('Newsletter upgrade error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
