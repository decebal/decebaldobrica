
import { writeFileSync, mkdirSync } from 'node:fs'

const W = 1200, H = 760
const counts = { Adopt: 12, Trial: 17, Assess: 11, Hold: 2 }
const colors = { Adopt: '#4ade80', Trial: '#60a5fa', Assess: '#fbbf24', Hold: '#f87171' }

// verdict bar geometry
const barX = 60, barW = 1080, gap = 8, barY = 268, barH = 84
const minW = 90
const segs = []
{
  const keys = Object.keys(counts)
  const avail = barW - gap * (keys.length - 1)
  const total = 42
  // hold gets min width, others share the rest proportionally
  const holdW = minW
  const rest = avail - holdW
  const restTotal = total - counts.Hold
  let x = barX
  for (const k of keys) {
    const w = k === 'Hold' ? holdW : (counts[k] / restTotal) * rest
    segs.push({ k, x, w })
    x += w + gap
  }
}

const segSvg = segs.map(({ k, x, w }) => `
  <rect x="${x.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" rx="12" fill="${colors[k]}"/>
  <text x="${(x + w / 2).toFixed(1)}" y="${barY + 38}" text-anchor="middle" font-size="30" font-weight="700" fill="#0d1117">${counts[k]}</text>
  <text x="${(x + w / 2).toFixed(1)}" y="${barY + 64}" text-anchor="middle" font-size="16" font-weight="600" fill="#0d1117" opacity="0.75">${k}</text>`).join('')

const cards = [
  { dot: colors.Trial, name: 'copper-rs', lines: ['Deterministic robotics', 'runtime hits 1.0 —', 'Pick of the week'] },
  { dot: colors.Assess, name: 'rama', lines: ['The framework behind AI', 'proxy gateways ships 0.3,', 'five years in'] },
  { dot: colors.Trial, name: 'apalis', lines: ["The Rust seat at Go's", 'Postgres-job-queue', 'table, nearing 1.0'] },
]
const cw = (1080 - 2 * 24) / 3, cy = 392, ch = 216
const cardSvg = cards.map((c, i) => {
  const cx = 60 + i * (cw + 24)
  const lines = c.lines.map((l, j) => `<text x="${cx + 26}" y="${cy + 104 + j * 32}" font-size="20" fill="#94a3b8">${l}</text>`).join('')
  return `
  <rect x="${cx}" y="${cy}" width="${cw.toFixed(1)}" height="${ch}" rx="16" fill="#111826" stroke="#263041" stroke-width="1.5"/>
  <circle cx="${cx + 34}" cy="${cy + 48}" r="7" fill="${c.dot}"/>
  <text x="${cx + 54}" y="${cy + 57}" font-size="30" font-weight="700" fill="#f5f7fa">${c.name}</text>
  ${lines}`
}).join('')

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans, Inter, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#ea580c"/>
    </linearGradient>
    <clipPath id="cardClip"><rect x="0" y="0" width="${W}" height="${H}" rx="24"/></clipPath>
  </defs>
  <g clip-path="url(#cardClip)">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#0d1117"/>
    <rect x="0" y="0" width="12" height="${H}" fill="url(#accent)"/>
  </g>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="24" fill="none" stroke="#1e2633" stroke-width="1.5"/>
  <text x="62" y="92" font-size="22" font-weight="700" letter-spacing="4" fill="#f97316">ISSUE #4 · NEWSLETTER + LIVE RADAR</text>
  <text x="60" y="168" font-size="62" font-weight="800" fill="#f5f7fa">Rust &amp; AI Weekly #4</text>
  <text x="60" y="218" font-size="26" fill="#9aa7b4">A vetted sweep of where Rust meets AI — 42 crates &amp; tools, placed by verdict.</text>
  ${segSvg}
  ${cardSvg}
  <text x="60" y="694" font-size="26" font-weight="700" fill="#f5f7fa">Explore the live radar → <tspan fill="#f97316">decebaldobrica.com/radar</tspan></text>
</svg>`

mkdirSync('../../docs/social', { recursive: true })
writeFileSync('../../docs/social/rust-ai-weekly-4-card.svg', svg)

console.log('done')
