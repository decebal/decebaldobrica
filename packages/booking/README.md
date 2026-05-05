# @decebal/booking

Shared booking flow used by `apps/web` and `apps/wolventech`. Exposes the
`ContactBookingPage` UI component, server-action factories for meeting
booking/availability/geo-pricing, and the supporting Google Calendar,
Resend, rate-limiter, and Turnstile wrappers.

All server-side integrations are dependency-injected via a `BookingContext`
so each consuming app brings its own credentials and identity.

## Exported subpaths

| Subpath | Purpose |
|---|---|
| `@decebal/booking/ContactBookingPage` | Full booking page component (client). Props: `bookingAction`, `chatConfig`, `enablePayments`, `theme`, `footer`, `referralCategoryDefault`, `className`. |
| `@decebal/booking/chat` | `ChatInterfaceAI` + `ChatMessage`. Parameterized `apiUrl`, `initialGreeting`, `placeholder`, `suggestions`, `subtitle`, `className`. |
| `@decebal/booking/config` | `MEETING_TYPES`, `formatPrice`, `Currency`, `PaymentConfig`, `MeetingType` and shared pricing types. |
| `@decebal/booking/client/useFeatureFlag` | `useFeatureFlag`, `useAllFeatureFlags`, `getServerFeatureFlag`, `FEATURE_FLAGS`. PostHog-backed with env fallback. |
| `@decebal/booking/lib/referral` | `setReferralData`, `getReferralData`, `clearReferralData`, `formatReferralData`. localStorage-backed, 24h expiry. |
| `@decebal/booking/server/context` | `BookingContext`, `BookingContextConfig` types. |
| `@decebal/booking/server/calendar` | `GoogleCalendarClient` class, `buildCalendarClientFromEnv()`, backward-compat function wrappers. |
| `@decebal/booking/server/email` | `EmailSender` interface, `createResendEmailSender(config)` factory. Renderers injected per app. |
| `@decebal/booking/server/rate-limit` | `RateLimiterLike` interface, `InMemoryRateLimiter`, `rateLimiter` singleton, `RATE_LIMITS`, `getClientIP`. |
| `@decebal/booking/server/turnstile` | `TurnstileVerifier` interface + `createTurnstileVerifier(secretKey)` factory. |
| `@decebal/booking/server/meeting` | `createMeetingActions(ctx)` → `{ bookMeeting, cancelMeeting, getAvailableSlots, rescheduleMeeting }`. |
| `@decebal/booking/server/availability` | `createAvailabilityHandler(ctx)`: Next.js App Router POST handler factory. |
| `@decebal/booking/server/geo-pricing` | `createGeoPricingHandler()`: GET handler factory, plus pure geo-pricing helpers. |

## Env var matrix

### Required by both apps (shared)

```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
GOOGLE_REFRESH_TOKEN
CALENDAR_OWNER_EMAIL

RESEND_API_KEY
EMAIL_FROM
EMAIL_REPLY_TO

TURNSTILE_SECRET_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY

NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

### Optional — AI chat sidebar

Only when `<ContactBookingPage chatConfig={{ enabled: true }} />`.

```
GROQ_API_KEY
```

### Optional — Paid meetings (Solana Pay)

Only when `<ContactBookingPage enablePayments={true} />`. apps/web owns the
payment flow today; apps/wolventech passes `enablePayments={false}`.

```
SOLANA_RPC_URL
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Feature flags (env fallback used when PostHog is unreachable)

```
NEXT_PUBLIC_ENABLE_PAID_MEETINGS
NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO
NEXT_PUBLIC_PREMIUM_SUBSCRIPTIONS_ENABLED
NEXT_PUBLIC_FOUNDING_MEMBER_ENABLED
```

## Constructing a BookingContext

```ts
// apps/<app>/src/lib/bookingContext.ts
import { buildCalendarClientFromEnv } from '@decebal/booking/server/calendar'
import type { BookingContext } from '@decebal/booking/server/context'
import { createResendEmailSender } from '@decebal/booking/server/email'
import { rateLimiter } from '@decebal/booking/server/rate-limit'
import { createTurnstileVerifier } from '@decebal/booking/server/turnstile'

export function buildBookingContextFromEnv(): BookingContext {
  return {
    calendar: buildCalendarClientFromEnv(),
    email: createResendEmailSender({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM!,
      replyTo: process.env.EMAIL_REPLY_TO,
      renderConfirmation: (args) => ({
        subject: `Confirmed: ${args.meetingType}`,
        html: `<p>Hi ${args.contactName}, see you at ${args.meetingDate}.</p>`,
        text: `Confirmed: ${args.meetingType} at ${args.meetingDate}`,
      }),
    }),
    rateLimiter,
    turnstile: createTurnstileVerifier(process.env.TURNSTILE_SECRET_KEY),
    config: {
      ownerEmail: process.env.CALENDAR_OWNER_EMAIL!,
      fromAddress: process.env.EMAIL_FROM!,
      replyTo: process.env.EMAIL_REPLY_TO,
      timeZone: 'Europe/London',
      appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    },
  }
}
```

```ts
// apps/<app>/src/actions/meeting-action.ts
'use server'
import { buildBookingContextFromEnv } from '@/lib/bookingContext'
import { createMeetingActions } from '@decebal/booking/server/meeting'

const actions = createMeetingActions(buildBookingContextFromEnv())
export const bookMeeting = actions.bookMeeting
export const cancelMeeting = actions.cancelMeeting
export const getAvailableSlots = actions.getAvailableSlots
export const rescheduleMeeting = actions.rescheduleMeeting
```

```ts
// apps/<app>/src/app/api/availability/route.ts
import { buildBookingContextFromEnv } from '@/lib/bookingContext'
import { createAvailabilityHandler } from '@decebal/booking/server/availability'
export const POST = createAvailabilityHandler(buildBookingContextFromEnv())

// apps/<app>/src/app/api/geo-pricing/route.ts
import { createGeoPricingHandler } from '@decebal/booking/server/geo-pricing'
export const GET = createGeoPricingHandler()
```

```tsx
// apps/<app>/src/app/contact/page.tsx
import { bookMeeting } from '@/actions/meeting-action'
import Footer from '@/components/Footer'
import ContactBookingPage from '@decebal/booking/ContactBookingPage'

export default function ContactPage() {
  return (
    <ContactBookingPage
      bookingAction={bookMeeting}
      theme="rust"              // or "default"
      enablePayments={false}
      chatConfig={{ enabled: false }}
      footer={<Footer />}
    />
  )
}
```

## Tailwind integration

Both consuming apps must add `packages/booking/src` to their Tailwind
`content` globs so `brand-*` utility classes inside `ContactBookingPage` are
compiled with each app's own color tokens. `apps/web` maps `brand-teal` to
`#03c9a9` (teal); `apps/wolventech` maps `brand-teal` to `#ce422b` (rust) —
so the `theme` prop is a per-app Tailwind remap, not a runtime branch.

```ts
content: [
  './src/**/*.{ts,tsx}',
  '../../packages/ui/src/**/*.{ts,tsx}',
  '../../packages/booking/src/**/*.{ts,tsx}',
],
```
