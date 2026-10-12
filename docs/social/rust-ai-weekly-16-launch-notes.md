# Rust & AI Weekly #16 launch pack

Review draft for Monday, October 12, 2026. Canonical slug: `2026-10-12-rust-ai-weekly-16`.

## State and assets

The repository and Substack published list both identify issue 15, October 5, as the preceding edition. Registered worktrees and the Substack draft list contained no issue 16 before this run. The sole earlier draft was the unrelated editor tutorial. Work started from fetched `origin/main` at `cee723c`, in a detached worktree; unrelated changes in the main checkout remain untouched. The main checkout's branch has merged and must not receive further commits.

- [Article](../../apps/web/content/blog/2026-10-12-rust-ai-weekly-16.mdx)
- [Substack draft 219995423](https://ddonprogramming.substack.com/publish/post/219995423)
- [HTML source](rust-ai-weekly-16-substack.html) and [uploaded-image copy](rust-ai-weekly-16-substack-uploaded.html)
- [Unpublished syndication](rust-ai-weekly-16-syndication.md), with canonical URL
- [LinkedIn](rust-ai-weekly-16-linkedin.md) and [seven-post X thread](rust-ai-weekly-16-x.md)
- [Artwork, alt text and exact source prompt](rust-ai-weekly-16-artwork.md)
- [Render metrics](assets/weekly16-verification/metrics.json), [saved-copy comparison](assets/weekly16-verification/substack-sync.json)
- [Site mobile screenshot](assets/weekly16-verification/site-mobile.png), [Substack mobile](assets/weekly16-verification/substack-mobile.png), [email preview](assets/weekly16-verification/substack-email.png)

The draft audience was changed from the editor's paid-only default to Everyone. No newsletter was sent, post published, social scheduled, commit created or branch pushed. Chronis task `t-bda8c4` remains claimed because the work has not been pushed.

## Claim-to-source ledger

Checked October 12. GitHub release metadata supplies exact UTC publication times and `prerelease: false`; full release bodies, tagged files and the relevant implementation changes supply the claims below. A stable release flag does not establish API stability or a hosted deployment version.

| Claim | Primary evidence | Limit or editorial treatment |
|---|---|---|
| rmcp 3.5.1 shipped October 5 at 18:35:11 UTC; Rust 1.88 | [Release](https://github.com/modelcontextprotocol/rust-sdk/releases/tag/rmcp-v3.5.1); downloaded published 3.5.1 crate manifest | The separate macros release shipped at 18:34:47; its notes are not substituted for runtime notes. Registry API requests failed; static published package download succeeded. |
| Handler-generated -32602 no longer always maps to HTTP 400 | [PR 1322](https://github.com/modelcontextprotocol/rust-sdk/pull/1322), merged October 5; published `src/transport/streamable_http_server/tower.rs` | Checked changed mapper directly. Malformed required request metadata still produces 400. Compatible-client fallback is the PR's reported case, not a claim about every client or a reproduced incident. |
| Refresh rejection hook defaults to no action | [PR 1285](https://github.com/modelcontextprotocol/rust-sdk/pull/1285); published `src/transport/auth.rs` | PR merged September 28; release shipped October 5. Callback runs under refresh guard; failures preserve rejection. No custom store tests executed. |
| rmcp licensing has legacy contribution terms | [Tagged LICENSE](https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.1/LICENSE), package metadata Apache-2.0 | LICENSE retains MIT contribution exceptions and separate documentation terms. Do not reduce redistribution review to the package badge. |
| mold 3.0.0 is first Rust release; 2.42.1 final C++; October 5 10:23:19 UTC | [Full release](https://github.com/rui314/mold/releases/tag/v3.0.0) | CLI/target continuity and performance parity are maintainer claims. Neither was independently reproduced. |
| Cargo replaces CMake; Rust 1.95 and C compiler; MOLD_LIBDIR build/install | [Tagged README](https://github.com/rui314/mold/blob/v3.0.0/README.md) and release body | Packaging trial is proposed. August 28 benchmark predates rewrite: Threadripper 7980X/Ubuntu 24.04 and M1 Ultra/Fedora Asahi 42, warm-up then median of three wall-clock runs. No ratio imported into article. |
| mold MIT commercial eligibility | [Tagged licence](https://github.com/rui314/mold/blob/v3.0.0/LICENSE) | Preserve notices; dependencies need their own inventory. Production history since 2021 describes mold broadly, not adoption of this rewrite. |
| GitHub MCP Server 2.0.0 October 6 23:34:00 UTC; negotiated schemas | [Release](https://github.com/github/github-mcp-server/releases/tag/v2.0.0) | Output schemas advertised to 2026-07-28+ clients. Server tag alone does not prove client negotiation or hosted rollout. Included as a Go peer for Rust agents. |
| Read-only filters write tools; exported Go API unstable | [Tagged README](https://github.com/github/github-mcp-server/blob/v2.0.0/README.md); [MIT licence](https://github.com/github/github-mcp-server/blob/v2.0.0/LICENSE) | Read-only inventory trial proposed; no agent actions executed. Stable major release does not promise stable exported Go API. |
| Fullbleed 2.5.22 October 9 06:42:57 UTC; Rust 1.85 | [Release](https://github.com/fullbleed-engine/fullbleed-official/releases/tag/v2.5.22), downloaded published crate manifest | Stable tagged package checked; no renderer executed. |
| Native Rust API, explicit font registration, missing-glyph report | [Full Rust quickstart](https://docs.fullbleed.dev/getting-started/rust/) | Rust crate lacks Python wheel's bundled fonts. Glyph report alone does not prove intended typeface. Trusted-input example does not establish arbitrary-input safety. |
| Floated first-letter fix; 1,662 fixtures: 1,619 pass, 25 fail, 18 disputed | Full 2.5.22 release body and linked release evidence | Upstream measurements, not reproduced. Plain-text block scope; nested inline selection remains excluded. Separate package checks do not erase source corpus failures or prove full CSS/PDF conformance. |
| Fullbleed MIT; AI-assisted authorship disclosed | [Tagged licence](https://github.com/fullbleed-engine/fullbleed-official/blob/v2.5.22/LICENSE), quickstart authorship section | Commercial use subject to notices. Fonts reviewed separately. No independent production adoption established. |
| Generic Const Args remains experimental | [October 2 Inside Rust article](https://blog.rust-lang.org/inside-rust/2026/10/02/generic-const-args-and-you/) | Older carry-over. Full `gca_const_items` requires `-Znext-solver`, minimal variant does not; both feature gated. `gca!(N + 1)` unsupported. |
| Cargo trim-paths stabilization merged October 6 | [PR 17488](https://github.com/rust-lang/cargo/pull/17488) | Merged status read through GitHub API. Best effort; defaults deferred; unremap sidecars discussed. Article does not name an unverified stable toolchain containing it. |
| Peak memory table merged October 1 behind unstable flag | [PR 17531](https://github.com/rust-lang/cargo/pull/17531) | Older item in this week's roundup; `-Zmem-stats`, future build-analysis integration separated. |
| Go transport may read request body after response returns | [Full VictoriaMetrics investigation](https://victoriametrics.com/blog/http-race-condition/) | Both vmagent and vmauth cases read. No equivalent Rust defect alleged. Proposed Rust wrapper test requires its own client's ownership contract. |
| Go SIMD experiment requires GOEXPERIMENT=simd | [Official Go article](https://go.dev/blog/archsimd) | October 2 carry-over; no cross-language benchmark extrapolation. |
| X standard posts: 280 weighted characters, URLs 23 | [Official counting rules](https://docs.x.com/fundamentals/counting-characters) | Thread uses ASCII copy; counts 216, 246, 223, 242, 245, 254, 183. No publishing UI validation because publication is not authorized. |

## Scan coverage and unresolved checks

[This Week in Rust 672](https://this-week-in-rust.org/blog/2026/10/07/this-week-in-rust-672/) and [Go Weekly 620](https://golangweekly.com/issues/620) were read as full discovery indexes. Rust Bytes 139's full RSS body was read; its October 9 issue supplied only a read-more body. The linker evaluation therefore relies on the complete primary release and tagged README. Rust project blog index was checked; no new stable language release is invented for this window. Rust Foundation index access was incomplete; its [October 2 staffing post](https://rustfoundation.org/media/a-fond-farewell-to-three-rust-foundation-colleagues/) was read through the authoritative page and omitted as outside this edition's tool focus.

Karatepe's repository and registry checks were inaccessible; no verdict. Registry API access returned 403, while rmcp and Fullbleed package archives downloaded successfully. No stars/download counts refreshed. rmcp's September 28 adoption signal retains its dated origin. Independent runtime interoperability, linker correctness/performance and PDF rendering remain future trial work, explicitly described as proposals.

Workers host execution, Deser migrations, Ying overhead, allocator stabilization and tokio_rcu contracts carry over unchanged. Wild stays Trial; no new comparative benchmark was run. New radar entries: mold Trial, GitHub MCP Server Trial, Fullbleed Assess. rmcp retains Trial with 3.5.1 evidence. Existing names/history and unrelated entries preserved. Recount: **90 = 15 Adopt + 36 Trial + 37 Assess + 2 Hold**.

## Framework map and editorial evaluation

Voice recall used prime_voice for newsletter readability, engineering voice, Lara SLAY/PAS and reader content mix. Project state came from repository and publication artifacts; the project-memory probe returned unrelated context and was not used as evidence.

| Location | Sourced event/problem | Lesson/consequence | Bounded action / reader focus |
|---|---|---|---|
| Lead and rmcp evaluation | PR 1322's missing-resource mapping | HTTP status can change compatible-client bootstrap | Test one unsuccessful call through deployed transport; ending asks for client, SDK and redacted response. |
| Refresh section | Rejected token can be reloaded | Default hook leaves existing store policy unchanged | Test rejection, temporary failure and callback failure. |
| mold section | Rust rewrite changes build packaging | Executable compatibility leaves installation path unresolved | Compare fixed inputs and shipped artifacts in one existing configuration. |
| GitHub MCP section | Schemas depend on negotiated version | Installed server version does not establish advertised tool surface | Pin peer protocol, inspect inventory, start read-only. |
| Fullbleed section | Source corpus retains failures | Compiled template leaves saved output unresolved | Keep one real report's inputs fixed; inspect PDF text, pagination and fonts. |

Two audiences: engineers choosing dependencies and leads reviewing acceptance evidence. Education comes from implementation details; story comes from the documented failure; target-reader actions are concrete integration checks. No invented personal incident, offer or posting cadence. Framework names appear only here. LinkedIn skill governs only the LinkedIn asset.

No-ai-slop evaluation completed against the skill's editing, word, pattern and final-read checks. Pass: sourced claims preserved; first-person opinions and unexecuted trials explicitly scoped; hooks factual; no inflated accusations or fake-profound ending; short paragraphs and useful parallel release lists; no em dashes; no decorative emoji. Factual qualifications about release, API and measurement boundaries remain necessary. What changed: the lead starts with a specific protocol failure; evaluations separate release, maintenance and adoption; proposed checks replace generic leadership framing. The full edited drafts are linked above.

## Verification and publication limits

Actual Next.js route rendered through the site's Markdown pipeline. At 390 × 844, document width and viewport were both 390: no horizontal overflow. Hero and radar loaded with descriptive alt text. The lazy author portrait was not loaded in the initial viewport; this is outside the newsletter body. Screenshot inspected. Radar image inspected separately: 90 labels, current issue/date, four reviewed entries and correct totals.

React Markdown with the site's GFM/raw/highlight plugins generated synchronized HTML. The temporary JS helper used the existing React dependencies because this renderer is JavaScript; it is not a new production tool. Metrics: 2,796 tokenized words, 53 HTML paragraphs, longest 65 words, none over 100, 21 unique links, 21,823-byte source HTML. All source-link targets were read via authoritative routes; registry and discovery failures are recorded above rather than treated as dead links. Canonical article and site-hosted new images require deployment before public sharing.

Substack saved content was reloaded and inspected after the editor settled. Normalized text matches local HTML exactly when block whitespace and smart quotes are normalized; every local source link remains present. Both uploaded images load and retain alt text. Mobile and email browser previews include the ending and correct radar totals; free preview has no paywall after Everyone selection. No email-length warning appeared after saved reload and subsequent preview inspection. This is browser preview verification, not delivered-mailbox testing; no test email was sent.

Git publication was approved October 12 on branch `docs/rust-ai-weekly-16`. Before newsletter or social publication: obtain edition-specific publishing approval; deploy the blog/radar/images and recheck canonical links; review the Everyone audience and delivery options. Keep this Substack draft unpublished until approved. No claim is made that proposed tool trials or mailbox delivery were executed.
