# North Star Framework

## Overview

The North Star Framework is a product development methodology that helps teams align around a single, critical metric that best captures the core value your product delivers to customers. When customers experience this value, your business grows.

## Core Concept

**North Star Metric (NSM)**: The single metric that best predicts your company's long-term success and represents the value you deliver to customers.

### What Makes a Great North Star

✅ **Expresses Value**: Directly measures value delivered to customers
✅ **Measures Progress**: Predicts future revenue and growth
✅ **Actionable**: Teams can influence it through their work
✅ **Understandable**: Everyone in the company can explain it
✅ **Leading Indicator**: Predicts long-term success, not lagging metrics

## Examples of North Star Metrics

### Product-Led Growth Companies

**Slack**: Messages sent per team per day
- Why: More messages = more value from communication
- Predicts: Team dependency, retention, expansion

**Spotify**: Time spent listening
- Why: More listening = more value from music discovery
- Predicts: Subscription retention, ad revenue

**Airbnb**: Nights booked
- Why: More bookings = more value from marketplace
- Predicts: Revenue, market share, network effects

**Notion**: Number of collaborative docs created
- Why: More collaboration = more team value
- Predicts: Team adoption, retention, expansion

### SaaS B2B Companies

**HubSpot**: Weekly active teams
- Why: Active usage = value from CRM/marketing tools
- Predicts: Retention, upsell, expansion

**GitHub**: Weekly active contributors
- Why: More contributors = more development value
- Predicts: Team plan upgrades, enterprise sales

**Figma**: Files with 3+ collaborators
- Why: Collaboration = design team value
- Predicts: Team expansion, enterprise adoption

## North Star Framework Components

### 1. North Star Metric
The single most important metric

### 2. Input Metrics (Work Streams)
The key actions that drive the North Star

### 3. Supporting Metrics
Guardrails to ensure healthy growth

### Example: Blog Platform

**North Star**: Minutes of quality content read per week

**Input Metrics**:
1. New subscribers (acquisition)
2. Weekly active readers (activation)
3. Content published (growth)
4. Email open rate (engagement)

**Supporting Metrics**:
- Subscriber satisfaction (NPS)
- Content quality score
- Infrastructure costs per reader
- Author productivity

## How to Find Your North Star

### Step 1: Map Your Value Proposition

Ask: "What is the most important value we deliver to customers?"

**Example (Newsletter Platform)**:
- We help engineering leaders learn and grow
- We deliver actionable insights and frameworks
- We save them time by curating best content

**Potential Metrics**:
- Knowledge gained (hard to measure)
- Time saved (hard to attribute)
- Content consumed (measurable, actionable)

### Step 2: List Candidate Metrics

Brainstorm metrics that might capture that value:

For Newsletter:
- Subscribers
- Articles published
- Email open rate
- Time spent reading
- Articles read per subscriber
- Subscriber retention rate

### Step 3: Evaluate Against Criteria

| Metric | Expresses Value | Predicts Revenue | Actionable | Understandable | Leading | Score |
|--------|----------------|------------------|------------|----------------|---------|-------|
| Subscribers | ❌ Not value | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Lagging | 3/5 |
| Open Rate | ❌ Email only | ❌ Weak | ✅ Yes | ✅ Yes | ❌ Lagging | 2/5 |
| Minutes Read | ✅ Engagement | ✅ Strong | ✅ Yes | ✅ Yes | ✅ Leading | 5/5 |
| Articles/Sub | ❌ Weak signal | ❌ Weak | ❌ Limited | ✅ Yes | ❌ Lagging | 2/5 |

**Winner**: Minutes of quality content read per subscriber per week

### Step 4: Validate with Data

- Can we measure it reliably?
- Does it correlate with revenue?
- Do teams understand how to influence it?
- Does it capture real customer value?

### Step 5: Get Buy-In

- Present to leadership
- Explain the reasoning
- Show historical correlation with success
- Get organizational commitment

## Input Metrics: Breaking Down the North Star

Once you have your North Star, identify the key drivers.

### Example: Minutes Read per Subscriber

**Input Metric 1: Acquisition**
- New subscribers per week
- Conversion rate from reader to subscriber
- Referral rate

**Input Metric 2: Activation**
- % of new subscribers who read first article
- Time to first read
- First-week engagement rate

**Input Metric 3: Engagement**
- Articles opened per week
- Average read time per article
- Return visit rate

**Input Metric 4: Content Quality**
- Articles published per week
- Content satisfaction score
- Share/forward rate

**Input Metric 5: Retention**
- Weekly active readers
- Churn rate
- Re-engagement rate

### Formula

```
North Star = Acquisition × Activation × Engagement × Retention

Minutes Read =
  New Subscribers ×
  % Who Read in Week 1 ×
  Avg Articles per Week ×
  Avg Minutes per Article ×
  % Retained After 30 Days
```

## Using Your North Star to Drive Decisions

### Product Roadmap Prioritization

Score features by North Star impact:

```
Feature: AI Blog Composer

Input Metric Impact:
1. Content Quality: +50% (more content, faster)
2. Engagement: +20% (better quality)
3. Acquisition: +10% (more content = more SEO)

Total North Star Impact: High
Priority: P0 (build immediately)
```

### Team Goal Setting

Convert North Star to team objectives:

**Q1 Goal**: Increase Minutes Read from 100K to 200K per week

**Engineering Team**:
- Improve page load time (more reads)
- Add reading progress bar (better engagement)
- Build recommendation engine (more articles per reader)

**Content Team**:
- Publish 2x per week instead of 1x (more to read)
- Increase average article depth (more minutes)
- Improve headlines (more opens)

**Growth Team**:
- Increase subscribers by 50% (more readers)
- Improve email deliverability (more opens)
- Build referral program (more subscribers)

### Resource Allocation

Invest based on leverage on North Star:

```
Initiative: Improve Email Deliverability
Cost: 2 weeks engineering + $500/month
Impact: +15% open rate = +15K minutes read/week
ROI: High

Initiative: New Landing Page Design
Cost: 4 weeks design + 2 weeks engineering
Impact: +5% conversion = +2K minutes read/week
ROI: Medium

Decision: Do email deliverability first
```

## Common Pitfalls

### 1. Picking a Vanity Metric

**Bad**: Total subscribers
**Why**: Doesn't measure value delivered
**Better**: Weekly active subscribers

**Bad**: Page views
**Why**: Can be gamed, doesn't ensure value
**Better**: Time spent reading quality content

### 2. Multiple North Stars

**Problem**: "We have 3 equally important metrics"
**Reality**: You're not aligned, can't prioritize
**Solution**: Pick ONE. Others are input or supporting metrics.

### 3. Picking a Lagging Indicator

**Bad**: Revenue
**Why**: Too far removed from daily work, too slow
**Better**: The customer action that predicts revenue

**Bad**: Customer satisfaction
**Why**: Lagging, not actionable enough
**Better**: The usage behavior that creates satisfaction

### 4. Changing It Too Often

**Problem**: New North Star every quarter
**Reality**: No long-term alignment or progress
**Solution**: Change only with major pivot, give it 6-12 months

### 5. Not Connecting to Revenue

**Problem**: North Star doesn't predict business success
**Reality**: Teams optimize wrong thing
**Solution**: Validate correlation between NSM and revenue

## North Star Evolution

Your North Star should evolve as your company matures:

### Early Stage: Activation Focus
**North Star**: Weekly active users
**Why**: Need to prove product value
**Goal**: Product-market fit

### Growth Stage: Engagement Focus
**North Star**: Key action per user
**Why**: Scale what's working
**Goal**: Efficient growth

### Maturity Stage: Monetization Focus
**North Star**: Revenue per engaged user
**Why**: Sustainable business model
**Goal**: Profitability

### Example: Newsletter Journey

**Year 1** (Validation):
- North Star: Weekly active readers
- Goal: Prove people want the content

**Year 2** (Growth):
- North Star: Articles read per subscriber
- Goal: Deepen engagement

**Year 3** (Monetization):
- North Star: Revenue per engaged subscriber
- Goal: Sustainable business model

## Implementing the Framework

### Week 1: Definition
- Workshop with leadership
- Agree on North Star
- Define input metrics
- Set baseline measurements

### Week 2: Communication
- All-hands presentation
- Team workshops
- Documentation
- Dashboard creation

### Week 3: Integration
- Update OKRs to align with North Star
- Revise roadmap priorities
- Adjust team goals
- Begin tracking

### Week 4+: Iteration
- Weekly North Star reviews
- Monthly deep dives
- Quarterly strategy adjustments
- Annual North Star validation

## Measuring Success

### Short-term (30 days)
- Everyone can explain the North Star
- Teams understand their input metrics
- Decisions reference North Star impact
- Dashboard is live and monitored

### Medium-term (90 days)
- OKRs aligned with North Star
- Product roadmap prioritized by NSM impact
- Resource allocation tied to NSM leverage
- Team goals cascade from North Star

### Long-term (1 year)
- North Star growing consistently
- Revenue correlates with North Star growth
- Culture shift toward customer value
- Reduced feature bloat and distraction

## Tools and Templates

### North Star Dashboard Template

```
📊 North Star Metric: [Metric Name]
Current: [Value]
Goal: [Target]
Trend: 📈/📉/➡️

Input Metrics:
1. [Metric 1]: [Current] / [Goal] (📈/📉/➡️)
2. [Metric 2]: [Current] / [Goal] (📈/📉/➡️)
3. [Metric 3]: [Current] / [Goal] (📈/📉/➡️)

This Week's Focus:
- [Key initiative impacting NSM]

Blockers:
- [What's preventing NSM growth]
```

### Impact Estimation Template

```
Feature: [Feature Name]

Hypothesis:
[Feature] will increase [North Star] because [reason]

Expected Impact:
- Input Metric 1: [+X%]
- Input Metric 2: [+Y%]
- North Star: [+Z%]

Effort: [S/M/L]
Impact: [Low/Med/High]
Priority: [P0/P1/P2]

Success Criteria:
- [Metric] increases by [X]% within [N] weeks
```

## Further Reading

- **Amplitude's North Star Playbook** - Free comprehensive guide
- **"Lean Analytics"** by Alistair Croll - Metrics that matter
- **"Measure What Matters"** by John Doerr - OKRs and metrics

---

**Key Takeaway**: Your North Star is the metric that best captures the moment when a customer gets value from your product. Get this right, and everything else—from product decisions to team goals—becomes dramatically easier to align and prioritize.
