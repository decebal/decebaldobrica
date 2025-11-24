// src/actions/meeting.ts
// Server Action for meeting booking with Google Calendar integration

'use server'

import { sendMeetingConfirmation } from '@/lib/emailService'
import { validateBookingData } from '@/lib/emailValidation'
import { getPaymentConfig } from '@/lib/payments'
import { RATE_LIMITS, getClientIP, rateLimiter } from '@/lib/rateLimit'
import { google } from 'googleapis'
import { headers } from 'next/headers'
import { z } from 'zod'

const bookMeetingSchema = z.object({
  meetingType: z.string(),
  date: z.string(), // ISO date string
  time: z.string(), // HH:MM format
  name: z.string().min(1),
  email: z.string().email(),
  notes: z.string().optional(),
  category: z.string().optional(), // Track what prompted the booking
  timezone: z.string().default('America/New_York'),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
  paymentId: z.string().optional(),
  paymentMethod: z.enum(['SOL', 'BTC', 'ETH', 'USDC']).optional(),
  // Bot protection fields
  turnstileToken: z.string().optional(), // Cloudflare Turnstile token
  formStartTime: z.number().optional(), // Timestamp when form was displayed
  honeypot: z.string().optional(), // Honeypot field
})

const cancelMeetingSchema = z.object({
  eventId: z.string(),
  reason: z.string().optional(),
})

// Check if Google Calendar is configured
function isGoogleCalendarConfigured() {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REDIRECT_URI &&
    process.env.GOOGLE_REFRESH_TOKEN
  )
}

// Initialize Google Calendar client
function getCalendarClient() {
  if (!isGoogleCalendarConfigured()) {
    throw new Error('Google Calendar not configured')
  }

  const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  }

  const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uri
  )

  // Set refresh token (should be stored securely)
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

// Check if email service is configured
function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY
}

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('⚠️ Turnstile secret key not configured - skipping verification')
    return true // Don't block if not configured
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ip,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

/**
 * Book a meeting with Google Calendar integration
 * Creates calendar event and sends confirmation email
 */
export async function bookMeeting(input: z.infer<typeof bookMeetingSchema>) {
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
      conversationId,
      userId,
      paymentId,
      paymentMethod,
      turnstileToken,
      formStartTime,
      honeypot,
    } = bookMeetingSchema.parse(input)

    // Get client IP for rate limiting
    const headersList = await headers()
    const clientIP = getClientIP(headersList)

    // ===================
    // BOT PROTECTION CHECKS
    // ===================

    // 1. Honeypot check - should be empty
    if (honeypot && honeypot.trim() !== '') {
      console.log(`🛡️ Bot detected via honeypot from IP: ${clientIP}`)
      // Silently fail - don't reveal we detected them
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Add delay to waste bot time
      return {
        success: false,
        error: 'Unable to process request at this time',
      }
    }

    // 2. Form timing check - humans take at least 5 seconds to fill a form
    if (formStartTime) {
      const timeTaken = Date.now() - formStartTime
      const minTimeMs = 5000 // 5 seconds minimum
      if (timeTaken < minTimeMs) {
        console.log(`🛡️ Bot detected - form filled too fast (${timeTaken}ms) from IP: ${clientIP}`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return {
          success: false,
          error: 'Please take your time filling out the form',
        }
      }
    }

    // 3. Validate email and name for suspicious patterns
    const validation = validateBookingData({ name, email, notes })
    if (!validation.isValid) {
      console.log(`🛡️ Suspicious data detected from IP: ${clientIP} - ${validation.reason}`)
      return {
        success: false,
        error: validation.reason || 'Invalid booking data',
      }
    }

    // 4. Rate limiting by IP
    const ipRateLimit = RATE_LIMITS.MEETING_BOOKINGS_PER_HOUR
    if (rateLimiter.isRateLimited(clientIP, ipRateLimit.maxRequests, ipRateLimit.windowMs)) {
      const resetTime = rateLimiter.getResetTime(clientIP)
      console.log(`🛡️ Rate limit exceeded for IP: ${clientIP}`)
      return {
        success: false,
        error: `Too many booking attempts. Please try again in ${resetTime} seconds`,
      }
    }

    // 5. Rate limiting by email
    const emailRateLimit = RATE_LIMITS.MEETING_BOOKINGS_PER_EMAIL_PER_DAY
    const emailIdentifier = `email:${email.toLowerCase()}`
    if (
      rateLimiter.isRateLimited(
        emailIdentifier,
        emailRateLimit.maxRequests,
        emailRateLimit.windowMs
      )
    ) {
      const resetTime = rateLimiter.getResetTime(emailIdentifier)
      console.log(`🛡️ Rate limit exceeded for email: ${email}`)
      return {
        success: false,
        error: `This email has too many pending bookings. Please try again in ${Math.ceil(resetTime / 3600)} hours`,
      }
    }

    // 6. Check submission frequency (too fast = bot)
    if (rateLimiter.isTooFast(clientIP, RATE_LIMITS.MIN_SUBMISSION_INTERVAL)) {
      console.log(`🛡️ Submissions too frequent from IP: ${clientIP}`)
      return {
        success: false,
        error: 'Please wait a few minutes before submitting another booking',
      }
    }

    // 7. Verify Turnstile CAPTCHA token (if provided and configured)
    if (turnstileToken && process.env.TURNSTILE_SECRET_KEY) {
      const isValidToken = await verifyTurnstileToken(turnstileToken, clientIP)
      if (!isValidToken) {
        console.log(`🛡️ Invalid Turnstile token from IP: ${clientIP}`)
        return {
          success: false,
          error: 'CAPTCHA verification failed. Please try again',
        }
      }
    }

    // ===================
    // END BOT PROTECTION
    // ===================

    // Get meeting configuration from unified config
    const config = getPaymentConfig('meeting_type', meetingType)

    if (!config) {
      return {
        success: false,
        error: 'Invalid meeting type',
      }
    }

    // Validate payment if required
    const requiresPayment = (config.priceSol ?? 0) > 0
    if (requiresPayment && !paymentId) {
      return {
        success: false,
        error: 'Payment required for this meeting type',
      }
    }

    // Parse date and time
    const startDateTime = new Date(`${date}T${time}:00`)
    const endDateTime = new Date(startDateTime.getTime() + (config.durationMinutes || 30) * 60000)

    let eventId: string | undefined
    let meetLink: string | undefined
    let calendarLink: string | undefined

    // Try to create Google Calendar event if configured
    if (isGoogleCalendarConfigured()) {
      try {
        const calendar = getCalendarClient()

        const event = {
          summary: `${config.name} with ${name}`,
          description: `Meeting Type: ${config.name}\nDuration: ${config.durationMinutes || 30} minutes\n${category ? `Source: ${category}\n` : ''}\nNotes: ${notes || 'None'}\n\nPayment: ${paymentId ? `${paymentMethod || 'SOL'} - ${paymentId}` : 'Free'}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: timezone,
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: timezone,
          },
          attendees: [
            { email },
            { email: process.env.CALENDAR_OWNER_EMAIL || 'discovery@decebaldobrica.com' },
          ],
          conferenceData: {
            createRequest: {
              requestId: `meeting-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 30 }, // 30 minutes before
            ],
          },
        }

        const calendarResponse = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
          conferenceDataVersion: 1,
          sendUpdates: 'all',
        })

        eventId = calendarResponse.data.id || undefined
        meetLink = calendarResponse.data.conferenceData?.entryPoints?.[0]?.uri || undefined
        calendarLink = calendarResponse.data.htmlLink || undefined

        console.log('✅ Google Calendar event created:', eventId)
      } catch (calendarError) {
        console.error('⚠️ Google Calendar error (continuing without it):', calendarError)
        // Continue without calendar - we'll still send the email
      }
    } else {
      console.log(
        '⚠️ Google Calendar not configured - booking will proceed without calendar integration'
      )
    }

    // Send confirmation email using branded template
    if (isEmailConfigured()) {
      try {
        await sendMeetingConfirmation(
          {
            id: eventId || `booking-${Date.now()}`,
            type: meetingType,
            date: startDateTime,
            duration: config.durationMinutes || 30,
            contactName: name,
            contactEmail: email,
            notes,
            category,
          },
          meetLink
        )
      } catch (emailError) {
        console.error('⚠️ Failed to send confirmation email:', emailError)
        // Don't fail the booking if email fails
      }
    } else {
      console.log('⚠️ Email service not configured - booking details:', {
        name,
        email,
        meetingType,
        date: startDateTime.toISOString(),
      })
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

/**
 * Cancel a meeting
 * Removes calendar event and sends cancellation email
 */
export async function cancelMeeting(input: z.infer<typeof cancelMeetingSchema>) {
  try {
    const { eventId, reason } = cancelMeetingSchema.parse(input)

    const calendar = getCalendarClient()

    // Get event details before deleting
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId,
    })

    const attendeeEmail = event.data.attendees?.find(
      (a) => a.email !== process.env.CALENDAR_OWNER_EMAIL
    )?.email

    // Delete calendar event
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all',
    })

    // Send cancellation email
    if (attendeeEmail && isEmailConfigured()) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'noreply@example.com',
          to: attendeeEmail,
          subject: 'Meeting Cancelled',
          html: `
            <h2>Meeting Cancelled</h2>
            <p>Your meeting "${event.data.summary}" has been cancelled.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>If you'd like to reschedule, please book a new meeting.</p>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError)
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Meeting cancellation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel meeting',
    }
  }
}

/**
 * Get available time slots for a specific date
 * Checks calendar for busy times and returns available slots
 */
export async function getAvailableSlots(date: string, timezone = 'America/New_York') {
  try {
    const calendar = getCalendarClient()

    // Define working hours (9 AM - 5 PM)
    const workStart = 9
    const workEnd = 17

    const startOfDay = new Date(`${date}T00:00:00`)
    const endOfDay = new Date(`${date}T23:59:59`)

    // Get busy times from calendar
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        timeZone: timezone,
        items: [{ id: 'primary' }],
      },
    })

    const busySlots = response.data.calendars?.primary?.busy || []

    // Generate all possible 30-minute slots during working hours
    const slots: { start: string; end: string; available: boolean }[] = []

    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(startOfDay)
        slotStart.setHours(hour, minute, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + 30)

        // Check if slot overlaps with busy times
        const isAvailable = !busySlots.some((busy) => {
          if (!busy.start || !busy.end) return false
          const busyStart = new Date(busy.start)
          const busyEnd = new Date(busy.end)
          return slotStart < busyEnd && slotEnd > busyStart
        })

        // Only include future slots
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

/**
 * Reschedule a meeting
 * Updates existing calendar event to new time
 */
export async function rescheduleMeeting(
  eventId: string,
  newDate: string,
  newTime: string,
  timezone = 'America/New_York'
) {
  try {
    const calendar = getCalendarClient()

    // Get existing event
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId,
    })

    // Calculate duration from original event
    const startDateTime = event.data.start?.dateTime
    const endDateTime = event.data.end?.dateTime

    if (!startDateTime || !endDateTime) {
      throw new Error('Event start or end time not found')
    }

    const originalStart = new Date(startDateTime)
    const originalEnd = new Date(endDateTime)
    const durationMs = originalEnd.getTime() - originalStart.getTime()

    // Calculate new times
    const newStart = new Date(`${newDate}T${newTime}:00`)
    const newEnd = new Date(newStart.getTime() + durationMs)

    // Update event
    const updatedEvent = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: {
        ...event.data,
        start: {
          dateTime: newStart.toISOString(),
          timeZone: timezone,
        },
        end: {
          dateTime: newEnd.toISOString(),
          timeZone: timezone,
        },
      },
      sendUpdates: 'all',
    })

    return {
      success: true,
      meeting: {
        eventId: updatedEvent.data.id,
        startTime: newStart.toISOString(),
        endTime: newEnd.toISOString(),
        calendarLink: updatedEvent.data.htmlLink,
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
