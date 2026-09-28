# Rust & AI Weekly #14 — LinkedIn draft

Status: unpublished. Publish only after edition-specific approval and the canonical article is live.

## Copy

Miri was saving environment variables into Rust's build output.

If a CI step could see secrets, and its target directory was cached for pull requests to restore, those secrets could travel with the cache.

The fix is in the September 22 nightly. Updating prevents the same capture, but affected caches still need clearing. Credentials that may have leaked need a rotation decision too.

I would keep Miri in targeted safety tests, with a patched nightly and secrets scoped away from those jobs.

Rust & AI Weekly #14 also covers rmcp 3.5.0, Symposium, Wild and fastlogging, plus the Allocator stabilisation merge.

Each tool has a verdict, release status and a concrete evaluation path. The radar now covers 84 tools.

Read issue #14:
https://decebaldobrica.com/blog/2026-09-28-rust-ai-weekly-14

Does your CI review include which jobs can restore the caches it creates?

## Editorial check

Voice recalled from prime_voice before drafting. Applied linkedin-ghostwriting and no-ai-slop, using a sourced case → consequence → practical action → reader question. No invented personal incident, dramatic dashboard accusation, generic leadership lesson, or copied newsletter body. Paragraphs have real blank lines; use an empty `<p><br></p>` between nonempty HTML paragraphs if pasting into LinkedIn.

Attach `apps/web/public/images/social/2026-09-28-rust-ai-weekly-14.png`; use artwork alt text from `rust-ai-weekly-14-artwork.md`. Verify rendered paragraph gaps and article link in the composer after publication approval.

Sources: Rust's September 21 Miri advisory, Miri PR 5337, September 22 nightly manifest and versioned source, GitHub dependency-cache documentation. Exact links and limits are in the launch ledger.
