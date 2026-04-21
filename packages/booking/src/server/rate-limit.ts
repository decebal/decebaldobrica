interface RateLimitEntry {
  count: number
  resetAt: number
  submissions: number[]
}

export interface RateLimitResult {
  limited: boolean
  resetInSeconds: number
  count: number
}

export interface RateLimiterLike {
  isRateLimited(identifier: string, maxRequests: number, windowMs: number): boolean
  isTooFast(identifier: string, minIntervalMs: number): boolean
  getResetTime(identifier: string): number
  clear(identifier: string): void
  destroy(): void
}

export class InMemoryRateLimiter implements RateLimiterLike {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
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

  isRateLimited(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    if (!entry || entry.resetAt < now) {
      this.store.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
        submissions: [now],
      })
      return false
    }

    entry.submissions.push(now)
    entry.submissions = entry.submissions.filter((ts) => ts > now - windowMs)
    entry.count = entry.submissions.length

    return entry.count > maxRequests
  }

  isTooFast(identifier: string, minIntervalMs: number): boolean {
    const entry = this.store.get(identifier)
    if (!entry || entry.submissions.length < 2) {
      return false
    }

    const submissions = entry.submissions.slice().sort((a, b) => b - a)
    const timeSinceLastSubmission = (submissions[0] ?? 0) - (submissions[1] ?? 0)

    return timeSinceLastSubmission < minIntervalMs
  }

  getResetTime(identifier: string): number {
    const entry = this.store.get(identifier)
    if (!entry) return 0

    const now = Date.now()
    const remaining = Math.max(0, entry.resetAt - now)
    return Math.ceil(remaining / 1000)
  }

  clear(identifier: string): void {
    this.store.delete(identifier)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

export function createInMemoryRateLimiter(): RateLimiterLike {
  return new InMemoryRateLimiter()
}

/**
 * Placeholder for Redis-backed limiter. Unimplemented — apps requiring
 * distributed rate limiting should bring their own Redis client and adapt
 * RateLimiterLike. Kept as a typed factory so the booking server actions can
 * accept whatever limiter an app configures.
 */
export function createRedisRateLimiter(_redisUrl: string): RateLimiterLike {
  throw new Error('createRedisRateLimiter: not implemented — use createInMemoryRateLimiter()')
}

// Singleton instance preserved for backward compatibility with apps/web meeting-action.
export const rateLimiter: RateLimiterLike = new InMemoryRateLimiter()

// Keep class name export for backward compat (type-only usage).
export { InMemoryRateLimiter as RateLimiter }

export const RATE_LIMITS = {
  MEETING_BOOKINGS_PER_HOUR: { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  MEETING_BOOKINGS_PER_EMAIL_PER_DAY: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 },
  MIN_SUBMISSION_INTERVAL: 5 * 60 * 1000,
}

export function getClientIP(headers: Headers): string {
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'

  return ip
}
