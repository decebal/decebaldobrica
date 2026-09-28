# Launch pack — Rust & AI Weekly #14

Status: **finished editorial draft for review, unpublished**. Checked September 28, 2026. No article push, merge, newsletter send, social publication or scheduling occurred.

Canonical after deployment: https://decebaldobrica.com/blog/2026-09-28-rust-ai-weekly-14

## Review destinations

- Article: [dated MDX](2026-09-28-rust-ai-weekly-14.mdx).
- Saved Substack draft: https://ddonprogramming.substack.com/publish/post/217794118. Only this new issue's draft was edited. Both images were uploaded to Substack; their CDN mapping is in `docs/social/rust-ai-weekly-14-substack-images.json`.
- Email HTML: `docs/social/rust-ai-weekly-14-substack.html`. Absolute links, both images, same rendered body as MDX. Canonical image URLs become public after article deployment; the saved Substack draft already uses working uploaded images.
- Syndication: `docs/social/rust-ai-weekly-14-syndication.md`, with `published: false`, canonical URL and cover image. Keep unpublished until edition-specific approval.
- LinkedIn: `docs/social/rust-ai-weekly-14-linkedin.md`, with real blank paragraphs.
- X: `docs/social/rust-ai-weekly-14-x-thread.md`, a connected six-post reply chain. Weighted character counts: **235, 223, 221, 250, 244, 222**. URL counts as 23; all post copy is ASCII. [Current X rules](https://docs.x.com/fundamentals/counting-characters).
- Readability screenshots and inspection: `docs/social/rust-ai-weekly-14-readability.html`.
- Machine checks: `docs/social/rust-ai-weekly-14-verification.json`, `rust-ai-weekly-14-browser-checks.json`, and `rust-ai-weekly-14-link-checks.json`.

**Substack title:** Rust & AI Weekly #14: Miri's fix leaves old caches to clean up

**Subtitle (152 characters):** Miri's cache leak and cleanup, rmcp 3.5.0, dependency-aware agents, and tooling worth testing. Five verdicts, an 84-tool radar, and the Allocator merge.

## Before publication

1. The user authorized publishing this newsletter, selected Everyone, and requested Git publication first, then the remaining publishing work. Complete the Git/site step before sending this edition. The recurring automation itself remains draft-only.
2. **Audience confirmed: Everyone.** The user explicitly selected this on September 28. The publish dialog shows Everyone and email/app delivery enabled; no scheduled send is selected. Earlier full-body preview checks used Paid subscriber view before this audience decision.
3. Substack still displays **Near email length limit** on the settled editor. An earlier check incorrectly recorded the warning as cleared because it inspected the UI too soon after reload. The current framework revision is 2,676 words. Reopen the saved draft's mobile/email previews before sending: fresh mobile and email captures of the final revision were inspected before publication on September 28. Both images load and the email preview includes the closing reader question. The near-length warning remains advisory; no delivered-mailbox clipping test was performed. No test email was sent. Check the intended mailbox preview and shorten the edition if that preview clips.
4. Deploy the canonical article and assets before releasing social links or syndication. Recheck the live canonical URL and both public image URLs then.

## Substack tag research and selected taxonomy

Researched September 28. [Substack's official post-tag documentation](https://support.substack.com/hc/en-us/articles/15325400348948-How-do-I-add-tags-to-Substack-posts), updated August 4, describes topic labels, tag archive pages and navigation. It does not establish search-volume rankings or guarantee additional feed reach. These choices are editorial mappings to the verified contents, not measured discovery rankings.

The publication's picker currently offers `ai`, `rust`, and `rust weekly`. Reuse `rust` and `rust weekly`; add `ai agents`, `mcp`, `security`, and `developer tools`. These cover the language, recurring series, Symposium, rmcp, Miri's CI advisory, and the evaluated tooling. Omit generic `newsletter`/`roundup` tags and individual release/version tags. Keep spelling stable across later editions; use more-specific tags only when a story substantially covers that subject.

Tags selected for application after the Git publication step: **rust; rust weekly; ai agents; mcp; security; developer tools**. Verify their presence in the final publish dialog before sending. No changes to publication navigation, subscriber tags or other posts are included.

## Edition and repository state

The reference was issue #13's final September 22 revision, its readability report and corrected LinkedIn copy. Dense historical launch copy was ignored. Latest published/repository edition was #13; no #14 draft existed. September 28 is the next Monday.

Work is isolated at `/Users/decebaldobrica/.codex/worktrees/rust-ai-weekly-14/portofolio-monorepo`, based on fresh `origin/main` at `f86ffe0`. It was prepared under `/tmp` and moved to this persistent location for review. The author's original checkout remained on the merged `codex/weekly13-readability` branch with unrelated modifications to issue #12 launch notes, the About page and AboutSection. Those files were not changed here. No commits were made on that branch or on this worktree. `RTK.md` referenced by the supplied instructions was not present in the checked repository/skill locations.

Discovery window: September 21–28, plus explicitly dated carry-overs. Read [TWiR 670](https://this-week-in-rust.org/blog/2026/09/23/this-week-in-rust-670/), [Rust Bytes #137](https://weeklyrust.substack.com/p/saving-100tb-of-ram-with-rust), Rust project/Foundation posts, release bodies, registry data, versioned documentation and [Go Weekly 619](https://golangweekly.com/issues/619). Rust Bytes' archive was stale; its full RSS item supplied #137. Older Cloudflare, Verus, Wild and Symposium material is labelled with its real date.

## Verdict and radar changes

| Tool | Previous | Issue #14 | Reason |
|---|---|---|---|
| Miri | Not tracked | Adopt, targeted UB testing | Useful interpreter checks, patched nightly verified; scoped to compatible tests and clean CI credential boundaries. |
| rmcp | Trial | Trial | 3.5.0 fixes deserve integration testing; protocol/transport compatibility still requires a deployed-pair check. |
| Symposium | Not tracked | Assess | Relevant matching mechanism, but documentation/version differences and update policy need a local evaluation. |
| Wild | Not tracked | Trial, supported Linux | Concrete benchmark methodology and active maintenance; measure the actual build loop and check linked output. |
| fastlogging | Not tracked | Assess | Mixed-language/OTLP use case, early release and ownership signals; drain, failure and pressure tests remain necessary. |

Actual data: **84 total = 15 Adopt + 34 Trial + 33 Assess + 2 Hold**. Four additions, rmcp updated, 79 pre-existing entries byte-equivalent as objects. Existing names/history/mentions preserved. No existing tool changed ring. Older entries retain previous review dates and are not presented as freshly reverified.

The existing radar generator's full legend overflowed the 820px canvas at 84 tools. Its sidebar now shows this issue's reviewed tools plus recomputed totals and the interactive-list URL. All 84 blips remain; no clipped legend. SVG and PNG were regenerated and visually inspected. The same generator remains reproducible for future issues.

## Claim-to-source verification ledger

All source checks below were made September 28. Full primary article/release bodies or relevant complete versioned source/doc sections were read; discovery snippets were not used as factual proof. Numbers reported by authors remain attributed and were not independently reproduced.

| Claim | Primary evidence | Result and scope |
|---|---|---|
| Miri could leak secrets through cached target output readable by PR jobs | [Rust security advisory, September 21](https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/); [GitHub cache access rules](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching) | Conditional exposure: secrets must be visible to the Miri process and affected output cached for lower-trust readers. No claim that all Miri users leaked credentials. |
| Fix filters the saved environment | [Miri PR 5337](https://github.com/rust-lang/miri/pull/5337); [complete file patch via GitHub API](https://api.github.com/repos/rust-lang/miri/pulls/5337/files) | Merged September 21. Retains OUT_DIR and CARGO_ names except *_TOKEN. The diff route failed; API files supplied the actual patch. |
| Patch shipped in September 22 nightly | [Dated toolchain manifest](https://static.rust-lang.org/dist/2026-09-22/channel-rust-nightly.toml); [source at manifest commit](https://github.com/rust-lang/rust/blob/1303417c416e1595173d9689e7394c31e136ae95/src/tools/miri/cargo-miri/src/util.rs) | Manifest commit `1303417c416e1595173d9689e7394c31e136ae95` contains the filter. Miri preview component listed available for aarch64-apple-darwin. This verifies shipped nightly content, not stable Rust availability. |
| Upgrade plus cache cleanup and possible rotation | [Security advisory](https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/) | Existing cache contents are not erased by upgrading. Recommendations attributed to Rust security team; no claim of an individual user's actual compromise. |
| Miri capabilities, limits and licence | [Project README](https://github.com/rust-lang/miri#readme); [MIT](https://github.com/rust-lang/miri/blob/master/LICENSE-MIT); [Apache-2.0](https://github.com/rust-lang/miri/blob/master/LICENSE-APACHE) | Use-after-free, alignment/validity and race checks; limited executions/FFI/platform support; isolation is not a security sandbox. Both licence texts retrieved. Adopt is editorial judgment for targeted tests. |
| rmcp 3.5.0 and 3.4.1 dates/status/MSRV | [Registry API](https://crates.io/api/v1/crates/rmcp); [3.5.0 release](https://github.com/modelcontextprotocol/rust-sdk/releases/tag/rmcp-v3.5.0); [release history](https://github.com/modelcontextprotocol/rust-sdk/releases) | 3.5.0 uploaded 2026-09-28T00:16:06.911025Z, not yanked, Rust 1.88. 3.4.1 uploaded September 23. Normal versions, not release candidates. |
| Duplicate routing headers rejected | [PR 1274](https://github.com/modelcontextprotocol/rust-sdk/pull/1274) | Full merged PR body explains first-value-only validation and rejection of repeated Mcp-Method, Mcp-Name and Mcp-Param-* headers. Merged September 25; included in 3.5.0 notes. |
| Explicit allowlisted default port matches implicit browser Origin | [PR 1270](https://github.com/modelcontextprotocol/rust-sdk/pull/1270) | Incoming effective port is resolved; no claim that every allowlist entry is rewritten. Merged September 25. |
| Empty/null cacheScope becomes absent | [PR 1281](https://github.com/modelcontextprotocol/rust-sdk/pull/1281) | Prevents loss of typed tools/resource content access through fallback. Merged September 24. |
| LATEST differs from LATEST_WITH_INITIALIZE | [3.5.0 model source](https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.0/crates/rmcp/src/model.rs) | LATEST = 2026-07-28; LATEST_WITH_INITIALIZE = 2025-11-25. Article recommends adapter review, not blanket peer compatibility. |
| rmcp licence and activity | [Versioned LICENSE](https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.0/LICENSE); [repository API](https://api.github.com/repos/modelcontextprotocol/rust-sdk); registry API above | Apache-2.0 transition for new code; legacy MIT contributions pending consent. 3,958 stars and 29,807,507 downloads at check, rounded and dated in radar. Official SDK status is not independent user-adoption proof. |
| Symposium's event is new; crate 0.4.0 is older | [Foundation September 25 announcement](https://rustfoundation.org/media/your-ai-agent-is-writing-rust-but-is-it-good-explore-on-this-upcoming-livestream/); [registry API](https://crates.io/api/v1/crates/symposium); [0.4.0 notes](https://github.com/symposium-dev/symposium/releases/tag/symposium-v0.4.0) | Livestream October 1, 16:00 UTC, Huey and Matsakis. Latest crate 0.4.0 is May 14; not presented as a September release. |
| Symposium docs/version drift | [Live install docs](https://symposium.dev/install.html); [current README](https://github.com/symposium-dev/symposium#readme); [tagged 0.4.0 README](https://github.com/symposium-dev/symposium/blob/symposium-v0.4.0/README.md); [release history](https://github.com/symposium-dev/symposium/releases) | Website's future crate-plugin wording differs from current metadata/skill resolution and 0.3 notes. Tagged README says pre-alpha. Differences are disclosed, not silently equated. |
| Matching, agent coverage and update defaults | [Current README](https://github.com/symposium-dev/symposium#readme); [supported agents](https://symposium.dev/reference/supported-agents.html) | Crate/version and richer predicates; seven listed skill targets, OpenCode/Goose skills-only. Global hook scope, auto-sync and self-update are documented defaults. Main documentation does not prove every behaviour of May's installed binary. |
| Symposium ownership/licence | [Owners API](https://crates.io/api/v1/crates/symposium/owners); [LICENSE.txt](https://github.com/symposium-dev/symposium/blob/main/LICENSE.txt); [repository](https://github.com/symposium-dev/symposium) | Niko, Jack and core team registry owners; MIT OR Apache-2.0 actual text, including contributor relicensing provision. Activity September 25, 227 stars, 440 downloads at check. No production adoption claim. |
| Wild latest release/platform limits | [0.10.0 release](https://github.com/wild-linker/wild/releases/tag/0.10.0); [tagged README](https://github.com/wild-linker/wild/tree/0.10.0); [release API](https://api.github.com/repos/wild-linker/wild/releases/latest) | August 4 stable tag, incremental linking still a goal; Linux target constraints, partial scripts/LTO and incomplete other-platform work. No claim that Wasm/Mach-O work means supported production targets. |
| Wild versus Mold link times | [Lattimore's complete September 18 comparison](https://davidlattimore.github.io/posts/2026/09/18/benchmarking-wild-vs-mold.html) | Author's Ryzen 9955HX, 16 cores/32 threads, Ubuntu 26.04, 92 GiB RAM. clang-release: ext4 + delete output + --no-fork gives Wild 0.21s/Mold 0.20s; tmpfs + keep output + fork gives 0.11s/0.19s. Release builds as of August 28. Link-stage workload, not end-to-end Rust compilation. Not reproduced here. |
| Threadripper hypothesis and later optimisations | [Same benchmark article](https://davidlattimore.github.io/posts/2026/09/18/benchmarking-wild-vs-mold.html) | Author did not reproduce Mold's 64-core Threadripper case. He reproduced similar M1 ratios on his Ryzen, not on an M1. Thread-count explanation remains hypothesis. Preallocation/huge-page changes are for a later release, not 0.10.0. |
| Wild maintenance/licence | [Tagged README/licences](https://github.com/wild-linker/wild/tree/0.10.0); [repository API](https://api.github.com/repos/wild-linker/wild) | MIT OR Apache-2.0; maintainer/sponsorship acknowledged in notes. 4,002 stars September 28. Trial is scoped editorial judgment, not a universal ranking. |
| fastlogging recognition, version, changes | [TWiR 670](https://this-week-in-rust.org/blog/2026/09/23/this-week-in-rust-670/); [registry API](https://crates.io/api/v1/crates/fastlogging); [changelog](https://github.com/brmmm3/fastlogging-rs/blob/master/CHANGELOG.md) | Crate of the Week; 0.9.0 September 17 adds OpenTelemetry and Java build work. Two registry uploads: 0.8 September 15 and 0.9 September 17. Changelog's September 6 initial date is not an upload date. |
| fastlogging architecture, bindings, OTLP | [Rust README](https://github.com/brmmm3/fastlogging-rs/blob/master/fastlogging/README.md); [root README](https://github.com/brmmm3/fastlogging-rs#readme) | Channels/logging/writer threads; OTLP/HTTP writer and subprocess forwarding; bindings named explicitly. README's speed claim is qualified by queue capacity. No borrowed speedup figure. Proposed drain/pressure tests are recommendations, not completed tests. |
| fastlogging early signals/licence | [Owners API](https://crates.io/api/v1/crates/fastlogging/owners); [repository API](https://api.github.com/repos/brmmm3/fastlogging-rs); [licence files](https://github.com/brmmm3/fastlogging-rs) | Marty B./brmmm3 sole listed owner; pushed September 26; 14 stars/26 downloads at September 28 check. MIT OR Apache-2.0. No commercial-only eligibility condition asserted. |
| Allocator stabilisation PR merged | [PR 156882 and stabilisation report](https://github.com/rust-lang/rust/pull/156882); [API merge timestamp](https://api.github.com/repos/rust-lang/rust/pulls/156882) | Merged September 23 07:13:04 UTC. Basic Box/Vec custom-allocation operations, stricter safety/unwinding constraints, remaining allocator_ext work and excluded pinning subset. This closes the open-PR carry-over; current stable shipping is a separate check. |
| Cargo maintainer funding and future lint release | [Rust project September 22 announcement](https://blog.rust-lang.org/2026/09/22/announcing-a-maintainer-in-residence-scott-schafer-for-the-cargo-team/) | Scott Schafer funded full-time for at least twelve months. Cargo linting stabilised and expected in 1.100.0; no claim that stable already shipped it. |
| Go portable SIMD experiment | [Go team September 24 post](https://go.dev/blog/simd-experiment) | Go 1.27, GOEXPERIMENT=simd, portable size-agnostic API, emulation fallback. ReduceSum is later. No cross-language performance claim. |
| Cloudflare 100 TB context | [Complete Cloudflare post, September 18](https://blog.cloudflare.com/saving-100-tb-of-ram-with-math/) | Server index u32→u16; hash remains u32; packed representation plus fewer hash points and rollout comparison. 100 TB is authors' fleet-wide report, not a benchmark run here. |
| Verus weak specification example | [Amazon Science, Bryan Parno, August 31](https://www.amazon.science/blog/developing-provably-correct-rust-code-with-verus) | Full article retrieved through direct authoritative HTML after search-tool access failed. Binary-search example illustrates missing absence condition; not a blanket proof of all code behaviour. |
| tokio_rcu carry-over | [Tokio Builder documentation](https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.on_after_task_poll) | on_after_task_poll remains tokio_unstable, outside normal stable API promises. Existing Assess retained; no new Tokio-team response claimed. |

### Access and omission notes

Forty-one unique article link/image destinations were checked. Thirty-eight fetched successfully directly (including local previews for canonical links/assets); three crates.io pages returned empty 404 responses to the direct client but rendered correctly in Chrome, showing rmcp v3.5.0, symposium v0.4.0 and fastlogging v0.9.0. Their registry API bodies supplied exact version evidence. The final article links the working browser-facing crate roots. Do not misreport these client-specific 404s as deleted crates.

Rust Bytes used its complete RSS item when discovery pages were stale/inaccessible. GitHub API file patches replaced a failed raw diff fetch. Amazon's full official page replaced an inaccessible search fetch. No claim rests solely on a title, search snippet or inaccessible page.

No historical lib.rs ranking was inferred from today's page. No “no alternatives exist” claim was made. fastlogging's timing table was not promoted to a verified performance comparison. RustConf recording searches did not establish availability of the two requested talks, and do not prove absence; those items remain omitted pending authoritative links.

## Artwork

- Hero/source: `apps/web/public/images/blog/2026-09-28-rust-ai-weekly-14-3d-hero.png`, 1672×941.
- Social copy of artwork: `apps/web/public/images/social/2026-09-28-rust-ai-weekly-14.png`.
- Radar: `apps/web/public/images/radar/2026-09-28-radar.svg` and `.png` (3278×2278 raster).
- Prompt, visual concept, alt text and caption: `docs/social/rust-ai-weekly-14-artwork.md`.

Original 3D wolf/storage/key scene uses the recalled visual identity. It is labelled illustration, never a system diagram or benchmark. Hero and radar were visually inspected; uploaded Substack versions loaded and preserved both alt texts after save/reload.

## Editorial evaluation

Voice nodes were recalled with prime_voice before first-person drafting. Applied ralph-copywriter and no-ai-slop to the article; linkedin-ghostwriting followed by no-ai-slop to LinkedIn only. Technical recommendations are expressed as judgments or proposed trials; no invented production anecdote.

No-ai-slop evaluation, after final edit:

| Check | Result |
|---|---|
| Editing 1: preserve point, add no invented evidence | Pass — all factual additions trace to ledger; proposed evaluations are labelled. |
| Editing 2: preserve voice and uncertainty | Pass — concrete engineering judgment, British spelling, scoped verdicts. |
| Editing 3: retain strong human sentences | Pass — direct cache-opening and drain-test prose retained. |
| Editing 4: proportional cuts | Pass — preserved the earlier factual review; added reader decisions and removed the repeated advisory setup. Net change from the previous trim: +121 words. |
| Editing 5: reader need first | Pass — affected CI configuration and cleanup lead. |
| Editing 6: useful front-loading | Pass — the lead starts with the dated advisory; selected evaluations start with their reader problem and keep the verdict nearby. Wild retains its evidence-led structure. |
| Editing 7: earned sentences | Pass — versions, failure modes, evidence and evaluation steps remain. |
| Editing 8: portability test | Pass — generic capacity/performance/weekly-change reminders removed. |
| Editing 9: active voice | Pass — named maintainers/projects and direct proposed actions. |
| Editing 10: retain useful structure | Pass — short prose plus parallel release and verdict details. |
| Editing 11: untangle prose | Pass — default-port explanation survives Substack without split bullets. |
| Words 1: filler and inflation | Pass — no unsupported superlatives or canned leadership language. |
| Patterns 1: binary/rhetorical framing | Pass — removed generic contrasts; retained factual distinctions such as merged versus shipped. |
| Patterns 2: faux insight and robotic cadence | Pass — no dashboard analogy, manufactured theme or stacked fragments. |
| Patterns 3: attribution | Pass — author measurements and date-stamped weak signals explicitly identified. |
| Patterns 4: redundant commentary | Pass — recap after rmcp list and duplicated Symposium disclaimer cut. |
| Patterns 5: profound kicker | Pass — none. |
| Patterns 6: concrete ending | Pass — the issue ends with a specific request for the reader's Miri cache-access check and unresolved boundary. |
| Patterns 7: formatting | Pass — meaningful headings and parallel lists; no decorative emoji headings. |
| Patterns 8: colon casing | Pass — sentence case except tool/proper names. |
| Patterns 9: dash use | Pass — no em-dash scaffolding in article body or social copy. |
| Final 1: sentence variation | Pass — evidence, explanation and proposed checks have different rhythms. |
| Final 2: recognisable voice | Pass — assessed against recalled engineering/readability preferences, not claimed human approval. |
| Final 3: read-aloud review | Pass — editorial read performed; no fabricated reader test. |
| Final 4: complete edit and change note | Pass — complete artifacts delivered; change note below. |
| Final 5: detect-only handling | Pass / not applicable — drafting task, no AI-authorship verdict. |

### What changed

The draft follows issue #13's corrected paragraph/list structure. The final pass removed repeated caveats and recap sentences, shortened the visible build-commit reference, and rewrote the port example after Substack split a URL-only code span into separate blocks. The technical distinction and primary link remain. LinkedIn uses a single concrete case and short paragraphs; X is a reply chain rather than a copied newsletter.

## Verification results

- Actual Next.js blog route returned HTTP 200. React Markdown + remark-gfm + rehype-raw + rehype-highlight rendered the body; exports use the same Markdown pipeline. Native JavaScript was used for the existing renderer and radar generator; Rust handled export packaging and link checks.
- **2,676 body words, 56 paragraphs, maximum 65 words, zero over 100; 8 h2, 7 h3, 8 lists, 2 images.** Frontmatter excluded; list items remain separate blocks.
- Substack saved/reloaded body matches the actual site text after normalising whitespace, smart quotes and native accessibility bullet glyphs. All source-link destinations survive in the saved accessibility snapshot. The same two uploaded image links remain; both loaded successfully during the final pre-publication check.
- Revised site mobile at 390×844 has 390px document width, no article overflow and both images loaded. The new opening screenshot was inspected. Fresh Substack mobile and email previews of the final framework revision were inspected on September 28; both images load, paragraph gaps are present, and the email preview contains the closing question. No claim of physical-device or delivered-email testing.
- Matched syndication body, absolute HTML links, stable slug/date, radar counts and PNG loading checked. `git diff --check` passed. No broad unrelated application test suite was needed for the editorial/data changes.

## Carry-over to #15

- Closed: Allocator PR's merge status. Next check is the stable release/MSRV landing, not whether the PR is still open.
- tokio_rcu: keep Assess; hook remains unstable. A maintainer response about its correctness/stability contract is still unverified.
- fearless_simd: 1.0 was already verified last issue; seek version-specific adoption/migration evidence before changing Trial.
- Symposium: compare a pinned installed version against current plugin/skill documentation; record selected extensions and update settings.
- Wild: check next release for the benchmark article's preallocation/huge-page changes before attributing them to shipped binaries.
- RustConf: authoritative recordings for Melih Elibol and Joe Birr-Pixton still need verified links. Limited search is not evidence that recordings do not exist.
- dial9: reader/production overhead evidence outside AWS remains useful; no new deployment result invented this week.

## September 28 revision: Lara's frameworks

The requested adaptation uses Lara Acosta's SLAY and PAS structures to make decisions easier for Rust practitioners and engineering leads. It does not present a LinkedIn framework as a prescribed newsletter format. The source is [Lara's video](https://www.youtube.com/watch?v=0ZVUVa4IFTw), with SLAY around 1:38–4:58, PAS at 5:00–6:05 and 4-3-2-1 at 7:05–8:09. Definitions were recalled from prime_voice nodes based on the previously read English transcript; a fresh transcript export was unavailable during this pass.

| Structure and location | Sourced event or reader problem | Lesson or concrete consequence | Action or reader ending |
|---|---|---|---|
| SLAY: lead and Miri section | September 21 advisory: environment variables could enter restorable build caches under the stated conditions. | The shipped fix does not remove caches created by earlier runs. | Check affected jobs, clear affected caches, record the rotation decision; leads assign cleanup alongside the upgrade. |
| PAS: rmcp opening and release details | A successful tool call leaves duplicate headers, origins and optional-field paths untested. | The verified 3.5.0 fixes identify specific compatibility cases for the deployed pair. | Add those cases to upgrade tests; retain Trial. |
| PAS: Symposium opening and setup trial | An agent can recommend an API from a different dependency version. | Review must catch the mismatch; current docs do not prove the installed binary has every behaviour. | Inspect version-matched generated guidance in one repository; retain Assess. |
| PAS: fastlogging opening and drain-path trial | A background caller can return before records reach their destination. | Collector pressure and subprocess exit require delivery checks, beyond enqueue timing. | Test drain, pressure and failure paths; retain Assess. |
| Reader-facing ending: final paragraph | The lead gives readers a concrete CI boundary to examine. | Their actual check and remaining uncertainty are useful follow-up evidence. | Ask readers running Miri to reply with the CI platform, cache-restore access check and unresolved boundary. |
| 4-3-2-1: planning only | Practitioners need configuration/tests; decision-makers need scope and ownership. | Mix sourced stories, education and reader problems without forcing every story into one theme. | Preserve the Monday schedule. No four-issue cadence or invented conversion offer. |

The title now names Miri and the remaining cleanup. The previous 2,555-word draft became 2,676 words across 56 paragraphs; the maximum remains 65 words. All 41 unique link/image destinations, five verdicts, benchmark qualifications, version/status distinctions, date, slug and radar counts are preserved. No new measurement, personal incident or production adoption claim was added. No-ai-slop's full evaluation above was repeated after this structural revision; all checks pass, with the detection-only check not applicable.

Durable guidance is installed in [Ralph copywriter](/Users/decebaldobrica/.codex/skills/ralph-copywriter/SKILL.md), version 2.1.0, with `references/decebal-newsletter-frameworks.md` as the scoped newsletter guide. The installed skill passes the skill-creator validator. The existing automation `rust-ai-weekly-monday-edition` was updated through the app and read back: active, Mondays at 09:00 Europe/Lisbon, same target thread. It now requires the framework guide, voice recall, internal framework map and settled Substack checks. Draft-only publication boundaries remain in force.

The saved draft and synchronized HTML/Markdown copies contain this revision. A new actual-site mobile screenshot shows the revised lead and paragraph spacing. Fresh Substack mobile/email captures were completed before publication, showing the final framework revision and working images. Saved draft text and source links were verified through native Chrome accessibility after reload. The email-length warning correction is recorded under Before publication.

## Exact Substack HTML body mirror

The following mirror is generated from the final MDX through the site's Markdown plugins. Canonical URLs are used here; the saved unpublished Substack draft substitutes only its two uploaded image URLs.

<!-- WEEKLY14_HTML_MIRROR -->

```html
<p><img src="https://decebaldobrica.com/images/blog/2026-09-28-rust-ai-weekly-14-3d-hero.png" alt="A silver wolf watches an open graphite storage drawer containing metal tiles and a red key."/></p>
<p><em>Cached build output can contain credentials. Original 3D illustration; not a system diagram.</em></p>
<p>On September 21, the <a href="https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/">Rust security team warned</a> that Miri was saving environment variables into <code>target/</code>. In jobs that exposed secrets and cached that output for pull requests to restore, credentials could travel with the build cache.</p>
<p>The fix is in the September 22 nightly. A patched run cannot erase an older cache. If your workflow matched those conditions, the cleanup includes clearing affected caches and deciding whether exposed credentials need rotating.</p>
<p>If you maintain Rust services, start with the cache checklist below. The other four evaluations help scope a dependency upgrade or a small trial: rmcp&#x27;s transport edge cases, Symposium&#x27;s generated guidance, Wild&#x27;s link times, and fastlogging&#x27;s delivery path.</p>
<p><strong>Rust &amp; AI Weekly #14</strong> covers September 21–28, with older material labelled where it deserves a second look. Public sources were checked on September 28. Verdicts are engineering assessments from source review, not claims that I ran every tool in production.</p>
<p><a href="https://decebaldobrica.com/radar"><img src="https://decebaldobrica.com/images/radar/2026-09-28-radar.png" alt="Rust and AI Crate Radar for September 28: 84 tools across Adopt, Trial, Assess and Hold."/></a></p>
<p><em>Five evaluations: four additions and one returning tool. This snapshot covers 84 tools: 15 Adopt, 34 Trial, 33 Assess and 2 Hold. Older entries retain their previous review dates. <a href="https://decebaldobrica.com/radar">Explore the radar</a>.</em></p>
<h2>Miri: keep the tests, repair the cache boundary</h2>
<p><a href="https://github.com/rust-lang/miri"><strong>Miri</strong></a> receives <strong>Adopt for targeted undefined-behaviour testing</strong>, with a clean, patched CI setup. Miri executes tests under an interpreter; a passing run is not a proof that every safe caller or thread interleaving is sound.</p>
<p>If you lead the team, assign the cache cleanup alongside the toolchain upgrade. Ask for the affected cache keys, the jobs allowed to restore them, and a recorded decision on credential rotation. Those are concrete outputs another engineer can review.</p>
<p>GitHub&#x27;s <a href="https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching">cache documentation</a> explains why the restore side needs its own check. Pull requests can restore caches from their base branch, including in fork scenarios. Review who can create the files and who can read them.</p>
<h3>What is fixed</h3>
<p><a href="https://github.com/rust-lang/miri/pull/5337">Ralf Jung&#x27;s patch</a> merged on September 21. The saved environment now keeps <code>OUT_DIR</code> and <code>CARGO_</code> variables, excluding names ending in <code>_TOKEN</code>, instead of collecting the entire environment.</p>
<p>The <a href="https://static.rust-lang.org/dist/2026-09-22/channel-rust-nightly.toml">September 22 nightly manifest</a> identifies the build commit; its <a href="https://github.com/rust-lang/rust/blob/1303417c416e1595173d9689e7394c31e136ae95/src/tools/miri/cargo-miri/src/util.rs">cargo-miri source</a> contains that filter. The manifest also lists an available Miri component for aarch64 macOS. This is a nightly toolchain component, not a new stable Rust release.</p>
<p>For an affected workflow, the advisory&#x27;s cleanup is concrete:</p>
<ul>
<li>Upgrade the pinned nightly to a patched build.</li>
<li>Keep secrets out of the Miri step, or disable caching for that job while correcting it.</li>
<li>Clear affected caches after changing the workflow.</li>
<li>Consider rotating credentials that may have been exposed.</li>
</ul>
<p>I would review workflow-level <code>env</code> declarations first, then any earlier step that persists values into later steps. Record which cache keys contained affected output. A successful patched run says nothing about whether a previous cache still contains credentials.</p>
<h3>Where Miri earns its place</h3>
<p>The <a href="https://github.com/rust-lang/miri#readme">project documentation</a> lists checks for use-after-free, invalid values, alignment errors and data races. Its limits are equally useful: many platform APIs and FFI calls are unsupported, and a run explores only particular executions. Its default isolation is explicitly not a security sandbox.</p>
<p>For an unsafe parsing or data-structure crate, I would start with the smallest tests that exercise its safety contract. Keep ordinary tests alongside them. If scheduling matters, vary the execution seed; use a specialised concurrency tool where the state space demands it. Avoid turning the first unsupported syscall into a reason to abandon the smaller tests that do work.</p>
<ul>
<li><strong>Maintenance:</strong> Rust project tooling, with a publicly reviewed security fix. MIT/Apache-2.0 licence files are in the repository.</li>
<li><strong>Latest:</strong> fix verified in nightly-2026-09-22 source. Pin a compatible patched nightly; there is no standalone stable semver upgrade in this advisory.</li>
<li><strong>Adoption:</strong> Adopt for targeted CI tests. Budget for interpreter and platform limitations, and keep credential handling outside those jobs.</li>
</ul>
<h2>rmcp 3.5.0: test beyond a successful tool call</h2>
<p>A successful tool call leaves other transport paths untested. Duplicate headers, browser origins and empty optional fields each need their own cases. The rmcp changes below give you specific failures to check before an upgrade reaches the client and server pair your users depend on.</p>
<p><a href="https://github.com/modelcontextprotocol/rust-sdk/releases/tag/rmcp-v3.5.0"><strong>rmcp 3.5.0</strong></a>, the official Rust MCP SDK, shipped on September 28 at 00:16 UTC. <strong>Trial</strong>, unchanged from <a href="https://decebaldobrica.com/blog/2026-09-07-rust-ai-weekly-11">issue #11</a>.</p>
<p>The preceding 3.4.1 release arrived September 23. Both are ordinary releases, without prerelease suffixes. The <a href="https://crates.io/crates/rmcp">registry</a> declares Rust 1.88 as the minimum supported version for 3.5.0.</p>
<p>Three fixes are worth testing against your actual client and server pair:</p>
<ul>
<li><strong>Duplicate headers:</strong> <a href="https://github.com/modelcontextprotocol/rust-sdk/pull/1274">PR 1274</a> rejects repeated <code>Mcp-Method</code>, <code>Mcp-Name</code> and <code>Mcp-Param-*</code> field lines. Previously, validation read only the first value, silently ignoring subsequent values.</li>
<li><strong>Default ports:</strong> <a href="https://github.com/modelcontextprotocol/rust-sdk/pull/1270">PR 1270</a> lets an HTTPS allowlist entry with an explicit port 443 match a browser <code>Origin</code> that omits that default port. It resolves the incoming origin&#x27;s effective port.</li>
<li><strong>Empty cache scope:</strong> <a href="https://github.com/modelcontextprotocol/rust-sdk/pull/1281">PR 1281</a> treats an empty or null <code>cacheScope</code> as absent. Previously, the deserialisation fallback could leave callers without typed access to the returned tools or resource contents.</li>
</ul>
<h3>The protocol constant also changed</h3>
<p>Version 3.5 adds <code>LATEST_WITH_INITIALIZE</code>. The <a href="https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.0/crates/rmcp/src/model.rs">versioned source</a> distinguishes <code>LATEST</code>, currently the July 28, 2026 protocol, from the latest revision that uses the older initialise handshake, November 25, 2025.</p>
<p>If an adapter uses <code>LATEST</code> when it means “the handshake version”, review that assumption. The new constant makes the distinction explicit. It does not tell you which protocol every deployed peer supports.</p>
<p>My Trial check would include a browser-origin request, a deliberately duplicated method header, and a tool-list response with an empty cache scope. Keep the dependency and lockfile change small enough to attribute a regression, then repeat those tests through the proxy or gateway used in production.</p>
<p>The <a href="https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.0/LICENSE">licence file</a> also deserves precise wording. The registry says Apache-2.0, while the repository describes a transition in which some earlier contributions remain MIT until consent is obtained. Preserve the applicable notices when distributing it.</p>
<ul>
<li><strong>Maintenance:</strong> official MCP organisation, with releases and merged fixes this week. Approximately 4,000 GitHub stars as checked September 28.</li>
<li><strong>Latest:</strong> 3.5.0, September 28; Rust 1.88. Version 3.4.1&#x27;s transport fallback fix is also included in this week&#x27;s upgrade window.</li>
<li><strong>Adoption:</strong> Trial. Useful fixes justify evaluation; they do not remove the need to test protocol negotiation and error handling in your integration.</li>
</ul>
<h2>Symposium: match agent guidance to dependencies</h2>
<p>If an agent recommends APIs from a different version of your dependency, your review has to catch the mismatch. <a href="https://symposium.dev/"><strong>Symposium</strong></a> scans a Rust workspace and matches agent extensions to its dependency graph. <strong>Assess</strong>: verify which guidance the installed version adds before widening the setup to more projects.</p>
<p>The Rust Foundation&#x27;s <a href="https://rustfoundation.org/media/your-ai-agent-is-writing-rust-but-is-it-good-explore-on-this-upcoming-livestream/">September 25 introduction to its next livestream</a> puts maintainers Jack Huey and Niko Matsakis on the programme for October 1 at 16:00 UTC. That announcement is this week&#x27;s news. It is not evidence of a September crate release.</p>
<h3>Check which version the instructions describe</h3>
<p>The <a href="https://crates.io/crates/symposium">registry&#x27;s latest release</a> remains 0.4.0 from May 14. Its <a href="https://github.com/symposium-dev/symposium/releases/tag/symposium-v0.4.0">release notes</a> cover self-update behaviour and mirroring user-authored skills between agent directories. The <a href="https://github.com/symposium-dev/symposium/blob/symposium-v0.4.0/README.md">tagged README</a> still labels the software pre-alpha.</p>
<p>There is documentation drift to resolve during an evaluation. The <a href="https://symposium.dev/install.html">live installation page</a> says crate-defined plugins without the central repository are a future step. The current README describes resolving crate-sourced skills through package metadata, and 0.3.0&#x27;s release notes already mention crate-sourced skill resolution. Those statements describe different pieces of distribution; they should not be flattened into a claim that every crate automatically ships a plugin.</p>
<p>The <a href="https://github.com/symposium-dev/symposium#readme">current README</a> shows matching by crate name and version requirement, with richer predicates for files, environment and shell checks. It translates a shared configuration into agent-specific files. Skills reach seven listed agents, but hook support differs; OpenCode and Goose are listed as skills-only.</p>
<h3>Start with one repository</h3>
<p>For a trial, I would select project-scoped hooks and review the configuration for automatic synchronisation and self-updates. The documented defaults favour convenience: global hook scope, automatic sync, and self-update enabled. A team needs to know when its agent&#x27;s instructions change as well as when its code dependencies change.</p>
<p>Inspect the generated files and selected plugin sources before widening that setup. Then choose a real dependency migration with a known acceptance test. Compare the result with the project&#x27;s existing instructions: correct API usage, fewer manual corrections, and a reproducible set of loaded guidance would be useful evidence.</p>
<ul>
<li><strong>Maintenance:</strong> Jack Huey, Niko Matsakis and the Symposium core team are registry owners; repository activity continued September 25. MIT OR Apache-2.0, confirmed in the licence text.</li>
<li><strong>Latest:</strong> 0.4.0, May 14, not a fresh release. Current website and main-branch documentation need checking against the version you install.</li>
<li><strong>Adoption:</strong> Assess. Keep the initial experiment local to one project and record exactly which extensions it adds or updates.</li>
</ul>
<h2>Wild: benchmark the filesystem you build on</h2>
<p><a href="https://github.com/wild-linker/wild/releases/tag/0.10.0"><strong>Wild 0.10.0</strong></a>, the Rust linker, enters at <strong>Trial for supported Linux builds</strong>. This is an older release, dated August 4. The reason to revisit it is David Lattimore&#x27;s <a href="https://davidlattimore.github.io/posts/2026/09/18/benchmarking-wild-vs-mold.html">September 18 comparison with Mold</a>, highlighted in TWiR 670.</p>
<p>The two projects&#x27; published benchmarks disagreed. Lattimore checked differences that can disappear in a headline: output filesystem, whether an existing output file is removed, the linker&#x27;s fork behaviour, and the versions being compared.</p>
<p>His Ryzen 9955HX has 16 cores and 32 threads, running Ubuntu 26.04. For <code>clang-release</code>, with ext4, output deletion between runs and <code>--no-fork</code>, he reports 0.21 seconds for Wild and 0.20 for Mold. With tmpfs, an existing output and default fork behaviour, those numbers become 0.11 and 0.19 seconds.</p>
<p>These are the author&#x27;s measurements using release builds as of August 28, not results I reproduced. They are link times for that workload, not end-to-end Rust build times. Lattimore did not reproduce Mold&#x27;s 64-core Threadripper results; his explanation of that machine&#x27;s thread-count effect remains a hypothesis.</p>
<h3>A trial that answers your build problem</h3>
<p>The <a href="https://github.com/wild-linker/wild/tree/0.10.0">0.10.0 README</a> is explicit that incremental linking remains a goal. It lists Linux targets and distinguishes them from unsupported or incomplete platform work. The release notes contain Wasm and Mach-O development, which does not make every such target a supported replacement for its existing linker.</p>
<p>I would pick one Linux service where linking is a measured share of iteration time. Record the target, compiler and linker versions, filesystem, worker count, output-file policy and debug settings. Measure a clean build and the edit-build loop separately; a faster linker cannot remove time spent elsewhere in the compiler.</p>
<p>Run the resulting binaries and test suites as part of that comparison. Include your real linker scripts and LTO settings if you use them. Keep switching back to the existing linker a one-file configuration change while collecting results.</p>
<p>The author says preallocation and huge-page changes discussed in the comparison were merged for the next release. As of this check, the latest tagged release is still 0.10.0. Do not attribute those later changes to an August binary.</p>
<ul>
<li><strong>Maintenance:</strong> active project led by David Lattimore, with contributors and sponsorship acknowledged in release notes. MIT OR Apache-2.0; about 4,000 stars on September 28.</li>
<li><strong>Latest:</strong> 0.10.0, August 4. September&#x27;s benchmark discussion is new evidence about configurations, not a new release announcement.</li>
<li><strong>Adoption:</strong> Trial on a supported target. Promote it only after measuring your build loop and checking the output; no universal speed ranking follows from these tables.</li>
</ul>
<h2>fastlogging: useful bindings, test the drain path</h2>
<p>With a background logger, the caller can finish before the records reach their destination. If your collector slows down or a subprocess exits, test what gets written and when. <a href="https://crates.io/crates/fastlogging"><strong>fastlogging 0.9.0</strong></a> is <strong>Assess</strong>; I would run those checks before making it shared infrastructure.</p>
<p>TWiR 670 selected the project as Crate of the Week. Its common logging core has bindings spanning Rust, Python, C, C++, Go, Java and C#. That makes it relevant when several services need consistent logging behaviour across language boundaries.</p>
<p>The <a href="https://github.com/brmmm3/fastlogging-rs/blob/master/CHANGELOG.md">September 17 changelog</a> adds OpenTelemetry support and Java build work. The <a href="https://github.com/brmmm3/fastlogging-rs/blob/master/fastlogging/README.md">Rust documentation</a> shows an <code>OpenTelemetryWriterConfig</code> that exports batches over OTLP/HTTP. That makes an existing collector a practical destination for an experiment.</p>
<p>The architecture sends messages through a channel to a logging thread and then to writer threads. Console, file and network output can therefore run away from the caller. The project also documents forwarding messages from subprocesses to their parent.</p>
<h3>Measure completion, not only enqueueing</h3>
<p>The <a href="https://github.com/brmmm3/fastlogging-rs#readme">root README</a> explicitly qualifies its claim about slow writers: the queue must not fill. Its short timing table is not enough to choose a logging library for an application with sustained pressure or a slow collector. I am not using those numbers as a verified speedup.</p>
<p>A useful test should include the time to finish writing, queue pressure, memory growth and shutdown behaviour. Stop the collector while the application continues to log, restore it, then inspect what arrives. Repeat with a subprocess that exits quickly. Count the records at the destination rather than relying only on how fast the producer returned.</p>
<p>That exercise also exposes the integration cost. A team already using structured tracing needs to decide which fields, correlation identifiers and filtering rules it must preserve. Similar APIs across languages may reduce wrapper work, but they do not establish identical behaviour for every binding.</p>
<ul>
<li><strong>Maintenance:</strong> Marty B. (<code>brmmm3</code>) is the sole listed registry owner; repository activity continued September 26. MIT OR Apache-2.0. Fourteen stars and 26 registry downloads at this check are early signals, not adoption proof.</li>
<li><strong>Latest:</strong> 0.9.0, September 17. The registry shows two published versions; the changelog&#x27;s earlier initial-release date differs from the first registry upload.</li>
<li><strong>Adoption:</strong> Assess. Worth exploring for a mixed-language application; require shutdown, failure and backpressure evidence before making it shared infrastructure.</li>
</ul>
<h2>Language and toolchain watch</h2>
<p><strong><code>Allocator</code> merged.</strong> <a href="https://github.com/rust-lang/rust/pull/156882">PR 156882</a> landed September 23, closing last issue&#x27;s “FCP complete, still open” carry-over. The approved subset includes the allocator trait and basic custom-allocator operations for <code>Box</code> and <code>Vec</code>; remaining experimental work moves under <code>allocator_ext</code>.</p>
<p>Read the stabilisation report before porting a nightly allocator. It tightens safety requirements, including unwinding constraints, and explains why some custom-allocator pinning operations remain outside this subset. A merge into Rust&#x27;s development branch is not availability in the current stable compiler. Keep the stable release and your project&#x27;s minimum Rust version as separate checks before removing feature gates.</p>
<p><strong>Cargo gained funded maintenance capacity.</strong> <a href="https://blog.rust-lang.org/2026/09/22/announcing-a-maintainer-in-residence-scott-schafer-for-the-cargo-team/">Scott Schafer&#x27;s Maintainer in Residence appointment</a> provides at least twelve months of full-time work. The announcement describes lost funding and reduced capacity in the team.</p>
<p>The same post says Cargo&#x27;s linting system has stabilised and is due to ship in Rust 1.100.0. Treat that as the stated release destination, not a feature already shipped on stable this week.</p>
<h2>Across the language boundary</h2>
<p><a href="https://golangweekly.com/issues/619">Go Weekly 619</a> points to the Go team&#x27;s <a href="https://go.dev/blog/simd-experiment">portable SIMD experiment</a>, published September 24. Go 1.27 adds a portable, size-agnostic <code>simd</code> interface alongside architecture-specific APIs. It requires <code>GOEXPERIMENT=simd</code>; unsupported hardware uses emulation.</p>
<p>This is a useful companion to last issue&#x27;s fearless_simd 1.0 evaluation. Compare operation coverage, fallback behaviour and the cost of maintaining architecture-specific escapes. The Go post explicitly says vector <code>ReduceSum</code> is for a later release.</p>
<h2>Reading list</h2>
<ul>
<li><strong><a href="https://blog.cloudflare.com/saving-100-tb-of-ram-with-math/">Cloudflare&#x27;s smaller consistent-hash rings</a></strong>, September 18, surfaced in Rust Bytes #137. The server index shrinks to 16 bits; the hash remains 32 bits. The article combines compact storage with fewer hash points and a staged migration. Its reported 100 TB saving is fleet-wide, not a promise for another deployment.</li>
<li><strong><a href="https://www.amazon.science/blog/developing-provably-correct-rust-code-with-verus">Developing provably correct Rust code with Verus</a></strong>, Bryan Parno, August 31, also resurfaced in Rust Bytes. Read the binary-search specification example: a weak specification can approve a function that always returns <code>None</code>.</li>
<li><strong><a href="https://rustfoundation.org/media/your-ai-agent-is-writing-rust-but-is-it-good-explore-on-this-upcoming-livestream/">Smarter Coding Agents for Rust with Symposium</a></strong>, October 1 at 16:00 UTC. A useful chance to ask maintainers how installed guidance, crate versions and update policy fit together.</li>
</ul>
<p>Discovery this week came from <a href="https://this-week-in-rust.org/blog/2026/09/23/this-week-in-rust-670/">TWiR 670</a>, <a href="https://weeklyrust.substack.com/p/saving-100tb-of-ram-with-rust">Rust Bytes #137</a>, the Rust project and Foundation blogs, and Go Weekly. Primary release, code and documentation links support the evaluations above.</p>
<p>The first carry-over is resolved: <code>Allocator</code> merged. tokio_rcu remains Assess; the <a href="https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.on_after_task_poll">documented hook</a>, <code>on_after_task_poll</code>, is still unstable. For the next review, I want reproducible adoption evidence for fearless_simd 1.0 and a version-matched Symposium setup.</p>
<p>If you run Miri in CI, reply with the check your team uses to control who can restore its cached output. Include the CI platform and any boundary you still cannot verify.</p>
```
