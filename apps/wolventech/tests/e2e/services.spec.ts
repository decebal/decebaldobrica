import { expect, test } from '@playwright/test'

const services = [
  {
    path: '/services/rust-consulting',
    heading: 'Rust consulting and software architecture review',
  },
  {
    path: '/services/software-technical-due-diligence',
    heading: 'Software technical due diligence for Rust codebases',
  },
]

for (const service of services) {
  test(`${service.path} is discoverable, canonical and usable on desktop and mobile`, async ({
    page,
    request,
  }) => {
    await page.goto('/')
    await page.locator(`#services a[href="${service.path}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${service.path}$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(service.heading)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://wolventech.com${service.path}`
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://wolventech.com${service.path}`
    )
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length).toBeGreaterThanOrEqual(120)
    expect(description?.length).toBeLessThanOrEqual(160)
    expect(await (await request.get('/sitemap.xml')).text()).toContain(
      `https://wolventech.com${service.path}`
    )

    for (const width of [1440, 360]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true)
    }
    const contact = page.getByRole('link', { name: 'Discuss your codebase', exact: true })
    await contact.hover()
    const contrast = await contact.evaluate((element) => {
      const styles = getComputedStyle(element)
      const luminance = (color: string) => {
        const channels = color
          .match(/\d+(?:\.\d+)?/g)
          ?.slice(0, 3)
          .map(Number)
        if (!channels || channels.length !== 3) throw new Error(`Unexpected color: ${color}`)
        return channels.reduce((sum, channel, index) => {
          const value = channel / 255
          const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
          return sum + linear * [0.2126, 0.7152, 0.0722][index]
        }, 0)
      }
      const foreground = luminance(styles.color)
      const background = luminance(styles.backgroundColor)
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
    })
    expect(contrast).toBeGreaterThanOrEqual(4.5)
    await contact.focus()
    await expect(contact).toBeFocused()
    await contact.click()
    await expect(page).toHaveURL(/\/contact$/)
  })
}
