import { test, expect } from '@playwright/test'

test.describe('Contact Page - Above the Fold', () => {
  const viewports = [
    { name: 'Mobile (iPhone SE)', width: 375, height: 667 },
    { name: 'Mobile (iPhone 12 Pro)', width: 390, height: 844 },
    { name: 'Mobile (Pixel 5)', width: 393, height: 851 },
    { name: 'Tablet (iPad Mini)', width: 768, height: 1024 },
    { name: 'Tablet (iPad Air)', width: 820, height: 1180 },
    { name: 'Desktop (1280px)', width: 1280, height: 720 },
    { name: 'Desktop (1920px)', width: 1920, height: 1080 },
  ]

  for (const viewport of viewports) {
    test(`Confirm Booking button should be visible above the fold on ${viewport.name}`, async ({
      page,
    }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // Navigate to contact page
      await page.goto('/contact')

      // Wait for the page to be fully loaded
      await page.waitForLoadState('networkidle')

      // Check if meeting selection cards exist (paid meetings enabled)
      const meetingCards = page.locator('div[class*="cursor-pointer"]').first()
      const hasMeetingSelection = await meetingCards.isVisible().catch(() => false)

      if (hasMeetingSelection) {
        // Select the first meeting type if cards are visible
        await meetingCards.click()
      }

      // Wait for the booking form to appear
      const bookingForm = page.locator('form').first()
      await bookingForm.waitFor({ state: 'visible', timeout: 10000 })

      // Find the "Confirm Booking" button
      const confirmButton = page.locator('button[type="submit"]', {
        hasText: 'Confirm Booking',
      })

      // Wait for button to be visible
      await confirmButton.waitFor({ state: 'visible' })

      // Get button position
      const buttonBox = await confirmButton.boundingBox()
      expect(buttonBox).not.toBeNull()

      if (buttonBox) {
        // Check if button is within the viewport height (above the fold)
        // We add a small tolerance of 50px to account for mobile browser UI
        const isAboveFold = buttonBox.y + buttonBox.height <= viewport.height + 50

        expect(isAboveFold).toBeTruthy()

        // Additional check: ensure the button is not just barely visible
        // At least 80% of the button should be visible
        const visibleHeight = Math.min(buttonBox.y + buttonBox.height, viewport.height) - buttonBox.y
        const visibilityPercentage = (visibleHeight / buttonBox.height) * 100

        expect(visibilityPercentage).toBeGreaterThanOrEqual(80)

        console.log(
          `✓ ${viewport.name}: Button is ${Math.round(visibilityPercentage)}% visible at position y=${Math.round(buttonBox.y)}px (viewport height: ${viewport.height}px)`
        )
      }
    })
  }

  test('Confirm Booking button should be focusable and accessible', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check if meeting selection cards exist
    const meetingCards = page.locator('div[class*="cursor-pointer"]').first()
    const hasMeetingSelection = await meetingCards.isVisible().catch(() => false)

    if (hasMeetingSelection) {
      await meetingCards.click()
    }

    // Wait for form
    await page.locator('form').first().waitFor({ state: 'visible', timeout: 10000 })

    // Check button accessibility
    const confirmButton = page.locator('button[type="submit"]', {
      hasText: 'Confirm Booking',
    })

    // Should be visible
    await expect(confirmButton).toBeVisible()

    // Should be enabled (not disabled by default)
    await expect(confirmButton).toBeEnabled()

    // Should have proper role
    const buttonRole = await confirmButton.getAttribute('type')
    expect(buttonRole).toBe('submit')
  })

  test('Page layout should be optimized for quick booking conversion', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check if there's a meeting selection section or direct form
    const meetingSection = page.locator('text=Available Consultations')
    const hasMeetingSection = await meetingSection.isVisible().catch(() => false)

    // If meeting selection exists, check its position
    if (hasMeetingSection) {
      // Meeting section position should be near the top
      const meetingSectionBox = await meetingSection.boundingBox()
      expect(meetingSectionBox).not.toBeNull()

      if (meetingSectionBox) {
        // Should be in the upper 30% of the viewport
        expect(meetingSectionBox.y).toBeLessThan(720 * 0.3)
      }
    }

    // Chat section should appear after booking form
    const chatSection = page.locator('text=Questions? Ask My AI Assistant')
    await expect(chatSection).toBeVisible()

    // Booking form should appear before chat
    const bookingForm = page.locator('form').first()
    await expect(bookingForm).toBeVisible()

    const chatSectionBox = await chatSection.boundingBox()
    const bookingFormBox = await bookingForm.boundingBox()

    expect(chatSectionBox).not.toBeNull()
    expect(bookingFormBox).not.toBeNull()

    if (chatSectionBox && bookingFormBox) {
      // Chat should be below booking form
      expect(chatSectionBox.y).toBeGreaterThan(bookingFormBox.y)
    }
  })
})
