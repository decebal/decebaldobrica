'use server'

import { buildBookingContextFromEnv } from '@/lib/bookingContext'
import { createMeetingActions } from '@decebal/booking/server/meeting'

const actions = createMeetingActions(buildBookingContextFromEnv())

export const bookMeeting = actions.bookMeeting
export const cancelMeeting = actions.cancelMeeting
export const getAvailableSlots = actions.getAvailableSlots
export const rescheduleMeeting = actions.rescheduleMeeting
