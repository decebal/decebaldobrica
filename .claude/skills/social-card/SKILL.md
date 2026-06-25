---
name: social-card
description: Generate a branded Wolven Tech social card PNG by extracting a punchy hook from an article and rendering it into docs/social/template.html. Use when the user wants a social/share image from a blog post, LinkedIn post, or article — "make a card from this article", "social card", "turn this into an image", "card for this post".
user-invocable: true
argument-hint: "[article text | file path | URL]"
---

Turn an article into the brand social card: extract its sharpest hook, drop it
into `docs/social/template.html`, and render a tight PNG of the card with
Playwright (the same browser engine the repo's E2E tests use).

## Inputs

The article can arrive three ways:

- **Pasted text** — use it directly.
- **File path** (`.mdx`, `.md`, `.txt`) — Read it.
- **URL** — fetch it (WebFetch) and use the main body.

If nothing is passed, ask for the article.

## Step 1 — Extract the hook (this is the skill's core)

Read the whole article, find the single sharpest tension, and compress it to
**exactly three lines** that map to the template's three `<p>` blocks:

1. **The seductive premise** — the thing the reader currently believes / the
   move that "sounds smart." One declarative sentence.
2. **The turn** — the cost, number, or fact that breaks the premise. This line
   carries **exactly one** highlighted metric, wrapped in
   `<span class="highlight">…</span>` (amber). Lead with the number when you can.
3. **The reframe** — the one-line lesson the reader leaves with.

Rules:

- Each line is a standalone sentence. Aim for ≤ ~8 words; never wrap past one
  visual line in the 500px card.
- Exactly **one** `.highlight` span, and it lives on line 2 (the metric). Never
  highlight more than one phrase — the contrast is the point.
- Match the brand voice already in the template: flat, declarative, a little
  dry. **No** emojis, no hashtags, no CTAs, no exclamation marks. Strip all of
  those from the source.
- Keep the name/handle block (`Decebal Dobrica · Wolven Tech` + gold badge)
  untouched. Only `.content` changes.

Example (from a "total cost of ownership" article):

```html
<p>Saving $200/month on AI costs sounds smart.</p>
<p><span class="highlight">Until the invoice hits $20K.</span></p>
<p>API cost isn't total cost of ownership.</p>
```

## Step 2 — Build the filled HTML

1. Pick a kebab-case slug from the hook (e.g. `ai-cost-tco-trap`).
2. Copy `docs/social/template.html` to `docs/social/<slug>.html`.
   Keep it in `docs/social/` so the relative avatar `src="1720955965715.jpeg"`
   still resolves at render time.
3. Replace **only** the inner HTML of `<div class="content">…</div>` with your
   three `<p>` lines.

## Step 3 — Render the PNG

From the repo root:

```bash
bun apps/web/scripts/render-social-card.ts docs/social/<slug>.html docs/social/<slug>.png
```

The script launches headless Chromium, waits for the Inter web font and the
avatar to load, and screenshots just the `.card` element at 2× scale (crisp on
retina). Output is a tight PNG of the card on black — drop-in for LinkedIn, X,
or a blog OG slot.

If you also need a 1200×630 OG crop or a WebP, hand the PNG to the `blog-image`
skill (`optimize_image.py --preset og`).

## Step 4 — Report

Give the user the PNG path and the three lines you chose. Offer to tweak the
hook or the highlighted metric. By default, **leave the generated `<slug>.html`
in place** (it's the editable source); only remove it if the user asks.

## Notes

- The render script imports `playwright` from `apps/web/node_modules`, so it
  must be invoked from the repo root (or with an absolute path) — `bun` resolves
  the dependency from the script's own location upward.
- First run needs the Chromium browser: `cd apps/web && bun run test:install`.
- The template's only dynamic region is `.content`. If a future card needs a
  different avatar or name, edit `template.html`, not this skill.
