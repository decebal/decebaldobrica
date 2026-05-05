import { expect, test } from '@playwright/test'

test.describe('Wolven Tech /contact', () => {
  test('loads without React or hydration errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const hasReactError = errors.some(
      (e) =>
        e.includes('Hydration') ||
        e.includes('use client') ||
        e.includes('Client Component') ||
        e.includes('useState') ||
        e.includes('useEffect')
    )
    expect(hasReactError, `React errors detected:\n${errors.join('\n')}`).toBe(false)

    await expect(page).toHaveTitle(/Book discovery/i)
  })

  test('renders meeting-type cards and form inputs', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const meetingCards = page.locator('[class*="cursor-pointer"]')
    const count = await meetingCards.count()
    expect(count).toBeGreaterThan(0)

    await meetingCards.first().click()

    await expect(page.locator('input#name')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#date')).toBeVisible()
  })

  test('chat sidebar is not rendered (enabled=false)', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('[data-testid="chat-interface"]')).toHaveCount(0)
  })

  test('contact hero visual snapshot', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await expect(page.locator('body')).toHaveScreenshot('contact-hero-rust.png', {
      maxDiffPixelRatio: 0.02,
      mask: [page.locator('text=/Pricing.*Tier/i')],
    })
  })
})
