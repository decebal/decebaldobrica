import { sendNewsletterIssue } from '@decebal/email'
import { getActiveSubscribers } from '@decebal/newsletter'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const sendSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  tier: z.enum(['all', 'free', 'premium', 'founding']).default('all'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = sendSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const { subject, content, tier } = result.data

    // Get subscribers
    const subscribers = await getActiveSubscribers(tier === 'all' ? undefined : tier)

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers found for this tier' }, { status: 400 })
    }

    // Send to all subscribers
    let sent = 0
    let failed = 0

    for (const subscriber of subscribers) {
      try {
        const emailResult = await sendNewsletterIssue(subscriber.email, subject, content)

        if (emailResult.success) {
          sent++
        } else {
          failed++
        }
      } catch (error) {
        failed++
        console.error(`Failed to send to ${subscriber.email}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
    })
  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
