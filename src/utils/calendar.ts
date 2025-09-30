// Temporary calendar utils - these should be replaced with proper Google Calendar integration

export interface TimeSlot {
  start: Date
  end: Date
  available: boolean
}

export interface CalendarMeeting {
  id: string
  title: string
  start: Date
  end: Date
  attendeeEmail?: string
  attendeeName?: string
}

const mockMeetings: CalendarMeeting[] = []

export function generateTimeSlots(date: string, durationMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  const baseDate = new Date(date)

  // Generate slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    const start = new Date(baseDate)
    start.setHours(hour, 0, 0, 0)

    const end = new Date(start)
    end.setMinutes(end.getMinutes() + durationMinutes)

    slots.push({
      start,
      end,
      available: true,
    })
  }

  return slots
}

export function formatTimeSlot(slot: TimeSlot): string {
  const start = slot.start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${start} (${slot.available ? 'Available' : 'Booked'})`
}

export function getMeetings(): CalendarMeeting[] {
  return mockMeetings
}

export function hasConflict(slot: TimeSlot, meetings: CalendarMeeting[]): boolean {
  return meetings.some((meeting) => {
    return slot.start < meeting.end && slot.end > meeting.start
  })
}

export function createCalendarEvent(event: {
  title: string
  start: Date
  end: Date
  attendeeEmail?: string
  attendeeName?: string
}): CalendarMeeting {
  const meeting: CalendarMeeting = {
    id: `meeting_${Date.now()}`,
    ...event,
  }
  return meeting
}

export function saveMeeting(meeting: CalendarMeeting): void {
  mockMeetings.push(meeting)
}

export function formatMeetingConfirmation(meeting: CalendarMeeting): string {
  const date = meeting.start.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = meeting.start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return `Your meeting "${meeting.title}" has been scheduled for ${date} at ${time}.`
}
