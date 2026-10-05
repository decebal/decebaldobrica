# Rust & AI Weekly #15: X thread draft

Status: unpublished. Publish as one connected reply chain after edition-specific approval and live article verification. Attach the hero to post 1. Copy only each numbered post's body.

## Post 1

1/7 Cloudflare's Rust-on-Workers preview runs an adapted Minecraft server through Emscripten. Its thread pool, tick loop and chunk work became cooperative tasks. That runtime work is the lead in Rust & AI Weekly #15.

## Post 2

2/7 The new Emscripten/Tokio integration gets Assess. Its documented setup still needs tagged patchsets and unstable flags. Start with one request path; check blocking work, sockets and cancellation in the intended host.

## Post 3

3/7 Deser 0.10.0 shipped October 4. Assess for self-describing formats where buffering and error locations matter. Check format support and trait requirements first. This is not a repository-wide Serde migration recommendation.

## Post 4

4/7 ying-profiler samples retained memory and allocations. Its September 30 spotlight concerns 0.3.0, released September 10. Assess: test release-build stack quality, reporting and overhead before changing a service's global allocator.

## Post 5

5/7 fearless_simd 1.0 stays Trial. Select one measured hot function and test the fallback you ship, alongside supported SIMD targets. Version-specific migration evidence would help the next review; aggregate downloads cannot supply it.

## Post 6

6/7 Rust 1.99 shipped October 1. The announced i686 Windows host-tool change starts in 1.100; standard-library distributions continue for cross-compilation. Keep host and target triples separate when checking affected CI jobs.

## Post 7

7/7 Full evaluations, source links and an 87-tool radar:
https://decebaldobrica.com/blog/2026-10-05-rust-ai-weekly-15

Which native dependency would you bring to Workers, and which runtime operation blocks the port?

## Publication checks

ASCII copy; count URLs as 23 characters under current X rules. Automated length results are in the verification ledger. Verify reply relationships and record every post URL after publishing. No post is published or scheduled by this draft run.

Hero alt: A silver mechanical wolf watches a transfer arm move a metal block towards a circular workbench.
