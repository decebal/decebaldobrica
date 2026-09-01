# ICP research — Rust systems + agentic AI (Wolven Tech)

Run date: 2026-08-25. Purpose: rewrite the X profile (name, bio, pinned post) in the ICP's own language.

## Scope and honesty note

The `sea-of-demand` template asks for 100+ sources, 50+ verbatim complaint quotes, and per-community
activity metrics. **This run does not meet that bar and does not pretend to.** What it is: eight
targeted searches across analyst reports, FinOps/VC writeups, agent-observability vendor research and
practitioner posts, plus the ICP definition already recorded in AllSource Prime.

Two deliberate departures from the template:

- **No verbatim quote dump.** Pain-point language below is paraphrased and characterised, not
  reproduced. Where a specific figure is cited it is attributed and linked.
- **No invented community metrics.** Member counts and posts-per-week could not be verified for the
  relevant communities, so they are marked UNVERIFIED rather than estimated. Anything below tagged
  UNVERIFIED needs a manual check before you act on it.

## The ICP, as already recorded

From Prime (`domain: linkedin-icp`, project *LinkedIn ICP Engagement (Wolven)*, created 2026-06-25):

- Newly-funded AI startups, **seed / Series A / Series B**
- **US priority**, EU/UK secondary
- Targets are org + founder nodes; engage the newest substantive post, not the funding announcement
- Seeded: 12 orgs, 8 founders. Named examples: Hyperbound (Series A, SF), Rillet (Series C, NYC),
  Neuromorphic Labs ($5.1M seed)

From `rust-contracting-actions` (50+ recorded outreach tasks):

- Rate band £450–550/day UK outside IR35, €500–650 EU, $500–700 US via W-8BEN-E
- 3–12 month contracts; contract-to-hire, some contract-to-CTO
- Sectors by volume: distributed systems (27+), AI/ML infra (25+), dev tools (16+)

**So the reader of the X profile is a technical founder or first engineering leader at a
seed-to-Series-B AI company, who has a systems problem and a budget, not a Rust hobbyist.** The
current profile is written for the hobbyist.

## Pain points, ranked

Severity = frequency × how much money or sleep it costs them.

### 1. The inference bill nobody budgeted for — severity 10

The single best-evidenced pain in the set, and the one with a real buying trigger attached.

- 73% of organisations report AI costs exceeded original projections (FinOps Foundation 2026)
- Inference is **80–90% of AI spend**, not training
- AI-first SaaS spends **40–50% of revenue** on model hosting, inference and data, against 15–20%
  COGS for traditional SaaS
- **84% of scaling-stage AI B2B companies** are seeing gross-margin erosion of 6 points or more from
  AI infrastructure alone
- Idle GPUs, egress and networking add a further 20–40% to monthly bills

The emotional shape of it: the pilot cost nothing, the feature started working, and then the bill
arrived. Training is a project with an end. Inference runs every time anyone uses the product and has
no natural stopping point. That asymmetry is what catches teams out.

**Language pattern:** they talk about *margin*, *runway*, *COGS* and *unit economics*, not about
throughput or latency. An engineer says "it's slow." This buyer says "it's eating the gross margin."

### 2. Agentic workloads multiply the bill — severity 9

- Agentic patterns consume **5–30x more tokens per task** than a chatbot turn
- Runaway cost in a multi-step workflow is usually a *behavioural* fault, not a traffic fault: an
  agent stuck in a replanning loop, redundant tool calls, context windows ballooning

This is the highest-value insight in the whole run, because **it collapses the cost pain and the
reliability pain into one problem**, and it is precisely what `claude-healthline` renders on one row:
health, drift, tool-failure loop, session cost, burn rate, today's spend. The product and the ICP's
pain are the same object. Nothing in the current profile says so.

### 3. Demo to production gap — severity 9

- An agent at 99% per-step success drops to **36.6% over 100 consecutive steps** — the "success rate
  avalanche"
- Traditional APM cannot tell you the agent picked the wrong tool, drifted from its plan, looped, or
  fabricated a policy. Failures stay invisible until a customer reports them
- Reference incidents everyone in this audience knows: Replit's assistant deleting a production
  database despite instructions forbidding it; OpenAI's Operator making an unauthorised purchase
  that bypassed confirmation

**Language pattern:** "works in the demo, fails in production" is close to a fixed phrase in this
market. Also recurring: *cascading failure*, *silent failure*, *no idea which step broke*.

Note the direct line from these incidents to Rust & AI Weekly #9's argument: an instruction in a
prompt is a naming convention, not a boundary. That essay is already ICP-native content and should
be doing more work than it currently is.

### 4. Investor pressure on per-unit inference cost — severity 8 (the actual buying trigger)

- Investors now open diligence conversations by asking what inference costs per user, and whether the
  product survives a foundation model shipping the feature natively
- Series A founders have been found not to know their per-user inference cost until an investor asked

This is the trigger to design for. It has a **deadline** attached (the next board meeting or raise),
it creates urgency the founder cannot ignore, and the remedy is a short, scoped, expensive piece of
systems work. That is exactly a 3-month Rust contract.

### 5. The Python prototype will not hold — severity 7

Evidenced but mostly through vendor and advocacy content, so treat the figures as directional:

- p99 reported dropping 400ms → 40ms after a Rust rewrite, same load on a third of the servers
- 5x lower peak memory (1.1GB vs 5.1GB), and one case of 20 EC2 instances collapsing to 2
- The settled 2026 pattern is **hybrid**: Python for the intelligence layer (research, training,
  prompt iteration), Rust for the execution layer (inference serving, embedding pipelines, vector
  search, agent runtimes)

That hybrid framing matters for positioning. "Rewrite it in Rust" reads as zealotry and loses the
room. "Keep Python where it earns its keep, move the execution layer" is the version a CTO can
repeat to their team without starting a fight.

### 6. Cannot hire the skill in time — severity 7

- Rust remains the smallest relevant talent pool, though roughly doubling every 18 months
- Senior Rust in the US: **$170–280k**; searches close in **6–12 weeks**

Do the arithmetic for them, because it is the whole contracting argument: a 6-to-12-week search plus
onboarding, against someone billing $500–700/day who starts this month and hands the work over.

## Buyer language: theirs vs yours

Your current profile speaks the left column. Your ICP speaks the right.

| You currently say | They actually say |
| --- | --- |
| Engineering Leader | I need someone senior who will not need managing |
| Full-Stack Architecture & Team Growth | can you fix this before the board meeting |
| AI Platforms | our inference bill is eating the gross margin |
| 15+ yrs in tech | has this person shipped this exact thing before |
| Rust \| TS \| Sui | do you know the execution layer, or just the language |
| I turn chaos into architecture | works in the demo, fails in production |
| — | I can't tell which step broke |
| — | per-user inference cost |
| — | our margins don't survive scaling this |
| — | we can't hire this fast enough |

The phrase to own, because it is theirs and nobody is claiming it: **execution layer**.

## Ready-to-buy signals

- Asking what per-user or per-task inference cost actually is, especially just after a raise
- Any mention of a board meeting, diligence, or gross margin in the same breath as AI spend
- "Our agent works in the demo" — pre-purchase venting, one step from a budget
- Budget already visible: $170–280k/yr salaried, or $500–700/day contract
- Current workarounds that hurt: caching bolted on late, prompt-golfing to shave tokens, cheaper
  models with quality regressions, throwing instances at a Python service
- Timeline language: next raise, next board meeting, end of quarter

## Where they gather — UNVERIFIED, needs a manual pass

This run could not confirm member counts or activity levels for specific communities, and I am not
going to invent them. Candidates worth checking manually, in rough priority:

1. **X** itself, which is where the funded-founder conversation on AI unit economics visibly happens
   and where you already have the account. Highest confidence of the set.
2. **r/AI_Agents, r/LocalLLaMA, r/mlops** — plausible for the reliability and cost-of-serving
   conversation. Verify volume before investing time.
3. **Hacker News** — where "we rewrote X in Rust" and "our inference bill" threads land. Already
   established as the better channel for repo launches.
4. **FinOps Foundation** community and its AI-cost working material — unusually on-nose for pain #1
   and #4, and almost certainly under-served by Rust engineers.
5. Founder Slacks attached to the accelerators and funds backing your Prime target list.

The gap worth noticing: the FinOps/AI-cost conversation and the Rust-systems conversation barely
overlap. You can credibly stand in both. Almost nobody else in either is trying to.

## Landmines

- **Rust evangelism.** Never "rewrite it in Rust." Always hybrid, always the execution layer.
- **Move/Sui/crypto adjacency.** For a US AI-infra founder this reads as a different profession.
  Already actioned: dropping it from the profile.
- **Benchmark theatre.** This audience has been burnt by 168x claims. Your existing habit of naming
  what is self-reported is an asset here, not a hedge.
- **Leading with credentials.** "15+ yrs, Engineering Leader" is a category. They are buying a
  specific outcome with a date on it.

## Revised profile copy

### Name (limit 50)

```
Decebal | Rust for the AI execution layer
```
41 chars. `Decebal | Rust + Agentic AI` (27) remains the safe alternative; the longer one says what
you do for them rather than what you like.

### Bio (limit 160)

Primary, ICP-first:

```
I make the AI execution layer cheap and predictable. Rust for inference,
agents and pipelines when Python stops paying for itself. 15 yrs shipping.
```
144 chars. Leads on their outcome (cost, predictability), names the hybrid framing so it can't read
as zealotry, keeps the seniority signal to four words.

Alternate, authority-first, if the newsletter is the priority:

```
Rust for the AI execution layer. I publish weekly Adopt/Trial/Assess/Hold
verdicts on the crates where Rust meets AI. 15 yrs shipping. Author of AllSource.
```
153 chars.

Dropped from the current bio and why: *Full-Stack Architecture*, *Team Growth*, *TS*, *Sui* (dilute
or repel), *I turn chaos into architecture* (generic), *liveness @iproov* (reads as employee, belongs
on LinkedIn).

### Pinned post

Pin the radar, and open on their problem rather than yours. The link stays in the post: a pin is not
distributed, it is arrived at, so its only job is conversion.

```
Most teams find out what an agent costs per task after the invoice.

Every week I read the Rust ecosystem's releases, take the ones that touch AI,
and give each a verdict: Adopt, Trial, Assess, Hold. Maintenance signal,
latest release, and an honest note on what will bite you.

65 and counting:
decebaldobrica.com/radar
```

### Header (1500x500)

Still empty. Radar quadrant grid, the four ring colours, and no text beyond
`Adopt / Trial / Assess / Hold`.

### Highest-leverage fix, unchanged by this research

Following 5,289 against 852 followers. Every visitor sees it before they read a word. Prune toward
~1,200.

## Content angles this research supports

Ranked by fit with both the ICP's pain and what you can uniquely say:

1. **Runaway agent cost is a behaviour bug, not a traffic bug.** Yours to own: `claude-healthline`
   already puts health, drift, tool-failure loop and burn rate on one line. Nobody else has both
   halves.
2. **Per-user inference cost, before an investor asks.** Highest urgency, clearest deadline.
3. **The execution layer, not the rewrite.** The hybrid architecture argument, which lets a CTO
   agree with you without picking a language fight.
4. **A boundary nobody can enforce is a naming convention.** Already written, already published, and
   Replit-deleting-the-prod-database is the case study the audience already knows.
5. **The hiring arithmetic.** 6–12 week search at $170–280k versus someone who starts this month.

## Sources

- [The inference bill nobody budgeted for — CIO](https://www.cio.com/article/4163877/the-inference-bill-nobody-budgeted-for.html)
- [FinOps AI inference GPU cost playbook 2026 — Cloudmagazin](https://www.cloudmagazin.com/en/2026/05/16/finops-ai-inference-gpu-cost-playbook-2026/)
- [LLM Inference Costs: What AI Founders Should Know — CRV](https://www.crv.com/content/llm-inference)
- [Token costs are breaking enterprise AI business cases — The Source Code](https://www.the-sourcecode.com/ai-tech/token-costs-enterprise-ai-business-case-2026)
- [The true cost of running an AI product in 2026 — Value Add VC](https://valueaddvc.com/blog/the-true-cost-of-running-an-ai-product-in-2026-gpu-api-and-inference-bills)
- [AI startup trends 2026: funding shifts for founders — Qubit Capital](https://qubit.capital/blog/ai-startup-fundraising-trends)
- [Why AI agents fail in production — Forge Workflows](https://forgeworkflows.com/blog/why-ai-agents-fail-in-production)
- [Towards a Science of AI Agent Reliability — arXiv 2602.16666](https://arxiv.org/pdf/2602.16666)
- [Agent observability: the complete guide for 2026 — Braintrust](https://www.braintrust.dev/articles/agent-observability-complete-guide-2026)
- [Trace and debug multi-agent systems in 2026 — Future AGI](https://futureagi.com/blog/trace-debug-multi-agent-systems-observability-guide/)
- [Beyond the prototype: why production AI agents are moving to Rust — Medium](https://medium.com/@ap3617180/beyond-the-prototype-why-production-ai-agents-are-moving-to-rust-14a436cb3206)
- [How to hire Rust developers in 2026 — KORE1](https://www.kore1.com/hire-rust-developers-2026/)
- [Rust startups hiring in 2026 — Rustify](https://rustify.rs/articles/rust-startup-companies-vc-funded-2026)
