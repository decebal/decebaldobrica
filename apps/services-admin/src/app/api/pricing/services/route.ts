import { getSupabaseAdmin } from '@decebal/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .eq('config_type', 'service_tier')
      .order('price_usd', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Failed to fetch service tiers:', error)
    return NextResponse.json({ error: 'Failed to fetch service tiers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('payment_config')
      .insert({
        config_type: 'service_tier',
        ...body,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create service tier:', error)
    return NextResponse.json({ error: 'Failed to create service tier' }, { status: 500 })
  }
}
