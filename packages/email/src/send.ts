import { render } from '@react-email/render'
import { Resend } from 'resend'
import { NewsletterConfirmationEmail } from './newsletter-confirmation'
import { NewsletterWelcomeEmail } from './newsletter-welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailResult {
  success: boolean
  error?: string
  id?: string
}

/**
 * Send newsletter confirmation email with double opt-in link
 */
export async function sendNewsletterConfirmation(
  email: string,
  name: string,
  confirmToken: string
): Promise<SendEmailResult> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://decebaldobrica.com'
    const confirmUrl = `${appUrl}/newsletter/confirm?token=${confirmToken}`

    const html = await render(NewsletterConfirmationEmail({ name, confirmUrl }))

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Decebal Dobrica <newsletter@decebaldobrica.com>',
      to: email,
      subject: 'Confirm your newsletter subscription',
      html,
    })

    if (error) {
      console.error('[Email] Failed to send confirmation email:', error)
      return {
        success: false,
        error: error.message || 'Failed to send confirmation email',
      }
    }

    return {
      success: true,
      id: data?.id,
    }
  } catch (error) {
    console.error('[Email] Unexpected error sending confirmation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send welcome email after successful confirmation
 */
export async function sendNewsletterWelcome(
  email: string,
  name: string,
  tier: 'free' | 'premium' | 'founding' = 'free'
): Promise<SendEmailResult> {
  try {
    const html = await render(NewsletterWelcomeEmail({ name, tier }))

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Decebal Dobrica <newsletter@decebaldobrica.com>',
      to: email,
      subject: 'Welcome to my newsletter! 🎉',
      html,
    })

    if (error) {
      console.error('[Email] Failed to send welcome email:', error)
      return {
        success: false,
        error: error.message || 'Failed to send welcome email',
      }
    }

    return {
      success: true,
      id: data?.id,
    }
  } catch (error) {
    console.error('[Email] Unexpected error sending welcome:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send newsletter issue to subscribers
 * This will be used in Phase 5 for publishing blog posts
 */
export async function sendNewsletterIssue(
  email: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Decebal Dobrica <newsletter@decebaldobrica.com>',
      to: email,
      subject,
      html,
    })

    if (error) {
      console.error('[Email] Failed to send newsletter issue:', error)
      return {
        success: false,
        error: error.message || 'Failed to send newsletter issue',
      }
    }

    return {
      success: true,
      id: data?.id,
    }
  } catch (error) {
    console.error('[Email] Unexpected error sending newsletter:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
