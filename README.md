# Decebal Dobrica - Portfolio & Newsletter Platform

A modern monorepo for my personal portfolio website, newsletter system, and admin tools.

## 🏗️ Structure

```
.
├── apps/
│   ├── web/              # Main portfolio website (decebaldobrica.com)
│   ├── newsletter/       # Newsletter admin dashboard
│   └── api/              # Supabase Edge Functions
├── packages/
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── database/         # Supabase client & utilities
│   ├── newsletter/       # Newsletter business logic
│   ├── email/            # Email templates (React Email)
│   ├── social/           # LinkedIn/Twitter automation
│   ├── analytics/        # PostHog analytics
│   └── payments/         # Stripe & Solana Pay
└── tooling/
    ├── typescript/       # Shared TS configs
    └── biome/            # Linting & formatting
```

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start all apps in development
bun run dev

# Start specific app
bun run dev:web
bun run dev:newsletter

# Build all apps
bun run build

# Lint & format
bun run lint
bun run format
```

## 📦 Apps

### Web (`apps/web`)
Main portfolio website with blog, services, contact form, and newsletter signup.

**URL:** https://decebaldobrica.com
**Tech:** Next.js 15, React 19, TailwindCSS, shadcn/ui

### Newsletter (`apps/newsletter`)
Admin dashboard for managing newsletter subscribers, composing issues, and viewing analytics.

**URL:** https://newsletter.decebaldobrica.com (TBD)
**Tech:** Next.js 15, React 19, TailwindCSS

### API (`apps/api`)
Supabase Edge Functions for background jobs like sending newsletters and posting to social media.

**Functions:**
- `newsletter-send` - Send newsletter to subscribers
- `social-publish` - Auto-post blog posts to LinkedIn/Twitter
- `payment-webhook` - Handle Stripe/Solana webhooks

## 📚 Packages

All packages are available as workspace dependencies:

```typescript
import { Button } from '@decebal/ui'
import { getSupabaseClient } from '@decebal/database'
import { subscribeToNewsletter } from '@decebal/newsletter'
import { WelcomeEmail } from '@decebal/email'
import { postToLinkedIn } from '@decebal/social'
import { trackEvent } from '@decebal/analytics'
import { createCheckout } from '@decebal/payments'
```

## 🛠️ Development

### Prerequisites
- Bun >= 1.0
- Node.js >= 18
- Supabase account
- Resend account

### Environment Variables

Copy `.env.example` to `.env.local` in each app:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=

# Groq (AI)
GROQ_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Commands

```bash
# Development
bun run dev                    # All apps
bun run dev:web               # Web only
bun run dev:newsletter        # Newsletter only

# Build
bun run build                 # All apps
bun run build:web             # Web only

# Linting
bun run lint                  # Check all
bun run lint:fix              # Fix all

# Type checking
bun run type-check            # All packages

# Database
bun run db:push               # Push schema to Supabase
bun run db:migrate            # Run migrations

# Testing
bun run test                  # Unit tests
bun run test:e2e              # E2E tests

# Clean
bun run clean                 # Clean build artifacts
bun run clean:all             # Clean everything including node_modules
```

## 🎯 Tech Stack

**Framework:** Next.js 15 with App Router
**UI:** React 19, TailwindCSS, shadcn/ui
**Database:** Supabase (PostgreSQL)
**Email:** Resend + React Email
**Analytics:** PostHog
**Payments:** Stripe + Solana Pay
**AI:** Groq (Llama 3.1)
**Build:** Turborepo + Bun
**Linting:** Biome

## 📖 Documentation

### Getting Started
- [Migration Complete Summary](./MIGRATION_COMPLETE.md) - Monorepo migration summary
- [Newsletter Remaining Work](./NEWSLETTER_REMAINING_WORK.md) - **What's left to build**

### Detailed Guides
- [Monorepo Migration Plan](./docs/MONOREPO_MIGRATION_PLAN.md)
- [Newsletter Implementation](./docs/NEWSLETTER_IMPLEMENTATION_PLAN.md)
- [Newsletter Progress](./docs/NEWSLETTER_PROGRESS.md)
- [Supabase Setup](./docs/NEWSLETTER_SUPABASE_SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🚀 Deployment

### Vercel (apps/web & apps/newsletter)

Each app deploys separately:

```bash
# Web app
vercel --cwd apps/web

# Newsletter app
vercel --cwd apps/newsletter
```

### Supabase Edge Functions (apps/api)

```bash
supabase functions deploy
```

## 📊 Features

### Portfolio Website
- ✅ Blog with MDX support
- ✅ Newsletter signup (3 tiers)
- ✅ Meeting booking with calendar integration
- ✅ AI chatbot (Groq)
- ✅ Contact form
- ✅ Services pages
- ✅ Work portfolio

### Newsletter System
- ✅ Subscriber management
- ✅ Email confirmation (double opt-in)
- ⏳ Newsletter composer
- ⏳ Automated sending
- ⏳ Analytics dashboard
- ⏳ Segmentation by tier

### Social Media Automation
- ⏳ Auto-post to LinkedIn
- ⏳ Auto-post to Twitter
- ⏳ AI-generated images
- ⏳ Engagement tracking

### Premium Features
- ⏳ Stripe subscriptions
- ⏳ Solana Pay integration
- ⏳ Content gating
- ⏳ Subscriber dashboard

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Feel free to open an issue.

## 📝 License

MIT © Decebal Dobrica

---

**Built with ❤️ by [Decebal Dobrica](https://decebaldobrica.com)**
