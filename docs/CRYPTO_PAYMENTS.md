# Cryptocurrency Payment Integration Guide

This document explains the multi-chain cryptocurrency payment system for accepting BTC, ETH, USDC, and SOL with fee-efficient solutions.

## Supported Cryptocurrencies

### 1. Bitcoin (BTC)
- **Network**: Lightning Network (recommended)
- **Fees**: < $0.01 per transaction
- **Use Case**: Best for all transaction sizes
- **Integration**: BTCPay Server (self-hosted, 0% fees)

### 2. Ethereum (ETH)
- **Network**: Arbitrum / Base / Polygon (Layer 2)
- **Fees**: $0.01 - $0.50
- **Use Case**: Medium to large transactions
- **Integration**: Web3 wallet or Request Network

### 3. USD Coin (USDC)
- **Network**: Polygon / Base (recommended)
- **Fees**: $0.01 - $0.30
- **Use Case**: Stable value payments
- **Integration**: Circle API or Request Network

### 4. Solana (SOL)
- **Network**: Solana mainnet
- **Fees**: < $0.001
- **Use Case**: Small, frequent transactions
- **Integration**: Solana Pay (already implemented)

## Recommended Payment Gateways

### 1. Request Network ⭐ RECOMMENDED
**Best for: ETH & USDC**
- **Fees**: 0.1% (max $2)
- **Type**: Decentralized
- **Pros**:
  - Extremely low fees
  - Self-custody
  - Multi-chain support (Ethereum, Polygon, Arbitrum, etc.)
  - Invoice generation
  - Payment streaming
- **Cons**:
  - No Bitcoin support
  - Requires technical integration
- **Setup**: https://docs.request.network

```bash
npm install @requestnetwork/request-client.js @requestnetwork/payment-processor
```

### 2. BTCPay Server ⭐ RECOMMENDED
**Best for: BTC**
- **Fees**: 0% (self-hosted)
- **Type**: Self-hosted
- **Pros**:
  - Zero fees
  - Lightning Network support
  - Full privacy & self-custody
  - No KYC
  - Open source
- **Cons**:
  - Requires server setup
  - Only Bitcoin
- **Setup**: https://btcpayserver.org

### 3. NOWPayments
**Best for: All currencies**
- **Fees**: 0.5% - 1%
- **Type**: Custodial API
- **Pros**:
  - Supports 200+ cryptocurrencies
  - Easy API integration
  - Auto-conversion to fiat
  - Lightning Network support
- **Cons**:
  - Higher fees
  - KYC may be required
- **Setup**: https://nowpayments.io

### 4. Web3 Direct Integration
**Best for: ETH & USDC**
- **Fees**: Only network fees
- **Type**: Direct wallet connection
- **Pros**:
  - No intermediary fees
  - Full control
  - Can use Layer 2
- **Cons**:
  - Complex UX
  - Need payment verification system
- **Libraries**: wagmi, viem, ethers.js

## Fee Optimization Strategies

### Bitcoin Optimization
1. **Use Lightning Network** for all transactions under $1,000
   - Instant settlement
   - Fees < $0.01
   - Better UX

2. **Batch transactions** for on-chain payments
   - Combine multiple payments
   - Reduces per-transaction cost

### Ethereum Optimization
1. **Use Layer 2 networks**:
   - **Arbitrum**: Best for general use (~$0.10-0.50)
   - **Base**: Coinbase's L2, growing ecosystem (~$0.05-0.30)
   - **Polygon**: Cheapest, most established (~$0.01-0.10)

2. **Avoid mainnet** unless necessary
   - Mainnet fees: $2-50
   - L2 fees: $0.01-0.50
   - 95%+ cost savings

### USDC Optimization
1. **Use Polygon** for small amounts (<$100)
   - Fees: ~$0.01-0.05
   - Fast confirmations

2. **Use Base** for medium amounts ($100-1000)
   - Fees: ~$0.05-0.20
   - Native USDC (no bridging)

3. **Use Circle API** for direct USDC
   - No gas fees
   - Instant settlement
   - Requires API integration

## Implementation Guide

### Step 1: Choose Your Payment Gateway

For **maximum fee efficiency**:
```
BTC → BTCPay Server (self-hosted, 0% fees)
ETH → Request Network on Arbitrum (0.1% + gas)
USDC → Request Network on Polygon (0.1% + gas)
SOL → Solana Pay (already implemented)
```

For **ease of implementation**:
```
All → NOWPayments (0.5-1% fees, API integration)
```

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# Bitcoin (BTCPay Server)
BTCPAY_SERVER_URL=https://your-btcpay-server.com
BTCPAY_STORE_ID=your_store_id
BTCPAY_API_KEY=your_api_key

# Ethereum/USDC (Request Network)
REQUEST_NETWORK_PAYMENT_ADDRESS=0x...
REQUEST_NETWORK_CURRENCY=ETH # or USDC

# Multi-currency (NOWPayments)
NOWPAYMENTS_API_KEY=your_api_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret

# Network preferences
PREFERRED_ETH_NETWORK=arbitrum # or polygon, base
PREFERRED_USDC_NETWORK=polygon # or base
```

### Step 3: Install Dependencies

```bash
# For BTCPay Server
npm install @btcpay/greenfield-api

# For Request Network
npm install @requestnetwork/request-client.js @requestnetwork/payment-processor

# For Web3 Integration
npm install wagmi viem @rainbow-me/rainbowkit

# For NOWPayments
npm install axios # standard HTTP client
```

### Step 4: Implement Payment Flow

See `src/lib/cryptoPayments.ts` for the complete payment method configuration.

Use `CryptoPaymentSelector` component for the UI:

```tsx
import CryptoPaymentSelector from '@/components/CryptoPaymentSelector'

<CryptoPaymentSelector
  amountUsd={100}
  onPaymentMethodSelected={(method, network) => {
    // Handle payment initiation
    console.log(`Pay with ${method} on ${network}`)
  }}
/>
```

## Network Configurations

### Polygon (MATIC)
- **Chain ID**: 137
- **RPC**: https://polygon-rpc.com
- **USDC Address**: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
- **Average Fee**: $0.01-0.10

### Arbitrum
- **Chain ID**: 42161
- **RPC**: https://arb1.arbitrum.io/rpc
- **USDC Address**: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831
- **Average Fee**: $0.10-0.50

### Base
- **Chain ID**: 8453
- **RPC**: https://mainnet.base.org
- **USDC Address**: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- **Average Fee**: $0.05-0.30

## Fee Comparison

| Amount | BTC (Lightning) | ETH (Arbitrum) | USDC (Polygon) | SOL |
|--------|----------------|----------------|----------------|-----|
| $10    | $0.001         | $0.10          | $0.02          | $0.0001 |
| $100   | $0.01          | $0.20          | $0.05          | $0.0001 |
| $1,000 | $0.01          | $0.50          | $0.10          | $0.0001 |

## Security Best Practices

1. **Use hardware wallets** for merchant addresses
2. **Verify payment amounts** on-chain
3. **Set up webhook notifications** for payment confirmations
4. **Implement payment timeouts** (e.g., 15 minutes)
5. **Use testnet** for initial testing
6. **Monitor for double-spending** (especially Bitcoin)
7. **Keep private keys secure** (never commit to repo)

## Testing

### Testnets
- **Bitcoin Testnet**: https://testnet.bitcoin.org
- **Ethereum Goerli**: https://goerli.etherscan.io
- **Polygon Mumbai**: https://mumbai.polygonscan.com
- **Solana Devnet**: (already configured)

### Test Faucets
- **Bitcoin Testnet**: https://testnet-faucet.com/btc-testnet/
- **Ethereum Goerli**: https://goerlifaucet.com
- **Polygon Mumbai**: https://faucet.polygon.technology

## Next Steps

1. **Choose your payment gateway** based on fees and integration complexity
2. **Set up testnet accounts** for chosen gateways
3. **Implement payment flow** in `/services/book` page
4. **Test with testnet** cryptocurrencies
5. **Deploy to production** with mainnet configuration
6. **Monitor transactions** and optimize based on usage

## Support & Resources

- **Request Network**: https://discord.gg/requestnetwork
- **BTCPay Server**: https://chat.btcpayserver.org
- **NOWPayments**: support@nowpayments.io
- **Solana Pay**: https://docs.solanapay.com

## Cost Savings Examples

**Example 1: 100 consultations @ $50 each**
- Traditional processor (3%): $150 in fees
- NOWPayments (1%): $50 in fees
- Request Network (0.1%): $5 in fees
- BTCPay (0%): $0 in fees

**Savings**: Up to $150 (100% of fees) with BTCPay Server

**Example 2: Single $1,000 transaction**
- Credit card (2.9% + $0.30): $29.30
- Coinbase Commerce (1%): $10
- Request Network (0.1%, max $2): $2
- Network fees (L2): ~$0.50

**Total cost with Request Network**: $2.50 vs $29.30 (91% savings)
