// Email validation utility to detect disposable/temporary email providers

// Common disposable email domains - update this list as needed
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular disposable email services
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'spam4.me',
  'tempmail.com',
  'temp-mail.org',
  'throwaway.email',
  'maildrop.cc',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'trashmail.com',
  'trashmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'getnada.com',
  'getairmail.com',
  'dispostable.com',
  'mintemail.com',
  'emailondeck.com',
  'fakeinbox.com',
  'mohmal.com',
  'mytrashmail.com',
  'temp-mail.io',
  'tempr.email',
  'tmpmail.net',
  'tmpmail.org',
  'emailtemporanea.com',
  'emailtemporanea.net',
  'emailtemporaire.com',
  'tempinbox.com',
  'throwawaymail.com',
  'burnermail.io',
  'spambox.us',
  'spamgourmet.com',
  'mailnesia.com',
  'mailin8r.com',
  'luxusmail.org',
  'guerrillamail.info',
  'guerrillamail.biz',
  'spam.la',
  'sharklasers.com',
  'guerrillamailblock.com',
  'mvrht.com',
  'trbvm.com',
  'grr.la',
  'spamfree24.org',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.net',
  'spamfree24.com',
  'spamfree.eu',
  'maildrop.gq',
  'maildrop.cf',
  'maildrop.ml',
  'maildrop.ga',
])

// Suspicious patterns in emails that might indicate a bot
const SUSPICIOUS_PATTERNS = [
  /^[a-z]{10,}@/, // Long random lowercase string
  /^\d{8,}@/, // Long number sequences
  /^test\d+@/i, // test1, test2, etc.
  /^user\d+@/i, // user1, user2, etc.
  /^spam@/i,
  /^fake@/i,
  /^temp@/i,
  /^throwaway@/i,
  /^disposable@/i,
  /^noreply@/i,
]

/**
 * Check if an email uses a disposable email provider
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false

  return DISPOSABLE_EMAIL_DOMAINS.has(domain)
}

/**
 * Check if an email matches suspicious patterns
 */
export function hasSuspiciousPattern(email: string): boolean {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(email))
}

/**
 * Comprehensive email validation
 * @returns object with isValid and reason
 */
export function validateEmail(email: string): { isValid: boolean; reason?: string } {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, reason: 'Invalid email format' }
  }

  // Check for disposable email
  if (isDisposableEmail(email)) {
    return { isValid: false, reason: 'Disposable email addresses are not allowed' }
  }

  // Check for suspicious patterns
  if (hasSuspiciousPattern(email)) {
    return { isValid: false, reason: 'Email address appears suspicious' }
  }

  return { isValid: true }
}

/**
 * Check if a name appears fake or bot-generated
 */
export function hasSuspiciousName(name: string): boolean {
  if (!name || name.trim().length < 2) {
    return true
  }

  const trimmedName = name.trim().toLowerCase()

  // Check for common bot patterns
  const suspiciousNamePatterns = [
    /^test\s*(user|account)?$/i,
    /^user\d+$/i,
    /^admin$/i,
    /^[a-z]{20,}$/i, // Very long single word
    /^[a-z]\s[a-z]$/i, // Single letter first and last name
    /^asdf/i,
    /^qwerty/i,
    /^fake/i,
    /^spam/i,
    /^bot/i,
    /^\d+$/i, // Only numbers
  ]

  return suspiciousNamePatterns.some((pattern) => pattern.test(trimmedName))
}

/**
 * Validate booking form data for bot-like behavior
 */
export interface BookingData {
  name: string
  email: string
  notes?: string
}

export function validateBookingData(data: BookingData): { isValid: boolean; reason?: string } {
  // Check name
  if (hasSuspiciousName(data.name)) {
    return { isValid: false, reason: 'Name appears invalid or suspicious' }
  }

  // Check email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    return emailValidation
  }

  // Check if notes are suspiciously similar to spam
  if (data.notes) {
    const notes = data.notes.toLowerCase()
    const spamIndicators = [
      'click here',
      'buy now',
      'limited time',
      'act now',
      'viagra',
      'casino',
      'lottery',
      'winner',
      'congratulations',
      'http://',
      'https://',
      'www.',
    ]

    if (spamIndicators.some((indicator) => notes.includes(indicator))) {
      return { isValid: false, reason: 'Message contains suspicious content' }
    }
  }

  return { isValid: true }
}
