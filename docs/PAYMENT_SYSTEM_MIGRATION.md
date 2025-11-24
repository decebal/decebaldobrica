# Payment System Consolidation & Migration Guide

## Overview

This document describes the consolidation of all payment systems (Solana, BTC, Ethereum) in the monorepo into a unified, database-backed payment system using Supabase.

## Problem Statement

Before this consolidation, the payment system was fragmented across multiple implementations:

### 1. **Meeting Payments** (`lib/meetingPayments.ts`)
- ❌ **In-memory storage** - data lost on server restart
- ❌ **SOL-only** - no multi-chain support
- ❌ **Not persistent** - arrays in memory
- ✅ Used for meeting booking payments

### 2. **Service Access Payments** (`lib/supabase/payments.ts`)
- ✅ **Supabase-backed** - persistent storage
- ✅ **Modern implementation**
- ⚠️  **SOL-only in practice** - not fully multi-chain
- ✅ Used for gating services

### 3. **Newsletter Payments** (`app/newsletter/pricing/page.tsx` + `api/newsletter/upgrade/route.ts`)
- ✅ **Supabase-backed** - persistent storage
- ⚠️  **UI supports multi-chain, but only SOL implemented**
- ✅ Most recent implementation
- ✅ Used for newsletter subscriptions

### 4. **Multi-Chain Configuration** (`lib/cryptoPayments.ts`)
- ⚠️  **Configuration only** - BTC, ETH, USDC defined but NOT implemented
- ❌ **No actual payment processing** for BTC/ETH/USDC
- Just network configs and gateway recommendations

### 5. **Duplicate Payment Logic** (`actions/payment-action.ts`)
- ❌ **Two separate implementations** - meeting payments vs service payments
- ❌ **Duplicated verification code**
- ❌ **Inconsistent patterns**

## Solution: Unified Payment System

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UNIFIED PAYMENT SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Meetings   │  │   Services   │  │  Newsletter  │     │
│  │   Bookings   │  │    Access    │  │     Subs     │     │
│  └───────┬──────┘  └───────┬──────┘  └───────┬──────┘     │
│          │                 │                  │            │
│          └─────────────────┼──────────────────┘            │
│                            │                               │
│                    ┌───────▼────────┐                      │
│                    │    payments    │ (Unified Table)      │
│                    │   (Supabase)   │                      │
│                    └────────────────┘                      │
│                                                             │
│  Configuration:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  lib/payments/config.ts  (TypeScript Definitions)   │   │
│  │  payment_config table    (Supabase - Dynamic)       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Operations:                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  lib/payments/index.ts   (Unified API)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

#### Core Tables

1. **`user_profiles`** - Wallet-based user authentication
2. **`payments`** - Unified payment tracking for ALL payment types
3. **`service_access`** - Service/content gating
4. **`meeting_bookings`** - Meeting scheduling (replaces in-memory storage)
5. **`payment_config`** - Dynamic pricing configuration

See `supabase/migrations/create_unified_payment_system.sql` for complete schema.

### TypeScript Libraries

1. **`lib/payments/config.ts`** - Payment configuration
   - Consolidates all pricing from scattered files
   - TypeScript definitions for payment types
   - Helper functions for price lookups

2. **`lib/payments/index.ts`** - Unified payment operations
   - Supabase database operations
   - User profile management
   - Payment creation and verification
   - Service access grants
   - Meeting booking management

## Migration Status

### ✅ Completed

1. **Database Schema** - Created unified payment schema in Supabase
2. **Payment Configuration** - Consolidated all pricing into `lib/payments/config.ts`
3. **Payment Library** - Created unified API in `lib/payments/index.ts`

### 🔄 In Progress

4. **Update Payment Actions** - Refactor `actions/payment-action.ts` to use unified system
5. **Update Components** - Migrate components to use new API

### ⏳ Pending

6. **Remove Deprecated Code** - Clean up old payment files
7. **Testing** - End-to-end testing of all payment flows

## Migration Steps

### Step 1: Run Database Migration

```bash
# Run the unified payment system migration in Supabase
# File: supabase/migrations/create_unified_payment_system.sql
```

This creates:
- `user_profiles` table
- `payments` table (replaces in-memory storage)
- `service_access` table
- `meeting_bookings` table
- `payment_config` table
- Helper functions and views

### Step 2: Sync Payment Configuration

After running the migration, the `payment_config` table will be populated with initial data for:
- Meeting types (4 types)
- Service tiers (1 tier: "all-pricing")
- Newsletter tiers (3 tiers: free, premium, founding)

These are automatically inserted by the migration SQL.

### Step 3: Update Server Actions

Replace the existing payment actions with new unified actions:

**Before:**
```typescript
// actions/payment-action.ts
import { createPaymentTransaction } from '@/lib/meetingPayments' // in-memory
```

**After:**
```typescript
// actions/payment-action.ts
import { createPayment, updatePaymentStatus } from '@/lib/payments' // Supabase
```

### Step 4: Update Components

Replace component imports:

**Before:**
```typescript
import { MEETING_TYPES_WITH_PRICING } from '@/lib/meetingPayments'
import { SERVICE_ACCESS_TIERS } from '@/lib/serviceAccessConfig'
```

**After:**
```typescript
import { MEETING_TYPES, SERVICE_TIERS, getPaymentConfig } from '@/lib/payments'
```

### Step 5: Remove Deprecated Files

Once migration is complete and tested, remove these files:

```
apps/web/src/lib/meetingPayments.ts          ❌ DELETE
apps/web/src/lib/serviceAccessConfig.ts      ❌ DELETE
apps/web/src/lib/supabase/payments.ts        ❌ DELETE (merged into lib/payments/index.ts)
apps/web/src/lib/cryptoPayments.ts           ⚠️  KEEP (network config still useful)
```

## Code Changes Required

### Files That Need Updates

1. **`src/actions/payment-action.ts`**
   - Replace `createPaymentTransaction()` with `createPayment()`
   - Replace `getPaymentTransaction()` with `getPayment()`
   - Replace `updatePaymentStatus()` with unified version
   - Remove duplicate service payment logic

2. **`src/components/payments/PaymentModal.tsx`**
   - Update imports to use `lib/payments`
   - Use `createPayment()` instead of `initializeServicePayment()`
   - Use `getPayment()` for status checks

3. **`src/components/ContactBookingPage.tsx`**
   - Update meeting type imports
   - Use `MEETING_TYPES` from `lib/payments`
   - Use `createMeetingBooking()` for persistence

4. **`src/components/payments/ServicePaymentGate.tsx`**
   - Update service tier imports
   - Use `hasServiceAccess()` from `lib/payments`
   - Use `grantServiceAccess()` after payment

5. **`src/app/newsletter/pricing/page.tsx`**
   - Update newsletter tier imports
   - Use `NEWSLETTER_TIERS` from `lib/payments`
   - Keep same UI, just update data source

## Multi-Chain Payment Support

### Current State
- ✅ **Solana Pay** - Fully implemented
- ⚠️  **BTC/ETH/USDC** - Configuration exists, implementation needed

### To Add BTC/ETH/USDC Support

1. **Update Payment Gateways**
   - Integrate BTCPay Server for Bitcoin
   - Integrate Request Network for Ethereum/USDC
   - Or use NOWPayments for all-in-one

2. **Update Payment Actions**
   - Add gateway-specific verification logic
   - Support different transaction formats
   - Handle different confirmation times

3. **Update Components**
   - Make `CryptoPaymentSelector` functional (currently just UI)
   - Add wallet connection for Ethereum
   - Add Lightning Network support for Bitcoin

4. **Database Updates**
   - Schema already supports multi-chain
   - Just need to populate `chain`, `network`, `currency` correctly

## Benefits of Unified System

### 1. **Persistent Storage**
- ✅ No more data loss on server restart
- ✅ All payments tracked in database
- ✅ Historical payment data

### 2. **Consistent API**
- ✅ Single source of truth for payment operations
- ✅ Consistent patterns across all payment types
- ✅ Easier to maintain and extend

### 3. **Multi-Chain Ready**
- ✅ Database schema supports all chains
- ✅ Configuration supports BTC, ETH, USDC
- ⚠️  Just needs gateway integration

### 4. **Better Analytics**
- ✅ Database views for payment stats
- ✅ Helper functions for common queries
- ✅ Easy to generate reports

### 5. **Unified Configuration**
- ✅ All pricing in one place (`lib/payments/config.ts`)
- ✅ Can be synced to database (`payment_config` table)
- ✅ Easy to update pricing across the entire app

## Testing Checklist

After migration, test these flows:

### Meeting Bookings
- [ ] Free meeting booking (no payment)
- [ ] Paid meeting booking with SOL
- [ ] Payment verification
- [ ] Google Calendar integration
- [ ] Payment status check

### Service Access
- [ ] Unlock pricing with SOL payment
- [ ] Access gate shows content after payment
- [ ] Payment verification
- [ ] Access persists after page reload

### Newsletter Subscriptions
- [ ] Free tier signup
- [ ] Premium tier payment with SOL
- [ ] Founding member payment with SOL
- [ ] Subscription expiration (premium)
- [ ] Lifetime access (founding)

### Multi-User
- [ ] Multiple users can pay for same service
- [ ] User profile creation
- [ ] Payment history
- [ ] Service access list

## Rollback Plan

If issues arise during migration:

1. **Keep old files temporarily** - Don't delete until fully tested
2. **Use feature flag** - Toggle between old and new system
3. **Database backup** - Take snapshot before running migration
4. **Gradual migration** - Migrate one payment type at a time

## Future Enhancements

1. **Admin Dashboard**
   - View all payments
   - Manage service access
   - Refund payments
   - View analytics

2. **Payment Webhooks**
   - Real-time payment notifications
   - Automatic service access grants
   - Email confirmations

3. **Multi-Chain Implementation**
   - Integrate BTCPay for Bitcoin
   - Integrate Request Network for Ethereum
   - Support L2 networks (Polygon, Arbitrum, Base)

4. **Subscription Management**
   - Automatic renewal
   - Cancellation flow
   - Trial periods
   - Proration

## Questions?

If you encounter issues during migration:

1. Check database logs in Supabase
2. Verify RLS policies allow service role access
3. Ensure environment variables are set:
   - `NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS`
   - `SOLANA_RPC_URL`
4. Review error logs in PostHog

## Summary

This consolidation brings together all payment functionality into a unified, database-backed system that:
- ✅ Uses Supabase for persistent storage
- ✅ Supports all payment types (meetings, services, newsletters)
- ✅ Has a consistent API
- ✅ Is ready for multi-chain expansion
- ✅ Provides better analytics and reporting
- ✅ Eliminates duplicate code

The newsletter payment system served as the model, and we've extended that pattern to cover all payment use cases in the monorepo.
