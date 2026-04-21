import { buildCalendarClientFromEnv } from '@decebal/booking/server/calendar'
import type { BookingContext } from '@decebal/booking/server/context'
import type { EmailSender } from '@decebal/booking/server/email'
import { createResendEmailSender } from '@decebal/booking/server/email'
import { rateLimiter } from '@decebal/booking/server/rate-limit'
import { createTurnstileVerifier } from '@decebal/booking/server/turnstile'

let cached: BookingContext | null = null

function createWolventechEmailSender(): EmailSender {
  return createResendEmailSender({
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || 'discovery@wolventech.io',
    replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
    renderConfirmation: (args) => ({
      subject: `Wolven Tech: ${args.meetingType} confirmed`,
      html: `<h2>Meeting Confirmed</h2>
<p>Hi ${args.contactName || 'there'},</p>
<p>Your <strong>${args.meetingType}</strong> is scheduled for
${args.meetingDate.toISOString()} (${args.durationMinutes} min).</p>
${args.meetLink ? `<p>Join link: <a href="${args.meetLink}">${args.meetLink}</a></p>` : ''}
<p>— Wolven Tech</p>`,
      text: `Meeting Confirmed

Hi ${args.contactName || 'there'},

Your ${args.meetingType} is scheduled for ${args.meetingDate.toISOString()} (${args.durationMinutes} min).
${args.meetLink ? `Join: ${args.meetLink}` : ''}

— Wolven Tech`,
    }),
  })
}

export function buildBookingContextFromEnv(): BookingContext {
  if (cached) return cached

  cached = {
    calendar: buildCalendarClientFromEnv(),
    email: createWolventechEmailSender(),
    rateLimiter,
    turnstile: createTurnstileVerifier(process.env.TURNSTILE_SECRET_KEY),
    config: {
      ownerEmail: process.env.CALENDAR_OWNER_EMAIL || 'discovery@wolventech.io',
      fromAddress: process.env.EMAIL_FROM || 'discovery@wolventech.io',
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
      timeZone: 'Europe/London',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://wolventech.io',
    },
  }

  return cached
}
