# Decebal's newsletter use of Lara's frameworks

Use for Decebal Dobrica's newsletter and Rust & AI Weekly. This is an editorial adaptation requested on September 28, 2026, of frameworks he adopted on September 25. It is not a claim that Lara prescribes this technical-newsletter template.

## Framework source and voice

Lara Acosta, [how I grow on LinkedIn so fast they lowkey think I'm cheating](https://www.youtube.com/watch?v=0ZVUVa4IFTw): SLAY at approximately 1:38–4:58, PAS at 5:00–6:05, and 4-3-2-1 at 7:05–8:09. These definitions and timestamps come from the previously read English auto-generated transcript recorded in prime_voice. Recall the current nodes before first-person writing:

- `SLAY for sourced stories` (`82fce262-4ec6-496e-afcd-3d40a3e412ba`): story, lesson, actionable advice, reader-facing ending.
- `PAS for engineering problems` (`81f94beb-ef15-4970-8b85-8d6c0745f8af`): problem, concrete consequences, solution.
- `Reader-focused content mix with existing cadence` (`7dc5504f-0c6c-4bb3-91a0-89773575be67`): four posts, three content types, two audiences, one conversion post in Lara's original system.
- `Newsletter paragraphs and scanning` (`43b94f37-5b46-4e8e-b501-5ad02b085bdb`).

Preserve Decebal's direct engineering judgment, British spelling and uncertainty. Live voice recall governs personal preferences; keep edition facts and handoffs in project memory/launch notes. Never invent an experience, test result or missing voice facet.

## Choose a reader decision before a structure

Name the principal reader and decision in the launch notes: for example, an engineer deciding what to upgrade or an engineering lead assigning a CI cleanup. Keep practitioners and engineering decision-makers in view. Concrete configuration, acceptance criteria and ownership help them act; generic leadership lessons do not.

Use one structure where it improves the material. A multi-story issue does not need every item to repeat the same arc or fit one theme.

### SLAY for the lead

Open with a verified event and its mechanism. Explain the practical lesson through that mechanism, give a bounded next action, then finish the issue with a relevant reader action or specific invitation to respond.

For issue #14, the story is Miri saving environment variables into cached build output; the lesson is that a patch does not erase prior cache contents. The action is the affected-workflow cleanup. The reader-facing ending asks for the reader's cache-access check and an unresolved boundary.

Keep conditions visible in the opening. A tool advisory is not proof that the reader suffered an incident. Second-person openings may frame a clearly conditional situation; they must not invent the author's or reader's experience. Do not withhold an urgent fix or qualification to create a curiosity gap.

### PAS for selected evaluations

Describe the reader's concrete problem, explain a supported consequence without fear or inflated urgency, then give the scoped solution or test. Put the verdict near the top and retain maintenance, latest release and adoption as separate signals.

Useful examples from #14: a happy-path MCP call does not cover malformed headers or optional fields; an agent may select guidance for the wrong dependency version; a background logger needs drain and failure tests as well as enqueue timings. State proposed checks as proposals. Do not turn them into benchmark results or claim that a tool has solved every failure mode.

### Use 4-3-2-1 at the planning level

Borrow the distinction between education, sourced stories and target-reader problems, and between the buyer/decision-maker and practitioner/referrer. Preserve the user's actual publishing schedule. Do not generate four issues, reduce an existing cadence, or force a conversion pitch into a technical weekly. A conversion CTA needs an existing relevant offer or asset; never invent a lead magnet.

## Editing and delivery

Write normal newsletter prose. Keep approximately 30–70 words per paragraph where useful; split paragraphs over 100 at a subject change. Use subheadings and lists for parallel release details. Avoid applying LinkedIn's one-sentence-per-line style to the whole issue. LinkedIn ghostwriting governs the separate social asset only.

Before returning the edition, record a compact framework map in its launch notes: sourced event/problem, supported lesson/consequence, reader action, selected CTA, and where each appears. This is an internal edit aid; do not expose SLAY/PAS labels in reader copy. Remove repeated lessons, recap endings and generic transitions with no-ai-slop's evaluation pass.

Synchronise MDX, email HTML, syndication and the exact launch mirror. Recheck title/subtitle, primary links, versions, licence and benchmark qualifications, verdicts, counts and both images. Verify the actual site renderer and saved Substack mobile/email preview. Let Substack's UI settle before recording length warnings: an immediate post-reload absence is not evidence that a warning cleared.

Resume the existing issue's unpublished draft. Preserve its stable slug and reviewed factual work. In an unattended run, prepare review assets only; publishing, sending, pushing and scheduling require the edition-specific authorization already defined by the task.

## Learn from reports without claiming newsletter lift

Apply the report-informed guide in [weekly-content-learning.md](weekly-content-learning.md), with newsletter-specific limits. The November 2 report review covered 27 email bodies and 152 Supergrow post rows. Five report windows were missing; publication ages and account/scheduler definitions differed. Concrete engineering decisions support an editorial hypothesis. Shorter posts did not consistently outperform longer ones. No newsletter open/click/reply cohort or comparable X baseline was established.

Start from a verified case. State the principal reader decision and a bounded action early, retaining any qualification that changes that action. Put each verdict and its reason near the evaluation opening. Separate parallel release, maintenance, adoption, licence and toolchain details into a list where that improves scanning. Preserve substantive newsletter paragraphs, mechanism, opposing case and material limits; do not convert the issue into LinkedIn fragments. Remove repeated setup and conclusions. Use one answerable practitioner invitation when it earns its place, or end with an action.

Treat action placement and readability checks as document properties. They cannot establish attention, comprehension, distribution, replies or conversion. For an autoresearch experiment, freeze original copy, protected evidence, evaluator, objective and candidate cap before baseline. Prefer action placement with evidence/substance gates over optimising total words as a reach proxy. Include an evidence-loss control, freshly verify the retained commit and separately review the final rendered artifact. Manual fixes after a run must be labelled, hashed and rechecked; do not attribute them to a runner-selected commit. A passing literal gate can still leave a dangling reference, unsupported assumption or poor argument.

Record one editorial variable and capture outcomes at equal publication ages, separately by platform. For newsletters, retain sent/delivered counts and available unique opens, clicks and replies with denominators and caveats about automated activity. For LinkedIn, retain impressions, available link engagements and other people's comments with definitions; separate post types and account totals. For X, establish a separate baseline rather than transferring LinkedIn findings. Missing metrics remain unavailable. Topic and audience differences make these observational comparisons unless a controlled design supports more.

Evidence: [weekly report review](/Users/decebaldobrica/Projects/personal/ralph-wiggum-marketer/docs/reports/2026-11-02-weekly-content-reports.md), [earlier post experiment](/Users/decebaldobrica/Projects/personal/ralph-wiggum-marketer/docs/reports/2026-11-01-post-refinement.md), and the indexed [newsletter 19 application and runner evidence](/Users/decebaldobrica/.codex/worktrees/rust-ai-weekly-19/portofolio-monorepo/docs/social/newsletter-report-learning.md). Preserve the Monday cadence, independent primary-source verification, real site/mobile/email checks and per-edition push/send/social permissions. Report advice grants no publication authority.
