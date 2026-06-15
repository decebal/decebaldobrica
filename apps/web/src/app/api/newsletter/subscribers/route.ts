import { listSubscribers } from '@decebal/newsletter'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Admin subscriber list. Reads the AllSource `subscriber:*` projection
 * (folded per stream) with optional tier/status filters, newest first.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier') as 'free' | 'premium' | 'founding' | 'all' | null
    const status = searchParams.get('status') as
      | 'pending'
      | 'active'
      | 'unsubscribed'
      | 'bounced'
      | 'all'
      | null

    const subscribers = await listSubscribers({
      tier: tier ?? undefined,
      status: status ?? undefined,
    })

    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Newsletter subscribers error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
