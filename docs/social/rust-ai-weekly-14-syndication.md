---
title: "Rust & AI Weekly #14: Miri's fix leaves old caches to clean up"
published: false
canonical_url: https://decebaldobrica.com/blog/2026-09-28-rust-ai-weekly-14
cover_image: https://decebaldobrica.com/images/blog/2026-09-28-rust-ai-weekly-14-3d-hero.png
description: 'Miri cache security, rmcp 3.5.0, Symposium, Wild and fastlogging, with evidence and scoped verdicts.'
tags: rust, ai, security, devtools
---

![A silver wolf watches an open graphite storage drawer containing metal tiles and a red key.](https://decebaldobrica.com/images/blog/2026-09-28-rust-ai-weekly-14-3d-hero.png)

*Cached build output can contain credentials. Original 3D illustration; not a system diagram.*

On September 21, the [Rust security team warned](https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/) that Miri was saving environment variables into `target/`. In jobs that exposed secrets and cached that output for pull requests to restore, credentials could travel with the build cache.

The fix is in the September 22 nightly. A patched run cannot erase an older cache. If your workflow matched those conditions, the cleanup includes clearing affected caches and deciding whether exposed credentials need rotating.

If you maintain Rust services, start with the cache checklist below. The other four evaluations help scope a dependency upgrade or a small trial: rmcp's transport edge cases, Symposium's generated guidance, Wild's link times, and fastlogging's delivery path.

**Rust & AI Weekly #14** covers September 21–28, with older material labelled where it deserves a second look. Public sources were checked on September 28. Verdicts are engineering assessments from source review, not claims that I ran every tool in production.

[![Rust and AI Crate Radar for September 28: 84 tools across Adopt, Trial, Assess and Hold.](https://decebaldobrica.com/images/radar/2026-09-28-radar.png)](https://decebaldobrica.com/radar)

*Five evaluations: four additions and one returning tool. This snapshot covers 84 tools: 15 Adopt, 34 Trial, 33 Assess and 2 Hold. Older entries retain their previous review dates. [Explore the radar](https://decebaldobrica.com/radar).*

## Miri: keep the tests, repair the cache boundary

[**Miri**](https://github.com/rust-lang/miri) receives **Adopt for targeted undefined-behaviour testing**, with a clean, patched CI setup. Miri executes tests under an interpreter; a passing run is not a proof that every safe caller or thread interleaving is sound.

If you lead the team, assign the cache cleanup alongside the toolchain upgrade. Ask for the affected cache keys, the jobs allowed to restore them, and a recorded decision on credential rotation. Those are concrete outputs another engineer can review.

GitHub's [cache documentation](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching) explains why the restore side needs its own check. Pull requests can restore caches from their base branch, including in fork scenarios. Review who can create the files and who can read them.

### What is fixed

[Ralf Jung's patch](https://github.com/rust-lang/miri/pull/5337) merged on September 21. The saved environment now keeps `OUT_DIR` and `CARGO_` variables, excluding names ending in `_TOKEN`, instead of collecting the entire environment.

The [September 22 nightly manifest](https://static.rust-lang.org/dist/2026-09-22/channel-rust-nightly.toml) identifies the build commit; its [cargo-miri source](https://github.com/rust-lang/rust/blob/1303417c416e1595173d9689e7394c31e136ae95/src/tools/miri/cargo-miri/src/util.rs) contains that filter. The manifest also lists an available Miri component for aarch64 macOS. This is a nightly toolchain component, not a new stable Rust release.

For an affected workflow, the advisory's cleanup is concrete:

- Upgrade the pinned nightly to a patched build.
- Keep secrets out of the Miri step, or disable caching for that job while correcting it.
- Clear affected caches after changing the workflow.
- Consider rotating credentials that may have been exposed.

I would review workflow-level `env` declarations first, then any earlier step that persists values into later steps. Record which cache keys contained affected output. A successful patched run says nothing about whether a previous cache still contains credentials.

### Where Miri earns its place

The [project documentation](https://github.com/rust-lang/miri#readme) lists checks for use-after-free, invalid values, alignment errors and data races. Its limits are equally useful: many platform APIs and FFI calls are unsupported, and a run explores only particular executions. Its default isolation is explicitly not a security sandbox.

For an unsafe parsing or data-structure crate, I would start with the smallest tests that exercise its safety contract. Keep ordinary tests alongside them. If scheduling matters, vary the execution seed; use a specialised concurrency tool where the state space demands it. Avoid turning the first unsupported syscall into a reason to abandon the smaller tests that do work.

- **Maintenance:** Rust project tooling, with a publicly reviewed security fix. MIT/Apache-2.0 licence files are in the repository.
- **Latest:** fix verified in nightly-2026-09-22 source. Pin a compatible patched nightly; there is no standalone stable semver upgrade in this advisory.
- **Adoption:** Adopt for targeted CI tests. Budget for interpreter and platform limitations, and keep credential handling outside those jobs.

## rmcp 3.5.0: test beyond a successful tool call

A successful tool call leaves other transport paths untested. Duplicate headers, browser origins and empty optional fields each need their own cases. The rmcp changes below give you specific failures to check before an upgrade reaches the client and server pair your users depend on.

[**rmcp 3.5.0**](https://github.com/modelcontextprotocol/rust-sdk/releases/tag/rmcp-v3.5.0), the official Rust MCP SDK, shipped on September 28 at 00:16 UTC. **Trial**, unchanged from [issue #11](https://decebaldobrica.com/blog/2026-09-07-rust-ai-weekly-11).

The preceding 3.4.1 release arrived September 23. Both are ordinary releases, without prerelease suffixes. The [registry](https://crates.io/crates/rmcp) declares Rust 1.88 as the minimum supported version for 3.5.0.

Three fixes are worth testing against your actual client and server pair:

- **Duplicate headers:** [PR 1274](https://github.com/modelcontextprotocol/rust-sdk/pull/1274) rejects repeated `Mcp-Method`, `Mcp-Name` and `Mcp-Param-*` field lines. Previously, validation read only the first value, silently ignoring subsequent values.
- **Default ports:** [PR 1270](https://github.com/modelcontextprotocol/rust-sdk/pull/1270) lets an HTTPS allowlist entry with an explicit port 443 match a browser `Origin` that omits that default port. It resolves the incoming origin's effective port.
- **Empty cache scope:** [PR 1281](https://github.com/modelcontextprotocol/rust-sdk/pull/1281) treats an empty or null `cacheScope` as absent. Previously, the deserialisation fallback could leave callers without typed access to the returned tools or resource contents.

### The protocol constant also changed

Version 3.5 adds `LATEST_WITH_INITIALIZE`. The [versioned source](https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.0/crates/rmcp/src/model.rs) distinguishes `LATEST`, currently the July 28, 2026 protocol, from the latest revision that uses the older initialise handshake, November 25, 2025.

If an adapter uses `LATEST` when it means “the handshake version”, review that assumption. The new constant makes the distinction explicit. It does not tell you which protocol every deployed peer supports.

My Trial check would include a browser-origin request, a deliberately duplicated method header, and a tool-list response with an empty cache scope. Keep the dependency and lockfile change small enough to attribute a regression, then repeat those tests through the proxy or gateway used in production.

The [licence file](https://github.com/modelcontextprotocol/rust-sdk/blob/rmcp-v3.5.0/LICENSE) also deserves precise wording. The registry says Apache-2.0, while the repository describes a transition in which some earlier contributions remain MIT until consent is obtained. Preserve the applicable notices when distributing it.

- **Maintenance:** official MCP organisation, with releases and merged fixes this week. Approximately 4,000 GitHub stars as checked September 28.
- **Latest:** 3.5.0, September 28; Rust 1.88. Version 3.4.1's transport fallback fix is also included in this week's upgrade window.
- **Adoption:** Trial. Useful fixes justify evaluation; they do not remove the need to test protocol negotiation and error handling in your integration.

## Symposium: match agent guidance to dependencies

If an agent recommends APIs from a different version of your dependency, your review has to catch the mismatch. [**Symposium**](https://symposium.dev/) scans a Rust workspace and matches agent extensions to its dependency graph. **Assess**: verify which guidance the installed version adds before widening the setup to more projects.

The Rust Foundation's [September 25 introduction to its next livestream](https://rustfoundation.org/media/your-ai-agent-is-writing-rust-but-is-it-good-explore-on-this-upcoming-livestream/) puts maintainers Jack Huey and Niko Matsakis on the programme for October 1 at 16:00 UTC. That announcement is this week's news. It is not evidence of a September crate release.

### Check which version the instructions describe

The [registry's latest release](https://crates.io/crates/symposium) remains 0.4.0 from May 14. Its [release notes](https://github.com/symposium-dev/symposium/releases/tag/symposium-v0.4.0) cover self-update behaviour and mirroring user-authored skills between agent directories. The [tagged README](https://github.com/symposium-dev/symposium/blob/symposium-v0.4.0/README.md) still labels the software pre-alpha.

There is documentation drift to resolve during an evaluation. The [live installation page](https://symposium.dev/install.html) says crate-defined plugins without the central repository are a future step. The current README describes resolving crate-sourced skills through package metadata, and 0.3.0's release notes already mention crate-sourced skill resolution. Those statements describe different pieces of distribution; they should not be flattened into a claim that every crate automatically ships a plugin.

The [current README](https://github.com/symposium-dev/symposium#readme) shows matching by crate name and version requirement, with richer predicates for files, environment and shell checks. It translates a shared configuration into agent-specific files. Skills reach seven listed agents, but hook support differs; OpenCode and Goose are listed as skills-only.

### Start with one repository

For a trial, I would select project-scoped hooks and review the configuration for automatic synchronisation and self-updates. The documented defaults favour convenience: global hook scope, automatic sync, and self-update enabled. A team needs to know when its agent's instructions change as well as when its code dependencies change.

Inspect the generated files and selected plugin sources before widening that setup. Then choose a real dependency migration with a known acceptance test. Compare the result with the project's existing instructions: correct API usage, fewer manual corrections, and a reproducible set of loaded guidance would be useful evidence.

- **Maintenance:** Jack Huey, Niko Matsakis and the Symposium core team are registry owners; repository activity continued September 25. MIT OR Apache-2.0, confirmed in the licence text.
- **Latest:** 0.4.0, May 14, not a fresh release. Current website and main-branch documentation need checking against the version you install.
- **Adoption:** Assess. Keep the initial experiment local to one project and record exactly which extensions it adds or updates.

## Wild: benchmark the filesystem you build on

[**Wild 0.10.0**](https://github.com/wild-linker/wild/releases/tag/0.10.0), the Rust linker, enters at **Trial for supported Linux builds**. This is an older release, dated August 4. The reason to revisit it is David Lattimore's [September 18 comparison with Mold](https://davidlattimore.github.io/posts/2026/09/18/benchmarking-wild-vs-mold.html), highlighted in TWiR 670.

The two projects' published benchmarks disagreed. Lattimore checked differences that can disappear in a headline: output filesystem, whether an existing output file is removed, the linker's fork behaviour, and the versions being compared.

His Ryzen 9955HX has 16 cores and 32 threads, running Ubuntu 26.04. For `clang-release`, with ext4, output deletion between runs and `--no-fork`, he reports 0.21 seconds for Wild and 0.20 for Mold. With tmpfs, an existing output and default fork behaviour, those numbers become 0.11 and 0.19 seconds.

These are the author's measurements using release builds as of August 28, not results I reproduced. They are link times for that workload, not end-to-end Rust build times. Lattimore did not reproduce Mold's 64-core Threadripper results; his explanation of that machine's thread-count effect remains a hypothesis.

### A trial that answers your build problem

The [0.10.0 README](https://github.com/wild-linker/wild/tree/0.10.0) is explicit that incremental linking remains a goal. It lists Linux targets and distinguishes them from unsupported or incomplete platform work. The release notes contain Wasm and Mach-O development, which does not make every such target a supported replacement for its existing linker.

I would pick one Linux service where linking is a measured share of iteration time. Record the target, compiler and linker versions, filesystem, worker count, output-file policy and debug settings. Measure a clean build and the edit-build loop separately; a faster linker cannot remove time spent elsewhere in the compiler.

Run the resulting binaries and test suites as part of that comparison. Include your real linker scripts and LTO settings if you use them. Keep switching back to the existing linker a one-file configuration change while collecting results.

The author says preallocation and huge-page changes discussed in the comparison were merged for the next release. As of this check, the latest tagged release is still 0.10.0. Do not attribute those later changes to an August binary.

- **Maintenance:** active project led by David Lattimore, with contributors and sponsorship acknowledged in release notes. MIT OR Apache-2.0; about 4,000 stars on September 28.
- **Latest:** 0.10.0, August 4. September's benchmark discussion is new evidence about configurations, not a new release announcement.
- **Adoption:** Trial on a supported target. Promote it only after measuring your build loop and checking the output; no universal speed ranking follows from these tables.

## fastlogging: useful bindings, test the drain path

With a background logger, the caller can finish before the records reach their destination. If your collector slows down or a subprocess exits, test what gets written and when. [**fastlogging 0.9.0**](https://crates.io/crates/fastlogging) is **Assess**; I would run those checks before making it shared infrastructure.

TWiR 670 selected the project as Crate of the Week. Its common logging core has bindings spanning Rust, Python, C, C++, Go, Java and C#. That makes it relevant when several services need consistent logging behaviour across language boundaries.

The [September 17 changelog](https://github.com/brmmm3/fastlogging-rs/blob/master/CHANGELOG.md) adds OpenTelemetry support and Java build work. The [Rust documentation](https://github.com/brmmm3/fastlogging-rs/blob/master/fastlogging/README.md) shows an `OpenTelemetryWriterConfig` that exports batches over OTLP/HTTP. That makes an existing collector a practical destination for an experiment.

The architecture sends messages through a channel to a logging thread and then to writer threads. Console, file and network output can therefore run away from the caller. The project also documents forwarding messages from subprocesses to their parent.

### Measure completion, not only enqueueing

The [root README](https://github.com/brmmm3/fastlogging-rs#readme) explicitly qualifies its claim about slow writers: the queue must not fill. Its short timing table is not enough to choose a logging library for an application with sustained pressure or a slow collector. I am not using those numbers as a verified speedup.

A useful test should include the time to finish writing, queue pressure, memory growth and shutdown behaviour. Stop the collector while the application continues to log, restore it, then inspect what arrives. Repeat with a subprocess that exits quickly. Count the records at the destination rather than relying only on how fast the producer returned.

That exercise also exposes the integration cost. A team already using structured tracing needs to decide which fields, correlation identifiers and filtering rules it must preserve. Similar APIs across languages may reduce wrapper work, but they do not establish identical behaviour for every binding.

- **Maintenance:** Marty B. (`brmmm3`) is the sole listed registry owner; repository activity continued September 26. MIT OR Apache-2.0. Fourteen stars and 26 registry downloads at this check are early signals, not adoption proof.
- **Latest:** 0.9.0, September 17. The registry shows two published versions; the changelog's earlier initial-release date differs from the first registry upload.
- **Adoption:** Assess. Worth exploring for a mixed-language application; require shutdown, failure and backpressure evidence before making it shared infrastructure.

## Language and toolchain watch

**`Allocator` merged.** [PR 156882](https://github.com/rust-lang/rust/pull/156882) landed September 23, closing last issue's “FCP complete, still open” carry-over. The approved subset includes the allocator trait and basic custom-allocator operations for `Box` and `Vec`; remaining experimental work moves under `allocator_ext`.

Read the stabilisation report before porting a nightly allocator. It tightens safety requirements, including unwinding constraints, and explains why some custom-allocator pinning operations remain outside this subset. A merge into Rust's development branch is not availability in the current stable compiler. Keep the stable release and your project's minimum Rust version as separate checks before removing feature gates.

**Cargo gained funded maintenance capacity.** [Scott Schafer's Maintainer in Residence appointment](https://blog.rust-lang.org/2026/09/22/announcing-a-maintainer-in-residence-scott-schafer-for-the-cargo-team/) provides at least twelve months of full-time work. The announcement describes lost funding and reduced capacity in the team.

The same post says Cargo's linting system has stabilised and is due to ship in Rust 1.100.0. Treat that as the stated release destination, not a feature already shipped on stable this week.

## Across the language boundary

[Go Weekly 619](https://golangweekly.com/issues/619) points to the Go team's [portable SIMD experiment](https://go.dev/blog/simd-experiment), published September 24. Go 1.27 adds a portable, size-agnostic `simd` interface alongside architecture-specific APIs. It requires `GOEXPERIMENT=simd`; unsupported hardware uses emulation.

This is a useful companion to last issue's fearless_simd 1.0 evaluation. Compare operation coverage, fallback behaviour and the cost of maintaining architecture-specific escapes. The Go post explicitly says vector `ReduceSum` is for a later release.

## Reading list

- **[Cloudflare's smaller consistent-hash rings](https://blog.cloudflare.com/saving-100-tb-of-ram-with-math/)**, September 18, surfaced in Rust Bytes #137. The server index shrinks to 16 bits; the hash remains 32 bits. The article combines compact storage with fewer hash points and a staged migration. Its reported 100 TB saving is fleet-wide, not a promise for another deployment.
- **[Developing provably correct Rust code with Verus](https://www.amazon.science/blog/developing-provably-correct-rust-code-with-verus)**, Bryan Parno, August 31, also resurfaced in Rust Bytes. Read the binary-search specification example: a weak specification can approve a function that always returns `None`.
- **[Smarter Coding Agents for Rust with Symposium](https://rustfoundation.org/media/your-ai-agent-is-writing-rust-but-is-it-good-explore-on-this-upcoming-livestream/)**, October 1 at 16:00 UTC. A useful chance to ask maintainers how installed guidance, crate versions and update policy fit together.

Discovery this week came from [TWiR 670](https://this-week-in-rust.org/blog/2026/09/23/this-week-in-rust-670/), [Rust Bytes #137](https://weeklyrust.substack.com/p/saving-100tb-of-ram-with-rust), the Rust project and Foundation blogs, and Go Weekly. Primary release, code and documentation links support the evaluations above.

The first carry-over is resolved: `Allocator` merged. tokio_rcu remains Assess; the [documented hook](https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.on_after_task_poll), `on_after_task_poll`, is still unstable. For the next review, I want reproducible adoption evidence for fearless_simd 1.0 and a version-matched Symposium setup.

If you run Miri in CI, reply with the check your team uses to control who can restore its cached output. Include the CI platform and any boundary you still cannot verify.
