# Newsletter Premium Subscriptions - Crypto Payment Implementation

**Status:** Phase 3 - Premium Subscriptions with Multi-Chain Crypto + Fiat Support
**Updated:** October 16, 2025

## Overview

This document outlines the implementation of premium newsletter subscriptions using cryptocurrency payments (Solana, Ethereum, Bitcoin) with fiat currency support (GBP, USD) via crypto on-ramps.

## Pricing Tiers

### Free Tier (Default)
- **Price:** $0/month
- **Features:**
  - Weekly newsletter
  - Basic articles and insights
  - No credit card required
  - Unsubscribe anytime

### Premium Tier
- **Price:** $14.99/month or $149.90/year (save 17%)
- **Crypto equivalent:** ~0.065 SOL, 0.0075 ETH, 0.00033 BTC, 15 USDC (monthly)
- **Features:**
  - Everything in Free
  - Exclusive deep dives and tutorials
  - Code examples and templates
  - Early access to new content
  - Priority email support
  - Ad-free experience

### Founding Member Tier
- **Price:** $300/year (one-time, lifetime access)
- **Crypto equivalent:** ~1.3 SOL, 0.15 ETH, 0.0067 BTC, 300 USDC
- **Features:**
  - Everything in Premium
  - Lifetime access (never expires)
  - Direct 1-on-1 Q&A access
  - Name in supporters list (optional)
  - Exclusive founding member community
  - Input on content roadmap

## Supported Payment Methods

### Cryptocurrency (Primary)

1. **Solana (SOL)** - Recommended for small transactions
   - Network: Solana mainnet
   - Fees: <$0.001
   - Confirmation: ~1 second
   - Best for: Monthly subscriptions

2. **Ethereum (ETH)** - Layer 2 networks
   - Networks: Arbitrum, Base, Polygon
   - Fees: $0.01-$0.50
   - Confirmation: 1-5 minutes
   - Best for: Annual subscriptions

3. **Bitcoin (BTC)** - Lightning Network
   - Network: Lightning Network (recommended) or on-chain
   - Fees: <$0.01 (Lightning) or $1-5 (on-chain)
   - Confirmation: Instant (Lightning) or 10-60 min (on-chain)
   - Best for: Annual subscriptions, larger amounts

4. **USDC** - Stablecoin (pegged to USD)
   - Networks: Polygon, Base, Ethereum
   - Fees: $0.01-$0.10
   - Confirmation: 1-5 minutes
   - Best for: Price stability, all subscription types

### Fiat Currency Support (via Crypto On-Ramps)

**Supported Fiat Currencies:**
- USD (United States Dollar)
- GBP (British Pound Sterling)
- EUR (Euro)
- More available through payment processor

**On-Ramp Integration: NOWPayments**
- Users can pay with fiat (card/bank transfer)
- Automatically converted to crypto
- Sent to merchant wallet
- Fees: 0.5-1% + payment processor fees (~3%)
- Total fees: ~3.5-4% (still better than Stripe for crypto users)

## Payment Architecture

### Option A: NOWPayments (Recommended for MVP)

**Pros:**
- Supports 200+ cryptocurrencies including BTC, ETH, SOL, USDC
- Fiat on-ramp built-in (USD, GBP, EUR via card/bank)
- Lightning Network support
- Auto-conversion available
- Easy API integration
- Webhook notifications
- Payment links & hosted checkout
- Multi-currency invoicing

**Cons:**
- 0.5-1% fees (still low)
- Custodial (they hold funds briefly)
- KYC may be required for large volumes

**Implementation:**
```typescript
// packages/payments/src/nowpayments.ts
import { NOWPayments } from '@nowpayments/nowpayments-api-js'

const nowPayments = new NOWPayments({ apiKey: process.env.NOWPAYMENTS_API_KEY })

// Create payment for newsletter subscription
const payment = await nowPayments.createPayment({
  price_amount: 14.99,
  price_currency: 'usd',
  pay_currency: 'sol', // or btc, eth, usdc
  ipn_callback_url: 'https://yoursite.com/api/webhooks/nowpayments',
  order_id: `newsletter-premium-${subscriberId}`,
  order_description: 'Premium Newsletter Subscription - Monthly',
})
```

### Option B: Multi-Provider Approach

**For maximum flexibility:**
- Solana Pay for SOL (direct, 0% fees)
- NOWPayments for BTC, ETH, USDC + fiat
- Stripe for pure fiat (fallback)

**Benefits:**
- Lowest fees possible (0% for SOL)
- More control over Solana payments
- Fiat fallback for non-crypto users

**Complexity:**
- More integration work
- Multiple webhook handlers
- Payment reconciliation needed

## Database Schema Updates

Add to `newsletter_subscribers` table:

```sql
ALTER TABLE newsletter_subscribers
ADD COLUMN payment_provider TEXT, -- 'nowpayments', 'solana-pay', 'stripe'
ADD COLUMN payment_id TEXT,
ADD COLUMN payment_currency TEXT, -- 'sol', 'btc', 'eth', 'usdc', 'usd', 'gbp'
ADD COLUMN payment_amount DECIMAL(20, 8),
ADD COLUMN payment_status TEXT CHECK(payment_status IN ('pending', 'confirming', 'confirmed', 'failed', 'refunded')),
ADD COLUMN subscription_interval TEXT CHECK(subscription_interval IN ('monthly', 'yearly', 'lifetime')),
ADD COLUMN next_billing_date TIMESTAMPTZ,
ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Create payments tracking table
CREATE TABLE newsletter_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id) NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'confirming', 'confirmed', 'failed', 'refunded')),
  tier TEXT NOT NULL CHECK(tier IN ('free', 'premium', 'founding')),
  interval TEXT NOT NULL CHECK(interval IN ('monthly', 'yearly', 'lifetime')),
  payment_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_payments_subscriber ON newsletter_payments(subscriber_id);
CREATE INDEX idx_newsletter_payments_status ON newsletter_payments(status);
CREATE INDEX idx_newsletter_payments_provider ON newsletter_payments(payment_provider);
```

## Payment Flow

### 1. User Selects Tier

```tsx
// apps/web/src/app/newsletter/pricing/page.tsx
import NewsletterPricingTiers from '@/components/newsletter/PricingTiers'

export default function NewsletterPricingPage() {
  return <NewsletterPricingTiers />
}
```

### 2. Payment Method Selection

```tsx
// User clicks "Upgrade to Premium"
// Shows CryptoPaymentSelector component
<CryptoPaymentSelector
  amountUsd={14.99}
  allowFiat={true} // Enable GBP/USD
  onPaymentMethodSelected={(method, network, currency) => {
    // method: 'sol', 'btc', 'eth', 'usdc', 'fiat'
    // network: 'mainnet', 'lightning', 'arbitrum', etc.
    // currency: 'usd', 'gbp' (for fiat)
  }}
/>
```

### 3. Create Payment

```typescript
// apps/web/src/app/api/newsletter/checkout/route.ts
import { createNewsletterPayment } from '@decebal/payments'

export async function POST(request: Request) {
  const { subscriberId, tier, interval, currency, paymentMethod } = await request.json()

  const payment = await createNewsletterPayment({
    subscriberId,
    tier, // 'premium' or 'founding'
    interval, // 'monthly', 'yearly', 'lifetime'
    currency, // 'sol', 'btc', 'eth', 'usdc', 'usd', 'gbp'
    paymentMethod, // 'nowpayments' or 'solana-pay'
  })

  return Response.json({ paymentUrl: payment.url, paymentId: payment.id })
}
```

### 4. Payment Verification (Webhook)

```typescript
// apps/web/src/app/api/webhooks/nowpayments/route.ts
import { verifyNewsletterPayment, upgradeSubscriberTier } from '@decebal/payments'

export async function POST(request: Request) {
  const signature = request.headers.get('x-nowpayments-sig')
  const payload = await request.json()

  // Verify webhook signature
  if (!verifySignature(signature, payload)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (payload.payment_status === 'finished') {
    // Payment confirmed
    await upgradeSubscriberTier(payload.order_id, payload.payment_id)

    // Send welcome email for premium tier
    await sendNewsletterWelcome(subscriber.email, subscriber.name, 'premium')
  }

  return Response.json({ success: true })
}
```

### 5. Access Control

```typescript
// Middleware or API route protection
import { checkSubscriberTier } from '@decebal/newsletter'

const subscriber = await getSubscriberByEmail(email)

if (subscriber.tier === 'free') {
  // Show paywall
  return <UpgradeToPremiumGate />
}

// Show premium content
return <PremiumArticle />
```

## Subscription Management

### Monthly Renewals

**For crypto payments:**
- No auto-renewal (crypto doesn't support recurring)
- Send reminder email 7 days before expiry
- Send payment link with pre-filled amount
- Grace period: 3 days after expiry

**Alternative: Prepaid Credits**
```typescript
// User can pre-pay for multiple months
const payment = await createNewsletterPayment({
  tier: 'premium',
  interval: 'monthly',
  quantity: 12, // Pay for 12 months upfront
  discount: 0.17, // 17% discount for annual
})
```

### Upgrades & Downgrades

```typescript
// packages/newsletter/src/subscriptions.ts

export async function upgradeSubscriberTier(
  subscriberId: string,
  newTier: 'premium' | 'founding',
  paymentId: string
) {
  const subscriber = await getSubscriberById(subscriberId)

  // Calculate prorated credit if upgrading mid-cycle
  const credit = calculateProratedCredit(subscriber)

  await supabase
    .from('newsletter_subscribers')
    .update({
      tier: newTier,
      subscription_expires_at: calculateExpiryDate(newTier, interval),
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriberId)

  // Log payment
  await createPaymentRecord(subscriberId, paymentId, newTier)
}

export async function downgradeSubscriberTier(subscriberId: string) {
  // Mark for downgrade at period end
  await supabase
    .from('newsletter_subscribers')
    .update({ cancel_at_period_end: true })
    .eq('id', subscriberId)
}
```

## Pricing Localization

### Dynamic Pricing Based on Currency

```typescript
const NEWSLETTER_PRICING = {
  premium: {
    monthly: {
      usd: 14.99,
      gbp: 11.99,
      eur: 13.99,
      sol: 0.065, // Updated based on current SOL price
      eth: 0.0075,
      btc: 0.00033,
      usdc: 14.99,
    },
    yearly: {
      usd: 149.90,
      gbp: 119.90,
      eur: 139.90,
      sol: 0.65,
      eth: 0.075,
      btc: 0.0033,
      usdc: 149.90,
    },
  },
  founding: {
    lifetime: {
      usd: 300,
      gbp: 240,
      eur: 280,
      sol: 1.3,
      eth: 0.15,
      btc: 0.0067,
      usdc: 300,
    },
  },
}
```

### Real-Time Crypto Price Updates

```typescript
// packages/payments/src/pricing.ts
import { fetchCryptoPrices } from './api/coingecko'

export async function getCryptoPriceInUSD(currency: string): Promise<number> {
  const prices = await fetchCryptoPrices(['bitcoin', 'ethereum', 'solana'])
  return prices[currency] || 0
}

export async function convertUSDToCrypto(
  amountUSD: number,
  cryptocurrency: 'sol' | 'btc' | 'eth'
): Promise<number> {
  const price = await getCryptoPriceInUSD(cryptocurrency)
  return amountUSD / price
}
```

## Security Considerations

1. **Webhook Verification**
   - Always verify webhook signatures
   - Use HMAC validation
   - Check payment status on-chain for crypto

2. **Payment Expiry**
   - Set expiry time for payment links (15-30 minutes)
   - Handle expired payments gracefully

3. **Double-Spending Protection**
   - Verify payment on-chain before granting access
   - Use unique payment IDs
   - Check for duplicate webhook deliveries

4. **Data Protection**
   - Don't store private keys in database
   - Use environment variables for API keys
   - Encrypt sensitive payment data

5. **Access Control**
   - Verify tier on every premium content request
   - Cache tier status (with 5-minute TTL)
   - Handle edge cases (expired, pending, etc.)

## Testing Checklist

### Devnet/Testnet Testing
- [ ] Solana devnet payment flow
- [ ] Bitcoin testnet (Lightning & on-chain)
- [ ] Ethereum Goerli/Sepolia testnet
- [ ] NOWPayments sandbox mode

### Payment Scenarios
- [ ] Successful payment (all currencies)
- [ ] Failed payment
- [ ] Expired payment
- [ ] Partial payment
- [ ] Overpayment handling
- [ ] Webhook retry logic

### Subscription Scenarios
- [ ] New premium subscription
- [ ] Upgrade free → premium
- [ ] Upgrade premium → founding
- [ ] Downgrade at period end
- [ ] Renewal reminder emails
- [ ] Expired subscription handling

### Edge Cases
- [ ] Network congestion delays
- [ ] Webhook delivery failures
- [ ] Multiple concurrent payments
- [ ] Currency conversion accuracy
- [ ] Tax/fee calculations

## Implementation Timeline

### Week 1: Foundation
- [x] Phase 1 & 2 complete (signup + email confirmation)
- [ ] Set up NOWPayments account
- [ ] Create payments package structure
- [ ] Database schema updates

### Week 2: Payment Integration
- [ ] Implement NOWPayments API client
- [ ] Create payment creation flow
- [ ] Build webhook handlers
- [ ] Payment verification logic

### Week 3: UI & UX
- [ ] Newsletter pricing page
- [ ] Crypto payment selector
- [ ] Payment status tracking
- [ ] Success/failure pages
- [ ] Subscription management dashboard

### Week 4: Testing & Polish
- [ ] End-to-end testing (all currencies)
- [ ] Error handling & edge cases
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation

## Cost Comparison

### Traditional Payment (Stripe)
- Monthly: $14.99 × 3% = $0.45 per transaction
- Yearly: $149.90 × 3% = $4.50 per transaction
- **Annual cost for 100 subscribers:** $450

### Crypto Payment (NOWPayments)
- Monthly: $14.99 × 1% = $0.15 per transaction
- Yearly: $149.90 × 1% = $1.50 per transaction
- **Annual cost for 100 subscribers:** $150

### Crypto Payment (Direct Solana Pay)
- Monthly: $14.99 × 0% + $0.0001 network fee
- Yearly: $149.90 × 0% + $0.0001 network fee
- **Annual cost for 100 subscribers:** <$1

**Savings: $299-449/year (67-100% reduction)**

## Next Steps

1. **Set up NOWPayments account**
   - Sign up at https://nowpayments.io
   - Get API key & IPN secret
   - Configure webhook URL

2. **Create payments package**
   ```bash
   mkdir -p packages/payments/src
   cd packages/payments
   bun init
   bun add @nowpayments/nowpayments-api-js
   ```

3. **Implement payment flow**
   - Create payment endpoints
   - Build webhook handler
   - Add payment verification

4. **Build pricing page**
   - Design tier cards
   - Integrate crypto selector
   - Add payment modals

5. **Test thoroughly**
   - Sandbox mode first
   - Then testnet/devnet
   - Finally mainnet with small amounts

## Resources

- **NOWPayments Docs:** https://documenter.getpostman.com/view/7907941/S1a32n38
- **Solana Pay:** https://docs.solanapay.com
- **Bitcoin Lightning:** https://lightning.network
- **Ethereum Layer 2:** https://l2beat.com
- **Pricing Strategy:** /docs/PRICING_RESEARCH.md
- **Crypto Payments Guide:** /docs/CRYPTO_PAYMENTS.md

---

**Ready to implement Phase 3!** 🚀
