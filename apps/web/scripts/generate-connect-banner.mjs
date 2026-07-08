#!/usr/bin/env node
/**
 * Generate the "Let's Connect" banner as an image (SVG + PNG) for Substack,
 * where native buttons can't be placed in a horizontal row. Mirrors the blog's
 * Let's-Connect card: gradient panel, ringed avatar, heading, subtext, and a
 * single ROW of pill buttons.
 *
 *   node apps/web/scripts/generate-connect-banner.mjs
 *
 * Output: public/images/connect-banner.svg and .png
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const avatarB64 = readFileSync(join(ROOT, 'public/images/avatar.jpg')).toString('base64')

const W = 1600
const H = 360
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const GREEN = '#34d399'
const DARK = '#0a1326'
const WHITE = '#ffffff'
const SUB = '#d3e2ff'

// pill button: icon group + label, on one row
function button(x, w, label, fill, fg, iconSvg) {
  const cy = 246 // vertical center of the row
  const h = 60
  const y = cy - h / 2
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="13" fill="${fill}"/>
    <g transform="translate(${x + 22}, ${cy})" fill="${fg}">${iconSvg}</g>
    <text x="${x + 52}" y="${cy + 6}" fill="${fg}" font-size="20" font-weight="700">${esc(label)}</text>`
}

// icons centered on (0,0), ~22px
const icoChat = `<path d="M-9 -8 h18 a3 3 0 0 1 3 3 v8 a3 3 0 0 1 -3 3 h-12 l-6 5 v-5 a3 3 0 0 1 -3 -3 v-8 a3 3 0 0 1 3 -3 z" fill="none" stroke="${''}" /><path d="M-9 -8 h18 a3 3 0 0 1 3 3 v8 a3 3 0 0 1 -3 3 h-12 l-6 5 v-5 a3 3 0 0 1 -3 -3 v-8 a3 3 0 0 1 3 -3 z"/>`
const icoGithub = `<g transform="translate(-11,-11) scale(1.37)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></g>`
const icoLinkedin = `<rect x="-11" y="-11" width="22" height="22" rx="4"/><text x="0" y="6" text-anchor="middle" font-size="13" font-weight="800" fill="${DARK}">in</text>`
const icoLinkedinGreen = `<rect x="-11" y="-11" width="22" height="22" rx="4" fill="${GREEN}"/><text x="0" y="6" text-anchor="middle" font-size="13" font-weight="800" fill="${DARK}">in</text>`
const icoTwitter = `<g transform="translate(-11,-10) scale(0.043)"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></g>`

// button layout (one row)
const gap = 16
let x = 270
const b1 = { x, w: 230 }; x += b1.w + gap
const b2 = { x, w: 150 }; x += b2.w + gap
const b3 = { x, w: 168 }; x += b3.w + gap
const b4 = { x, w: 152 }

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a63b0"/><stop offset="1" stop-color="#2f5294"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4178db"/><stop offset="1" stop-color="#3168c9"/>
    </linearGradient>
    <radialGradient id="avbg" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#eafff6"/><stop offset="1" stop-color="#cfe0ff"/>
    </radialGradient>
    <clipPath id="avclip"><circle cx="150" cy="186" r="72"/></clipPath>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="34" y="26" width="${W - 68}" height="${H - 52}" rx="30" fill="url(#card)"/>
  <circle cx="150" cy="186" r="84" fill="${GREEN}" opacity="0.5" filter="url(#glow)"/>
  <circle cx="150" cy="186" r="78" fill="url(#avbg)" stroke="${GREEN}" stroke-width="5"/>
  <image href="data:image/jpeg;base64,${avatarB64}" x="78" y="114" width="144" height="144" clip-path="url(#avclip)" preserveAspectRatio="xMidYMid slice"/>
  <text x="270" y="118" fill="${WHITE}" font-size="48" font-weight="800">Let's Connect!</text>
  <text x="272" y="168" fill="${SUB}" font-size="22">Have questions or want to discuss this further? I'd love to hear from you.</text>
  ${button(b1.x, b1.w, 'Get in Touch', GREEN, DARK, icoChat)}
  ${button(b2.x, b2.w, 'GitHub', DARK, GREEN, icoGithub)}
  ${button(b3.x, b3.w, 'LinkedIn', DARK, GREEN, icoLinkedinGreen)}
  ${button(b4.x, b4.w, 'Twitter', DARK, GREEN, icoTwitter)}
</svg>`

const outDir = join(ROOT, 'public/images')
mkdirSync(outDir, { recursive: true })
const svgPath = join(outDir, 'connect-banner.svg')
const pngPath = join(outDir, 'connect-banner.png')
writeFileSync(svgPath, svg)
console.log(`Wrote ${svgPath}`)
try {
  const { default: sharp } = await import('sharp')
  await sharp(Buffer.from(svg), { density: 200 }).png().toFile(pngPath)
} catch {
  execFileSync('convert', ['-density', '160', '-background', 'none', svgPath, pngPath])
}
console.log(`Wrote ${pngPath}`)
