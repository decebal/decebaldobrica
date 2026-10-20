# Issue 17 review pack

October 19, 2026 edition. Status: **complete and published**. Publication links and verification recorded October 20. The user approved sending issue 17 to Everyone and publishing its LinkedIn announcement and connected X thread.

## Published links

- [Blog article](https://decebaldobrica.com/blog/2026-10-19-rust-ai-weekly-17)
- [Substack newsletter](https://ddonprogramming.substack.com/p/rust-and-ai-weekly-17-test-the-value), published October 19 to Everyone with email and app delivery enabled
- [LinkedIn announcement](https://www.linkedin.com/feed/update/urn:li:share:7517910462223503363/)
- [Connected six-post X thread](https://x.com/ddonprogramming/status/2112145056526372880)
- [Merged preparation PR #29](https://github.com/decebal/decebaldobrica/pull/29)

## Assets

- [MDX article](../../apps/web/content/blog/2026-10-19-rust-ai-weekly-17.mdx)
- [Substack HTML](rust-ai-weekly-17-substack.html), with absolute links and both images
- [Local readability preview](rust-ai-weekly-17-readability.html)
- [Unpublished syndication](rust-ai-weekly-17-syndication.md), canonical URL and `published: false`
- [LinkedIn copy](rust-ai-weekly-17-linkedin.md) and [six-part X thread](rust-ai-weekly-17-x.md)
- [Artwork and exact generation prompt](rust-ai-weekly-17-artwork.md)
- [Metrics](assets/weekly17-verification/metrics.json), [source-link checks](assets/weekly17-verification/source-links.json)
- [Site mobile proof](assets/weekly17-verification/site-mobile.png), [local email mobile proof](assets/weekly17-verification/email-mobile-local.png), [desktop preview](assets/weekly17-verification/email-desktop-local.png)

Live canonical URL: `https://decebaldobrica.com/blog/2026-10-19-rust-ai-weekly-17`.

## Publication and repository state

PR #29 merged the article and launch assets into main. The live blog route was checked before social publication: the issue 17 title, October 19 date, artwork and 92-tool radar were present.

Registered worktrees contained no issue 17. Work started in an isolated detached worktree from main, preserving unrelated dirty changes in the primary checkout. Publication branch: `docs/rust-ai-weekly-17`. Preparation is tracked in Chronis task `t-2baca6`. Repository instructions and issue 13's corrected article/LinkedIn structure, issue 14's framework map and issue 16's carry-over notes informed the draft.

Substack inventory was checked after the user approved browser access and signed in. No issue 17 draft or publication existed; the latest published edition was 16. One issue 17 draft was created at post ID `221118708`. The user separately approved Everyone as its audience and later approved newsletter and social publication. The publisher then showed Published; LinkedIn showed Post successful; X showed Your posts were sent. The live X conversation contained all six numbered posts in order.

## Claim-to-source ledger

Primary bodies were read before drafting. Tagged files and published packages were used to distinguish documentation, metadata and shipped code. Version dates below are publication times, not commit dates. Proposals in the article are unexecuted acceptance plans.

| Claim | Primary evidence | Check and limit |
|---|---|---|
| Rust 1.99.1 fixes x86_64 FFI boolean return zero-extension, missing wcslen and macOS rust-lld library discovery | [October 15 announcement](https://blog.rust-lang.org/2026/10/15/Rust-1.99.1/) | Full announcement read. Stable point release, not an unreleased PR. No reproduction run. Adopt verdict scoped to corrective update for existing 1.99 users, not a universal MSRV increase. |
| C caller observed 16 for input 0x10; mask differs from 1.98.0 | [Issue 163911](https://github.com/rust-lang/rust/issues/163911) | Full report read through GitHub API, including C/Rust sources, assembly, GCC/Clang, x86_64 Linux and negative aarch64/loongarch64 observations. No claim that every FFI function or application was affected. |
| Creusot 0.14.0 published October 12 08:49:08 UTC, non-prerelease | [Release](https://github.com/creusot-rs/creusot/releases/tag/v0.14.0) and [tagged changelog](https://github.com/creusot-rs/creusot/blob/v0.14.0/CHANGELOG.md) | GitHub API metadata and 0.14 section read. Devlog is dated October 13; partial orders introduced in 0.13, explicitly distinguished. |
| Snapshot logic calls assert preconditions and expose postconditions; Pearlite navigation improved | [Full devlog](https://devlog.creusot.rs/v0-14-0/) | No proof executed. Proposed negative-control verification case does not claim a discovered Creusot bug. |
| Creusot nightly pin and migration entries | [rust-toolchain](https://github.com/creusot-rs/creusot/blob/v0.14.0/rust-toolchain), tagged changelog | `nightly-2026-08-03` with rustc-dev/llvm-tools/rustfmt; PermCell renamed PCell. No stable-only installation claim. |
| Experimental scope, usage and licensing | [Tagged README](https://github.com/creusot-rs/creusot/blob/v0.14.0/README.md), [LICENSE](https://github.com/creusot-rs/creusot/blob/v0.14.0/LICENSE), [creusot-std manifest](https://github.com/creusot-rs/creusot/blob/v0.14.0/creusot-std/Cargo.toml) | README names CreuSAT/Krabka. Changelog describes experimental status and algorithm/data-structure fit. Root LGPL text and LGPL-2.1-or-later library metadata checked. Not represented as MIT-only or unconditional commercial distribution permission; component-level obligations remain an integration review. |
| hotcode 1.0.3 published October 17 12:13:39.052854 UTC; Rust 1.89.0; MIT; not yanked | [Registry](https://crates.io/api/v1/crates/hotcode), published package and source manifest | Direct bounded Node HTTP request returned full metadata after curl file-output attempts produced empty files. Downloaded package archive returned 200; manifest confirmed version/MSRV/licence. GitHub release/tag endpoints returned no entries; no release date inferred from latest commit. |
| Reload limitations include generics, ABI changes and dangling static references | [Versioned docs](https://docs.rs/hotcode/1.0.3/hotcode/), published `src/lib.rs` | Full crate-level documentation read and matched package. Source reviewed at `d125836c7ea80d6ee70067675e8c0a49aa6d3bd0`, October 17. Handle retention is scoped to invocation, not escaping references. Defaults use debug_assertions; always can enable release reloads. |
| hotcode commercial eligibility and adoption | [MIT licence](https://github.com/alordash/hotcode/blob/d125836c7ea80d6ee70067675e8c0a49aa6d3bd0/license.txt), examples and TWiR spotlight | Full MIT text read: commercial use allowed with applicable notice retention. No production adopter or benchmark result invented. Fibonacci table names two Intel CPUs and Apple M4; no numbers copied because not reproduced or required for verdict. |
| hotpath 0.28.6: GitHub October 8 21:48:44 UTC; registry 21:57:36.682097 UTC | [Release](https://github.com/pawurb/hotpath-rs/releases/tag/v0.28.6), [registry](https://crates.io/api/v1/crates/hotpath), published crate | Non-prerelease GitHub release; registry not yanked; no declared MSRV. Manifest edition is not treated as an MSRV. Tagged changelog starts at 0.28.5 despite moving release link; patch-specific changes left unresolved. |
| Route context, inclusive timing, allocation accounting, Tokio gates | [October 12 tutorial](https://hotpath.rs/blog/rust-performance-grafana), [tagged manifest](https://github.com/pawurb/hotpath-rs/blob/v0.28.6/crates/hotpath/Cargo.toml) | Full tutorial read through its final sections. Prometheus feature confirmed in published manifest. Some Tokio metrics require tokio_unstable. Tutorial output version 0.28.3 is labelled example rather than latest release. |
| hotpath overhead/adoption/licence | Tutorial, [tagged MIT text](https://github.com/pawurb/hotpath-rs/blob/v0.28.6/LICENSE.txt) | Author describes minimal traffic; no nanosecond or overhead percentage claim reused. Production overhead remains unmeasured. Full MIT text read; commercial redistribution requires notices; hosted service is separate. |
| Infrastructure audits deployed, SQS provisioned but unused | [October 12 infrastructure recap](https://blog.rust-lang.org/inside-rust/2026/10/12/infrastructure-team-q3-recap-and-q4-plan/) | Relevant report body read. 23 Zizmor audits stated by team. No claim these checks enforce delivery in a reader's repo. |
| Foundation board changes | [October 13 update](https://rustfoundation.org/media/rust-foundation-board-updates-october-2026/) | Full post read; names retained without inferring tool adoption or performance. |
| Source indexes and window | [TWiR 673](https://this-week-in-rust.org/blog/2026/10/14/this-week-in-rust-673/), [Rust Bytes 141](https://weeklyrust.substack.com/p/never-bet-against-rust), [Go Weekly 620](https://golangweekly.com/issues/620) | TWiR and Go issue bodies read. Full Rust Bytes 141 RSS body read: October 13 06:31:41 GMT. Survey, Polars and benchmark links not used as independently verified claims. Go archive confirms October 16 break and October 23 return. |
| X standard limit | [Official counting rules](https://docs.x.com/fundamentals/counting-characters) | ASCII copy and 23-character URL weighting: 228, 249, 251, 252, 252, 142. Published together through Post all; all six connected posts verified in the live conversation. |

## Verdicts and carry-over

Four decisions: adopt corrective Rust patch for existing 1.99 users; Creusot Assess; hotcode Assess for development; hotpath Trial retained. The compiler is separate from the crate inventory. Two new crate records, one update; preserve all earlier names, history and unrelated records. Actual recount: **92 = 15 Adopt + 36 Trial + 39 Assess + 2 Hold**. Snapshot regenerated with the repository's existing script and inspected.

rmcp release API still returned 3.5.1, October 5, as latest runtime release; no new transport or credential-store execution. Workers, Deser, Ying, Wild, allocator and tokio_rcu checks remain open. Their verdicts are not upgraded. No current stars/downloads claimed. Bevy 0.20 release article was discovered but dated October 8 and not given an additional verdict to fill the issue. Scope stays at the compiler and three tools with concrete review decisions.

## Lara framework map

Voice recall used prime_voice for SLAY, PAS, content mix and newsletter paragraph preferences. Project memory returned unrelated material, so project state relies on repository and prior publication evidence. No new identity, test result or personal experience was invented.

| Location | Sourced event/problem | Supported consequence | Action / reader ending |
|---|---|---|---|
| Lead and compiler evaluation | Reported 16 from an FFI boolean result | Source-only review leaves generated caller boundary unexercised | Rebuild actual consumer-loaded library; run foreign caller; closing asks target and compiler versions. |
| Creusot | Logic calls in snapshots receive VCs | A proof is scoped to its contract and assumptions | Isolate algorithm, review empty-input assumptions, keep deliberately wrong variant. |
| hotcode | Library code can change while old caller remains loaded | ABI and escaping-reference limitations are documented | Fixed signature/owned values for trial; restart rule for incompatible edits. |
| hotpath | Request can repeat individually fast operations | Averages need completed-work denominator and accounting rules | Fixed input set, call counts, explicit feature flags and measured overhead. |

Practitioners get configuration and acceptance checks; decision-makers get trial scope and unresolved risks. Education and the sourced compiler case supply the content mix. No invented offer or change to Monday cadence. Framework names stay out of reader-facing copy. LinkedIn guidance applied only to social copy, followed by no-ai-slop.

## Editorial evaluation

The full article and social copies were read after drafting. No-ai-slop editing principles 1–11: pass. Banned-word check: pass. Pattern checks 1–9: pass, with necessary factual qualifications retained. Final-read checks 1–3: pass; check 4 satisfied through linked complete drafts and the following change note; detection-only check not applicable.

What changed: lead starts with the exact reported value; proposed checks are explicitly unexecuted; partial-order and tutorial example versions keep their historical boundaries; licence/MSRV gaps stay visible; the ending asks for one caller-side check. Repeated generic framing and fabricated benchmarks are absent. Normal editorial prose retained despite compressed chat updates.

## Render verification and limits

Actual Next.js route returned 200 through React Markdown, GFM, raw HTML and highlight plugins. The site's mobile view at 390 × 844 has scroll width 390 and both images loaded with descriptive alt text. The complete ending is present in DOM. Screenshots inspected. The local email-layout preview also has width/scroll width 390, both images loaded and 21.25px paragraph gaps. Desktop preview captured separately. These are local browser checks, not saved Substack previews or delivered-mailbox testing.

Synchronized HTML and syndication generated through the same Markdown plugins. Temporary JavaScript helper used because React rendering and the installed plugin stack are JavaScript; no new production tooling or dependency added. Metrics: 2,652 tokenized words, 45 prose paragraphs, maximum 62 words, none above 100; 20,320-byte HTML; 15 unique link targets. All 14 external article links returned 200 in bounded GET checks. The deployed canonical article and edition artwork were checked before social publication. Source-link status does not substitute for the source-body review above.

Substack saved-content verification passed after reload: normalized body text matched the source exactly (14,867 characters after whitespace removal and quote normalization), every source link was present, and both uploaded images loaded with their descriptive alt text. Full-content mobile and email previews were inspected. The email frame contained the ending and both images, with width and scroll width both 600px. No email-length warning appeared after settled reload. These checks verify the saved editor and browser previews; delivery to a recipient's mailbox was not tested.

LinkedIn was published with seven explicit empty paragraphs separating the eight copy blocks, verified in the composer before posting. Its link preview used the edition artwork. X was published as one connected six-post thread, with the article link in the final post. Syndication Markdown remains unpublished intentionally; it is not an outstanding launch action.

## Completion

- Article merged and live.
- Substack saved, verified and published to Everyone under edition-specific approval.
- LinkedIn announcement published with paragraph gaps.
- Six connected X posts published and verified.
- No issue 17 publishing actions remain. Tool trials, benchmark reproduction and dependency integration checks described above remain research carry-over, not claims of completed execution.
