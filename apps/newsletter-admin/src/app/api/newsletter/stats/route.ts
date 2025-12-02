import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total subscribers count
    const { count: totalSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get free subscribers
    const { count: freeSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('tier', 'free')

    // Get premium subscribers
    const { count: premiumSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('tier', 'premium')

    // Get founding subscribers
    const { count: foundingSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('tier', 'founding')

    const stats = {
      totalSubscribers: totalSubscribers || 0,
      freeSubscribers: freeSubscribers || 0,
      premiumSubscribers: premiumSubscribers || 0,
      foundingSubscribers: foundingSubscribers || 0,
      totalIssues: 0, // TODO: Implement newsletter issues tracking
      avgOpenRate: 0, // TODO: Implement open rate tracking
      avgClickRate: 0, // TODO: Implement click rate tracking
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Newsletter stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
