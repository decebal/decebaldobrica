# @decebal/payment-gate

> Multi-chain HTTP 402 payment protocol for API monetization - The X402 alternative with **Solana, Bitcoin Lightning, and Ethereum L2 support**

[![npm version](https://img.shields.io/npm/v/@decebal/payment-gate.svg)](https://www.npmjs.com/package/@decebal/payment-gate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why Payment Gate?

Payment Gate is a **multi-chain HTTP 402 payment protocol** that enables frictionless API monetization. Unlike X402 (USDC-only), Payment Gate supports **Solana, Bitcoin Lightning, and Ethereum L2**, offering developers choice, lower fees, and hybrid payment models.

### Payment Gate vs X402

| Feature | X402 | Payment Gate |
|---------|------|--------------|
| **Chains** | USDC only | SOL, BTC Lightning, ETH L2, USDC |
| **Transaction Fees** | ~$0 (USDC L2) | **<$0.001** (Solana) to $0.01 (Lightning) |
| **Settlement** | ~2 seconds | **1-2 seconds** (Solana), instant (Lightning) |
| **Integration** | 1 line middleware | **1 line + flexible config** |
| **Payment Models** | Pay-per-use only | **Pay-per-use + Subscriptions + Prepaid** |
| **Framework Support** | Limited | **Next.js, Express, Cloudflare** |
| **Analytics** | Unknown | **Built-in PostHog integration** |
| **Client SDK** | Unknown | **React hooks, auto-retry** |

## 🚀 Quick Start

### Installation

```bash
npm install @decebal/payment-gate
# or
bun add @decebal/payment-gate
```

### Next.js Example (App Router)

```typescript
// middleware.ts
import { createPaymentGateMiddleware } from '@decebal/payment-gate/middleware/nextjs'

export const middleware = createPaymentGateMiddleware({
  config: {
    pricing: {
      '/api/chat': { usd: 0.02 },           // 2 cents per chat message
      '/api/premium/*': { usd: 0.10 },      // 10 cents for premium endpoints
    },
    chains: ['solana', 'lightning'],
    chainConfig: {
      solana: {
        merchantWallet: process.env.SOLANA_MERCHANT_ADDRESS!,
        network: 'mainnet-beta',
      },
    },
  },
  excludePaths: ['/api/public', '/_next'],
  development: process.env.NODE_ENV === 'development',
})

export const config = {
  matcher: '/api/:path*',
}
```

**That's it!** Your API endpoints are now monetized with crypto payments.

## 💡 Core Concepts

### HTTP 402 Payment Required

When a user hits a paid endpoint without payment, they receive a `402 Payment Required` response:

```json
{
  "status": 402,
  "message": "Payment required to access this endpoint",
  "paymentOptions": [
    {
      "chain": "solana",
      "amount": 0.000133,
      "currency": "SOL",
      "paymentUrl": "solana:ABC...?amount=0.000133&reference=XYZ...",
      "qrCode": "data:image/png;base64,...",
      "reference": "XYZ..."
    },
    {
      "chain": "lightning",
      "amount": 0.00000031,
      "currency": "BTC",
      "paymentUrl": "lnbc1...",
      "reference": "payment_hash_123"
    }
  ],
  "paymentId": "pg_1234567890_abc",
  "expiresAt": 1698765432000,
  "retryAfterPayment": {
    "method": "POST",
    "url": "/api/chat",
    "headers": {
      "X-Payment-Id": "pg_1234567890_abc"
    }
  }
}
```

### Payment Flow

1. **Request** → User calls paid API endpoint
2. **402 Response** → Server returns payment options (Solana, Lightning, etc.)
3. **User Pays** → User sends crypto payment using wallet
4. **Retry** → User retries request with `X-Payment-Id` header
5. **Verification** → Server verifies on-chain payment
6. **Success** → API returns requested data

## 📚 Documentation

### Configuration

#### Basic Configuration

```typescript
import { PaymentGateConfig } from '@decebal/payment-gate'

const config: PaymentGateConfig = {
  // Endpoint pricing
  pricing: {
    '/api/chat': { usd: 0.02 },
    '/api/image-gen': { sol: 0.01 },        // Fixed SOL price
    '/api/premium/*': { usd: 0.10 },        // Wildcard support
  },

  // Supported chains (order = fallback priority)
  chains: ['solana', 'lightning', 'ethereum'],

  // Chain configuration
  chainConfig: {
    solana: {
      merchantWallet: 'YOUR_WALLET_ADDRESS',
      network: 'mainnet-beta',
      commitment: 'confirmed',
    },
    lightning: {
      provider: 'lnbits',
      apiUrl: 'https://your-lnbits.com',
      apiKey: 'YOUR_LNBITS_KEY',
    },
    ethereum: {
      merchantWallet: '0xYOUR_ADDRESS',
      network: 'base',
      acceptedTokens: ['ETH', 'USDC'],
    },
  },

  // Optional: Payment timeout (default 15 minutes)
  paymentTimeout: 900000,

  // Optional: Rate limiting
  rateLimit: {
    free: {
      requests: 10,
      window: 3600000, // 1 hour
    },
    paid: {
      requests: 1000,
      window: 3600000,
    },
  },

  // Optional: Analytics
  analytics: {
    enabled: true,
    provider: 'posthog',
    apiKey: 'YOUR_POSTHOG_KEY',
  },

  // Optional: Webhooks
  onPaymentVerified: async (verification) => {
    console.log('Payment verified:', verification)
  },
}
```

#### Advanced Pricing

```typescript
pricing: {
  '/api/chat': {
    usd: 0.02,                    // USD price (converted to crypto)
    sol: 0.000133,                // Fixed SOL price (overrides USD)
    btc: 0.0000003,               // Fixed BTC price
    freeLimit: {                  // Free tier
      requests: 5,
      window: 3600000,            // 5 requests per hour
    },
    requiredTier: 'premium',      // Or require subscription
  },
}
```

### Middleware Options

#### Next.js (App Router)

```typescript
import { createPaymentGateMiddleware } from '@decebal/payment-gate/middleware/nextjs'

export const middleware = createPaymentGateMiddleware({
  config: paymentGateConfig,
  excludePaths: ['/api/public', '/api/health'],
  development: process.env.NODE_ENV === 'development', // Skip in dev
})
```

#### API Route Helper

```typescript
import { NextRequest } from 'next/server'
import { PaymentGate } from '@decebal/payment-gate'
import { requirePayment } from '@decebal/payment-gate/middleware/nextjs'

const gate = new PaymentGate(config)

export async function POST(request: NextRequest) {
  // Check payment
  const auth = await requirePayment(request, gate, '/api/chat')

  if (!auth.authorized) {
    return auth.response // Returns 402
  }

  // Payment verified - proceed
  const data = await request.json()
  return Response.json({ message: 'Success!', data })
}
```

### Client SDK

#### Auto-Retry Fetch

```typescript
import { PaymentGateClient } from '@decebal/payment-gate/client'

const client = new PaymentGateClient({
  preferredChain: 'solana',
  autoRetry: true,                // Automatically pay and retry
  walletAdapter: solanaWallet,    // Phantom, Solflare, etc.
  pollingInterval: 2000,          // Check payment every 2s
  timeout: 300000,                // 5 minute timeout
})

// Make paid API call
const response = await client.fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello!' }),
})

if (response.data) {
  console.log('Response:', response.data)
} else if (response.payment) {
  // Payment required but auto-retry disabled
  console.log('Please pay:', response.payment.paymentOptions)
}
```

#### React Hook (Coming Soon)

```tsx
import { usePaymentGate } from '@decebal/payment-gate/client/react'

function ChatInterface() {
  const { fetch, paying, error } = usePaymentGate({
    preferredChain: 'solana',
  })

  const sendMessage = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })

    if (response.data) {
      console.log('AI response:', response.data)
    }
  }

  return (
    <div>
      {paying && <div>Processing payment...</div>}
      {error && <div>Error: {error}</div>}
      {/* UI */}
    </div>
  )
}
```

## 🎯 Use Cases

### 1. Newsletter Subscriptions

Protect premium newsletter content with subscription-based access:

```typescript
pricing: {
  '/api/newsletter/premium/*': {
    usd: 14.99,           // Monthly subscription
    sol: 0.07,
    freeLimit: {
      requests: 5,        // 5 free articles per day
      window: 86400000
    }
  },
  '/api/newsletter/founding/*': {
    usd: 300,             // Lifetime access
    sol: 1.4,
  },
}
```

**Real example**: [Newsletter Integration Guide](./examples/newsletter-services-integration.md#example-1-newsletter-premium-content-api)

### 2. Service Pricing Unlock

One-time payment to unlock your services pricing page:

```typescript
pricing: {
  '/api/services/pricing': {
    usd: 5,               // One-time unlock fee
    sol: 0.023,
  },
}
```

**Benefits**:
- Filters serious clients
- Generates revenue from tire-kickers
- Lifetime access after single payment

**Real example**: [Services Integration Guide](./examples/newsletter-services-integration.md#example-2-services-pricing-unlock)

### 3. AI API Monetization

```typescript
// Charge per AI chat message
pricing: {
  '/api/chat': { usd: 0.02 },           // 2¢ per message
  '/api/image-gen': { usd: 0.10 },      // 10¢ per image
  '/api/transcribe': { usd: 0.05 },     // 5¢ per minute
}
```

### 4. Freemium Content API

Free tier with rate limiting + paid upgrade:

```typescript
pricing: {
  '/api/articles/*': {
    usd: 0,
    freeLimit: { requests: 10, window: 86400000 }, // 10/day free
  },
  '/api/premium/*': { usd: 0.50 },
}
```

### 5. Developer Tools API

```typescript
// Usage-based pricing
pricing: {
  '/api/validate': { usd: 0.001 },      // $0.001 per validation
  '/api/transform': { usd: 0.005 },     // $0.005 per transformation
  '/api/analyze': { usd: 0.02 },        // 2¢ per analysis
}
```

### 6. Data/Analytics API

```typescript
// Tiered pricing
pricing: {
  '/api/data/basic': { usd: 0.01 },
  '/api/data/advanced': { usd: 0.05 },
  '/api/data/realtime': { usd: 0.10 },
}
```

**See more examples**: [Newsletter & Services Integration Guide](./examples/newsletter-services-integration.md)

## 💰 Fee Comparison

Payment Gate saves you **95-99%** in fees compared to traditional payment processors:

| Amount | Stripe (3%) | Solana | Lightning | Ethereum L2 (Base) |
|--------|-------------|--------|-----------|-------------------|
| $0.10  | $0.003      | <$0.0001 | <$0.01  | $0.001-$0.01      |
| $1.00  | $0.030      | <$0.0001 | <$0.01  | $0.01-$0.05       |
| $10.00 | $0.300      | <$0.001  | <$0.01  | $0.10-$0.30       |

**Recommendation**: Use **Solana** for lowest fees (<$0.001) and fastest settlement (1-2 seconds).

## 🏗️ Architecture

```
Request → Middleware → Payment Gate → Chain Handler → Blockchain
                ↓
         402 Response
                ↓
         User Pays
                ↓
    Retry with X-Payment-Id
                ↓
        Verify Payment
                ↓
        Return Data
```

### Components

- **PaymentGate**: Core orchestrator, chain-agnostic
- **Http402Handler**: Generates standardized 402 responses
- **Middleware**: Framework-specific integrations (Next.js, Express, etc.)
- **ChainHandlers**: Blockchain-specific payment verification
- **Client SDK**: Auto-retry fetch with payment support

## 🔐 Security

### Best Practices

1. **Always verify payments server-side** - Never trust client claims
2. **Use environment variables** - Never commit wallet addresses or API keys
3. **Set payment timeouts** - Expire payment requests after 15-30 minutes
4. **Monitor transactions** - Log all payment attempts and verifications
5. **Rate limit free tiers** - Prevent abuse of free access
6. **Use testnet first** - Test thoroughly before mainnet

### Payment Verification

Payment Gate verifies payments **on-chain** for maximum security:

- **Solana**: Uses `@solana/pay` to verify transactions on-chain
- **Lightning**: Checks invoice status with LNBits/BTCPay
- **Ethereum L2**: Verifies transaction receipt on Base/Arbitrum/Optimism

No trust required - all payments are cryptographically verified.

## 🛠️ Development

### Testing Locally

```bash
# Use devnet for Solana
SOLANA_NETWORK=devnet

# Use testnet for Lightning
LIGHTNING_NETWORK=testnet

# Development mode (skip payments)
NODE_ENV=development
```

### Example Project

See the [example](./examples/nextjs-app-router) for a complete Next.js implementation:

```bash
cd examples/nextjs-app-router
bun install
bun dev
```

## 📖 API Reference

### PaymentGate Class

```typescript
class PaymentGate {
  constructor(config: PaymentGateConfig)

  // Check if endpoint requires payment
  requiresPayment(endpoint: string): boolean

  // Generate 402 response
  generatePaymentRequired(
    endpoint: string,
    requestMetadata?: RequestMetadata
  ): Promise<Http402Response>

  // Verify payment
  verifyPayment(
    paymentId: string,
    chain?: PaymentChain
  ): Promise<PaymentVerification>

  // Check rate limit
  checkRateLimit(
    key: string,
    endpoint: string,
    isPaid: boolean
  ): Promise<RateLimitResult>
}
```

### Types

See [types.ts](./src/core/types.ts) for complete type definitions.

## 🤝 Contributing

Payment Gate is open source! Contributions welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © Decebal Dobrica

## 🔗 Links

- [Documentation](https://github.com/decebaldobrica/payment-gate)
- [NPM Package](https://www.npmjs.com/package/@decebal/payment-gate)
- [Report Issues](https://github.com/decebaldobrica/payment-gate/issues)
- [Roadmap](./ROADMAP.md)

## 💬 Support

- **Email**: decebal@decebaldobrica.com
- **Twitter**: [@decebaldobrica](https://twitter.com/decebaldobrica)
- **Discord**: [Join our community](#)

---

**Built with ❤️ for the decentralized web**

Made by [Decebal Dobrica](https://decebaldobrica.com) - Available for consulting on crypto payment integrations.
