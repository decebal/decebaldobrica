import type { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

// Initialize OAuth2 client
let oauth2Client: OAuth2Client | null = null

export function initGoogleCalendar() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  Google Calendar not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET')
    return null
  }

  oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
  )

  // If refresh token is available, set it
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })
  }

  return oauth2Client
}

/**
 * Get OAuth URL for user authorization
 */
export function getAuthUrl(): string {
  if (!oauth2Client) {
    throw new Error('Google Calendar not initialized')
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
  if (!oauth2Client) {
    throw new Error('Google Calendar not initialized')
  }

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  console.log('✅ Google Calendar authorized')
  console.log('📝 Save this refresh token to .env:')
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)

  return tokens
}

/**
 * Check availability for a specific time slot
 */
export async function checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
  if (!oauth2Client) {
    return true // If not configured, assume available
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [{ id: 'primary' }],
      },
    })

    const busy = response.data.calendars?.primary?.busy || []
    return busy.length === 0 // Available if no busy slots
  } catch (error) {
    console.error('Error checking availability:', error)
    return true // Default to available on error
  }
}

/**
 * Get free/busy information for a date range
 */
export async function getFreeBusy(
  startDate: Date,
  endDate: Date
): Promise<Array<{ start: Date; end: Date }>> {
  if (!oauth2Client) {
    return []
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: 'primary' }],
      },
    })

    const busy = response.data.calendars?.primary?.busy || []

    return busy
      .filter((slot) => slot.start && slot.end)
      .map((slot) => ({
        start: new Date(slot.start as string),
        end: new Date(slot.end as string),
      }))
  } catch (error) {
    console.error('Error getting free/busy:', error)
    return []
  }
}

/**
 * Create a calendar event
 */
export async function createCalendarEvent(event: {
  summary: string
  description: string
  startTime: Date
  endTime: Date
  attendees?: string[]
  location?: string
}): Promise<string | null> {
  if (!oauth2Client) {
    console.warn('Google Calendar not configured, skipping event creation')
    return null
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: 'America/New_York', // Update to your timezone
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: 'America/New_York',
        },
        attendees: event.attendees?.map((email) => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `meeting-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    })

    console.log('✅ Calendar event created:', response.data.htmlLink)
    return response.data.id || null
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return null
  }
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  updates: {
    summary?: string
    description?: string
    startTime?: Date
    endTime?: Date
  }
): Promise<boolean> {
  if (!oauth2Client) {
    return false
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary: updates.summary,
        description: updates.description,
        start: updates.startTime
          ? {
              dateTime: updates.startTime.toISOString(),
              timeZone: 'America/New_York',
            }
          : undefined,
        end: updates.endTime
          ? {
              dateTime: updates.endTime.toISOString(),
              timeZone: 'America/New_York',
            }
          : undefined,
      },
      sendUpdates: 'all',
    })

    console.log('✅ Calendar event updated')
    return true
  } catch (error) {
    console.error('Error updating calendar event:', error)
    return false
  }
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  if (!oauth2Client) {
    return false
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all',
    })

    console.log('✅ Calendar event deleted')
    return true
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return false
  }
}

/**
 * List upcoming events
 */
export async function listUpcomingEvents(maxResults = 10) {
  if (!oauth2Client) {
    return []
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })

    return response.data.items || []
  } catch (error) {
    console.error('Error listing events:', error)
    return []
  }
}
