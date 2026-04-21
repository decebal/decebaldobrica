import type { GoogleCalendarClient } from './calendar'
import type { EmailSender } from './email'
import type { RateLimiterLike } from './rate-limit'
import type { TurnstileVerifier } from './turnstile'

/**
 * Dependency container for the booking server actions. Each consuming app
 * constructs its own BookingContext by wiring env-bound service instances.
 */
export interface BookingContext {
  calendar: GoogleCalendarClient | null
  email: EmailSender
  rateLimiter: RateLimiterLike
  turnstile: TurnstileVerifier
  config: BookingContextConfig
}

export interface BookingContextConfig {
  /** Owner's business email (gets booking notifications / is invited to events). */
  ownerEmail: string
  /** "From" address on outgoing booking emails. */
  fromAddress: string
  /** Reply-to address on outgoing booking emails. */
  replyTo?: string
  /** Owner's working timezone for calendar events (e.g. "America/New_York"). */
  timeZone?: string
  /** Consuming app's public URL, for links inside emails. */
  appUrl: string
}
