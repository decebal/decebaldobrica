import { test, expect } from '@playwright/test'

test.describe('Chat Interface on Contact Page', () => {
  test('should render contact page with chat interface without errors', async ({ page }) => {
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

    // Navigate to contact page (where chat is)
    await page.goto('/contact')

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
    expect(
      hasHydrationError,
      `React errors detected:\n${errors.join('\n')}`
    ).toBe(false)
  })

  test('should display chat interface', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check for AI Assistant header within chat interface
    await expect(page.locator('[data-testid="chat-interface"] h3:has-text("AI Assistant")')).toBeVisible({ timeout: 10000 })
  })

  test('should have chat input field', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check for input field
    const input = page.locator('input[type="text"]').first()
    await expect(input).toBeVisible({ timeout: 10000 })
  })

  test('should display initial AI message', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check that chat interface contains the initial greeting text (case-insensitive)
    const chatInterface = page.locator('[data-testid="chat-interface"]')
    await expect(chatInterface).toContainText(/AI (a|A)ssistant/i, { timeout: 10000 })
  })

  test('should have Groq branding', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check for Groq mention
    await expect(page.locator('text=/Powered by Groq/i')).toBeVisible({ timeout: 10000 })
  })
})
