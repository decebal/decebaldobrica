import type { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

export interface GoogleCalendarConfig {
  clientId: string
  clientSecret: string
  redirectUri?: string
  refreshToken?: string
  timeZone?: string
}

export interface CalendarEventInput {
  summary: string
  description: string
  startTime: Date
  endTime: Date
  attendees?: string[]
  location?: string
}

export interface CalendarEventUpdate {
  summary?: string
  description?: string
  startTime?: Date
  endTime?: Date
}

export interface BusySlot {
  start: Date
  end: Date
}

/**
 * Typed Google Calendar client. Constructor takes explicit credentials —
 * no process.env reads inside the class. Use buildCalendarClientFromEnv() if
 * you want env-driven construction.
 */
export class GoogleCalendarClient {
  private oauth2Client: OAuth2Client
  private timeZone: string

  constructor(config: GoogleCalendarConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    )

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({ refresh_token: config.refreshToken })
    }

    this.timeZone = config.timeZone ?? 'America/New_York'
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly',
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    })
  }

  async getTokensFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    return tokens
  }

  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: 'primary' }],
        },
      })
      const busy = response.data.calendars?.primary?.busy || []
      return busy.length === 0
    } catch (error) {
      console.error('Error checking availability:', error)
      return true
    }
  }

  async getFreeBusy(startDate: Date, endDate: Date): Promise<BusySlot[]> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
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

  async insertEvent(event: CalendarEventInput): Promise<string | null> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.summary,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.startTime.toISOString(),
            timeZone: this.timeZone,
          },
          end: {
            dateTime: event.endTime.toISOString(),
            timeZone: this.timeZone,
          },
          attendees: event.attendees?.map((email) => ({ email })),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 },
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
      return response.data.id || null
    } catch (error) {
      console.error('Error creating calendar event:', error)
      return null
    }
  }

  async updateEvent(eventId: string, updates: CalendarEventUpdate): Promise<boolean> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      await calendar.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody: {
          summary: updates.summary,
          description: updates.description,
          start: updates.startTime
            ? {
                dateTime: updates.startTime.toISOString(),
                timeZone: this.timeZone,
              }
            : undefined,
          end: updates.endTime
            ? {
                dateTime: updates.endTime.toISOString(),
                timeZone: this.timeZone,
              }
            : undefined,
        },
        sendUpdates: 'all',
      })
      return true
    } catch (error) {
      console.error('Error updating calendar event:', error)
      return false
    }
  }

  async getEvent(eventId: string) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      const response = await calendar.events.get({ calendarId: 'primary', eventId })
      return response.data
    } catch (error) {
      console.error('Error getting calendar event:', error)
      return null
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      await calendar.events.delete({
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
      })
      return true
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      return false
    }
  }

  async listUpcomingEvents(maxResults = 10) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
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
}

/**
 * Env-driven factory. Returns null when required env vars are missing.
 */
export function buildCalendarClientFromEnv(): GoogleCalendarClient | null {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  Google Calendar not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET')
    return null
  }

  return new GoogleCalendarClient({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compat module-level singleton API (matches apps/web/src/lib/googleCalendar.ts).
// Prefer the class above for new code.
// ─────────────────────────────────────────────────────────────────────────────

let singleton: GoogleCalendarClient | null = null

export function initGoogleCalendar(): GoogleCalendarClient | null {
  singleton = buildCalendarClientFromEnv()
  return singleton
}

export function getAuthUrl(): string {
  if (!singleton) throw new Error('Google Calendar not initialized')
  return singleton.getAuthUrl()
}

export async function getTokensFromCode(code: string) {
  if (!singleton) throw new Error('Google Calendar not initialized')
  const tokens = await singleton.getTokensFromCode(code)
  console.log('✅ Google Calendar authorized')
  console.log('📝 Save this refresh token to .env:')
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
  return tokens
}

export async function checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
  if (!singleton) return true
  return singleton.checkAvailability(startTime, endTime)
}

export async function getFreeBusy(startDate: Date, endDate: Date): Promise<BusySlot[]> {
  if (!singleton) return []
  return singleton.getFreeBusy(startDate, endDate)
}

export async function createCalendarEvent(event: CalendarEventInput): Promise<string | null> {
  if (!singleton) {
    console.warn('Google Calendar not configured, skipping event creation')
    return null
  }
  const id = await singleton.insertEvent(event)
  if (id) console.log('✅ Calendar event created:', id)
  return id
}

export async function updateCalendarEvent(
  eventId: string,
  updates: CalendarEventUpdate
): Promise<boolean> {
  if (!singleton) return false
  const ok = await singleton.updateEvent(eventId, updates)
  if (ok) console.log('✅ Calendar event updated')
  return ok
}

export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  if (!singleton) return false
  const ok = await singleton.deleteEvent(eventId)
  if (ok) console.log('✅ Calendar event deleted')
  return ok
}

export async function listUpcomingEvents(maxResults = 10) {
  if (!singleton) return []
  return singleton.listUpcomingEvents(maxResults)
}
