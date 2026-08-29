import { expect, test } from '@playwright/test'

test.describe('Wolven Tech homepage', () => {
  test('shows evidence-backed workflow and both public skill suites', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const section = page.locator('#how-i-work')
    await expect(section).toBeVisible()
    await expect(
      section.getByRole('heading', { name: 'Control the work. Keep the evidence.' })
    ).toBeVisible()
    await expect(section.getByRole('img')).toHaveAttribute(
      'alt',
      /technical inspection, scoped platform delivery, verification, and retained improvements/
    )
    await expect(section.getByRole('link', { name: 'Inspect source' }).nth(0)).toHaveAttribute(
      'href',
      'https://github.com/decebal/decebal-claude-skills'
    )
    await expect(section.getByRole('link', { name: 'Inspect source' }).nth(1)).toHaveAttribute(
      'href',
      'https://github.com/decebal/decebal-codex-skills'
    )

    const artifacts = page.locator('#artifacts')
    await expect(artifacts.getByRole('heading', { name: 'decebal-claude-skills' })).toBeVisible()
    await expect(artifacts.getByRole('heading', { name: 'decebal-codex-skills' })).toBeVisible()
    expect(errors, `Browser errors detected:\n${errors.join('\n')}`).toEqual([])
  })

  test('keeps workflow within a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/#how-i-work')

    const section = page.locator('#how-i-work')
    await expect(section).toBeVisible()
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(overflows).toBe(false)
  })
})
