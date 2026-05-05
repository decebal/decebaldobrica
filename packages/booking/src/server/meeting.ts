import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { MEETING_TYPES } from '../config'
import type { BookingContext } from './context'
import { validateBookingData } from './email-validation'
import { RATE_LIMITS, getClientIP } from './rate-limit'

export const bookMeetingSchema = z.object({
  meetingType: z.string(),
  date: z.string(),
  time: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  notes: z.string().optional(),
  category: z.string().optional(),
  timezone: z.string().default('America/New_York'),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
  paymentId: z.string().optional(),
  paymentMethod: z.enum(['SOL', 'BTC', 'ETH', 'USDC']).optional(),
  turnstileToken: z.string().optional(),
  formStartTime: z.number().optional(),
  honeypot: z.string().optional(),
})

export const cancelMeetingSchema = z.object({
  eventId: z.string(),
  reason: z.string().optional(),
})

export type BookMeetingInput = z.infer<typeof bookMeetingSchema>
export type CancelMeetingInput = z.infer<typeof cancelMeetingSchema>

/**
 * Build the four booking server-action implementations backed by a BookingContext.
 * Each consuming app exports these from its own `'use server'` file after wiring
 * env-bound services into the context.
 */
export function createMeetingActions(ctx: BookingContext) {
  async function bookMeeting(input: BookMeetingInput) {
    try {
      const {
        meetingType,
        date,
        time,
        name,
        email,
        notes,
        category,
        timezone,
        paymentId,
        paymentMethod,
        turnstileToken,
        formStartTime,
        honeypot,
      } = bookMeetingSchema.parse(input)

      const headersList = await nextHeaders()
      const clientIP = getClientIP(headersList)

      // 1. Honeypot
      if (honeypot && honeypot.trim() !== '') {
        console.log(`🛡️ Bot detected via honeypot from IP: ${clientIP}`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return { success: false, error: 'Unable to process request at this time' }
      }

      // 2. Form timing
      if (formStartTime) {
        const timeTaken = Date.now() - formStartTime
        if (timeTaken < 5000) {
          console.log(`🛡️ Bot detected - form filled too fast (${timeTaken}ms) from IP: ${clientIP}`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return { success: false, error: 'Please take your time filling out the form' }
        }
      }

      // 3. Data validation
      const validation = validateBookingData({ name, email, notes })
      if (!validation.isValid) {
        console.log(`🛡️ Suspicious data detected from IP: ${clientIP} - ${validation.reason}`)
        return { success: false, error: validation.reason || 'Invalid booking data' }
      }

      // 4. IP rate limit
      const ipRateLimit = RATE_LIMITS.MEETING_BOOKINGS_PER_HOUR
      if (ctx.rateLimiter.isRateLimited(clientIP, ipRateLimit.maxRequests, ipRateLimit.windowMs)) {
        const resetTime = ctx.rateLimiter.getResetTime(clientIP)
        console.log(`🛡️ Rate limit exceeded for IP: ${clientIP}`)
        return {
          success: false,
          error: `Too many booking attempts. Please try again in ${resetTime} seconds`,
        }
      }

      // 5. Email rate limit
      const emailRateLimit = RATE_LIMITS.MEETING_BOOKINGS_PER_EMAIL_PER_DAY
      const emailIdentifier = `email:${email.toLowerCase()}`
      if (
        ctx.rateLimiter.isRateLimited(
          emailIdentifier,
          emailRateLimit.maxRequests,
          emailRateLimit.windowMs
        )
      ) {
        const resetTime = ctx.rateLimiter.getResetTime(emailIdentifier)
        console.log(`🛡️ Rate limit exceeded for email: ${email}`)
        return {
          success: false,
          error: `This email has too many pending bookings. Please try again in ${Math.ceil(resetTime / 3600)} hours`,
        }
      }

      // 6. Too-fast submissions
      if (ctx.rateLimiter.isTooFast(clientIP, RATE_LIMITS.MIN_SUBMISSION_INTERVAL)) {
        console.log(`🛡️ Submissions too frequent from IP: ${clientIP}`)
        return {
          success: false,
          error: 'Please wait a few minutes before submitting another booking',
        }
      }

      // 7. Turnstile
      if (turnstileToken) {
        const result = await ctx.turnstile.verify(turnstileToken, clientIP)
        if (!result.success) {
          console.log(`🛡️ Invalid Turnstile token from IP: ${clientIP}`)
          return { success: false, error: 'CAPTCHA verification failed. Please try again' }
        }
      }

      const meetingConfig = MEETING_TYPES[meetingType]
      if (!meetingConfig) {
        return { success: false, error: 'Invalid meeting type' }
      }

      const requiresPayment = (meetingConfig.priceSol ?? 0) > 0
      if (requiresPayment && !paymentId) {
        return { success: false, error: 'Payment required for this meeting type' }
      }

      const startDateTime = new Date(`${date}T${time}:00`)
      const endDateTime = new Date(
        startDateTime.getTime() + (meetingConfig.durationMinutes || 30) * 60000
      )

      let eventId: string | undefined
      let meetLink: string | undefined
      let calendarLink: string | undefined

      // Google Calendar event
      if (ctx.calendar) {
        try {
          // Low-level insert so we can capture meetLink + htmlLink
          // Use googleapis directly via the injected client's underlying auth.
          // We prefer a thin call through the class method; for parity we use
          // the class and then re-read via getEvent for the link fields.
          const id = await ctx.calendar.insertEvent({
            summary: `${meetingConfig.name} with ${name}`,
            description: `Meeting Type: ${meetingConfig.name}\nDuration: ${meetingConfig.durationMinutes || 30} minutes\n${category ? `Source: ${category}\n` : ''}\nNotes: ${notes || 'None'}\n\nPayment: ${paymentId ? `${paymentMethod || 'SOL'} - ${paymentId}` : 'Free'}`,
            startTime: startDateTime,
            endTime: endDateTime,
            attendees: [email, ctx.config.ownerEmail],
          })

          if (id) {
            eventId = id
            const full = await ctx.calendar.getEvent(id)
            meetLink = full?.conferenceData?.entryPoints?.[0]?.uri || undefined
            calendarLink = full?.htmlLink || undefined
            console.log('✅ Google Calendar event created:', eventId)
          }
        } catch (calendarError) {
          console.error('⚠️ Google Calendar error (continuing without it):', calendarError)
        }
      } else {
        console.log(
          '⚠️ Google Calendar not configured - booking will proceed without calendar integration'
        )
      }

      // Email
      try {
        await ctx.email.sendBookingConfirmation({
          to: email,
          meetingType,
          contactName: name,
          meetingDate: startDateTime,
          durationMinutes: meetingConfig.durationMinutes || 30,
          notes,
          category,
          meetLink,
        })
      } catch (emailError) {
        console.error('⚠️ Failed to send confirmation email:', emailError)
      }

      return {
        success: true,
        meeting: {
          eventId,
          meetingType,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          meetLink,
          calendarLink,
        },
      }
    } catch (error) {
      console.error('Meeting booking error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to book meeting',
      }
    }
  }

  async function cancelMeeting(input: CancelMeetingInput) {
    try {
      const { eventId, reason } = cancelMeetingSchema.parse(input)

      if (!ctx.calendar) {
        return { success: false, error: 'Calendar not configured' }
      }

      const event = await ctx.calendar.getEvent(eventId)
      const attendeeEmail = event?.attendees?.find((a) => a.email !== ctx.config.ownerEmail)?.email

      await ctx.calendar.deleteEvent(eventId)

      if (attendeeEmail && ctx.email.sendBookingNotification) {
        // Reuse notification channel for cancellations; apps can decide how to render.
        await ctx.email
          .sendBookingNotification({
            meetingType: event?.summary || 'Meeting',
            contactEmail: attendeeEmail,
            meetingDate: event?.start?.dateTime ? new Date(event.start.dateTime) : new Date(),
            durationMinutes: 0,
            notes: reason,
            category: 'cancellation',
          })
          .catch((err) => console.error('Failed to send cancellation email:', err))
      }

      return { success: true }
    } catch (error) {
      console.error('Meeting cancellation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel meeting',
      }
    }
  }

  async function getAvailableSlots(date: string, timezone = 'America/New_York') {
    try {
      if (!ctx.calendar) {
        return { success: false, error: 'Calendar not configured' }
      }

      const workStart = 9
      const workEnd = 17

      const startOfDay = new Date(`${date}T00:00:00`)
      const endOfDay = new Date(`${date}T23:59:59`)

      const busySlots = await ctx.calendar.getFreeBusy(startOfDay, endOfDay)

      const slots: { start: string; end: string; available: boolean }[] = []

      for (let hour = workStart; hour < workEnd; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(startOfDay)
          slotStart.setHours(hour, minute, 0)

          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotEnd.getMinutes() + 30)

          const isAvailable = !busySlots.some((busy) => {
            return slotStart < busy.end && slotEnd > busy.start
          })

          if (slotStart > new Date()) {
            slots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              available: isAvailable,
            })
          }
        }
      }

      return {
        success: true,
        date,
        timezone,
        slots: slots.filter((s) => s.available),
      }
    } catch (error) {
      console.error('Get available slots error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get available slots',
      }
    }
  }

  async function rescheduleMeeting(
    eventId: string,
    newDate: string,
    newTime: string,
    timezone = 'America/New_York'
  ) {
    try {
      if (!ctx.calendar) {
        return { success: false, error: 'Calendar not configured' }
      }

      const event = await ctx.calendar.getEvent(eventId)
      if (!event) {
        return { success: false, error: 'Event not found' }
      }

      const startDateTime = event.start?.dateTime
      const endDateTime = event.end?.dateTime

      if (!startDateTime || !endDateTime) {
        throw new Error('Event start or end time not found')
      }

      const originalStart = new Date(startDateTime)
      const originalEnd = new Date(endDateTime)
      const durationMs = originalEnd.getTime() - originalStart.getTime()

      const newStart = new Date(`${newDate}T${newTime}:00`)
      const newEnd = new Date(newStart.getTime() + durationMs)

      const updated = await ctx.calendar.updateEvent(eventId, {
        startTime: newStart,
        endTime: newEnd,
      })

      if (!updated) {
        return { success: false, error: 'Failed to update event' }
      }

      const refreshed = await ctx.calendar.getEvent(eventId)

      return {
        success: true,
        meeting: {
          eventId: refreshed?.id,
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
          calendarLink: refreshed?.htmlLink,
        },
      }
    } catch (error) {
      console.error('Meeting reschedule error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reschedule meeting',
      }
    }
  }

  return {
    bookMeeting,
    cancelMeeting,
    getAvailableSlots,
    rescheduleMeeting,
  }
}
