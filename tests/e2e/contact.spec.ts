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
})
