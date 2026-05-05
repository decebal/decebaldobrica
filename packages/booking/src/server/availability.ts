import { NextResponse } from 'next/server'
import type { BookingContext } from './context'

interface AvailabilityRequest {
  duration: number
  timezone: string
  daysToCheck?: number
}

/**
 * Returns a Next.js App Router POST handler that finds the next available slot
 * within the owner's business hours (9am–5pm in ctx.config.timeZone) that doesn't
 * conflict with existing calendar events.
 *
 * Consumers:
 *   // apps/web/src/app/api/availability/route.ts
 *   export const POST = createAvailabilityHandler(buildBookingContextFromEnv())
 */
export function createAvailabilityHandler(ctx: BookingContext) {
  return async function POST(req: Request) {
    try {
      const { duration, timezone, daysToCheck = 14 }: AvailabilityRequest = await req.json()

      if (!ctx.calendar) {
        return NextResponse.json({ error: 'Google Calendar not configured' }, { status: 500 })
      }

      const startDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + daysToCheck)
      endDate.setHours(23, 59, 59, 999)

      const busySlots = await ctx.calendar.getFreeBusy(startDate, endDate)

      const ownerTimezone = ctx.config.timeZone ?? 'America/New_York'
      const nextSlot = findNextAvailableSlot(
        startDate,
        endDate,
        busySlots,
        duration,
        ownerTimezone,
        timezone
      )

      if (!nextSlot) {
        return NextResponse.json(
          { error: 'No available slots found in the next 14 days' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, slot: nextSlot })
    } catch (error) {
      console.error('Error finding available slot:', error)
      return NextResponse.json({ error: 'Failed to find available slot' }, { status: 500 })
    }
  }
}

function findNextAvailableSlot(
  startDate: Date,
  endDate: Date,
  busySlots: Array<{ start: Date; end: Date }>,
  duration: number,
  myTimezone: string,
  _userTimezone: string
): { date: string; time: string } | null {
  const currentDate = new Date(startDate)
  const businessStart = 9
  const businessEnd = 17
  const interval = duration === 15 ? 15 : duration === 30 ? 30 : 60

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1)
      currentDate.setHours(0, 0, 0, 0)
      continue
    }

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const slotStart = new Date(currentDate)
        slotStart.setHours(hour, minute, 0, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + duration)

        const myTimeString = slotStart.toLocaleTimeString('en-GB', {
          timeZone: myTimezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })

        const timeParts = myTimeString.split(':').map(Number)
        const myHour = timeParts[0] ?? 0
        const myMinute = timeParts[1] ?? 0

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

        const isConflict = busySlots.some((busy) => {
          return slotStart < busy.end && slotEnd > busy.start
        })

        if (!isConflict) {
          const dateStr = slotStart.toISOString().split('T')[0] ?? ''
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          return { date: dateStr, time: timeStr }
        }
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }

  return null
}
