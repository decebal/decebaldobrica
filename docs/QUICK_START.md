# Quick Start Guide

**Location:** `/Users/decebaldobrica/Projects/personal/portofolio-monorepo`

## 🚀 Get Up and Running

### 1. Copy Environment Variables

```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo/apps/web
cp /Users/decebaldobrica/Projects/personal/portofolio-nextjs/.env.local .env.local
```

### 2. Start Development Server

```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo
bun run dev:web
```

Visit: **http://localhost:3002** (or whatever port is shown)

### 3. Verify Everything Works

- ✅ Homepage loads
- ✅ Blog page shows posts
- ✅ Newsletter signup forms visible
- ✅ AI chat works
- ✅ Meeting booking works

---

## 📚 Important Documents

### Must Read First
1. **[NEWSLETTER_REMAINING_WORK.md](./NEWSLETTER_REMAINING_WORK.md)** ⭐
   - Complete breakdown of what's left to build
   - Phase-by-phase guide with code examples
   - Timeline estimates (15-20 days total)

2. **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)**
   - What was migrated
   - How the monorepo is structured
   - Available commands

### Reference Docs (in `docs/`)
3. **NEWSLETTER_IMPLEMENTATION_PLAN.md** - Original 14-page plan
4. **NEWSLETTER_PROGRESS.md** - Detailed progress tracking
5. **NEWSLETTER_SUPABASE_SETUP.md** - Database setup guide
6. **SUPABASE_NEWSLETTER_SCHEMA.sql** - Database schema to run

---

## 🎯 Next Steps for Newsletter

### Phase 2: Email Confirmation (Start Here)

**What:** Send confirmation emails when users sign up

**Files to Create:**
```
packages/email/src/newsletter-confirmation.tsx
packages/email/src/newsletter-welcome.tsx
packages/email/src/send.ts
apps/web/src/app/newsletter/confirm/page.tsx
```

**Time:** 1-2 days

**See:** [NEWSLETTER_REMAINING_WORK.md](./NEWSLETTER_REMAINING_WORK.md) - Phase 2 section for complete code examples

---

## 🛠️ Common Commands

```bash
# From monorepo root: /Users/decebaldobrica/Projects/personal/portofolio-monorepo

# Development
bun run dev:web              # Start web app
bun run dev:newsletter       # Start newsletter admin (when built)

# Build
bun run build:web            # Build web app
bun run build                # Build everything

# Code Quality
bun run lint                 # Check linting
bun run lint:fix             # Fix linting issues
bun run format               # Format code
bun run type-check           # TypeScript check

# Testing
bun run test:e2e             # E2E tests (from apps/web)

# Clean
bun run clean                # Clean build artifacts
```

---

## 📦 Monorepo Structure

```
portofolio-monorepo/
├── apps/
│   └── web/                 # Main website (working)
├── packages/
│   ├── ui/                  # UI components ✅
│   ├── database/            # Supabase client ✅
│   ├── newsletter/          # Newsletter logic ✅
│   ├── analytics/           # PostHog ✅
│   └── email/               # Email templates (to build)
├── docs/                    # Documentation
├── NEWSLETTER_REMAINING_WORK.md  # ⭐ Read this!
└── README.md                # Full overview
```

---

## 🔑 Environment Variables

Located in: `apps/web/.env.local`

**Required for Current Features:**
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
GROQ_API_KEY=
```

**Needed for Phase 2 (Email):**
```bash
RESEND_API_KEY=
EMAIL_FROM=newsletter@decebaldobrica.com
```

**Needed for Phase 3 (Payments):**
```bash
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🆘 Troubleshooting

### Import Errors
```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo
bun install
```

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Build Fails
```bash
bun run clean
bun install
bun run build:web
```

### TypeScript Errors
Check workspace paths in `apps/web/tsconfig.json`

---

## ✅ What's Already Done

### Phase 1: Foundation (Complete)
- ✅ Newsletter signup UI component
- ✅ Blog integration
- ✅ Supabase database schema
- ✅ Newsletter business logic (`@decebal/newsletter`)
- ✅ API endpoint (`/api/newsletter/subscribe`)
- ✅ Documentation
- ✅ Monorepo migration

### What's Working Right Now
1. Newsletter signup forms on `/blog`
2. Email validation
3. Supabase storage
4. UTM tracking

### What Needs Building (See NEWSLETTER_REMAINING_WORK.md)
- Phase 2: Email confirmation (1-2 days)
- Phase 3: Premium payments (2-3 days)
- Phase 4: Social automation (3-4 days)
- Phase 5: Publishing CLI (2-3 days)
- Phase 6: Admin dashboard (5-7 days)

**Total remaining:** ~15-20 days

---

## 🎯 Recommended Approach

1. **Test current setup** (today)
   - Run dev server
   - Test newsletter signup
   - Verify Supabase storage

2. **Run database schema** (today)
   - Open Supabase Dashboard
   - SQL Editor → Run `SUPABASE_NEWSLETTER_SCHEMA.sql`

3. **Start Phase 2** (this week)
   - Set up Resend
   - Build email templates
   - Create confirmation flow

4. **Build incrementally** (next 2-3 weeks)
   - Complete one phase at a time
   - Test each phase thoroughly
   - Don't skip ahead

---

## 📞 Getting Help

1. Check the relevant documentation file
2. Review code examples in `NEWSLETTER_REMAINING_WORK.md`
3. Ask me to implement the next phase
4. Test incrementally

---

## 🚀 Ready to Go!

**Your monorepo is fully set up and ready for newsletter development.**

**Next action:** Open `NEWSLETTER_REMAINING_WORK.md` and start Phase 2!

---

**Location:** `/Users/decebaldobrica/Projects/personal/portofolio-monorepo`
**Main Docs:** `NEWSLETTER_REMAINING_WORK.md` ⭐
