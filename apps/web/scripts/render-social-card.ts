#!/usr/bin/env bun
/**
 * Render a Wolven Tech social card HTML into a tight PNG of the `.card` element.
 *
 * Usage:
 *   bun apps/web/scripts/render-social-card.ts <input.html> <output.png>
 *
 * Imports `playwright` from apps/web/node_modules, so run it from the repo root
 * (or with an absolute path) — bun resolves the dependency from this file's
 * location upward. First run needs the browser: `cd apps/web && bun run test:install`.
 */
import { chromium } from 'playwright'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [input, output] = process.argv.slice(2)

if (!input || !output) {
  console.error('usage: render-social-card.ts <input.html> <output.png>')
  process.exit(1)
}

const url = pathToFileURL(resolve(input)).href
const out = resolve(output)

const browser = await chromium.launch()
try {
  const context = await browser.newContext({ deviceScaleFactor: 2 })
  const page = await context.newPage()

  await page.goto(url, { waitUntil: 'networkidle' })
  // Wait for the Inter web font so text metrics match the design.
  await page.evaluate(() => document.fonts?.ready)

  const card = page.locator('.card')
  await card.waitFor({ state: 'visible' })
  await card.screenshot({ path: out })

  console.log(`wrote ${out}`)
} finally {
  await browser.close()
}
