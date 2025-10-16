import { subscribeToNewsletter } from '@decebal/newsletter'
import { sendNewsletterConfirmation } from '@decebal/email'
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

    // Send confirmation email if we have a token
    if (subscriptionResult.confirmationToken) {
      const emailResult = await sendNewsletterConfirmation(
        email,
        name || 'there',
        subscriptionResult.confirmationToken
      )

      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.error)
        // Don't fail the subscription if email fails, just log it
      } else {
        console.log(`Confirmation email sent to ${email}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm your subscription.',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
