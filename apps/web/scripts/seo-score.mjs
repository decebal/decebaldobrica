#!/usr/bin/env node
/**
 * seo-score.mjs: the read-only evaluation harness for the SEO autoresearch loop.
 *
 * This is the `prepare.py` of the loop (see docs/seo/autoresearch-program.md):
 * a fixed, deterministic scorer that the experimenting agent may run but must
 * not modify. It reads one MDX post and prints a summary in the same shape the
 * autoresearch train.py prints, so the loop can grep the metric:
 *
 *   node apps/web/scripts/seo-score.mjs apps/web/content/blog/<slug>.mdx \
 *     --keyword "CUDA Rust" --secondary "cuTile Rust,rustls,Rust newsletter"
 *
 *   ---
 *   seo_score:        71.5
 *   word_count:       4120
 *   ...
 *
 * Add --verbose for the per-check breakdown. Exit code is always 0 so that a
 * poor score is a result, not a crash.
 *
 * What it models: the rendered page as apps/web/src/app/blog/[slug]/page.tsx
 * builds it. The <title> is `${seoTitle ?? title} | ${config.name}`; the H1 is
 * the frontmatter title; the meta description is `seoDescription` when present,
 * else `description`; body headings, links and images come from the markdown.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const matter = require('gray-matter')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Fixed constants (do not tune these from inside the loop) ─────────────────
const SITE_HOST = 'decebaldobrica.com'
const personal = JSON.parse(readFileSync(join(ROOT, 'src/config/personal.json'), 'utf8'))
const TITLE_SUFFIX = ` | ${personal.name ?? 'Decebal Dobrica'}`
const TITLE_MIN = 45
const TITLE_MAX = 65
const DESC_MIN = 120
const DESC_MAX = 160
const LEAD_WORDS = 150
const MIN_WORDS = 1500
const GOOD_WORDS = 2000
const MIN_INTERNAL_LINKS = 3
const GOOD_INTERNAL_LINKS = 5
const MIN_EXTERNAL_LINKS = 5
const MAX_AVG_SENTENCE = 28
const LONG_SENTENCE = 40
const LONG_SENTENCE_SHARE = 0.15
const WALL_PARAGRAPH_WORDS = 350
const DENSITY_MIN = 0.003
const DENSITY_MAX = 0.02
const MIN_H2 = 5
const TAGS_MIN = 4
const TAGS_MAX = 8

// ── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--'))
if (!file) {
  console.error(
    'usage: seo-score.mjs <post.mdx> --keyword "<primary>" [--secondary "a,b,c"] [--verbose]'
  )
  process.exit(2)
}
const flag = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const KEYWORD = flag('--keyword')
if (!KEYWORD) {
  console.error('--keyword is required: the primary keyword is a fixed constant of the experiment')
  process.exit(2)
}
const SECONDARY = (flag('--secondary') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const VERBOSE = args.includes('--verbose')

// ── Parse ────────────────────────────────────────────────────────────────────
const raw = readFileSync(file, 'utf8')
const { data: fm, content } = matter(raw)

const title = String(fm.title ?? '')
// The page emits seoTitle when present, else title; the H1 is always title.
const searchTitle = String(fm.seoTitle ?? title)
const renderedTitle = searchTitle + TITLE_SUFFIX
const description = String(fm.seoDescription ?? fm.description ?? '')
const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : []
const slug = String(fm.slug ?? '')

const lines = content.split('\n')
const headings = []
for (const l of lines) {
  const m = l.match(/^(#{1,6})\s+(.*)$/)
  if (m) headings.push({ level: m[1].length, text: stripMd(m[2]) })
}
const links = [...content.matchAll(/\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => ({
  text: m[1],
  href: m[2],
}))
const images = [...content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map((m) => ({
  alt: m[1],
  src: m[2],
}))

// Prose = content with code, images, links reduced to their visible text.
const prose = stripMd(
  content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<br\s*\/?>/g, ' ')
)
const words = prose.split(/\s+/).filter(Boolean)
const wordCount = words.length
const paragraphs = content
  .split(/\n\s*\n/)
  .map((p) => p.trim())
  .filter((p) => p && !p.startsWith('#') && !p.startsWith('!['))
const sentences = prose
  .split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/)
  .map((s) => s.trim())
  .filter((s) => s.split(/\s+/).length >= 3)
const sentenceLens = sentences.map((s) => s.split(/\s+/).length)
const avgSentence = sentenceLens.length
  ? sentenceLens.reduce((a, b) => a + b, 0) / sentenceLens.length
  : 0
const longShare = sentenceLens.length
  ? sentenceLens.filter((n) => n > LONG_SENTENCE).length / sentenceLens.length
  : 0

const lead = words.slice(0, LEAD_WORDS).join(' ')
const has = (hay, needle) => norm(hay).includes(norm(needle))
const count = (hay, needle) => {
  const h = norm(hay)
  const n = norm(needle)
  if (!n) return 0
  let c = 0
  let i = 0
  for (;;) {
    i = h.indexOf(n, i)
    if (i < 0) return c
    c++
    i += n.length
  }
}

const internalLinks = links.filter((l) => l.href.startsWith('/') || l.href.includes(SITE_HOST))
const externalLinks = links.filter(
  (l) => /^https?:\/\//.test(l.href) && !l.href.includes(SITE_HOST)
)
const weakAnchors = links.filter((l) =>
  /^(here|click here|this|link|read more)$/i.test(l.text.trim())
)

// ── Checks: [id, weight, pass fraction 0..1, detail] ─────────────────────────
const checks = []
const add = (id, weight, score, detail) => checks.push({ id, weight, score: clamp(score), detail })

// Title
add(
  'title_length',
  8,
  band(renderedTitle.length, TITLE_MIN, TITLE_MAX, 10),
  `rendered <title> is ${renderedTitle.length} chars (target ${TITLE_MIN}-${TITLE_MAX}): "${renderedTitle}"`
)
add(
  'title_keyword',
  7,
  has(searchTitle, KEYWORD) ? 1 : 0,
  `primary keyword in <title>: ${has(searchTitle, KEYWORD)}${fm.seoTitle ? ' (via seoTitle)' : ''}`
)

// Description
add(
  'description_length',
  10,
  band(description.length, DESC_MIN, DESC_MAX, 25),
  `meta description is ${description.length} chars (target ${DESC_MIN}-${DESC_MAX})${fm.seoDescription ? ' via seoDescription' : ''}`
)
add(
  'description_keyword',
  5,
  has(description, KEYWORD) ? 1 : 0,
  `primary keyword in meta description: ${has(description, KEYWORD)}`
)
add(
  'description_sentence',
  1,
  /[.!?]$/.test(description.trim()) ? 1 : 0,
  'meta description ends as a sentence'
)

// H1 and hierarchy
const bodyH1 = headings.filter((h) => h.level === 1).length
add(
  'single_h1',
  4,
  bodyH1 === 0 ? 1 : 0,
  `body H1s: ${bodyH1} (the page already renders the title as H1)`
)
let skips = 0
let prev = 1
for (const h of headings) {
  if (h.level > prev + 1) skips++
  prev = h.level
}
add('heading_hierarchy', 3, skips === 0 ? 1 : 0, `skipped heading levels: ${skips}`)
const h2s = headings.filter((h) => h.level === 2)
add('h2_count', 2, Math.min(1, h2s.length / MIN_H2), `H2 count: ${h2s.length} (want >= ${MIN_H2})`)
const kwInH2 = h2s.some((h) => has(h.text, KEYWORD) || SECONDARY.some((s) => has(h.text, s)))
add('h2_keyword', 6, kwInH2 ? 1 : 0, `primary or secondary keyword in an H2: ${kwInH2}`)

// Lead
add(
  'lead_keyword',
  8,
  has(lead, KEYWORD) ? 1 : 0,
  `primary keyword in first ${LEAD_WORDS} words: ${has(lead, KEYWORD)}`
)

// Length
add(
  'word_count',
  5,
  wordCount >= GOOD_WORDS ? 1 : wordCount >= MIN_WORDS ? 0.6 : wordCount / MIN_WORDS,
  `word count: ${wordCount}`
)

// Links
add(
  'internal_links',
  8,
  internalLinks.length >= GOOD_INTERNAL_LINKS
    ? 1
    : internalLinks.length >= MIN_INTERNAL_LINKS
      ? 0.6
      : internalLinks.length / MIN_INTERNAL_LINKS,
  `internal links: ${internalLinks.length} (${[...new Set(internalLinks.map((l) => l.href))].join(', ')})`
)
add(
  'external_links',
  3,
  Math.min(1, externalLinks.length / MIN_EXTERNAL_LINKS),
  `external links: ${externalLinks.length}`
)
add(
  'anchor_text',
  2,
  weakAnchors.length === 0 ? 1 : 0,
  `weak anchors ("here", "this"): ${weakAnchors.length}`
)

// Images
const missingAlt = images.filter((i) => !i.alt.trim()).length
add(
  'image_alt',
  4,
  images.length === 0 ? 1 : 1 - missingAlt / images.length,
  `images: ${images.length}, missing alt: ${missingAlt}`
)

// Secondary keywords
const secHits = SECONDARY.filter((s) => has(prose, s))
add(
  'secondary_keywords',
  8,
  SECONDARY.length ? secHits.length / SECONDARY.length : 1,
  `secondary keywords present: ${secHits.length}/${SECONDARY.length} (${secHits.join(', ')})`
)

// Density
const kwWords = KEYWORD.split(/\s+/).length
const density = wordCount ? (count(prose, KEYWORD) * kwWords) / wordCount : 0
add(
  'keyword_density',
  4,
  density >= DENSITY_MIN && density <= DENSITY_MAX
    ? 1
    : density < DENSITY_MIN
      ? density / DENSITY_MIN
      : Math.max(0, 1 - (density - DENSITY_MAX) / DENSITY_MAX),
  `primary keyword density: ${(density * 100).toFixed(2)}% (${count(prose, KEYWORD)} occurrences; target ${DENSITY_MIN * 100}-${DENSITY_MAX * 100}%)`
)

// Readability
add(
  'avg_sentence_length',
  4,
  avgSentence <= MAX_AVG_SENTENCE
    ? 1
    : Math.max(0, 1 - (avgSentence - MAX_AVG_SENTENCE) / MAX_AVG_SENTENCE),
  `average sentence length: ${avgSentence.toFixed(1)} words (target <= ${MAX_AVG_SENTENCE})`
)
add(
  'long_sentences',
  3,
  longShare <= LONG_SENTENCE_SHARE
    ? 1
    : Math.max(0, 1 - (longShare - LONG_SENTENCE_SHARE) / LONG_SENTENCE_SHARE),
  `sentences over ${LONG_SENTENCE} words: ${(longShare * 100).toFixed(1)}% (target <= ${LONG_SENTENCE_SHARE * 100}%)`
)
const walls = paragraphs.filter((p) => stripMd(p).split(/\s+/).length > WALL_PARAGRAPH_WORDS)
add(
  'paragraph_walls',
  3,
  walls.length === 0 ? 1 : Math.max(0, 1 - walls.length / 3),
  `paragraphs over ${WALL_PARAGRAPH_WORDS} words: ${walls.length}`
)

// Tags
add(
  'tag_count',
  2,
  tags.length >= TAGS_MIN && tags.length <= TAGS_MAX ? 1 : 0.5,
  `tags: ${tags.length} (${tags.join(', ')})`
)

// Slug and frontmatter hygiene (fixed by the publishing pipeline; sanity only)
add('slug_present', 2, slug ? 1 : 0, `slug: ${slug || '(missing)'}`)

// ── Score ────────────────────────────────────────────────────────────────────
const totalWeight = checks.reduce((a, c) => a + c.weight, 0)
const score = (checks.reduce((a, c) => a + c.weight * c.score, 0) / totalWeight) * 100

if (VERBOSE) {
  console.log('check                      weight  got   detail')
  for (const c of checks) {
    const got = (c.weight * c.score).toFixed(1).padStart(5)
    console.log(`${c.id.padEnd(26)} ${String(c.weight).padStart(5)}  ${got}  ${c.detail}`)
  }
  console.log()
}

console.log('---')
console.log(`seo_score:        ${score.toFixed(1)}`)
console.log(`word_count:       ${wordCount}`)
console.log(`title_chars:      ${renderedTitle.length}`)
console.log(`description_chars:${String(description.length).padStart(5)}`)
console.log(`internal_links:   ${internalLinks.length}`)
console.log(`external_links:   ${externalLinks.length}`)
console.log(`h2_count:         ${h2s.length}`)
console.log(`avg_sentence:     ${avgSentence.toFixed(1)}`)
console.log(`keyword_density:  ${(density * 100).toFixed(2)}%`)
console.log(
  `failing_checks:   ${
    checks
      .filter((c) => c.score < 1)
      .map((c) => c.id)
      .join(',') || 'none'
  }`
)

// ── helpers ──────────────────────────────────────────────────────────────────
function stripMd(s) {
  return s
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}
function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9.+ ]/g, ' ')
    .replace(/\s+/g, ' ')
}
function clamp(x) {
  return Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0))
}
/** 1 inside [lo, hi]; linear falloff to 0 over `slack` chars outside. */
function band(n, lo, hi, slack) {
  if (n >= lo && n <= hi) return 1
  const d = n < lo ? lo - n : n - hi
  return Math.max(0, 1 - d / slack)
}
