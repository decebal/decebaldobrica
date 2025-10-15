import { getFreeBusy, initGoogleCalendar } from '@/lib/googleCalendar'
import { config } from '@/lib/personalConfig'
import { NextResponse } from 'next/server'

interface AvailabilityRequest {
  duration: number // meeting duration in minutes
  timezone: string // user's timezone
  daysToCheck?: number // how many days ahead to check (default 14)
}

export async function POST(req: Request) {
  try {
    const { duration, timezone, daysToCheck = 14 }: AvailabilityRequest = await req.json()

    // Initialize Google Calendar
    const oauth = initGoogleCalendar()
    if (!oauth) {
      return NextResponse.json({ error: 'Google Calendar not configured' }, { status: 500 })
    }

    // Calculate date range: start from 2 days from now
    const startDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + daysToCheck)
    endDate.setHours(23, 59, 59, 999)

    // Get busy slots from Google Calendar
    const busySlots = await getFreeBusy(startDate, endDate)

    // Find the next available slot
    const myTimezone = config.contact.timezone // 'Europe/London'
    const nextSlot = findNextAvailableSlot(
      startDate,
      endDate,
      busySlots,
      duration,
      myTimezone,
      timezone
    )

    if (!nextSlot) {
      return NextResponse.json(
        { error: 'No available slots found in the next 14 days' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      slot: nextSlot,
    })
  } catch (error) {
    console.error('Error finding available slot:', error)
    return NextResponse.json({ error: 'Failed to find available slot' }, { status: 500 })
  }
}

/**
 * Find the next available slot in the user's timezone that doesn't conflict with busy periods
 */
function findNextAvailableSlot(
  startDate: Date,
  endDate: Date,
  busySlots: Array<{ start: Date; end: Date }>,
  duration: number,
  myTimezone: string,
  userTimezone: string
): { date: string; time: string } | null {
  const currentDate = new Date(startDate)

  // Business hours in my timezone: 9 AM - 5 PM
  const businessStart = 9
  const businessEnd = 17

  // Determine time slot interval based on duration
  const interval = duration === 15 ? 15 : duration === 30 ? 30 : 60

  while (currentDate <= endDate) {
    // Skip weekends
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1)
      currentDate.setHours(0, 0, 0, 0)
      continue
    }

    // Check all time slots for this day
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        // Create a date object for this slot in UTC
        const slotStart = new Date(currentDate)
        slotStart.setHours(hour, minute, 0, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + duration)

        // Convert to my timezone to check business hours
        const myTimeString = slotStart.toLocaleTimeString('en-GB', {
          timeZone: myTimezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })

        const [myHour, myMinute] = myTimeString.split(':').map(Number)

        // Check if this slot is within my business hours
        const meetingEndHour = myHour + Math.floor((myMinute + duration) / 60)
        const meetingEndMinute = (myMinute + duration) % 60

        if (
          myHour < businessStart ||
          myHour >= businessEnd ||
          meetingEndHour > businessEnd ||
          (meetingEndHour === businessEnd && meetingEndMinute > 0)
        ) {
          continue
        }

        // Check if this slot conflicts with any busy periods
        const isConflict = busySlots.some((busy) => {
          return slotStart < busy.end && slotEnd > busy.start
        })

        if (!isConflict) {
          // Found an available slot! Return it in user's local timezone format
          const dateStr = slotStart.toISOString().split('T')[0]
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

          return {
            date: dateStr,
            time: timeStr,
          }
        }
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }

  return null
}
