# Launch pack — Rust & AI Weekly #10

Live URL (after push): https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10
Source file: `apps/web/content/blog/2026-08-31-rust-ai-weekly-10.mdx`
Canonical for syndication (dev.to / Hashnode / Medium): same URL.

Assets:
- Radar image: `apps/web/public/images/radar/2026-08-31-radar.png` (70 tools, issue #10)
- Issue card (X / LinkedIn / OG): `docs/social/rust-ai-weekly-10-card.png` (source: `rust-ai-weekly-10-card.svg`); 1250px copy at `apps/web/public/images/social/2026-08-31-rust-ai-weekly-10.png`
- Hook card (standalone LinkedIn/X image for the "thought for the week"): `docs/social/cargo-build-is-not-read-only.png` (source: `cargo-build-is-not-read-only.svg`)

Ring counts this issue: 14 Adopt · 27 Trial · 27 Assess · 2 Hold (70 total).

---

## Substack (draft only — never publish from automation)

**Title:** Rust & AI Weekly #10: what runs before your code does

**Subtitle:** Today's issue: a crate with 245 million downloads shipped a build script that phoned home for 86 minutes, the Rust tool that would have sandboxed it has been sitting there since 2023, and the ecosystem finally put money on the maintainers whose credentials are the attack surface.

**Body:** paste the HTML below into the ProseMirror editor (it parses h2s, bold links, inline code, and italics cleanly). Radar image: drop the PNG onto the placeholder line, then re-check placement.

```html
<p>Welcome back to <strong>Rust &amp; AI Weekly</strong>, the curated, vetted sweep of crates and tools showing up where Rust meets AI. Today's issue: a crate with 245 million downloads shipped a build script that phoned home for 86 minutes, the Rust tool that would have sandboxed it has been sitting there since 2023, and the ecosystem finally put money on the maintainers whose credentials are the attack surface. The theme this week is <strong>what runs before your code does</strong>: <code>cargo build</code> is not a read-only operation, it is an execution environment with your credentials in it, and almost nobody treats it as one. Last week's genre was drawing a boundary and putting a mechanism on it. This week the boundary in question is the one between "I added a dependency" and "I ran a stranger's program as me", and the ecosystem spent the week discovering it in three different ways at once.</p>
<p><em>(Status lines reflect public signals as of August 31, 2026; stars and downloads are approximate and move fast.)</em></p>
<p>[[[ DROP 2026-08-31-radar.png HERE — caption: This week's radar: five new entries join the map, bringing it to 70 tools. Link caption to https://decebaldobrica.com/radar ]]]</p>
<h2>The week's anchor</h2>
<p>Before the picks, the thing they are all reacting to. On August 20 at 07:15 UTC, <a href="https://blog.rust-lang.org/2026/08/20/supply-chain-attack-on-arrayref/"><code>arrayref@0.3.10</code> was published to crates.io</a> with a new dependency on a typosquatted crate called <code>proc-macro1</code>, whose build script downloaded and executed a remote payload. <code>internment</code> and <code>append-only-vec</code>, by the same author, went the same way within twenty minutes. The Security Response Team, tipped off by the research team at Nextron Systems, deleted the malicious versions inside 86 to 107 minutes and locked the account. Manish Goregaokar wrote it up the same day, and the report is careful about the part that matters most: the maintainer is not believed to have acted maliciously, their machine or their credentials were compromised.</p>
<p>Two things make this worth more than a security bulletin. The first is scale: <code>arrayref</code> has around 245 million all-time downloads and 403 direct dependents, so "did I pull it" is a question almost every Rust shop had to answer that morning. The second is the mechanism. Nothing had to call the malicious code. Building was enough, because a build script is an arbitrary program that <code>cargo</code> runs on your machine, with your environment, before a single line of your crate compiles. Every entry below is a different answer to that.</p>
<h2>Pick of the week</h2>
<p><a href="https://github.com/cackle-rs/cackle"><strong>cargo-acl 0.9.1 (Cackle)</strong></a> — David Lattimore's code ACL checker leads this issue because it is the tool that already solved the thing that happened last week, and it has been sitting quietly on GitHub since 2023 with 274 stars, which tells you something uncomfortable about how the ecosystem prices this problem. Cackle does two jobs. The first is the one in the name: it analyses every crate in your transitive dependency tree to work out which API categories that crate actually reaches, then fails the build when the answer surprises you. A crate whose description says it slices byte arrays should not be touching sockets. Cackle notices, and it ignores dead code, so a network call that is never reachable from your binary does not fire a false alarm. The second job is the one that matters this week. With <code>bubblewrap</code> installed, Cackle runs build scripts, tests and <code>rustc</code> itself inside a sandbox, and critically the sandbox for each build script is configured separately, so one build script that legitimately needs network access does not buy network access for the other four hundred. Under that configuration, <code>proc-macro1</code> would have been a failed build rather than a compromised laptop. Sandboxing <code>rustc</code> sandboxes proc macros too, which the README notes is coarser: grant network to one proc macro and you grant it to all, though proc macros that need the network are rare enough that this is mostly fine. Two honest limitations, both of which Lattimore states himself in the README rather than making you find out. It is Linux only, and it is explicitly not a guarantee: a determined author can detect that they are running under Cackle and emit different code, and the stated goal is to raise the bar for sneaking something past review, not to replace review. The maintenance signal is the real caveat for adoption. 0.9.1 landed in May 2026 with fixes for V0 symbol mangling and an MSRV bump, so it is alive and tracking the compiler, but it is effectively one person who also writes the <a href="https://github.com/davidlattimore/wild">wild linker</a>, and nine releases in three years is not a fast train. Against that: exit cost is a CI job and a <code>cackle.toml</code>, which is about as cheap as a bet gets. Go deeper with Lattimore's original <a href="https://davidlattimore.github.io/posts/2023/10/09/making-supply-chain-attacks-harder.html">Making Rust supply chain attacks harder with Cackle</a>, which is the design rationale and reads very differently now than it did in 2023.</p>
<p><em>Maintenance: maintained but slow cadence, effectively solo (David Lattimore, who also writes the wild linker); 9 releases, 634 commits · Latest: v0.9.1 (May 7, 2026) · Adoption: <strong>Trial</strong>; start with the sandbox on build scripts in CI, which is the whole value in one flag, and leave the full API ACL pass for when someone has a week</em></p>
<h2>Supply chain</h2>
<p><a href="https://mozilla.github.io/cargo-vet/"><strong>cargo-vet</strong></a> — Mozilla's audit-enforcement tool is the other half of the answer, and the reason it gets a section rather than a bullet is that somebody finally measured what it costs. Cargo-vet enforces the invariant that every active dependency is either audited or explicitly exempted, with audits shared as importable <code>.toml</code> feeds from Mozilla, Google, the Bytecode Alliance and six others. Unlike a CVE scanner it is proactive: it can stop malicious code entering the build rather than reacting after the advisory lands. Firefox, Chromium, Tauri and Wasmtime all run it. Then, on August 12, Light Squares published <a href="https://www.lightsquares.dev/blog/cargo-vet-in-2026">A look at cargo-vet in 2026</a>, which scraped 408 adopting repositories and 7,016 audits and put numbers on the parts nobody advertises. Adoption grew 101% this year. Every one of the top 100 downloaded crates is audited by somebody, dropping to 90% of the top 500 and 71% of the top 1000, with <code>reqwest</code> the first unaudited crate at download rank 138. But the median project carries 131 exemptions, the mean 206. A project that wants to stay genuinely fully vetted faces a median 8,700 changed lines of review per week, over 50,000 at the 90th percentile. The median lag from a crates.io release to its first registry audit is 29 days. And for published RustSec advisories, an audit of the fixed version existed only 29% of the time when the project shipped the fix, while 40% of adopted fix versions were never audited at all. That is not an argument against cargo-vet, it is an argument for being precise about which slice of it you buy. The default <code>safe-to-run</code> criterion exists specifically to rule out credential exfiltration and reverse shells, and gating CI on <code>safe-to-run</code> before any build step executes is a cheap, high-value control that protects your production tokens. Full <code>safe-to-deploy</code> coverage across a large tree is an FTE conversation, and pretending otherwise is how you get rubber-stamped audits, which are worse than none because they look like diligence.</p>
<p><em>Maintenance: actively maintained (Mozilla); 9 official audit registries including Mozilla, Google and the Bytecode Alliance · Latest: in continuous use; ecosystem measured Aug 12, 2026 by Light Squares · Adoption: <strong>Trial</strong>, not Adopt, and the burden data is exactly why; 408 public repos including Firefox, Chromium, Tauri and Wasmtime, 326 of them importing at least one feed</em></p>
<h2>Agentic tooling</h2>
<p><a href="https://crates.io/crates/r3bl-rust-analyzer-mcp-server"><strong>r3bl-rust-analyzer-mcp-server</strong></a> — Nazmul Idris shipped an MCP server that bridges coding agents to a rust-analyzer LSP subprocess, so an agent can ask the type system where a symbol is actually used instead of grepping for it and guessing. That is a good idea on its own, and it is not the reason this is here. The reason is the <a href="https://developerlife.com/2026/08/22/to-async-or-not-to-async-rust-mcp-server/">write-up he attached to it</a>, which argues that he deliberately left Tokio out. His case: MCP over stdio is a 1:1 local pipe, a work-stealing multi-threaded runtime buys you nothing on a 1:1 local pipe, and the reflex to reach for Tokio the moment the letters I and O appear is async-by-default dogma rather than engineering. What he built instead is a synchronous three-thread pipeline over standard library threads, where the reader threads terminate naturally on EOF, and he notes he arrived here partly because agent processes were eating CPU and crashing on him. Anyone who has debugged a Tokio task that never gets joined will recognise the shape of that. This is the kind of entry where the artefact is the reasoning: single maintainer, part of the larger <code>r3bl-open-core</code> workspace, and worth reading before you write your fourth MCP server this quarter.</p>
<p><em>Maintenance: actively maintained inside r3bl-open-core (Nazmul Idris) · Latest: published on crates.io; design write-up dated Aug 22, 2026 · Adoption: <strong>Assess</strong>; useful today for driving Antigravity, Claude Code or Cursor against rust-analyzer, single maintainer, and the highest-value thing in it is the architectural argument rather than the binary</em></p>
<h2>Observability</h2>
<p><a href="https://github.com/swiftlogicsystems/swifttopology"><strong>swift-topomap 0.2.3-beta</strong></a> — This Week in Rust 666's Crate of the Week, self-suggested by Ankur Rathore of SwiftLogic Systems. It is a ratatui TUI that maps your physical topology, NUMA nodes, L3 cache boundaries and cores, from a hand-written Rust <code>sysfs</code> parser rather than <code>libhwloc</code>, then overlays live microarchitectural counters via eBPF CO-RE: instructions per cycle, cache misses, and process names pinned to physical cores through <code>sched_switch</code> hooks. The pitch is that <code>htop</code> tells you a core is busy and this tells you whether the core is computing or stalled waiting on memory, colour-coded green versus amber. If you run inference servers or tokenizers, you have almost certainly had the conversation where something reads as 100% CPU and gets no faster, and IPC is the number that ends that conversation. A single 3.5MB statically linked binary, Apache-2.0 and MIT, validated by the vendor on Intel Xeon bare metal at 1.39 IPC compute-bound and 2.58 under cache stress. Now the caveats, which are substantial and which the project is upfront about. It is beta, Linux and eBPF only, 44 commits old, zero stars and zero external adopters at the time of writing, and the first open-source release from a single vendor. The documented install is <code>curl</code> a release binary and run it under <code>sudo</code>, which in an issue about build-time trust is worth saying out loud even though it is the ecosystem's own default. And the credits state that the architecture and the kernel-level eBPF C were developed via AI pair programming with Gemini. I would rather have that disclosure than not, and the same disclosure is a reason to read the kernel-adjacent code before you run it as root, which happens to be exactly the review posture the rest of this issue is arguing for.</p>
<p><em>Maintenance: brand new, single vendor (SwiftLogic Systems; Ankur Rathore self-suggested it); 44 commits, first open-source release · Latest: v0.2.3-beta (Aug 2026) · Adoption: <strong>Assess</strong>; run it on a machine you are already profiling, read the eBPF before you sudo, and do not put it in a fleet rollout yet</em></p>
<h2>Data plumbing</h2>
<p><a href="https://github.com/kivikakk/comrak"><strong>comrak</strong></a> — this one arrives from the Go side. Go Weekly led its Code &amp; Tools section with Goldmark 2.0, Yusuke Inuzuka's first breaking release in seven years, and the headline feature is position info on every AST node. Rust's seat at that table is Asherah Connor's comrak, which already reports source positions, and the AI reason to care is not markdown rendering at all. It is that RAG chunking without byte offsets means your citations point at a document, and RAG chunking with byte offsets means they point at a sentence. Comrak builds a real mutable AST you can walk and rewrite, passes 652 of 652 CommonMark tests and 670 of 670 GFM tests, and carries the full set of GitHub extensions plus footnotes, math, wikilinks and front matter. Stewardship is better than the usual open-source story: Connor has had comrak inside the scope of her paid work since September 2025, and the crate backs commonmarker on Ruby, MDEx on Elixir and the Python bindings, so a lot of ecosystems would notice if it stopped. The tradeoff is stated in comrak's own README, which is a nice quality in a maintainer: it models <code>cmark-gfm</code> closely so its behaviour is predictable and its bugs are inherited, and it is slower than Raph Levien's pulldown-cmark, the no-AST pull parser that <code>cargo doc</code> uses. Pick comrak when you need to walk or rewrite the tree, pick pulldown-cmark when you need throughput and no AST.</p>
<p><em>Maintenance: actively maintained and partly funded (Asherah Connor / kivikakk; in scope of her paid work since Sep 2025) · Latest: v0.54.x line, exact release date unverified this run · Adoption: <strong>Adopt</strong> for source-position-aware markdown parsing; ~1.7k stars, 148 dependent crates, and downstream bindings in three other languages</em></p>
<h2>Language watch</h2>
<ul>
<li><strong>The never type is stabilized</strong> — <a href="https://github.com/rust-lang/rust/pull/155499">PR 155499</a> merged this week, ending one of the longest-running "any day now" features in the language. <code>!</code> as a real type means "this function does not return" stops being folklore and starts being checkable.</li>
<li><strong><code>min-publish-age</code> is in final comment period at Cargo</strong> — <a href="https://github.com/rust-lang/cargo/pull/17335">PR 17335</a>, still open for objections. It has been in this section since issue #8, and this week it stopped being a nice idea: a minimum age before a newly published version is resolvable is precisely the control that turns an 86-minute window into a non-event.</li>
<li><strong><code>cargo install</code> now uses locked dependencies</strong> — <a href="https://github.com/rust-lang/cargo/pull/17377">PR 17377</a>. Small change, same week, same direction: installing a tool should build what its author tested, not whatever resolved this morning.</li>
<li><strong>The next-gen trait solver is on by default on nightly</strong> — <a href="https://github.com/rust-lang/rust/pull/160619">PR 160619</a>, with <a href="https://blog.rust-lang.org/2026/08/21/enabling-next-solver-on-nightly/">an announcement post</a> to match. Perf triage this week, done by @simulacrum, reports 2 regressions, 4 improvements and 2 mixed across 28 artifact comparisons, which is a busy but unalarming week for the biggest compiler-internals change in years.</li>
<li><strong>Function overloading has a call for experimentation</strong> — <a href="https://blog.rust-lang.org/inside-rust/2026/08/19/overloading-experiment/">inside-rust post</a>. Worth an opinion before it has momentum.</li>
</ul>
<h2>In brief</h2>
<p><a href="https://bughunters.google.com/blog/scaling-memory-safety"><strong>Scaling Memory Safety: AI-Assisted Rewrites of C/C++ Dependencies to Rust</strong></a> — Google's bughunters team on using AI to port <code>giflib</code> to Rust, which is the first version of this argument I have seen with an actual dependency at the end of it rather than a benchmark · <a href="https://pointersgonewild.com/2026-08-25-replacing-a-rust-enum-with-a-64-bit-word/"><strong>Replacing a Rust Enum with a 64-bit Word Made My Interpreter 17% Faster</strong></a> — a specific, measured win, and a good reminder that enum layout is a performance decision · <a href="https://labs.leaningtech.com/blog/browserpod-rust"><strong>Beyond WASI: Rust applications in-browser</strong></a> — the sequel to last week's <code>tokio_with_wasm</code> entry, from the other direction · <a href="https://blog.goose.love/posts/three-seconds-of-compilation-shaved-by-metadata-analysis/"><strong>3 Seconds of compilation shaved by metadata analysis</strong></a> · <a href="https://flakm.com/posts/sqlx_caches_til/"><strong>Proving SQLx's Statement Cache with bpftrace</strong></a> — verifying a library's claim about itself instead of believing the docs, which is this issue's theme in miniature · <a href="https://akesson.io/wordtree/"><strong>One trie, three jobs, zero benchmarks won</strong></a> — an honest write-up of an optimisation that did not work, which is rarer and more useful than the other kind · <a href="https://msj.prose.sh/epaper-retained-state"><strong>Your E-Paper Panel Isn't Broken: How Retained State Makes Drivers Look Buggy</strong></a> · <a href="https://hacks.mozilla.org/2026/08/intent-to-ship-jpeg-xl/"><strong>Intent to Ship: JPEG XL</strong></a> — Mozilla shipping a Rust decoder for a new image format in Firefox, which is the memory-safety argument winning quietly · Clippy got <a href="https://github.com/rust-lang/rust/pull/159642">PGO-optimized</a> and a batch of new lints this week, including <code>is_ok</code>/<code>is_err</code> suggestions for boolean Result mappings and a less aggressive <code>needless_bool</code>.</p>
<h2>Elsewhere</h2>
<ul>
<li><strong>The Rust Project announced <a href="https://blog.rust-lang.org/2026/08/26/announcing-our-first-maintainers-in-residence/">its first Maintainers in Residence</a></strong>, and the timing is almost too neat. Gen Li (@rami3l), Chris Denton (@ChrisDenton), Alejandra González (@blyxyas) and León Liehr (@fmease) are funded for at least twelve months, with Maintainer Grants to Jason Newcomb (@Jarcho) and Jonas Böttiger (@joboet), paid out of $350K donated to the Rust Foundation Maintainers Fund by Google, AWS, OpenAI, the Leadership Council and individuals. Read that next to the arrayref report. The attack did not exploit a language flaw. It exploited one unpaid volunteer's laptop. Funding maintainers is a supply-chain control, and it is the only one on this page that also makes somebody's life better.</li>
<li><strong>Go 1.27 shipped experimental <code>simd</code> and <code>archsimd</code> packages</strong>, and Sylvain Kerkour <a href="https://kerkour.com/golang-chacha20-encryption-simd-archsimd">got 7.5x faster ChaCha20 out of them</a> without writing a line of assembly, with pure Go nearly matching the hand-written version on arm64. The Rust pairing is fearless_simd, which was issue #8's lead and is still <strong>Trial</strong>, with 1.0 booked for early September. I flagged the same shape of gap last week with PGO and I am going to keep flagging it: Go is putting performance primitives in the toolchain, and Rust's equivalents are excellent third-party crates while <code>std::simd</code> stays on nightly. Third-party is not worse. It is just a different bet about who does the integration work, and the ecosystem should notice it is making the same bet twice in two weeks.</li>
<li><strong>Thomas Ptacek wrote <a href="https://sockpuppet.org/blog/2026/08/20/stop-making-tuis/">Stop Making TUIs</a></strong>, arguing we build terminal interfaces because we have to rather than because we should. This week's Crate of the Week is a ratatui app. Read it anyway, ideally before your next internal tool, because the honest version of his argument is that a TUI is a distribution decision disguised as a design decision.</li>
</ul>
<h2>A thought for the week</h2>
<p><code>cargo build</code> is not a read-only operation.</p>
<p>I suspect most engineers know this in the way you know that your car has an engine, which is to say abstractly and never at a moment when it matters. Adding a dependency feels like reading. It feels like fetching a file. What actually happens is that an arbitrary program written by a stranger executes on your machine with your environment, your SSH agent, your cloud credentials and your network, before your own code compiles, and it does this on every developer laptop and every CI runner in the org. Last week that stranger's program was live for 86 minutes on a crate with 245 million downloads, and the only reason the blast radius was small is that a research team happened to be looking.</p>
<p>What strikes me about the response is that the tooling already existed. Cackle has been able to sandbox build scripts since 2023. Cargo-vet has been enforcing audit gates since 2022 and Firefox and Chromium both run it. <code>min-publish-age</code> has been in final comment period since issue #8. None of this needed inventing; it needed adopting, and it did not get adopted because the cost is paid up front by the team that adopts it and the benefit is paid out to everyone, eventually, in incidents that never happen. That is the standard shape of a security control and the standard reason it does not ship.</p>
<p>So here is the leadership question, and it is a budget question rather than a technical one. Your build pipeline currently runs untrusted code with production-adjacent credentials. What is the cheapest control you could put on that this quarter? Not the complete one. The cheapest one. A <code>safe-to-run</code> gate in CI before any build step touches your tokens is roughly an afternoon. A <code>bubblewrap</code> sandbox on build scripts in one repository is roughly the same. Neither is comprehensive and both would have stopped this specific attack. The teams that will handle the next one well are not the teams with the best threat model, they are the teams that shipped the cheap control while the incident was still fresh enough to justify the sprint capacity. That window is open right now, and it closes in about two weeks.</p>
<h2>Before I go</h2>
<p>Rust Bytes has been on a bi-weekly cadence, so this week's competitive read was Go Weekly, which came back from a break with Go 1.27 in hand. Worth noting for anyone tracking cross-ecosystem borrowing: Russ Cox is arguing for a <code>text/markdown</code> package in the Go standard library on the grounds that it would be simpler and more spec-compliant than Goldmark. Rust has three good markdown parsers and none of them in <code>std</code>, and I think that is the right outcome, but it is the same toolchain-versus-crate question as the SIMD one above, asked about a different layer.</p>
<p>Also: RustConf is next week in Montreal, September 8 to 11, with the Rust Teams Health Summit alongside it, and Oxidize follows in Berlin September 14 to 16. fearless_simd 1.0 is still booked for early September with no breaking changes planned, so if you own inference kernels and you have an API objection, this is the last week it is free.</p>
<p>And if you have not yet: go run that <code>find ~/.cargo/registry/cache</code> one-liner from the <a href="https://blog.rust-lang.org/2026/08/20/supply-chain-attack-on-arrayref/">Rust Security Response report</a>. It takes two seconds and it is the only item in this issue that requires no meeting.</p>
<p>That's the issue. Got a Rust+AI crate or tool I should feature next week? Reply and tell me; reader picks shape the list.</p>
<p>Keep shipping,<br>Decebal</p>
```

---

## X hook (260 chars)

Attach: `docs/social/rust-ai-weekly-10-card.png`

> A crate with 245M downloads shipped a build script that phoned home. Live for 86 minutes.
>
> cargo build is not a read-only operation. It runs a stranger's program as you, before your code compiles.
>
> https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10

### X thread replies (optional, post in order)

**Reply 1 — the lead**

> The Rust tool that would have stopped it has existed since 2023 and has 274 stars.
>
> cargo-acl sandboxes each build script separately via bubblewrap, and flags any crate reaching APIs its description doesn't justify.
>
> Exit cost: a CI job and a cackle.toml.

**Reply 2 — the number nobody quotes**

> cargo-vet works. It also costs.
>
> Light Squares measured 408 adopting repos: the median project carries 131 exemptions, a fully-vetted project faces a median 8,700 changed lines of review per week, and 40% of adopted RustSec fix versions were never audited at all.
>
> Buy the safe-to-run slice first.

**Reply 3 — the part that isn't a tool**

> The arrayref attack didn't exploit a language flaw. It exploited one unpaid volunteer's laptop.
>
> Six days later: Rust announced its first funded Maintainers in Residence, $350K from Google, AWS, OpenAI, the Leadership Council and individuals.
>
> Paying maintainers is a supply-chain control.

## LinkedIn hook

Attach: `docs/social/cargo-build-is-not-read-only.png`

> Adding a dependency feels like reading. It isn't.
>
> On August 20, a Rust crate with 245 million downloads was republished with a new dependency whose build script downloaded and executed a remote payload. Nobody had to call the malicious code. Running `cargo build` was enough, because a build script is an arbitrary program that your build tool runs on your machine, with your environment, before a single line of your own code compiles.
>
> It was live for 86 minutes. The maintainer is not believed to have acted maliciously; their machine or their credentials were compromised. The only reason the blast radius stayed small is that a research team happened to be looking that morning.
>
> Three things about the response are worth a leadership meeting rather than a security channel.
>
> First, the tooling already existed. A tool called Cackle has been able to run each build script inside its own sandbox since 2023, given bubblewrap alongside it. It has 274 stars. Under that configuration the attack would have been a failed build instead of a compromised laptop.
>
> Second, the tooling that is widely adopted has a price nobody quotes. Mozilla's cargo-vet is run by Firefox, Chromium, Tauri and Wasmtime. A study of 408 adopting projects this month found the median one carries 131 exemptions, that staying genuinely fully vetted costs a median 8,700 changed lines of review per week, and that 40% of adopted security-fix versions were never audited at all. That is not a reason to skip it. It is a reason to buy the cheap slice deliberately instead of the complete one aspirationally.
>
> Third, six days later, the Rust project announced its first funded maintainers, $350K from Google, AWS, OpenAI, the project's Leadership Council and individual donors. Read that next to the incident. The attack didn't exploit a language flaw. It exploited an unpaid volunteer's laptop. Funding maintainers is a supply-chain control, and it is the only one on the list that also makes somebody's life better.
>
> The question I'd take into planning: your build pipeline currently runs untrusted code with production-adjacent credentials. What is the cheapest control you could put on that this quarter? Not the complete one. The cheapest one. Both of the options above are roughly an afternoon, neither is comprehensive, and both would have stopped this specific attack.
>
> The teams that handle the next one well won't be the ones with the best threat model. They'll be the ones that shipped the cheap control while the incident was still fresh enough to justify the capacity.
>
> Issue #10 has the verdicts, plus a live radar of 70 Rust and AI crates rated Adopt/Trial/Assess/Hold:
>
> https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10

### Alternate LinkedIn post (async-by-default angle — use mid-week, or if the supply-chain angle underperforms)

Attach: `docs/social/rust-ai-weekly-10-card.png`

> An engineer shipped a small tool this week, and the interesting part was the essay he attached explaining what he left out.
>
> The tool is a bridge that lets an AI coding agent query a language server, so instead of grepping your codebase and guessing, the agent asks the type system where a symbol is actually used. Useful, unglamorous.
>
> What made it worth reading is that he deliberately did not reach for the async runtime that is the reflex in that ecosystem. His reasoning: the thing this program does is shuttle messages down a single local pipe between two processes on the same machine. A work-stealing, multi-threaded runtime designed for web servers handling thousands of connections buys you nothing on one pipe, and it charges you in complexity, in debugging difficulty, and in the class of bug where a task nobody joined quietly eats a CPU. So he used three ordinary threads and a loop.
>
> I keep meeting this pattern under different names. A team reaches for Kubernetes to run four services. A team reaches for event sourcing to store a settings page. A team reaches for a vector database to search a few hundred documents. None of those choices is wrong in general. All of them are wrong in the specific, and the specific is the only place software actually runs.
>
> The mechanism is usually not ignorance. It's that the sophisticated choice is legible as expertise and the simple one is legible as inexperience, especially in a code review, and especially to a reviewer who is skimming. Nobody has ever been criticised in a design doc for over-engineering as sharply as they've been criticised for under-engineering.
>
> Which is why the thing I actually admired here wasn't the three threads. It was that he wrote the argument down. A decision you can defend in prose is a decision the next person can revisit on purpose, rather than inheriting as a mystery. That is worth more to a codebase than either choice.
>
> This week's issue, with verdicts on five Rust and AI releases and a radar of 70 crates:
>
> https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10

## r/rust + TWiR blurb

> Rust & AI Weekly #10: engineering-leadership verdicts on cargo-acl/Cackle (David Lattimore's per-build-script bubblewrap sandbox and API ACL checker, which is the control the arrayref/proc-macro1 attack defeated), cargo-vet (Trial rather than Adopt, with the Light Squares 2026 numbers on exemptions, review burden and audit lag), r3bl-rust-analyzer-mcp-server (a rust-analyzer MCP bridge, notable for the argument for leaving Tokio out of a 1:1 stdio pipe), swift-topomap (TWiR 666's Crate of the Week: eBPF IPC and cache-miss overlay on a native sysfs topology map) and comrak as the Rust counterpart to Goldmark 2.0, plus a Language watch on the never type stabilizing and `min-publish-age` in FCP, and a radar of 70 tools rated Adopt/Trial/Assess/Hold.
> https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10

## dev.to / Hashnode notes

- Title: `Rust & AI Weekly #10: what runs before your code does`
- Canonical URL: `https://decebaldobrica.com/blog/2026-08-31-rust-ai-weekly-10`
- Cover image: `docs/social/rust-ai-weekly-10-card.png`
- Tags: rust, security, ai, opensource

## Follow-up notes

- **Unverified this run, flagged in Prime:** comrak's exact latest version and release date could not be pinned. The lib.rs snapshot showed 0.29.0 (Oct 2024) while the GitHub releases scrape showed v0.54.0 with dates that contradict it, so both sources were visibly stale or misparsed. The issue and the radar entry both say "v0.54.x line, exact release date unverified this run" and the Prime node carries the same caveat. Check crates.io directly before repeating a version number for comrak in social copy. No other entry has an unverified version.
- **Pages that could not be fetched directly:** `kerkour.com/fixing-rust-supply-chain-security` (in TWiR 666's Observations list) was blocked by web_fetch provenance and never surfaced by search, so it is not cited in the issue. Kerkour's Go SIMD post is cited instead, and that URL came from Go Weekly #615 directly. Chrome was not used this run.
- **Worth a direct reply:** the Rust Security Response report thanks Nextron Systems' research team and five named responders. If you know anyone running Rust CI at scale, the `find ~/.cargo/registry/cache` one-liner is a genuinely useful thing to forward rather than a marketing touch.
- **Reader-pick opportunity:** Ankur Rathore self-suggested swift-topomap for Crate of the Week and the repo has zero stars. A specific, technical issue on the eBPF code or on the curl-to-sudo install path would be more valuable to him than a star, and it is on-brand for a supply-chain issue.
- **Verdict arcs to watch:** cargo-acl is the first entry rated on a maintainer's *stated* limitations rather than their claims, which is a pattern worth naming again. fearless_simd 1.0 (Trial since #8) is due early September and should be a #11 update. rama's 0.5 window closes roughly mid-October, which is the second data point on the release-cadence arc from #9.
- **Recurring gap, now two weeks running:** Go ships performance primitives in the toolchain (PGO in #9, `simd`/`archsimd` this week) where Rust ships third-party crates. Recorded as a Prime insight node. If it appears a third time, it is a Deep Dive rather than an Elsewhere bullet.
- **Deep Dive suggestion:** cargo-acl merits one. The material is there (per-build-script sandbox config, the proc-macro coarseness tradeoff, how the API categorisation actually works via linker and rustc wrappers, and a walkthrough of writing a first `cackle.toml` against a real dependency tree). Not drafted here; needs Decebal's call and a hands-on run.
- **Carry into #11:** RustConf runs September 8 to 11 in Montreal with the Rust Teams Health Summit alongside, and Oxidize follows in Berlin September 14 to 16, so #11 or #12 wants a conference-shaped section. The next-gen trait solver going default-on-nightly is a slow-burn story worth tracking through perf triage.
