import { expect, test } from '@playwright/test'

test.describe('Homepage Mobile Issues', () => {
  const mobileViewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
  ]

  test.describe('Hero actions on mobile', () => {
    for (const viewport of mobileViewports) {
      test(`Primary action should remain separate from portrait on ${viewport.name}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const hero = page.locator('main, body').locator('section').first()
        const primaryAction = hero.getByRole('link', { name: 'Discuss an engagement' })
        const portrait = hero.getByRole('img', { name: 'Decebal Dobrica' })

        await primaryAction.scrollIntoViewIfNeeded()
        await expect(primaryAction).toBeVisible()
        await expect(portrait).toBeVisible()

        const actionBox = await primaryAction.boundingBox()
        const portraitBox = await portrait.boundingBox()
        expect(actionBox).not.toBeNull()
        expect(portraitBox).not.toBeNull()

        if (actionBox && portraitBox) {
          expect(portraitBox.y).toBeGreaterThanOrEqual(actionBox.y + actionBox.height)
          expect(actionBox.height).toBeGreaterThanOrEqual(48)
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
        const testimonialCards = page
          .locator('[class*="testimonial"]')
          .or(page.locator('blockquote'))
          .first()

        if ((await testimonialCards.count()) > 0) {
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
        const prevButton = page
          .locator('button[aria-label*="Previous"]')
          .or(page.locator('button').filter({ hasText: /previous/i }))
        const nextButton = page
          .locator('button[aria-label*="Next"]')
          .or(page.locator('button').filter({ hasText: /next/i }))

        if ((await prevButton.count()) > 0) {
          await expect(prevButton.first()).toBeVisible()
        }
        if ((await nextButton.count()) > 0) {
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

        if ((await section.count()) > 0) {
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
