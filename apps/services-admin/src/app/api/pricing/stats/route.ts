import { getSupabaseAdmin } from '@decebal/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Get counts for each config type
    const { data: configs } = await supabase
      .from('payment_config')
      .select('config_type')

    const stats = {
      totalConfigs: configs?.length || 0,
      meetingTypes: configs?.filter((c) => c.config_type === 'meeting_type').length || 0,
      serviceTiers: configs?.filter((c) => c.config_type === 'service_tier').length || 0,
      newsletterTiers: configs?.filter((c) => c.config_type === 'newsletter_tier').length || 0,
      depositTypes: configs?.filter((c) => c.config_type === 'deposit_type').length || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch pricing stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing stats' },
      { status: 500 }
    )
  }
}
