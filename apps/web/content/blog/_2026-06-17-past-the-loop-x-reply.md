# X reply draft — long-form post

> Internal draft (underscore prefix keeps it out of the blog index). Reply to https://x.com/0xMortyx/status/2066469702075920794
> Posting mode: DRAFT ONLY — paste and post manually.
> Canonical link: https://decebaldobrica.com/blog/2026-06-17-past-the-loop-claude-code-tooling-stack
> (verify the live slug/route before posting)

---

## Option A — Long-form post (X Premium, ~580 words)

This is the best thread on Claude Code I've read in a while, and I still think it's only half the story.

The argument: the model was always capable; the difference is the *loop* — explore, plan, build small, enforce with hooks, test, review with a second agent, fix, ship. All correct. Most people don't do any of it.

But a loop is control flow. It tells you what order the steps run in. It says nothing about whether each step can actually execute on a 400-file repo, across a week, without the agent running out of context or forgetting why it made a decision three sessions ago.

The 9-step loop quietly assumes three things that are false on real work:

1/ Context is free. Explore + plan + build + test + review + re-review is 6+ full passes over your code, every task. On a real repo that's a token bonfire — and it hits the context window before it hits "done."

2/ Memory persists. Plan mode and CLAUDE.md live for exactly one session. The moment you /compact, the *why* behind every decision is gone. The agent re-explores the same code tomorrow.

3/ An in-session reviewer is independent. A review subagent runs on the same model, in the same session, on your token budget, against the same blind spots. It's the same engineer in a fake moustache.

The loop is the floor. Here's the layer that makes it actually run:

→ Token economy: caveman (trims the agent's own output ~65-75%) + rtk/Rust Token Killer (filters terminal output before it hits context). The loop is only affordable if each pass is cheap. Most people abandon the discipline because it got too expensive — not because it failed.

→ Durable memory: chronis, an event-sourced task CLI — the plan becomes a replayable task graph that outlives the session, with TOON output that's ~50% fewer tokens than an ASCII table. Plus AllSource Prime, a knowledge-graph memory layer that remembers what the system is and *why*, across sessions. (Both are mine — disclosing that up front.) Plan mode is short-term memory. This is long-term. Senior engineers are mostly long-term memory.

→ Independent review: CodeRabbit, on the PR, outside your session — different system, doesn't share your agent's blind spots, doesn't spend your context budget. That's what "second reviewer" actually means.

→ The step the loop doesn't have: pixel-perfect verification. Tests assert behavior, LLM review reads code — neither looks at the rendered pixels. A pixel-perfect overlay shows the design vs. the running app to the pixel. For UI, that's where "done" is earned.

The honest part: for a quick fix, the bare loop is the right amount of process. The stack has real costs. The thread's primitives — hooks, plan mode, subagents, CLAUDE.md — are exactly where all of this plugs in. I'm not replacing the loop. I'm giving it a substrate.

The model was never the bottleneck, and neither is the loop. The substrate is — tokens, memory, independent verification. Build the loop. Then give it a stack.

Full write-up, with the loop wired into the stack step by step:
https://decebaldobrica.com/blog/2026-06-17-past-the-loop-claude-code-tooling-stack

---

## Option B — Short opener (if you'd rather lead a thread or keep it tight, ~270 words)

Best Claude Code thread I've read in a while — and still only half the story.

Your point stands: the difference is the loop, not the model. But a loop is just control flow. It assumes three things that are false on a real codebase:

• Context is free — explore+plan+build+test+review+rereview is 6+ passes per task. Token bonfire.
• Memory persists — plan mode + CLAUDE.md die at /compact. Tomorrow the agent re-explores the same code.
• An in-session reviewer is independent — same model, same session, same blind spots, your token budget.

The loop is the floor. The stack underneath is what makes it run:

— caveman + rtk: cut output and terminal tokens so the loop stays affordable
— chronis: event-sourced task CLI, the plan becomes a replayable graph that outlives the session (TOON output = ~50% fewer tokens) + AllSource Prime for cross-session memory (both mine — disclosing)
— CodeRabbit: independent review on the PR, outside your context
— pixel-perfect overlay: the missing step — tests and LLM review never look at the rendered pixels

The model was never the bottleneck, and neither is the loop. The substrate is.

Full write-up: https://decebaldobrica.com/blog/2026-06-17-past-the-loop-claude-code-tooling-stack

---

### Notes
- No hashtags (your playbook: social = relationship, not keyword stuffing).
- Canonical link points back to the blog per "one canonical home, many syndication surfaces."
- If posting as a reply: post Option A directly under 0xMorty's tweet. If you want reach beyond his followers, quote-tweet instead with the first 2 lines as the hook.
- Verify the live URL resolves before posting.
