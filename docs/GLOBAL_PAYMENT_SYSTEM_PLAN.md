# Global Payment System - Implementation Plan

## Overview

Replace the Buy Me a Coffee functionality on `/services` with an integrated global payment system that:
1. Uses the existing Solana Pay infrastructure from `/contact`
2. Integrates Supabase for user authentication and payment tracking
3. Unlocks service pricing and content based on what users have paid for
4. Provides a seamless, authenticated content gating experience

## Current State Analysis

### Existing Payment Infrastructure

**Location**: `/contact` page via `ContactBookingPage` component

**Components**:
- `src/actions/payment-action.ts` - Server Actions for Solana Pay
- `src/lib/meetingPayments.ts` - Meeting pricing configuration
- `src/lib/chatHistory.ts` - SQLite database with `payments` table
- Solana Pay integration with QR codes and blockchain verification

**Features**:
- Meeting booking with tiered pricing (Quick Chat, Discovery Call, Strategy Session, Deep Dive)
- Service deposits for different offerings (Fractional CTO, Case Studies, Technical Writing, Architecture Docs)
- Payment verification via Solana blockchain
- Transaction tracking in SQLite database

### Current Services Page Issues

**Location**: `/services` page

**Current Approach**:
- Uses `PricingGate` component to gate pricing content
- Requires users to send $5+ ETH to an address in the footer
- Uses localStorage to track "unlocked" status
- Manual email entry after payment
- No authentication or verification

**Problems**:
1. No integration with existing payment system
2. Manual, unverified payment process
3. No user authentication
4. No server-side verification of payment
5. No tracking of what users paid for
6. Uses different crypto (ETH) than the main payment system (Solana)

## Proposed Architecture

### Phase 1: Supabase Integration

#### 1.1 Setup Supabase Auth

**Install Dependencies**:
```bash
bun add @supabase/supabase-js @supabase/ssr
```

**Auth Providers**:
- Google OAuth (primary)
- GitHub OAuth (secondary)
- Email/password (fallback)

**Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**File Structure**:
```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client (App Router)
│   │   └── middleware.ts      # Auth middleware
│   └── auth/
│       ├── actions.ts         # Auth server actions
│       └── hooks.ts           # Auth hooks
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts       # OAuth callback handler
│   │   ├── signin/
│   │   │   └── page.tsx       # Sign in page
│   │   └── signout/
│   │       └── route.ts       # Sign out handler
│   └── middleware.ts          # Auth middleware
```

#### 1.2 Database Schema

**Supabase Tables**:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions (replaces SQLite payments table)
CREATE TABLE public.payment_transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  meeting_id TEXT,
  service_type TEXT NOT NULL, -- 'meeting', 'service_access', 'deposit'
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'SOL',
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'failed')),
  signature TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User service access (tracks what users have paid for)
CREATE TABLE public.user_service_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  service_slug TEXT NOT NULL, -- 'all-pricing', 'fractional-cto', 'technical-writing', etc.
  payment_id TEXT REFERENCES public.payment_transactions(id),
  access_type TEXT NOT NULL CHECK(access_type IN ('full_pricing', 'case_study', 'documentation', 'consultation')),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
  UNIQUE(user_id, service_slug)
);

-- Create indexes
CREATE INDEX idx_payments_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payments_status ON public.payment_transactions(status);
CREATE INDEX idx_service_access_user_id ON public.user_service_access(user_id);
CREATE INDEX idx_service_access_service ON public.user_service_access(service_slug);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_service_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert/update payments
CREATE POLICY "Service can manage payments" ON public.payment_transactions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Users can view their own service access
CREATE POLICY "Users can view own access" ON public.user_service_access
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage service access
CREATE POLICY "Service can manage access" ON public.user_service_access
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

### Phase 2: Global Payment Component

#### 2.1 Unified Payment Flow

**New Component**: `src/components/ServicePaymentGate.tsx`

**Features**:
- Replaces `PricingGate` component
- Checks user authentication status
- Verifies user's service access via Supabase
- Displays pricing options if not authenticated
- Shows payment options via Solana Pay
- Unlocks content after payment verification

**Payment Options**:
```typescript
export const SERVICE_ACCESS_PRICING = {
  'all-pricing': {
    name: 'All Services Pricing',
    description: 'Unlock transparent pricing for all my services',
    price: 0.023, // ~$5 at $215/SOL
    priceUSD: 5,
    serviceSlug: 'all-pricing',
    accessType: 'full_pricing',
    benefits: [
      'View all Fractional CTO packages',
      'See Technical Writing pricing',
      'Access Case Study pricing',
      'View Architecture Documentation pricing',
      'Lifetime access',
    ],
  },
  'fractional-cto-info': {
    name: 'Fractional CTO Deep Dive',
    description: 'Detailed guide + case studies',
    price: 0.093, // ~$20 at $215/SOL
    priceUSD: 20,
    serviceSlug: 'fractional-cto',
    accessType: 'case_study',
    benefits: [
      'Everything in All Services Pricing',
      'Detailed CTO engagement guide',
      '3 real client case studies',
      'ROI calculator',
      '30-minute consultation',
    ],
  },
  // Add more service access options...
}
```

#### 2.2 Payment Server Actions

**Update**: `src/actions/payment-action.ts`

**New Actions**:
```typescript
// Initialize service access payment
export async function initializeServicePayment(input: {
  serviceSlug: string
  userId: string
  conversationId?: string
})

// Verify payment and grant access
export async function verifyAndGrantAccess(input: {
  paymentId: string
  reference: string
  userId: string
})

// Check user's service access
export async function checkServiceAccess(input: {
  userId: string
  serviceSlug: string
})

// Get user's all access records
export async function getUserAccessRecords(userId: string)
```

#### 2.3 Supabase Integration Layer

**New File**: `src/lib/supabase/payments.ts`

**Functions**:
```typescript
// Save payment to Supabase
export async function savePaymentToSupabase(
  userId: string,
  amount: number,
  reference: string,
  serviceType: string,
  metadata?: Record<string, any>
)

// Update payment status
export async function updateSupabasePaymentStatus(
  paymentId: string,
  status: 'pending' | 'confirmed' | 'failed',
  signature?: string
)

// Grant service access
export async function grantServiceAccess(
  userId: string,
  serviceSlug: string,
  paymentId: string,
  accessType: string
)

// Check if user has access
export async function hasServiceAccess(
  userId: string,
  serviceSlug: string
): Promise<boolean>

// Get user's active access
export async function getUserActiveAccess(userId: string)
```

### Phase 3: UI/UX Updates

#### 3.1 Services Page Redesign

**Update**: `src/app/services/page.tsx`

**Changes**:
- Add authentication check at the top
- Show sign-in prompt for unauthenticated users
- Replace `PricingGate` with `ServicePaymentGate`
- Display user's access status if authenticated
- Show "Already unlocked" badge for paid services

**User Journey**:
1. User visits `/services`
2. If not signed in → Prompt to sign in (inline, non-modal)
3. If signed in but no access → Show payment options
4. If signed in with access → Show unlocked content

#### 3.2 Authentication UI

**New Component**: `src/components/AuthPrompt.tsx`

**Features**:
- Inline sign-in/sign-up form
- Social auth buttons (Google, GitHub)
- Email/password option
- Clear value proposition
- No modal/popup (better UX)

**Design**:
```
┌─────────────────────────────────────────────┐
│  🔒 Sign in to unlock service pricing       │
│                                             │
│  [Continue with Google] [Continue with GH]  │
│                                             │
│  ─────────────── OR ───────────────         │
│                                             │
│  Email: ___________________________         │
│  Password: _________________________        │
│                                             │
│  [Sign In] [Create Account]                │
│                                             │
│  ✓ Instant access after payment             │
│  ✓ Track your purchases                     │
│  ✓ Lifetime access to pricing               │
└─────────────────────────────────────────────┘
```

#### 3.3 Payment Modal/Section

**New Component**: `src/components/ServicePaymentModal.tsx`

**Features**:
- Display selected service access option
- Show price in SOL and USD
- Generate Solana Pay QR code
- Show payment status
- Verify payment in real-time
- Grant access automatically

**Flow**:
1. User clicks "Unlock Pricing" or "Unlock [Service]"
2. Modal/section shows payment options
3. Display QR code for Solana Pay
4. Poll for payment verification
5. Show success message
6. Refresh page to show unlocked content

### Phase 4: Migration Strategy

#### 4.1 Database Migration

**Steps**:
1. Keep existing SQLite database for backward compatibility
2. Sync new payments to both SQLite and Supabase
3. Create migration script for existing payments
4. Gradually phase out SQLite for new features

**Migration Script**: `scripts/migrate-payments-to-supabase.ts`

#### 4.2 Feature Flags

**Use Environment Variable**:
```env
NEXT_PUBLIC_USE_SUPABASE_PAYMENTS=true
```

**Gradual Rollout**:
- Phase 1: Both systems run in parallel
- Phase 2: New features Supabase-only
- Phase 3: Deprecate SQLite for payments

#### 4.3 Backward Compatibility

**localStorage Handling**:
- Check for existing localStorage `pricing_unlocked`
- If found, prompt user to create account and link their access
- Provide migration path for existing "unlocked" users

### Phase 5: Additional Features

#### 5.1 User Dashboard

**New Route**: `src/app/dashboard/page.tsx`

**Features**:
- View payment history
- See active service access
- Download invoices
- Manage account settings

#### 5.2 Email Notifications

**Integration**: Use existing Resend setup

**Triggers**:
- Payment received
- Service access granted
- Payment failed
- Account created

#### 5.3 Admin Panel (Future)

**Route**: `src/app/admin/payments/page.tsx`

**Features**:
- View all payments
- Manually grant/revoke access
- Analytics and reporting
- Refund management

## Implementation Checklist

### Setup Phase
- [ ] Install Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Create Supabase project
- [ ] Configure OAuth providers (Google, GitHub)
- [ ] Set up environment variables
- [ ] Create database tables and policies

### Development Phase
- [ ] Create Supabase client utilities (`client.ts`, `server.ts`)
- [ ] Implement auth server actions
- [ ] Create auth UI components (`AuthPrompt`, `SignInPage`)
- [ ] Build `ServicePaymentGate` component
- [ ] Update payment server actions
- [ ] Create Supabase payment integration layer
- [ ] Update `/services` page
- [ ] Build payment modal/section
- [ ] Add user dashboard

### Testing Phase
- [ ] Test OAuth flows (Google, GitHub)
- [ ] Test payment initialization
- [ ] Test payment verification
- [ ] Test access granting
- [ ] Test RLS policies
- [ ] Test edge cases (expired sessions, failed payments)
- [ ] Test migration from localStorage

### Deployment Phase
- [ ] Deploy Supabase schema
- [ ] Configure production OAuth credentials
- [ ] Set up production environment variables
- [ ] Create migration script for existing data
- [ ] Deploy application
- [ ] Monitor payment flows

## Security Considerations

1. **Row Level Security (RLS)**: All Supabase tables use RLS to prevent unauthorized access
2. **Server-Side Verification**: Payment verification happens server-side via blockchain
3. **Session Management**: Use Supabase's built-in session management
4. **CSRF Protection**: Next.js Server Actions have built-in CSRF protection
5. **Rate Limiting**: Implement rate limiting on payment endpoints
6. **Webhook Security**: Validate Solana Pay webhooks (if using)

## Cost Analysis

### Supabase Costs
- **Free Tier**: 500MB database, 2GB bandwidth, 50,000 monthly active users
- **Pro Tier**: $25/month - More than sufficient for expected usage
- **Auth**: Included in all plans

### Infrastructure
- **Current**: SQLite (no cost, file-based)
- **Proposed**: Supabase (free tier initially, $25/month for scale)
- **Net Impact**: +$0 to +$25/month depending on usage

### Development Time
- **Estimated**: 2-3 weeks for full implementation
- **Phase 1 (MVP)**: 1 week (basic auth + payment gating)
- **Phase 2 (Full)**: 1-2 weeks (dashboard, migration, polish)

## Rollout Plan

### Week 1: Foundation
- Set up Supabase project and auth
- Create database schema
- Build basic auth UI

### Week 2: Payment Integration
- Update payment actions
- Build payment gate component
- Integrate with services page

### Week 3: Polish & Testing
- Build user dashboard
- Test all flows
- Create migration scripts
- Deploy to production

### Week 4: Monitoring & Iteration
- Monitor payment flows
- Fix bugs
- Gather user feedback
- Iterate on UX

## Success Metrics

- **Authentication Rate**: % of visitors who sign in
- **Payment Conversion**: % of authenticated users who pay
- **Access Utilization**: % of users who view pricing after paying
- **Payment Success Rate**: % of payments that complete successfully
- **User Satisfaction**: Qualitative feedback on new flow

## Questions to Resolve

1. Should we offer a free tier (view pricing without payment)?
2. What should be the pricing for "unlock all services"?
3. Should we integrate with Stripe as well for card payments?
4. Do we want to offer refunds, and if so, how?
5. Should access expire, or is it lifetime?
6. Do we want to offer bundle pricing (multiple services at discount)?

## Next Steps

1. Review this plan with stakeholders
2. Get approval on architecture and database schema
3. Create Supabase project and configure
4. Start implementation with Phase 1

---

**Document Version**: 1.0
**Last Updated**: 2025-10-10
**Author**: Claude Code Assistant
