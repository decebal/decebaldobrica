# Substack: Rust Crate Radar Announcement — Paste-Ready Draft + Guide

> Substack has **no publishing API**, so this can't be automated through your app. The reliable path is to paste the draft below into Substack's editor and hit publish/send. Takes about two minutes. The step-by-step walkthrough follows the draft.

---

## Part 1 — Paste-ready draft

**Title (the big headline field):**

```
Introducing Rust Crate Radar: A New Series on Crates Worth Betting On
```

**Subtitle (the smaller field under the title):**

```
Evaluating new Rust crates the way an engineering leader actually decides on a dependency. First up: Toasty, the Tokio team's new async ORM.
```

**Body (paste everything below this line into the post body):**

---

There is no shortage of "10 awesome Rust crates you should try" lists. What's missing is the one written by someone who has had to defend a dependency choice in an architecture review — and then carry the pager for it.

That's the gap **Rust Crate Radar** fills. It's a new series, and if you're subscribed, it lands in your inbox on the same cadence as everything else.

**What it is**

Every post evaluates a newly-released or genuinely meaningful Rust crate the way an engineering leader actually decides whether to adopt it. Not a feature tour — a judgment call. The questions are the ones that matter when something enters your dependency tree and stays there for years:

- Does it solve a real, recurring problem, or is it a novelty?
- Is it mature enough to bet on, and who's maintaining it?
- How does it fit the stack you already run?
- What does it cost to adopt — compile times, binary size, unsafe surface — and how hard is it to rip out if it goes wrong?

Every crate is scored against the same rubric, so the series is a *method*, not a feed. And every post closes with a one-word verdict borrowed from the ThoughtWorks Tech Radar: **Adopt, Trial, Assess, or Hold.**

**What to expect**

Three rotating formats keep it varied and sustainable:

- **Deep Dive** — one crate, the full rubric, real code, a clear verdict.
- **Radar Digest** — a few of the latest notable releases, each with a short take and a verdict.
- **Category Showdown** — periodic head-to-heads within a category (async ORMs, TUI frameworks, error handling) using the same rubric across contenders.

Roughly a Deep Dive and a Digest each month, with a Showdown when a category gets interesting.

**First up: Toasty**

The opening Deep Dive looks at **Toasty**, the Tokio team's new async ORM that targets PostgreSQL, MySQL, SQLite, *and* DynamoDB from a single model definition. It hit crates.io in April and is moving fast. Is it ready for your production data layer? The short answer is **Assess** — and the post explains exactly why, and when that changes.

👉 Read the first Deep Dive: https://decebaldobrica.com/blog/2026-06-10-toasty-async-orm-rust-evaluation

If there's a crate you want put under the same lens, just reply to this email — reader requests will shape the backlog.

Welcome aboard the Radar.

---

*(Confirm the blog URL above matches your live domain before publishing. If your canonical domain differs from `decebaldobrica.com`, update the link.)*

---

## Part 2 — Step-by-step: publishing this on Substack

1. **Go to your Substack dashboard** at `https://YOURNAME.substack.com/publish/home` (or click your publication name → **Dashboard**).
2. Click **New post** → choose **Text post** (the standard newsletter post type).
3. **Title field:** paste the Title from Part 1.
4. **Subtitle:** click the small "Add subtitle" area under the title and paste the Subtitle.
5. **Body:** paste the body text. Substack's editor will preserve the bold and bullets; the headings (**What it is**, etc.) come through as bold paragraphs, which is fine — or promote them to H2 using the formatting toolbar (highlight the line → heading button) if you want them larger.
6. **Fix the link:** the `👉 Read the first Deep Dive:` line — highlight the descriptive text, click the link button, and attach the URL so it renders as a clean hyperlink instead of a raw URL. (Optional but nicer.)
7. **Add a cover image** (optional): Substack uses it for the email header and social card. Reuse your blog's OG image for consistency.
8. **Preview:** click **Continue** → **Preview** to see both the web and email rendering.
9. **Audience:** under send settings, make sure it's set to go to **Everyone** (or your free tier) so all Substack subscribers receive it.
10. **Publish:** click **Continue** → **Send to everyone now** (or schedule it). This publishes to the web *and* emails your Substack subscribers in one action.

That's it — Substack handles the email send to its own list automatically on publish.

---

## Important: these are two separate audiences

A clarification worth keeping in mind, since it prompted this whole task:

- Your **own newsletter** (the "Enter your email / Subscribe" form on your blog) stores subscribers in **Supabase** and emails them through **Resend** when you run `task publish -- <slug>`. That list is *not* connected to Substack in any way — despite the docs describing the system as "Substack-style," nothing was ever merged or synced.
- Your **Substack** is a completely separate list that only Substack can email.

So to reach *both* audiences with this announcement, you do two things:

1. **Your blog subscribers:** run `task publish -- 2026-06-10-introducing-rust-crate-radar` — this emails your active Resend subscribers and posts to LinkedIn/Twitter.
2. **Your Substack subscribers:** publish the draft above in the Substack editor.

You chose to keep the lists separate for now. If you ever want to actually unify them, the only supported route is a one-time CSV export of your Supabase subscribers imported into Substack's subscriber-import screen (Settings → Subscribers → Import) — ask me and I'll generate that CSV.
