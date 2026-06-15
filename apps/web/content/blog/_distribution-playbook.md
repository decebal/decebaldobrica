# Distribution & Promotion Playbook — Rust Systems & Agentic AI

> Internal strategy doc (underscore prefix keeps it out of the blog index). How to distribute the newsletter / Crate Radar content across high-signal technical platforms without burning credibility. Companion to the syndication kit (`_raising-the-bar-syndication-kit.md`).

## First principle: one canonical home, many syndication surfaces

The blog at `decebaldobrica.com/blog` is the **canonical source**. Everything else is a syndication or promotion surface that links back to it. Every republished copy must carry a cross-domain `rel="canonical"` pointing at the blog URL, so Google (and, increasingly, the AI answer engines — GEO) credit the original and you don't compete with yourself for rankings. Order of signal strength: redirect > `rel="canonical"` > sitemap; always use absolute URLs.

Three things to never do, because they cost more trust than any single post earns: post the same blurb everywhere on the same day (looks like a bot), drop a link and leave (every community below punishes drive-by self-promo), or editorialize/clickbait titles on news-sense communities (HN, Lobsters).

## The channel stack

Four tiers, each with a different job. Owned channels convert; syndication channels reach; community channels generate the spike and the backlinks; social compounds.

| Tier | Channel | Job | Canonical handling |
|---|---|---|---|
| **Owned** | Blog (canonical), Substack, email list | Convert + retain | Original |
| **Syndication** | dev.to, Hashnode, Medium, daily.dev | Reach new readers via their feeds/SEO | `rel=canonical` → blog |
| **Community / aggregator** | Hacker News, Lobsters, Reddit (r/rust, r/programming), Lemmy programming.dev, This Week in Rust | The traffic spike + authoritative backlinks | Link to blog directly |
| **Social** | Bluesky, Mastodon (Fosstodon/Hachyderm), LinkedIn, X | Compounding reach + relationship | Link to blog |
| **Newsletter pickups** | TWiR, Console.dev, Bytes, JavaScript Weekly, TLDR, Changelog News, Hacker Newsletter | Earned distribution to curated lists | Submit/pitch blog URL |

## Per-platform tactics

### daily.dev (the one you named)
**Mechanics changed:** personal blogs are **no longer eligible as sources**. Your three routes now:

1. **Create a Squad** — your own space on daily.dev where you post links/updates and build a following. This is the recommended path for an individual creator. Name it for the brand (e.g., "Rust Systems & Agentic AI" / "Rust Crate Radar"), seed it with your best back-catalogue, post each new article, and engage with members' threads.
2. **Direct Posting** — hit "New Post" anywhere on daily.dev to share a link into the feed.
3. **Claim ownership** of articles — when one of your posts is shared, claim authorship so your profile gets the credit, follows, and a creator badge.

What works: dev-news-sense headlines, a strong cover image (the OG image your publish flow already generates), and being a participant, not just a poster. Cadence: every new article + 1–2 curated reshares/week so the Squad isn't a ghost town.

### dev.to
The most syndication-friendly platform: native `canonical_url` front-matter field, generous tagging, a real feed, and good SEO. Cross-post the **full article** with `canonical_url` set to the blog. Use ≤4 tags (`#rust`, `#javascript`, `#webdev`, `#programming`). Reply to comments — dev.to rewards engagement with feed placement. This is your highest-ROI syndication channel.

### Hashnode
Similar to dev.to, slightly more "personal blog" oriented, also supports canonical URLs and has a developer-heavy audience and decent SEO. Same play as dev.to; worth doing both since audiences only partly overlap. Hashnode's tag/community feeds (e.g., Rust) surface content well.

### Medium
Broadest non-dev audience and strong domain authority, but the audience is less technical and the platform is paywall/algorithm-driven. Use the **Import Story** tool (it auto-sets the canonical link to your source) rather than pasting, so SEO credit flows back. Worth it for reach and the occasional crossover reader, but lower priority than dev.to/Hashnode for a deep-Rust audience. Don't put anything Medium-paywalled that you want freely indexed.

### Hacker News
The highest-variance, highest-upside channel. A front-page hit can dwarf every other source combined. Rules of the road: submit with the **real article title** (no editorializing), submit once, don't ask for upvotes, and show up in the comments to answer substantively. The "Rust ate the JS toolchain" / "Raising the Bar" piece is exactly the kind of opinionated-but-receipted post HN engages with. Best odds: weekday mornings US time. Accept that most submissions sink; the format is the lottery ticket, not the salary.

### Lobsters (lobste.rs)
Smaller but extremely high signal-to-noise, invite-only. If you're not a member, getting an invite from a Rustacean you know is worth it. Tag correctly (`rust`, `javascript`, `programming`), check **"I am the author,"** and expect sharp, expert comments — great for credibility, not volume.

### Reddit
- **r/rust** — tolerant of quality Rust content and the natural home for Crate Radar. Post the link, then add a short author comment explaining the angle and inviting critique. Be active in the thread.
- **r/programming** — bigger, harsher; only submit the broadest pieces (e.g., the toolchain one).
- **r/javascript** — submit the "Rust Answer" pieces carefully; frame as analysis, not Rust evangelism, or it gets downvoted.
- Lemmy's `programming.dev` is a smaller, friendly mirror of this audience worth cross-posting to.

### This Week in Rust (TWiR)
The single best earned-distribution channel for Rust content. Two distinct mechanisms:
- **Article inclusion** — submit your post for the "Observations/Thoughts" or "Walkthroughs" section via a PR to [rust-lang/this-week-in-rust](https://github.com/rust-lang/this-week-in-rust) or a ping on their Bluesky/Mastodon. Getting a Deep Dive listed there is a direct line to the entire Rust community.
- **Crate of the Week** — separate; for *crates*, not articles. Relevant later if you publish your own crates (AllSource/AllFrame).

### Social
- **Bluesky** — the Rust/systems community has largely settled here; `@thisweekinrust` posts there. Highest-quality social engagement for this niche right now.
- **Mastodon (Fosstodon / Hachyderm.io)** — dense with Rustaceans and FOSS folks; post with relevant hashtags.
- **LinkedIn** — your *leadership* audience (fractional-CTO / advisory funnel). Reframe each piece as an engineering-leadership lesson, not a code post. This is where Wolven Tech leads come from.
- **X (@ddonprogramming)** — declining for deep tech but still worth a thread; repurpose the article's key claims as a thread with the link.

## Identifying "similar high-signal technical audiences"

Ranked by fit for Rust + AI engineering + technical-leadership content:

1. **This Week in Rust** — the definitive Rust audience; earned, not paid. Highest fit.
2. **Hacker News** — broadest high-signal dev audience; huge upside on the right post.
3. **Lobsters** — smallest, highest expertise; credibility multiplier.
4. **r/rust** — engaged, forgiving of self-promo if quality; series home.
5. **dev.to + Hashnode** — syndication reach with SEO benefit and low effort.
6. **daily.dev Squad** — feed distribution to a developer-news audience.
7. **Bluesky + Fosstodon** — the niche's social center of gravity in 2026.
8. **Console.dev** — curated devtools newsletter; pitch the tooling/Crate Radar pieces ([console.dev](https://console.dev) accepts tool/article suggestions).
9. **Cooperpress newsletters** (JavaScript Weekly, Node Weekly, React Status) — pitch the "Rust Answer" / cross-over pieces; they reach the JS audience you're trying to convert.
10. **Bytes.dev, TLDR Web Dev, Changelog News, Pointer.io, Hacker Newsletter** — submit/pitch the broad pieces; each is a curated list with real reach.
11. **Rust Users Forum (users.rust-lang.org)** and **Rust Discord/Zulip** — discussion, not broadcast; share where genuinely relevant.
12. **awesome-rust / awesome lists** — for tools you publish, a PR to the relevant list is durable, evergreen distribution.

## Per-article launch sequence (the repeatable checklist)

Run this each time a Deep Dive or "Rust Answer" ships:

1. **Day 0 — publish canonical** on the blog (`task publish` → emails subscribers + posts LinkedIn/X).
2. **Day 0 — Substack**: publish the on-brand version to the subscriber list.
3. **Day 0–1 — syndicate** to dev.to and Hashnode with `canonical_url` set; import to Medium.
4. **Day 0–1 — daily.dev**: post to your Squad + claim ownership.
5. **Day 1 — community**: submit to r/rust (with an author comment), Lemmy programming.dev; for broad pieces, Hacker News + Lobsters. Submit once each; then engage in comments.
6. **Day 1 — social**: Bluesky + Fosstodon post; LinkedIn leadership-framed post; X thread.
7. **Within the week — earned**: PR/ping This Week in Rust; pitch Console.dev / relevant Cooperpress list if it fits.
8. **Track** referral traffic + subscriber conversions per channel; double down on the two or three that actually convert.

## Metrics that matter

Vanity (reach/impressions) is the spike; the real scoreboard is **subscriber conversions** and **advisory inquiries** by source. Instrument it: unique UTM per channel (`?utm_source=devto`, `=hn`, `=dailydev`, `=twir`…) — your PostHog setup already captures UTM on the newsletter signup. After ~5 article cycles you'll know which two channels deserve 80% of the effort; cut the rest to maintenance.

## Etiquette guardrails (the thing that protects the brand)

- Be a member of each community before you promote in it — comment, upvote, contribute for weeks first.
- Roughly a 9:1 ratio of participation to self-promotion on HN/Reddit/Lobsters.
- One submission per piece per community. No alt accounts, no upvote rings — a single detected ring can get the domain banned.
- Always disclose authorship where the platform asks (Lobsters "I am the author," dev.to/Medium are your profile anyway).
- Lead with the reader's benefit and the strongest *true* claim; let the link earn the click.
