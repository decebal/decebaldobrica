import { subscribeToNewsletter } from '@decebal/newsletter'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, name, utm_source, utm_medium, utm_campaign } = result.data

    // Subscribe user via Supabase
    const subscriptionResult = await subscribeToNewsletter({
      email,
      name,
      utm_source,
      utm_medium,
      utm_campaign,
    })

    if (!subscriptionResult.success) {
      return NextResponse.json(
        { error: subscriptionResult.error || 'Failed to subscribe' },
        { status: 400 }
      )
    }

    // TODO: Send confirmation email via Resend
    console.log(`Subscriber created with ID: ${subscriptionResult.subscriberId}`)
    console.log(`Would send confirmation email to: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Subscription successful! Check your email to confirm.',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
