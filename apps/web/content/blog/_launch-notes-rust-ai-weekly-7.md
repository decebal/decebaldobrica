# Launch pack — Rust & AI Weekly #7

Live URL (verify 200 first): https://decebaldobrica.com/blog/2026-08-11-rust-ai-weekly-7
Source file: `apps/web/content/blog/2026-08-11-rust-ai-weekly-7.mdx` (already renamed to match the slug — no `git mv` needed)
Canonical for syndication (dev.to / Hashnode / Medium): same URL.

Assets:
- Radar image: `apps/web/public/images/radar/2026-08-11-radar.png` (56 tools, issue #7)
- Issue card (X / LinkedIn / OG): `docs/social/rust-ai-weekly-7-card.png` (source: `rust-ai-weekly-7-card.svg`); 1250px copy at `apps/web/public/images/social/2026-08-11-rust-ai-weekly-7.png`
- Hook card (standalone LinkedIn/X image for the "thought for the week"): `docs/social/publish-the-audit.png` (source: `publish-the-audit.svg`, plus `publish-the-audit.html` for the Playwright path)

---

## Substack (draft only — never publish from automation)

**Title:** Rust & AI Weekly #7: publish the audit

**Subtitle:** Today's issue: webrtc-rs ships its Sans-I/O rewrite and grades its own roadmap, FalkorDB moves 80,000 lines of graph engine to Rust for GraphRAG, and a btop for your Claude Code context window.

**Body:** paste the HTML below into the ProseMirror editor (it parses h2s, bold links, inline code, and italics cleanly). Radar image: drop the PNG onto the placeholder line, then re-check placement.

```html
<p>Welcome back to <strong>Rust &amp; AI Weekly</strong>, the curated, vetted sweep of crates and tools showing up where Rust meets AI. Today's issue: webrtc-rs ships its Sans-I/O rewrite and grades its own roadmap, FalkorDB moves 80,000 lines of graph engine to Rust for GraphRAG, and a btop for your Claude Code context window. The theme this week is <strong>publish the audit</strong>: the lead story ships a scorecard of its own January promises, including the ones it broke; the graph database rewrite counted its test scenarios before it was allowed to count benchmarks; and even the Rust project itself wrote down the rules for auditing AI-written contributions. Roadmaps age; audits compound.</p>
<p><em>(Status lines reflect public signals as of August 11, 2026; stars and downloads are approximate and move fast.)</em></p>
<p>[[[ DROP 2026-08-11-radar.png HERE — caption: This week's radar: five new entries join the map, and kache logs yet another return visit. Link caption to https://decebaldobrica.com/radar ]]]</p>
<h2>Pick of the week</h2>
<p><a href="https://webrtc.rs/blog/2026/07/31/announcing-webrtc-v0.20.0.html"><strong>webrtc 0.20</strong></a> — the most complete batteries-included Rust WebRTC implementation shipped the first stable release of its ground-up rewrite, and it matters to this newsletter for a simple reason: WebRTC is the transport under most real-time voice and video AI agents, and until now this option was a Tokio-coupled callback maze. The new architecture is Sans-I/O: the protocol state machines live in a separate <code>rtc</code> core you can test by feeding bytes and advancing a virtual clock, and the async crate on top is a thin driver with one handler trait replacing six-plus callback registrations. That design is a quiet vindication of <a href="https://github.com/algesten/str0m">str0m</a>, the sans-I/O Rust WebRTC stack that has been arguing this shape for years and already powers production SFUs. The <code>Runtime</code> trait became a genuine extension point late in the cycle, so runtime choice is per connection (Tokio, smol, or one you wrote yourself) rather than per binary, and the benchmarks come with receipts: data channels beat Pion by 1.7 to 3.2x in multi-connection aggregate at roughly a quarter of the CPU cycles per byte, while the release post admits plainly that single-connection default config still loses to Go's scheduler. What earns the pick, though, is the scorecard section: the team lined up January's published design against what shipped, and printed the misses next to the wins (no stream API, <code>&amp;self</code> instead of the promised <code>&amp;mut self</code>, an unfilled browser-interop matrix, two metrics simply unmeasured). The migration from 0.17.x is a real port, not a version bump, and 0.17.x is now bug-fix-only, so this belongs on a calendar the way syn 3 did last issue. Go deeper with <a href="https://webrtc.rs/blog/2026/07/18/from-13-mbps-to-beating-pion">From 13 Mbps to Beating Pion</a>, the performance war story behind the throughput table.</p>
<p><em>Maintenance: actively maintained (webrtc-rs org; Sans-I/O rtc core underneath) · Latest: v0.20.2 (Aug 11, 2026; 0.20.0 landed Jul 31, two patches since, and a 0.21 alpha already tagged) · Adoption: <strong>Trial</strong>; the architecture is right and the receipts are honest, but the stable line is two weeks old and still taking patches, so port a non-critical service first</em></p>
<h2>Data &amp; graphs</h2>
<p><a href="https://www.falkordb.com/blog/rewriting-falkordb-in-rust/"><strong>FalkorDB's Rust engine</strong></a> — the graph database that anchors a lot of GraphRAG stacks published the story of rewriting its core in Rust, and Dvir Dukhan and Avi Avni put the receipts in the first paragraph: 80,000 lines of Rust, 357 merged pull requests, 1,585 TCK scenarios and 1,322 flow tests green, on an engine built over GraphBLAS sparse matrix algebra. The discipline is the story. The team held the order in the post's own subtitle, "make it work, make it stable, then make it fast": correctness was measured against the C engine's own suite before performance was allowed to matter, and the spring optimization work (columnar batch execution, string interning, fused traversals) then brought the Rust engine to parity or better. The AI angle cuts both ways: this is infrastructure for knowledge graphs and GraphRAG, and it was built with coding agents taking the bounded work while, in the team's words, humans made every design decision and reviewed every change. That sentence is doing a lot of quiet work as a template for how teams should describe agent-assisted rewrites. Note the honest caveat they include too: everything in the post runs today, but the Rust engine is still a preview, and the code has since moved into the <a href="https://github.com/FalkorDB/FalkorDB">main FalkorDB repo</a>.</p>
<p><em>Maintenance: actively developed (FalkorDB team; Dvir Dukhan and Avi Avni; human review on every change) · Latest: preview engine at C-parity (post published Aug 3, 2026) · Adoption: <strong>Assess</strong>; it is a preview by the team's own label, so watch for the release that makes it the default before betting production graphs on it</em></p>
<h2>Agents &amp; AI</h2>
<p><a href="https://github.com/arian-shamaei/anthropometer"><strong>amtr</strong></a> — Arian Shamaei built a btop-style monitor that attaches to a Claude Code session and shows, live, exactly what is in the model's context window: a context map, cache economics, and subagent activity. Every team running coding agents eventually asks "what is actually in the context right now", and until now the honest answer was a shrug. The recursive twist is that amtr was itself vibe-coded in Claude Code, which means the complete token-level record of its own construction sits on disk in the very format it reads, and the repo ships a <a href="https://github.com/arian-shamaei/anthropometer/tree/main/docs/autopsy">forensic autopsy</a> of that build: 152 hours 41 minutes across 1,235 turns, roughly $1,046, and for every fresh token the model read it re-read about 120,000 from cache, a ~98% hit rate overall. That autopsy is the most concrete public accounting of what a long agentic build actually costs that I have seen, and it is worth reading before your next planning conversation about agent budgets.</p>
<p><em>Maintenance: brand new, solo maintainer (Arian Shamaei) · Latest: v0.1.5 (Jul 30, 2026) · Adoption: <strong>Assess</strong>; a 0.1.x tool, but context observability is a category your team already needs, and the autopsy is required reading either way</em></p>
<p><a href="https://github.com/jyjeanne/okf-rs"><strong>okf-rs</strong></a> — Jeremy JEANNE's Rust CLI attacks the problem amtr measures, and it comes with the week's best example of a maintainer auditing his own pitch. The premise: an agent asked "who calls this function?" greps, opens half a dozen files, and pays full file size in context to answer what is fundamentally a lookup. So <code>generate</code> walks a repo with tree-sitter across eleven languages and emits an Open Knowledge Format bundle, one Markdown file per module, struct, function, or method, each with a YAML header, a signature, and cross-linked callers and callees; <code>okf-mcp</code> then serves queries over it to any MCP client. Set the token arithmetic aside for a moment, because the design bet is the durable part: output is deterministic and the artifact is plain Markdown, so the bundle is git-diffable, reviewable in a PR, and readable with no runtime, no vector store, and no SDK in the way. That distinguishes it from the SQLite-and-vector-index approach the rest of this category takes, and it is a real distinction. It is not, however, a new category. <a href="https://github.com/colbymchenry/codegraph">CodeGraph</a> sits at 66k stars doing the same "pre-index once, query the index" thing, <a href="https://github.com/aovestdipaperino/tokensave">tokensave</a> is already a Rust port of it, and OKF is Google's format rather than his. Jeremy knows all this; the repo ships its own gap analysis against the incumbents, which is more intellectual honesty than the Medium headline's "a new Rust tool" suggests. Now the audit. The announcement leads with a ~400x reduction, roughly 6,000 tokens read by hand against about 15 through a graph query, and he labels it a rule-of-thumb illustration in both the post and the README rather than passing it off as a benchmark. He then publishes the number that cuts against him: registering the tools costs tokens too, and on a small familiar codebase a session asking one or two structural questions can spend more on schema registration than it saves on answers. So in August he collapsed thirteen narrow <code>graph_*</code> tools into a single <code>graph(relation=...)</code>, taking <code>tools/list</code> from eighteen tools and about 1,560 tokens down to six and about 1,215. That one is measured, and he shipped an <code>okf-mcp --benchmark</code> mode so the session-level accounting stops being an estimate. A maintainer who cuts two-thirds of his own API surface because he measured his own thesis and lost is doing the thing this issue is about.</p>
<p><em>Maintenance: one human maintainer (Jeremy JEANNE) directing coding agents, which the commit history shows plainly; zero external contributors; MIT/Apache-2.0 · Latest: v0.4.0 (Aug 7, 2026; four releases in ten days, then quiet) · Adoption: <strong>Assess</strong>, and read the caveats: it is not on crates.io and both names its workspace wants are already taken there, so <code>cargo install --git</code> or a release binary is the only path; there is no independent technical reception yet; and its own knowledge bundle is gitignored, so the git-native claim is not browsable in its own repo. If you want this capability in production this quarter, evaluate CodeGraph or its Rust port first. Read okf-rs for the design argument and the measurement discipline, which are worth more than its star count</em></p>
<p><a href="https://github.com/GCWing/BitFun"><strong>BitFun</strong></a> — a desktop agent suite pairing a Rust agent runtime with a Tauri shell: a Code Agent, a general-purpose Cowork Agent, and Computer Use, with the interesting design bet that the agent builds a live interface per task (a chart, a board, a form) and binds the conversation to that interface's state. The performance claim worth noting is a resident cross-turn index the project says cuts search time by up to 94.6% on Chromium-scale trees, roughly 36x on average. Claims is the operative word: the project is at 0.2.17 after a burst of releases, and every number here is self-reported, including a 98.67% cache hit rate on a SWE-Bench-Pro run. It lands on the radar because the Rust-runtime-plus-Tauri-shell shape is becoming the default architecture for desktop agents (goose made the same call with TypeScript up top), and BitFun is the most complete open example of it this week.</p>
<p><em>Maintenance: actively developed (GCWing) · Latest: v0.2.17 (Aug 2026) · Adoption: <strong>Assess</strong>; try the installer, read the runtime, and treat every benchmark claim as unverified until someone reproduces it</em></p>
<h2>Language watch</h2>
<ul>
<li><strong>Polonius alpha is on nightly</strong> — the <a href="https://blog.rust-lang.org/2026/08/04/enabling-polonius-alpha-on-nightly/">next iteration of the borrow checker</a> was enabled on nightly this week (Aug 4); it accepts more correct programs, and the team wants real-world reports before stabilization.</li>
<li><strong>rust-lang/rust adopted an LLM policy</strong> — <a href="https://blog.rust-lang.org/inside-rust/2026/08/05/rust-langrust-is-adopting-an-llm-policy/">announced Aug 5</a>; the ecosystem's newsletters cheered it, and the sharper read is that it is a management document: it makes contributors accountable for AI-assisted changes rather than banning or blessing the tools.</li>
<li><strong>wasm32-wasip3 toward Tier 2</strong> — the <a href="https://github.com/rust-lang/compiler-team/issues/1001">compiler MCP</a> entered final comment period this week; wasip3 brings the component-model async story with it.</li>
<li><strong>Atomics go const, asm! gets wider</strong> — <a href="https://github.com/rust-lang/rust/pull/160079">const atomic operations</a> merged this week, and <a href="https://github.com/rust-lang/rust/pull/159525">passing 128-bit integers via vector registers with <code>asm!</code> on x86</a> was stabilized.</li>
</ul>
<h2>In brief</h2>
<p><a href="https://github.com/kunobi-ninja/kache/releases/tag/v0.13.0"><strong>kache 0.13.0</strong></a> — sixth minor since June: cache keys now include the env vars proc-macros read, closing a correctness hole most build caches ignore; Trial verdict from issue #3 holds · <a href="https://kunobi.ninja/blog/kobe-101-leasing-kubernetes-clusters"><strong>kobe</strong></a> — same Kunobi stable as kache: a Rust operator that keeps pools of pre-warmed ephemeral clusters and hands them out as TTL-enforced leases, so CI gets a clean isolated cluster in seconds instead of minutes · <a href="https://crates.io/crates/index_type"><strong>index_type</strong></a> — TWiR 663's Crate of the Week, self-suggested by Roee Shoshani: strongly typed indices for collections, so a <code>UserIdx</code> never indexes the orders table · <a href="https://dev.to/sicklefire/mvis-v050-new-release-5997"><strong>mvis 0.5.0</strong></a> — sicklefire's terminal memory visualizer grows a CI/CD layer: JSON/CSV export, differential leak detection, growth-rate monitoring · <a href="https://crates.io/crates/proxelar"><strong>Proxelar 0.5.1</strong></a> — Emanuele Micheletti's Rust intercepting proxy (HTTP/HTTPS/WebSocket, Lua scripting) adds sessions, rules, and more capture modes · <a href="https://github.com/jchultarsky/mirador/releases/tag/v1.0.0"><strong>mirador 1.0.0</strong></a> — jchultarsky's personal terminal dashboard hits 1.0 · <a href="https://github.com/kmolan/multicalc-rust/releases/tag/v0.9.0"><strong>multicalc 0.9.0</strong></a> — scientific computation for embedded and robotics systems, by kmolan · <a href="https://github.com/timescale/rsigma/releases/tag/v0.20.0"><strong>RSigma 0.20.0</strong></a> — Mostafa Moradian's single-binary Sigma detection toolkit (parser, linter, evaluator, correlation engine, MCP and LSP servers), shipped alongside his candid two-part <a href="https://mostafa.dev/the-state-of-rsigma-7ba0a99020d9">State of RSigma</a>, itself a small entry in this week's publish-the-audit genre.</p>
<h2>Elsewhere</h2>
<ul>
<li>Go-land's desktop story moved: <a href="https://v3.wails.io/blog/wails-v3-beta/">Wails v3 landed in beta</a> by Lea Anthony, with multi-window support and experimental mobile, via Golang Weekly. The Rust seat at that table is Tauri, sitting at 2.11.5 and several major versions into stability; this issue's BitFun ships on it. For once the Rust side is the incumbent.</li>
<li>Charm's <a href="https://github.com/charmbracelet/fantasy">Fantasy</a> turned up in Golang Weekly: a Go library for building AI agents across multiple providers and models behind one API. The Rust answer is rig, which has held Trial on this radar since issue #1 and has the named production adopters Fantasy is still collecting.</li>
<li>Lukas Herman wrote up <a href="https://pulsebeam.dev/blog/moving-to-thread-per-core">how PulseBeam cut its WebRTC SFU's P99.99 latency from 70ms to 10ms</a> by moving from Tokio work-stealing to thread-per-core, gaining 25% capacity on the way. Read it next to this issue's lead: their SFU runs on str0m with a per-thread <code>LocalRuntime</code>, and webrtc 0.20's dedicated-reactor benchmark tells the same story from the library side. On latency-bound real-time paths, scheduler choice is the architecture.</li>
</ul>
<h2>A thought for the week</h2>
<p>The strongest pattern this week is not a crate, it is a genre: the self-audit. webrtc-rs printed its January roadmap next to what shipped and labeled the gaps. FalkorDB refused to benchmark until the test suite said the rewrite was correct. okf-rs measured its own headline claim, found the case where it fails, and deleted two-thirds of its own API surface in response. flodl did the same thing two issues ago with its own instruments. The reason this matters to engineering leaders is that roadmaps are cheap to write and expensive to check, so almost nobody checks them in public, and the teams that do are handing you their most reliable signal for free. When you evaluate a dependency, or a vendor, or for that matter a quarterly plan, ask for the column that lists what was promised and did not ship. Teams that publish that column have already done the hardest part of engineering management, which is telling the truth on a schedule.</p>
<h2>Before I go</h2>
<p>The quote of the week comes from Koosha on the Rust users forum, abandoning a macro experiment because "the macro rules were turning into a turing complete rust syntax parser". Every proc-macro author has lived that sentence; it is also, quietly, the case for syn 3 from last issue.</p>
<p>Also worth your time: Sylvain Kerkour wrote up <a href="https://kerkour.com/firecracker-sandboxing-rust">how Firecracker microVMs sandbox untrusted code and AI agents</a> under the hood. If you run agent-generated code anywhere near production, this is the isolation layer to understand.</p>
<p>That's the issue. Got a Rust+AI crate or tool I should feature next week? Reply and tell me; reader picks shape the list.</p>
<p>Keep shipping,<br>Decebal</p>
```

---

## X hook (271 chars)

Attach: `docs/social/rust-ai-weekly-7-card.png`

> Rust & AI Weekly #7 is out: publish the audit.
>
> webrtc-rs ships its Sans-I/O rewrite and grades its own January roadmap, misses included. FalkorDB moves 80k lines of graph engine to Rust. Two Rust tools go after your agent's context bill.
>
> https://decebaldobrica.com/blog/2026-08-11-rust-ai-weekly-7

### X thread replies (optional, post in order)

**Reply 1 — the measurement**

> The amtr autopsy is the number I keep thinking about: 152h41m, 1,235 turns, ~$1,046, and for every token the model read fresh it re-read ~120,000 from cache.
>
> A 98% cache hit rate is not a footnote. It's the economics of long agentic builds.

**Reply 2 — the fix**

> okf-rs goes at it from the other end: tree-sitter your repo into a deterministic Markdown call-graph bundle, then serve it over MCP. Parse once, not per question.
>
> Best part: the author measured that registering his tools cost more than they saved on small repos, then deleted two-thirds of his own API surface.

## LinkedIn hook

Attach: `docs/social/publish-the-audit.png`

> Every engineering team publishes a roadmap. Almost none publish the audit.
>
> This week the Rust WebRTC stack shipped the first stable release of a rewrite it designed in public back in January. The release post does something rare: it lines up the original design next to what actually shipped, and prints the misses. No stream API. &self where they promised &mut self. A browser-interop matrix with one cell filled. Two success metrics simply marked unmeasured.
>
> Same week, FalkorDB published its Rust rewrite: 80,000 lines, 357 PRs, and a rule that no benchmark counted until 1,585 test scenarios from the old C engine were green.
>
> Roadmaps are cheap to write and expensive to check, so almost nobody checks them in public. The teams that do are handing you their most reliable signal for free.
>
> So when you evaluate a dependency, a vendor, or a quarterly plan, ask for the column listing what was promised and did not ship. Teams that publish that column have already done the hardest part of engineering management: telling the truth on a schedule.
>
> Issue #7 of Rust & AI Weekly has the verdicts, plus a live radar of 56 crates rated Adopt/Trial/Assess/Hold:
>
> https://decebaldobrica.com/blog/2026-08-11-rust-ai-weekly-7

### Alternate LinkedIn post (context economics angle — use if the audit angle underperforms, or schedule mid-week)

Attach: `docs/social/rust-ai-weekly-7-card.png`

> Your coding agent's real bottleneck is probably not model capability. It's that it keeps paying full price to re-read things it already knows.
>
> Two Rust tools in this week's issue come at that from opposite ends.
>
> One attaches to a live agent session and shows you exactly what is in the context window right now: the map, the cache economics, the subagents. Its author then published a forensic autopsy of building it — 152 hours, 1,235 turns, and for every token the model read fresh, roughly 120,000 re-read from cache.
>
> The other stops the re-reading. It parses your repo once into a plain Markdown call-graph bundle, then serves it to any agent over MCP. "Who calls this function?" changes from grep-open-and-skim-six-files into one lookup. The expensive work happens at build time, not per question.
>
> The pattern worth stealing, whichever tools you use: measure the context budget before you optimise it, and move repeated lookups out of the token path entirely. Both are ordinary engineering discipline applied to a new cost centre.
>
> Verdicts on both, plus a radar of 56 Rust and AI crates rated Adopt/Trial/Assess/Hold:
>
> https://decebaldobrica.com/blog/2026-08-11-rust-ai-weekly-7

## r/rust + TWiR blurb

> Rust & AI Weekly #7: engineering-leadership verdicts on webrtc 0.20 (the Sans-I/O rewrite, plus its self-graded roadmap), FalkorDB's 80k-line Rust graph engine, amtr (a btop for Claude Code context windows), okf-rs (codebase to deterministic Markdown call-graph bundle, served over MCP), and BitFun, plus a radar of 56 tools rated Adopt/Trial/Assess/Hold.
> https://decebaldobrica.com/blog/2026-08-11-rust-ai-weekly-7

## dev.to / Hashnode notes

- Title: `Rust & AI Weekly #7: publish the audit`
- Canonical URL: `https://decebaldobrica.com/blog/2026-08-11-rust-ai-weekly-7`
- Cover image: `docs/social/rust-ai-weekly-7-card.png`
- Tags: rust, ai, webrtc, opensource

## Reader-pick credit and verification notes

okf-rs came in as a reader pick from Jeremy JEANNE's Medium write-up. Worth a reply to him once the issue is live — he explicitly asked whether the approach holds up on other codebases, and the entry credits his measurement discipline, so the note should be warm. Worth mentioning in issue #8's intro that reader picks are landing; it's the cheapest way to get more.

Verified against the repo on Aug 11 before publishing. What the check changed:

- **The Medium post's MCP tool names are stale.** The 13 `graph_*` tools were consolidated into one `graph(relation=...)` on Aug 7, *before* the v0.4.0 tag. The draft originally reproduced the old names from the post; corrected, and the consolidation became the entry's best detail.
- **crates.io is worse than "not published yet":** both `okf-cli` and `okf-mcp` are already taken there by unrelated projects, so publishing under those names is blocked without a rename.
- **Prior art is decisive:** CodeGraph is at 66k stars on the same thesis, tokensave is already its Rust port, and OKF is Google's format. The entry now says so, and credits Jeremy for shipping his own gap analysis against the incumbents.
- **Zero independent reception.** No HN, no r/rust, no TWiR; the only third-party article is paywalled affiliate content. Any line implying traction was cut.
- **Confirmed as claimed:** 11 languages via tree-sitter, Tantivy ranked search, optional OpenAI-compatible enrichment, `okf-arch` with Clauset-Newman-Moore clustering, two-way DITA bridge, 18-crate workspace, `pr-review.yml`, MIT/Apache-2.0 dual.
- **Note if anyone asks:** its own `/knowledge` bundle is gitignored, so the flagship git-diffable artifact isn't browsable in its own repo. The README does frame commit-vs-ignore as a legitimate choice, so this is an observation, not a gotcha.
