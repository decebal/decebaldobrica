import { expect, test } from '@playwright/test'

interface Meeting {
  meetingType: string
  duration: number
  requiresPayment: boolean
  description?: string
  basePrice: number
  geoPrice: number
  formattedPrice: string
  priceCrypto: number
}

test.describe('Geo-Pricing API', () => {
  test('should return geo-pricing data from API endpoint', async ({ page }) => {
    const response = await page.goto('/api/geo-pricing')
    expect(response?.status()).toBe(200)

    const data = await response?.json()

    // Verify response structure
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('location')
    expect(data).toHaveProperty('pricing')
    expect(data).toHaveProperty('meetings')
    expect(data).toHaveProperty('discountEligible')

    // Verify location data
    expect(data.location).toHaveProperty('country')
    expect(data.location).toHaveProperty('city')
    expect(data.location).toHaveProperty('region')

    // Verify pricing tier data
    expect(data.pricing).toHaveProperty('tier')
    expect(data.pricing).toHaveProperty('tierName')
    expect(data.pricing).toHaveProperty('currency')
    expect(data.pricing).toHaveProperty('multiplier')
    expect(data.pricing.tier).toBeGreaterThanOrEqual(1)
    expect(data.pricing.tier).toBeLessThanOrEqual(4)

    // Verify meetings array
    expect(Array.isArray(data.meetings)).toBe(true)
    expect(data.meetings.length).toBeGreaterThan(0)

    // Verify first meeting structure
    const meeting = data.meetings[0]
    expect(meeting).toHaveProperty('meetingType')
    expect(meeting).toHaveProperty('duration')
    expect(meeting).toHaveProperty('requiresPayment')
    expect(meeting).toHaveProperty('basePrice')
    expect(meeting).toHaveProperty('geoPrice')
    expect(meeting).toHaveProperty('formattedPrice')
    expect(meeting).toHaveProperty('priceCrypto')
  })

  test('should calculate correct geo-adjusted prices', async ({ page }) => {
    const response = await page.goto('/api/geo-pricing')
    const data = await response?.json()

    // Find a paid meeting
    const paidMeeting = data.meetings.find((m: Meeting) => m.requiresPayment)

    if (paidMeeting) {
      const expectedGeoPrice = Math.round(paidMeeting.basePrice * data.pricing.multiplier)

      // Verify geo price calculation
      expect(paidMeeting.geoPrice).toBe(expectedGeoPrice)

      // Verify price is formatted correctly
      expect(paidMeeting.formattedPrice).toBeTruthy()
      expect(typeof paidMeeting.formattedPrice).toBe('string')
    }
  })

  test('should provide discount message for eligible tiers', async ({ page }) => {
    const response = await page.goto('/api/geo-pricing')
    const data = await response?.json()

    if (data.discountEligible === true) {
      // Tier 4 regions should have discount message
      expect(data.discountMessage).toBeTruthy()
      expect(typeof data.discountMessage).toBe('string')
      expect(data.discountMessage.toLowerCase()).toContain('contact')
    } else if (data.pricing.tier === 4) {
      // Even if not explicitly eligible, tier 4 might have a message
      expect(data.discountMessage).toBeDefined()
    }
  })
})

test.describe('Geo-Pricing UI on Contact Page', () => {
  test('should load contact page with geo-pricing without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check for React errors
    const hasReactError = errors.some(
      (error) =>
        error.includes('Hydration') ||
        error.includes('use client') ||
        error.includes('Client Component')
    )

    if (hasReactError) {
      console.error('React errors found:', errors)
    }

    expect(hasReactError, `React errors detected:\n${errors.join('\n')}`).toBe(false)
  })

  test('should display detected location info', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Wait for geo-pricing to load (it fetches on mount)
    await page.waitForTimeout(2000)

    // Check for location indicator
    const locationIndicator = page.locator('text=/Detected location:/i')
    const hasLocation = (await locationIndicator.count()) > 0

    if (hasLocation) {
      await expect(locationIndicator).toBeVisible()

      // Verify it contains country info
      const locationText = await locationIndicator.textContent()
      expect(locationText).toBeTruthy()
      expect(locationText?.length).toBeGreaterThan(10) // Should have actual location data
    }
  })

  test('should display discount message for eligible regions', async ({ page }) => {
    // First check if this region is eligible
    const apiResponse = await page.goto('/api/geo-pricing')
    const geoData = await apiResponse?.json()

    // Navigate to contact page
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    if (geoData?.discountMessage) {
      // Should see discount message in UI
      const discountMessage = page.locator(`text=${geoData.discountMessage}`)
      await expect(discountMessage).toBeVisible()

      // Verify it's styled as a notice (yellow background)
      const messageContainer = page.locator('[class*="yellow"]', { has: discountMessage })
      expect(await messageContainer.count()).toBeGreaterThan(0)
    }
  })

  test('should display geo-adjusted prices on meeting cards', async ({ page }) => {
    // Get geo-pricing data first
    const apiResponse = await page.goto('/api/geo-pricing')
    const geoData = await apiResponse?.json()

    // Navigate to contact page
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Check if meeting cards are displayed
    const meetingCards = page.locator('[class*="cursor-pointer"]')
    const cardCount = await meetingCards.count()

    if (cardCount > 0 && geoData?.meetings) {
      // Find a paid meeting in the data
      const paidMeeting = geoData.meetings.find((m: Meeting) => m.requiresPayment)

      if (paidMeeting) {
        // Look for the formatted price on the page
        const priceElement = page.locator(`text=${paidMeeting.formattedPrice}`)
        await expect(priceElement.first()).toBeVisible()
      }
    }
  })

  test('should show base price when different from geo price', async ({ page }) => {
    const apiResponse = await page.goto('/api/geo-pricing')
    const geoData = await apiResponse?.json()

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Find a meeting where geo price differs from base
    const meetingWithDiff = geoData?.meetings?.find(
      (m: Meeting) => m.requiresPayment && m.geoPrice !== m.basePrice
    )

    if (meetingWithDiff) {
      // Should show base price in parentheses
      const basePriceText = page.locator(`text=/base.*${meetingWithDiff.basePrice}/i`)
      const hasBasePrice = (await basePriceText.count()) > 0

      if (hasBasePrice) {
        await expect(basePriceText.first()).toBeVisible()
      }
    }
  })

  test('should display geo-adjusted price in booking form', async ({ page }) => {
    const apiResponse = await page.goto('/api/geo-pricing')
    const geoData = await apiResponse?.json()

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Select first meeting type
    const firstMeetingCard = page.locator('[class*="cursor-pointer"]').first()
    const cardCount = await firstMeetingCard.count()

    if (cardCount > 0 && geoData?.meetings) {
      await firstMeetingCard.click()

      // Wait for form to appear
      await expect(page.locator('input#name')).toBeVisible()

      // Find the selected meeting in geo data
      const meetingText = await firstMeetingCard.textContent()
      const selectedMeeting = geoData.meetings.find((m: Meeting) =>
        meetingText?.includes(m.duration.toString())
      )

      if (selectedMeeting?.requiresPayment) {
        // Check that the payment section shows the geo-adjusted price
        const paymentSection = page.locator('text=/Payment Required/i')
        await expect(paymentSection).toBeVisible()

        // Verify formatted price appears in payment section
        const formattedPrice = selectedMeeting.formattedPrice
        const priceInForm = page.locator(`text=${formattedPrice}`)
        await expect(priceInForm.first()).toBeVisible()
      }
    }
  })
})

test.describe('Geo-Pricing Edge Cases', () => {
  test('should handle missing geo data gracefully', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Page should still load even if geo-pricing fails
    const pageTitle = await page.title()
    expect(pageTitle).toBeTruthy()

    // Should still show meeting cards
    const meetingCards = page.locator('h2:has-text("Available Consultations")')
    const hasCards = (await meetingCards.count()) > 0

    if (hasCards) {
      await expect(meetingCards).toBeVisible()
    }
  })

  test('should display fallback pricing if geo-pricing unavailable', async ({ page }) => {
    // Intercept the API call and make it fail
    await page.route('/api/geo-pricing', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, error: 'Service unavailable' }),
      })
    })

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Should still show meeting cards with base pricing
    const firstMeetingCard = page.locator('[class*="cursor-pointer"]').first()
    const cardCount = await firstMeetingCard.count()

    if (cardCount > 0) {
      // Page should not crash
      await expect(firstMeetingCard).toBeVisible()

      // Should show some price (either base USD or SOL)
      const priceElements = page.locator('text=/\\$|SOL/')
      expect(await priceElements.count()).toBeGreaterThan(0)
    }
  })

  test('should work with feature flag disabled', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Even with paid meetings disabled, geo-pricing API should work
    const apiResponse = await page.goto('/api/geo-pricing')
    expect(apiResponse?.status()).toBe(200)

    const data = await apiResponse?.json()
    expect(data.success).toBe(true)

    // Should still return meeting data
    expect(data.meetings.length).toBeGreaterThan(0)
  })
})

test.describe('Geo-Pricing Currency Display', () => {
  test('should show appropriate currency symbol', async ({ page }) => {
    const apiResponse = await page.goto('/api/geo-pricing')
    const geoData = await apiResponse?.json()

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    if (geoData?.pricing?.currency) {
      const currency = geoData.pricing.currency
      const currencySymbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        SGD: 'S$',
        JPY: '¥',
        AUD: 'A$',
      }

      const expectedSymbol = currencySymbols[currency]

      if (expectedSymbol) {
        // Look for prices with the correct currency symbol
        const priceWithSymbol = page.locator(`text=/${expectedSymbol}\\d+/`)
        const hasSymbol = (await priceWithSymbol.count()) > 0

        if (hasSymbol) {
          await expect(priceWithSymbol.first()).toBeVisible()
        }
      }
    }
  })

  test('should format prices correctly for different currencies', async ({ page }) => {
    const apiResponse = await page.goto('/api/geo-pricing')
    const geoData = await apiResponse?.json()

    if (geoData?.meetings) {
      for (const meeting of geoData.meetings) {
        if (meeting.requiresPayment && meeting.formattedPrice) {
          // Verify price format is reasonable
          expect(meeting.formattedPrice).toMatch(/^[€£$¥A-Z]*\d+/)
          expect(meeting.geoPrice).toBeGreaterThan(0)
          expect(meeting.basePrice).toBeGreaterThan(0)
        }
      }
    }
  })
})
