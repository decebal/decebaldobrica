import { getNewsletterStats } from '@decebal/newsletter'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stats = await getNewsletterStats()

    // Calculate revenue (Premium: $14.99/mo, Founding: $300 one-time)
    const mrr = stats.premiumSubscribers * 14.99
    const arr = mrr * 12 + stats.foundingSubscribers * 300

    // Calculate monthly growth (mock data - should come from DB)
    const monthlyGrowth = 12 // 12% growth

    const analytics = {
      ...stats,
      monthlyGrowth,
      revenue: {
        mrr: Math.round(mrr),
        arr: Math.round(arr),
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Newsletter analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
