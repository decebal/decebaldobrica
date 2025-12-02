import { expect, test } from '@playwright/test'

// Use the RAG blog post which has a comprehensive TOC
const TEST_BLOG_POST = '/blog/2025-10-18-building-personalized-ai-with-rag-anythingllm-and-groq'

test.describe('Blog Table of Contents', () => {
  test('should render blog post without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto(TEST_BLOG_POST)
    await page.waitForLoadState('networkidle')

    const hasError = errors.some(
      (error) =>
        error.includes('Hydration') ||
        error.includes('use client') ||
        error.includes('Client Component')
    )

    if (hasError) {
      console.error('React errors found:', errors)
    }

    expect(hasError, `React errors detected:\n${errors.join('\n')}`).toBe(false)
  })

  test.describe('Desktop TOC', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test('should show desktop sidebar TOC', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')

      // Desktop TOC should be visible
      const desktopTOC = page.locator('div.hidden.lg\\:block')
      await expect(desktopTOC).toBeVisible()

      // Should have "Contents" heading
      await expect(desktopTOC.locator('h2:has-text("Contents")')).toBeVisible()
    })

    test('should have progress indicator', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')

      const desktopTOC = page.locator('div.hidden.lg\\:block')

      // Should show progress section
      await expect(desktopTOC.locator('text=Progress')).toBeVisible()

      // Should show time remaining
      await expect(desktopTOC.locator('text=/\\d+ min left|< 1 min left/')).toBeVisible()
    })

    test('should navigate to correct section when clicking TOC item', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')

      // Wait a bit for IDs to be assigned
      await page.waitForTimeout(500)

      const desktopTOC = page.locator('div.hidden.lg\\:block')

      // Find the first TOC section button
      const firstSection = desktopTOC.locator('button').first()
      const sectionTitle = await firstSection.locator('div.flex-1 > div').textContent()

      if (!sectionTitle) {
        throw new Error('Section title not found')
      }

      console.log('Clicking TOC section:', sectionTitle.trim())

      // Click the section
      await firstSection.click()

      // Wait for scroll to complete
      await page.waitForTimeout(800)

      // Find the visible H2 heading
      const visibleHeading = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('article .prose h2'))
        const viewportTop = window.scrollY + 150 // Account for offset

        for (const heading of headings) {
          const rect = heading.getBoundingClientRect()
          const absoluteTop = window.scrollY + rect.top

          // Check if heading is near the top of viewport (within 200px)
          if (Math.abs(absoluteTop - viewportTop) < 200) {
            return heading.textContent
          }
        }

        return null
      })

      console.log('Visible heading after scroll:', visibleHeading)

      // The clicked section title should match the visible heading
      expect(visibleHeading?.trim()).toBe(sectionTitle.trim())
    })

    test('should navigate to multiple sections correctly', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      const desktopTOC = page.locator('div.hidden.lg\\:block')
      const sections = await desktopTOC.locator('button').all()

      // Test first 3 sections
      const sectionsToTest = sections.slice(0, 3)

      for (const section of sectionsToTest) {
        const sectionTitle = await section.locator('div.flex-1 > div').textContent()

        if (!sectionTitle) continue

        console.log('Testing navigation to:', sectionTitle.trim())

        await section.click()
        await page.waitForTimeout(800)

        const visibleHeading = await page.evaluate(() => {
          const headings = Array.from(document.querySelectorAll('article .prose h2'))
          const viewportTop = window.scrollY + 150

          for (const heading of headings) {
            const rect = heading.getBoundingClientRect()
            const absoluteTop = window.scrollY + rect.top

            if (Math.abs(absoluteTop - viewportTop) < 200) {
              return heading.textContent
            }
          }

          return null
        })

        console.log('Expected:', sectionTitle.trim(), '| Got:', visibleHeading?.trim())

        expect(visibleHeading?.trim()).toBe(sectionTitle.trim())
      }
    })

    test('should highlight active section on scroll', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      // Scroll down to second section
      await page.evaluate(() => {
        const secondHeading = document.querySelectorAll('article .prose h2')[1]
        if (secondHeading) {
          secondHeading.scrollIntoView({ behavior: 'smooth' })
        }
      })

      await page.waitForTimeout(1000)

      // Check that there's an active section (one with colored background)
      const desktopTOC = page.locator('div.hidden.lg\\:block')
      const activeSections = await desktopTOC.locator('button[class*="bg-"]').all()

      expect(activeSections.length).toBeGreaterThan(0)
    })
  })

  test.describe('Mobile TOC', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should show floating action button', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')

      // Wait for animation to complete (1s delay + animation)
      await page.waitForTimeout(2000)

      // Floating button should be visible
      const fab = page.locator('button[aria-label="Open table of contents"]')
      await expect(fab).toBeVisible()

      // Should have progress badge
      await expect(fab.locator('text=/%/')).toBeVisible()
    })

    test('should open drawer when FAB is clicked', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      // Drawer should be visible
      await expect(page.locator('text=Table of Contents')).toBeVisible()

      // Should show progress bar
      await expect(page.locator('text=Reading Progress')).toBeVisible()
    })

    test('should close drawer when backdrop is clicked', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      // Wait for drawer to open
      await page.waitForTimeout(500)

      // Click backdrop (it's the first fixed div with bg-black)
      const backdrop = page.locator('div.fixed.inset-0.bg-black\\/80').first()
      await backdrop.click({ position: { x: 10, y: 10 } })

      // Drawer should be gone
      await expect(page.locator('text=Table of Contents')).not.toBeVisible()
    })

    test('should close drawer with ESC key', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Press ESC
      await page.keyboard.press('Escape')

      // Drawer should be gone
      await expect(page.locator('text=Table of Contents')).not.toBeVisible()
    })

    test('should navigate to correct section when clicking TOC item', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      // Open drawer
      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Find the first section in the drawer (within the scrollable area)
      const drawerContent = page.locator('div.flex-1.overflow-y-auto')
      const firstSection = drawerContent.locator('button').first()

      const sectionTitle = await firstSection.locator('div.flex-1 > div').first().textContent()

      if (!sectionTitle) {
        throw new Error('Section title not found in mobile drawer')
      }

      console.log('Mobile: Clicking TOC section:', sectionTitle.trim())

      // Click the section
      await firstSection.click()

      // Wait for drawer to close and scroll to complete
      await page.waitForTimeout(1000)

      // Drawer should auto-close after clicking
      await expect(page.locator('text=Table of Contents')).not.toBeVisible()

      // Find the visible H2 heading
      const visibleHeading = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('article .prose h2'))
        const viewportTop = window.scrollY + 150

        for (const heading of headings) {
          const rect = heading.getBoundingClientRect()
          const absoluteTop = window.scrollY + rect.top

          if (Math.abs(absoluteTop - viewportTop) < 200) {
            return heading.textContent
          }
        }

        return null
      })

      console.log('Mobile: Visible heading after scroll:', visibleHeading)

      // The clicked section title should match the visible heading
      expect(visibleHeading?.trim()).toBe(sectionTitle.trim())
    })

    test('should expand/collapse sections with children', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Find a section with children (has ChevronRight icon)
      const sectionWithChildren = page.locator('button:has(svg[class*="lucide-chevron"])').first()

      if ((await sectionWithChildren.count()) > 0) {
        // Click to expand
        await sectionWithChildren.click()
        await page.waitForTimeout(300)

        // Should show children now
        const children = page.locator('div.ml-8.mt-1 button')
        await expect(children.first()).toBeVisible()

        // Click again to collapse
        await sectionWithChildren.click()
        await page.waitForTimeout(300)

        // Children should be hidden
        await expect(children.first()).not.toBeVisible()
      }
    })

    test('should show correct reading time estimates', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Check that sections have reading time estimates
      const timeEstimates = page.locator('text=/\\d+ min|< 1 min/')
      const count = await timeEstimates.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should update progress as user scrolls', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      // Get initial progress
      const fab = page.locator('button[aria-label="Open table of contents"]')
      const initialProgress = await fab.locator('text=/%/').textContent()

      console.log('Initial progress:', initialProgress)

      // Scroll down
      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' })
      })

      await page.waitForTimeout(1000)

      // Get new progress
      const newProgress = await fab.locator('text=/%/').textContent()

      console.log('Progress after scroll:', newProgress)

      // Progress should have changed
      expect(newProgress).not.toBe(initialProgress)
    })
  })

  test.describe('Section Type Icons and Colors', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should show appropriate icons for different section types', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Check that sections have icons (svg elements)
      const icons = page.locator('div.flex-1.overflow-y-auto svg[class*="lucide"]')
      const iconCount = await icons.count()

      // Should have at least one icon per section
      expect(iconCount).toBeGreaterThan(0)
    })

    test('should apply different colors to different section types', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Get all section buttons
      const sections = await page.locator('div.flex-1.overflow-y-auto button').all()

      const colors = new Set<string>()

      for (const section of sections.slice(0, 5)) {
        const icon = section.locator('svg').first()
        const className = await icon.getAttribute('class')

        if (className) {
          // Extract color class (text-blue-400, text-purple-400, etc.)
          const colorMatch = className.match(/text-\w+-\d+/)
          if (colorMatch) {
            colors.add(colorMatch[0])
          }
        }
      }

      // Should have multiple different colors (at least 2)
      expect(colors.size).toBeGreaterThanOrEqual(2)
    })
  })

  test.describe('Back to Top Button', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should scroll to top when clicking back to top in drawer', async ({ page }) => {
      await page.goto(TEST_BLOG_POST)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      // Scroll down first
      await page.evaluate(() => {
        window.scrollTo({ top: 500, behavior: 'smooth' })
      })

      await page.waitForTimeout(500)

      // Open drawer
      const fab = page.locator('button[aria-label="Open table of contents"]')
      await fab.click()

      await page.waitForTimeout(500)

      // Click "Back to Top" button in footer
      const backToTop = page.locator('button:has-text("Back to Top")')
      await backToTop.click()

      await page.waitForTimeout(1000)

      // Check that we're at the top
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeLessThan(50)
    })
  })
})
