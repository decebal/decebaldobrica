import { Resend } from 'resend'

export interface BookingConfirmationEmail {
  to: string
  meetingType: string
  contactName?: string
  meetingDate: Date
  durationMinutes: number
  notes?: string
  category?: string
  meetLink?: string
}

export interface BookingNotificationEmail {
  meetingType: string
  contactName?: string
  contactEmail: string
  meetingDate: Date
  durationMinutes: number
  notes?: string
  category?: string
}

export interface EmailSender {
  sendBookingConfirmation(args: BookingConfirmationEmail): Promise<boolean>
  sendBookingNotification?(args: BookingNotificationEmail): Promise<boolean>
}

export interface ResendEmailSenderConfig {
  apiKey: string | undefined
  from: string
  replyTo?: string
  /**
   * Apps supply their own templates since branding + copy is app-specific.
   * Booking package only provides the transport.
   */
  renderConfirmation: (args: BookingConfirmationEmail) => {
    subject: string
    html: string
    text: string
  }
  renderNotification?: (args: BookingNotificationEmail) => {
    subject: string
    html: string
    text: string
    to: string
  }
}

/**
 * Create an EmailSender backed by Resend. Renderers for subject/html/text are
 * injected so apps can preserve their existing templates without duplicating
 * them inside @decebal/booking.
 */
export function createResendEmailSender(config: ResendEmailSenderConfig): EmailSender {
  const client = config.apiKey ? new Resend(config.apiKey) : null

  if (!client) {
    console.warn('⚠️ Resend not configured. EmailSender will log instead of send.')
  }

  return {
    async sendBookingConfirmation(args) {
      if (!client) {
        console.log('⚠️ Email not sent: Resend not configured')
        return false
      }
      if (!args.to) {
        console.log('⚠️ Email not sent: No contact email provided')
        return false
      }

      const { subject, html, text } = config.renderConfirmation(args)

      try {
        const result = await client.emails.send({
          from: config.from,
          to: args.to,
          subject,
          html,
          text,
          replyTo: config.replyTo ?? config.from,
        })

        if (result.error) {
          console.error('Resend returned an error:', result.error)
          return false
        }
        return true
      } catch (error) {
        console.error('Error sending booking confirmation email:', error)
        return false
      }
    },

    async sendBookingNotification(args) {
      if (!client || !config.renderNotification) return false

      const { subject, html, text, to } = config.renderNotification(args)

      try {
        const result = await client.emails.send({
          from: config.from,
          to,
          subject,
          html,
          text,
          replyTo: config.replyTo ?? config.from,
        })
        if (result.error) {
          console.error('Resend returned an error:', result.error)
          return false
        }
        return true
      } catch (error) {
        console.error('Error sending booking notification email:', error)
        return false
      }
    },
  }
}
