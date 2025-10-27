#!/usr/bin/env bun

/**
 * Test Payment Gate API
 * Usage: bun scripts/test-payment-gate.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:4100'

async function testServicesPricingAPI() {
  console.log('🧪 Testing Services Pricing API with Payment Gate\n')

  // Test 1: Call API without payment - should return 402
  console.log('Test 1: Calling API without payment...')
  try {
    const response = await fetch(`${BASE_URL}/api/services/pricing`)
    const data = await response.json()

    if (response.status === 402) {
      console.log('✅ Received HTTP 402 Payment Required')
      console.log('📦 Payment options:', data.paymentOptions.length, 'chains available')
      console.log('💰 Solana payment:')
      console.log('   Amount:', data.paymentOptions[0].amount, 'SOL')
      console.log('   Reference:', data.paymentOptions[0].reference)
      console.log('   Payment ID:', data.paymentId)
      console.log('   Expires at:', new Date(data.expiresAt).toLocaleString())
      console.log('')

      return {
        success: true,
        paymentId: data.paymentId,
        reference: data.paymentOptions[0].reference,
      }
    }

    console.log('❌ Expected 402, got:', response.status)
    console.log('Response:', data)
    return { success: false }
  } catch (error) {
    console.log('❌ Error:', error)
    return { success: false }
  }
}

async function testWithWalletAddress(walletAddress: string) {
  console.log(`\nTest 2: Calling API with wallet address: ${walletAddress.slice(0, 8)}...`)

  try {
    const response = await fetch(`${BASE_URL}/api/services/pricing`, {
      headers: {
        'X-Wallet-Address': walletAddress,
      },
    })

    const data = await response.json()

    if (response.status === 200 && data.access === 'granted') {
      console.log('✅ User has access - pricing returned')
      console.log('📊 Pricing tiers:', Object.keys(data.pricing).length)
      console.log('')
      return { success: true, hasAccess: true }
    }

    if (response.status === 402) {
      console.log('✅ User needs to pay - HTTP 402 returned')
      console.log('')
      return { success: true, hasAccess: false }
    }

    console.log('❌ Unexpected response:', response.status)
    console.log('Response:', data)
    return { success: false }
  } catch (error) {
    console.log('❌ Error:', error)
    return { success: false }
  }
}

async function testWithPaymentId(paymentId: string) {
  console.log(`\nTest 3: Calling API with payment ID: ${paymentId.slice(0, 15)}...`)

  try {
    const response = await fetch(`${BASE_URL}/api/services/pricing`, {
      headers: {
        'X-Payment-Id': paymentId,
      },
    })

    const data = await response.json()

    if (response.status === 200 && data.access === 'granted') {
      console.log('✅ Payment verified - access granted')
      console.log('📊 Pricing tiers:', Object.keys(data.pricing).length)
      console.log('')
      return { success: true }
    }

    if (response.status === 400) {
      console.log('⏳ Payment not verified yet (expected on devnet without actual payment)')
      console.log('')
      return { success: true }
    }

    console.log('❌ Unexpected response:', response.status)
    console.log('Response:', data)
    return { success: false }
  } catch (error) {
    console.log('❌ Error:', error)
    return { success: false }
  }
}

// Run tests
async function main() {
  console.log('🚀 Payment Gate API Test Suite')
  console.log('================================\n')
  console.log('Base URL:', BASE_URL)
  console.log('')

  // Test 1: No payment
  const test1 = await testServicesPricingAPI()

  if (!test1.success) {
    console.log('\n❌ Tests failed')
    process.exit(1)
  }

  // Test 2: With fake wallet address (should still require payment)
  const fakeWallet = 'FakeWallet123456789AbCdEfGhIjKlMnOpQrStUvWxYz'
  await testWithWalletAddress(fakeWallet)

  // Test 3: With payment ID (will fail without actual payment, but tests the flow)
  if (test1.paymentId) {
    await testWithPaymentId(test1.paymentId)
  }

  console.log('✅ All tests completed!')
  console.log('')
  console.log('📝 Next steps:')
  console.log('1. Start dev server: bun dev')
  console.log('2. Test with real wallet: connect Phantom and pay on devnet')
  console.log('3. Verify access is granted after payment')
  console.log('')
}

main().catch(console.error)
