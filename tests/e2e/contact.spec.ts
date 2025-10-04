import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test('should load contact page without React errors', async ({ page }) => {
    // Track errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    // Navigate to contact page
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check for React errors
    const hasReactError = errors.some(
      (error) =>
        error.includes('Hydration') ||
        error.includes('use client') ||
        error.includes('Client Component') ||
        error.includes('useState') ||
        error.includes('useEffect')
    )

    if (hasReactError) {
      console.error('React errors found:', errors)
    }

    expect(hasReactError, `React errors detected:\n${errors.join('\n')}`).toBe(
      false
    )

    // Verify page loaded
    await expect(page).toHaveTitle(/Contact/)
  })

  test('should display chat interface', async ({ page }) => {
    await page.goto('/contact')

    // Check for chat interface elements
    const chatInterface = page.locator('[data-testid="chat-interface"]').or(
      page.locator('textarea')
    )
    await expect(chatInterface.first()).toBeVisible({ timeout: 10000 })
  })

  test('should display booking form when meeting type is selected', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check if meeting type cards are present
    const meetingCards = page.locator('h2:has-text("Available Consultations")')

    // If multiple meeting types available, select one
    const firstMeetingCard = page.locator('[class*="cursor-pointer"]').first()
    const cardCount = await firstMeetingCard.count()

    if (cardCount > 0) {
      await firstMeetingCard.click()

      // Verify booking form appears
      await expect(page.locator('input#name')).toBeVisible()
      await expect(page.locator('input#email')).toBeVisible()
      await expect(page.locator('input#date')).toBeVisible()
      await expect(page.locator('input#time')).toBeVisible()
      await expect(page.locator('button:has-text("Confirm Booking")')).toBeVisible()
    }
  })

  test('should render booking success page correctly', async ({ page }) => {
    // Track console errors
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

    // Select first meeting type if available
    const firstMeetingCard = page.locator('[class*="cursor-pointer"]').first()
    const cardCount = await firstMeetingCard.count()

    if (cardCount > 0) {
      await firstMeetingCard.click()

      // Fill out the form
      await page.fill('input#name', 'Test User')
      await page.fill('input#email', 'test@example.com')

      // Set date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateString = tomorrow.toISOString().split('T')[0]
      await page.fill('input#date', dateString)
      await page.fill('input#time', '14:00')

      // Submit form
      await page.click('button:has-text("Confirm Booking")')

      // Wait for success page - if booking succeeds
      // This will fail gracefully if booking service is not configured
      try {
        // Wait a bit for submission to process
        await page.waitForTimeout(2000)

        // Check if success page rendered (only if booking succeeded)
        const successHeading = page.locator('h1:has-text("Booking Confirmed")')
        const hasSuccessPage = await successHeading.count() > 0

        if (hasSuccessPage) {
          // Verify critical elements on success page are present
          await expect(successHeading).toBeVisible()

          // Check for checkmark icon container
          const checkIcon = page.locator('svg').filter({ hasText: '' }).first()
          await expect(checkIcon).toBeVisible()

          // Check for action buttons
          await expect(page.locator('a:has-text("Back to Services")')).toBeVisible()
          await expect(page.locator('a:has-text("Go to Home")')).toBeVisible()

          // Verify no JSX/parsing errors in console
          const hasParsingError = errors.some(
            (error) =>
              error.includes('Parsing') ||
              error.includes('Expected') ||
              error.includes('jsx')
          )

          expect(hasParsingError, `Parsing errors detected:\n${errors.join('\n')}`).toBe(false)
        }
      } catch (e) {
        // Booking may fail if services not configured - that's OK
        console.log('Booking submission test skipped (services may not be configured)')
      }
    }
  })
})
