# Geo-Pricing Implementation Guide

*Implementation Date: 2025-10-09*

## Overview

The geo-pricing system automatically detects user location and displays region-appropriate pricing for consultation services. Users from developing markets are shown a message to contact for adjusted pricing, rather than automatically applying discounts.

## Architecture

### Components

1. **`src/lib/geoPricing.ts`** - Core geo-pricing logic
   - Location detection from headers (Vercel/Cloudflare)
   - Pricing tier calculation
   - Price formatting and currency conversion

2. **`src/lib/meetingPayments.ts`** - Meeting pricing configuration
   - Updated with USD base prices (`priceUSD`)
   - Maintains SOL pricing for crypto payments
   - Meeting descriptions included

3. **`src/app/api/geo-pricing/route.ts`** - API endpoint
   - GET endpoint that detects location from headers
   - Returns location, pricing tier, and adjusted prices
   - Includes discount eligibility message

4. **`src/components/ContactBookingPage.tsx`** - UI integration
   - Fetches geo-pricing on mount
   - Displays location detection
   - Shows discount message for eligible regions
   - Adjusts pricing display based on location

## Pricing Tiers

### Tier 1: Premium Financial Centers (1.5x-2.0x)
- New York, San Francisco, London, Zurich, Singapore, Hong Kong
- Multiplier: 1.6-2.0x base price
- **No discount eligibility** - premium market pricing

### Tier 2: Major Financial Centers (1.2x-1.4x)
- Boston, Chicago, Seattle, Toronto, Frankfurt, Amsterdam, Dublin, Tokyo, Sydney
- Multiplier: 1.2-1.4x base price
- **No discount eligibility** - standard premium pricing

### Tier 3: Emerging Tech Hubs (1.0x)
- Austin, Denver, Miami, Berlin, Barcelona, Tel Aviv, Dubai
- Multiplier: 1.0x base price (default)
- **No discount eligibility** - base pricing applies

### Tier 4: Developing Markets (0.7x-0.9x)
- Eastern Europe, Latin America, Southeast Asia, India
- Multiplier: 0.7-0.9x base price
- **Discount eligible** - Users see message to contact for adjusted pricing

## How It Works

### 1. Location Detection

The system uses HTTP headers provided by hosting platforms:

**Vercel (primary):**
- `x-vercel-ip-country` - Country code (e.g., "US")
- `x-vercel-ip-country-region` - Region/state (e.g., "NY")
- `x-vercel-ip-city` - City name
- `x-vercel-ip-timezone` - User timezone

**Cloudflare (fallback):**
- `cf-ipcountry` - Country code
- `cf-ipcity` - City name
- `cf-region` - Region code
- `cf-timezone` - Timezone

**Local Development:**
- Returns default config (Tier 3, 1.0x multiplier)
- No location-specific pricing applied

### 2. Pricing Calculation

```typescript
// Base pricing (configured in meetingPayments.ts)
const basePrice = 400 // USD for Strategy Session

// User in London (GB-LDN) - Tier 1, multiplier 1.7x
const geoPrice = basePrice * 1.7 = $680

// User in Poland (PL) - Tier 4, multiplier 0.8x
const geoPrice = basePrice * 0.8 = $320
// + Discount message: "Contact us for location-based pricing adjustments"
```

### 3. UI Display

**Premium Markets (Tier 1-3):**
- Price displayed: Geo-adjusted price (e.g., "$680")
- Base price shown: "(base: $400)" if different
- No discount message

**Developing Markets (Tier 4):**
- Price displayed: Geo-adjusted price (e.g., "$320")
- Base price shown: "(base: $400)"
- **Discount message**: "Located in Poland? Contact us for location-based pricing adjustments."

## Meeting Types & Base Pricing

Updated pricing based on market research:

| Meeting Type | Duration | Base USD | Base SOL | Description |
|--------------|----------|----------|----------|-------------|
| Quick Chat | 15 min | $0 | 0 SOL | Free discovery call |
| Discovery Call | 30 min | $150 | 0.7 SOL | Project scoping and feasibility |
| Strategy Session | 60 min | $400 | 1.9 SOL | Architecture review and planning |
| Deep Dive | 90 min | $700 | 3.3 SOL | Comprehensive system review |

**Note:** SOL prices calculated at ~$215/SOL. Update as needed.

## Feature Flag

The geo-pricing system is **always active**. However, paid meetings are controlled by:

```env
NEXT_PUBLIC_ENABLE_PAID_MEETINGS=true
```

- `true` - Shows all meeting types including paid consultations
- `false` - Shows only free meetings (Quick Chat)

## API Endpoint

### GET `/api/geo-pricing`

Returns location-specific pricing information.

**Response:**
```json
{
  "success": true,
  "location": {
    "country": "United Kingdom",
    "city": "London",
    "region": "Europe",
    "detected": {
      "countryCode": "GB",
      "city": "London",
      "timezone": "Europe/London"
    }
  },
  "pricing": {
    "tier": 1,
    "tierName": "Premium Financial Center",
    "currency": "GBP",
    "multiplier": 1.7,
    "description": "Premium market pricing for major financial centers"
  },
  "meetings": [
    {
      "meetingType": "Strategy Session (60 min)",
      "duration": 60,
      "requiresPayment": true,
      "description": "Architecture review, tech stack decisions, and roadmap planning",
      "basePrice": 400,
      "geoPrice": 680,
      "formattedPrice": "£680",
      "priceCrypto": 1.9
    }
  ],
  "discountEligible": false,
  "discountMessage": null
}
```

## Usage

### Client-Side

The ContactBookingPage component automatically fetches geo-pricing:

```typescript
useEffect(() => {
  const fetchGeoPricing = async () => {
    const response = await fetch('/api/geo-pricing')
    const data = await response.json()
    setGeoPricing(data)
  }
  fetchGeoPricing()
}, [])
```

### Server-Side

Use the geoPricing library directly:

```typescript
import { headers } from 'next/headers'
import { detectLocationFromHeaders, getGeoPricingConfig } from '@/lib/geoPricing'

const headersList = await headers()
const location = detectLocationFromHeaders(headersList)
const geoConfig = getGeoPricingConfig(location)
```

## Adding New Locations

### 1. Edit `src/lib/geoPricing.ts`

Add to `GEO_PRICING_MAP`:

```typescript
'US-TX-AUS': { // State-City combo
  region: 'North America',
  city: 'Austin',
  country: 'United States',
  countryCode: 'US',
  multiplier: 1.0,
  currency: 'USD',
  tier: 3,
  tierName: 'Emerging Tech Hub',
  discountEligible: false,
},
```

### 2. Country-Level Fallbacks

For countries without specific regions:

```typescript
// In COUNTRY_FALLBACK_MAP
'BR': {
  region: 'Latin America',
  city: 'Brazil',
  country: 'Brazil',
  countryCode: 'BR',
  multiplier: 0.8,
  currency: 'USD',
  tier: 4,
  tierName: 'Developing Market',
  discountEligible: true,
},
```

## Testing

### Local Development

Headers are not available in local dev. System falls back to:
- Tier 3 (Emerging Tech Hub)
- 1.0x multiplier
- USD currency
- Base pricing displayed

### Production Testing

Deploy and test from different locations:
1. Use VPN to connect from target regions
2. Check location detection accuracy
3. Verify pricing calculations
4. Confirm discount messages display correctly

### Test Locations

Recommended test regions:
- **US (New York)** - Should show 1.8x multiplier, no discount message
- **UK (London)** - Should show 1.7x multiplier, GBP currency
- **Poland** - Should show 0.8x multiplier, discount message
- **Brazil** - Should show 0.8x multiplier, discount message

## Updating Pricing

### To Change Base Prices

Edit `src/lib/meetingPayments.ts`:

```typescript
'Strategy Session (60 min)': {
  meetingType: 'Strategy Session (60 min)',
  price: 1.9, // SOL price
  priceUSD: 400, // Update this
  duration: 60,
  requiresPayment: true,
  description: '...',
},
```

### To Change Multipliers

Edit `src/lib/geoPricing.ts` in `GEO_PRICING_MAP`:

```typescript
'GB-LDN': {
  // ...
  multiplier: 1.7, // Update this
  // ...
},
```

### To Update SOL Conversion

SOL prices are static. To update based on current SOL/USD rate:

```typescript
// In meetingPayments.ts
// Assuming SOL = $215
price: 400 / 215 = 1.86 SOL // Round to 1.9 for simplicity
```

## Discount Contact Flow

When users see the discount message:

1. **User sees**: "Located in Poland? Contact us for location-based pricing adjustments."
2. **User contacts**: discovery@decebaldobrica.com
3. **You review**: Case-by-case assessment
4. **You provide**: Custom quote or booking link

**Benefits:**
- Maintains pricing integrity
- Allows flexibility without devaluing service
- Creates personal touch point
- Opportunity to qualify lead

## Currency Display

The system supports multiple currencies:

- USD ($) - United States, most global regions
- EUR (€) - European Union
- GBP (£) - United Kingdom
- SGD (S$) - Singapore
- JPY (¥) - Japan
- AUD (A$) - Australia

Currency is automatically selected based on detected location.

## Security Considerations

1. **Header Spoofing**: Headers can be spoofed, but:
   - This is for display pricing only
   - Actual payment processing uses fixed crypto amounts
   - Discounts require manual contact/approval

2. **Rate Limiting**: Consider adding rate limiting to `/api/geo-pricing`

3. **Caching**: Consider caching geo-pricing responses (5-minute TTL)

## Troubleshooting

### Location Not Detected

**Symptom:** Shows "Unknown" location
**Cause:** Missing geo headers (local dev or proxy)
**Solution:** Falls back to default pricing (1.0x multiplier)

### Incorrect Pricing

**Symptom:** Pricing doesn't match expected tier
**Cause:** Location mapped to wrong tier
**Solution:** Check `GEO_PRICING_MAP` and `COUNTRY_FALLBACK_MAP`

### Discount Message Not Showing

**Symptom:** Tier 4 users don't see discount message
**Cause:** `discountEligible: false` in config
**Solution:** Set `discountEligible: true` for that location

## Future Enhancements

Possible improvements:

1. **Automatic Currency Conversion**: Use live exchange rates API
2. **IP Geolocation API**: Fallback when headers unavailable (ipapi.co, ipinfo.io)
3. **A/B Testing**: Test different pricing strategies
4. **Analytics**: Track conversion rates by region
5. **Promo Codes**: Add discount code system
6. **Dynamic Multipliers**: Adjust based on demand/competition

## Related Documentation

- [Pricing Research](./PRICING_RESEARCH.md) - Market rate analysis
- [Video Recording Software](./VIDEO_RECORDING_SOFTWARE.md) - Homepage video guide
- [Homepage Video Script](./HOMEPAGE_VIDEO_SCRIPT.md) - Video content
- [Crypto Payments](./CRYPTO_PAYMENTS.md) - Payment integration

---

*For questions or issues, contact: decebal@dobrica.dev*
