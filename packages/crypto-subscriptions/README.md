# @decebal/crypto-subscriptions

> Production-ready crypto subscription payments for **Solana**, **Bitcoin Lightning**, and **Ethereum L2**

[![npm version](https://img.shields.io/npm/v/@decebal/crypto-subscriptions.svg)](https://www.npmjs.com/package/@decebal/crypto-subscriptions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A clean, type-safe NPM package for accepting cryptocurrency subscription payments across multiple blockchains. Perfect for SaaS products, newsletters, memberships, and any subscription-based service.

## 🚀 Features

- ✅ **3 Payment Chains** - Solana, Bitcoin Lightning, Ethereum L2 (Base/Arbitrum/Optimism)
- ✅ **Ultra-Low Fees** - <$0.001 (Solana) to <$0.01 (Lightning) to $0.01-$0.50 (Ethereum L2)
- ✅ **Fast Confirmations** - 1-2 seconds (Solana), instant (Lightning), 1-2 minutes (Ethereum L2)
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Framework Agnostic** - Works with Next.js, React, Node.js, or any JavaScript project
- ✅ **Database Agnostic** - Bring your own database (Supabase, PostgreSQL, MongoDB, etc.)
- ✅ **Production Ready** - Battle-tested payment verification and error handling
- ✅ **Easy Integration** - Simple API, extensive documentation
- ✅ **React Components** - Pre-built UI components (optional)

## 📦 Installation

```bash
# npm
npm install @decebal/crypto-subscriptions

# yarn
yarn add @decebal/crypto-subscriptions

# pnpm
pnpm add @decebal/crypto-subscriptions

# bun
bun add @decebal/crypto-subscriptions
```

## 🎯 Quick Start

### 1. Basic Setup

```typescript
import { CryptoSubscriptions } from '@decebal/crypto-subscriptions'

const subscriptions = new CryptoSubscriptions({
  // Solana configuration
  solana: {
    network: 'mainnet-beta',
    merchantWallet: 'YOUR_SOLANA_WALLET_ADDRESS',
  },

  // Bitcoin Lightning configuration
  lightning: {
    network: 'mainnet',
    provider: 'lnbits',
    lnbitsUrl: 'https://your-lnbits-instance.com',
    lnbitsApiKey: 'YOUR_LNBITS_API_KEY',
  },

  // Ethereum L2 configuration (Base recommended)
  ethereum: {
    network: 'base',
    merchantWallet: '0xYOUR_ETHEREUM_ADDRESS',
  },
})
```

### 2. Define Your Pricing Tiers

```typescript
const pricingTiers = {
  free: {
    tier: 'free',
    name: 'Free',
    description: 'Basic features',
    features: ['Feature 1', 'Feature 2'],
    prices: {
      monthly: { usd: 0 },
    },
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    description: 'All features',
    features: ['Everything in Free', 'Feature 3', 'Feature 4'],
    prices: {
      monthly: { usd: 14.99 },
      yearly: { usd: 149.90 }, // 17% discount
    },
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    description: 'Unlimited everything',
    features: ['Everything in Premium', 'Feature 5', 'Priority support'],
    prices: {
      monthly: { usd: 49.99 },
      yearly: { usd: 499.90 },
      lifetime: { usd: 999 },
    },
  },
}
```

### 3. Create a Payment

```typescript
// User selects premium, monthly, and wants to pay with Solana
const payment = await subscriptions.createSubscriptionPayment(
  {
    subscriberId: 'user_123',
    subscriberEmail: 'user@example.com',
    tier: 'premium',
    interval: 'monthly',
    chain: 'solana',
  },
  pricingTiers.premium
)

console.log('Payment created:', payment)
// {
//   paymentId: '...',
//   amount: 0.065, // SOL
//   currency: 'SOL',
//   chain: 'solana',
//   status: 'pending',
//   expiresAt: Date,
//   solana: {
//     recipient: '...',
//     reference: '...',
//     qrCode: '<svg>...</svg>' // QR code for mobile wallets
//   }
// }
```

### 4. Verify Payment

```typescript
// After user pays, verify the payment
const verification = await subscriptions.verifyPayment(
  payment.paymentId,
  'solana',
  payment.amount
)

if (verification.verified) {
  // Payment confirmed! Activate subscription
  const subscription = await subscriptions.activateSubscription(
    'user_123',
    {
      subscriberId: 'user_123',
      subscriberEmail: 'user@example.com',
      tier: 'premium',
      interval: 'monthly',
      chain: 'solana',
    },
    verification
  )

  console.log('Subscription activated:', subscription)
}
```

## 🔧 Advanced Usage

### Database Integration

Implement the `DatabaseAdapter` interface to use your own database:

```typescript
import { DatabaseAdapter } from '@decebal/crypto-subscriptions'
import { createClient } from '@supabase/supabase-js'

class SupabaseAdapter implements DatabaseAdapter {
  private supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  async createPayment(payment) {
    const { data } = await this.supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()
    return data
  }

  async getPayment(paymentId) {
    const { data } = await this.supabase
      .from('payments')
      .select()
      .eq('paymentId', paymentId)
      .single()
    return data
  }

  // ... implement other methods
}

// Use with CryptoSubscriptions
const subscriptions = new CryptoSubscriptions({
  solana: { /*...*/ },
  lightning: { /*...*/ },
  ethereum: { /*...*/ },
  database: new SupabaseAdapter(),
})
```

### Webhooks

```typescript
// webhook.ts - Handle payment confirmations
import { WebhookEvent } from '@decebal/crypto-subscriptions'

export async function handleWebhook(event: WebhookEvent) {
  switch (event.type) {
    case 'payment.confirmed':
      // Activate subscription
      await activateUserSubscription(event.subscriberId)
      // Send welcome email
      await sendWelcomeEmail(event.subscriberId)
      break

    case 'payment.failed':
      // Notify user
      await sendPaymentFailedEmail(event.subscriberId)
      break

    case 'subscription.renewed':
      // Handle renewal
      break

    case 'subscription.cancelled':
      // Handle cancellation
      break
  }
}
```

### Poll for Payment (Real-time)

```typescript
// Poll for payment confirmation (useful for UI)
const handler = new SolanaPayHandler(solanaConfig)

const verification = await handler.pollPayment(
  payment.solana.reference,
  payment.amount,
  60000, // timeout: 60 seconds
  2000   // poll interval: 2 seconds
)

if (verification.verified) {
  console.log('Payment confirmed!')
}
```

## 🎨 React Components (Coming Soon)

```tsx
import { PaymentSelector, QRCodeDisplay } from '@decebal/crypto-subscriptions/react'

function CheckoutPage() {
  return (
    <div>
      <PaymentSelector
        tiers={pricingTiers}
        onPaymentCreated={(payment) => {
          console.log('Payment created:', payment)
        }}
      />

      <QRCodeDisplay payment={payment} />
    </div>
  )
}
```

## 💰 Fee Comparison

| Amount | Stripe (3%) | Solana | Lightning | Ethereum L2 |
|--------|-------------|--------|-----------|-------------|
| $10    | $0.30       | <$0.001| <$0.01    | $0.01-$0.10 |
| $50    | $1.50       | <$0.001| <$0.01    | $0.10-$0.30 |
| $100   | $3.00       | <$0.001| <$0.01    | $0.20-$0.50 |

**Savings:** 95-99% compared to traditional payment processors

## 🔐 Security Best Practices

1. **Verify payments server-side** - Always verify payments on your backend
2. **Use environment variables** - Never commit API keys or merchant wallets
3. **Implement webhooks** - Don't rely solely on client-side verification
4. **Set payment timeouts** - Expire payment requests after 15-30 minutes
5. **Monitor transactions** - Log all payment attempts and verifications
6. **Use testnet first** - Test thoroughly before going to mainnet

## 📊 Supported Networks

### Solana
- **Mainnet Beta** (recommended)
- **Devnet** (testing)
- **Testnet** (testing)

### Bitcoin Lightning
- **LNBits** (self-hosted or hosted)
- **BTCPay Server** (self-hosted)

### Ethereum L2
- **Base** (recommended - Coinbase L2)
- **Arbitrum** (popular, low fees)
- **Optimism** (alternative)

## 🛠️ Configuration

### Environment Variables

```bash
# Solana
SOLANA_NETWORK=mainnet-beta
SOLANA_MERCHANT_WALLET=YOUR_WALLET_ADDRESS
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Bitcoin Lightning (LNBits)
LIGHTNING_NETWORK=mainnet
LNBITS_URL=https://your-lnbits.com
LNBITS_API_KEY=your_api_key

# Bitcoin Lightning (BTCPay)
BTCPAY_URL=https://your-btcpay.com
BTCPAY_API_KEY=your_api_key
BTCPAY_STORE_ID=your_store_id

# Ethereum L2
ETHEREUM_NETWORK=base
ETHEREUM_MERCHANT_WALLET=0xYOUR_ADDRESS
ETHEREUM_RPC_URL=https://mainnet.base.org
```

## 📚 API Reference

### `CryptoSubscriptions`

Main class for managing subscriptions.

#### Methods

- `createSubscriptionPayment(request, pricing)` - Create a payment
- `verifyPayment(paymentId, chain, amount)` - Verify a payment
- `activateSubscription(subscriberId, request, verification)` - Activate subscription
- `getSubscription(subscriberId)` - Get subscription details
- `cancelSubscription(subscriptionId)` - Cancel subscription
- `upgradeSubscription(subscriptionId, newTier, paymentId)` - Upgrade tier
- `isSubscriptionActive(subscriberId)` - Check if active
- `getPriceConversions(usdAmount)` - Get prices in all currencies

## 🤝 Contributing

This package is being prepared for open source release. Stay tuned!

## 📄 License

MIT © Decebal Dobrica

## 🔗 Links

- [Documentation](https://github.com/decebaldobrica/crypto-subscriptions)
- [NPM Package](https://www.npmjs.com/package/@decebal/crypto-subscriptions)
- [Report Issues](https://github.com/decebaldobrica/crypto-subscriptions/issues)

---

**Built with ❤️ for the crypto community**

Made by [Decebal Dobrica](https://decebaldobrica.com) - Available for consulting on crypto payment integrations.
