# Issue 19 review pack

November 2, 2026. Status: **publication authorised November 3; blog deployment in progress**. Three evaluations, original artwork, synchronized exports and social copy. The user authorised publication November 3, with the blog first, followed by the newsletter and social launch assets.

## Assets

- [Article](../../apps/web/content/blog/2026-11-02-rust-ai-weekly-19.mdx)
- [Substack draft](https://ddonprogramming.substack.com/publish/post/223140168)
- [Substack HTML](rust-ai-weekly-19-substack.html) and [readability preview](rust-ai-weekly-19-readability.html)
- [Unpublished syndication](rust-ai-weekly-19-syndication.md), with canonical URL and `published: false`
- [LinkedIn copy](rust-ai-weekly-19-linkedin.md) and [connected X thread](rust-ai-weekly-19-x.md)
- [Artwork, alt text, caption and source prompt](rust-ai-weekly-19-artwork.md)
- [Metrics](assets/weekly19-verification/metrics.json) and [source checks](assets/weekly19-verification/source-links.json)
- [Site mobile](assets/weekly19-verification/site-mobile.png) and [local email mobile](assets/weekly19-verification/email-mobile-local.png)

Intended canonical URL: `https://decebaldobrica.com/blog/2026-11-02-rust-ai-weekly-19`. It is not yet a publication check.

## Repository and publication state

Primary checkout is on a merged branch with unrelated edits. Preparation used an isolated detached worktree based on `a3d4ace`, the head of open publication-notes PR #30. No branch, commit or push was made. Chronis task `t-ae21ed` remains in progress because work has not been pushed.

Registered worktrees and the authenticated Substack inventory were checked before creating this edition. Substack shows issue 18 published October 26 and no issue 19 draft before this run. The only existing draft was the editor tutorial. Published issue 18 was not edited. Its local checkout and assets remain intact.

The repository base still contains the issue 17 radar. Issue 19 explicitly carries forward the issue 18 local radar, whose published edition was confirmed in Substack, before adding tar-codec and CGA and updating apalis. Review the issue 18 repository reconciliation before pushing this diff. Historical mentions and unrelated entries are preserved. Counts come from the actual array: 95 tools, 16 Adopt, 36 Trial, 41 Assess, 2 Hold. No new stars or downloads are asserted.

## Report-informed revision

[Newsletter learning and full experiment evidence](newsletter-report-learning.md) records the report corpus, frozen two-candidate autoresearch run, negative control, manual fixes, original/revised copies and separate platform measurement plan. The action-placement proxy changed from 246 to 109 in the runner-selected structural copy; the manually corrected final copies score 111 and have separate hashes. No reach, newsletter outcome or model-behaviour improvement is established. The existing newsletter framework reference now contains this guidance; Monday schedule is unchanged.

## Claim-to-source ledger

Full primary bodies, manifests and licence files were read. Discovery newsletters supplied candidates, not final version evidence. Registry root requests sometimes returned an empty HTTP 200 response; version-specific API records and the official sparse index supplied the version evidence instead. No benchmark or application acceptance plan was executed.

| Claim | Source | Verification and limit |
|---|---|---|
| tar-codec design announced October 27; uv 0.13 default integration | [Astral announcement](https://astral.sh/blog/tar-codec) | Full article read, including framing, extraction and caveats. uv integration is Astral's report, not an independently exercised deployment. Speed comparison omitted. Source-distribution build execution remains outside archive parsing. |
| tar-codec 0.0.15 published October 13 at 17:27:07 UTC, not yanked | [Registry version](https://crates.io/api/v1/crates/tar-codec/0.0.15), [official index](https://index.crates.io/ta/r-/tar-codec) | Version-specific JSON and index agree. Date differs from announcement. No declared rust-version; no MSRV claim. The initial human-facing version URL returned 404 and was replaced with the working API record. |
| Early development warning and supported-family restrictions | [Pinned README](https://github.com/astral-sh/astral-codec/blob/e7ee6c058ac302f50667affa46fa32e84f53cedb/crates/tar-codec/README.md) | README says not production-ready. No V7 decoding, no mixed POSIX/GNU, encoding goals scoped to pax. Main revision e7ee6c0 dated October 30. Separate parsing/extraction policies checked. |
| Commercial eligibility for tar-codec | [Workspace manifest](https://github.com/astral-sh/astral-codec/blob/e7ee6c058ac302f50667affa46fa32e84f53cedb/Cargo.toml), [MIT file](https://github.com/astral-sh/astral-codec/blob/e7ee6c058ac302f50667affa46fa32e84f53cedb/LICENSE-MIT) | MIT OR Apache-2.0 metadata; full MIT permission and notice requirement read. Evaluation selects MIT route, not an assertion that transitive dependencies were audited. |
| CGA inspects monomorphized MIR; compiler options and unreachable paths affect output | [Author walkthrough, October 27](https://tweedegolf.nl/en/blog/242/finding-panics-with-call-graph-analyzer/), [pinned README](https://github.com/OpenDevicePartnership/cga/tree/2fc63108f0b674fe7a178191ffa15647a18879f1) | Full bodies read including fragility, optimizations and build-std caveats. No proof of panic freedom, measured false-positive rate or claim of exact deployed-binary graph. |
| CGA 0.1.0 is source metadata, unpublished; nightly pin | [Manifest](https://github.com/OpenDevicePartnership/cga/blob/2fc63108f0b674fe7a178191ffa15647a18879f1/Cargo.toml), [toolchain](https://github.com/OpenDevicePartnership/cga/blob/2fc63108f0b674fe7a178191ffa15647a18879f1/rust-toolchain.toml) | publish=false; rustc_private. nightly-2026-10-18 and rustc-dev components checked. Source revision dated October 20. No formal package release inferred from version string. |
| CGA blacklist cannot isolate arbitrary linked code | Author walkthrough above | Explicit external-object and assembly exclusion read. Article and social copy preserve distinction from a sandbox. |
| CGA MIT commercial-use route | [Licence](https://github.com/OpenDevicePartnership/cga/blob/2fc63108f0b674fe7a178191ffa15647a18879f1/LICENSE) | Full MIT file read, notice retention required. No independent production adopter verified. |
| apalis 1.0.0 stable, October 12 | [Release](https://github.com/apalis-dev/apalis/releases/tag/v1.0.0), [registry](https://crates.io/api/v1/crates/apalis/1.0.0), [index](https://index.crates.io/ap/al/apalis) | GitHub 06:39:39 UTC; registry 06:42:50 UTC. prerelease=false, not yanked. Rust Bytes wording was not used to date the release. |
| apalis breaking migrations and worker-shutdown work | [Tagged changelog](https://github.com/apalis-dev/apalis/blob/v1.0.0/CHANGELOG.md) | Consistent renames and monitor factory checked. Task generic summaries conflict within changelog; no signature recipe supplied. Retry/idempotency work does not establish exactly-once external effects. Test plans are unexecuted. |
| apalis MSRV and licence limits | [Workspace](https://github.com/apalis-dev/apalis/blob/v1.0.0/Cargo.toml), [component](https://github.com/apalis-dev/apalis/blob/v1.0.0/apalis/Cargo.toml), [MIT file](https://github.com/apalis-dev/apalis/blob/v1.0.0/LICENSE) | Workspace rust-version=1.85, main component does not inherit it; registry field empty. No guaranteed published-package MSRV. MIT OR Apache-2.0 package declaration, full root MIT permission read. Backend features/examples are project documentation, not verified production adoption. |
| Variadic survey concerns hypothetical design | [October 27 results](https://blog.rust-lang.org/inside-rust/2026/10/27/variadic-generics-micro-survey-results/) | Full text read; no chart percentages copied. Pseudocode is not shipped syntax. Bevy sampling caveat retained. No stabilization forecast. |
| Funding paths differ; staffing recruitment planned | [Funding guide](https://blog.rust-lang.org/2026/10/26/how-to-fund-rust-contributors/), [Foundation update](https://rustfoundation.org/media/update-on-rust-foundation-staffing/) | Maintenance/goals/individual support distinguished. October 29 update names David Wood's interim role and future recruitment, not completed hire. No tool verdict inferred. |

Discovery coverage: [This Week in Rust 675](https://this-week-in-rust.org/blog/2026/10/28/this-week-in-rust-675/), Rust Bytes #143 (feed timestamp October 26, 22:50 UTC), Rust project and Foundation blogs, crate registry/index and tagged project files, [Go Weekly 622](https://golangweekly.com/issues/622). Go analyser item is explicitly a proposal; no Go performance or security recommendation copied without primary verification. offline-protocol and other candidates were omitted from evaluated tools because licence/commercial/package detail was insufficiently checked. Fewer evaluations avoid padding.

## Verdict changes

- tar-codec: new Assess, constrained by explicit readiness warning and compatibility work.
- CGA: new Assess, source/nightly analysis with known caveats.
- apalis: Trial retained; release-candidate metadata replaced with dated stable release and migration limits. Original issue 4 mention preserved.
- Issue 18 changes carried forward with their original dates and evidence limits; not represented as newly verified adoption this week.

## Framework map and voice

Issue 13's final readability revision and issue 14's framework map informed structure. Relevant prime_voice nodes were recalled before first-person proposals. ralph-copywriter governs article prose; LinkedIn skill governs only LinkedIn. no-ai-slop applied after structure.

| Placement | Sourced event/problem | Lesson/consequence | Bounded action and reader ending |
|---|---|---|---|
| Lead | Astral announcement plus conflicting readiness/adoption signals | Consumers need an explicit accepted-format contract | Run accepted/rejected corpus before migration; ask which formats the service promises |
| tar-codec | Metadata conventions can yield interpretation differences | Scanner output alone does not verify extraction | Compare named members, filesystem results and rejection reasons |
| CGA | Implicit/dependency panic paths; MIR/profile caveats | Findings require reachability review and configuration context | Positive-control panic, then one explained finding |
| apalis | Stable migration breaks APIs and changes worker lifecycle | Retrying a task leaves external-effect questions | Check post-effect failure, restart and idle shutdown |

Two reader groups: engineers implementing these checks and leads reviewing adoption evidence. Education supplies mechanisms; sourced cases supply context; target-reader actions remain bounded. No offer or invented personal incident. Article ends on one unresolved engineering question rather than a generic leadership lesson.

LinkedIn editorial hypothesis: move the existing archive-compatibility check earlier while preserving source caveats and readable gaps. The November 2 report review supplies 152 Supergrow post rows from 25 reports plus two Buffer reports; five windows are missing and post ages differ. This supports testing an editorial treatment, not a causal claim about performance. Newsletter and X outcomes require their own baselines. See the indexed report-learning document for original/revised copy and measurement limits.

## What changed in the editing pass

The complete edited text is linked under Assets. The lead stays on archive acceptance; other tools retain independent arguments. Paragraphs stay short, repeated framing is limited, tool runs are explicitly proposals, and date/license/readiness caveats remain near verdicts. No benchmark numbers, invented personal experience, inflated incident claim or closing aphorism.

no-ai-slop evaluation: editing principles 1–11 pass; words-to-cut check pass; patterns 1–9 pass; final-read 1–4 pass. Detect-only check is not applicable. This records an editorial review, not an AI-authorship score.

## Verification and remaining approval

- Initial Next.js article route rendered the title, November 2 date, all sections and 95-tool radar before the report-informed revision. Both edition images loaded with descriptive alt text. Final revised full-site pass completed November 3 after compiler contention cleared: HTTP 200, final action and ending present, 22 list items, both edition images loaded, mobile width/scroll width 390. The revised HTML uses the same react-markdown, remark-gfm, rehype-raw and rehype-highlight pipeline declared in the site route.
- Initial site and final revised local HTML email preview tested at 390 × 844: scroll width 390, no horizontal overflow. Screenshots inspected. This is browser layout testing, not delivered-mailbox testing.
- All 14 unique source links in the article returned nonempty HTTP 200 after correcting the registry link. API metadata and source bodies, rather than HTTP status alone, supplied claim verification.
- MDX generated the matching Substack HTML, local readability HTML and canonical unpublished syndication. X weighted lengths are 206, 137, 242, 264, 232 and 262, counting URLs at 23 characters; no decorative non-ASCII characters in post text. Six posts form one ordered reply chain when approved.
- Substack draft 223140168 saved and reloaded after the final editing pass. Normalized body matches the local uploaded HTML exactly (15,159 text characters before normalization). Both edition images load with matching alt text. [Saved-content evidence](assets/weekly19-verification/substack-saved.json).
- Native full paid-subscriber Mobile and Email previews show the article and its ending. [Mobile proof](assets/weekly19-verification/substack-mobile.png), [email proof](assets/weekly19-verification/substack-email.png). The editor was allowed to settle after save/reload; no email-length or clipping warning appeared. This is not delivered-mailbox testing. Audience remains the editor's paid-only default; no audience or publication action was taken.
- Final revised prose contains 2,323 whitespace-delimited words, with no paragraph over 100 words and maximum paragraph length 66. The shorter issue reflects three fully evaluated tools. The report-informed revision moves the existing action after the source case and separates parallel status signals. Original artwork and radar are unchanged. The runner-selected copy and manually corrected final copy are distinguished by hashes and separate checks.
- `git diff --check` passes. Initial actual route returned HTTP 200 after compiling successfully; final revised full-site pass completed November 3. Existing browser-data age warnings appeared in the development server; no dependency update was included in this content change.

Publication authorised November 3, blog first, then other channels. Before sending: verify deployed canonical and images; review this draft, reconcile issue 18 repository state, authorise branch/commit/push on the live PR surface, verify deployed canonical and image URLs, choose Substack audience and approve send/social publication for issue 19. Nothing was published or scheduled by this run.
