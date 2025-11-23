// Rate limiting utility for preventing bot spam
// Uses in-memory storage - for production, consider Redis

interface RateLimitEntry {
  count: number
  resetAt: number
  submissions: number[] // timestamps of submissions for timing analysis
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP, email, etc.)
   * @param maxRequests - Maximum requests allowed in window
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limit exceeded, false otherwise
   */
  isRateLimited(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    if (!entry || entry.resetAt < now) {
      // Create new entry
      this.store.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
        submissions: [now],
      })
      return false
    }

    // Update existing entry
    entry.submissions.push(now)

    // Keep only submissions within the window
    entry.submissions = entry.submissions.filter((ts) => ts > now - windowMs)
    entry.count = entry.submissions.length

    return entry.count > maxRequests
  }

  /**
   * Check if submissions are happening too fast (bot-like behavior)
   * @param identifier - Unique identifier
   * @param minIntervalMs - Minimum time between submissions in milliseconds
   * @returns true if submissions are too fast
   */
  isTooFast(identifier: string, minIntervalMs: number): boolean {
    const entry = this.store.get(identifier)
    if (!entry || entry.submissions.length < 2) {
      return false
    }

    const submissions = entry.submissions.slice().sort((a, b) => b - a)
    const timeSinceLastSubmission = submissions[0] - submissions[1]

    return timeSinceLastSubmission < minIntervalMs
  }

  /**
   * Get remaining time until rate limit resets (in seconds)
   */
  getResetTime(identifier: string): number {
    const entry = this.store.get(identifier)
    if (!entry) return 0

    const now = Date.now()
    const remaining = Math.max(0, entry.resetAt - now)
    return Math.ceil(remaining / 1000)
  }

  /**
   * Clear rate limit for an identifier
   */
  clear(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Preset configurations
export const RATE_LIMITS = {
  // Allow 3 booking attempts per hour per IP
  MEETING_BOOKINGS_PER_HOUR: { maxRequests: 3, windowMs: 60 * 60 * 1000 },

  // Allow 5 booking attempts per day per email
  MEETING_BOOKINGS_PER_EMAIL_PER_DAY: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 },

  // Minimum 5 minutes between submissions from same IP
  MIN_SUBMISSION_INTERVAL: 5 * 60 * 1000,
}

/**
 * Get client IP from request headers (works with Vercel, Cloudflare, etc.)
 */
export function getClientIP(headers: Headers): string {
  // Try various header formats
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'

  return ip
}
