# PostHog Setup - Troubleshooting Guide

## ✅ Fixed Issues

This document covers the three main PostHog warnings and how they've been resolved.

---

## 1. ✅ Pageview Events Fixed

### Problem
> "No $pageview or $pageleave events have been received. Web analytics won't work correctly"

### Solution Implemented

**Components Added:**
- `src/components/PostHogPageView.tsx` - Tracks page navigations
- `src/components/PostHogErrorHandler.tsx` - Tracks unhandled errors

**Configuration:**
```typescript
// src/app/providers.tsx
posthog.init({
  capture_pageview: false, // Disabled auto-capture
  capture_pageleave: true, // Enabled pageleave
  autocapture: true, // Full autocapture enabled
})
```

**How it works:**
1. PostHogPageView component tracks every route change in Next.js App Router
2. Sends `$pageview` event with URL, path, and search params
3. Sends `$pageleave` event when user navigates away
4. Wrapped in Suspense to handle Next.js searchParams properly

**To verify it's working:**
1. Visit your site with PostHog API key configured
2. Open browser console (in development mode)
3. Navigate between pages
4. Check PostHog dashboard → Events → Live events
5. You should see `$pageview` events appearing

---

## 2. ✅ LLM Generation Events Fixed

### Problem
> "No LLM generation events have been detected!"

### Solution Implemented

**File Updated:**
- `src/app/api/chat/route.ts` - Added `$ai_generation` event tracking

**LLM Tracking Format:**
```typescript
posthog.capture({
  distinctId: conversationId,
  event: '$ai_generation',
  properties: {
    // Required properties
    $ai_model: 'llama-3.1-8b-instant',
    $ai_model_provider: 'groq',
    $ai_input: userMessage,
    $ai_output: aiResponse,
    $ai_latency_ms: responseTime,
    $ai_input_tokens: promptTokens,
    $ai_output_tokens: completionTokens,
    $ai_total_tokens: totalTokens,
    $ai_temperature: 0.7,
    $ai_max_tokens: 400,
  },
})
```

**What's tracked:**
- Model name and provider
- Input/output (truncated for privacy)
- Token usage (prompt, completion, total)
- Response latency in milliseconds
- Temperature and max tokens settings

**To verify it's working:**
1. Go to /contact page
2. Send a message in the AI chat
3. Check PostHog dashboard → LLM Analytics
4. You should see generation events with token counts and latency

---

## 3. ✅ Exception Tracking Fixed

### Problem
> "No Exception events have been detected!"

### Solution Implemented

**Components Added:**
1. `src/components/PostHogErrorBoundary.tsx` - Catches React errors
2. `src/components/PostHogErrorHandler.tsx` - Catches global errors

**Exception Tracking Format:**
```typescript
posthog.capture('$exception', {
  $exception_type: 'TypeError',
  $exception_message: 'Cannot read property...',
  $exception_stack_trace_raw: error.stack,
  $exception_level: 'error',
  $exception_handled: true/false,
  page: '/contact',
})
```

**Types of errors tracked:**

1. **React Component Errors** (via ErrorBoundary)
   - Rendering errors
   - Lifecycle errors
   - Event handler errors

2. **Unhandled JavaScript Errors** (via window.onerror)
   - Syntax errors
   - Reference errors
   - Type errors

3. **Unhandled Promise Rejections** (via unhandledrejection)
   - Async/await errors
   - Promise chain errors

4. **API Errors** (via chat route)
   - LLM API failures
   - Network errors

**To verify it's working:**

Option 1 - Check existing errors:
```
PostHog dashboard → Error Tracking → View exceptions
```

Option 2 - Test with a manual error (ONLY in dev):
```typescript
// Add temporarily to any page
useEffect(() => {
  throw new Error('Test error for PostHog')
}, [])
```

---

## 🔍 Verification Checklist

### 1. Check Environment Variables

```bash
# Ensure these are set in .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. Verify PostHog Initialization

**In browser console (development mode):**
```javascript
// Should see:
✅ PostHog loaded with comprehensive tracking

// Check PostHog is available:
window.posthog
// Should return PostHog object

// Check if initialized:
window.posthog.isFeatureEnabled
// Should be a function
```

### 3. Check Event Capture

**Live Events View:**
1. Go to PostHog dashboard
2. Navigate to "Events" → "Live events"
3. Keep it open
4. Visit your site and navigate between pages
5. You should see events appearing in real-time:
   - `$pageview` - Every page navigation
   - `$pageleave` - When leaving pages
   - `$autocapture` - Clicks and interactions

### 4. Check LLM Analytics

**After sending a chat message:**
1. Go to PostHog dashboard
2. Navigate to "LLM Analytics"
3. You should see:
   - Generation events
   - Token usage graphs
   - Latency metrics
   - Model/provider breakdown

### 5. Check Error Tracking

**To test (in development only):**

```typescript
// Create a test page: src/app/test-error/page.tsx
export default function TestErrorPage() {
  return (
    <button
      onClick={() => {
        throw new Error('Test error for PostHog')
      }}
    >
      Trigger Test Error
    </button>
  )
}
```

Visit `/test-error` and click the button. Check:
1. PostHog dashboard → Error Tracking
2. Should see the exception with stack trace

---

## 📊 What You Should See Now

### Events Dashboard
- ✅ Pageviews for every route
- ✅ Pageleave events
- ✅ Autocapture events (clicks, forms)
- ✅ Custom events (bookings, payments, etc.)

### LLM Analytics
- ✅ Generation count over time
- ✅ Token usage (input/output/total)
- ✅ Latency distribution
- ✅ Cost estimates (if configured)
- ✅ Model comparison

### Error Tracking
- ✅ Exception count over time
- ✅ Error types distribution
- ✅ Stack traces for debugging
- ✅ Affected users count
- ✅ Page where errors occur

### Session Recordings
- ✅ User session playbacks
- ✅ Mouse movements and clicks
- ✅ Console logs (in recordings)
- ✅ Network requests timeline
- ✅ Performance metrics

---

## 🎯 Key Files Modified

```
src/
├── app/
│   ├── layout.tsx              # Added error boundary & handlers
│   ├── providers.tsx           # Updated PostHog config
│   └── api/
│       └── chat/
│           └── route.ts        # Added LLM tracking
└── components/
    ├── PostHogPageView.tsx     # NEW - Pageview tracking
    ├── PostHogErrorBoundary.tsx # NEW - React error catching
    └── PostHogErrorHandler.tsx  # NEW - Global error catching
```

---

## 🚀 Next Steps

### 1. Create Dashboards

**Recommended dashboards:**

1. **User Behavior**
   - Pageviews by path
   - Session duration
   - User flow (paths)
   - Top entry/exit pages

2. **LLM Performance**
   - Generations per day
   - Average latency
   - Token usage trends
   - Cost tracking

3. **Error Monitoring**
   - Error rate over time
   - Top errors by count
   - Affected users
   - Error distribution by page

4. **Conversion Funnel**
   - Homepage → Contact
   - Chat interaction → Booking
   - Booking → Payment
   - Payment → Completion

### 2. Set Up Alerts

**Recommended alerts:**
- Error rate spike (>10 errors/hour)
- LLM latency high (>3 seconds)
- Session recording failures
- Drop in pageview rate

### 3. Enable Additional Features

**Feature Flags:**
```typescript
import { isFeatureEnabled } from '@/lib/analytics'

if (isFeatureEnabled('new-chat-ui')) {
  // Show new UI
}
```

**A/B Testing:**
```typescript
const variant = posthog.getFeatureFlag('pricing-test')
// Use variant to show different pricing
```

---

## 🐛 Common Issues

### PostHog Not Loading

**Check:**
```javascript
console.log('Key:', process.env.NEXT_PUBLIC_POSTHOG_KEY)
// Should show your API key
```

**Fix:** Ensure `.env.local` has `NEXT_PUBLIC_POSTHOG_KEY`

### Events Not Appearing

**Check:**
1. Browser console for errors
2. Network tab for blocked requests
3. Ad blockers (disable for testing)

**Fix:**
```javascript
// Enable debug mode
posthog.debug()
// Check console for capture logs
```

### Session Recording Not Working

**Check:**
```javascript
posthog.sessionRecordingStarted()
// Should return true
```

**Common causes:**
- Browser extensions blocking
- Privacy settings
- Third-party cookie blocking

**Fix:** Test in incognito mode

### LLM Events Not Showing

**Check:**
1. Chat is actually being used
2. API route is being called
3. No errors in API logs

**Verify:**
```bash
# Check server logs for:
✅ PostHog loaded with comprehensive tracking
```

---

## 📚 Additional Resources

- [PostHog Web Analytics Docs](https://posthog.com/docs/web-analytics)
- [LLM Analytics Guide](https://posthog.com/docs/ai-engineering)
- [Error Tracking Setup](https://posthog.com/docs/error-tracking)
- [Session Recording Best Practices](https://posthog.com/docs/session-replay)

---

## ✅ Summary

All three issues have been resolved:

1. ✅ **Pageview Events** - PostHogPageView component tracks all navigation
2. ✅ **LLM Generation** - Chat API sends $ai_generation events with full metrics
3. ✅ **Exception Tracking** - ErrorBoundary + ErrorHandler catch all errors

Your PostHog setup is now complete and comprehensive! 🎉
