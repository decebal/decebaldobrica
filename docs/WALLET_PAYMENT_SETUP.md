# Wallet-Based Payment System - Setup Guide

## Overview

This guide covers setting up the wallet-based payment system for gating content. Users connect their Solana wallet, pay a small fee, and unlock pricing/content.

## Prerequisites

- Supabase account
- Solana wallet with merchant address
- Solana RPC endpoint (default uses public endpoint)

## Step 1: Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Solana Configuration
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=your-merchant-wallet-address
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# For testing on devnet:
# SOLANA_RPC_URL=https://api.devnet.solana.com
# NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Getting Solana Merchant Wallet

Use your existing Solana wallet address where you want to receive payments:

```bash
# From Phantom wallet: Copy wallet address
# From Solflare wallet: Settings → Copy Address
# From Solana CLI:
solana address
```

## Step 2: Configure Supabase

### Enable Web3 Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Web3 Wallet" provider
3. Enable it
4. No additional configuration needed (works out of the box)

### Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- User profiles (extends auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_chain TEXT DEFAULT 'solana',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE public.payment_transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  wallet_address TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  amount REAL NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'failed')),
  signature TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- User service access (what they've unlocked)
CREATE TABLE public.user_service_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  wallet_address TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  payment_id TEXT REFERENCES public.payment_transactions(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, service_slug)
);

-- Create indexes for better performance
CREATE INDEX idx_payments_wallet ON public.payment_transactions(wallet_address);
CREATE INDEX idx_payments_status ON public.payment_transactions(status);
CREATE INDEX idx_payments_service ON public.payment_transactions(service_slug);
CREATE INDEX idx_access_wallet ON public.user_service_access(wallet_address);
CREATE INDEX idx_access_service ON public.user_service_access(service_slug);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_service_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can read their own data
CREATE POLICY "Users view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users view own payments"
  ON public.payment_transactions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles
      WHERE wallet_address = payment_transactions.wallet_address
    )
  );

CREATE POLICY "Users view own access"
  ON public.user_service_access FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles
      WHERE wallet_address = user_service_access.wallet_address
    )
  );

-- Service role can do everything (for server actions)
CREATE POLICY "Service manages profiles"
  ON public.user_profiles FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service manages payments"
  ON public.payment_transactions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service manages access"
  ON public.user_service_access FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

## Step 3: Configure Service Access Tiers

Edit `src/lib/serviceAccessConfig.ts` to add your pricing:

```typescript
export const SERVICE_ACCESS_TIERS: Record<string, ServiceAccessTier> = {
  'all-pricing': {
    slug: 'all-pricing',
    name: 'Unlock All Pricing',
    description: 'View transparent pricing for all my services',
    price: 0.023, // ~$5 at $215/SOL - adjust based on current SOL price
    priceUSD: 5,
    benefits: [
      'View all Fractional CTO packages & pricing',
      'See Technical Writing rates',
      'Access Case Study pricing',
      'View Architecture Documentation costs',
      'Lifetime access - never expires',
    ],
    popular: true,
  },
  // Add more tiers as needed:
  'premium-content': {
    slug: 'premium-content',
    name: 'Premium Content Access',
    description: 'Unlock exclusive content and case studies',
    price: 0.046, // ~$10
    priceUSD: 10,
    benefits: [
      'Everything in All Pricing',
      'Exclusive case studies',
      'Implementation guides',
      'Code examples',
    ],
  },
}
```

## Step 4: Use ServicePaymentGate

Wrap any content you want to gate:

```tsx
import ServicePaymentGate from '@/components/payments/ServicePaymentGate'

export default function PricingPage() {
  return (
    <div>
      <h1>My Services</h1>

      <ServicePaymentGate serviceSlug="all-pricing">
        {/* This content will be hidden until payment */}
        <div>
          <h2>Pricing Details</h2>
          <p>Service 1: $5,000/month</p>
          <p>Service 2: $10,000/month</p>
        </div>
      </ServicePaymentGate>
    </div>
  )
}
```

## Step 5: Testing

### Test on Devnet

1. Set environment variables to devnet:
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

2. Get devnet SOL from faucet:
```bash
solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet
```

3. Connect wallet and test payment flow

### Test Flow

1. Visit `/services` (or your gated page)
2. Content should be locked
3. Click "Unlock Now"
4. Connect Solana wallet (Phantom, Solflare, etc.)
5. QR code appears with payment details
6. Scan QR or click "Open in Wallet App"
7. Approve transaction in wallet
8. Wait for confirmation (polls every 3 seconds)
9. Content unlocks automatically
10. Refresh page - should stay unlocked

## Step 6: Production Deployment

### Checklist

- [ ] Environment variables set in production
- [ ] Using mainnet-beta network
- [ ] Supabase project in production mode
- [ ] Web3 auth enabled in Supabase
- [ ] Database tables created with RLS policies
- [ ] Service role key kept secret (never exposed to client)
- [ ] Merchant wallet address is correct
- [ ] Test with real SOL (small amount first)

### Security Notes

1. **Service Role Key**: Never expose this to the client. Only use in server actions.
2. **RLS Policies**: Ensure they're enabled to prevent unauthorized access.
3. **Payment Verification**: Always verify on-chain, never trust client.
4. **Rate Limiting**: Consider adding rate limiting to payment endpoints.

## Troubleshooting

### Wallet won't connect

- Check that `NEXT_PUBLIC_SOLANA_NETWORK` matches wallet network
- Try different wallet (Phantom, Solflare)
- Check browser console for errors
- Ensure wallet extension is updated

### Payment not confirming

- Check Solana RPC URL is valid and responding
- Verify merchant address is correct
- Check transaction on Solana Explorer
- Ensure sufficient SOL in wallet for transaction + fee
- Try increasing confirmation timeout (edit PaymentModal.tsx)

### Access not persisting

- Check Supabase RLS policies
- Verify user_service_access table has entry
- Check wallet address matches
- Clear browser cache and reconnect wallet

### Database errors

- Ensure all tables are created
- Check RLS policies are enabled
- Verify service role key has permission
- Check Supabase logs for errors

## Monitoring

### View Payments in Supabase

```sql
-- Recent payments
SELECT
  wallet_address,
  service_slug,
  amount,
  status,
  created_at,
  confirmed_at
FROM payment_transactions
ORDER BY created_at DESC
LIMIT 50;

-- Revenue by service
SELECT
  service_slug,
  COUNT(*) as payments,
  SUM(amount) as total_sol
FROM payment_transactions
WHERE status = 'confirmed'
GROUP BY service_slug;

-- Active users
SELECT COUNT(DISTINCT wallet_address)
FROM user_service_access;
```

### Analytics

Track key metrics:
- Payment conversion rate
- Average time to payment
- Failed payment reasons
- Most popular service tiers

## Next Steps

- [ ] Test thoroughly on devnet
- [ ] Deploy to production
- [ ] Monitor first transactions
- [ ] Gather user feedback
- [ ] Add more service tiers
- [ ] Consider account abstraction for better UX

---

**Need Help?**

Check the following files for implementation details:
- `docs/WALLET_AUTH_ARCHITECTURE.md` - System architecture
- `src/components/payments/ServicePaymentGate.tsx` - Main gate component
- `src/components/payments/PaymentModal.tsx` - Payment flow
- `src/actions/payment-action.ts` - Server actions
- `src/lib/supabase/payments.ts` - Database queries
