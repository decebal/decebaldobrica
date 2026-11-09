# Issue 20 LinkedIn copy

Status: unpublished. Publish only after edition-specific approval and the canonical article is live.

## Copy

Systemd accepted Rust for new leaf programs while keeping shared core code in C.

Before proposing a similar change, I would write down one component’s calls, allocation ownership and expected failure behaviour.

That makes the first review concrete: one interface, one compatibility check, and a build in the target environment.

The support merged October 24. The maintainers’ November 3 explanation keeps Rust optional, uses Meson and retains controlled dependencies. A merge does not establish that every distribution has shipped it.

Rust & AI Weekly #20 also reviews rustup 1.29.3, tellus actor persistence and sysinfo’s GPU APIs.

Tellus has a particularly useful contract to test: a durable event can survive a crash that loses its outward continuation.

Read the verdicts and proposed acceptance checks:
https://decebaldobrica.com/blog/2026-11-09-rust-ai-weekly-20

Which component boundary would you put under a compatibility test first?

## Delivery notes

Attach `/images/social/2026-11-09-rust-ai-weekly-20.png`; alt text in artwork notes. Preserve blank paragraphs in the composer. Applied LinkedIn ghostwriting followed by no-ai-slop; sourced case, bounded consequence and proposed action. No invented deployment or performance lift. Framework names stay out of copy.
