# Rust & AI Weekly #14 — X thread draft

Status: unpublished. Six connected posts; each post replies to the immediately preceding post. Publish only after edition-specific approval and the article is live. Attach the hero/social image to post 1, with descriptive alt text.

## Post 1

1/6 Miri was saving environment variables into target/. In CI jobs with secrets and a build cache readable by pull requests, that could expose credentials.

Rust & AI Weekly #14 starts with the fix and the cleanup it cannot do for you.

## Post 2

2/6 The fix is present in nightly-2026-09-22. Upgrade the pinned nightly, keep secrets away from the Miri step, and clear affected caches. Consider rotating exposed credentials.

A patched run does not erase an older cache.

## Post 3

3/6 rmcp 3.5.0 shipped September 28. It rejects duplicate MCP headers, fixes default-port Origin matching, and handles empty cacheScope values.

Trial stays: test transport behaviour with your deployed client/server pair.

## Post 4

4/6 Wild's author compared link times under different filesystems, output-file policies and fork settings. Those choices changed the result against Mold.

Trial on supported Linux builds. Measure your build loop; I have not reproduced the benchmarks.

## Post 5

5/6 Two Assess entries: Symposium matches agent guidance to Rust dependencies; fastlogging adds OpenTelemetry to its mixed-language logging core.

Check Symposium's version and update policy. Test fastlogging's queue pressure and shutdown path.

## Post 6

6/6 Allocator's stabilisation PR merged September 23. That is development-branch progress, not availability in today's stable compiler.

Five evaluations, source links, caveats and an 84-tool radar:
https://decebaldobrica.com/blog/2026-09-28-rust-ai-weekly-14

## Checks

Use the standard 280 weighted-character limit. All copy is ASCII; URL in post 6 counts as 23 characters under X's current documentation. Counts are generated in the verification report. Source: https://docs.x.com/fundamentals/counting-characters

This is a reply chain, not six standalone broadcasts. Retain numbering and publish in order. No scheduling or publishing was performed by this automation.
