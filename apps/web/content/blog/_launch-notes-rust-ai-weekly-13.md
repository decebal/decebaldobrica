# Launch pack — Rust & AI Weekly #13

Live URL (after push): https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13
Source file: `apps/web/content/blog/2026-09-21-rust-ai-weekly-13.mdx`
Canonical for syndication (dev.to / Hashnode / Medium): same URL.

## Publishing preparation (2026-09-22)

The user authorized pushing the article and preparing social publishing. Earlier verification-only restrictions below describe the previous pass.

- Delivery branch: `codex/rust-ai-weekly-13`, through a single-commit PR under repository rules.
- Substack review draft: https://ddonprogramming.substack.com/publish/post/216861797
- Substack paste source: `docs/social/rust-ai-weekly-13-substack.html`, with both images, complete formatting and absolute links.
- Syndication source: `docs/social/rust-ai-weekly-13-syndication.md`, with `published: false`, canonical URL and the new 3D cover.
- X: hook and three replies below are ready; counts are 251, 268, 248 and 248 with URLs counted as 23. Attach the issue card to the hook; publish replies in order after the hook.
- LinkedIn: primary post and licence-angle alternative below are ready. Primary uses the hook card; alternative uses the issue card. Use only one at launch.
- dev.to: import the syndication Markdown as a draft; retain `canonical_url` and `published: false` until review.
- Hashnode: use the Markdown body, 3D cover and four tags; set the original-article/canonical field to the portfolio URL before publishing.
- Medium: import the live portfolio URL after deployment, then check title, both images, formatting and canonical attribution.
- daily.dev Squad: prepare a link submission to the portfolio article, with the edition title and issue card. Select the intended Squad at posting time.
- r/rust and TWiR: use the blurb below; check the destination's current submission rules and deduplicate before submitting.

Publication order remains Substack first, then X and LinkedIn, then syndication and community submissions. This preparation does not authorize sending the newsletter, publishing social posts or scheduling them.

Assets:
- 3D editorial hero: `apps/web/public/images/blog/2026-09-21-rust-ai-weekly-13-3d-hero.png` (1672 × 941). Caption: “The counters looked fine. The queue told another story.”
- Radar image: `apps/web/public/images/radar/2026-09-21-radar.png` (80 tools, issue #13)
- Issue card (X / LinkedIn / OG): `docs/social/rust-ai-weekly-13-card.png` (source: `rust-ai-weekly-13-card.svg`); 1250px copy at `apps/web/public/images/social/2026-09-21-rust-ai-weekly-13.png`
- Hook card (standalone LinkedIn/X image for the "thought for the week"): `docs/social/the-counters-looked-fine.png` (source: `the-counters-looked-fine.svg`)
- SEO: `seoTitle` "Rust & AI Weekly #13: dial9, Tokio telemetry, zenjpeg" and a seoDescription are set in frontmatter. Read-only scorer ran September 22: 74/100, 4,370 words. It flags title/description length, heading keyword coverage and long prose; the verified editorial copy was preserved.

Ring counts this issue: 14 Adopt · 33 Trial · 31 Assess · 2 Hold (80 total).

---

## Substack (draft only — never publish from automation)

**Title:** Rust & AI Weekly #13: the counters looked fine

**Subtitle (full, 3-hook formula):** Today's issue: dial9 records what Tokio is actually doing in production and no longer needs tokio_unstable to do it, the Rust project warns that prominent maintainers are being targeted through fake job calls, and This Week in Rust's Crate of the Week is a JPEG codec most companies cannot use without a licence conversation.

**Subtitle (≤200 chars, Substack cap, learned at #12):** Today's issue: dial9 makes Tokio's scheduling visible in production, the Rust project warns maintainers about fake job calls, and a Crate of the Week with an AGPL catch.

**Body:** paste the HTML below into the ProseMirror editor (it parses h2s, bold links, inline code, and italics cleanly). The 3D hero appears first, before its caption and the welcome paragraph. If the image does not import, upload the hero PNG from Assets at that position; its public URL becomes available after Decebal pushes. Radar image: drop the PNG onto the placeholder line, then re-check placement.

```html
<p><img src="https://decebaldobrica.com/images/blog/2026-09-21-rust-ai-weekly-13-3d-hero.png" alt="3D cutaway of a graphite flight recorder: green status lights above copper event channels, with a queue stalled inside." /></p>
<p><em>The counters looked fine. The queue told another story.</em></p>
<p>A service at AWS was falling over at 90% CPU. Tokio's metrics showed idle workers and full queues. Russell Cohen built dial9 to see what happened between those measurements.</p>
<p>This week's <strong>Rust &amp; AI Weekly</strong> covers dial9's 0.5 release, a warning about attacks on Rust maintainers, and five more dependency evaluations. Each crate has a verdict, release status, and the caveats I would check before using it.</p>
<p><em>Public signals checked September 22, 2026. Stars and downloads are approximate.</em></p>
<p>[[[ DROP 2026-09-21-radar.png HERE; use the caption and radar link below ]]]</p>
<p><em>Six entries this week: three new and three updates. The radar now covers 80 tools: 14 Adopt, 33 Trial, 31 Assess and 2 Hold. <a href="https://decebaldobrica.com/radar">Explore the interactive version</a>.</em></p>
<h2>The week's anchor</h2>
<p>On September 17, Adam Harvey published <a href="https://blog.rust-lang.org/2026/09/17/targeted-attacks/">Be alert: targeted attacks on prominent Rustaceans</a> for the crates.io team and security response working group. Attackers are targeting rust-lang members and owners of popular crates to compromise their machines and publish malware through their accounts.</p>
<p>The approach starts with a video call about a job, contract, or collaboration. During the call, the target is asked to install a “missing audio codec” or run a command placed on their clipboard. The attackers create plausible company profiles, including a LinkedIn presence, to survive a cursory check.</p>
<p>The post links Matt Mastracci's June account of similar attempts and notes that August's <a href="https://blog.rust-lang.org/2026/08/20/supply-chain-attack-on-arrayref/">arrayref compromise</a> used a similar route. Whether these belong to one campaign is unknown. The pattern is documented as DPRK tradecraft and crosses ecosystems; Go Weekly carried the alert on September 18.</p>
<p>For maintainers, the Rust team's advice is concrete:</p>
<ul>
<li>Set up the call yourself, on a platform you already use.</li>
<li>Recheck MFA and account login history.</li>
<li>Report concerns to help@crates.io or security@rust-lang.org.</li>
</ul>
<p>The supply-chain tools covered in recent issues, including cargo-vet, cargo-acl and publish-age delays, operate on releases and builds. They do not protect a maintainer's machine during a call.</p>
<p>For consumers, the controls from <a href="https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10">issue #10</a> still help: delay fresh releases and check build-time capabilities. They can limit exposure to a compromised release, including an unexpected socket opened by a build script.</p>
<h2>Pick of the week</h2>
<p><a href="https://github.com/dial9-rs/dial9"><strong>dial9 0.5.1</strong></a> — a flight recorder for Tokio. <strong>Trial.</strong></p>
<p>Cohen's AWS investigation found an 18-millisecond gap between Tokio asking the kernel to wake worker 47 and the worker being scheduled. The event trace exposed a delay the aggregate metrics could not explain.</p>
<p>dial9 records poll starts and stops, worker park and unpark events with kernel timestamps, and wake causality. It also captures sampled allocations and liveset tracking, frame-pointer CPU profiles, <code>tracing</code> spans, <code>getrusage</code>, and TCP accept-queue depth. Output goes to a rotating disk or memory buffer, or S3.</p>
<p>The project's <a href="https://tokio.rs/blog/2026-03-18-dial9">March introduction</a> described overhead as typically under 5%. That is the project's measurement; I have not independently verified it for another workload.</p>
<h3>What changed in 0.5</h3>
<p>Version 0.5.0 shipped on August 26. The crate was renamed from <code>dial9-tokio-telemetry</code> to <code>dial9</code>, and Tokio became one <code>Source</code> among several. The profilers no longer depend on Tokio.</p>
<ul>
<li><strong>Native spans:</strong> <code>dial9_span!</code> and a Tower layer can record spans without going through your tracing subscriber.</li>
<li><strong>Trigger mode:</strong> keep a ring buffer and flush when your code detects a problem.</li>
<li><strong>Multi-trace analysis:</strong> aggregate flamegraphs and span histograms across files and hosts, then compare slow operations with fast ones.</li>
</ul>
<p>The <a href="https://github.com/dial9-rs/dial9/releases">0.5.1 release notes</a>, dated September 17, add system information in trace segments, FreeBSD telemetry, and off-CPU and spawn-to-first-poll points of interest. Fixes cover task dumps, rotation, and liveset reallocations.</p>
<p>There is also API migration work: <code>RecorderSourceExt</code> methods are deprecated in favour of inherent <code>RecorderBuilder</code> methods. Sealing the extension traits is marked as breaking.</p>
<h3>Running without unstable hooks</h3>
<p>dial9 0.5 works without <code>tokio_unstable</code>, with reduced coverage. Task spawn and terminate events and per-worker queue depth still need runtime hooks. Poll coverage is limited to tasks started through dial9's own spawn helpers.</p>
<p>That gives a platform team a way to evaluate it without a rustflags exception. Check those coverage limits against the incident you need to investigate.</p>
<p>Cohen's <a href="https://dial9-rs.github.io/blog/principles-for-fast-tokio-applications/">Principles for fast Tokio applications</a>, written after the RustConf Unconf and listed in TWiR 669, is the companion read. Start from a real metric, inspect schedule latency, batch for throughput, and yield for latency. Keep contended <code>std</code> mutex sections short, such as a hashmap update, and reserve cores for the runtime.</p>
<p>His mini-Redis example reports p99 falling from 2.548 ms to 0.320 ms after yielding every four consecutive ready reads. Those are the author's results. The post is a first draft and accepts PRs.</p>
<ul>
<li><strong>Maintenance:</strong> Russell Cohen and Jess Izen, with Carl Lerche also a crates.io co-owner. Eighteen named contributors on 0.5, including David Tolnay. Apache-2.0; about 500 stars and 534 commits.</li>
<li><strong>Latest:</strong> 0.5.1, September 17. About 750k downloads under the old crate name.</li>
<li><strong>Adoption:</strong> Trial. AWS services were early adopters; Ditto runs the CPU profiler on production Android behind a flag. Budget for the 0.3-to-0.5 migration and <code>force-frame-pointers</code> for profiling. Exit cost is low because telemetry is outside the application's data path.</li>
</ul>
<h2>Codecs</h2>
<p><a href="https://github.com/imazen/zenjpeg"><strong>zenjpeg 0.8.4</strong></a> — TWiR 669's Crate of the Week, suggested by Kornel. <strong>Assess.</strong></p>
<p>Lilith River at Imazen started with a port of Google's jpegli, then rewrote it six times into an independent pure-Rust JPEG encoder and decoder. It uses <code>#![forbid(unsafe_code)]</code>, with SIMD through archmage's safe-token API.</p>
<p>For an image-ingestion service, the useful features are single-pass streaming with bounded memory, decode limits on pixels and bytes, and cooperative cancellation. The codec also supports parallel decoding with restart markers, adaptive and trellis quantization, XYB, UltraHDR gain maps, and JPEG-to-JPEG recompression.</p>
<h3>Performance and licence</h3>
<p>The author publishes a pinned-commit reproduction on a Ryzen 9 7950X. I have not rerun these benchmarks:</p>
<ul>
<li>Baseline decode: 0.94x libjpeg-turbo.</li>
<li>Progressive decode: 1.35x faster, attributed to the fused pipeline.</li>
<li>Parallel decode of a 4096px image: 13% of the C implementation's time.</li>
<li>Encode: beats mozjpeg at matched file size on 81% of a 337-photo corpus.</li>
</ul>
<p>The README discloses development with Claude and more than 930 tests against the C++ reference.</p>
<p>zenjpeg is AGPL-3.0 or commercial. The commercial offer includes a $1 startup licence for businesses under $1M revenue with fewer than five employees, then a sliding-scale subscription. Read LICENSE-COMMERCIAL for eligibility and obligations.</p>
<p>River has maintained the broader Imazen ecosystem full-time since 2011; the dual licence funds that work. For a company evaluation, the licensing decision comes before the benchmark comparison. The decoder API is also marked prerelease, with breaking changes expected.</p>
<ul>
<li><strong>Maintenance:</strong> actively developed, effectively solo but funded, by Lilith River / Imazen. 2,599 commits; 15 stars.</li>
<li><strong>Latest:</strong> 0.8.4, June 1, 2026; the fourteenth GitHub release. Formerly published as jpegli-rs.</li>
<li><strong>Adoption:</strong> Assess. Check commercial terms and tolerance for decoder API changes. zune-jpeg, with 0.5.16-rc2 released September 8, and the image crate remain permissively licensed alternatives.</li>
</ul>
<h2>SIMD</h2>
<p><a href="https://github.com/linebender/fearless_simd"><strong>fearless_simd 1.0.0</strong></a> — final 1.0 shipped September 21, alongside <code>fearless_simd_macros</code> 0.1.0. <strong>Trial</strong>, unchanged from <a href="https://decebaldobrica.com/blog/2026-08-17-rust-ai-weekly-8">issue #8</a>.</p>
<p>The <a href="https://linebender.org/blog/fearless-simd-0-7/">August 0.7 post</a> targeted early September if no API concerns emerged. It expected no further breaking changes, but did not promise an API freeze. Two breaking release candidates followed: rc.1 on September 13 and rc.2 on September 19, released by LaurenzV with Shnatsel writing nearly every change.</p>
<h3>Migration from 0.7</h3>
<ul>
<li><strong>rc.1:</strong> <code>N</code> became <code>LEN</code>; the <code>as_array</code> family now follows <code>std::simd</code>; <code>abs</code> moved to <code>SimdBase</code>, making it available for integers.</li>
<li><strong>Reductions:</strong> <code>reduce_sum</code>, <code>reduce_product</code>, <code>reduce_min</code> and <code>reduce_max</code>, plus precise min/max variants. Floating-point sum and product use a fixed evaluation order and agree across backends for the same vector type and lane count, except for NaN bit patterns.</li>
<li><strong>Fused arithmetic:</strong> <code>mul_add_precise</code> guarantees single rounding, including without hardware FMA.</li>
<li><strong>rc.2:</strong> <code>witness()</code> became <code>token()</code> on the new <code>ExtractToken</code> supertrait. The companion macros crate adds <code>#[simd]</code> to run a generic function body with the appropriate target features.</li>
</ul>
<p>Two support commitments are worth including in an evaluation. Vector storage representation is documented and will change only with a semver major. From 1.0, the latest release for each MSRV receives security backports for at least three years after that Rust version shipped.</p>
<ul>
<li><strong>Maintenance:</strong> Linebender; Shnatsel writing, LaurenzV releasing. About 458 stars; MIT OR Apache-2.0.</li>
<li><strong>Latest:</strong> 1.0.0, September 21. Requires Rust 1.89.</li>
<li><strong>Adoption:</strong> Trial. Evaluate final 1.0 and test the 0.7 migration against the API changes above. This closes the 1.0 carry-over from issue #11.</li>
</ul>
<h2>Concurrency</h2>
<p><a href="https://github.com/roeeshoshani/tokio_rcu"><strong>tokio_rcu 0.2.1</strong></a> — Roee Shoshani shipped 0.2.0 on September 15 and 0.2.1 on September 17. <strong>Assess.</strong></p>
<p>The <a href="https://github.com/roeeshoshani/tokio_rcu/commits/master/">commit history</a> and versioned docs clarify what changed. <code>rcu_block_on</code> and <code>enable_rcu</code> already existed in <a href="https://docs.rs/tokio_rcu/0.1.3">0.1.3</a>. The API rename was <code>rcu_ptr::RcuPtr</code> to <code>rcu_box::RcuBox</code>.</p>
<p>Version 0.2 removed per-thread live-guard reader bookkeeping and added <code>include_calling_thread</code> to <code>synchronize_rcu</code>. Version 0.2.1 tightened <code>RcuBox</code>'s <code>Sync</code> bound to require <code>T: Send + Sync</code>, fixed a stall involving blocking tasks, and added branch hints.</p>
<h3>Reading the new benchmarks</h3>
<p>The refreshed i7-12700 table reports mean read-only times of 2.166–3.496 ms for <code>RcuBox</code>, versus 23.87–132.9 ms for arc-swap, across 1, 8, 16, 32 and 64 tasks. The README describes reads as 9–40 times faster and writes as twice as slow.</p>
<p>These are the author's results; I have not rerun them. Last week's three-times-faster figure came from the previous README. The new table compares against arc-swap, so it does not establish a 9–40-times gain over 0.1.3.</p>
<p><a href="https://github.com/roeeshoshani/tokio_rcu/pull/6">PR 6</a> renamed existing Divan benchmark functions after the implementation changed. That diff preserved their workloads; it did not introduce a new harness.</p>
<p>The <a href="https://docs.rs/tokio_rcu/0.2.1">0.2.1 docs</a> still require <code>tokio_unstable</code>. Unlike dial9's optional telemetry hooks, tokio_rcu relies on <code>on_after_task_poll</code> for its correctness argument. That keeps it at Assess.</p>
<ul>
<li><strong>Maintenance:</strong> new, solo project by Roee Shoshani; MIT. Stars rose from 8 to 38 and commits from 157 to 226 this week.</li>
<li><strong>Latest:</strong> 0.2.1, September 17.</li>
<li><strong>Adoption:</strong> Assess, unchanged. The required hook remains unstable; a Tokio team answer to last week's question is still unverified.</li>
</ul>
<h2>GUI</h2>
<p><a href="https://slint.dev/blog/slint-1.18-released"><strong>Slint 1.18</strong></a> — the toolkit covered in <a href="https://decebaldobrica.com/blog/2026-07-08-rust-ai-weekly-3">issue #3</a> released 1.18.0 on September 16, listed in TWiR 669. <strong>Trial.</strong></p>
<p><code>FlexboxLayout</code> brings wrapping items and a CSS-familiar layout API into the Slint DSL. The rest of the release covers several parts of a native app:</p>
<ul>
<li><strong>Layout and motion:</strong> runtime z-order changes, spring animations, and animation and orientation along a path.</li>
<li><strong>Models and windows:</strong> array and model <code>push</code>, <code>remove</code> and <code>insert</code>, custom struct-field defaults, and <code>WindowMoveArea</code> for custom title bars.</li>
<li><strong>Accessibility and rendering:</strong> screen-reader support for text inputs and an experimental Vello renderer.</li>
<li><strong>Performance:</strong> leaner compiler output for faster builds and smaller binaries, plus faster large-text rendering and editing.</li>
</ul>
<p>Slint's built-in MCP server lets an agent drive a running UI. That remains its relevance here for embedded and desktop applications. The tri-licence still needs a legal read.</p>
<ul>
<li><strong>Maintenance:</strong> SixtyFPS GmbH, with NLnet-funded features. About 23.9k stars.</li>
<li><strong>Latest:</strong> 1.18.1, September 21. The features above arrived in 1.18.0 on September 16.</li>
<li><strong>Adoption:</strong> Trial, unchanged from issue #3.</li>
</ul>
<h2>Data plumbing</h2>
<p><a href="https://github.com/jugglerchris/rust-html2text"><strong>html2text 0.17.1</strong></a> — Chris Emerson's Rust HTML-to-text converter, maintained since 2016. <strong>Trial.</strong></p>
<p>It parses with html5ever and runs a layout pass: tables keep their columns, lists keep their structure, links receive numbered footnotes, and text wraps to a chosen width. Rich and coloured output modes serve terminals.</p>
<p>For RAG ingestion, that can preserve information a text flattener loses. A pricing table rendered as aligned columns retains relationships between plans and prices.</p>
<p>Go Weekly 618 listed <a href="https://github.com/k3a/html2text">k3a/html2text 1.5</a>, a zero-dependency Go converter. That prompted this Rust pairing. The draft's separate lib.rs trending claim remains unverified: html2text is absent from the <a href="https://lib.rs/new">current list</a>.</p>
<ul>
<li><strong>Maintenance:</strong> Chris Emerson / jugglerchris, with other contributors; one primary maintainer. MIT; about 245 stars.</li>
<li><strong>Latest:</strong> 0.17.1, April 19, 2026. About 6.1 million all-time crates.io downloads and about 521,000 per month on <a href="https://lib.rs/crates/html2text">lib.rs</a>.</li>
<li><strong>Adoption:</strong> Trial. Account for reliance on one primary maintainer and API changes between 0.x minor versions.</li>
</ul>
<h2>Language watch</h2>
<p><code>Allocator</code> is close to stabilization. <a href="https://github.com/rust-lang/rust/pull/156882">PR 156882</a> by nia-e finished its final comment period with a disposition to merge, but remained open on September 22. The trait supports custom allocators for <code>Box</code>, <code>Vec</code> and related types and has been unstable since 2020. It would make last week's allocator survey relevant beyond nightly.</p>
<h3>Merged</h3>
<ul>
<li><code>core::mem::DropGuard</code>: <a href="https://github.com/rust-lang/rust/pull/161520">PR 161520</a>, Yoshua Wuyts, September 13. Closes last week's FCP item.</li>
<li><code>Vec::from_fn</code>: <a href="https://github.com/rust-lang/rust/pull/162685">PR 162685</a>, September 12.</li>
<li><code>unsafe_cell_access</code>: <a href="https://github.com/rust-lang/rust/pull/162504">PR 162504</a>, September 14.</li>
<li>RISC-V <code>d</code> and <code>f</code> target features: <a href="https://github.com/rust-lang/rust/pull/161385">PR 161385</a>, Ralf Jung, September 13.</li>
<li><code>cargo install</code> uses the packaged lockfile by default: <a href="https://github.com/rust-lang/cargo/pull/17388">PR 17388</a>, also confirmed in TWiR's Cargo list.</li>
</ul>
<p>Separately, <code>Thread::os_id</code> merged September 9 in <a href="https://github.com/rust-lang/rust/pull/160219">PR 160219</a> as an unstable API. It was not stabilized.</p>
<h3>In final comment period</h3>
<ul>
<li><code>funnel_shifts</code>, including <code>const</code>: <a href="https://github.com/rust-lang/rust/pull/161015">PR 161015</a>.</li>
<li><code>Result::into_ok</code> and <code>into_err</code>: <a href="https://github.com/rust-lang/rust/pull/161712">PR 161712</a>.</li>
<li>WebAssembly <code>wide-arithmetic</code>: <a href="https://github.com/rust-lang/rust/pull/160877">PR 160877</a>, Alex Crichton.</li>
<li>Cargo's <code>build.profile</code> and <code>install.profile</code> config keys: <a href="https://github.com/rust-lang/cargo/pull/17215">PR 17215</a>, Ed Page. These allow a custom default profile without a command wrapper.</li>
</ul>
<p>The 8-byte <code>RawWakerVTable</code> alignment guarantee, <a href="https://github.com/rust-lang/rust/pull/158186">PR 158186</a>, finished FCP with disposition merge and remained unmerged.</p>
<p><a href="https://github.com/rust-lang/rustc-perf/blob/master/triage/2026/2026-09-14.md">Kobzol's September 14 compiler-performance triage</a> reports zero primary regressions and 199 primary improvements, with mean instruction counts down 0.7%. Several improvements revert earlier regressions. <a href="https://github.com/rust-lang/rust/pull/162422">PR 162422</a> brings Polonius closer to the old NLL borrow checker's speed.</p>
<h2>In brief</h2>
<ul>
<li>
<p><a href="https://rustfoundation.org/media/guest-post-rust-is-tier-1-language-at-microsoft/"><strong>Rust is a Tier-1 language at Microsoft</strong></a> — Victor Ciura's September 10 post places Rust alongside C++, C# and TypeScript for internal development. The <code>rustc_codegen_utc</code> backend emits through MSVC, has been production-ready since early 2026 and self-hosting since Rust 1.90, and is used by more than 100 Microsoft repositories. Rust Bytes #136 also covered it.</p>
</li>
<li>
<p><a href="https://rustfoundation.org/media/rust-foundation-announces-solana-foundation-and-nvidia-as-platinum-members/"><strong>Solana Foundation and NVIDIA join the Rust Foundation as Platinum members</strong></a> — announced September 9, during the RustConf week of NVIDIA's CUDA Rust commitment.</p>
</li>
<li>
<p><a href="https://www.amazon.science/blog/developing-provably-correct-rust-code-with-verus"><strong>Developing provably correct Rust code with Verus</strong></a> — Bryan Parno on the SMT-backed verifier listed as “under review” in <a href="https://decebaldobrica.com/blog/2026-09-07-rust-ai-weekly-11">issue #11</a>'s std-verification coverage.</p>
</li>
<li>
<p><a href="https://blog.goose.love/posts/making-a-clippy-lint-faster-by-3133x/"><strong>Optimizing a single Clippy lint by 3133x</strong></a>, Alejandra González. Also linked in Rust Bytes #136.</p>
</li>
<li>
<p><a href="https://ai-coustics.com/blog/libpatcher"><strong>Shipping Rust static libraries without symbol collisions</strong></a>, Stephan Eckes at ai-coustics. Their Rust audio SDK hit bundled-symbol collisions; the draft's specific <code>ring</code> attribution remains unverified.</p>
</li>
<li>
<p><a href="https://mversic.github.io/co3/"><strong>CO3: Toward the Optimal FFI</strong></a>, mversic.</p>
</li>
<li>
<p><a href="https://rust-glancer.github.io/blog/why-lsp-is-hard/"><strong>Why building a Rust LSP is hard</strong></a>, the Rust Glancer project.</p>
</li>
<li>
<p><a href="https://akesson.io/a-visual-guide-to-rust-async/"><strong>A visual guide to Rust async</strong></a>, Henrik Åkesson. A pairing for dial9's principles post.</p>
</li>
<li>
<p><a href="https://bitfieldconsulting.com/posts/operators-of-death"><strong>Operators of death: checked arithmetic in Rust</strong></a>, John Arundel.</p>
</li>
<li>
<p><a href="https://kerkour.com/rust-generics"><strong>Rust generics: from static to dynamic dispatch</strong></a>, Sylvain Kerkour.</p>
</li>
<li>
<p><a href="https://jsgroth.dev/blog/posts/trying-to-make-a-loop-auto-vectorize/"><strong>Trying to make a loop auto-vectorize</strong></a>, jsgroth. Read alongside fearless_simd.</p>
</li>
<li>
<p><a href="https://flakm.com/posts/sqlx_migration_wrapper_til/"><strong>One Lock to Rule Them All</strong></a>, FlakM, on a PostgreSQL advisory-lock wrapper inspired by sqlx migrations.</p>
</li>
</ul>
<p>The draft also listed wasmtime, clap, crypto-bigint, cudarc, syd, picoserve, postcard-rpc and vello from lib.rs's notable releases. That historical list remains unverified; the live list changed, and I did not check those releases individually.</p>
<h2>Elsewhere</h2>
<h3>Native editors</h3>
<p>Go Weekly 618 led its tools section with <a href="https://rune.build/blog/rune-is-now-open-source">Rune</a>, Ernest Romero Climent's native IDE on a fork of Ebitengine. It is now GPLv3, with about a thousand stars. The engineering write-up describes bringing its integrated terminal close to Alacritty and Ghostty speed without cgo on the hot path.</p>
<p>The Rust pairing is Zed, at Adopt since <a href="https://decebaldobrica.com/blog/2026-06-19-rust-ai-weekly-1">issue #1</a>. Its GPUI renderer serves the same role through a different implementation.</p>
<h3>Wasm translated to native source</h3>
<p><a href="https://github.com/goccy/wasm2go">goccy/wasm2go</a>, by Masaaki Goshima, translates a Wasm binary into standalone Go source plus amd64 and arm64 assembly. The older <a href="https://github.com/ncruces/wasm2go">ncruces/wasm2go</a> powers cgo-free go-sqlite3. Both address shipping a C library built with the WASI SDK without bundling a Wasm engine.</p>
<p>The Rust project checked here is hirosassa's <a href="https://crates.io/crates/wasm2rs">wasm2rs</a>, at 0.1.1 from August with a few dozen downloads. A mature Rust counterpart remains an unverified research lead: checking these projects does not establish the absence of alternatives.</p>
<h3>Newsletter coverage</h3>
<p><a href="https://golangweekly.com/issues/618">Go Weekly 618</a> carried the Rust maintainer alert on September 18 and the Go html2text pairing covered above.</p>
<p><a href="https://weeklyrust.substack.com/p/rust-debugging-survey-findings">Rust Bytes #136</a>, dated September 15, led with the debugging survey and spotlighted rust-smallvec. Its roundup included Microsoft Tier-1, Cargo team changes, Rustls, Dioxus and the Clippy optimization. It remained the latest issue in the archive on September 22.</p>
<p>Its full body contained none of this issue's six crate entries or the dial9 principles post. It also predates the September 17 maintainer alert, so that omission says nothing about how quickly Rust readers heard the warning.</p>
<h2>A thought for the week</h2>
<p>dial9's AWS example is a reason to test event recording before an incident. Start with a service where schedule latency matters. Measure the recorder's overhead and check what trigger mode retains when the service slows down.</p>
<p>Two dependency-review tasks follow from this issue: read the actual licence terms for zenjpeg or Slint, and include fearless_simd's written security-backport window in the maintenance evaluation. A registry badge alone does not answer either question.</p>
<p>For maintainers with publish rights, the Rust team's immediate recommendation is to arrange unsolicited calls yourself on a platform you already use.</p>
<h2>Before I go</h2>
<p>The fearless_simd 1.0 carry-over is closed. tokio_rcu's required hook remains unstable, and a Tokio team response is still unverified.</p>
<p>RustConf recordings were not published where I could find them during this check. Melih Elibol's and Joe Birr-Pixton's talks remain the pairings to add when available.</p>
<p>I'd like to hear from readers running dial9 in production, especially outside AWS: what overhead did you measure, and did trigger mode change how much you keep?</p>
<p>If your team evaluated an AGPL-or-commercial Rust dependency, what did legal need, and how long did the review take? Reply with that experience, or a Rust+AI crate to consider for next week.</p>
<p>Keep shipping,<br />
Decebal</p>
```

---

## X hook (251 chars; URL counted as 23)

Attach: `docs/social/rust-ai-weekly-13-card.png`

> Your Tokio metrics said workers were idle AND queues were full.
>
> The kernel took 18 ms to wake a worker. Counters missed it.
>
> dial9 0.5 records events, now without tokio_unstable if narrower task coverage works for you. Trial.
>
> https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13

### X thread replies (optional, post in order; URLs counted as 23)

**Reply 1 — the alert (268 chars)**

> The Rust project warns prominent maintainers are being targeted through friendly video calls about jobs, then asked to install a missing audio codec.
>
> An audited dependency cannot protect a maintainer's machine. Set up the call yourself, on a platform you already use.

**Reply 2 — zenjpeg (248 chars)**

> This Week in Rust's Crate of the Week is zenjpeg: pure Rust, forbid(unsafe_code), an ambitious JPEG encoder and decoder.
>
> AGPL or commercial, clearly listed on the registry. Read the terms, then the benchmarks. Decoder API still prerelease. Assess.

**Reply 3 — fearless_simd (248 chars)**

> fearless_simd planned no more API breaks in August. Two breaking RCs followed; final 1.0 shipped September 21.
>
> Security backports: latest release per MSRV, for at least three years after that Rust version shipped.
>
> Trial holds. Test the migration.

## LinkedIn hook

Superseded after the author's September 22 readability review. Use the [corrected published copy](../../../../docs/social/rust-ai-weekly-13-linkedin.md). The original below is retained as a record of the rejected draft, not for reuse.

Attach: `docs/social/the-counters-looked-fine.png`

> Your dashboards are why your incidents take so long.
>
> Not because they are wrong. Because the review stops at them. Green means "nobody looked further." This week the Rust ecosystem gave me four examples of a summary saying healthy while the record said otherwise.
>
> A service at AWS fell over at 90% CPU. The runtime metrics said the workers were idle and the queues were full, at the same time. Both were true. The cause, an 18 millisecond gap between the runtime asking the kernel to wake a worker and the worker waking, lives below the resolution of any counter. Russell Cohen built a flight recorder to see it. That tool, dial9, shipped 0.5.1 on September 17 and I rated it Trial.
>
> The Rust project published an alert that prominent maintainers are being targeted through video calls about jobs and contracts, using freshly built company profiles that pass a glance. A LinkedIn page is a counter: it summarises a company into a plausibility score, and the attackers now clear that bar on purpose.
>
> The community's Crate of the Week is an ambitious pure-Rust JPEG codec. Its registry page correctly says AGPL or commercial. The badge names the choices; the terms explain what choosing one requires.
>
> A SIMD library planned no further API breaks in August. September produced two breaking release candidates, then final 1.0 on September 21. The plan described intentions; the release history is the record.
>
> The leadership lesson is not "trust nothing." It is a habit: when the summary and the symptom disagree, go get the log. The trace, the git history, the LICENSE file, a five-minute check that the recruiter's company existed last quarter. It is slower per question and much faster per incident.
>
> Three concrete moves from this week's issue: put an event recorder in your async services before the incident, because you cannot install it during one; make "read LICENSE and SECURITY.md" separate checklist items from "check the licence badge"; and if you hold publish rights on anything people depend on, set up every unsolicited call yourself, on your own platform.
>
> Issue #13, with verdicts and a live radar of 80 Rust and AI crates rated Adopt/Trial/Assess/Hold:
>
> https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13

### Alternate LinkedIn post (the licence angle — use mid-week, or if the observability angle underperforms)

Attach: `docs/social/rust-ai-weekly-13-card.png`

> Two of the six crates in this week's issue are ones your legal team gets a vote on, and I think that is the healthiest thing in it.
>
> zenjpeg is a pure-Rust JPEG encoder and decoder with no unsafe code, developed by Lilith River, who has maintained an image-processing ecosystem full-time since 2011. It is AGPL-3.0, or you buy a commercial licence: one dollar if you are under a million in revenue and have fewer than five employees, a sliding scale above that. Slint, the GUI toolkit with an MCP server built in, also offers a choice of licences.
>
> Last week I asked you to write down who pays for each dependency. Most of the time the honest answer is "nobody, and we hope." A dual licence is the maintainer answering that question for you, in a legally binding document, before you ask. It is uncomfortable precisely because it is explicit.
>
> The engineering-leadership failure mode here is not choosing the wrong licence. It is discovering the licence after the crate shipped to production, because the checklist said "check the licence badge" and the badge on the crate page said something that looked fine. The badge is a summary. The LICENSE file is the record. Read the file.
>
> I rated zenjpeg Assess, not because of the code, which is excellent, but because for most companies the AGPL is a conversation with legal before it is a conversation with engineering, and I would rather you have that conversation on purpose than by surprise.
>
> This week's issue, with verdicts on six crates and a radar of 80:
>
> https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13

## r/rust + TWiR blurb

> Rust & AI Weekly #13: engineering-leadership verdicts on dial9 0.5.1 (Russell Cohen's Tokio flight recorder, now working without tokio_unstable, Trial, paired with his "Principles for fast Tokio applications" post from the RustConf Unconf), zenjpeg (TWiR 669's Crate of the Week, Assess on the AGPL-or-commercial licence rather than the code), fearless_simd 1.0.0 (final September 21 after two breaking RCs; latest release per MSRV gets security backports for at least three years after that Rust version shipped; Trial holds), tokio_rcu 0.2.1 and Slint 1.18 updates, and html2text as the Rust seat opposite Go's converter; a Language watch on `Allocator` finishing FCP with disposition merge, `DropGuard` and `Vec::from_fn` stabilizing, and Cargo's `build.profile` config in FCP; the Rust project's targeted-attacks alert as the week's anchor; and a radar of 80 tools rated Adopt/Trial/Assess/Hold.
> https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13

## dev.to / Hashnode notes

- Title: `Rust & AI Weekly #13: the counters looked fine`
- Canonical URL: `https://decebaldobrica.com/blog/2026-09-21-rust-ai-weekly-13`
- Cover image: `apps/web/public/images/blog/2026-09-21-rust-ai-weekly-13-3d-hero.png`
- Tags: rust, tokio, observability, opensource

## Follow-up notes

The drafting notes below record the unattended September 21 pass. The September 22 verification log supersedes their factual and availability claims.

- **Unverified this run (Claude in Chrome was not connected; the built-in browser had no permission for docs.rs, static.crates.io or substack.com, and web_fetch returned empty for Substack posts):**
  - Rust Bytes #136 ("Rust Debugging Survey Findings"): only the search-engine summary was readable (led with the debugging survey and Microsoft Tier-1; Cargo team changes). The issue's "Before I go" and Elsewhere say so explicitly. If #136 ran dial9, zenjpeg or the targeted-attacks post, the "Nothing else had run there" claim in the Elsewhere bullet needs a tweak.
  - tokio_rcu 0.2 changelog: docs.rs and static.crates.io were blocked, so the 0.2 description is inferred from the current README (rcu_block_on / enable_rcu, refreshed benchmark table). The Prime note for tokio_rcu is flagged "benchmark multiple unverified". Worth a 2-minute look at the GitHub Releases page before publishing.
  - zenjpeg star count: GitHub API said 15, the rendered README page earlier in the run said 7; the issue says 15. lib.rs shows a stale 0.6.0 for zenjpeg while crates.io API and GitHub agree on 0.8.4 (Jun 1); the issue uses 0.8.4.
  - dial9 star count: 506 via GitHub API, 437 on the rendered page; the issue says "~500".
  - RustConf recordings: not found this run; Elibol's and Birr-Pixton's talks from #12 are still the pairings to add when they appear.
- **Verified this run via crates.io API and GitHub API:** dial9 0.5.1 (Sep 17), 0.5.0 (Aug 26), crate owners carllerche / rcoh / jlizen; fearless_simd 1.0.0-rc.2 (Sep 19) and rc.1 (Sep 13) with release notes; tokio_rcu 0.2.1 (Sep 17), 0.2.0 (Sep 15), 38 stars, 226 commits; slint 1.18.0 (Sep 16); html2text 0.17.1 (Apr 19), owner jugglerchris; zune-jpeg 0.5.16-rc2 (Sep 8); wasm2rs 0.1.1 (Aug 17, owner hirosassa); PR states for every Language watch item (Allocator #156882 finished-FCP + disposition-merge, still open; DropGuard #161520 merged Sep 13; Vec::from_fn #162685 merged Sep 12; unsafe_cell_access #162504 merged Sep 14; Thread::os_id #160219 merged Sep 9; RISC-V d/f #161385 merged Sep 13; funnel_shifts #161015, Result::into_ok/err #161712, wasm wide-arithmetic #160877 and cargo #17215 in FCP; RawWakerVTable #158186 finished FCP, unmerged).
- **Worth a direct reply:** Russell Cohen (rcoh) wrote the principles post as an explicit first draft with a PR link and asked for feedback; the issue's dial9 entry and the "18 ms" framing come from his Tokio blog post, so a note with the link is natural. Lilith River (Imazen) for zenjpeg: the entry is careful about the licence and complimentary about the code; she may want to correct the star count or the "effectively solo" phrasing. Shnatsel for the fearless_simd security-policy praise. Roee Shoshani: ask about the implementation change and benchmark rerun; the previous 3x figure was not an error.
- **Reader-pick opportunities raised in the issue:** dial9 in production outside AWS (overhead, trigger mode); anyone whose legal team has evaluated an AGPL-or-commercial Rust dependency.
- **Recurring pattern:** licence-as-evaluation-input appeared twice this issue (zenjpeg, Slint) after stewardship-as-input for five issues running. The bus-factor Deep Dive suggested at #12 is still the right next Deep Dive; this issue adds "read LICENSE and SECURITY.md as separate items" to its rubric.
- **Deep Dive suggestion for the lead:** dial9 merits one and the material is unusually good: a hands-on trace of a deliberately mis-tuned Axum service (contended std mutex, unbounded spawn, tokio::fs in a loop) with the trace screenshots showing each principle from Cohen's post. Needs a Linux box with frame pointers and a few hours; not drafted here.
- **Gap recorded in Prime:** "wasm-to-native-source transpiler" (insight node), paired with goccy/wasm2go and ncruces/wasm2go vs wasm2rs 0.1.1.
- **Prime changes this run:** added tool nodes dial9 (Trial, Deep Dive lead), zenjpeg (Assess), html2text (Trial, rust_alternative_to k3a/html2text); forgot and re-added tokio_rcu, fearless_simd and Slint with extended mentions (all verdicts unchanged); added one insight node.
- **Carry into #14:** `Allocator` stabilization PR should merge (Language watch lead if it does); fearless_simd 1.0 adoption reports; whether tokio answers the on_after_task_poll question; Rust Bytes #137 when it appears (the archive does not establish an October 5 schedule); RustConf recordings.

## Verification log (2026-09-22)

Browser verification completed in Chrome. This log supersedes the September 21 drafting notes above. No publication, Substack draft, messages, push or application-code changes were made. All six verdicts remain unchanged. The issue date, filename, slug, `RADAR_ISSUE = 13` and `RADAR_GENERATED_AT = '2026-09-21'` remain unchanged.

### 1. Rust Bytes #136: full-body deduplication

[Issue #136](https://weeklyrust.substack.com/p/rust-debugging-survey-findings) was published September 15, 2026. The [archive](https://weeklyrust.substack.com/archive?sort=new) still showed it as the latest issue on September 22. Its lead was the debugging survey; Microsoft was in the subtitle and link roundup, not a second lead. Full editorial inventory follows, including projects mentioned inside bundled links:

- Main news: [Rust debugging survey results](https://blog.rust-lang.org/2026/09/07/rust-debugging-survey-2026-results/), including debugger use, print debugging and `dbg!`.
- Project spotlight: [rust-smallvec](https://github.com/servo/rust-smallvec), stack storage for small vectors, configurable inline capacity, `union` and `no_std` options.
- Roundup item 1 bundled four stories: [Cargo team changes](https://blog.rust-lang.org/inside-rust/2026/09/08/welcome-dongpo-and-ross-to-the-cargo-team/) (Dongpo Liu and Ross Sullivan joining, Eric Huss stepping down, Jacob Finkelman and Weihang Lo becoming co-leads); [Microsoft Tier-1 Rust and rustc_codegen_utc](https://rustfoundation.org/media/guest-post-rust-is-tier-1-language-at-microsoft/); [Peeriot's Myrmic developer preview](https://rustfoundation.org/media/guest-post-peeriot-releases-myrmic-developer-preview-at-rustconf-2026/); and [a decade of Rustls, with the v0.24 plan](https://rustfoundation.org/media/guest-post-a-decade-of-rustls/).
- Item 2: [Dioxus Labs joining Cognition](https://dioxuslabs.com/blog/joining-cognition/), mentioning Devin, Dioxus, Blitz, Taffy and Subsecond.
- Item 3: [Vijay Anand's PDF table engine rewrite](https://pdftableconvert.com/blog/posts/rebuilding-table-engine-rust), Rust, xpdf and OpenCV.
- Item 4: [Alejandra González's Clippy lint optimization](https://blog.goose.love/posts/making-a-clippy-lint-faster-by-3133x/).
- Item 5: [Ben Simms reverse-engineering an Egret GT scooter](https://bensimms.moe/reverse-engineering-scooter/), CAN bus, SWD and Rust display firmware.
- Item 6: [Neil Pathare's gPTY](https://github.com/godot-pty/gpty), a Godot/Rust terminal workspace for developers and agents.
- Item 7: [Conviva replacing mmap with io_uring and getting slower](https://conviva.ai/resource/we-replaced-mmap-with-io_uring-in-our-rust-query-engine-it-got-slower/).
- Item 8: [NVIDIA's two CUDA Rust tracks](https://developer.nvidia.com/blog/introducing-cuda-rust-two-tracks-for-writing-gpu-kernels/), SIMT and Tile-based GPU programming.
- Item 9: [Perplexity joining the Rust Foundation](https://x.com/perplexitydevs/status/2098125558295191958).
- Item 10: [Sofía Belén López Vicens on static/dynamic dispatch and vtables](https://sofiabelen.github.io/projects/visualizing-rusts-vtables-how-dyn-trait-works-in-memory/), also mentioning wide pointers and ZSTs.
- Challenge: minimum-window substring, a reference to the prior “trap” challenge, and a [Rust Playground exercise](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=6c1271020f56248b46b34c8a91f2bd97).
- Affiliate section: CodeCrafters Rust courses building Git, Docker, Redis, Kafka, SQLite, Grep, BitTorrent, an HTTP server, an interpreter and DNS.

None of dial9, “Principles for fast Tokio applications”, zenjpeg, the targeted-attacks alert, fearless_simd, tokio_rcu, Slint 1.18 or html2text appeared. No extra positioning line was needed in the six entries. Microsoft and Clippy overlap are now explicitly credited. Changed MDX and mirrored HTML: “Elsewhere”, “Before I go” and Microsoft “In brief”. Removed the unsupported claim that Go readers heard the alert before most Rust readers: #136 predates the September 17 alert.

### 2. tokio_rcu: documented changes and benchmark provenance

[GitHub Releases](https://github.com/roeeshoshani/tokio_rcu/releases) has no releases. The supplied [main history URL](https://github.com/roeeshoshani/tokio_rcu/commits/main) has no commit history; the repository uses [master](https://github.com/roeeshoshani/tokio_rcu/commits/master/). This routing issue was resolved, not left as a factual blocker. Compared [0.1.3 docs](https://docs.rs/tokio_rcu/0.1.3), [0.2.1 docs](https://docs.rs/tokio_rcu/0.2.1), [registry](https://crates.io/crates/tokio_rcu/0.2.1) and commits.

Confirmed 0.2.0 September 15, 0.2.1 September 17, 38 stars, 226 commits, MIT, continuing `tokio_unstable`/`on_after_task_poll` requirement and Linux/Windows, single-runtime constraints. `rcu_block_on` and `enable_rcu` already existed in 0.1.3. Changes: remove thread-local live-guard bookkeeping; add `include_calling_thread` to `synchronize_rcu`; rename `rcu_ptr::RcuPtr` to `rcu_box::RcuBox`; rerun benchmarks. Version 0.2.1 tightens the `Sync` bound to `T: Send + Sync`, fixes a blocking-task stall and adds branch hints.

The [benchmark rename diff](https://github.com/roeeshoshani/tokio_rcu/pull/6/commits/df5515c75695b88c3b87d13d130c5f900830e70d) changes six function names, with the same Divan workloads and attributes. It is not a new harness. Current i7-12700 read-only mean timings, task counts 1/8/16/32/64: RcuBox 2.630/2.733/2.626/2.166/3.496 ms; arc-swap 23.87/29.83/42.8/69.26/132.9 ms. The README's summary is reads 9–40 times faster and writes twice as slow. These compare RcuBox against arc-swap after implementation changes; they do not measure 0.1.3-to-0.2.1 speedup. The old README said about three times faster reads and three times slower writes, so #12 was not wrong. Independent performance remains unverified this run; no benchmarks were rerun. Updated MDX, HTML and radar note. Assess unchanged. Whether the Tokio team answered the earlier hook question remains unverified; the published requirement itself is confirmed.

### 3. zenjpeg

Checked [GitHub README and metadata](https://github.com/imazen/zenjpeg), [crates.io](https://crates.io/crates/zenjpeg), [lib.rs](https://lib.rs/crates/zenjpeg), and [Kornel's September 14 suggestion](https://users.rust-lang.org/t/crate-of-the-week/2704/1669). Confirmed latest 0.8.4, June 1, 2026; 15 stars; 14 GitHub releases; formerly jpegli-rs. Commits increased from the draft's 2,455 to 2,599. lib.rs now shows 0.8.4, so the stale-version concern is closed.

README confirms pure Rust, `forbid(unsafe_code)`, archmage SIMD tokens, six rewrites, streaming/limits/cancellation, restart-marker parallel decode, adaptive and trellis quantization, XYB, UltraHDR and recompression. Performance table confirms baseline throughput 0.94x libjpeg-turbo, progressive 1.35x, 4096px parallel decode about 0.13x the C time, and an 81% win rate on 337 CID22 photos against mozjpeg at matched file size. Those are author-published Ryzen 9 7950X measurements, not independently reproduced here. README reports 930+ tests, Claude assistance and a prerelease decoder API with breaking changes expected.

Licensing correction: $1 startup offer requires revenue below $1M **and fewer than five employees**, not five employees. README attributes full-time maintenance since 2011 to Lilith River's broader Imazen ecosystem, not to this codec alone. AGPL-3.0 or commercial licensing and a sliding scale are stated. The registry badge already identifies AGPL/commercial: removed the invented badge-versus-LICENSE conflict from MDX, HTML and LinkedIn/X copy. Updated radar maintenance and benchmark note. Assess unchanged. The zenjpeg tile's pure-Rust/AGPL wording remains supported.

### 4. dial9

Checked [repository](https://github.com/dial9-rs/dial9), [releases](https://github.com/dial9-rs/dial9/releases), [registry versions](https://crates.io/crates/dial9/versions), [0.5 post](https://dial9-rs.github.io/blog/whats-new-in-dial9-0-5/), [principles](https://dial9-rs.github.io/blog/principles-for-fast-tokio-applications/) and [Tokio introduction](https://tokio.rs/blog/2026-03-18-dial9).

Confirmed publication dates 0.5.0 August 26 and 0.5.1 September 17; the 0.5 blog post itself is dated August 4. Browser snapshot: 507 stars and 534 commits (draft ~500 and 480+). Owners are Carl Lerche/carllerche, Russell Cohen/rcoh and Jess Izen/jlizen. The 0.5 post thanks 18 contributors, including David Tolnay, and describes Ditto's Android profiler behind a flag, optional Tokio sources, native spans, trigger mode and multi-trace analysis. Without `tokio_unstable`, task polling coverage narrows to dial9 spawn helpers and spawn/terminate events and per-worker queue depth are unavailable. Full task visibility still needs runtime hooks.

Added the actual 0.5.1 changes: system metadata, FreeBSD support, viewer off-CPU and spawn-to-first-poll points, task-dump/rotation/liveset fixes, `RecorderSourceExt` deprecations and explicitly breaking sealing of extension traits. The March Tokio article confirms the AWS service, 90% CPU context, worker 47 and approximately 18 ms kernel scheduling delay. “Typically under 5%” is that article's project claim, not an independent 0.5 guarantee: qualified MDX/HTML/radar and removed the unqualified number from the tile. Principles dated September 13, updated September 15, credits Alice Ryhl and Saghm Rossi; exact mini-Redis p99 2.548 to 0.320 ms, yielding after four consecutive ready reads. Rounded issue figures replaced with exact values.

[Cohen's GitHub profile](https://github.com/rcoh) and [personal site](https://rcoh.me) still identify AWS. Neither establishes when the employment text was last updated, so no new current-employer assertion was added. LinkedIn now describes the service at AWS and correctly dates 0.5.1, replacing “0.5 line this month”. Trial unchanged.

### 5. fearless_simd

Checked [releases](https://github.com/linebender/fearless_simd/releases), [core registry](https://crates.io/crates/fearless_simd), [macro registry](https://crates.io/crates/fearless_simd_macros), [August post](https://linebender.org/blog/fearless-simd-0-7/) and [security policy](https://github.com/linebender/fearless_simd/blob/main/fearless_simd/SECURITY.md).

Confirmed rc.1 September 13, rc.2 September 19, LaurenzV releasing, Shnatsel authoring the listed API changes, MSRV 1.89 and 458 stars. rc.1 renames `N` to `LEN`, aligns the array-conversion family with `std::simd` and moves `abs` to `SimdBase`; rc.2 moves `witness()` into `ExtractToken` as `token()`. Storage representation receives a semver guarantee. Corrected floating-point guarantee to a fixed vector type and lane count, except NaN bit patterns. Licence is **MIT OR Apache-2.0**, not Apache-only.

Major update: final **1.0.0 and macros 0.1.0 shipped September 21**, so “not shipped” and “pin the RC” were stale. The August post conditionally targeted early September and said no further breaking changes were planned; it did not say “API frozen”. Security policy covers the latest release for each MSRV for at least three years after that Rust version's release, not three years for every crate release. Updated MDX, HTML, radar, X reply, LinkedIn, Reddit/TWiR blurb and tile. Trial unchanged; advice now tests the 0.7-to-1.0 migration.

### 6. Slint and html2text

[Slint 1.18 announcement](https://slint.dev/blog/slint-1.18-released), September 16, confirms every listed feature: FlexboxLayout, runtime z-order, springs, path animation, model push/remove/insert, struct defaults, WindowMoveArea, screen-reader text input, experimental Vello renderer, leaner compiler output and large-text improvements. [Registry](https://crates.io/crates/slint/versions) now has **1.18.1, September 21**. Updated latest version in MDX/HTML/radar and removed unsupported “quarterly” cadence; feature discussion remains explicitly about 1.18.0. Trial unchanged.

[Rust html2text](https://github.com/jugglerchris/rust-html2text), [registry](https://crates.io/crates/html2text), [docs](https://docs.rs/html2text/0.17.1/html2text/) and [lib.rs](https://lib.rs/crates/html2text): 0.17.1 April 19, MIT, first published December 21, 2016, Chris Emerson as sole registry owner, other GitHub contributors, html5ever DOM and formatted width-aware output. [Config documentation](https://docs.rs/html2text/0.17.1/html2text/config/struct.Config.html) confirms table rendering, optional table-border suppression and a separate raw-extraction mode that flattens cells. Snapshot: 245 stars and 6,113,741 all-time downloads; lib.rs reports 520,732 per month. Replaced ambiguous “~1.5M recent” with ~521k/month and “solo” with “one primary maintainer”. The historical trending claim remains **unverified this run**: [live new/trending list](https://lib.rs/new) no longer contains html2text. Updated MDX/HTML/radar; Trial unchanged.

[Go k3a/html2text](https://github.com/k3a/html2text): v1.5.0 September 14 and no external dependencies confirmed; [Go Weekly 618](https://golangweekly.com/issues/618) describes it as html2text 1.5 with no dependencies.

### 7. Anchor and Language watch

[Rust alert](https://blog.rust-lang.org/2026/09/17/targeted-attacks/) confirms Adam Harvey, September 17 and the crates.io/security-team attribution. September 17 was **Thursday**, not Wednesday; fixed MDX/HTML. [June account](https://grack.com/blog/2026/06/25/dissecting-a-failed-nation-state-attack/) confirms Matt Mastracci, June 25. Go Weekly carried the alert September 18.

Live PR states checked September 22:

| PR | Verified state |
| --- | --- |
| [rust 156882](https://github.com/rust-lang/rust/pull/156882), Allocator | Open; FCP completed, disposition merge |
| [rust 158186](https://github.com/rust-lang/rust/pull/158186), RawWakerVTable | Open; FCP completed, disposition merge |
| [rust 161015](https://github.com/rust-lang/rust/pull/161015), funnel shifts | Open, in FCP |
| [rust 161712](https://github.com/rust-lang/rust/pull/161712), Result | Open, in FCP |
| [rust 160877](https://github.com/rust-lang/rust/pull/160877), Wasm wide arithmetic | Open, in FCP |
| [cargo 17215](https://github.com/rust-lang/cargo/pull/17215), profile config | Open, in FCP |
| [rust 161520](https://github.com/rust-lang/rust/pull/161520), DropGuard | Merged |
| [rust 162685](https://github.com/rust-lang/rust/pull/162685), Vec::from_fn | Merged |
| [rust 162504](https://github.com/rust-lang/rust/pull/162504), unsafe_cell_access | Merged |
| [rust 160219](https://github.com/rust-lang/rust/pull/160219), Thread::os_id | Merged as an **unstable** API; corrected false stabilization claim |
| [rust 161385](https://github.com/rust-lang/rust/pull/161385), RISC-V d/f | Merged |
| [cargo 17388](https://github.com/rust-lang/cargo/pull/17388), install lockfile | Merged |

[Kobzol's September 14 triage](https://github.com/rust-lang/rustc-perf/blob/master/triage/2026/2026-09-14.md) confirms zero primary regressions, 199 primary improvements and mean -0.7%; clarified that these are instruction counts. PR 162422 concerns Polonius using IndexVec rather than BTreeMap. No Allocator merge occurred in this snapshot.

### 8. In brief, Elsewhere and recordings

Every linked In brief/Elsewhere article and the internal #1/#11 references resolved in Chrome. Source-specific findings:

| Source | Result |
| --- | --- |
| [Microsoft](https://rustfoundation.org/media/guest-post-rust-is-tier-1-language-at-microsoft/) | Victor Ciura, September 10; Tier-1 and backend claims confirmed |
| [Foundation members](https://rustfoundation.org/media/rust-foundation-announces-solana-foundation-and-nvidia-as-platinum-members/) | September 9, Solana Foundation/NVIDIA Platinum; corrected “the week after” to RustConf-week timing |
| [Verus](https://www.amazon.science/blog/developing-provably-correct-rust-code-with-verus) | Bryan Parno, August 31; verifier content confirmed; added credit |
| [Clippy](https://blog.goose.love/posts/making-a-clippy-lint-faster-by-3133x/) | September 11, title/content confirmed; Alejandra González credited by Rust Bytes; added credit and overlap |
| [libpatcher](https://ai-coustics.com/blog/libpatcher) | Stephan Eckes, September 15, static-library symbol collisions; specific two-copies-of-ring attribution unsupported and now explicitly unverified |
| [CO3](https://mversic.github.io/co3/) | mversic; FFI content confirmed |
| [Rust Glancer](https://rust-glancer.github.io/blog/why-lsp-is-hard/) | Project's LSP article confirmed |
| [Async guide](https://akesson.io/a-visual-guide-to-rust-async/) | Author is **Henrik Åkesson**, confirmed on [his index](https://akesson.io/), not Per; corrected MDX/HTML |
| [Operators of death](https://bitfieldconsulting.com/posts/operators-of-death) | John Arundel; checked-arithmetic article confirmed |
| [Generics](https://kerkour.com/rust-generics) | Sylvain Kerkour, September 15; static/dynamic dispatch confirmed |
| [Auto-vectorization](https://jsgroth.dev/blog/posts/trying-to-make-a-loop-auto-vectorize/) | jsgroth, September 9; initially bot-protected, then browser retry resolved and full body was read |
| [One Lock to Rule Them All](https://flakm.com/posts/sqlx_migration_wrapper_til/) | FlakM, September 10; corrected description to an advisory-lock wrapper inspired by sqlx migrations |
| [Rune](https://rune.build/blog/rune-is-now-open-source) | September 12, ernestrc; Go Weekly credits Ernest Romero Climent; GPLv3, Ebitengine and terminal comparison confirmed. Removed unsupported causal claim about Zed forcing Rune's renderer choice |
| [goccy/wasm2go](https://github.com/goccy/wasm2go) | Standalone Go with amd64/arm64 assembly and pure-Go fallback confirmed; Go Weekly credits Masaaki Goshima |
| [ncruces/wasm2go](https://github.com/ncruces/wasm2go) | Self-contained Go output confirmed; [USERS.md](https://github.com/ncruces/wasm2go/blob/main/USERS.md) explicitly lists go-sqlite3 |
| [wasm2rs](https://crates.io/crates/wasm2rs) | hirosassa, latest 0.1.1, 47 total downloads; standalone Rust transpilation confirmed. Broader “no mature Rust answer” remains unverified, now framed as a research gap rather than an exhaustive finding |

RustConf recording search found no published recording for Melih Elibol's “Fearless Concurrency on the GPU” or Joe Birr-Pixton's Rustls talk. Checked [RustConf](https://rustconf.com) and [the linked official channel's latest videos](https://www.youtube.com/@rustfoundation/videos), alongside targeted title searches. No go-deeper recording links added; the existing “where I could find them” sentence remains. This is an unsuccessful discovery, not proof no recording exists. Historical notable releases on [lib.rs/new](https://lib.rs/new) remain unverified because the list changed; the issue now says so.

### Prime corrections: completed through the existing hosted service

All seven supplied records were corrected in place through the user's already-configured AllSource Prime service, then individually read back and compared with the intended properties. Original IDs, creation times, existing fields, historical mentions and verdicts were preserved. No nodes were forgotten or replaced, so no replacement-ID mapping is needed. `verified_at` and source URLs were added. The tokio_rcu “benchmark multiple unverified” flag was cleared; “not independently rerun” remains.

The initial connector blockage is resolved for these updates: the exposed `prime` connector points at a different local store, while the requested records were found in the newsletter memory store and verified in its configured hosted service. Existing local Prime sessions were left running, and connection settings were not changed. Their push-only local cache was not rewritten. No secrets, proprietary source or full file contents were stored in Prime.

Applied corrections:

| Existing node, ID preserved | Saved correction |
| --- | --- |
| dial9 `node:tool:efe77118-991a-4dbb-a372-607e2968043d` | 534 commits, 507 stars, three owners, actual 0.5.1 changes and attributed March overhead claim; keep #13 mention and Trial |
| zenjpeg `node:tool:c434e470-6768-4d9f-b172-918f755c7914` | 2,599 commits, 15 stars, fewer-than-five eligibility, no badge/file conflict, performance attributed; keep #13 mention and Assess |
| html2text `node:tool:4554a9a3-c3c6-41c7-809f-38e2afa78f9e` | ~521k/month, ~6.1M all-time, primary maintainer with contributors, historical trending unverified; keep #13 and Go alternative relation, Trial |
| tokio_rcu `node:tool:18ba83be-9840-42d6-8e80-4ee0dcf4e860` | Document actual API/implementation changes and Divan rerun; clear “benchmark multiple unverified” as a source-check flag, retain “not independently rerun”; preserve #12 and #13 mentions and Assess |
| fearless_simd `node:tool:5549f441-b169-4303-a06e-3aea999d8405` | Final 1.0.0 September 21, MIT OR Apache-2.0, conditional August plan, accurate float/security scope; preserve #8 and #13 mentions and Trial |
| Slint `node:tool:3677e379-d02e-44a1-aff7-1f232bec1cbc` | Latest 1.18.1 September 21; features belong to 1.18.0 September 16; preserve #3, Deep Dive and #13 mentions and Trial |
| Gap `node:insight:e632827f-765e-4b27-88ec-733a072a6ac5` | Keep wasm2rs/Go comparisons, but mark exhaustive absence/maturity claim unverified; research lead only |

### Artifact and copy checks

- MDX factual corrections regenerated into the Substack HTML mirror with absolute internal links and the existing manual radar-image workflow. No Substack editor was opened.
- Social number audit: removed unqualified dial9 “under 5%” tile and zenjpeg “1.35x” X claim; kept confirmed 18 ms, 90% CPU, release numbers/dates, licence thresholds and security duration. Radar counts now appear explicitly in the issue body: 14/33/31/2, total 80. Corrected LinkedIn's five-versus-six entries and removed the unsupported “tri-licensed since the beginning” claim.
- X counts, including paragraph breaks and URLs at 23 characters: hook **251**, reply 1 **268**, reply 2 **248**, reply 3 **248**. Headers updated. All are within 280.
- Tile edits: dial9 asks readers to measure workload overhead; fearless_simd now says final 1.0 follows two breaking RCs and advises migration testing. Issue-card SVG re-rasterized at 2400px for docs/social and 1250px for the public copy; images inspected. The unchanged hook card remains supported by the verified 18 ms trace.
- Radar count and verdicts unchanged; radar PNG deliberately not regenerated. Slug and filename preserved. MDX em-dashes checked: entry-name separators only. No app code or repository scripts touched.

### Completion pass and 3D artwork (2026-09-22)

- Prime: seven hosted records updated and verified by read-back, with the IDs listed above retained. Existing #12/#13 tokio_rcu, #8/#13 fearless_simd and #3 Deep Dive/#13 Slint mentions preserved; #13 mentions added to the other corrected records.
- libpatcher: [repository README](https://github.com/ai-coustics/lib-patcher) independently illustrates duplicate `rust_eh_personality` and `serde_json::ser::indent` symbols; its test dependencies include rand, serde and serde_json. The specific `ring` attribution remains unverified this run. The issue retains that hedge.
- Tokio: [hook search](https://github.com/tokio-rs/tokio/issues?q=on_after_task_poll) and [open task-hook RFC 7306](https://github.com/tokio-rs/tokio/issues/7306) show related API-design discussion, not a verified answer to the newsletter's September question. No stabilization promise inferred; hedge retained.
- RustConf: [official Live tab](https://www.youtube.com/@rustfoundation/streams) lists no requested talk recordings. The organizer's advertised stream link leads to [the virtual guide](https://rustconf.com/virtual-guide/), which returns 404. [FAQ](https://rustconf.com/faq/) says recordings are planned after the event but gives no publication date. Neither requested recording was found; the existing qualified sentence remains.
- Historical [lib.rs/new](https://lib.rs/new) placements and an exhaustive [wasm2rs](https://crates.io/crates/wasm2rs) ecosystem-maturity claim remain unverified this run. Live pages cannot establish the historical list or exhaustive absence. Source checks are complete; these evidentiary limits remain explicit.
- New user request: added 3D hero artwork to the top of the MDX and its exact Substack HTML mirror, with descriptive alt text and a caption. The graphite recorder, green indicators and congested copper event channels illustrate the issue's theme. This is conceptual artwork, not a performance diagram.
- Generated with the built-in imagegen tool. Saved the selected PNG inside the project at the Assets path above and inspected it. Existing radar and social cards remain in place. Full generation prompt follows for reuse.

<details>
<summary>3D hero generation prompt</summary>

Use case: stylized-concept. Asset type: 3D editorial hero illustration for Rust & AI Weekly #13, titled 'the counters looked fine'. Primary request: sophisticated 3D art visualizing a calm healthy-looking summary concealing a congested event trace. Scene: a single precisely machined dark graphite instrument block floating just above a charcoal studio surface; its smooth top holds three small softly glowing green status lights. An elegant cutaway in its front reveals layered parallel channels carrying rows of warm copper-orange event tiles; one channel has a visible stalled gap and crowded queue while the others flow. A slender copper trace ribbon emerges from the block and curls onto the surface like a flight-recorder timeline. Style: premium physically rendered 3D editorial sculpture, tactile brushed graphite, translucent smoked glass sections, satin copper and subtle orange emission; architectural precision, quiet restrained drama, crisp object silhouette, soft ambient shadows. Composition: wide landscape 16:9, one coherent sculptural object filling the central area with generous dark negative space around it, three-quarter elevated view, readable at newsletter width. Palette matches existing edition: charcoal #0d1117, graphite #111826, copper orange #f97316 and small green #4ade80 indicator accents. No text, numbers, labels, branding, mascots, people, screenshots, UI panels, logos or watermark. This is conceptual artwork, not a factual performance diagram. Render one finished high-resolution image.

</details>

Remaining steps: Decebal reviews, Decebal pushes, then the separate interactive social posting follow-up: Substack draft first, X and LinkedIn, dev.to/Hashnode with rel=canonical, Medium import, daily.dev Squad, r/rust and TWiR. No publishing, Substack draft, messages or push occurred in this pass.

### Readability correction (2026-09-22, following publication)

The status above describes the original verification pass. The article subsequently shipped through PR #20, and the LinkedIn post and four-post X thread were published. LinkedIn was then edited in place after readability feedback; its replacement copy is in `docs/social/rust-ai-weekly-13-linkedin.md`.

The newsletter body now uses shorter paragraphs, release subheadings, feature lists, and separate maintenance/latest/adoption bullets. Repeated dashboard analogies and closing recaps were cut. Body length fell from 4,370 to 2,837 words; the longest rendered Markdown paragraph fell from 614 to 55 words. All 57 distinct link destinations, six crate verdicts, release qualifications, 80-tool radar totals, and both images were retained.

Ralph copywriter and no-ai-slop guided the edit. The full body is synchronized across MDX, this HTML mirror, the Substack paste source, and the unpublished syndication export. The actual React Markdown rendering pipeline passes with 12 main sections, 10 subheadings, and 14 lists. X copy remains unchanged.

Substack post 216861797 saved the new body; mobile and email previews were inspected. After reload, the editor showed an already-published post with an Update action. Automatic approval review rejected that click because authorization for changing the live Substack post was unclear; explicit approval was requested. The saved edit is ready for that action. Preview evidence and limits are in `docs/social/rust-ai-weekly-13-readability.html`.
