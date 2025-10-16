import { getSupabaseAdmin } from '@decebal/database'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const interestSchema = z.object({
  email: z.string().email('Invalid email address'),
  planId: z.enum(['premium', 'founding']),
  planName: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, planId, planName } = interestSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Check if interest already exists
    const { data: existing } = await supabase
      .from('plan_interest')
      .select('id')
      .eq('email', email)
      .eq('plan_id', planId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Interest already registered for this plan' },
        { status: 400 }
      )
    }

    // Insert new interest
    const { error: insertError } = await supabase.from('plan_interest').insert({
      email,
      plan_id: planId,
      plan_name: planName,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error('[Interest] Failed to save interest:', insertError)
      return NextResponse.json({ error: 'Failed to register interest' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error('[Interest] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
