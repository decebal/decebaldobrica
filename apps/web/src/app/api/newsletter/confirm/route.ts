import { sendNewsletterWelcome } from '@decebal/email'
import { confirmSubscription } from '@decebal/newsletter'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing confirmation token' }, { status: 400 })
    }

    // Confirm the subscription
    const result = await confirmSubscription(token)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Send welcome email
    if (result.subscriber) {
      const welcomeResult = await sendNewsletterWelcome(
        result.subscriber.email,
        result.subscriber.name || 'there',
        result.subscriber.tier
      )

      if (!welcomeResult.success) {
        console.error('Failed to send welcome email:', welcomeResult.error)
        // Don't fail confirmation if welcome email fails
      } else {
        console.log(`Welcome email sent to ${result.subscriber.email}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed! Welcome to the newsletter.',
      subscriber: result.subscriber,
    })
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
