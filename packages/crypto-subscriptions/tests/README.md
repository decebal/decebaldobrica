# Crypto Subscriptions Test Suite

Comprehensive test coverage for the `@decebal/crypto-subscriptions` package.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── solana.test.ts      # Solana Pay handler tests
│   ├── lightning.test.ts   # Lightning Network handler tests
│   └── ethereum.test.ts    # Ethereum L2 handler tests
├── integration/             # Integration tests
│   ├── crypto-subscriptions.test.ts  # Main API integration tests
│   └── database-adapter.test.ts      # Database adapter tests
├── e2e/                     # End-to-end tests
│   └── full-flow.test.ts   # Complete user journey tests
├── mocks/                   # Test mocks and stubs
│   └── database.ts         # Mock database adapter
├── fixtures/                # Test data fixtures
│   ├── config.ts           # Test configuration
│   └── requests.ts         # Test request builders
└── setup.ts                # Global test setup
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run specific test suites
bun test:unit          # Unit tests only
bun test:integration   # Integration tests only
bun test:e2e          # E2E tests only

# Generate coverage report
bun test:coverage
```

## Test Coverage

### Unit Tests

#### Solana Pay Handler (`tests/unit/solana.test.ts`)
- ✅ Payment creation with QR codes
- ✅ Payment verification
- ✅ Payment polling
- ✅ USD to SOL conversion
- ✅ Balance checking
- ✅ Error handling

#### Lightning Network Handler (`tests/unit/lightning.test.ts`)
- ✅ LNBits integration
- ✅ BTCPay Server integration
- ✅ Invoice creation
- ✅ Payment verification
- ✅ USD to satoshis conversion
- ✅ Payment polling
- ✅ Error handling

#### Ethereum L2 Handler (`tests/unit/ethereum.test.ts`)
- ✅ Payment creation (ETH and USDC)
- ✅ EIP-681 URL generation
- ✅ Gas fee estimation
- ✅ Balance checking
- ✅ Payment verification
- ✅ USD to ETH conversion
- ✅ Multi-chain support (Base/Arbitrum/Optimism)

### Integration Tests

#### CryptoSubscriptions API (`tests/integration/crypto-subscriptions.test.ts`)
- ✅ Multi-chain payment creation
- ✅ Subscription activation
- ✅ Subscription management (get, cancel, upgrade)
- ✅ Price conversions across all chains
- ✅ Database integration
- ✅ Error handling

#### Database Adapter (`tests/integration/database-adapter.test.ts`)
- ✅ Payment CRUD operations
- ✅ Subscription CRUD operations
- ✅ Data persistence
- ✅ Test utilities

### E2E Tests

#### Complete User Flows (`tests/e2e/full-flow.test.ts`)
- ✅ Solana monthly premium subscription flow
- ✅ Lightning yearly pro subscription flow
- ✅ Ethereum lifetime subscription flow
- ✅ Subscription upgrades
- ✅ Subscription cancellation
- ✅ Multi-user scenarios
- ✅ Error recovery

## Test Configuration

### Environment Variables

Tests use devnet/testnet configurations by default. See `tests/fixtures/config.ts` for details.

### Mocking

- **External APIs**: Price APIs (CoinGecko) are mocked to avoid rate limits
- **Network Calls**: All blockchain network calls are mocked in unit tests
- **Database**: Mock database adapter is used for all tests

### Test Timeouts

- Unit tests: 5 seconds (default)
- Integration tests: 10 seconds
- E2E tests: 30 seconds

## Writing Tests

### Example Unit Test

```typescript
import { describe, it, expect } from 'vitest'
import { SolanaPayHandler } from '../../src/solana'
import { TEST_SOLANA_CONFIG } from '../fixtures/config'

describe('SolanaPayHandler', () => {
  it('should create payment', async () => {
    const handler = new SolanaPayHandler(TEST_SOLANA_CONFIG)
    const payment = await handler.createPayment(request, 0.1)

    expect(payment).toBeDefined()
    expect(payment.chain).toBe('solana')
  })
})
```

### Example E2E Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { CryptoSubscriptions } from '../../src/core/CryptoSubscriptions'
import { MockDatabaseAdapter } from '../mocks/database'

describe('E2E: Subscription Flow', () => {
  let subscriptions: CryptoSubscriptions
  let database: MockDatabaseAdapter

  beforeEach(() => {
    database = new MockDatabaseAdapter()
    subscriptions = new CryptoSubscriptions({
      ...TEST_CONFIG,
      database,
    })
  })

  it('should complete full subscription flow', async () => {
    // Create payment
    const payment = await subscriptions.createSubscriptionPayment(...)

    // Verify payment
    const verification = await subscriptions.verifyPayment(...)

    // Activate subscription
    const subscription = await subscriptions.activateSubscription(...)

    // Assert final state
    expect(subscription.status).toBe('active')
  })
})
```

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: bun test

- name: Generate coverage
  run: bun test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Use `beforeEach` to reset state between tests
3. **Mocking**: Mock external dependencies to keep tests fast and reliable
4. **Assertions**: Use clear, specific assertions
5. **Naming**: Use descriptive test names that explain what is being tested

## Troubleshooting

### Tests failing with network errors
- Ensure all external API calls are mocked
- Check that test configuration uses devnet/testnet

### Tests timing out
- Increase timeout in vitest.config.ts for slow tests
- Mock network calls to speed up tests

### Mock data issues
- Check `tests/fixtures/` for correct test data
- Ensure mocks in `tests/mocks/` are up to date

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Current coverage can be viewed by running `bun test:coverage`.
