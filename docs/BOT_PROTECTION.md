# Bot Protection for Meeting Bookings

This document outlines the comprehensive bot protection system implemented for the meeting booking form.

## Overview

The bot protection system uses multiple layers of defense to prevent automated spam bookings:

1. **Cloudflare Turnstile CAPTCHA** - Visual verification challenge
2. **Rate Limiting** - Limits booking attempts by IP and email
3. **Honeypot Fields** - Hidden fields that bots fill but humans don't see
4. **Timing Analysis** - Detects forms filled too quickly
5. **Email Validation** - Blocks disposable email providers and suspicious patterns
6. **Name Validation** - Detects fake or bot-generated names
7. **Content Analysis** - Scans notes field for spam indicators

## Setup

### 1. Cloudflare Turnstile (Recommended)

Turnstile is Cloudflare's free, privacy-friendly CAPTCHA alternative.

**Get your keys:**
1. Go to https://dash.cloudflare.com/
2. Navigate to Turnstile section
3. Create a new site
4. Copy the Site Key and Secret Key

**Add to .env:**
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here
```

**Features:**
- Free for unlimited use
- Privacy-friendly (no tracking)
- Dark theme support
- Invisible mode available
- Works on all devices

**Testing:**
- Use test keys for development (see Cloudflare docs)
- Production keys work only on registered domains

### 2. Rate Limiting

Rate limiting is automatically enabled and configured in `src/lib/rateLimit.ts`.

**Default limits:**
- **3 bookings per hour** per IP address
- **5 bookings per day** per email address
- **5 minutes minimum** between submissions from same IP

**Customize limits:**
Edit `RATE_LIMITS` in `src/lib/rateLimit.ts`:

```typescript
export const RATE_LIMITS = {
  MEETING_BOOKINGS_PER_HOUR: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000
  },
  MEETING_BOOKINGS_PER_EMAIL_PER_DAY: {
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000
  },
  MIN_SUBMISSION_INTERVAL: 5 * 60 * 1000,
}
```

**Production considerations:**
- Current implementation uses in-memory storage
- For multi-instance deployments, consider Redis
- Storage automatically cleans up expired entries

### 3. Email Validation

Blocks disposable email providers and suspicious patterns.

**Blocked email providers (50+ domains):**
- 10minutemail.com
- guerrillamail.com
- tempmail.com
- yopmail.com
- mailinator.com
- And many more...

**Add more domains:**
Edit `DISPOSABLE_EMAIL_DOMAINS` in `src/lib/emailValidation.ts`:

```typescript
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Add your domains here
  'spam-domain.com',
  'another-temp-mail.com',
])
```

**Suspicious patterns detected:**
- Long random strings (e.g., `abcdefghijk@example.com`)
- Test accounts (e.g., `test123@example.com`)
- Generic usernames (e.g., `user456@example.com`)
- Spam-related strings

### 4. Name Validation

Detects fake or bot-generated names:
- Single letter names
- All numbers
- Common test patterns (test, admin, user123)
- Very long single words
- Known spam patterns

### 5. Honeypot Field

Hidden field that bots fill but humans never see:
- Positioned off-screen with CSS
- Has `tabIndex={-1}` to prevent keyboard focus
- Has `aria-hidden="true"` for screen readers
- Any value in this field = instant rejection

### 6. Timing Analysis

Tracks how long it takes to fill the form:
- Minimum 5 seconds required
- Timer starts when meeting type is selected
- Too fast = likely bot

**Customize timing:**
Edit the check in `src/actions/meeting-action.ts`:

```typescript
const minTimeMs = 5000 // Change this value (milliseconds)
```

## How It Works

### Client-side Flow

1. User selects meeting type → timer starts
2. User fills form fields
3. Turnstile widget loads (if enabled)
4. User completes CAPTCHA
5. Form submits with:
   - Form data
   - Turnstile token
   - Start timestamp
   - Honeypot value

### Server-side Flow

All checks happen in `src/actions/meeting-action.ts`:

1. **Honeypot check** - Instant rejection if filled
2. **Timing check** - Reject if too fast
3. **Email/name validation** - Check for suspicious patterns
4. **IP rate limiting** - Check booking attempts per hour
5. **Email rate limiting** - Check bookings per day
6. **Submission frequency** - Check time since last submission
7. **Turnstile verification** - Verify CAPTCHA with Cloudflare

If any check fails, the booking is rejected with an appropriate error message.

## Error Messages

The system provides user-friendly error messages:

- **Honeypot triggered**: "Unable to process request at this time" (vague on purpose)
- **Too fast**: "Please take your time filling out the form"
- **Disposable email**: "Disposable email addresses are not allowed"
- **Suspicious name**: "Name appears invalid or suspicious"
- **Rate limited (IP)**: "Too many booking attempts. Please try again in X seconds"
- **Rate limited (email)**: "This email has too many pending bookings. Please try again in X hours"
- **Too frequent**: "Please wait a few minutes before submitting another booking"
- **CAPTCHA failed**: "CAPTCHA verification failed. Please try again"

## Testing

### Test legitimate bookings:
1. Fill form normally (take at least 5 seconds)
2. Use real email address
3. Complete CAPTCHA (if enabled)
4. Should succeed

### Test bot detection:

**Honeypot:**
- Open browser dev tools
- Fill the hidden "website" field
- Submit → should be rejected silently

**Timing:**
- Fill form very quickly (< 5 seconds)
- Submit → "Please take your time" error

**Disposable email:**
- Use `test@guerrillamail.com`
- Submit → "Disposable email addresses are not allowed"

**Rate limiting:**
- Submit 4 bookings within an hour
- 4th attempt → rate limit error

## Monitoring

All bot detection events are logged with the `🛡️` emoji:

```
🛡️ Bot detected via honeypot from IP: 192.168.1.1
🛡️ Bot detected - form filled too fast (2000ms) from IP: 192.168.1.1
🛡️ Suspicious data detected from IP: 192.168.1.1 - Disposable email addresses are not allowed
🛡️ Rate limit exceeded for IP: 192.168.1.1
🛡️ Invalid Turnstile token from IP: 192.168.1.1
```

**Recommended monitoring:**
- Set up log aggregation (e.g., Datadog, LogDNA)
- Create alerts for high bot detection rates
- Track patterns to identify attack sources
- Review logs regularly for new bot behaviors

## Production Checklist

Before deploying to production:

- [ ] Set up Cloudflare Turnstile account
- [ ] Add Turnstile keys to production environment variables
- [ ] Test CAPTCHA on production domain
- [ ] Review rate limiting thresholds
- [ ] Add any additional disposable email domains specific to your region
- [ ] Set up log monitoring for bot detection events
- [ ] Test all protection layers work correctly
- [ ] Document incident response process
- [ ] Consider IP allowlist for trusted sources (if needed)

## Advanced Configuration

### Disable CAPTCHA for Testing

Simply don't set the Turnstile environment variables. The system will work without CAPTCHA but with all other protections active.

### IP Allowlist

To allow certain IPs to bypass rate limiting (e.g., internal testing):

Edit `src/lib/rateLimit.ts`:

```typescript
const ALLOWLISTED_IPS = new Set(['1.2.3.4', '5.6.7.8'])

export function isRateLimited(identifier: string, ...args) {
  if (ALLOWLISTED_IPS.has(identifier)) {
    return false
  }
  // ... rest of logic
}
```

### Custom Error Responses

For additional security, you can make all bot rejections return the same vague message:

```typescript
// In meeting-action.ts
if (botDetected) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    success: false,
    error: 'Unable to process request at this time',
  }
}
```

This prevents bots from learning which detection method caught them.

## Troubleshooting

### Turnstile not showing
- Check `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
- Verify site key matches your domain
- Check browser console for errors
- Ensure domain is registered in Cloudflare dashboard

### Legitimate users getting blocked
- Review rate limiting thresholds (may be too strict)
- Check if their email domain is in disposable list
- Verify timing threshold (5 seconds may be too short for some users)
- Check if IP is being shared (corporate NAT, VPN)

### Rate limiter not working
- Confirm server action is being called
- Check IP extraction is working (`getClientIP` function)
- Verify rate limit storage isn't being cleared too often
- For production, consider persistent storage (Redis)

## Future Enhancements

Potential improvements to consider:

1. **Machine Learning** - Train model on booking patterns
2. **Behavioral Analysis** - Track mouse movements, keystrokes
3. **Reputation Scoring** - Score IPs/emails based on history
4. **Geographic Restrictions** - Block/allow specific countries
5. **Time-based Rules** - Different limits for different times
6. **Redis Storage** - For distributed rate limiting
7. **Webhook Notifications** - Alert on high bot activity
8. **Admin Dashboard** - View and manage blocked IPs/emails

## References

- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [OWASP Bot Management](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
