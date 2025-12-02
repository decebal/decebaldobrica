import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get counts for different pricing types
    const { count: meetingTypes } = await supabase
      .from('meeting_types')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: serviceTiers } = await supabase
      .from('service_pricing')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: newsletterTiers } = await supabase
      .from('newsletter_pricing')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: depositTypes } = await supabase
      .from('service_deposits')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const totalConfigs =
      (meetingTypes || 0) + (serviceTiers || 0) + (newsletterTiers || 0) + (depositTypes || 0)

    const stats = {
      totalConfigs,
      meetingTypes: meetingTypes || 0,
      serviceTiers: serviceTiers || 0,
      newsletterTiers: newsletterTiers || 0,
      depositTypes: depositTypes || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Pricing stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch pricing stats' }, { status: 500 })
  }
}
