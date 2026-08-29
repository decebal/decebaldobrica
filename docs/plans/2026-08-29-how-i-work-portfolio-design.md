# How I Work Portfolio Design

## Objective

Make `decebal-claude-skills` and `decebal-codex-skills` first-class portfolio
evidence on `decebaldobrica.com` and `wolventech.com`. Explain operating method
through concrete artifacts instead of generic AI-productivity claims.

## Audience and framing

- `decebaldobrica.com`: technical founders and CTOs evaluating judgment,
  collaboration, and hands-on engineering leadership.
- `wolventech.com`: Rust platform leaders, Seed-to-Series-B teams, VC partners,
  and acquirers evaluating delivery controls and execution risk.
- Shared voice: rigorous, candid, evidence-led. Avoid agent theatre, generic
  consultancy language, and unsupported automation claims.

## Approved structure

Both homepages use one proof loop:

`Discover → Specify → Build → Verify → Learn`

Each stage connects method to evidence:

1. Discover: inspect repository state, constraints, and failure modes.
2. Specify: turn requirements and acceptance criteria into dependency-aware
   Chronis work.
3. Build: claim scoped work and keep progress inspectable.
4. Verify: use tests, Rust gates, CI, and hostile fixtures where appropriate.
5. Learn: run bounded experiments, retain improvements, and record results.

Personal homepage places loop after case-study evidence and before services.
Wolven homepage places loop after engagements and before open-source artifacts.
Wolven's existing four-step commercial process becomes an “Engagement rhythm”
subsection inside same section.

## Repository evidence

Both portfolio surfaces link primary GitHub sources and distinguish included,
tested, enforced, and opt-in checks.

- Claude suite: 54 skills, 20 Rust gate crates, 15 incident-backed rules, plus
  Rust SEO and ASO tooling.
- Codex suite: 55 skills, 21 Rust gate crates, 15 incident-backed rules, native
  Codex instructions/hooks/policy, Chronis workflow, SEO/ASO tooling, and capped
  skill autoresearch.

Personal open-source page shifts title and metadata from “Rust and Claude” to
“Rust and agent engineering.” Wolven artifact ledger gains Codex suite and more
precise Claude suite copy.

## Visual system

Personal treatment uses editorial hierarchy, teal/navy palette, and a vertical
proof spine. Wolven treatment uses an industrial pipeline, graphite/rust palette,
and compact evidence ledger. Both avoid repeated generic cards.

Two original transparent 3D renders illustrate use cases without labels:

- `apps/web/public/images/how-i-work-workflow.webp`: inspection, dependency graph,
  build, verification, and experiment loop in matte ceramic and anodized metal.
- `apps/wolventech/public/images/how-i-work-workflow.webp`: due diligence,
  platform delivery, workflow experiments, and evidence output as one machined
  industrial rig.

Generated with built-in image generation at 1536×1024, then converted to WebP
with alpha preserved. Prompts prohibit text, logos, robots, people, fake UI,
purple neon, glassmorphism, and generic SaaS styling.

## Accessibility and responsive behavior

- Semantic section headings and ordered workflow lists.
- Descriptive image alt text; art remains supplemental to complete text.
- Visible focus and keyboard-safe repository/navigation links.
- WCAG AA contrast against existing backgrounds.
- Responsive stacking with no critical meaning encoded only by geometry, color,
  or animation.
- Respect reduced-motion preferences; no required animation.

## Verification

- Biome formatting/lint and TypeScript checks for both apps.
- Production builds for both apps.
- Focused E2E assertions for section content, repository links, and navigation.
- Desktop and mobile screenshots with console/error review.
- Final copy audit against current repository READMEs and GitHub URLs.

## Out of scope

- Dedicated `/how-i-work` routes.
- Live GitHub metrics that can stale or imply popularity.
- Claiming all shipped rules or gates are active in consuming repositories.
- Replacing existing case studies, services, or engagement offers.
