# PostHog Feature Flags Setup

This project uses PostHog for dynamic feature flag management, allowing you to enable/disable features without deploying code changes.

## Overview

We've migrated from environment variable-based feature flags to PostHog feature flags for better flexibility and runtime control.

**Benefits:**
- ✅ Enable/disable features without code deployments
- ✅ Gradual rollouts (e.g., 10% of users → 50% → 100%)
- ✅ User targeting (by location, device, user properties)
- ✅ A/B testing capabilities
- ✅ Real-time changes via PostHog dashboard

## Available Feature Flags

| Flag Key | Description | Default | Environment Fallback |
|----------|-------------|---------|---------------------|
| `enable-paid-meetings` | Show paid meeting options | `false` | `NEXT_PUBLIC_ENABLE_PAID_MEETINGS` |
| `enable-homepage-video` | Show video player on homepage | `false` | `NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO` |
| `premium-subscriptions-enabled` | Enable premium newsletter subscriptions | `false` | `NEXT_PUBLIC_PREMIUM_SUBSCRIPTIONS_ENABLED` |
| `founding-member-enabled` | Enable founding member subscriptions | `false` | `NEXT_PUBLIC_FOUNDING_MEMBER_ENABLED` |

## Usage in Code

### Client Components (React)

Use the `useFeatureFlag` hook for client-side feature flags:

```tsx
import { useFeatureFlag, FEATURE_FLAGS } from '@/hooks/useFeatureFlag'

function MyComponent() {
  const isPaidMeetingsEnabled = useFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)

  return (
    <div>
      {isPaidMeetingsEnabled ? (
        <PaidMeetingOption />
      ) : (
        <FreeMeetingOption />
      )}
    </div>
  )
}
```

### Multiple Flags at Once

```tsx
import { useAllFeatureFlags } from '@/hooks/useFeatureFlag'

function Dashboard() {
  const flags = useAllFeatureFlags()

  return (
    <div>
      {flags.isPaidMeetingsEnabled && <PaidFeatures />}
      {flags.isHomepageVideoEnabled && <VideoPlayer />}
      {flags.isPremiumSubscriptionsEnabled && <PremiumTier />}
    </div>
  )
}
```

### Server Components (SSR/SSG)

For server components, use the environment variable fallback:

```tsx
import { getServerFeatureFlag, FEATURE_FLAGS } from '@/hooks/useFeatureFlag'

async function ServerComponent() {
  const isPaidMeetingsEnabled = getServerFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)

  return (
    <div>
      {isPaidMeetingsEnabled ? <PaidOptions /> : <FreeOptions />}
    </div>
  )
}
```

## Setting Up Feature Flags in PostHog

### 1. Access PostHog Dashboard

1. Log in to your PostHog account
2. Navigate to **Feature Flags** in the left sidebar
3. Click **New Feature Flag**

### 2. Create Each Feature Flag

For each flag in the table above, create a new feature flag with these settings:

#### Example: Enable Paid Meetings

**Flag Key:** `enable-paid-meetings` (must match exactly!)

**Name:** Enable Paid Meetings

**Description:** Controls whether paid meeting options are shown to users

**Release Conditions:**
- **Option 1: Everyone** - Turn on for 100% of users
- **Option 2: Gradual Rollout** - Start with 10%, increase gradually
- **Option 3: Specific Users** - Target by location, device, or custom properties

**Recommended Settings:**
```
Release conditions:
- Roll out to 100% of users
```

**Payload (Optional):**
```json
{
  "enabled": true
}
```

### 3. Repeat for All Flags

Create flags for:
1. `enable-paid-meetings`
2. `enable-homepage-video`
3. `premium-subscriptions-enabled`
4. `founding-member-enabled`

## Testing Feature Flags

### Local Development

1. **Set Environment Variables** (fallback for SSR):
   ```env
   # .env.local
   NEXT_PUBLIC_ENABLE_PAID_MEETINGS=true
   NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO=false
   NEXT_PUBLIC_PREMIUM_SUBSCRIPTIONS_ENABLED=false
   NEXT_PUBLIC_FOUNDING_MEMBER_ENABLED=false
   ```

2. **Enable in PostHog** (for client-side):
   - Go to PostHog dashboard
   - Enable the flag for your user email or 100% of users
   - Changes reflect immediately in the browser

3. **Test Both States**:
   ```tsx
   // In development, you can override flags in PostHog toolbar
   // Press 'Option+P' to open the toolbar
   // Navigate to Feature Flags tab
   // Toggle flags on/off
   ```

### Production

1. **Start with 0% rollout**:
   - Create flag in PostHog
   - Set to 0% initially
   - Test with your own user email

2. **Gradual Rollout**:
   ```
   Day 1: 10% of users
   Day 3: 25% of users
   Day 5: 50% of users
   Day 7: 100% of users
   ```

3. **Monitor in PostHog**:
   - Track usage with PostHog events
   - Monitor error rates
   - Rollback instantly if needed

## Advanced Usage

### Targeting Specific Users

```typescript
// PostHog dashboard:
// Release conditions → Add condition
// Property: email
// Operator: equals
// Value: user@example.com
```

### Geographic Rollout

```typescript
// PostHog dashboard:
// Release conditions → Add condition
// Property: $geoip_country_code
// Operator: equals
// Value: US
```

### A/B Testing

Create two flags for different variants:

```tsx
const showVariantA = useFeatureFlag('pricing-variant-a')
const showVariantB = useFeatureFlag('pricing-variant-b')

if (showVariantA) return <PricingA />
if (showVariantB) return <PricingB />
return <DefaultPricing />
```

## Migration from Environment Variables

The old `featureFlags.ts` file is now deprecated but remains for backwards compatibility. Components have been updated to use the new PostHog hooks.

### Before (Deprecated)

```tsx
import { featureFlags } from '@/lib/featureFlags'

// Static, requires redeployment to change
if (featureFlags.enablePaidMeetings) {
  // ...
}
```

### After (Current)

```tsx
import { useFeatureFlag, FEATURE_FLAGS } from '@/hooks/useFeatureFlag'

// Dynamic, changes instantly via PostHog
const isPaidMeetingsEnabled = useFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)

if (isPaidMeetingsEnabled) {
  // ...
}
```

## Fallback Behavior

Feature flags gracefully fall back to environment variables when:
- PostHog is not initialized
- User is offline
- SSR/SSG rendering (server-side)

```typescript
// Client-side: Uses PostHog
useFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)
// ↑ Checks PostHog first, falls back to env var if unavailable

// Server-side: Uses environment variable
getServerFeatureFlag(FEATURE_FLAGS.ENABLE_PAID_MEETINGS)
// ↑ Only checks environment variable (SSR/SSG compatible)
```

## Best Practices

1. **Always set environment variables** as fallbacks for SSR
2. **Start with 0% rollout** in production
3. **Monitor PostHog events** for flag usage
4. **Use descriptive flag names** that match feature purpose
5. **Document flag purpose** in PostHog description
6. **Clean up unused flags** regularly
7. **Test both enabled and disabled states** before deploying

## Troubleshooting

### Flag not updating in browser?

- Clear PostHog cache: `localStorage.removeItem('ph_feature_flags')`
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check PostHog console: `posthog.isFeatureEnabled('flag-name')`

### Flag works in dev but not production?

- Verify PostHog API key is set in production
- Check environment variables are set
- Ensure flag is enabled for production environment

### SSR/SSG not reflecting flag changes?

- Server components use environment variables (static)
- For dynamic SSR, use API routes to check flags server-side
- Consider making the component client-side if it needs real-time updates

## Resources

- [PostHog Feature Flags Documentation](https://posthog.com/docs/feature-flags)
- [PostHog React SDK](https://posthog.com/docs/libraries/react)
- [Feature Flag Best Practices](https://posthog.com/docs/feature-flags/best-practices)

## Support

If you encounter issues with feature flags:
1. Check PostHog status page
2. Verify environment variables are set correctly
3. Test in PostHog console: `posthog.debug()`
4. Check browser console for errors
