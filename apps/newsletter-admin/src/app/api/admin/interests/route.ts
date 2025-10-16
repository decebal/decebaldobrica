import { getSupabaseAdmin } from '@decebal/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data: interests, error } = await supabase
      .from('plan_interest')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Admin] Failed to fetch interests:', error)
      return NextResponse.json({ error: 'Failed to fetch interests' }, { status: 500 })
    }

    return NextResponse.json({ interests })
  } catch (error) {
    console.error('[Admin] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
