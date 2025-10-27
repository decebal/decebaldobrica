# Payment Gate Integration - Services Pricing

## Overview

Payment Gate has been integrated to protect the `/api/services/pricing` endpoint with HTTP 402 payment requirement.

**Cost**: $5 (0.023 SOL) one-time payment
**Access**: Lifetime access after payment
**Integration**: Works with existing Supabase payment system

---

## Files Created

### Configuration
- `src/lib/payment-gate/config.ts` - Payment Gate configuration
- `src/lib/payment-gate/helpers.ts` - Integration helper functions

### API Endpoint
- `src/app/api/services/pricing/route.ts` - Protected API endpoint

### Testing
- `scripts/test-payment-gate.ts` - API test script

---

## How It Works

### 1. User Requests Pricing (No Payment)

```bash
GET /api/services/pricing
```

**Response (HTTP 402)**:
```json
{
  "status": 402,
  "message": "Payment required to access this endpoint",
  "paymentOptions": [{
    "chain": "solana",
    "amount": 0.023,
    "currency": "SOL",
    "paymentUrl": "solana:MERCHANT_WALLET?amount=0.023&reference=xyz",
    "qrCode": "data:image/png;base64,...",
    "reference": "xyz"
  }],
  "paymentId": "pg_123_abc",
  "expiresAt": 1698765432000
}
```

### 2. User Pays via Solana Wallet

User scans QR code or uses payment URL with Phantom/Solflare wallet.

### 3. User Retries with Payment ID

```bash
GET /api/services/pricing
Headers: X-Payment-Id: pg_123_abc
```

**Response (HTTP 200)**:
```json
{
  "success": true,
  "access": "granted",
  "pricing": {
    "all-pricing": {
      "name": "Unlock All Pricing",
      "priceSol": 0.023,
      "priceUsd": 5,
      "benefits": [...]
    }
  },
  "message": "Payment verified - you now have lifetime access"
}
```

### 4. Future Requests (With Wallet Address)

```bash
GET /api/services/pricing
Headers: X-Wallet-Address: USER_WALLET_ADDRESS
```

**Response (HTTP 200)** - Access granted automatically (no payment needed)

---

## Environment Variables

Required in `.env.local`:

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=YOUR_WALLET_ADDRESS
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta for production

# Solana RPC (optional - uses public endpoint by default)
SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## Testing

### 1. Start Development Server

```bash
bun dev
```

### 2. Run Test Script

```bash
bun scripts/test-payment-gate.ts
```

Expected output:
```
🧪 Testing Services Pricing API with Payment Gate

Test 1: Calling API without payment...
✅ Received HTTP 402 Payment Required
📦 Payment options: 1 chains available
💰 Solana payment:
   Amount: 0.023 SOL
   Reference: ABC...
   Payment ID: pg_123_abc
   Expires at: ...

Test 2: Calling API with wallet address: FakeWallet...
✅ User needs to pay - HTTP 402 returned

✅ All tests completed!
```

### 3. Test with Real Wallet (Devnet)

1. Open http://localhost:4100/api/services/pricing
2. Copy payment URL from response
3. Open Phantom wallet (set to Devnet)
4. Send 0.023 SOL to the payment URL
5. Wait for confirmation (~2 seconds)
6. Retry API call with `X-Payment-Id` header
7. Verify you receive pricing data

---

## Integration with Existing System

### Supabase Integration

Payment Gate integrates seamlessly with your existing Supabase payment system:

**On Payment Verification** (`config.ts:onPaymentVerified`):
1. Creates payment record in `payments` table
2. Grants access in `service_access` table
3. Links payment to service

**Access Check** (`helpers.ts:hasServicesPricingAccess`):
- Uses existing `hasServiceAccess()` function
- Checks `service_access` table in Supabase
- Returns `true` if user has lifetime access

**No Duplicate Payments**:
- Once user pays, access is stored in Supabase
- Future requests check Supabase first
- HTTP 402 only shown to users without access

---

## API Endpoint Details

### GET /api/services/pricing

**Headers**:
- `X-Wallet-Address` (optional) - Check if wallet has existing access
- `X-Payment-Id` (optional) - Verify payment and grant access

**Responses**:

**200 OK** - User has access:
```json
{
  "success": true,
  "access": "granted",
  "pricing": { ... },
  "message": "You have lifetime access to services pricing"
}
```

**402 Payment Required** - Payment needed:
```json
{
  "status": 402,
  "message": "Payment required to access this endpoint",
  "paymentOptions": [...],
  "paymentId": "pg_xxx",
  "expiresAt": 1698765432000,
  "retryAfterPayment": {
    "method": "GET",
    "url": "/api/services/pricing",
    "headers": { "X-Payment-Id": "pg_xxx" }
  }
}
```

**400 Bad Request** - Payment verification failed:
```json
{
  "success": false,
  "error": "Payment verification failed",
  "details": "..."
}
```

**500 Internal Server Error** - Server error:
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Frontend Integration (Future)

### Option 1: Use Existing UI (Recommended)

Keep your current `ServicePaymentGate.tsx` component - it works perfectly!

The flow:
1. User connects wallet
2. User pays via `PaymentModal`
3. Payment recorded in Supabase
4. API checks Supabase access
5. Returns pricing data

### Option 2: Direct API Integration

For new features without existing UI:

```typescript
import { PaymentGateClient } from '@decebal/payment-gate/client'

const client = new PaymentGateClient({
  preferredChain: 'solana',
  autoRetry: false,
})

async function fetchPricing() {
  const response = await client.fetch('/api/services/pricing', {
    headers: {
      'X-Wallet-Address': wallet.publicKey.toString(),
    },
  })

  if (response.status === 402 && response.payment) {
    // Show payment modal
    setPaymentInfo(response.payment)
  }

  if (response.data) {
    setPricing(response.data.pricing)
  }
}
```

---

## Troubleshooting

### "Payment not found" error

**Cause**: Payment ID not in Payment Gate's state
**Solution**: Payment state is in-memory - restart dev server loses state

### "Payment verification failed"

**Cause**: Transaction not found on Solana blockchain
**Solution**:
- Check Solana network (devnet vs mainnet)
- Wait 2-3 seconds for confirmation
- Verify transaction on Solana Explorer

### "Missing environment variable"

**Cause**: `NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS` not set
**Solution**: Add to `.env.local` file

---

## Next Steps

### Phase 1 (Current) ✅
- [x] Install Payment Gate package
- [x] Create configuration
- [x] Implement services pricing API
- [x] Test API endpoint

### Phase 2 (Newsletter)
- [ ] Implement `/api/newsletter/premium/*` endpoints
- [ ] Add rate limiting for free tier
- [ ] Integrate with newsletter subscription system

### Phase 3 (Multi-Chain)
- [ ] Add Bitcoin Lightning support
- [ ] Add Ethereum L2 (Base) support
- [ ] Update payment modal UI

---

## Support

For issues or questions:
- Check Payment Gate docs: `packages/payment-gate/README.md`
- See integration examples: `packages/payment-gate/examples/newsletter-services-integration.md`
- Review roadmap: `packages/payment-gate/ROADMAP.md`

---

**Status**: ✅ Ready for testing on devnet
**Next Action**: Run `bun dev` and test the API!
