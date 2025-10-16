# Newsletter System - Remaining Work

**Current Status:** Phase 1 Complete ✅
**Location:** Now in monorepo at `/Users/decebaldobrica/Projects/personal/portofolio-monorepo`
**Last Updated:** October 15, 2025

## 🎯 What's Already Done

### ✅ Phase 1: Foundation (100% Complete)

1. **Research & Strategy**
   - Analyzed 4 premium newsletters for best practices
   - Created pricing model: Free + Premium ($14.99/mo) + Founding ($300/yr)
   - Projected revenue: $21K Year 1, $52K Year 2

2. **UI Components**
   - `NewsletterSignup.tsx` component (3 variants)
   - Integrated into blog page at `/blog`
   - Mobile-responsive design

3. **Database Schema**
   - Complete Supabase PostgreSQL schema
   - 5 tables: subscribers, issues, events, subscriptions, social_posts
   - Row Level Security (RLS) enabled
   - Analytics views and helper functions

4. **Business Logic**
   - Package: `@decebal/newsletter` (in monorepo)
   - Core functions: subscribe, confirm, unsubscribe, stats
   - API endpoint: `/api/newsletter/subscribe`
   - Zod validation, UTM tracking

5. **Documentation**
   - `NEWSLETTER_IMPLEMENTATION_PLAN.md` - Complete roadmap
   - `NEWSLETTER_SUPABASE_SETUP.md` - Setup guide
   - `NEWSLETTER_PROGRESS.md` - Progress tracking
   - `SUPABASE_NEWSLETTER_SCHEMA.sql` - Database schema

---

## 🚧 What's Left To Do

### 📋 Phase 2: Email Confirmation Flow (Next Priority)

**Goal:** Send double opt-in emails and activate subscribers

#### 2.1 Email Templates (Use @decebal/email package)

**Create in:** `/Users/decebaldobrica/Projects/personal/portofolio-monorepo/packages/email/src/`

```typescript
// newsletter-confirmation.tsx
export function NewsletterConfirmationEmail({ name, confirmUrl }) {
  return (
    // React Email template
    // Subject: "Confirm your subscription to Decebal's Newsletter"
    // CTA: Confirm Subscription button
  )
}

// newsletter-welcome.tsx
export function NewsletterWelcomeEmail({ name, tier }) {
  return (
    // React Email template
    // Subject: "Welcome to the newsletter!"
    // Content: What to expect, how often, premium benefits
  )
}
```

**Dependencies to add to `@decebal/email`:**
```bash
cd packages/email
bun add @react-email/components @react-email/render
```

#### 2.2 Email Sending Service

**Create in:** `packages/email/src/send.ts`

```typescript
import { Resend } from 'resend'
import { NewsletterConfirmationEmail } from './newsletter-confirmation'
import { NewsletterWelcomeEmail } from './newsletter-welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNewsletterConfirmation(
  email: string,
  name: string,
  confirmToken: string
) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?token=${confirmToken}`

  await resend.emails.send({
    from: 'Decebal Dobrica <newsletter@decebaldobrica.com>',
    to: email,
    subject: 'Confirm your newsletter subscription',
    react: NewsletterConfirmationEmail({ name, confirmUrl })
  })
}

export async function sendNewsletterWelcome(
  email: string,
  name: string,
  tier: string
) {
  await resend.emails.send({
    from: 'Decebal Dobrica <newsletter@decebaldobrica.com>',
    to: email,
    subject: 'Welcome to my newsletter!',
    react: NewsletterWelcomeEmail({ name, tier })
  })
}
```

#### 2.3 Confirmation Token System

**Update:** `packages/newsletter/src/index.ts`

Add functions:
```typescript
// Generate secure confirmation token
export async function generateConfirmationToken(email: string): Promise<string>

// Verify and activate subscription
export async function confirmSubscription(token: string): Promise<{ success: boolean; error?: string }>
```

**Implementation:**
- Use crypto to generate secure token
- Store token in `newsletter_subscribers.confirmation_token`
- Add expiry (24 hours)
- Update status to 'active' on confirmation

#### 2.4 Confirmation Page

**Create:** `apps/web/src/app/newsletter/confirm/page.tsx`

```typescript
'use client'
import { useSearchParams } from 'next/navigation'
import { confirmSubscription } from '@decebal/newsletter'
import { useEffect, useState } from 'react'

export default function NewsletterConfirmPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (token) {
      confirmSubscription(token).then(result => {
        setStatus(result.success ? 'success' : 'error')
      })
    }
  }, [token])

  // Show loading, success, or error UI
  return <div>...</div>
}
```

#### 2.5 Update Subscribe Flow

**Modify:** `packages/newsletter/src/index.ts` - `subscribeToNewsletter()`

Add after creating subscriber:
```typescript
// Generate confirmation token
const token = await generateConfirmationToken(data.email)

// Send confirmation email
await sendNewsletterConfirmation(data.email, data.name || 'there', token)

return {
  success: true,
  message: 'Please check your email to confirm your subscription',
  subscriberId
}
```

**Estimated Time:** 1-2 days

---

### 📋 Phase 3: Premium Subscriptions (Week 3)

**Goal:** Enable paid premium subscriptions via Stripe

#### 3.1 Stripe Setup

**Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Stripe Products:**
1. Premium Monthly: $14.99/mo
2. Founding Member: $300/yr (one-time or recurring)

#### 3.2 Checkout Flow

**Create:** `apps/web/src/app/api/newsletter/checkout/route.ts`

```typescript
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { email, tier } = await request.json()

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: tier === 'founding' ? 'payment' : 'subscription',
    customer_email: email,
    line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/pricing`,
    metadata: { email, tier }
  })

  return NextResponse.json({ url: session.url })
}
```

#### 3.3 Stripe Webhook Handler

**Create:** `apps/web/src/app/api/newsletter/webhook/stripe/route.ts`

Handle events:
- `checkout.session.completed` - Activate premium subscription
- `invoice.payment_succeeded` - Renew subscription
- `customer.subscription.deleted` - Downgrade to free

Update subscriber tier in Supabase on successful payment.

#### 3.4 Pricing Component

**Create:** `apps/web/src/components/NewsletterPricing.tsx`

Display pricing tiers with:
- Free tier features
- Premium tier features ($14.99/mo)
- Founding member benefits ($300/yr)
- Stripe Checkout buttons

**Estimated Time:** 2-3 days

---

### 📋 Phase 4: Social Media Automation (Week 4)

**Goal:** Auto-post blog content to LinkedIn and Twitter/X

#### 4.1 Create Social Media Package

**Create:** `packages/social/` (new package)

```
packages/social/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── linkedin.ts
    ├── twitter.ts
    └── types.ts
```

**package.json:**
```json
{
  "name": "@decebal/social",
  "version": "1.0.0",
  "dependencies": {
    "linkedin-api-client": "^1.0.0",
    "twitter-api-v2": "^1.15.0"
  }
}
```

#### 4.2 LinkedIn Integration

**OAuth Setup:**
1. Create LinkedIn App at https://www.linkedin.com/developers/apps
2. Add redirect URI: `https://decebaldobrica.com/api/social/linkedin/callback`
3. Request scopes: `w_member_social`, `r_basicprofile`

**Create:** `packages/social/src/linkedin.ts`

```typescript
export async function postToLinkedIn(content: {
  text: string
  imageUrl?: string
  link?: string
}): Promise<{ success: boolean; postId?: string }>
```

**Create API routes:**
- `apps/web/src/app/api/social/linkedin/auth/route.ts` - OAuth flow
- `apps/web/src/app/api/social/linkedin/post/route.ts` - Create post

#### 4.3 Twitter/X Integration

**API Setup:**
1. Create Twitter Developer account
2. Create app with write permissions
3. Get API keys

**Create:** `packages/social/src/twitter.ts`

```typescript
export async function postToTwitter(content: {
  text: string
  imageUrl?: string
  threadParts?: string[]
}): Promise<{ success: boolean; tweetId?: string }>
```

#### 4.4 AI Media Generation

**Create:** `packages/social/src/media-generator.ts`

Use Groq to:
1. Generate optimized social media descriptions from blog post
2. Create image prompts
3. OR use template-based Open Graph images (faster, free)

**Option A: Template-based (Recommended for MVP)**
- Use `@vercel/og` to generate images
- Template with blog title + gradient background
- Fast, free, good enough

**Option B: AI-generated (Future Enhancement)**
- Use Replicate or DALL-E
- Cost per image
- Better quality, takes longer

**Estimated Time:** 3-4 days

---

### 📋 Phase 5: Publishing Workflow (Week 5)

**Goal:** One command to publish blog post everywhere

#### 5.1 Publishing CLI Script

**Create:** `apps/web/scripts/publish-blog-post.ts`

```typescript
#!/usr/bin/env bun
import { getActiveSubscribers, createNewsletterIssue } from '@decebal/newsletter'
import { sendNewsletterIssue } from '@decebal/email'
import { postToLinkedIn, postToTwitter } from '@decebal/social'
import { generateSocialMediaImage } from '@decebal/social/media-generator'

async function publishBlogPost(slug: string) {
  console.log(`📰 Publishing: ${slug}`)

  // 1. Load blog post from MDX
  const post = await loadBlogPost(slug)

  // 2. Create newsletter issue
  const issue = await createNewsletterIssue({
    title: post.title,
    content: post.content,
    slug: post.slug
  })

  // 3. Send to subscribers (by tier)
  const subscribers = await getActiveSubscribers('all')
  await sendNewsletterIssue(issue, subscribers)

  // 4. Generate social media image
  const imageUrl = await generateSocialMediaImage(post)

  // 5. Post to LinkedIn
  await postToLinkedIn({
    text: `New post: ${post.title}\n\n${post.excerpt}\n\nRead more: ${post.url}`,
    imageUrl
  })

  // 6. Post to Twitter (as thread)
  await postToTwitter({
    text: `🧵 New post: ${post.title}\n\n${post.excerpt}`,
    threadParts: generateTwitterThread(post),
    imageUrl
  })

  console.log('✅ Published successfully!')
}

// Usage: bun run publish-post --slug=my-new-post
const slug = process.argv[2]?.replace('--slug=', '')
if (!slug) {
  console.error('Usage: bun run publish-post --slug=my-new-post')
  process.exit(1)
}

publishBlogPost(slug)
```

#### 5.2 Add to package.json

**Modify:** `apps/web/package.json`

```json
{
  "scripts": {
    "publish-post": "bun ./scripts/publish-blog-post.ts"
  }
}
```

**Usage:**
```bash
bun run publish-post --slug=optimizing-rust-api-performance
```

#### 5.3 GitHub Action (Optional)

**Create:** `.github/workflows/publish-blog-post.yml`

Auto-detect new blog posts in `content/blog/` and publish them.

**Estimated Time:** 2-3 days

---

### 📋 Phase 6: Newsletter Admin App (Week 6-7)

**Goal:** Dashboard to manage newsletter

#### 6.1 Create Admin App

**Initialize:** `apps/newsletter/`

```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo/apps
mkdir newsletter
cd newsletter
# Copy structure from apps/web
```

**Routes:**
- `/` - Dashboard overview (stats)
- `/subscribers` - Subscriber list with filters
- `/compose` - Newsletter composer (rich text editor)
- `/analytics` - Charts and metrics
- `/settings` - Email templates, preferences

#### 6.2 Key Features

**Subscriber Management:**
- List all subscribers with pagination
- Filter by tier, status, signup date
- Export to CSV
- Manual add/remove

**Newsletter Composer:**
- Rich text editor (TipTap or Lexical)
- Preview for free vs premium content
- Schedule sending
- Save as draft

**Analytics Dashboard:**
- Subscriber growth chart
- Open rate / Click rate metrics
- Revenue tracking (MRR, ARR)
- Top performing posts

#### 6.3 Authentication

Protect admin app with:
- NextAuth.js
- Admin-only access
- Environment variable: `ADMIN_EMAIL=your@email.com`

**Estimated Time:** 5-7 days

---

## 📊 Summary Timeline

| Phase | Description | Time | Priority |
|-------|-------------|------|----------|
| ✅ 1 | Foundation & Signup | Done | - |
| 🚧 2 | Email Confirmation | 1-2 days | **HIGH** |
| 📋 3 | Premium Subscriptions | 2-3 days | HIGH |
| 📋 4 | Social Automation | 3-4 days | MEDIUM |
| 📋 5 | Publishing Workflow | 2-3 days | MEDIUM |
| 📋 6 | Admin Dashboard | 5-7 days | LOW |

**Total Remaining:** ~15-20 days of work

---

## 🎯 Recommended Next Steps

### Immediate (This Week)

1. **Run Supabase Schema**
   ```bash
   # Open Supabase Dashboard → SQL Editor
   # Run: docs/SUPABASE_NEWSLETTER_SCHEMA.sql
   ```

2. **Test Current Signup**
   ```bash
   cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo
   bun run dev:web
   # Visit http://localhost:3002/blog
   # Test newsletter signup
   # Verify in Supabase
   ```

3. **Start Phase 2: Email Confirmation**
   - Set up Resend domain
   - Create email templates in `@decebal/email`
   - Build confirmation flow
   - Test end-to-end

### Short Term (Next 2 Weeks)

4. **Complete Phase 3: Premium Payments**
   - Set up Stripe products
   - Build checkout flow
   - Handle webhooks
   - Test premium signup

5. **Start Phase 4: Social Media**
   - Create `@decebal/social` package
   - LinkedIn OAuth setup
   - Twitter API setup
   - Test posting manually

### Medium Term (Month 2)

6. **Complete Phase 5: Publishing CLI**
   - Build automation script
   - Test with a blog post
   - Refine workflow

7. **Start Phase 6: Admin App**
   - Create `apps/newsletter`
   - Build dashboard
   - Add analytics

---

## 📝 Important Notes for Monorepo

### Package Dependencies

When working on newsletter features, you'll use these packages:

```typescript
// In apps/web or other apps
import { subscribeToNewsletter } from '@decebal/newsletter'
import { sendNewsletterConfirmation } from '@decebal/email'
import { postToLinkedIn } from '@decebal/social'
import { getSupabaseAdmin } from '@decebal/database'
```

### Adding New Dependencies

```bash
# Add to specific package
cd packages/email
bun add @react-email/components

# Add to web app
cd apps/web
bun add stripe

# Add to root (for dev tools)
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo
bun add -D some-dev-tool
```

### Running Commands

```bash
# From monorepo root
bun run dev:web              # Start web app
bun run dev:newsletter       # Start admin app (when created)
bun run build:web            # Build web app
bun run lint                 # Lint all packages
bun run type-check           # Type check all
```

---

## 🔑 Environment Variables Needed

Add to `apps/web/.env.local`:

```bash
# Newsletter (Already have)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Email (Need for Phase 2)
RESEND_API_KEY=re_...
EMAIL_FROM=newsletter@decebaldobrica.com

# Payments (Need for Phase 3)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Social Media (Need for Phase 4)
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_BEARER_TOKEN=...

# AI (Already have for Groq)
GROQ_API_KEY=...
```

---

## 📚 Reference Documentation

All docs are in `/Users/decebaldobrica/Projects/personal/portofolio-monorepo/docs/`:

1. **NEWSLETTER_IMPLEMENTATION_PLAN.md** - Complete 14-page roadmap
2. **NEWSLETTER_SUPABASE_SETUP.md** - Database setup guide
3. **NEWSLETTER_PROGRESS.md** - Detailed progress tracking
4. **SUPABASE_NEWSLETTER_SCHEMA.sql** - Database schema to run

---

## ✅ Checklist Before Starting Each Phase

### Before Phase 2 (Email Confirmation)
- [ ] Supabase schema is running
- [ ] Resend API key configured
- [ ] Domain verified in Resend
- [ ] Test current signup works

### Before Phase 3 (Payments)
- [ ] Phase 2 complete and tested
- [ ] Stripe account created
- [ ] Products created in Stripe
- [ ] Webhook endpoint configured

### Before Phase 4 (Social Media)
- [ ] LinkedIn developer app created
- [ ] Twitter developer account approved
- [ ] OAuth flows understood
- [ ] Test credentials work

### Before Phase 5 (Publishing)
- [ ] All previous phases working
- [ ] Blog post MDX structure understood
- [ ] Test each component separately

### Before Phase 6 (Admin App)
- [ ] Basic newsletter system working
- [ ] Authentication system planned
- [ ] Design/wireframes ready

---

## 🎉 Success Metrics

You'll know the system is complete when:

1. ✅ User signs up → Gets confirmation email → Clicks → Becomes active subscriber
2. ✅ User pays for premium → Stripe webhook → Upgraded in database
3. ✅ You publish blog post → CLI script → Sent to subscribers + Posted to social media
4. ✅ Admin dashboard shows real-time stats and subscriber management
5. ✅ Email open/click tracking working
6. ✅ Social posts getting engagement

**Target Launch:** 3-4 weeks from now

---

## 🆘 Getting Help

If you need help with any phase:

1. Check the detailed docs in `/docs/`
2. Ask me to implement the next phase
3. Test incrementally (don't build everything at once)
4. Use existing packages when possible (don't reinvent the wheel)

---

## 🚀 Let's Go!

**Phase 1 is complete.** The foundation is solid. Now it's time to build on top of it.

**Recommended approach:** Complete phases sequentially. Each phase builds on the previous one. Don't skip ahead.

**When you're ready to start Phase 2**, let me know and I'll help you:
1. Set up React Email templates
2. Build the confirmation flow
3. Test end-to-end
4. Move to Phase 3

**The monorepo is ready. The plan is clear. Let's ship this newsletter system! 🎯**
