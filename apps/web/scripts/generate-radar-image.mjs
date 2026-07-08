#!/usr/bin/env node
/**
 * Generate a static image of the Rust & AI Crate Radar from src/data/crateRadar.ts.
 *
 * Reuses the exact blip-placement math from src/components/radar/geometry.ts so
 * the rendered image matches the live /radar page. Emits an SVG (crisp, for the
 * blog/canonical) and a PNG (for Substack and other raster surfaces).
 *
 * Run this for every weekly after updating crateRadar.ts:
 *   node apps/web/scripts/generate-radar-image.mjs
 *
 * Output: public/images/radar/<RADAR_GENERATED_AT>-radar.svg and .png
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Load data from crateRadar.ts (no TS runtime needed) ──────────────────────
const src = readFileSync(join(ROOT, 'src/data/crateRadar.ts'), 'utf8')
const arrMatch = src.match(/crateRadarTools:\s*RadarTool\[\]\s*=\s*(\[[\s\S]*?\n\])/)
if (!arrMatch) throw new Error('Could not locate crateRadarTools array')
// The object literals are valid JS (unquoted keys, single quotes, no TS-only syntax).
const tools = eval(`(${arrMatch[1]})`)
const dateMatch = src.match(/RADAR_GENERATED_AT\s*=\s*'([^']+)'/)
const GENERATED_AT = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10)

// ── Geometry (mirrors src/components/radar/geometry.ts) ──────────────────────
const RING_COLORS = { Adopt: '#3fb950', Trial: '#58a6ff', Assess: '#d29922', Hold: '#f85149' }
const QUAD_ANGLE = { agentic: [180, 270], inference: [270, 360], data: [90, 180], dev: [0, 90] }
const QUADRANTS = [
  { key: 'agentic', label: 'Agentic & LLM' },
  { key: 'inference', label: 'Inference & Serving' },
  { key: 'data', label: 'Data & Search' },
  { key: 'dev', label: 'Dev Tools & Editors' },
]
const RINGS = ['Adopt', 'Trial', 'Assess', 'Hold']
const R = 300
const BOUNDS = [0, 0.42, 0.6, 0.78, 0.95]
const A_PAD = 11
const CENTER = R

function magnitude(s) {
  if (!s) return 0
  const m = String(s).match(/([\d.]+)\s*([kKmM])?/)
  if (!m || m[1] === undefined) return 0
  let v = Number.parseFloat(m[1])
  const u = (m[2] || '').toLowerCase()
  if (u === 'k') v *= 1e3
  if (u === 'm') v *= 1e6
  return v
}
function radiusFor(w) {
  if (!w) return 8.5
  return Math.max(8, Math.min(17, 8 + (Math.log10(w) - 2.5) * 3.0))
}
function buildBlips(tools) {
  const out = []
  let n = 0
  for (const q of QUADRANTS) {
    for (const ring of RINGS) {
      const ri = RINGS.indexOf(ring)
      const group = tools
        .filter((t) => t.quadrant === q.key && t.ring === ring)
        .sort((a, b) => magnitude(b.stars || b.downloads) - magnitude(a.stars || a.downloads))
      const [a0, a1] = QUAD_ANGLE[q.key]
      const aStart = a0 + A_PAD
      const aEnd = a1 - A_PAD
      const bandIn = BOUNDS[ri] * R
      const bandOut = BOUNDS[ri + 1] * R
      group.forEach((t, gi) => {
        n += 1
        const frac = group.length === 1 ? 0.5 : gi / (group.length - 1)
        const ang = ((aStart + frac * (aEnd - aStart)) * Math.PI) / 180
        const sub = group.length === 1 ? 0.5 : gi % 2 === 0 ? 0.36 : 0.66
        const rad = bandIn + (bandOut - bandIn) * sub
        const w = magnitude(t.stars || t.downloads)
        out.push({ ...t, number: n, r: radiusFor(w), x: R + rad * Math.cos(ang), y: R + rad * Math.sin(ang) })
      })
    }
  }
  return out
}

const blips = buildBlips(tools)

// ── SVG composition ──────────────────────────────────────────────────────────
const W = 1180
const H = 820
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const bg = '#0d1117'
const grid = '#30363d'
const fg = '#c9d1d9'
const muted = '#8b949e'

// radar group: place radar (content center 300,300) on the left
const RS = 0.92 // radar scale
const RX = 40
const RY = 96
const rg = (cx, cy) => ({ x: RX + cx * RS, y: RY + cy * RS })

let svg = ''
svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif">`
svg += `<rect width="${W}" height="${H}" fill="${bg}"/>`

// Title + ring legend
svg += `<text x="40" y="48" fill="${fg}" font-size="30" font-weight="700">Rust &amp; AI Crate Radar</text>`
svg += `<text x="40" y="74" fill="${muted}" font-size="15">${tools.length} tools mapped · Rust &amp; AI Weekly #3 · updated ${GENERATED_AT}</text>`
// ring legend top-right
let lx = W - 470
RINGS.forEach((ring, i) => {
  const x = lx + i * 118
  svg += `<circle cx="${x}" cy="42" r="6" fill="${RING_COLORS[ring]}"/>`
  svg += `<text x="${x + 12}" y="47" fill="${fg}" font-size="14">${ring}</text>`
})

// concentric ring boundaries
svg += `<g>`
for (let i = 1; i < BOUNDS.length; i++) {
  const c = rg(CENTER, CENTER)
  svg += `<circle cx="${c.x}" cy="${c.y}" r="${BOUNDS[i] * R * RS}" fill="none" stroke="${grid}" stroke-width="1"/>`
}
// quadrant dividers
const top = rg(CENTER, CENTER - BOUNDS[4] * R)
const bot = rg(CENTER, CENTER + BOUNDS[4] * R)
const lft = rg(CENTER - BOUNDS[4] * R, CENTER)
const rgt = rg(CENTER + BOUNDS[4] * R, CENTER)
svg += `<line x1="${top.x}" y1="${top.y}" x2="${bot.x}" y2="${bot.y}" stroke="${grid}" stroke-width="1"/>`
svg += `<line x1="${lft.x}" y1="${lft.y}" x2="${rgt.x}" y2="${rgt.y}" stroke="${grid}" stroke-width="1"/>`
svg += `</g>`

// quadrant labels at outer diagonal
const corners = {
  agentic: { dx: -1, dy: -1, anchor: 'start' },
  inference: { dx: 1, dy: -1, anchor: 'end' },
  data: { dx: -1, dy: 1, anchor: 'start' },
  dev: { dx: 1, dy: 1, anchor: 'end' },
}
for (const q of QUADRANTS) {
  const [a0, a1] = QUAD_ANGLE[q.key]
  const mid = (((a0 + a1) / 2) * Math.PI) / 180
  const rad = BOUNDS[4] * R + 6
  const p = rg(CENTER + rad * Math.cos(mid), CENTER + rad * Math.sin(mid))
  const c = corners[q.key]
  svg += `<text x="${p.x}" y="${p.y + (c.dy < 0 ? -4 : 14)}" fill="${muted}" font-size="14" font-weight="600" text-anchor="${c.anchor === 'end' ? 'end' : 'start'}">${esc(q.label)}</text>`
}

// blips
for (const b of blips) {
  const p = rg(b.x, b.y)
  const rr = b.r * RS
  const stroke = b.returning ? '#ffffff' : 'none'
  svg += `<circle cx="${p.x}" cy="${p.y}" r="${rr}" fill="${RING_COLORS[b.ring]}" stroke="${stroke}" stroke-width="${b.returning ? 1.6 : 0}"/>`
  svg += `<text x="${p.x}" y="${p.y + 3.5}" fill="#0d1117" font-size="${rr > 9 ? 10 : 8.5}" font-weight="700" text-anchor="middle">${b.number}</text>`
}

// legend (right column), grouped by quadrant
let ly = 108
const legX = W - 470
svg += `<text x="${legX}" y="${ly - 18}" fill="${muted}" font-size="12">↺ = returning (also in an earlier issue)</text>`
for (const q of QUADRANTS) {
  svg += `<text x="${legX}" y="${ly}" fill="${fg}" font-size="14" font-weight="700">${esc(q.label)}</text>`
  ly += 20
  const items = blips.filter((b) => b.quadrant === q.key).sort((a, b) => a.number - b.number)
  for (const b of items) {
    svg += `<circle cx="${legX + 6}" cy="${ly - 4}" r="5.5" fill="${RING_COLORS[b.ring]}"/>`
    svg += `<text x="${legX + 6}" y="${ly - 0.5}" fill="#0d1117" font-size="8" font-weight="700" text-anchor="middle">${b.number}</text>`
    const name = esc(b.name) + (b.returning ? ' ↺' : '')
    svg += `<text x="${legX + 18}" y="${ly}" fill="${fg}" font-size="13.5">${name}</text>`
    svg += `<text x="${legX + 18 + 150}" y="${ly}" fill="${muted}" font-size="12">${b.ring}</text>`
    ly += 18
  }
  ly += 8
}

svg += `</svg>`

// ── Write outputs ────────────────────────────────────────────────────────────
const outDir = join(ROOT, 'public/images/radar')
mkdirSync(outDir, { recursive: true })
const svgPath = join(outDir, `${GENERATED_AT}-radar.svg`)
const pngPath = join(outDir, `${GENERATED_AT}-radar.png`)
writeFileSync(svgPath, svg)
console.log(`Wrote ${svgPath}`)

// Rasterize to PNG. Prefer sharp (works on the author's machine); fall back to
// ImageMagick `convert` if sharp's native binary isn't available for this arch.
let pngDone = false
try {
  const { default: sharp } = await import('sharp')
  await sharp(Buffer.from(svg), { density: 200 }).png().toFile(pngPath)
  pngDone = true
} catch (_e) {
  try {
    execFileSync('convert', ['-density', '200', '-background', '#0d1117', svgPath, pngPath])
    pngDone = true
  } catch (e2) {
    console.warn('PNG rasterization skipped (no sharp / convert):', e2.message)
  }
}
if (pngDone) console.log(`Wrote ${pngPath}`)
console.log(`Tools: ${tools.length} · blips: ${blips.length}`)
