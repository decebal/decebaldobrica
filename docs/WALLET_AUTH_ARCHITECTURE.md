# Wallet-Based Payment System Architecture

## Overview

Web3-native payment system using Solana wallet authentication. No email/password, no traditional sign-in - just connect wallet, pay, unlock content.

## Key Technologies

- **Solana Wallet Adapter**: Connect to Phantom, Solflare, etc.
- **Supabase Web3 Auth**: Native Solana wallet authentication via `signInWithWeb3()`
- **Solana Pay**: Existing infrastructure for payments
- **No SQLite**: Supabase only
- **No localStorage**: Server-side verification only

## Architecture

### Flow

1. User visits `/services` → Content is locked
2. Click "Unlock Pricing" → Wallet connect prompt
3. Connect wallet (Phantom/Solflare/etc.)
4. Supabase creates user session linked to wallet address
5. Check if wallet has paid → If yes, unlock; if no, show payment
6. User scans QR code or approves transaction
7. Verify payment on blockchain
8. Grant access in Supabase
9. Content unlocks automatically

### Database Schema (Supabase)

```sql
-- User profiles (linked to wallet address)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
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

-- User service access (what they unlocked)
CREATE TABLE public.user_service_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  wallet_address TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  payment_id TEXT REFERENCES public.payment_transactions(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, service_slug)
);

-- Indexes
CREATE INDEX idx_payments_wallet ON public.payment_transactions(wallet_address);
CREATE INDEX idx_payments_status ON public.payment_transactions(status);
CREATE INDEX idx_access_wallet ON public.user_service_access(wallet_address);
CREATE INDEX idx_access_service ON public.user_service_access(service_slug);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_service_access ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users view own payments" ON public.payment_transactions
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.user_profiles WHERE wallet_address = payment_transactions.wallet_address)
  );

CREATE POLICY "Users view own access" ON public.user_service_access
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.user_profiles WHERE wallet_address = user_service_access.wallet_address)
  );

-- Service role can do everything
CREATE POLICY "Service manages all data" ON public.user_profiles
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service manages payments" ON public.payment_transactions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service manages access" ON public.user_service_access
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

## Implementation

### 1. Dependencies

```bash
bun add @supabase/supabase-js @supabase/ssr
bun add @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base
```

### 2. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Solana (existing)
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=your-wallet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

### 3. File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   ├── wallet-auth.ts         # Wallet auth helpers
│   │   └── payments.ts            # Payment queries
│   └── wallet/
│       └── connection.ts          # Wallet connection helpers
├── components/
│   ├── wallet/
│   │   ├── WalletProvider.tsx     # Solana wallet context
│   │   └── WalletButton.tsx       # Connect wallet button
│   ├── payments/
│   │   ├── ServicePaymentGate.tsx # Payment gate (replaces PricingGate)
│   │   └── PaymentModal.tsx       # QR code + payment flow
│   └── ui/
│       └── ... (existing shadcn components)
├── actions/
│   ├── wallet-action.ts           # Wallet auth actions
│   └── payment-action.ts          # Update with Supabase
└── app/
    ├── services/
    │   └── page.tsx               # Update with wallet gate
    └── providers.tsx              # Wallet + Supabase providers
```

### 4. Service Access Pricing

```typescript
export const SERVICE_ACCESS_TIERS = {
  'all-pricing': {
    name: 'Unlock All Pricing',
    slug: 'all-pricing',
    price: 0.023, // ~$5 at $215/SOL
    priceUSD: 5,
    description: 'View transparent pricing for all services',
    benefits: [
      'Fractional CTO packages & pricing',
      'Technical Writing rates',
      'Case Study pricing',
      'Architecture Documentation costs',
      'Lifetime access',
    ],
  },
}
```

## Key Components

### WalletProvider.tsx

Wraps app with Solana wallet context. Auto-detects Phantom, Solflare, etc.

### WalletButton.tsx

Connect/disconnect wallet button. Shows wallet address when connected.

### ServicePaymentGate.tsx

Main gate component:
- Detects if wallet is connected
- Checks Supabase for payment/access
- Shows payment UI if not paid
- Unlocks content if paid

### wallet-action.ts

Server Actions:
- `signInWithWallet(walletAddress)` - Create/get Supabase user
- `checkWalletAccess(walletAddress, serviceSlug)` - Check if paid
- `verifyAndGrantAccess(paymentId, walletAddress)` - Grant access after payment

## Payment Flow

### Step 1: Connect Wallet

```typescript
// User clicks "Unlock Pricing"
<WalletButton />

// Wallet adapter handles connection
const { publicKey, signMessage } = useWallet()

// Sign message for Supabase
const { data } = await supabase.auth.signInWithWeb3({
  chain: 'solana',
  statement: 'Unlock pricing on decebaldobrica.com'
})
```

### Step 2: Check Access

```typescript
// Server Action
export async function checkWalletAccess(walletAddress: string, serviceSlug: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('user_service_access')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('service_slug', serviceSlug)
    .single()

  return { hasAccess: !!data }
}
```

### Step 3: Show Payment (if needed)

```typescript
// Initialize payment with wallet address
const { data } = await initializeWalletPayment({
  walletAddress: publicKey.toString(),
  serviceSlug: 'all-pricing',
})

// Display QR code
<QRCode value={data.url} />

// Or use wallet adapter for direct payment
const transaction = createSolanaPayTransaction(...)
await sendTransaction(transaction, connection)
```

### Step 4: Verify & Grant Access

```typescript
// Poll for payment confirmation
const { data } = await verifyPayment({
  paymentId,
  reference,
})

// If confirmed, grant access
if (data.status === 'confirmed') {
  await grantServiceAccess({
    walletAddress,
    serviceSlug: 'all-pricing',
    paymentId,
  })

  // Refresh UI - content unlocks
  router.refresh()
}
```

## Supabase Integration

### lib/supabase/client.ts

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### lib/supabase/server.ts

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### lib/supabase/wallet-auth.ts

```typescript
import { createClient } from './client'

export async function signInWithSolanaWallet() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithWeb3({
    chain: 'solana',
    statement: 'Access premium content on decebaldobrica.com',
  })

  if (error) throw error
  return data
}

export async function getCurrentWalletUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

### lib/supabase/payments.ts

```typescript
import { createClient } from '@/lib/supabase/server'

export async function savePaymentToSupabase(
  walletAddress: string,
  serviceSlug: string,
  amount: number,
  reference: string
) {
  const supabase = await createClient()

  // Get user by wallet
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (!profile) throw new Error('User not found')

  // Create payment record
  const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const { error } = await supabase
    .from('payment_transactions')
    .insert({
      id: paymentId,
      user_id: profile.id,
      wallet_address: walletAddress,
      service_slug: serviceSlug,
      amount,
      reference,
      status: 'pending',
    })

  if (error) throw error
  return paymentId
}

export async function confirmPayment(paymentId: string, signature: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('payment_transactions')
    .update({
      status: 'confirmed',
      signature,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', paymentId)

  if (error) throw error
}

export async function grantServiceAccess(
  walletAddress: string,
  serviceSlug: string,
  paymentId: string
) {
  const supabase = await createClient()

  // Get user
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (!profile) throw new Error('User not found')

  // Grant access
  const { error } = await supabase
    .from('user_service_access')
    .upsert({
      user_id: profile.id,
      wallet_address: walletAddress,
      service_slug: serviceSlug,
      payment_id: paymentId,
    }, {
      onConflict: 'wallet_address,service_slug'
    })

  if (error) throw error
}

export async function checkAccess(walletAddress: string, serviceSlug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('user_service_access')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('service_slug', serviceSlug)
    .single()

  return { hasAccess: !!data, access: data }
}
```

## Migration Plan

### Phase 1: Setup (Today)
- ✅ Install dependencies
- ✅ Configure Supabase project
- ✅ Enable Web3 auth in Supabase dashboard
- ✅ Create database tables

### Phase 2: Wallet Integration (Today)
- ✅ Create Supabase client utilities
- ✅ Build WalletProvider + WalletButton
- ✅ Implement wallet auth actions

### Phase 3: Payment Gate (Today/Tomorrow)
- ✅ Build ServicePaymentGate component
- ✅ Update payment actions for Supabase
- ✅ Replace PricingGate on services page

### Phase 4: Testing (Tomorrow)
- ✅ Test wallet connection
- ✅ Test payment flow
- ✅ Test access verification
- ✅ Test across different wallets (Phantom, Solflare)

### Phase 5: Cleanup
- 🗑️ Remove PricingGate component
- 🗑️ Remove localStorage logic
- 🗑️ Keep SQLite for meetings (for now)
- 🗑️ Update Footer to remove Buy Me a Coffee mention

## Benefits Over Previous Approach

1. **Web3 Native**: No email/password, just wallet
2. **Instant**: Connect wallet → pay → access unlocked
3. **Portable**: Access follows wallet, works anywhere
4. **Verifiable**: All payments on-chain
5. **Simple**: No user management, no password resets
6. **Trustless**: Blockchain verification, not database flags

## Security

- ✅ RLS policies prevent unauthorized access
- ✅ Server-side payment verification
- ✅ Blockchain signature validation
- ✅ Supabase session management
- ✅ No localStorage = no client-side manipulation

---

**Ready to build!**
