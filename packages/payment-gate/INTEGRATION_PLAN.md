# Payment Gate Integration Plan
## Newsletter & Services Payment Protection

**Date**: October 27, 2025
**Target**: Integrate Payment Gate with existing newsletter and services payment system

---

## Current Architecture Analysis

### ✅ Existing Payment System

You have a well-structured **Supabase-backed payment system**:

1. **Unified Payment Configuration** (`lib/payments/config.ts`)
   - Newsletter tiers: Free, Premium ($14.99/month), Founding ($300/lifetime)
   - Service tiers: "all-pricing" ($5 one-time)
   - Meeting types: Various pricing tiers
   - Deposit types: For project commitments

2. **Payment Infrastructure** (`lib/payments/index.ts`)
   - Supabase payment tracking
   - Service access management
   - Meeting booking system
   - User profiles with wallet addresses

3. **Current Payment Flow**:
   ```
   User → Connect Wallet → Pay (Solana Pay) → Verify → Grant Access
   ```

4. **Frontend Components**:
   - `ServicePaymentGate.tsx`: Wallet-based content gating
   - `PaymentModal.tsx`: Solana Pay payment flow
   - Wallet adapter integration (Phantom, Solflare)

---

## Payment Gate Integration Strategy

### 🎯 Goal

**Protect API endpoints** for newsletter and services with HTTP 402 payment requirement, while maintaining compatibility with your existing Supabase payment system.

### 🔄 Hybrid Approach

**Option 1: Payment Gate as API Layer** (Recommended)
- Keep existing UI/UX (wallet connect → pay → access)
- Add Payment Gate middleware to **API endpoints**
- Use Payment Gate for:
  - Newsletter content API (`/api/newsletter/premium/...`)
  - Services pricing API (`/api/services/pricing`)
  - Premium content delivery

**Option 2: Replace Frontend Payment Flow**
- Replace `ServicePaymentGate.tsx` with Payment Gate client
- More disruptive, higher risk

**Decision: Go with Option 1** - Minimal disruption, API-first approach

---

## Architecture Design

### New API Structure

```
/api/newsletter/
├── subscribe (public)          # Email subscription
├── premium/
│   ├── content/[slug]          # 402 PROTECTED
│   └── archive                 # 402 PROTECTED
└── founding/
    └── exclusive               # 402 PROTECTED

/api/services/
├── public                      # Case studies list (public)
└── pricing                     # 402 PROTECTED - $5 to unlock
```

### Payment Gate Configuration

```typescript
// Payment Gate config for newsletter & services
const paymentGateConfig: PaymentGateConfig = {
  pricing: {
    // Newsletter endpoints
    '/api/newsletter/premium/*': {
      usd: 14.99,
      sol: 0.07,
      requiredTier: 'premium', // Check if user has premium subscription
      freeLimit: {
        requests: 0,  // No free tier for premium content
        window: 0
      }
    },
    '/api/newsletter/founding/*': {
      usd: 300,
      sol: 1.4,
      requiredTier: 'founding',
    },

    // Services endpoints
    '/api/services/pricing': {
      usd: 5,
      sol: 0.023,
    },
  },

  chains: ['solana'],  // Start with Solana only

  chainConfig: {
    solana: {
      merchantWallet: process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS!,
      network: 'mainnet-beta',
      commitment: 'confirmed',
    },
  },

  // Integration with existing system
  onPaymentVerified: async (verification) => {
    // Log to Supabase (existing system)
    await createPayment({
      walletAddress: verification.payer!,
      paymentType: 'service_access',  // or 'newsletter_subscription'
      amount: verification.amount,
      currency: verification.currency,
      chain: verification.chain,
      reference: verification.paymentId,
      signature: verification.signature,
      description: 'Payment Gate verification',
    })

    // Grant access in existing system
    if (serviceSlug) {
      await grantServiceAccess({
        walletAddress: verification.payer!,
        serviceSlug: 'all-pricing',
        paymentId: verification.paymentId,
        serviceType: 'one_time',
      })
    }
  },
}
```

---

## Implementation Steps

### Phase 1: Setup Payment Gate (Week 1)

#### Step 1.1: Install Package
```bash
cd apps/web
bun add @decebal/payment-gate
```

#### Step 1.2: Create Payment Gate Config
```typescript
// apps/web/src/lib/payment-gate/config.ts
import { PaymentGateConfig } from '@decebal/payment-gate'
import { NEWSLETTER_TIERS, SERVICE_TIERS } from '@/lib/payments/config'

export const paymentGateConfig: PaymentGateConfig = {
  // ... configuration from above
}
```

#### Step 1.3: Custom Payment Verification
Integrate with existing Supabase system:

```typescript
// apps/web/src/lib/payment-gate/verify.ts
import { PaymentGate } from '@decebal/payment-gate'
import { hasServiceAccess } from '@/lib/payments'

export async function verifyUserAccess(
  walletAddress: string,
  endpoint: string
): Promise<boolean> {
  // Check existing Supabase service access
  if (endpoint.includes('/api/services/pricing')) {
    return await hasServiceAccess(walletAddress, 'all-pricing')
  }

  // Check newsletter subscription status
  if (endpoint.includes('/api/newsletter/premium')) {
    return await hasNewsletterAccess(walletAddress, 'premium')
  }

  return false
}
```

---

### Phase 2: Implement API Endpoints (Week 1-2)

#### Newsletter Premium Content API

```typescript
// apps/web/src/app/api/newsletter/premium/content/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { requirePayment } from '@decebal/payment-gate/middleware/nextjs'
import { paymentGateConfig } from '@/lib/payment-gate/config'

const gate = new PaymentGate(paymentGateConfig)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Check payment
  const auth = await requirePayment(
    request,
    gate,
    '/api/newsletter/premium/content'
  )

  if (!auth.authorized) {
    return auth.response  // Returns 402 with payment options
  }

  // Payment verified - return premium content
  const content = await getPremiumContent(params.slug)
  return NextResponse.json(content)
}
```

#### Services Pricing API

```typescript
// apps/web/src/app/api/services/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { requirePayment } from '@decebal/payment-gate/middleware/nextjs'
import { paymentGateConfig } from '@/lib/payment-gate/config'

const gate = new PaymentGate(paymentGateConfig)

export async function GET(request: NextRequest) {
  // Check payment
  const auth = await requirePayment(request, gate, '/api/services/pricing')

  if (!auth.authorized) {
    return auth.response  // Returns 402 with payment options
  }

  // Return pricing data
  const pricing = await getServicesPricing()
  return NextResponse.json(pricing)
}
```

---

### Phase 3: Frontend Integration (Week 2)

#### Option A: Keep Existing UI (Recommended)

No changes needed! Your existing `ServicePaymentGate.tsx` continues to work.

The flow:
1. User connects wallet
2. User pays via `PaymentModal`
3. Payment recorded in Supabase
4. `ServicePaymentGate` grants UI access
5. **NEW**: API calls include wallet signature
6. Payment Gate verifies access via Supabase check

#### Option B: Add Payment Gate Client (Optional)

For new features or APIs without existing UI:

```typescript
'use client'
import { PaymentGateClient } from '@decebal/payment-gate/client'

const client = new PaymentGateClient({
  preferredChain: 'solana',
  autoRetry: false,  // We handle payment via existing modal
})

async function fetchPremiumContent(slug: string) {
  const response = await client.fetch(`/api/newsletter/premium/content/${slug}`)

  if (response.status === 402 && response.payment) {
    // Show your existing PaymentModal
    setShowPaymentModal(true)
    setPaymentInfo(response.payment)
  }

  if (response.data) {
    setPremiumContent(response.data)
  }
}
```

---

### Phase 4: Testing (Week 2)

#### Test Scenarios

1. **Services Pricing Access**
   ```bash
   # Without payment - should return 402
   curl http://localhost:3000/api/services/pricing

   # With payment ID - should return data
   curl -H "X-Payment-Id: pg_xxx" http://localhost:3000/api/services/pricing
   ```

2. **Newsletter Premium Content**
   ```bash
   # Without subscription - 402
   curl http://localhost:3000/api/newsletter/premium/content/deep-dive-1

   # With subscription - content
   curl -H "X-Payment-Id: pg_xxx" \
        http://localhost:3000/api/newsletter/premium/content/deep-dive-1
   ```

3. **Integration Test**
   - User pays $5 via existing UI
   - Payment recorded in Supabase
   - API endpoint checks Supabase access
   - Returns content without additional payment

---

## Benefits of This Approach

### ✅ Advantages

1. **API-First Protection**: HTTP 402 standard for API monetization
2. **Backward Compatible**: Existing UI/UX remains unchanged
3. **Multi-Chain Ready**: Easy to add Lightning/Ethereum later
4. **Type-Safe**: Full TypeScript support
5. **Analytics**: Built-in payment tracking
6. **Flexible**: Can enable/disable Payment Gate per endpoint
7. **Hybrid**: Works with existing Supabase payment system

### 📊 Comparison

| Feature | Current System | With Payment Gate |
|---------|---------------|-------------------|
| **UI Gating** | ✅ ServicePaymentGate | ✅ (unchanged) |
| **API Protection** | ❌ None | ✅ HTTP 402 |
| **Multi-chain** | ❌ Solana only | ✅ SOL + BTC + ETH |
| **Rate Limiting** | ❌ | ✅ Built-in |
| **Subscriptions** | ✅ Manual tracking | ✅ + HTTP 402 |
| **Analytics** | ✅ Supabase | ✅ Supabase + PostHog |

---

## Migration Path

### Week 1: Setup & Test

1. ✅ Install Payment Gate package
2. ✅ Create configuration
3. ✅ Implement 1 test endpoint (`/api/services/pricing`)
4. ✅ Test on devnet

### Week 2: Newsletter Integration

1. ✅ Create premium content API endpoints
2. ✅ Integrate with existing subscription checks
3. ✅ Test payment flow end-to-end
4. ✅ Deploy to production

### Week 3: Optimization

1. ✅ Add rate limiting for free tier
2. ✅ Implement analytics tracking
3. ✅ Add Lightning Network support
4. ✅ Documentation and examples

---

## Future Enhancements

### Potential Features

1. **Prepaid Credits**: Buy credits, use for multiple API calls
2. **Dynamic Pricing**: Adjust prices based on demand/SOL price
3. **Subscription Auto-Renewal**: HTTP 402 for expired subscriptions
4. **Referral System**: Earn credits by referring users
5. **API Key Management**: Traditional API keys as alternative
6. **Usage Analytics**: Track API usage per user

---

## Decision: Proceed?

### Recommendation: ✅ YES

**Why**:
1. **Low Risk**: API-only changes, existing UI unchanged
2. **High Value**: Unlock new monetization opportunities
3. **Future-Proof**: Multi-chain ready, HTTP 402 standard
4. **Competitive Edge**: First portfolio with HTTP 402 payments
5. **Portfolio Piece**: Showcase Payment Gate in production

### Next Immediate Actions

1. Create Payment Gate config file
2. Implement `/api/services/pricing` endpoint
3. Test on devnet with real wallet
4. Document the integration

**Ready to proceed?**
