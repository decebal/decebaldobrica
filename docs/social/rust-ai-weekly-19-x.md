# Connected X thread: issue 19

Status: prepared for review; not published or scheduled. Publish each post as a reply to its predecessor. Attach the social image to post 1. Character counts use 23 characters per URL and are recorded in metrics.

## 1

1/6 Astral's tar-codec rejects mixed conventions.

Start with real accepted archives, explicit rejected cases and a separate extraction policy.

Rust & AI Weekly #19 evaluates tar-codec, CGA and apalis 1.0.

## 2

2/6 tar-codec: Assess.

Astral reports default use in uv 0.13. The crate README still warns it is early and not ready for production use.

## 3

3/6 CGA: Assess.

It analyses monomorphized MIR for panic paths. Compiler settings matter; a path can remain in MIR and disappear later in LLVM.

Keep its pinned nightly and analysis profile in the review record. A blacklist is not a sandbox.

## 4

4/6 apalis: Trial retained.

Stable 1.0.0 shipped October 12, not this week. Review breaking migrations against your exact backend.

Test failure after an external effect, then restart and idle shutdown. Retry support alone does not establish exactly-once effects.

## 5

5/6 Language note: October 27's variadic generics survey discusses a hypothetical feature.

Its examples are design discussion, not stable syntax. Keep a concrete tuple/macro use case for feedback; don't assume a stabilization date.

## 6

6/6 Full issue has primary sources, scoped verdicts and a 95-tool radar.

These are proposed acceptance checks. I haven't run the tools or reproduced benchmarks for this review.

Which archive would you put first in a compatibility test?

https://decebaldobrica.com/blog/2026-11-02-rust-ai-weekly-19
