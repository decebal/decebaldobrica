import { test, expect } from '@playwright/test'

test.describe('Application Health Check', () => {
  test('should not have any console errors on any page', async ({ page }) => {
    const errors: Array<{ page: string; error: string }> = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({ page: page.url(), error: msg.text() })
      }
    })

    page.on('pageerror', (error) => {
      errors.push({ page: page.url(), error: error.message })
    })

    // Test homepage
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Test contact page
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Filter out non-critical errors (like network errors in dev)
    const criticalErrors = errors.filter(
      (e) =>
        !e.error.includes('favicon') &&
        !e.error.includes('ERR_CONNECTION_REFUSED') &&
        !e.error.toLowerCase().includes('ollama') // Ignore Ollama connection errors in tests
    )

    if (criticalErrors.length > 0) {
      console.error('Critical errors found:')
      for (const error of criticalErrors) {
        console.error(`  [${error.page}] ${error.error}`)
      }
    }

    expect(
      criticalErrors.length,
      `Found ${criticalErrors.length} critical errors:\n${criticalErrors.map((e) => `${e.page}: ${e.error}`).join('\n')}`
    ).toBe(0)
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Check that main navigation elements are present
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check for common navigation items
    const links = await nav.locator('a').count()
    expect(links).toBeGreaterThan(0)
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345')

    // Should return 404 status
    expect(response?.status()).toBe(404)

    // Page should still render without errors
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.waitForLoadState('networkidle')
    expect(errors.length).toBe(0)
  })
})
