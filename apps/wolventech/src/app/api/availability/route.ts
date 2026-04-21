import { buildBookingContextFromEnv } from '@/lib/bookingContext'
import { createAvailabilityHandler } from '@decebal/booking/server/availability'

export const POST = createAvailabilityHandler(buildBookingContextFromEnv())
