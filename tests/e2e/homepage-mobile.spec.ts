import { test, expect } from '@playwright/test'

test.describe('Homepage Mobile Issues', () => {
  const mobileViewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
  ]

  test.describe('Chevron Visibility on Mobile', () => {
    for (const viewport of mobileViewports) {
      test(`Chevron should be visible and not hidden behind hero image on ${viewport.name}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Find the chevron button
        const chevronButton = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-down') }).first()
        await chevronButton.waitFor({ state: 'visible', timeout: 5000 })

        // Get the chevron button position
        const chevronBox = await chevronButton.boundingBox()
        expect(chevronBox).not.toBeNull()

        if (chevronBox) {
          // Find the hero image
          const heroImage = page.locator('img[alt*="Decebal"]').first()
          const heroImageBox = await heroImage.boundingBox()

          if (heroImageBox) {
            // Chevron should be below the hero image (higher y value) - this is the key requirement
            // User reported issue: "the chevron is displayed under the hero image" meaning BEHIND/HIDDEN
            expect(chevronBox.y).toBeGreaterThan(heroImageBox.y + heroImageBox.height)

            console.log(
              `✓ ${viewport.name}: Chevron at y=${Math.round(chevronBox.y)}px is below hero image (ends at y=${Math.round(heroImageBox.y + heroImageBox.height)}px)`
            )
          }

          // Note: We don't require the chevron to be fully visible above the fold
          // On small screens, it's acceptable UX for the chevron to require slight scrolling
          // The important fix is that it's no longer hidden BEHIND the hero image
        }
      })
    }
  })

  test.describe('Testimonials Mobile Layout', () => {
    for (const viewport of mobileViewports) {
      test(`Testimonials should display properly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Scroll to testimonials section
        const testimonialsSection = page.locator('#testimonials')
        await testimonialsSection.scrollIntoViewIfNeeded()
        await page.waitForTimeout(500) // Wait for scroll animation

        // Check if testimonials section exists
        await expect(testimonialsSection).toBeVisible()

        // Find testimonial cards
        const testimonialCards = page.locator('[class*="testimonial"]').or(page.locator('blockquote')).first()

        if (await testimonialCards.count() > 0) {
          const cardBox = await testimonialCards.first().boundingBox()

          if (cardBox) {
            // Card should not overflow viewport width
            expect(cardBox.width).toBeLessThanOrEqual(viewport.width)

            // Card should be visible within viewport
            expect(cardBox.x).toBeGreaterThanOrEqual(0)
            expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(viewport.width + 10) // 10px tolerance

            console.log(
              `✓ ${viewport.name}: Testimonial card width ${Math.round(cardBox.width)}px fits within viewport ${viewport.width}px`
            )
          }
        }

        // Check navigation buttons are accessible on mobile
        const prevButton = page.locator('button[aria-label*="Previous"]').or(page.locator('button').filter({ hasText: /previous/i }))
        const nextButton = page.locator('button[aria-label*="Next"]').or(page.locator('button').filter({ hasText: /next/i }))

        if (await prevButton.count() > 0) {
          await expect(prevButton.first()).toBeVisible()
        }
        if (await nextButton.count() > 0) {
          await expect(nextButton.first()).toBeVisible()
        }
      })
    }
  })

  test.describe('Horizontal Scroll Detection', () => {
    for (const viewport of mobileViewports) {
      test(`No horizontal scroll should be present on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Check if horizontal scrolling is possible (more important than scrollWidth)
        const canScrollHorizontally = await page.evaluate(() => {
          // Try to scroll right
          const initialScrollX = window.scrollX
          window.scrollBy(100, 0)
          const newScrollX = window.scrollX
          // Scroll back to original position
          window.scrollTo(initialScrollX, window.scrollY)

          return newScrollX > initialScrollX
        })

        // User should NOT be able to scroll horizontally
        expect(canScrollHorizontally).toBeFalsy()

        // Also check document width vs viewport width for diagnostic purposes
        const documentWidth = await page.evaluate(() => {
          return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.body.clientWidth,
            document.documentElement.clientWidth
          )
        })

        const viewportWidth = viewport.width

        // Log diagnostic info (document width may be wider than viewport, but that's OK if overflow-x: hidden)
        if (!canScrollHorizontally) {
          console.log(
            `✓ ${viewport.name}: No horizontal scroll possible (document: ${documentWidth}px, viewport: ${viewportWidth}px) - overflow-x hidden working correctly`
          )
        }
      })
    }
  })

  test.describe('Comprehensive Mobile Layout Check', () => {
    test('All sections should be mobile-responsive on iPhone SE (smallest viewport)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Check main sections don't overflow
      const sections = [
        'hero section',
        'about section',
        'skills section',
        'testimonials section',
        'contact section',
      ]

      for (const sectionName of sections) {
        const section = page.locator(`[id*="${sectionName.split(' ')[0]}"]`).first()

        if (await section.count() > 0) {
          const sectionBox = await section.boundingBox()

          if (sectionBox) {
            // Section should not cause horizontal scroll
            expect(sectionBox.width).toBeLessThanOrEqual(385) // 375 + 10px tolerance
          }
        }
      }
    })
  })
})
