import { sendMeetingConfirmation } from '@/lib/emailService'
import { config as personalConfig } from '@/lib/personalConfig'
import { buildCalendarClientFromEnv } from '@decebal/booking/server/calendar'
import type { BookingContext } from '@decebal/booking/server/context'
import type { EmailSender } from '@decebal/booking/server/email'
import { rateLimiter } from '@decebal/booking/server/rate-limit'
import { createTurnstileVerifier } from '@decebal/booking/server/turnstile'

let cached: BookingContext | null = null

function createAppEmailSender(): EmailSender {
  return {
    async sendBookingConfirmation(args) {
      // Bridge to apps/web's existing branded template via emailService.
      const meeting = {
        id: `booking-${Date.now()}`,
        type: args.meetingType,
        date: args.meetingDate,
        duration: args.durationMinutes,
        contactName: args.contactName,
        contactEmail: args.to,
        notes: args.notes,
        category: args.category,
      }
      return sendMeetingConfirmation(meeting, args.meetLink)
    },
  }
}

export function buildBookingContextFromEnv(): BookingContext {
  if (cached) return cached

  cached = {
    calendar: buildCalendarClientFromEnv(),
    email: createAppEmailSender(),
    rateLimiter,
    turnstile: createTurnstileVerifier(process.env.TURNSTILE_SECRET_KEY),
    config: {
      ownerEmail: process.env.CALENDAR_OWNER_EMAIL || 'discovery@decebaldobrica.com',
      fromAddress: process.env.EMAIL_FROM || 'noreply@decebaldobrica.com',
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
      timeZone: personalConfig.contact?.timezone || 'America/New_York',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://decebaldobrica.com',
    },
  }

  return cached
}
