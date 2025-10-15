/**
 * Referral tracking utilities
 * Tracks where users came from before booking a session
 */

export interface ReferralData {
  category: string
  source?: string // e.g., blog post title, page name, etc.
  timestamp: number
}

const STORAGE_KEY = 'booking_referral'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Store referral data in localStorage
 */
export function setReferralData(category: string, source?: string): void {
  if (typeof window === 'undefined') return

  const data: ReferralData = {
    category,
    source,
    timestamp: Date.now(),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to store referral data:', error)
  }
}

/**
 * Get referral data from localStorage
 * Returns null if expired or not found
 */
export function getReferralData(): ReferralData | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const data: ReferralData = JSON.parse(stored)

    // Check if expired
    if (Date.now() - data.timestamp > MAX_AGE_MS) {
      clearReferralData()
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to get referral data:', error)
    return null
  }
}

/**
 * Clear referral data from localStorage
 */
export function clearReferralData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear referral data:', error)
  }
}

/**
 * Format referral data for display or submission
 */
export function formatReferralData(data: ReferralData | null): string {
  if (!data) return ''

  if (data.source) {
    return `${data.category} - ${data.source}`
  }

  return data.category
}
