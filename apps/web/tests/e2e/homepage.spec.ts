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
    await expect(page).toHaveTitle(/Rust Systems & Agentic AI Engineer/)
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

  test('keeps evidence heading, metrics, and actions on shared desktop axes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')

    const intro = page.getByTestId('work-intro')
    const cards = page.getByTestId('work-card')
    await intro.scrollIntoViewIfNeeded()
    await expect(cards).toHaveCount(3)

    const introBox = await intro.boundingBox()
    const cardBoxes = await cards.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().x)
    )
    const metricTops = await page
      .getByTestId('work-metrics')
      .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top))
    const actionTops = await page
      .getByTestId('work-card-cta')
      .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top))

    expect(introBox).not.toBeNull()
    expect(Math.abs((introBox?.x ?? 0) - (cardBoxes[0] ?? Number.NaN))).toBeLessThanOrEqual(1)
    expect(Math.max(...metricTops) - Math.min(...metricTops)).toBeLessThanOrEqual(1)
    expect(Math.max(...actionTops) - Math.min(...actionTops)).toBeLessThanOrEqual(1)
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

  test('should show proof-backed workflow and both agent skill suites', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('#how-i-work')
    await expect(section).toBeVisible()
    await expect(
      section.getByRole('heading', { name: 'Evidence before confidence.' })
    ).toBeVisible()
    await expect(section.getByRole('img')).toHaveAttribute(
      'alt',
      /repository inspection through planning, building, verification, and measured experiments/
    )
    await expect(section.getByRole('link', { name: /Inspect Claude Code suite/ })).toHaveAttribute(
      'href',
      'https://github.com/decebal/decebal-claude-skills'
    )
    await expect(section.getByRole('link', { name: /Inspect OpenAI Codex suite/ })).toHaveAttribute(
      'href',
      'https://github.com/decebal/decebal-codex-skills'
    )
  })

  test('should list both workflow suites in the open-source portfolio', async ({ page }) => {
    await page.goto('/open-source')

    await expect(page.getByRole('heading', { name: 'decebal-claude-skills' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'decebal-codex-skills' })).toBeVisible()

    const codexProject = page.locator('article').filter({ hasText: 'decebal-codex-skills' })
    await expect(codexProject.getByRole('link', { name: 'View repository' })).toHaveAttribute(
      'href',
      'https://github.com/decebal/decebal-codex-skills'
    )
  })
})
