# Substack paste-ready — 2026-07-08 (Rust & AI Weekly #3 + Slint Deep Dive)

> Substack has no publishing API — paste each into the editor at substack.com manually (publication: Rust Systems & Agentic AI). Canonical lives on the site; end each Substack post with the canonical link. Series home: https://decebaldobrica.com/radar

---

## POST 1 — Rust & AI Weekly #3 (the newsletter issue)

**Title:**

```
Rust & AI Weekly #3: agents get a protocol, the desktop gets agent-ready, and dalek breaks everything (on schedule)
```

**Subtitle:**

```
Zed's agent protocol goes multi-vendor, Slint embeds an MCP server in every GUI, curve25519-dalek ships a coordinated major, and googletest-rust gets forked by its own author.
```

**Body:** paste from `2026-07-08-rust-ai-weekly-3.mdx` (everything below the frontmatter), with these adjustments:

1. Radar image: generate first — `node apps/web/scripts/generate-radar-image.mjs` → use the PNG at the top, linked to https://decebaldobrica.com/radar
2. Convert internal links to absolute:
   - `/blog/2026-06-22-rust-ai-weekly-2` → `https://decebaldobrica.com/blog/2026-06-22-rust-ai-weekly-2`
   - `/blog/2026-07-08-slint-1-17-rust-desktop-ready-evaluation` → `https://decebaldobrica.com/blog/2026-07-08-slint-1-17-rust-desktop-ready-evaluation`
   - `/blog/2026-06-15-radar-digest-stdx-smb2-six-releases` → `https://decebaldobrica.com/blog/2026-06-15-radar-digest-stdx-smb2-six-releases`
   - `/radar` → `https://decebaldobrica.com/radar`
3. Drop the `<br/>` tags (Substack handles the italic status lines fine on their own line).
4. Append at the very end:

```
Originally published: https://decebaldobrica.com/blog/2026-07-08-rust-ai-weekly-3
```

---

## POST 2 — Crate Radar Deep Dive (companion piece)

**Title:**

```
Slint 1.17: Is Rust Finally Desktop-Ready?
```

**Subtitle:**

```
Drag and drop, tray icons, and an MCP server that lets an AI assistant drive your running UI. A full engineering-leader's evaluation — licensing and exit cost included. Verdict: Trial.
```

**Body:** paste from `2026-07-08-slint-1-17-rust-desktop-ready-evaluation.mdx`, same adjustments:

1. Internal links to absolute:
   - `/blog/2026-07-08-rust-ai-weekly-3` → `https://decebaldobrica.com/blog/2026-07-08-rust-ai-weekly-3`
   - `/contact` → `https://decebaldobrica.com/contact`
2. Slint code block: use a plain code block (no `slint` highlighting on Substack).
3. The rubric table pastes cleanly from the rendered blog page, not raw markdown.
4. Append at the very end:

```
Originally published on Rust Crate Radar: https://decebaldobrica.com/blog/2026-07-08-slint-1-17-rust-desktop-ready-evaluation
```

---

**Sequencing:** Weekly #3 first (it's the subscriber-facing issue), Deep Dive 1–2 days later. Both link to each other either way.
