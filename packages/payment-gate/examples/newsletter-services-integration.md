# Payment Gate Integration Examples
## Newsletter & Services Use Cases

This document shows practical examples of integrating Payment Gate with newsletter subscriptions and service access.

---

## Example 1: Newsletter Premium Content API

### Scenario
You publish premium newsletter content that requires a paid subscription ($14.99/month).

### Implementation

```typescript
// apps/web/src/lib/payment-gate-config.ts
import type { PaymentGateConfig } from '@decebal/payment-gate'
import { hasServiceAccess } from '@/lib/payments'

export const newsletterGateConfig: PaymentGateConfig = {
  pricing: {
    // Premium content requires subscription
    '/api/newsletter/premium/*': {
      usd: 14.99,
      sol: 0.07,
      // Custom verification: check if user has active subscription
    },

    // Founding member content
    '/api/newsletter/founding/*': {
      usd: 300,
      sol: 1.4,
    },
  },

  chains: ['solana'],

  chainConfig: {
    solana: {
      merchantWallet: process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS!,
      network: 'mainnet-beta',
    },
  },

  // Optional: Check existing subscription in Supabase
  onPaymentVerified: async (verification) => {
    // Grant newsletter access in your existing system
    await grantNewsletterAccess(verification.payer!, 'premium')
  },
}
```

### API Endpoint

```typescript
// apps/web/src/app/api/newsletter/premium/content/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { requirePayment } from '@decebal/payment-gate/middleware/nextjs'
import { newsletterGateConfig } from '@/lib/payment-gate-config'
import { hasNewsletterAccess } from '@/lib/payments'

const gate = new PaymentGate(newsletterGateConfig)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Get wallet address from request (if available)
  const walletAddress = request.headers.get('X-Wallet-Address')

  // Check if user already has subscription access
  if (walletAddress) {
    const hasAccess = await hasNewsletterAccess(walletAddress, 'premium')
    if (hasAccess) {
      // User has active subscription - return content
      const content = await getPremiumContent(params.slug)
      return NextResponse.json(content)
    }
  }

  // No active subscription - require payment
  const auth = await requirePayment(
    request,
    gate,
    '/api/newsletter/premium/content'
  )

  if (!auth.authorized) {
    return auth.response  // Returns 402 with payment options
  }

  // Payment verified - return content
  const content = await getPremiumContent(params.slug)
  return NextResponse.json(content)
}
```

### Frontend Usage

```typescript
'use client'
import { PaymentGateClient } from '@decebal/payment-gate/client'
import { useWallet } from '@solana/wallet-adapter-react'

export function PremiumContentViewer({ slug }: { slug: string }) {
  const { publicKey } = useWallet()
  const [content, setContent] = useState(null)
  const [paymentRequired, setPaymentRequired] = useState(false)

  const client = new PaymentGateClient({
    preferredChain: 'solana',
    autoRetry: false,  // Handle payment manually
  })

  async function loadContent() {
    const headers: Record<string, string> = {}
    if (publicKey) {
      headers['X-Wallet-Address'] = publicKey.toString()
    }

    const response = await client.fetch(
      `/api/newsletter/premium/content/${slug}`,
      { headers }
    )

    if (response.status === 402 && response.payment) {
      setPaymentRequired(true)
      // Show payment modal with response.payment.paymentOptions
    } else if (response.data) {
      setContent(response.data)
    }
  }

  return (
    <div>
      {paymentRequired ? (
        <PaymentPrompt />
      ) : content ? (
        <ContentDisplay content={content} />
      ) : (
        <Loading />
      )}
    </div>
  )
}
```

---

## Example 2: Services Pricing Unlock

### Scenario
You want users to pay $5 to unlock your services pricing page.

### Implementation

```typescript
// apps/web/src/lib/payment-gate-config.ts
export const servicesGateConfig: PaymentGateConfig = {
  pricing: {
    '/api/services/pricing': {
      usd: 5,
      sol: 0.023,
    },
  },

  chains: ['solana'],

  chainConfig: {
    solana: {
      merchantWallet: process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS!,
      network: 'mainnet-beta',
    },
  },

  // Grant lifetime access to pricing
  onPaymentVerified: async (verification) => {
    await grantServiceAccess({
      walletAddress: verification.payer!,
      serviceSlug: 'all-pricing',
      paymentId: verification.paymentId,
      serviceType: 'one_time',  // Lifetime access
      expiresAt: null,
    })
  },
}
```

### API Endpoint

```typescript
// apps/web/src/app/api/services/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { requirePayment } from '@decebal/payment-gate/middleware/nextjs'
import { servicesGateConfig } from '@/lib/payment-gate-config'
import { hasServiceAccess } from '@/lib/payments'
import { SERVICE_TIERS } from '@/lib/payments/config'

const gate = new PaymentGate(servicesGateConfig)

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get('X-Wallet-Address')

  // Check if user already has access (paid in the past)
  if (walletAddress) {
    const hasAccess = await hasServiceAccess(walletAddress, 'all-pricing')
    if (hasAccess) {
      return NextResponse.json({
        tiers: SERVICE_TIERS,
        access: 'granted',
      })
    }
  }

  // No access - require payment
  const auth = await requirePayment(request, gate, '/api/services/pricing')

  if (!auth.authorized) {
    return auth.response  // Returns 402 with payment options
  }

  // Payment verified - return pricing
  return NextResponse.json({
    tiers: SERVICE_TIERS,
    access: 'granted',
  })
}
```

---

## Example 3: Rate-Limited Free Tier + Paid Access

### Scenario
Allow 5 free newsletter article views per day, then require payment.

### Implementation

```typescript
export const freemiumGateConfig: PaymentGateConfig = {
  pricing: {
    '/api/newsletter/articles/*': {
      usd: 0,  // Free tier
      sol: 0,
      freeLimit: {
        requests: 5,
        window: 86400000,  // 24 hours
      },
    },
    '/api/newsletter/premium/*': {
      usd: 14.99,
      sol: 0.07,
    },
  },

  chains: ['solana'],

  chainConfig: {
    solana: {
      merchantWallet: process.env.NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS!,
      network: 'mainnet-beta',
    },
  },

  // Rate limiting configuration
  rateLimit: {
    free: {
      requests: 5,
      window: 86400000,  // 5 per day
    },
    paid: {
      requests: 1000,
      window: 86400000,  // 1000 per day for paid users
    },
  },
}
```

### API Endpoint

```typescript
// apps/web/src/app/api/newsletter/articles/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { freemiumGateConfig } from '@/lib/payment-gate-config'

const gate = new PaymentGate(freemiumGateConfig)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Get user identifier (IP or wallet address)
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
  const walletAddress = request.headers.get('X-Wallet-Address')
  const rateLimitKey = walletAddress || clientIp

  // Check if user has premium subscription
  const hasPremium = walletAddress
    ? await hasNewsletterAccess(walletAddress, 'premium')
    : false

  // Check rate limit
  const rateLimit = await gate.checkRateLimit(
    rateLimitKey,
    '/api/newsletter/articles',
    hasPremium
  )

  if (!rateLimit.allowed) {
    // Rate limit exceeded - require payment
    const payment402 = await gate.generatePaymentRequired(
      '/api/newsletter/premium/upgrade'
    )

    return NextResponse.json(payment402, {
      status: 402,
      headers: {
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimit.resetAt.toString(),
      },
    })
  }

  // Within rate limit - return article
  const article = await getArticle(params.slug)
  return NextResponse.json(article, {
    headers: {
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': rateLimit.resetAt.toString(),
    },
  })
}
```

---

## Example 4: Subscription Renewal Reminder

### Scenario
When a user's newsletter subscription expires, show HTTP 402 payment requirement.

### Implementation

```typescript
// apps/web/src/app/api/newsletter/premium/check-access/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { newsletterGateConfig } from '@/lib/payment-gate-config'
import { getNewsletterSubscription } from '@/lib/payments'

const gate = new PaymentGate(newsletterGateConfig)

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get('X-Wallet-Address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet required' }, { status: 401 })
  }

  // Check subscription status
  const subscription = await getNewsletterSubscription(walletAddress)

  if (!subscription || subscription.expiresAt < new Date()) {
    // Subscription expired - require renewal
    const payment402 = await gate.generatePaymentRequired(
      '/api/newsletter/premium/renew',
      {
        method: 'POST',
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
      }
    )

    return NextResponse.json({
      status: 'expired',
      renewalRequired: true,
      paymentOptions: payment402.paymentOptions,
    }, { status: 402 })
  }

  // Active subscription
  return NextResponse.json({
    status: 'active',
    expiresAt: subscription.expiresAt,
  })
}
```

---

## Example 5: Multi-Chain Payment Options

### Scenario
Let users pay for newsletter access using Solana, Bitcoin Lightning, or Ethereum.

### Implementation

```typescript
export const multiChainConfig: PaymentGateConfig = {
  pricing: {
    '/api/newsletter/premium/*': {
      usd: 14.99,
      sol: 0.07,      // Solana price
      btc: 0.00031,   // Bitcoin price
      eth: 0.0043,    // Ethereum price
    },
  },

  // Support multiple chains
  chains: ['solana', 'lightning', 'ethereum'],

  chainConfig: {
    solana: {
      merchantWallet: process.env.SOLANA_MERCHANT_ADDRESS!,
      network: 'mainnet-beta',
    },
    lightning: {
      provider: 'lnbits',
      apiUrl: process.env.LNBITS_URL!,
      apiKey: process.env.LNBITS_API_KEY!,
    },
    ethereum: {
      merchantWallet: process.env.ETHEREUM_MERCHANT_ADDRESS!,
      network: 'base',  // Use Base L2 for low fees
      acceptedTokens: ['ETH', 'USDC'],
    },
  },

  onPaymentVerified: async (verification) => {
    // Grant access regardless of which chain was used
    await grantNewsletterAccess(verification.payer!, 'premium')

    // Track payment method analytics
    trackEvent('newsletter_subscription_paid', {
      chain: verification.chain,
      currency: verification.currency,
      amount: verification.amount,
    })
  },
}
```

### Usage

When a user hits the payment requirement, they'll see all 3 options:

```json
{
  "status": 402,
  "message": "Payment required to access this endpoint",
  "paymentOptions": [
    {
      "chain": "solana",
      "amount": 0.07,
      "currency": "SOL",
      "paymentUrl": "solana:...",
      "qrCode": "data:image/png;base64,..."
    },
    {
      "chain": "lightning",
      "amount": 0.00031,
      "currency": "BTC",
      "paymentUrl": "lnbc1...",
      "qrCode": "data:image/png;base64,..."
    },
    {
      "chain": "base",
      "amount": 0.0043,
      "currency": "ETH",
      "paymentUrl": "ethereum:0x...?value=0.0043"
    }
  ]
}
```

---

## Testing Examples

### Test 1: Service Pricing Access

```bash
# Step 1: Call API without payment - should return 402
curl http://localhost:3000/api/services/pricing

# Response:
{
  "status": 402,
  "paymentId": "pg_123_abc",
  "paymentOptions": [
    {
      "chain": "solana",
      "amount": 0.023,
      "currency": "SOL",
      "paymentUrl": "solana:FakeAddress123?amount=0.023&reference=xyz",
      "reference": "xyz"
    }
  ],
  "expiresAt": 1698765432000
}

# Step 2: User pays 0.023 SOL via wallet

# Step 3: Retry with payment ID
curl -H "X-Payment-Id: pg_123_abc" \
     http://localhost:3000/api/services/pricing

# Response:
{
  "tiers": { ... },
  "access": "granted"
}
```

### Test 2: Newsletter Premium Content

```bash
# Without subscription - 402
curl -H "X-Wallet-Address: WALLET123" \
     http://localhost:3000/api/newsletter/premium/content/deep-dive-1

# With active subscription - content
curl -H "X-Wallet-Address: SUBSCRIBED_WALLET" \
     http://localhost:3000/api/newsletter/premium/content/deep-dive-1

# Response:
{
  "title": "Deep Dive: Building Payment Rails",
  "content": "...",
  "publishedAt": "2025-10-27"
}
```

---

## Summary

Payment Gate integrates seamlessly with your existing payment system by:

1. **Protecting API endpoints** with HTTP 402
2. **Checking existing access** in Supabase before requiring payment
3. **Supporting multi-chain payments** (Solana, Lightning, Ethereum)
4. **Rate limiting** free tier usage
5. **Maintaining compatibility** with your current UI/UX

**Result**: API-first payment protection with minimal frontend changes.
