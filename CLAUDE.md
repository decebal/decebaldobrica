# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **Taskfile** for common development tasks. Run `task` to see all available commands.

### Development
```bash
task dev                 # Start dev server (web app)
task dev:admin           # Start admin dashboard (port 3101)
task install             # Install all dependencies
task clean               # Clean build artifacts
```

### Build & Deploy
```bash
task build               # Build web app for production
task build:admin         # Build admin dashboard
task build:packages      # Build all packages
task deploy              # Deploy to Vercel production
```

### Code Quality
```bash
task lint                # Run Biome linter
task lint:fix            # Fix linting issues
task format              # Format code with Biome
task type-check          # TypeScript type checking
task check               # Run all checks (lint + format + types)
```

**Important:** This project uses **Biome** (not ESLint/Prettier). The configuration in `biome.json` specifies:
- Single quotes for JS, double for JSX
- 2-space indentation
- 100 character line width
- Semicolons as needed (not always)
- Import type enforcement (`import type` required for types)

### Testing
```bash
task test                # Run E2E tests
task test:ui             # Run E2E tests with UI
task test:debug          # Debug E2E tests
task test:install        # Install Playwright browsers
```

**E2E Tests:** Located in `tests/e2e/`, tests catch runtime issues like:
- Missing "use client" directives
- React hydration errors
- Console errors
- Navigation issues

### Packages
```bash
task pkg:crypto          # Build & test crypto-subscriptions
task pkg:crypto:test     # Test crypto-subscriptions
task pkg:crypto:coverage # Test coverage
task pkg:newsletter:test # Test newsletter package
```

### Content
```bash
task publish -- slug     # Publish blog post (sends newsletter, posts to social)
task case-study          # Add new case study (interactive)
task list:posts          # List all blog posts
```

### AI Services (Groq)

AI chat uses Groq's fast LLM API with Llama 3.1 model. **Free tier available!**

- Model: llama-3.1-8b-instant
- Fast inference with Groq's custom LPU hardware
- Requires `GROQ_API_KEY` environment variable

## Architecture

### Tech Stack
- **Next.js 15** with App Router and Server Actions
- **Bun** as package manager and runtime
- **TypeScript** with strict checking
- **Tailwind CSS** + shadcn/ui components
- **Groq** for AI chat (Llama 3.1 8B Instant)
- **Solana Pay** for payments
- **PostHog** for analytics (client & server-side)
- **MDX** for blog posts with frontmatter

### Personal Configuration

All personal information (name, email, social links, professional details, etc.) is centralized in `src/config/personal.json`. This makes it easy to update your information in one place without hunting through multiple files. See `docs/PERSONAL_CONFIG.md` for detailed documentation.

### Blog System

The blog uses MDX files stored in `content/blog/`. All current blog posts (39 posts) were imported from the previous blog at https://decebalonprogramming.net/ using the import script `scripts/import-blog-posts.js`.

To add new posts:
1. Create `.mdx` files with frontmatter in `content/blog/`
2. The RSS feed at `/rss.xml` is automatically generated
3. Posts are sorted by date (newest first)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   └── page.tsx           # Home page
├── actions/               # Server Actions (Next.js)
│   ├── meeting-action.ts  # Meeting scheduling
│   └── payment-action.ts  # Payment processing
├── lib/                   # Core business logic
│   ├── analytics.ts       # PostHog analytics tracking
│   ├── meetingPayments.ts # Payment configuration (in-memory)
│   ├── googleCalendar.ts  # Google Calendar API
│   ├── emailService.ts    # Email via Resend
│   ├── blogPosts.ts       # Blog post utilities
│   ├── personalConfig.ts  # Personal config loader
│   └── portfolioContext.ts # Portfolio data/constants
├── config/                # Configuration files
│   └── personal.json      # Personal information (centralized)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layouts/          # Layout components
│   ├── ChatInterfaceAI.tsx # AI chat interface
│   └── icons/            # Icon components
├── utils/                # Utility functions
└── hooks/                # React hooks

content/
└── blog/                 # Blog posts (MDX files)
    └── *.mdx             # 39 posts imported from decebalonprogramming.net

docs/
├── CRYPTO_PAYMENTS.md    # Crypto payment integration guide
└── PERSONAL_CONFIG.md    # Personal config documentation
```

### Key Architecture Patterns

**Server Actions Flow:**
1. UI components call Server Actions in `src/actions/`
2. Server Actions validate input with Zod schemas
3. Actions delegate to business logic in `src/lib/`
4. Results return to client components

**AI Chat System:**
- Uses Groq API with Llama 3.1 8B Instant model
- Vercel AI SDK v5 with `useChat` hook for streaming responses
- System prompt configured with portfolio context for accurate answers
- Redirects scheduling requests to booking form below chat
- Max tokens limited to 400 for concise responses
- Chat history tracked via PostHog server-side (conversations, messages, tokens)

**Analytics:**
- PostHog for both client-side and server-side tracking
- Client-side: `src/lib/analytics.ts` with helpers for chat, meetings, payments
- Server-side: Chat API route tracks conversations, messages, and errors
- No local database - all analytics in PostHog

**Meeting System:**
- Integrates with Google Calendar API for availability checks
- Sends confirmation emails via Resend
- Supports paid meetings via Solana Pay
- Meeting data stored in Google Calendar

**Payment Integration:**
- Solana Pay for crypto payments
- Meeting types have different pricing (free, 0.05 SOL, 0.1 SOL, 0.15 SOL)
- Payment status tracked in-memory (`src/lib/meetingPayments.ts`)
- Service access payments stored in Supabase

### Important Configuration

**next.config.ts:**
- TypeScript and ESLint errors ignored during builds (use `task lint` and `task type-check` instead)
- Uses Turbopack for fast dev mode (not webpack)
- Server Actions body size limit: 2MB

**Environment Variables:**
See `.env.example` for all required variables. Key ones:
- `GROQ_API_KEY` - Required for AI chat functionality
- `NEXT_PUBLIC_POSTHOG_KEY` - Required for analytics tracking
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host (defaults to app.posthog.com)
- `NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS` - Required for payments
- `RESEND_API_KEY` - Required for emails
- `GOOGLE_REFRESH_TOKEN` - Required for calendar integration

### Development Notes

1. **Before starting development:**
   ```bash
   task test:install # Install Playwright browsers (first time only)
   ```

2. **Client vs Server Components:**
   - Any component using React hooks (`useState`, `useEffect`, `useContext`, etc.) MUST have `'use client'` at the top
   - E2E tests will catch missing directives early
   - Server components are the default in Next.js 15 App Router

3. **Payment testing:** Use Solana devnet for testing. Set `NEXT_PUBLIC_SOLANA_NETWORK=devnet`.

4. **Analytics tracking:** All events are tracked via PostHog. Use helpers in `src/lib/analytics.ts` for client-side tracking. Server-side tracking is automatic in the chat API route.

5. **Adding new meeting types:** Edit `MEETING_TYPES_WITH_PRICING` in `src/lib/meetingPayments.ts` and `MEETING_TYPES` in `src/lib/portfolioContext.ts`.

6. **Styling:** Uses Tailwind + shadcn/ui. Components are in `src/components/ui/`. Use `cn()` utility from `src/lib/utils.ts` for conditional classes.

7. **Testing before deployment:**
   ```bash
   task test:e2e     # Catch runtime errors early
   task lint:fix     # Fix linting issues
   task type-check   # Check TypeScript
   task build        # Ensure build succeeds
   ```

## Common Tasks

### Add a new Server Action
1. Create in `src/actions/your-action.ts`
2. Add `'use server'` directive at top
3. Validate input with Zod schema
4. Import and use in client components

### Modify AI chat behavior
Edit system prompt in `src/lib/portfolioContext.ts` (PORTFOLIO_CONTEXT constant) or adjust maxTokens in `src/app/api/chat/route.ts`

### Add new analytics events
Use `trackEvent()` from `src/lib/analytics.ts` with custom event types. Server-side tracking can be added to API routes using PostHog Node SDK.
