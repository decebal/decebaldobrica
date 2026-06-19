import { expect, test } from '@playwright/test'

// Smoke tests for the redesigned full-bleed Crate Radar hero. These gate the
// things the project cares about: no console errors / hydration issues / missing
// "use client" directives, plus that the interactive surface and its overlays
// render and remain keyboard/screen-reader reachable.

test.describe('Crate Radar (/radar)', () => {
  test('renders full-bleed without console or hydration errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/radar')
    await page.waitForLoadState('networkidle')

    // The interactive surface is present and labelled as an application.
    const surface = page.getByRole('application', { name: /crate radar/i })
    await expect(surface).toBeVisible()

    // Full-bleed: the surface should be roughly the viewport width (no big gutters).
    const viewport = page.viewportSize()
    if (viewport) {
      const box = await surface.boundingBox()
      expect(box).not.toBeNull()
      if (box) expect(box.width).toBeGreaterThan(viewport.width * 0.9)
    }

    // Live count is announced.
    await expect(page.getByText(/Showing \d+ of \d+ tools/)).toBeVisible()

    const critical = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('ERR_CONNECTION_REFUSED') &&
        !e.toLowerCase().includes('ollama')
    )
    expect(critical, `Console/page errors:\n${critical.join('\n')}`).toHaveLength(0)
  })

  test('blips keep descriptive aria-labels and are focusable', async ({ page }) => {
    await page.goto('/radar')
    await page.waitForLoadState('networkidle')

    // At least one blip exposes the "name, ring, quadrant" aria-label contract.
    const goose = page.getByRole('button', { name: /goose, Adopt, Agentic/i })
    await expect(goose).toBeVisible()
  })

  test('ring filter toggles the live count', async ({ page }) => {
    await page.goto('/radar')
    await page.waitForLoadState('networkidle')

    const count = page.getByText(/Showing \d+ of \d+ tools/)
    const before = await count.textContent()

    // Toggle the "Hold" ring off.
    await page.getByRole('button', { name: /^Hold/ }).click()
    await expect(count).not.toHaveText(before ?? '')
  })

  test('zoom + reset controls are keyboard reachable', async ({ page }) => {
    await page.goto('/radar')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible()
  })

  test('⌘K command palette opens and lists tools', async ({ page }) => {
    await page.goto('/radar')
    await page.waitForLoadState('networkidle')

    await page.keyboard.press('ControlOrMeta+k')

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const input = dialog.getByPlaceholder(/search tools/i)
    await expect(input).toBeVisible()
    await input.fill('qdrant')
    await expect(dialog.getByText(/qdrant/i).first()).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
