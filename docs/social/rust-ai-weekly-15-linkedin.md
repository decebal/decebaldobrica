# Rust & AI Weekly #15: LinkedIn draft

Status: unpublished. Apply LinkedIn ghostwriting and no-ai-slop. Copy below uses real blank paragraphs. Attach the edition hero. Verify paragraph gaps after pasting.

## Copy

Cloudflare got a Minecraft server running on Workers through Emscripten.

The port changed its thread pool, tick loop and chunk work into cooperative tasks.

That detail matters if you're looking at Workers for an existing Rust service.

A dependency can compile while still expecting a thread it can block. The host event loop needs control back to keep work moving.

I rated the new Emscripten/Tokio integration Assess in Rust & AI Weekly #15. The documented setup still needs tagged patchsets and unstable flags.

Start with one request path. Check its sockets, blocking work and cancellation behaviour before proposing a migration.

Also reviewed: Deser 0.10, ying-profiler's retained-memory reports and fearless_simd 1.0. Plus Rust 1.99 and the coming Windows host-tool change.

Which dependency would you want to bring to Workers, and what blocks the port today?

https://decebaldobrica.com/blog/2026-10-05-rust-ai-weekly-15

## Publication checks

- Confirm edition-specific approval and that the article URL and both images are live.
- Use the hero at `apps/web/public/images/blog/2026-10-05-rust-ai-weekly-15-3d-hero.png`.
- Alt: A silver mechanical wolf watches a transfer arm move a metal block towards a circular workbench.
- Preserve blank paragraphs. Do not paste the newsletter body or this file's instructions.
- Reopen the posted copy and inspect spacing, link and image. Record the resulting URL in the launch ledger.

## What changed

The social copy isolates one sourced example and its runtime consequence. It removes broad claims about service portability and gives a contained assessment action. No invented deployment experience or speedup.
