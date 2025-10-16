import { getSupabaseAdmin } from '@decebal/database'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier')
    const status = searchParams.get('status')

    const supabase = getSupabaseAdmin()

    let query = supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (tier && tier !== 'all') {
      query = query.eq('tier', tier)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching subscribers:', error)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    return NextResponse.json({ subscribers: data || [] })
  } catch (error) {
    console.error('Newsletter subscribers error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
