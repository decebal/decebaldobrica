import { getSupabaseAdmin } from '@decebal/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .eq('config_type', 'deposit_type')
      .order('price_usd', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Failed to fetch deposit types:', error)
    return NextResponse.json({ error: 'Failed to fetch deposit types' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('payment_config')
      .insert({
        config_type: 'deposit_type',
        ...body,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create deposit type:', error)
    return NextResponse.json({ error: 'Failed to create deposit type' }, { status: 500 })
  }
}
