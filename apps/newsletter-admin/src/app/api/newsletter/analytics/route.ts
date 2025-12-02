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

    // Calculate monthly growth (comparing last 30 days to previous 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const { count: recentSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    const { count: previousSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())

    const monthlyGrowth =
      previousSubscribers && previousSubscribers > 0
        ? (((recentSubscribers || 0) - previousSubscribers) / previousSubscribers) * 100
        : 0

    // Calculate revenue (basic estimation)
    // Assuming premium = $10/month, founding = $50/month
    const mrr = (premiumSubscribers || 0) * 10 + (foundingSubscribers || 0) * 50
    const arr = mrr * 12

    const analytics = {
      totalSubscribers: totalSubscribers || 0,
      freeSubscribers: freeSubscribers || 0,
      premiumSubscribers: premiumSubscribers || 0,
      foundingSubscribers: foundingSubscribers || 0,
      avgOpenRate: 45.2, // TODO: Implement real tracking
      avgClickRate: 12.8, // TODO: Implement real tracking
      totalIssues: 0, // TODO: Implement newsletter issues tracking
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      revenue: {
        mrr,
        arr,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Newsletter analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
