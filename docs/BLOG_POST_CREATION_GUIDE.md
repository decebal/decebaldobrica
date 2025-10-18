# Blog Post Creation Guide

## Overview

This guide documents the structured approach to creating high-impact blog posts that combine:
- **Viral LinkedIn Principles** (hook, examples, core insights, actionable advice)
- **STAR Methodology** (Situation, Task, Action, Result)
- **3 Business Golden Nuggets** (practical wisdom with frameworks)
- **3 Thinking Tools** (mental models used to solve problems)

## Quick Start

### Create a New Blog Post

```bash
# Interactive CLI
task create-post

# Or directly
cd apps/web
bun run create-post
```

The CLI will guide you through structured prompts to create a comprehensive blog post.

---

## Methodology

### 1. Viral LinkedIn Principles

Based on analyzing 9,000+ high-performing LinkedIn posts, these principles maximize engagement:

**Structure:**
1. **Hook**: Bold, attention-grabbing opening (3-5 lines)
2. **Transition**: Guide readers with phrases like "Think about it:" or "Here's the truth:"
3. **Examples**: 2-3 punchy, bulleted points
4. **Problem Statement**: Rhetorical questions creating contrast
5. **Core Insight**: Key truths in short, impactful sentences
6. **Actionable Advice**: Bullet points under "Remember:" or "The world needs:"
7. **Closing**: Memorable, motivational statement with engagement question

**Formatting Best Practices:**
- Short paragraphs (1-2 lines)
- Strategic line breaks for emphasis
- Simple, direct language with occasional industry terminology
- Inspirational yet slightly provocative tone
- 15-20 lines total length (for LinkedIn version)
- No emojis in body text (use sparingly in headings)

**Example Hook:**
```
I built an entire newsletter system in 48 hours.

Six complete phases. Four custom packages. Crypto payments. Social media automation. Admin dashboard.

The catch? Only 30% actually worked.

This is the story of building fast, getting feedback, pivoting hard, and learning the difference between "code complete" and "production ready."
```

---

### 2. STAR Methodology

Every blog post follows this proven interview/case study structure:

#### Situation (The Challenge)
**What to Include:**
- Context of the problem
- Current state vs. desired state
- Market research or competitive analysis
- Business impact of the problem
- Why this matters now

**Example:**
```markdown
## Situation: The Revenue Gap

### The Context
I run a technical blog about AI engineering, Rust, and serverless architecture. Traffic is growing, but there's a fundamental problem: **No monetization beyond consulting.**

### The Market Research
- ByteByteGo: 1M+ subscribers, ~$1.8M/year
- Refactoring.fm: 150K+ subscribers, ~$270K/year
- Pattern: Technical content + premium tier = significant recurring revenue

### Business Impact
- Blog traffic: 5,000+ monthly
- Email capture: 0%
- Recurring revenue: $0
- Opportunity: $21K Year 1 → $52K Year 2
```

#### Task (Define Clear Goals)
**What to Include:**
- Primary objectives (3-5 goals)
- Constraints (time, budget, scope, technical)
- Success metrics (measurable outcomes)

**Example:**
```markdown
## Task: Build a Complete Newsletter Platform

### Primary Goals
1. Launch premium subscriptions within 2 weeks
2. Target 100 signups in Month 1
3. Convert 5% free → premium (industry benchmark)

### Constraints
- Time: Build in 2 days (prove concept viability)
- Tech Stack: Use existing infrastructure (Next.js, Supabase, Resend)
- Payment: Crypto-first (leverage existing payment system)

### Success Metrics
- Email signup → confirmation → welcome flow working
- Premium payment → automatic tier upgrade working
- Publishing CLI → one-command workflow working
```

#### Action (Strategic Implementation)
**What to Include:**
- 3-5 key actions taken
- For each action:
  - Problem it addressed
  - Implementation details (with code if technical)
  - Files modified
  - Immediate results

**Example:**
```markdown
## Action: Building in Layers

### Action 1: Foundation + Email System (8 hours)

**Problem Addressed:**
No infrastructure to capture or manage subscribers

**Implementation:**
Created database schema with 5 tables (subscribers, issues, events, subscriptions, social_posts), built business logic package, integrated React Email templates with Resend.

**Files Modified:**
- `packages/newsletter/src/index.ts`
- `packages/email/src/newsletter-confirmation.tsx`
- `apps/web/src/app/api/newsletter/subscribe/route.ts`

**Immediate Results:**
✅ Working signup form saving to Supabase
✅ Double opt-in email flow ready
```

#### Result (Measurable Impact)
**What to Include:**
- Performance metrics table (Before → After → Improvement)
- Business impact (bullet points)
- Lessons learned (what worked, what didn't)

**Example:**
```markdown
## Result: Measurable Impact Achieved

### Performance Metrics: Before vs After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Response Time** | 500ms | 350ms | **-30%** ⚡ |
| **Memory Usage** | 150MB | 135MB | **-10%** 💾 |
| **Error Discovery** | 3+ API calls | 1 API call | **-66%** 🎯 |

### Business Impact
- 30% faster response times = happier users
- Single-call error discovery = less frustration
- Structured logs = minutes instead of hours debugging

### Lessons Learned
1. Connection pooling is non-negotiable for production
2. Observability pays dividends in debugging time
3. Multi-error validation significantly reduces user frustration
```

---

### 3. Business Golden Nuggets (3 Required)

Each nugget is a self-contained business insight with practical application.

**Structure:**
1. **Title**: Catchy name for the insight
2. **The Lesson**: What you learned
3. **The Framework**: Mental model or formula (can be text-based diagram)
4. **Business Impact**: Why this matters financially/operationally
5. **Actionable Advice**: 3-5 specific steps readers can take
6. **Real-World Application**: Concrete example from your experience

**Example:**
```markdown
### Nugget 1: "Code Complete" ≠ "Production Ready"

**The Lesson:**
I fell into the classic trap: confusing technical completeness with operational readiness.

**The Framework:**
```
Production Readiness = Code + Configuration + Testing + Monitoring

Code:          100% ✅
Configuration:  30% ⚠️
Testing:         0% ❌
Monitoring:      0% ❌
--------------------
Production:     30% ⚠️
```

**Business Impact:**
- Don't oversell: Be honest about what actually works
- Test incrementally: Verify each phase before moving on
- Configure early: Don't leave infrastructure for "later"

**Actionable Advice:**
1. After writing code, immediately configure and test it
2. Use "Definition of Done" checklists that include configuration
3. Demo working features, not just code
4. Track "deployed and tested" separately from "code complete"

**Real-World Application:**
When pitching to investors or clients, show working demos. Code on GitHub means nothing if it doesn't run in production.
```

---

### 4. Thinking Tools (3 Required)

Mental models and frameworks you used to solve the problem.

**Structure:**
1. **Name**: What the tool is called
2. **What It Is**: Brief description
3. **How You Applied It**: Specific application to this problem
4. **The Mental Model**: Text diagram or visual representation
5. **Why It Worked**: Benefits and outcomes
6. **When to Use**: Situations where this tool is most effective
7. **Example in Action**: Concrete example from your work

**Example:**
```markdown
### Thinking Tool 1: Layered Architecture Thinking

**What It Is:**
Break complex systems into horizontal layers with clear boundaries. Each layer has a specific responsibility and communicates through defined interfaces.

**How I Applied It:**
```
┌─────────────────────────────────────┐
│   Presentation Layer (UI/Pages)    │
│   - Newsletter signups              │
│   - Pricing page                    │
└──────────────┬──────────────────────┘
               │ API calls
               ▼
┌─────────────────────────────────────┐
│   Business Logic (Packages)         │
│   - subscribeToNewsletter()         │
│   - sendNewsletterConfirmation()    │
└──────────────┬──────────────────────┘
               │ Database queries
               ▼
┌─────────────────────────────────────┐
│   Infrastructure (External)         │
│   - Supabase, Resend, APIs          │
└─────────────────────────────────────┘
```

**Why It Worked:**
1. Clear boundaries: Easy to see where code belongs
2. Testable: Can mock infrastructure, test business logic in isolation
3. Replaceable: Can swap Supabase for PostgreSQL without changing business logic
4. Parallel work: Could build UI while designing business logic

**When to Use This Tool:**
- Building any system with multiple concerns (UI, business rules, data)
- Need to test business logic without external dependencies
- Want to swap infrastructure later
- Working with a team (clear boundaries prevent conflicts)

**Example in Action:**
When I pivoted to separate admin app, only the Presentation layer changed. Business logic and infrastructure stayed the same. This is the power of layered thinking.
```

---

## CLI Workflow

### Step 1: Basic Information
```
Title: Your blog post title
Slug: auto-generated from title (can customize)
Date: auto-generated ISO timestamp
Author: Decebal D. (default)
Description: SEO-optimized description (150-160 chars)
Tags: comma-separated list (rust, performance, api, etc.)
```

### Step 2: Viral LinkedIn Hook
```
Hook: 3-5 line attention-grabbing opening
      - Start with bold statement
      - Create curiosity gap
      - Promise value
```

### Step 3: STAR - Situation
```
Context: What's the background?
Problem: What specific challenge exists?
Market Research: (optional) What did you learn from competitors/research?
Business Impact: Why does this matter financially/operationally?
```

### Step 4: STAR - Task
```
Primary Objectives: 3-5 goals
Constraints: Time, budget, scope, technical limitations
Success Metrics: How will you measure success?
```

### Step 5: STAR - Actions
```
For each action (3-5 total):
  - Title: Short name for the action
  - Description: What problem did this address?
  - Implementation: How did you do it? (include code/strategy)
  - Files Modified: (optional) What files changed?
  - Immediate Result: What happened right after?
```

### Step 6: STAR - Result
```
Metrics (4-6):
  - Metric name
  - Before value
  - After value
  - Improvement percentage

Business Impact: 3-5 impacts
Lessons Learned: 3-5 lessons
```

### Step 7: Golden Nuggets (3 Required)
```
For each nugget:
  - Title: Catchy name
  - The Lesson: What you learned
  - The Framework: Mental model/formula
  - Business Impact: Why it matters
  - Actionable Advice: 3-5 steps
  - Real-World Application: Concrete example
```

### Step 8: Thinking Tools (3 Required)
```
For each tool:
  - Name: Tool name
  - What It Is: Description
  - How Applied: Your specific application
  - Mental Model: Text diagram
  - Why It Worked: Benefits
  - When to Use: Applicable situations
  - Example in Action: Concrete example
```

### Step 9: Conclusion & Resources
```
Conclusion: Wrap-up summary
Resources: Links, books, tools referenced
```

### Step 10: Preview & Confirm
The CLI shows a preview of the generated markdown. Confirm to save.

---

## Output Format

The CLI generates a complete MDX file at:
```
apps/web/content/blog/YYYY-MM-DD-slug-name.mdx
```

**Structure:**
```markdown
---
title: 'Post Title'
date: 'ISO timestamp'
author: Decebal D.
description: SEO description
tags:
  - tag1
  - tag2
slug: YYYY-MM-DD-slug-name
---

## Hook (LinkedIn-style opening)

---

## Executive Summary
(Key results bullet points)

---

## Situation: The Challenge
### Context
### The Problem
### Market Research (if included)
### Business Impact

---

## Task: Define Clear Goals
### Primary Objectives
### Constraints
### Success Metrics

---

## Action: Strategic Implementation
### Action 1: Title
(Repeated for each action)

---

## Result: Measurable Impact Achieved
### Performance Metrics (table)
### Business Impact
### Lessons Learned

---

## Business Golden Nuggets
### Nugget 1: Title
(3 nuggets total)

---

## Thinking Tools That Made This Possible
### Thinking Tool 1: Name
(3 tools total)

---

## Conclusion

---

## Resources
```

---

## Best Practices

### Content Quality

1. **Be Specific**: Use numbers, metrics, exact timeframes
   - ❌ "Performance improved significantly"
   - ✅ "Response time improved 30% (500ms → 350ms)"

2. **Show, Don't Tell**: Include code snippets, diagrams, examples
   - ❌ "I optimized the database"
   - ✅ Show the actual PgPoolOptions configuration

3. **Honest Assessment**: Include what didn't work
   - ❌ "Everything worked perfectly!"
   - ✅ "Code complete but only 30% actually configured"

4. **Actionable Insights**: Every nugget should have concrete steps
   - ❌ "Architecture is important"
   - ✅ "Invest 20% time in architecture. It pays back 5x in 6 months."

### Writing Style

1. **Voice**: Technical but accessible
   - Use industry terms when appropriate
   - Explain complex concepts simply
   - Personal stories and lessons

2. **Length**: Comprehensive but scannable
   - Aim for 5,000-8,000 words
   - Use headings, bullet points, tables
   - Code blocks for technical details

3. **Engagement**: Create curiosity and value
   - Start with a hook that creates intrigue
   - Use "you" to address reader directly
   - End sections with key takeaways

### Technical Details

1. **Code Snippets**: Always include context
   ```typescript
   // ❌ Bad: No context
   pool.connect()

   // ✅ Good: Full context
   const pool = PgPoolOptions::new()
       .max_connections(20)
       .test_before_acquire(true)
       .connect(&database_url)
       .await?
   ```

2. **Metrics**: Show before/after in tables
   | Metric | Before | After | Improvement |
   |--------|--------|-------|-------------|
   | Time | 500ms | 350ms | -30% |

3. **Diagrams**: Use ASCII art for mental models
   ```
   Problem → Analysis → Solution → Result
              ↓
         Thinking Tools
   ```

---

## Publishing Workflow

### 1. Create the Post
```bash
task create-post
```

### 2. Review and Edit
```bash
# Open in editor
code apps/web/content/blog/YYYY-MM-DD-slug-name.mdx

# Add any additional:
# - Code examples
# - Screenshots
# - Diagrams
# - Links
```

### 3. Test Locally
```bash
task dev
# Visit http://localhost:3100/blog/YYYY-MM-DD-slug-name
```

### 4. Publish
```bash
# Publish to blog + newsletter + social media
task publish -- YYYY-MM-DD-slug-name
```

---

## Examples

### Example 1: Technical Performance Post
See: `2025-10-09-optimizing-rust-api-performance-30-percent-improvement.mdx`

**Structure:**
- Situation: Performance bottlenecks identified
- Task: Improve by 20-30% in 2 hours
- Action: 3 optimizations (connection pool, logging, validation)
- Result: 30% faster, 10% less memory
- Nuggets: Connection pooling, observability, UX validation
- Tools: None in this post (but should have added them)

### Example 2: Business/Architecture Post
See: `2025-10-16-building-newsletter-system-48-hours.mdx`

**Structure:**
- Situation: No monetization, newsletter opportunity
- Task: Build complete system in 48 hours
- Action: 6 phases of implementation
- Result: Code complete but 30% configured
- Nuggets: Code ≠ Production, Feedback > Validation, Architecture Compounds
- Tools: Layered Architecture, STAR Methodology, First Principles

---

## FAQ

**Q: How long does it take to complete the CLI prompts?**
A: 60-90 minutes for the initial input. Then 2-3 hours for editing and refinement.

**Q: Can I skip the Golden Nuggets or Thinking Tools?**
A: No, they're required. These are what make the post valuable beyond just a technical tutorial.

**Q: What if I don't have 3 thinking tools?**
A: Common tools: First Principles, STAR, 80/20 Rule, Jobs-to-be-Done, Layered Architecture, Systems Thinking, Root Cause Analysis, Cost-Benefit Analysis, Minimum Viable Product, Pareto Principle.

**Q: How do I measure if my post is successful?**
A: Track:
- LinkedIn engagement (likes, comments, shares)
- Blog views (PostHog analytics)
- Newsletter signups from the post
- Social shares
- Backlinks

**Q: Should every post follow this structure?**
A: For major technical case studies and business insights, yes. For shorter posts (tutorials, quick tips), use a simpler format.

---

## Resources

- [Viral LinkedIn Content Guide](https://jantegze.gumroad.com/l/viral-linkedin-content)
- [STAR Methodology](https://en.wikipedia.org/wiki/Situation,_task,_action,_result)
- [First Principles Thinking](https://fs.blog/first-principles/)
- [Mental Models](https://fs.blog/mental-models/)

---

**Last Updated**: October 16, 2025
**Version**: 1.0
**Status**: Active - Use this methodology for all major blog posts
