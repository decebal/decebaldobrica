# PostHog Analytics & Session Recording Setup

Complete guide for comprehensive web analytics and session recordings using PostHog.

## 📋 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Features Enabled](#features-enabled)
- [Usage Examples](#usage-examples)
- [Privacy & Security](#privacy--security)
- [Dashboard Setup](#dashboard-setup)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

PostHog is now fully configured with:

- ✅ **Session Recordings** - Visual playback of user sessions
- ✅ **Autocapture** - Automatic tracking of clicks, form submissions, pageviews
- ✅ **Performance Monitoring** - Core Web Vitals (LCP, FID, CLS)
- ✅ **Custom Event Tracking** - Track conversions, errors, user journeys
- ✅ **Privacy Controls** - Input masking and data sanitization

## 🚀 Setup

### 1. Get Your PostHog API Key

1. Sign up at [posthog.com](https://posthog.com) (free tier available)
2. Create a new project
3. Copy your **Project API Key** from Settings → Project → API Keys

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_api_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# For self-hosted PostHog (optional)
# NEXT_PUBLIC_POSTHOG_HOST=https://your-posthog-instance.com
```

### 3. Verify Installation

The setup is already complete! Check the console in development mode to see:

```
✅ PostHog loaded with comprehensive tracking
```

## ✨ Features Enabled

### 1. Session Recordings

**What it captures:**
- Mouse movements, clicks, scrolls
- Page transitions and navigation
- Form interactions (inputs are masked for privacy)
- Console errors and network requests

**Privacy settings:**
- All input fields are automatically masked
- Sensitive data is sanitized
- Email addresses are partially masked (user@***)

### 2. Autocapture Events

Automatically tracks:
- `$pageview` - Page visits
- `$pageleave` - When users leave pages
- `click` - Button and link clicks
- `submit` - Form submissions
- `change` - Input field changes

### 3. Performance Monitoring

Tracks Core Web Vitals:
- **LCP** (Largest Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability

## 📊 Usage Examples

### Basic Event Tracking

```typescript
import { trackEvent } from '@/lib/analytics'

// Track a simple event
trackEvent('button_clicked', {
  button_name: 'Get Started',
  location: 'hero_section',
})
```

### User Journey Tracking

```typescript
import { journeyAnalytics } from '@/lib/analytics'

// Track CTA clicks
journeyAnalytics.ctaClicked('Get Started', 'Hero Section', '/contact')

// Track form submissions
journeyAnalytics.formSubmitted('contact_form', true)

// Track section views
journeyAnalytics.sectionViewed('testimonials', 75)
```

### Conversion Tracking

```typescript
import { conversionAnalytics } from '@/lib/analytics'

// Track booking flow
conversionAnalytics.bookingStarted('Discovery Call', 'homepage_cta')
conversionAnalytics.bookingCompleted('Discovery Call', '2024-01-15', false)

// Track payments
conversionAnalytics.paymentInitiated(0.1, 'SOL', 'Strategy Session')
conversionAnalytics.paymentCompleted(0.1, 'SOL', 'solana', 'tx_abc123')
```

### Error Tracking

```typescript
import { errorAnalytics } from '@/lib/analytics'

try {
  // Your code
} catch (error) {
  errorAnalytics.trackError(error as Error, {
    component: 'BookingForm',
    action: 'submit',
  })
}

// Track API errors
errorAnalytics.trackApiError('/api/booking', 500, 'Internal Server Error', 'POST')
```

### Performance Tracking

```typescript
import { performanceAnalytics } from '@/lib/analytics'

// Track page load
window.addEventListener('load', () => {
  const loadTime = performance.now()
  performanceAnalytics.trackPageLoad(loadTime)
})

// Track Web Vitals (with web-vitals package)
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS((metric) => performanceAnalytics.trackWebVital(metric))
getFID((metric) => performanceAnalytics.trackWebVital(metric))
getLCP((metric) => performanceAnalytics.trackWebVital(metric))
```

### User Identification

```typescript
import { identifyUser, setUserProperties } from '@/lib/analytics'

// Identify user on login
identifyUser('user_123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
})

// Set additional properties
setUserProperties({
  subscription_status: 'active',
  total_bookings: 5,
})
```

### Session Recording Controls

```typescript
import { recordingControls } from '@/lib/analytics'

// Start recording (if needed)
recordingControls.startRecording()

// Stop recording (for privacy-sensitive pages)
recordingControls.stopRecording()

// Mask sensitive elements
recordingControls.maskElement('.credit-card-number')
```

## 🔒 Privacy & Security

### What's Already Protected

1. **Input Masking**: All input fields are automatically masked in recordings
2. **Email Sanitization**: Email addresses are partially masked (user@***)
3. **Data Attributes**: Add `data-private` to any element to mask it:

```html
<div data-private>Sensitive content here</div>
```

4. **Selective Capture**: Use `data-ph-capture` to explicitly mark elements for tracking:

```html
<button data-ph-capture>Track This Button</button>
```

### Additional Privacy Controls

Add to any sensitive form:

```typescript
<form onSubmit={handleSubmit}>
  {/* This entire form is masked in recordings */}
  <input type="text" name="password" /> {/* Auto-masked */}
  <input type="email" name="email" />   {/* Auto-masked */}
</form>
```

## 📈 Dashboard Setup

### 1. Access Your PostHog Dashboard

Visit: `https://app.posthog.com/project/YOUR_PROJECT_ID`

### 2. Key Dashboards to Create

#### User Behavior Dashboard
- Pageviews over time
- Session duration distribution
- Most visited pages
- Navigation paths (User Paths)

#### Conversion Funnel
1. Create a funnel: Insights → New Insight → Funnel
2. Add steps:
   - `$pageview` (any page)
   - `booking_started`
   - `booking_completed`
   - `payment_completed`

#### Performance Dashboard
- Web Vitals trends (LCP, FID, CLS)
- Page load times by page
- Error rates

#### Session Recordings
1. Go to: Session Recordings
2. Filter by:
   - User properties (identified users)
   - Events (e.g., users who clicked "Get Started")
   - Duration (sessions longer than 30s)
   - Console errors

### 3. Useful Filters

**Find problematic sessions:**
```
Filters:
- Console error count > 0
- Session duration > 10s
```

**Conversion sessions:**
```
Filters:
- Events: booking_completed
- Duration: > 30s
```

**Mobile sessions:**
```
Filters:
- Device type: Mobile
```

## 🔍 Monitoring Key Events

### Automatically Tracked Events

| Event | Description | Captured Data |
|-------|-------------|---------------|
| `$pageview` | Page visits | URL, referrer, path |
| `$pageleave` | User leaves page | Duration on page |
| `$autocapture` | Clicks, form submits | Element info, text |
| `web_vital` | Core Web Vitals | LCP, FID, CLS values |

### Custom Events You Can Track

```typescript
// Booking funnel
'booking_started'
'booking_completed'
'payment_initiated'
'payment_completed'

// User engagement
'cta_clicked'
'navigation_clicked'
'section_viewed'
'form_submitted'

// Chat interactions
'chat_conversation_started'
'chat_message_sent'
'chat_meeting_scheduled'

// Errors
'javascript_error'
'api_error'
'chat_error'
```

## 🐛 Troubleshooting

### PostHog Not Loading

**Check the console:**
```javascript
// Should see:
✅ PostHog loaded with comprehensive tracking
```

**Verify environment variables:**
```bash
echo $NEXT_PUBLIC_POSTHOG_KEY
```

**Check browser console:**
```javascript
window.posthog
// Should return PostHog object
```

### Session Recordings Not Working

1. **Check if recording is enabled:**
   ```javascript
   window.posthog.sessionRecordingStarted()
   // Should return true
   ```

2. **Verify you're not in an ad-blocked environment**
   - Try in incognito mode
   - Check browser extensions

3. **Check recording settings in PostHog:**
   - Project Settings → Session Recording
   - Ensure "Enable session recording" is ON

### Events Not Appearing

**Verify event capture:**
```javascript
import { trackEvent } from '@/lib/analytics'

trackEvent('test_event', { test: true })
// Check PostHog dashboard → Events → Live events
```

**Check development mode:**
```javascript
// In dev mode, PostHog has debug mode enabled
// Check console for event capture logs
```

## 📚 Advanced Features

### Feature Flags

```typescript
import { isFeatureEnabled } from '@/lib/analytics'

if (isFeatureEnabled('new-checkout-flow')) {
  // Show new checkout
}
```

### A/B Testing

1. Create a feature flag in PostHog dashboard
2. Add variant logic:

```typescript
import posthog from '@/lib/analytics'

const variant = posthog.getFeatureFlag('pricing-page-variant')

if (variant === 'variant-a') {
  // Show pricing A
} else {
  // Show pricing B
}
```

### Cohort Analysis

Create cohorts in PostHog:
- Users who completed booking
- Users from specific referrer
- High-engagement users (>5 sessions)

## 🎓 Best Practices

1. **Track What Matters**
   - Focus on conversion events
   - Track errors and friction points
   - Monitor key user journeys

2. **Use Descriptive Event Names**
   ```typescript
   // Good
   trackEvent('homepage_hero_cta_clicked')

   // Bad
   trackEvent('click')
   ```

3. **Include Context**
   ```typescript
   trackEvent('form_submitted', {
     form_name: 'contact_form',
     form_location: 'footer',
     success: true,
     fields_filled: 4,
   })
   ```

4. **Respect User Privacy**
   - Always mask sensitive inputs
   - Sanitize PII data
   - Provide opt-out options if required

## 🔗 Useful Links

- [PostHog Documentation](https://posthog.com/docs)
- [Session Recording Guide](https://posthog.com/docs/session-replay)
- [Event Tracking Best Practices](https://posthog.com/docs/product-analytics/capture-events)
- [Privacy & GDPR](https://posthog.com/docs/privacy)

## 🎉 You're All Set!

PostHog is now tracking:
- ✅ Every page view
- ✅ All user interactions (clicks, forms, etc.)
- ✅ Session recordings with privacy protection
- ✅ Performance metrics
- ✅ Custom conversion events

Visit your PostHog dashboard to start analyzing user behavior!
