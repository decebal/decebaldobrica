# Rust & AI Weekly #13: corrected LinkedIn post

Published post: https://www.linkedin.com/feed/update/urn:li:activity:7508114242722586626/

Revised September 22, 2026 after the author's readability feedback. This replaces the original LinkedIn hook in the launch pack. The existing post was edited in place.

## Copy

A service at AWS was falling over at 90% CPU.

Tokio's metrics showed idle workers and full queues at the same time.

Russell Cohen built dial9 to investigate. Its trace showed the kernel took 18 milliseconds to schedule worker 47 after Tokio requested it.

I rated dial9 Trial in Rust & AI Weekly #13.

The 0.5 release adds trigger mode: keep a rolling trace, then save it when your code detects trouble.

You can run it without tokio_unstable, with narrower task coverage. Measure overhead on your own workload.

Also in this issue: zenjpeg's AGPL/commercial licence, fearless_simd 1.0, Slint 1.18 and the Rust maintainer security alert.

Read issue #13 and explore the radar of 80 Rust and AI tools:

https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13

## What changed

- Replaced the unsupported dashboard accusation with the documented AWS incident.
- Removed the contrived analogies and generic leadership advice.
- Kept the Trial verdict, workload caveat and narrower task coverage without tokio_unstable.
- Used real blank paragraphs between short sections. Verified spacing on the live post after reload.
- Removed the filename LinkedIn had turned into an unintended external link.

## Drafting requirements

Recall relevant voice nodes from prime_voice. Apply LinkedIn writing guidance and an AI-slop editing pass before publishing. Verify the rendered post, including paragraph gaps and links.

Installed skills used for this revision:

- Ralph copywriter: `muratcankoylan/ralph-wiggum-marketer`, `skills/copywriter`, commit `4c1f5f3bdfd2a55a0403bb4e30e5466337bebf41`.
- LinkedIn ghostwriting: `samber/cc-skills`, `skills/linkedin-ghostwriting`, commit `f6dad7c07bad369d25912cfa9f0b21790f431066`.
- No AI slop: `petergyang/no-ai-slop`, `skills/no-ai-slop`, commit `000650b156983f5159695b441477f4e63b25dc85`.

Ralph's repository ships only the general copywriter skill. The LinkedIn and anti-slop skills come from the separate sources above. The no-ai-slop evaluation was applied to the revised copy; verified facts and attribution were retained.

LinkedIn paste detail: separate paragraphs with an empty `<p><br></p>` when pasting HTML. Adjacent nonempty `<p>` elements rendered without a visible blank line in the original post.
