import { render } from '@react-email/render'
import { Resend } from 'resend'
import { NewsletterConfirmationEmail } from './newsletter-confirmation'
import { NewsletterIssueEmail, type NewsletterIssueEmailProps } from './newsletter-issue'
import { NewsletterWelcomeEmail } from './newsletter-welcome'

let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resend = new Resend(apiKey)
  }
  return resend
}

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

    const { data, error } = await getResendClient().emails.send({
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

    const { data, error } = await getResendClient().emails.send({
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
 * Render the branded newsletter-issue email to HTML. Exposed so callers can
 * store the exact HTML that gets sent (e.g. on the AllSource issue event).
 */
export function renderNewsletterIssue(props: NewsletterIssueEmailProps): Promise<string> {
  return render(NewsletterIssueEmail(props))
}

/**
 * Send a blog post to a subscriber as a fully branded newsletter issue:
 * gradient header, real Markdown body (links/lists/code), a "Read the full
 * post" CTA, and a footer with unsubscribe. Replaces the old raw-HTML path.
 */
export async function sendNewsletterPost(
  email: string,
  subject: string,
  props: NewsletterIssueEmailProps
): Promise<SendEmailResult> {
  try {
    const html = await renderNewsletterIssue(props)
    const { data, error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM || 'Decebal Dobrica <newsletter@decebaldobrica.com>',
      to: email,
      subject,
      html,
    })

    if (error) {
      console.error('[Email] Failed to send newsletter post:', error)
      return { success: false, error: error.message || 'Failed to send newsletter post' }
    }
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Email] Unexpected error sending newsletter post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send newsletter issue to subscribers (raw pre-rendered HTML).
 * Prefer sendNewsletterPost() for blog posts — it applies the branded template.
 */
export async function sendNewsletterIssue(
  email: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  try {
    const { data, error } = await getResendClient().emails.send({
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
