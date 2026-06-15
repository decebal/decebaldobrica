# Decebal Dobrica - Portfolio & Newsletter Platform

A modern monorepo for my personal portfolio website, newsletter system, and admin tools.

## 🏗️ Structure

```
.
├── apps/
│   ├── web/              # Main portfolio website (decebaldobrica.com)
│   ├── wolventech/       # Wolven Tech advisory site (wolventech.io)
│   ├── newsletter-admin/ # Newsletter admin dashboard
│   ├── services-admin/   # Services/pricing admin dashboard
│   └── anything-llm/     # Local LLM / RAG tooling
├── packages/
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── database/         # AllSource event-store client & utilities
│   ├── booking/          # Shared booking/contact flow
│   ├── newsletter/       # Newsletter business logic
│   ├── email/            # Email templates (React Email) + Resend
│   ├── social/           # LinkedIn/Twitter automation
│   ├── analytics/        # PostHog analytics
│   ├── payment-gate/     # Content/access payment gating
│   └── crypto-subscriptions/ # Solana subscription logic
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

### Wolven Tech (`apps/wolventech`)
Rust-only technical advisory site with its own contact/booking flow.

**URL:** https://wolventech.io
**Tech:** Next.js 15, React 18, TailwindCSS, shadcn/ui

### Admin dashboards (`apps/newsletter-admin`, `apps/services-admin`)
Internal dashboards for managing newsletter subscribers/issues and services/pricing.

**Tech:** Next.js 15, React, TailwindCSS

> Background jobs (newsletter send, social posting) run via the `task publish`
> script (`apps/web/scripts/publish-blog-post.ts`), not edge functions.

## 📚 Packages

All packages are available as workspace dependencies:

```typescript
import { Button } from '@decebal/ui'
import { getAllSourceClient } from '@decebal/database'
import { subscribeToNewsletter } from '@decebal/newsletter'
import { WelcomeEmail } from '@decebal/email'
import { postToLinkedIn } from '@decebal/social'
import { trackEvent } from '@decebal/analytics'
import { requireAccess } from '@decebal/payment-gate'
```

## 🛠️ Development

### Prerequisites
- Bun >= 1.0
- Node.js >= 18
- AllSource tenant + service API key (event store backend)
- Resend account

### Environment Variables

Copy `.env.example` to `.env.local` in each app:

```bash
# AllSource (event store — replaces the former Supabase backend)
ALLSOURCE_API_URL=https://allsource-query.fly.dev
ALLSOURCE_TENANT_ID=
ALLSOURCE_API_KEY=

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

# Data (AllSource event store — no relational schema to push)
# One-off backfill / migration tooling lives in:
#   packages/database/scripts/migrate-supabase-to-allsource.ts

# Testing
bun run test                  # Unit tests
bun run test:e2e              # E2E tests

# Clean
bun run clean                 # Clean build artifacts
bun run clean:all             # Clean everything including node_modules
```

## 🎯 Tech Stack

<div align="center">

### Frontend & Framework
**[Next.js 15](https://nextjs.org)** • **[React 19](https://react.dev)** • **[TypeScript](https://www.typescriptlang.org)**
App Router • Server Components • Server Actions • Streaming

### Styling & UI
**[TailwindCSS](https://tailwindcss.com)** • **[shadcn/ui](https://ui.shadcn.com)** • **[Radix UI](https://www.radix-ui.com)**
Responsive Design • Dark Mode • Accessible Components

### Backend & Data
**[AllSource](https://www.all-source.xyz)** (Rust event store) • Event Sourcing • Projections
Append-only events • Tenant-scoped • `@allsourcedev/client` TS SDK

### Email & Communication
**[Resend](https://resend.com)** • **[React Email](https://react.email)**
Transactional Emails • Newsletter System • Email Templates

### Payments & Monetization
**[Stripe](https://stripe.com)** (Subscriptions & One-time) • **[Solana Pay](https://solanapay.com)**
Crypto Payments • Webhooks • Payment Analytics

### AI & Automation
**[Groq](https://groq.com)** (Llama 3.1 8B) • **[Vercel AI SDK](https://sdk.vercel.ai)**
Fast AI Chat • Streaming Responses • Context-aware Assistance

### Analytics & Monitoring
**[PostHog](https://posthog.com)** (Product Analytics)
Event Tracking • Session Recording • Feature Flags

### DevOps & Tooling
**[Turborepo](https://turbo.build)** • **[Bun](https://bun.sh)** • **[Biome](https://biomejs.dev)**
Monorepo Management • Fast Package Manager • Unified Linting

### Social Media Integration
**[LinkedIn API](https://developer.linkedin.com)** • **[Twitter API](https://developer.twitter.com)**
Auto-posting • Content Distribution • Engagement Tracking

</div>

## 📖 Documentation

### 🗄️ Data & Architecture (AllSource)
- [AllSource Cutover](./docs/ALLSOURCE_CUTOVER.md) - How the app moved off Supabase to AllSource
- [AllSource Event Model](./docs/ALLSOURCE_EVENT_MODEL.md) - Streams, events, and projections per domain
- [Migration Report](./docs/MIGRATION_REPORT.md) - Supabase-dump → AllSource migration results

### 📧 Newsletter System
- [Newsletter Story](./docs/NEWSLETTER_STORY.md) - Product narrative
- [Newsletter Honest Status](./docs/NEWSLETTER_HONEST_STATUS.md) - Current implementation status
- [Newsletter Admin App](./docs/NEWSLETTER_ADMIN_APP.md) - Admin dashboard
- [Blog Post Creation Guide](./docs/BLOG_POST_CREATION_GUIDE.md) - Authoring + `task publish`

### 💰 Payments & Services
- [Crypto Payments Guide](./docs/CRYPTO_PAYMENTS.md) - Solana Pay integration
- [Global Payment System Plan](./docs/GLOBAL_PAYMENT_SYSTEM_PLAN.md) - Multi-currency strategy
- [Geo Pricing Implementation](./docs/GEO_PRICING_IMPLEMENTATION.md) - Location-based pricing
- [Pricing Research](./docs/PRICING_RESEARCH.md) - Market analysis
- [Pricing Gate Strategy](./docs/PRICING_GATE_STRATEGY.md) - Content gating approach
- [Wallet Payment Setup](./docs/WALLET_PAYMENT_SETUP.md) - Wallet integration
- [Wallet Auth Architecture](./docs/WALLET_AUTH_ARCHITECTURE.md) - Authentication flow

### 🎨 Portfolio & Content
- [Service Offerings Study](./docs/SERVICE_OFFERINGS_STUDY.md) - Service market research
- [Services Implementation Summary](./docs/SERVICES_IMPLEMENTATION_SUMMARY.md) - Services feature status
- [Case Study Examples](./docs/CASE_STUDY_EXAMPLES.md) - Portfolio case study templates
- [Homepage Video Script](./docs/HOMEPAGE_VIDEO_SCRIPT.md) - Video content plan

### 📊 Analytics & Monitoring
- [PostHog Setup](./docs/POSTHOG_SETUP.md) - Analytics configuration
- [PostHog Troubleshooting](./docs/POSTHOG_TROUBLESHOOTING.md) - Common issues & fixes

### 🛠️ Development
- [Development Standards](./docs/DEVELOPMENT_STANDARDS.md) - Code quality guidelines
- [Port Configuration](./docs/PORT_CONFIGURATION.md) - Dev server ports per app
- [Bot Protection](./docs/BOT_PROTECTION.md) - Cloudflare Turnstile on forms
- [NPM Package Strategy](./docs/NPM_PACKAGE_STRATEGY.md) - Package publishing plan
- [Personal Config](./docs/PERSONAL_CONFIG.md) - Configuration management

## 🚀 Deployment

### Vercel

Each app deploys separately:

```bash
vercel --cwd apps/web          # Portfolio site
vercel --cwd apps/wolventech   # Wolven Tech site
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
