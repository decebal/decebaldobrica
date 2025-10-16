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

<div align="center">

### Frontend & Framework
**[Next.js 15](https://nextjs.org)** • **[React 19](https://react.dev)** • **[TypeScript](https://www.typescriptlang.org)**
App Router • Server Components • Server Actions • Streaming

### Styling & UI
**[TailwindCSS](https://tailwindcss.com)** • **[shadcn/ui](https://ui.shadcn.com)** • **[Radix UI](https://www.radix-ui.com)**
Responsive Design • Dark Mode • Accessible Components

### Backend & Database
**[Supabase](https://supabase.com)** (PostgreSQL) • Edge Functions • Row Level Security
Real-time Subscriptions • Authentication • Storage

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

### 🚀 Getting Started
- **[Quick Start Guide](./docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Newsletter Remaining Work](./docs/NEWSLETTER_REMAINING_WORK.md)** - What's left to build for newsletter system

### 📦 Migration & Setup
- [Migration Complete Summary](./docs/MIGRATION_COMPLETE.md) - Monorepo migration overview
- [Migration Guide](./docs/MIGRATION_GUIDE.md) - Step-by-step migration instructions
- [GIT Migration Guide](./docs/GIT_MIGRATION_GUIDE.md) - Git-specific migration details
- [Monorepo Migration Plan](./docs/MONOREPO_MIGRATION_PLAN.md) - Full migration strategy

### 📧 Newsletter System
- [Newsletter Implementation Plan](./docs/NEWSLETTER_IMPLEMENTATION_PLAN.md) - Complete 14-page roadmap
- [Newsletter Progress](./docs/NEWSLETTER_PROGRESS.md) - Current implementation status
- [Newsletter Supabase Setup](./docs/NEWSLETTER_SUPABASE_SETUP.md) - Database configuration

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
- [Video Recording Software](./docs/VIDEO_RECORDING_SOFTWARE.md) - Production tools

### 📊 Analytics & Monitoring
- [PostHog Setup](./docs/POSTHOG_SETUP.md) - Analytics configuration
- [PostHog Troubleshooting](./docs/POSTHOG_TROUBLESHOOTING.md) - Common issues & fixes

### 🚀 Deployment
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Production Deployment Changes](./docs/PRODUCTION_DEPLOYMENT_CHANGES.md) - Environment-specific changes
- [Quick Start Deployment](./docs/QUICK-START-DEPLOYMENT.md) - Fast deployment guide
- [Web App Deployment](./docs/WEB_DEPLOYMENT.md) - Web-specific deployment
- [Web App README](./docs/WEB_APP_README.md) - Web app documentation

### 🛠️ Development
- [Development Standards](./docs/DEVELOPMENT_STANDARDS.md) - Code quality guidelines
- [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md) - Feature implementation status
- [Testing Summary](./docs/TESTING_SUMMARY.md) - Test coverage & strategy
- [NPM Package Strategy](./docs/NPM_PACKAGE_STRATEGY.md) - Package publishing plan
- [Personal Config](./docs/PERSONAL_CONFIG.md) - Configuration management

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
