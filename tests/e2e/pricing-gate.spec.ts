import { expect, test } from '@playwright/test'

test.describe('Pricing Gate - Gated State', () => {
  test.beforeEach(async ({ context }) => {
    // Clear localStorage before each test to ensure gated state
    await context.clearCookies()
  })

  const servicePages = [
    { path: '/services', name: 'Main Services' },
    { path: '/services/fractional-cto', name: 'Fractional CTO' },
    { path: '/services/case-studies', name: 'Case Studies' },
    { path: '/services/technical-writing', name: 'Technical Writing' },
    { path: '/services/architecture-docs', name: 'Architecture Docs' },
  ]

  for (const service of servicePages) {
    test(`${service.name} should show locked pricing by default`, async ({ page }) => {
      await page.goto(service.path)
      await page.waitForLoadState('networkidle')

      // Should show "Premium Pricing • Serious Clients Only" heading (this indicates locked state)
      await expect(page.locator('h2').filter({ hasText: /Premium Pricing/i })).toBeVisible()

      // Should show "Scroll to Coffee Payment" button
      const coffeeButton = page.locator('button', { hasText: /Scroll to Coffee Payment/i })
      await expect(coffeeButton).toBeVisible()

      // Should show "Why This Approach?" section (unique to locked state)
      await expect(page.locator('h3').filter({ hasText: /Why This Approach/i })).toBeVisible()

      // Should NOT show "Thanks for the coffee!" (which appears when unlocked)
      await expect(page.locator('text=/☕ Thanks for the coffee!/i')).not.toBeVisible()
    })

    test(`${service.name} should scroll to footer when clicking coffee button`, async ({
      page,
    }) => {
      await page.goto(service.path)
      await page.waitForLoadState('networkidle')

      // Click the "Scroll to Coffee Payment" button
      const coffeeButton = page.locator('button', { hasText: /Scroll to Coffee Payment/i })
      await coffeeButton.click()

      // Wait for scroll animation
      await page.waitForTimeout(1000)

      // Footer coffee section should be visible
      const coffeeSection = page.locator('.coffee-section')
      await expect(coffeeSection).toBeVisible()

      // Should show ETH address
      await expect(page.locator('code').filter({ hasText: /decebaldobrica.eth/i })).toBeVisible()

      // Should have highlight animation (ring-2 class added)
      const hasRing = await coffeeSection.evaluate((el) => el.classList.contains('ring-2'))
      expect(hasRing).toBe(true)
    })

    test(`${service.name} should show email form after timeout`, async ({ page }) => {
      await page.goto(service.path)
      await page.waitForLoadState('networkidle')

      // Click coffee button
      const coffeeButton = page.locator('button', { hasText: /Scroll to Coffee Payment/i })
      await coffeeButton.click()

      // Wait for email form to appear (3 second timeout in code)
      await page.waitForTimeout(3500)

      // Email input should be visible
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeVisible()

      // Unlock button should be visible
      const unlockButton = page.locator('button', { hasText: /Unlock Pricing/i })
      await expect(unlockButton).toBeVisible()
    })
  }

  test('Should show alternative CTA for non-unlocked users', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    // Should show "Schedule a free discovery call instead" link
    const discoveryLink = page.locator('a', { hasText: /Schedule a free discovery call/i })
    await expect(discoveryLink).toBeVisible()
    await expect(discoveryLink).toHaveAttribute('href', '/contact')
  })
})

test.describe('Pricing Gate - Unlocked State', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to unlock pricing before each test
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('pricing_unlocked', 'true')
      localStorage.setItem('pricing_email', 'test@example.com')
    })
  })

  const servicePages = [
    { path: '/services', name: 'Main Services', hasPackages: true },
    { path: '/services/fractional-cto', name: 'Fractional CTO', hasPackages: true },
    { path: '/services/case-studies', name: 'Case Studies', hasPackages: true },
    { path: '/services/technical-writing', name: 'Technical Writing', hasPackages: true },
    { path: '/services/architecture-docs', name: 'Architecture Docs', hasPackages: true },
  ]

  for (const service of servicePages) {
    test(`${service.name} should show pricing when unlocked`, async ({ page }) => {
      await page.goto(service.path)
      await page.waitForLoadState('networkidle')

      // Should NOT show "Premium Pricing • Serious Clients Only" (locked state heading)
      await expect(
        page.locator('h2').filter({ hasText: /Premium Pricing.*Serious Clients/i })
      ).not.toBeVisible()

      // Should show "Thanks for the coffee!" banner
      await expect(page.locator('text=/☕ Thanks for the coffee!/i')).toBeVisible()

      if (service.hasPackages) {
        // Should show actual pricing packages
        const packageCards = page.locator('.brand-card').filter({ has: page.locator('h3') })
        await expect(packageCards.first()).toBeVisible()

        // Should show price amounts (e.g., $12,000, $18,000, etc.)
        const pricingText = page.locator('.text-brand-teal').filter({ hasText: /\$/ })
        await expect(pricingText.first()).toBeVisible()
      }
    })

    test(`${service.name} should persist unlock across page reloads`, async ({ page }) => {
      await page.goto(service.path)
      await page.waitForLoadState('networkidle')

      // Verify initially unlocked
      await expect(page.locator('text=/☕ Thanks for the coffee!/i')).toBeVisible()

      // Reload page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should still be unlocked
      await expect(page.locator('text=/☕ Thanks for the coffee!/i')).toBeVisible()

      // Should NOT show lock screen
      await expect(page.locator('h2').filter({ hasText: /Premium Pricing/i })).not.toBeVisible()
    })
  }

  test('Unlocked pricing should work across all service pages', async ({ page }) => {
    // Navigate through multiple service pages
    const pages = [
      '/services',
      '/services/fractional-cto',
      '/services/case-studies',
      '/services/technical-writing',
      '/services/architecture-docs',
    ]

    for (const servicePath of pages) {
      await page.goto(servicePath)
      await page.waitForLoadState('networkidle')

      // All should show unlocked state
      await expect(page.locator('text=/☕ Thanks for the coffee!/i')).toBeVisible()
    }
  })
})

test.describe('Pricing Gate - Email Submission', () => {
  test.beforeEach(async ({ context }) => {
    // Clear localStorage before each test
    await context.clearCookies()
  })

  test('Should unlock pricing after email submission', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    // Click coffee button
    const coffeeButton = page.locator('button', { hasText: /Scroll to Coffee Payment/i })
    await coffeeButton.click()

    // Wait for email form
    await page.waitForTimeout(3500)

    // Fill in email
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('test@example.com')

    // Submit form
    const unlockButton = page.locator('button[type="submit"]', { hasText: /Unlock Pricing/i })
    await unlockButton.click()

    // Wait for unlock
    await page.waitForTimeout(500)

    // Should now show pricing
    await expect(page.locator('text=/☕ Thanks for the coffee!/i')).toBeVisible()

    // Should show actual packages
    const packageCards = page.locator('.brand-card').filter({ has: page.locator('h3') })
    await expect(packageCards.first()).toBeVisible()
  })

  test('Should require valid email format', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    // Click coffee button and wait for form
    const coffeeButton = page.locator('button', { hasText: /Scroll to Coffee Payment/i })
    await coffeeButton.click()
    await page.waitForTimeout(3500)

    // Try to submit with invalid email
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('invalid-email')

    // Form should not submit (browser validation)
    const unlockButton = page.locator('button[type="submit"]', { hasText: /Unlock Pricing/i })
    await unlockButton.click()

    // Should still show lock screen (not unlocked)
    await expect(page.locator('h2').filter({ hasText: /Premium Pricing/i })).toBeVisible()
  })

  test('Should store email and unlock status in localStorage', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    // Go through unlock flow
    const coffeeButton = page.locator('button', { hasText: /Scroll to Coffee Payment/i })
    await coffeeButton.click()
    await page.waitForTimeout(3500)

    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('test@example.com')

    const unlockButton = page.locator('button[type="submit"]', { hasText: /Unlock Pricing/i })
    await unlockButton.click()
    await page.waitForTimeout(500)

    // Check localStorage
    const unlocked = await page.evaluate(() => localStorage.getItem('pricing_unlocked'))
    const email = await page.evaluate(() => localStorage.getItem('pricing_email'))

    expect(unlocked).toBe('true')
    expect(email).toBe('test@example.com')
  })
})

test.describe('Pricing Gate - Footer Coffee Section', () => {
  test('Footer should have coffee section on all pages', async ({ page }) => {
    const pages = ['/', '/services', '/about', '/contact', '/blog']

    for (const path of pages) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Coffee section should be visible
      const coffeeSection = page.locator('.coffee-section')
      await expect(coffeeSection).toBeVisible()

      // Should show ETH address
      await expect(page.locator('code').filter({ hasText: /decebaldobrica.eth/i })).toBeVisible()

      // Should have copy button
      const copyButton = page.locator('button', { has: page.locator('svg') }).filter({
        hasText: '',
      })
      await expect(copyButton.first()).toBeVisible()
    }
  })

  test('Copy button should copy ETH address to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click copy button
    const copyButton = page.locator('button[title="Copy address"]')
    await copyButton.click()

    // Should show success message
    await expect(
      page.locator('text=/✓ Address copied! Send payment and return to unlock pricing./i')
    ).toBeVisible()

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('decebaldobrica.eth')
  })
})

test.describe('Pricing Gate - No Console Errors', () => {
  test('Should not have console errors on gated pages', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/services/fractional-cto')
    await page.waitForLoadState('networkidle')

    // Check for React hydration errors
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

  test('Should not have console errors on unlocked pages', async ({ page }) => {
    // Set unlocked state
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('pricing_unlocked', 'true')
      localStorage.setItem('pricing_email', 'test@example.com')
    })

    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/services/case-studies')
    await page.waitForLoadState('networkidle')

    // Check for React hydration errors
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
})
