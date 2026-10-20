# Newsletter report learning and issue 19 revision

The revised issue 19 puts the archive corpus check immediately after the sourced Astral case. Tool openings now give the verdict's reason, parallel release/status details are lists, and repeated invitations and closing recommendations are removed. The issue retains substantive British prose, compatibility objections, source qualifications and the original artwork, slug and verdicts. Nothing was sent, published, scheduled, pushed or merged.

## Evidence and scope

The [November 2 report review](/Users/decebaldobrica/Projects/personal/ralph-wiggum-marketer/docs/reports/2026-11-02-weekly-content-reports.md) read 27 Gmail report bodies: 25 Supergrow reports and two Buffer reports, with 152 Supergrow post rows and five report-window gaps. Its parsed evidence and report links remain in the marketer repository. Account totals, scheduler rows and individual-post metrics have different scopes. Publication ages differ. Shorter posts did not consistently outperform longer ones.

The prior [post-refinement report](/Users/decebaldobrica/Projects/personal/ralph-wiggum-marketer/docs/reports/2026-11-01-post-refinement.md), [report-learning plan](/Users/decebaldobrica/Projects/personal/ralph-wiggum-marketer/docs/plans/2026-11-02-report-learning.md), and [guide experiment manifest](/Users/decebaldobrica/Projects/personal/ralph-wiggum-marketer/content/experiments/2026-11-02-report-learning/manifest.json) establish what was measured. Those runs measured concision and constraint retention, not reach or model behaviour. No newsletter open/click/reply data or comparable X analytics baseline was established. LinkedIn evidence supplies an editorial hypothesis for this newsletter, not a newsletter performance finding.

Principal reader: an engineer or engineering lead deciding whether to assess a new archive parser. Bounded action: define accepted/rejected archive inputs and test interpretation before changing extraction. The variable tested here is how early the same usable check appears. It is not total article length or a prediction of reach.

## Frozen experiment and actual runner

Installed `autoresearch` 0.1.0, from autoresearch-rs, ran inside the previously authorised isolated experiment repository. That repository has no remote. Only experimental copies under `newsletter19/` were mutable. The portfolio source paths stayed outside its Git history; the marketer repository's history was unchanged. Earlier experiment copies and runs remain intact.

- [Frozen plan](assets/weekly19-report-learning/frozen-plan.md), [contract](assets/weekly19-report-learning/autoresearch.toml), [evaluator](assets/weekly19-report-learning/newsletter19-evaluator.mjs), [protected facts](assets/weekly19-report-learning/newsletter19-facts.json)
- [Runner report](assets/weekly19-report-learning/autoresearch-report.json), [fresh runner verification](assets/weekly19-report-learning/autoresearch-verification.json), [stop record](assets/weekly19-report-learning/autoresearch-stop.json)
- Baseline copies: [article](assets/weekly19-report-learning/baseline-article.mdx), [LinkedIn](assets/weekly19-report-learning/baseline-linkedin.txt), [X](assets/weekly19-report-learning/baseline-x.txt)
- Final copies: [article](assets/weekly19-report-learning/revised-article.mdx), [LinkedIn](assets/weekly19-report-learning/revised-linkedin.txt), [X](assets/weekly19-report-learning/revised-x.txt)

Run `run-1793614371021-39922-a591f845`. Baseline commit `a591f8459ec4ec70b23b368218f80db102205e1a`; selected structural commit `17ca842e800cf157d59e4495507c7d6329829c33`. Two candidates were evaluated, one kept and one discarded. The planned stop is recorded as operator cancellation between candidates, with no unfinished mutation.

| Measurement | Article words before action | LinkedIn | X | Sum | Result |
|---|---:|---:|---:|---:|---|
| Frozen baseline | 115 | 70 | 61 | 246 | Evidence, substance/platform and selected-bait gates passed |
| Structural candidate | 69 | 34 | 6 | 109 | Kept; same gates passed |
| Evidence-loss control | 69 | 34 | 6 | 109 | Discarded: removed production-readiness qualification |
| Fresh runner verification | 69 | 34 | 6 | 109 | Matched selected commit |
| Final manual editorial fixes | 69 | 36 | 6 | 111 | Frozen evaluator passed again; separate artifact hashes |

The evaluator measures literal evidence retention, position of three exact action phrases, paragraph limits, a substantive article floor and social platform constraints. It protects 51 normalised article blocks plus specific source/version/licence/caveat anchors. It is not a comprehension or model-output evaluation. No held-out model behaviour, live A/B experiment, reach lift or conversion lift was measured. Node standard-library evaluation reused the installed experiment protocol and avoided introducing another compiler job; no new dependency was installed.

## Separate manual review and final fixes

The structural winner still contained two editorial defects. Removing the LinkedIn question left “that question” without a referent. Its first sentence now names archive compatibility directly. The article verdict also assumed the reader's compatibility was untested; that assumption became a general recommendation grounded in the README warning. These manual fixes were not selected by the runner. [Runner-selected copies](assets/weekly19-report-learning/runner-selected-article.mdx) and [final hashes](assets/weekly19-report-learning/final-hashes.json) preserve the distinction. [Final artifact re-evaluation](assets/weekly19-report-learning/final-artifact-evaluation.json) and [fresh exact-applied-copy check](assets/weekly19-report-learning/final-applied-evaluation.json) uses the unchanged evaluator after both fixes.

Manual review retained the first sourced case, nearby readiness caveat, uv attribution, mixed-format compatibility objection, MIR/compiler limits, stable-versus-source release distinctions, exact licence and benchmark qualifications, worker recovery scope and one practitioner invitation per asset. No first-person experience or tool run was invented. Verdicts remain tar-codec Assess, CGA Assess and apalis Trial. Original hero, social crop, radar and alt text remain unchanged.

The edited article and launch copies are the full final text; this document records what changed. no-ai-slop editing checks 1–11, words check, patterns 1–9 and final-read 1–4 were reviewed after structure and manual fixes. Detect-only check does not apply. The site/email verification results and evidence are linked from the [issue launch ledger](rust-ai-weekly-19-launch-notes.md).

## Future guidance and measurement

The existing workflow reference, `/Users/decebaldobrica/.codex/skills/ralph-copywriter/references/decebal-newsletter-frameworks.md`, now includes newsletter-specific report learning. [Versioned reference snapshot](newsletter-frameworks.md). The Monday automation already reads that path; its schedule and permissions need no change.

For future editions, start with a sourced case, state one reader decision and bounded action early, give verdict reasons near the top, and separate parallel status details. Retain mechanism, opposing case and material limits. Keep newsletter paragraphs rather than copying LinkedIn line-break conventions. Do not impose a short-post rule or use repeated questions as engagement bait.

After authorised publication, record platform outcomes at equal ages of seven days and 28 days. These are observation windows, not effort estimates. Keep the publication timestamp and capture timestamp, raw counts, denominators and provider definitions:

- Newsletter: sent/delivered counts, available unique opens, link clicks and substantive replies. Record automated-open/click caveats and unavailable fields. No test mail or analytics collection was performed in this revision.
- LinkedIn: post impressions, available link engagements, other people's comments, saves and reposts, separated from account/scheduler totals and from other post types. Comments including the author's replies need separation where possible.
- X: root and thread outcomes using X's own definitions, with a separate baseline; do not import LinkedIn expectations.

Compare equivalent publication ages and record topic, audience and exposure differences. The revised edition is a new editorial cohort, not a controlled test of causal lift. No calendar change is authorised by these reports. Per-edition review, deployed-link verification, audience choice and explicit publication approval remain required.

## Verification limit

Saved Substack content matches the manually corrected final HTML after save/reload, with both original images and alt text. Native paid-subscriber mobile/email previews include the new lists and final invitation. No settled length warning appeared; no test mail was sent. Final generated-email layout at 390 × 844 has scroll width 390 and both images loaded. Final revised full-site verification completed November 3 after compiler contention cleared. HTTP 200, final action and ending, 22 list items and both edition images were verified. Mobile viewport and scroll width both measured 390. No other process was stopped. Publication was authorised November 3, with blog first.

## Reproduce checks

From the portfolio checkout, run `node docs/social/assets/weekly19-report-learning/verify-applied.mjs`. This reads the exact applied article and social assets, compares recorded hashes, runs the frozen evaluator and checks synchronized exports. It does not choose a new candidate or measure readership. The script uses Node standard-library code to reuse the frozen JSON evaluator without requiring a competing Rust compilation.

In the authorised isolated experiment repository, `autoresearch report --run-id run-1793614371021-39922-a591f845 --json` reconstructs the run and `autoresearch verify --run-id run-1793614371021-39922-a591f845 --json` freshly evaluates the selected structural commit. That commit is not the final manually corrected artifact. The final artifact has its own hashes and exact-copy check. Do not reopen this capped run or change its evaluator to improve its recorded result.
