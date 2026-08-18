# "How I make this" — Substack statement

Paste-ready for Substack's process disclosure field (Settings → Publication details → How I make this).
Publication: Rust Systems & Agentic AI (ddonprogramming.substack.com)

---

## Short version (if the field is tight, use this)

Rust & AI Weekly is a vetted sweep of crates and tools where Rust meets AI. Every entry carries a maintenance signal, a latest release, and an adoption verdict: Adopt, Trial, Assess, or Hold.

I use AI agents to do the sourcing and the first draft. I use a second, independent research pass to check the claims. The verdicts are mine, and nothing ships without me reading it.

Sourcing sweeps This Week in Rust, lib.rs, crates.io, and the other ecosystem newsletters, then dedupes against everything this series has already covered. Versions and release dates get re-checked on the day of publication, because releases land overnight. Claims from an announcement post get verified against the repository, and where a maintainer's number is an estimate rather than a benchmark, I say so in the entry. Where a project has real competition, I name it, even when that weakens the story.

I correct in public. If a version, a name, or a claim is wrong, it gets fixed and the fix is visible rather than quietly edited.

What AI does here: gathering, cross-referencing, drafting, and checking my work. What it does not do: decide the verdict, or publish. A thin week gets called thin.

---

## Longer version (if the field allows more, or for an About page)

**What this is.** Rust & AI Weekly is a curated sweep of crates and tools showing up where Rust meets AI, written for engineering leaders rather than for tourists. Every entry carries three things: a maintenance signal, a latest release with a date, and an adoption verdict from the ThoughtWorks vocabulary (Adopt, Trial, Assess, Hold). The verdicts accumulate into a live radar at decebaldobrica.com/radar, so you can see when something moves from Assess to Trial and read why.

**How the sourcing works.** A weekly automated pass sweeps This Week in Rust, lib.rs, crates.io, and the other ecosystem newsletters, including the Go and JavaScript ones, because a tool trending in another language usually means someone should ask what the Rust answer is. Candidates get deduped against every issue this series has published, so a repeat feature is framed as an update with a verdict arc rather than presented as news.

**How the checking works.** Candidates are scored against a fixed rubric: problem fit, maturity, release cadence, stewardship and bus factor, ecosystem fit, cost of adoption, cost of exit. Versions and release dates are re-checked on publication day. Claims made in an announcement post are verified against the repository, and the gap between the two sometimes becomes the story. When a maintainer's headline number is an arithmetic illustration rather than a measured benchmark, the entry says which. When a project is one of several in a crowded category, the entry names the incumbent, including when that makes the pick less exciting.

**Where AI is involved, precisely.** AI agents do the gathering, the cross-referencing, the first draft, and a second independent pass whose job is to find where the first draft is wrong. That second pass regularly changes entries: wrong versions, stale API names copied from an announcement, overstated novelty. What AI does not do is set the verdict or press publish. I read every issue before it goes out, and the editorial judgment is mine to be wrong about.

**Corrections.** Mistakes get fixed visibly rather than silently. If an entry misstated a version, a maintainer's name, or a capability, the correction is stated as a correction.

**Bias and limits.** Star counts and download numbers are approximate and move fast. Absence of independent reception is reported when it is true, because "nobody has tried this yet" is a real signal. I write about Rust because I work in it, which makes me enthusiastic and therefore worth reading skeptically. Thin weeks get called thin.
