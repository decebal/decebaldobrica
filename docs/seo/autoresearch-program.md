# SEO autoresearch

An adaptation of [autoresearch](https://github.com/wolven-tech/autoresearch-rs) (Karpathy's agent-runs-the-experiments loop) to the SEO of a single blog post. Same shape: one file the agent edits, one file the agent may not touch, one metric, a fixed budget per experiment, keep or discard, log everything.

| autoresearch | SEO autoresearch |
| --- | --- |
| `train.py` (agent edits) | `apps/web/content/blog/<slug>.mdx` (frontmatter and body) |
| `prepare.py` (read-only harness) | `apps/web/scripts/seo-score.mjs` (read-only scorer) |
| `val_bpb`, lower is better | `seo_score`, 0 to 100, higher is better |
| 5-minute training budget | one edit per experiment, scored in under a second |
| `results.tsv` | `docs/seo/results/<slug>.tsv` |

## Setup

1. **Agree on the target post and the fixed keywords.** The primary keyword and the secondary keywords are constants of the experiment, exactly like `prepare.py`'s constants. Pick them from what a reader would type, not from what the post already says. Write them at the top of the results file so the run is reproducible.
2. **Create the branch**: `git checkout -b seo-autoresearch/<slug>` from the current branch.
3. **Read the in-scope files**: the post, `apps/web/scripts/seo-score.mjs` (to understand what is measured, not to change it), `apps/web/src/app/blog/[slug]/page.tsx` (to understand how the frontmatter renders), and the previous published issue for voice.
4. **Baseline**: run the scorer on the untouched post and record it as the first row.

## Experimentation

Run the scorer as:

```
node apps/web/scripts/seo-score.mjs apps/web/content/blog/<slug>.mdx \
  --keyword "<primary>" --secondary "<a>,<b>,<c>" --verbose
```

It prints a summary block; the metric line is `seo_score:` and `failing_checks:` tells you where the points are.

**What you CAN do:**

- Edit the post's frontmatter: `title`, `description`, `seoTitle`, `seoDescription`, `tags`. `seoTitle` and `seoDescription`, when present, are what the page emits as `<title>` and meta description; `title` stays the H1 and `description` stays the newsletter preview. Use them so the reader-facing hook and the search-facing snippet can be different lengths.
- Edit the body: reword the intro so the primary keyword appears naturally in the first 150 words; add or rename an H2 so a keyword appears in a heading; add internal links to related posts, `/radar`, and tag pages; split a paragraph that has become a wall; shorten sentences; add alt text.

**What you CANNOT do:**

- Modify `seo-score.mjs`. It is the ground truth. If the scorer is wrong, stop the loop and say so; do not route around it.
- Change the slug or the filename. The route resolves by filename and the launch pack already carries the URL.
- Change any fact, number, verdict, name, or date in the post. This loop moves words, not claims.
- Break the series format: the anchor sections stay in order, the "Today's issue: X, Y, and Z" three-hook sentence stays as the opening, entry status lines stay, and the sign-off stays. No em-dashes in prose (list-entry separators and the two established heading patterns are the only exceptions).
- Keyword-stuff. The scorer caps density at 2% and the human reads the output; a sentence that exists only to hold a keyword is a discard even if the score goes up.
- Touch app code from inside the loop. Site-level SEO (metadata, structured data, link handling) is a separate change made once, outside the loop, and reviewed as code.

**The goal is simple: the highest `seo_score` that still reads like the newsletter.** Simplicity criterion, as in the original: a change that adds a point and a clumsy sentence is not worth it; a change that removes words and holds the score is a win.

## Logging results

Append one row per experiment to `docs/seo/results/<slug>.tsv` (tab-separated, no commas in the description field):

```
commit	seo_score	word_count	status	description
```

Status is `keep`, `discard`, or `crash` (the scorer failed to parse the file). Record the primary and secondary keywords as a comment row at the top of the file: `# keyword=... secondary=...`.

## The experiment loop

LOOP until the budget is spent (default: 20 experiments, or the score has not moved for 5 consecutive experiments):

1. Look at `failing_checks` from the last run and pick the check with the most unclaimed weight that you can address without changing a claim.
2. Make one edit to the post.
3. Commit it with a one-line message describing the edit.
4. Run the scorer; read `seo_score`.
5. If it improved and the edit reads well, keep the commit and advance.
6. If it is equal or worse, or it improved but reads like SEO copy, `git reset --hard` to the previous commit and log `discard`.
7. Append the row.

When the loop ends, run the scorer once more with `--verbose`, paste the remaining failing checks into the post's launch notes under Follow-up notes, and hand back. The human reads the diff before anything is pushed.

## Reading the score

The checks and weights live in the scorer; the ones that usually matter for this series:

- `description_length` and `description_keyword` (15 points): the "Today's issue" hook is 400+ characters by design and cannot be the meta description. Set `seoDescription` to 120 to 160 characters containing the primary keyword.
- `lead_keyword` (8) and `h2_keyword` (6): the primary keyword should appear in the first 150 words and in one H2. For a weekly with a strong lead this is usually a matter of naming the lead in the intro and the section heading.
- `internal_links` (8): five internal links is full credit. Previous issues, `/radar`, and `/blog/tag/<tag>` all count.
- `paragraph_walls` (3) and `long_sentences` (3): the series writes dense entries on purpose, so these are the checks most likely to be left failing deliberately. That is allowed. Write it down.
