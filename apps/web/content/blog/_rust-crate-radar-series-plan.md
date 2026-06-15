# Rust Crate Radar — Series Plan

> Internal planning doc (not a published post — leading underscore keeps it out of the blog index unless you wire it in deliberately). A recurring series that evaluates newly-released and meaningful Rust crates through an engineering-leadership lens: not "here's a cool library," but "here's whether your team should adopt it, and what it costs you if you do."

## Why this series

There is a glut of "10 awesome Rust crates" listicles. Almost none are written by someone who has had to defend a dependency choice in an architecture review or carry the on-call pager for it. That is the gap. Every post answers the question a staff engineer or eng leader actually asks: *should this enter our dependency tree, and why now?*

Positioning ties directly to the Technical Leaders brand — adoption risk, total cost of ownership, team capability, and architectural fit, not just API surface.

## Audience

Primary: engineering leaders, staff/principal engineers, and senior Rustaceans making or influencing build-vs-buy and dependency decisions.

Secondary: mid-level Rust developers leveling up their judgment about *how* to evaluate a crate, not just which one to grab.

## The evaluation framework (the series' backbone)

Every crate gets scored against the same rubric. This is the differentiator — it makes the series a *method*, not a feed. Reuse the table in every post.

| Dimension | What we're really asking | Signals |
|---|---|---|
| **Problem fit** | Does this solve a real, recurring problem, or a novelty? | Frequency of the pain, existing workarounds |
| **Maturity** | Is it safe to bet on? | Version, release cadence, breaking-change history, `1.0` status |
| **Stewardship** | Who maintains it, and will they still be here in 2 years? | Backing org, bus factor, issue response time, funding |
| **Ecosystem fit** | Does it play well with what we already run? | Tokio/async alignment, feature flags, `no_std`, MSRV |
| **Cost of adoption** | What does it actually cost to bring in? | Compile-time impact, binary size, transitive deps, unsafe surface |
| **Exit cost** | How hard is it to rip out if it goes wrong? | API lock-in, data-format lock-in, abstraction leakage |

Close every post with a one-line verdict: **Adopt / Trial / Assess / Hold** (ThoughtWorks Tech Radar vocabulary — familiar to the target reader).

## Recurring formats

The series runs three rotating post types so it stays sustainable and varied:

1. **Deep Dive** (flagship, ~1500–2200 words) — one crate, full rubric, code, trade-offs, verdict. Roughly monthly. *This is what the sample post is.*
2. **Radar Digest** (~800–1200 words) — 3–5 recent crates from This Week in Rust's "Crate of the Week" and crates.io trending, each with a short take + verdict. Biweekly or monthly. Low-effort to produce, high cadence value, strong for SEO long-tail and newsletter.
3. **Category Showdown** (~1800 words) — periodic head-to-head within a category (e.g. async ORMs, TUI frameworks, error-handling crates) using the same rubric across contenders. Quarterly. These age well and attract backlinks.

## Cadence

A sustainable rhythm given your existing publishing flow (`task publish -- slug`):

- Week 1: Deep Dive
- Week 3: Radar Digest
- Repeat monthly; drop a Category Showdown roughly once a quarter in place of a digest.

Sourcing newly-released crates is the input that makes cadence cheap. Standing sources: [This Week in Rust](https://this-week-in-rust.org/) "Crate of the Week," [crates.io](https://crates.io/) "New Crates" / "Most Recently Updated," [lib.rs](https://lib.rs/) category trending, and Tokio/Rust Foundation announcements. (Worth automating — see below.)

## SEO angles

The evergreen, low-competition keyword space here is strong because most content is shallow listicles:

- "<crate> vs <crate>" comparisons (high intent, e.g. "toasty vs sea-orm", "axum vs actix")
- "is <crate> production ready" / "should I use <crate>"
- "best Rust crate for <problem>" (e.g. "best Rust ORM 2026")
- "<crate> review" / "<crate> alternatives"

Each post should target one primary phrase in the title + slug, and the rubric naturally generates the secondary phrases. Internal-link every post to the prior ones in the same category to build topical authority. The Showdown posts are the link magnets — point Deep Dives and Digests at them.

## Post template (frontmatter + skeleton)

Match the existing blog convention: dated slug `YYYY-MM-DD-<keywords>`, `author: Decebal D.`, ISO date.

```markdown
---
title: '<Crate>: <Engineering-leader hook>'
date: 'YYYY-MM-DDT12:00:00.000Z'
author: Decebal D.
description: <One-sentence value prop + verdict, ~25-40 words, for search snippet.>
tags:
  - rust
  - crates
  - <category>
  - dependency-management
  - <crate-name>
slug: YYYY-MM-DD-<crate>-review
---

## TL;DR — The Verdict
<2-3 sentences. Lead with Adopt/Trial/Assess/Hold and who it's for.>

## The Problem It Solves
<Why this exists. The recurring pain. What teams do today without it.>

## What It Actually Does
<Concise capability tour with one or two real code snippets.>

## Evaluation
<The rubric table, scored, with a paragraph per dimension that matters.>

## When to Adopt — and When Not To
<Decision guidance. Concrete team/architecture scenarios.>

## The Verdict
<Adopt/Trial/Assess/Hold + the one risk to watch.>
```

## Topic backlog (seeded from current releases, June 2026)

Deep Dive candidates and digest fodder, freshest first:

- **Toasty** — async ORM from the Tokio team, hit crates.io April 2026, now at 0.6.0. *(Sample post written.)*
- **remyx** — framework for building TUIs on top of Ratatui (Crate of the Week, #654).
- **inline_tweak** — tweakable constants without recompilation (Crate of the Week, #653); great for a "developer-velocity" angle.
- **cargo-crap** — cargo subcommand for the Change Risk Anti-Patterns metric (#652); strong leadership angle on code-health tooling.
- **cloakrs** — PII detection/masking library + CLI (#651); compliance/security angle.
- **dial9** — flight recorder for Tokio (Tokio blog, March 2026); observability angle, pairs with your existing structured-logging post.
- **office2pdf** — OOXML→PDF generation (#641).

Category Showdown candidates: async ORMs (Toasty vs SeaORM vs Diesel vs sqlx), async runtimes (Tokio vs smol vs glommio), web frameworks (Axum vs Actix vs Salvo vs Rocket).

## Automation opportunity

The recurring sourcing step is a natural fit for a scheduled task: each Monday, pull the latest "Crate of the Week" and crates.io trending, summarize them against the rubric's top three signals, and hand you a shortlist. That turns "what do I write about" into a 5-minute triage. Ask me to set this up when you're ready.
