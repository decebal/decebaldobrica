// src/actions/meeting.ts
// Server Action for meeting booking with Google Calendar integration

'use server'

import { z } from 'zod'
import { google } from 'googleapis'
import { addMessage, trackEvent } from '@/lib/chatHistory'
import { getMeetingConfig } from '@/lib/meetingPayments'
import { Resend } from 'resend'

const bookMeetingSchema = z.object({
  meetingType: z.string(),
  date: z.string(), // ISO date string
  time: z.string(), // HH:MM format
  name: z.string().min(1),
  email: z.string().email(),
  notes: z.string().optional(),
  timezone: z.string().default('America/New_York'),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
  paymentId: z.string().optional(),
})

const cancelMeetingSchema = z.object({
  eventId: z.string(),
  reason: z.string().optional(),
})

// Initialize Google Calendar client
function getCalendarClient() {
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

// Initialize Resend client
function getEmailClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Resend API key not configured')
  }
  return new Resend(apiKey)
}

/**
 * Book a meeting with Google Calendar integration
 * Creates calendar event and sends confirmation email
 */
export async function bookMeeting(input: z.infer<typeof bookMeetingSchema>) {
  try {
    const { meetingType, date, time, name, email, notes, timezone, conversationId, userId, paymentId } =
      bookMeetingSchema.parse(input)

    // Get meeting configuration
    const config = getMeetingConfig(meetingType)

    // Validate payment if required
    if (config.requiresPayment && !paymentId) {
      return {
        success: false,
        error: 'Payment required for this meeting type',
      }
    }

    // Parse date and time
    const startDateTime = new Date(`${date}T${time}:00`)
    const endDateTime = new Date(startDateTime.getTime() + config.duration * 60000)

    // Create Google Calendar event
    const calendar = getCalendarClient()

    const event = {
      summary: `${meetingType} with ${name}`,
      description: `Meeting Type: ${meetingType}\nDuration: ${config.duration} minutes\n\nNotes: ${notes || 'None'}\n\nPayment ID: ${paymentId || 'Free'}`,
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
        { email: process.env.CALENDAR_OWNER_EMAIL || 'hello@example.com' },
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

    const eventId = calendarResponse.data.id
    const meetLink = calendarResponse.data.conferenceData?.entryPoints?.[0]?.uri

    // Send confirmation email
    try {
      const resend = getEmailClient()
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: email,
        subject: `Meeting Confirmed: ${meetingType}`,
        html: `
          <h2>Meeting Confirmed</h2>
          <p>Hi ${name},</p>
          <p>Your meeting has been confirmed!</p>

          <h3>Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${meetingType}</li>
            <li><strong>Duration:</strong> ${config.duration} minutes</li>
            <li><strong>Date:</strong> ${startDateTime.toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${startDateTime.toLocaleTimeString()}</li>
            ${config.requiresPayment ? `<li><strong>Price:</strong> ${config.price} SOL</li>` : ''}
          </ul>

          ${meetLink ? `<p><a href="${meetLink}">Join Google Meet</a></p>` : ''}

          <p>A calendar invitation has been sent to your email.</p>

          ${notes ? `<h3>Your Notes:</h3><p>${notes}</p>` : ''}

          <p>Looking forward to meeting you!</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the booking if email fails
    }

    // Track event
    if (conversationId) {
      trackEvent(
        'meeting_booked',
        {
          meetingType,
          duration: config.duration,
          price: config.price,
          paymentId,
        },
        userId,
        conversationId
      )

      // Add message to conversation
      addMessage(
        conversationId,
        'assistant',
        `Great! I've booked your ${meetingType} for ${startDateTime.toLocaleDateString()} at ${startDateTime.toLocaleTimeString()}. You should receive a calendar invitation and confirmation email shortly.${meetLink ? ` Join link: ${meetLink}` : ''}`
      )
    }

    return {
      success: true,
      meeting: {
        eventId,
        meetingType,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        meetLink,
        calendarLink: calendarResponse.data.htmlLink,
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
    if (attendeeEmail) {
      try {
        const resend = getEmailClient()
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
export async function getAvailableSlots(date: string, timezone: string = 'America/New_York') {
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
          const busyStart = new Date(busy.start!)
          const busyEnd = new Date(busy.end!)
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
  timezone: string = 'America/New_York'
) {
  try {
    const calendar = getCalendarClient()

    // Get existing event
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId,
    })

    // Calculate duration from original event
    const originalStart = new Date(event.data.start?.dateTime!)
    const originalEnd = new Date(event.data.end?.dateTime!)
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
