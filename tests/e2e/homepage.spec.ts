import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Listen for page errors
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    // Navigate to homepage
    await page.goto('/')

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Check for React hydration errors
    const hasHydrationError = errors.some(
      (error) =>
        error.includes('Hydration') ||
        error.includes('use client') ||
        error.includes('Client Component')
    )

    if (hasHydrationError) {
      console.error('React errors found:', errors)
    }

    // Fail test if there are React errors
    expect(hasHydrationError, `React errors detected:\n${errors.join('\n')}`).toBe(false)

    // Verify page loaded
    await expect(page).toHaveTitle(/Portfolio/)
  })

  test('should display main content', async ({ page }) => {
    await page.goto('/')

    // Check for key sections
    await expect(page.locator('h1')).toBeVisible()

    // Nav is only visible on desktop (hidden md:flex)
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768
    if (!isMobile) {
      await expect(page.locator('nav')).toBeVisible()
    }
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')

    // Find and click contact link
    const contactLink = page.locator('a[href*="contact"]').first()
    if (await contactLink.isVisible()) {
      await contactLink.click()
      await page.waitForURL(/.*contact.*/)
      await expect(page).toHaveURL(/.*contact.*/)
    }
  })
})
