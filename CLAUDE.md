# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses both **Taskfile** and **Bun** for development. Prefer Taskfile commands when available.

### Development
```bash
task dev                 # Start dev server with Turbopack
bun run dev             # Alternative: start dev server
task build              # Build for production
task start              # Start production server
```

### Testing
```bash
task test                # Run all tests
task test:e2e            # Run E2E tests with Playwright
task test:e2e:ui         # Run E2E tests with Playwright UI
task test:e2e:debug      # Debug E2E tests
task test:e2e:headed     # Run tests in headed mode (see browser)
task test:install        # Install Playwright browsers
```

**E2E Tests:** Located in `tests/e2e/`, tests catch runtime issues like:
- Missing "use client" directives
- React hydration errors
- Console errors
- Navigation issues

### Code Quality
```bash
task lint               # Run Biome linter
task lint:fix           # Auto-fix linting issues
task format             # Format code with Biome
task type-check         # TypeScript type checking
task check:all          # Run all checks
```

**Important:** This project uses **Biome** (not ESLint/Prettier). The configuration in `biome.json` specifies:
- Single quotes for JS, double for JSX
- 2-space indentation
- 100 character line width
- Semicolons as needed (not always)
- Import type enforcement (`import type` required for types)

### AI Services (Ollama)
```bash
task ai:status          # Check if Ollama is running
task ai:models          # List available models
task ai:pull MODEL=llama3.2  # Pull a model
```

**Required:** Ollama must be running at `http://localhost:11434` with model `llama3.2:3b` for the chat feature to work.

### Database (SQLite)
```bash
task db:init            # Initialize database
task db:stats           # View database statistics
task db:backup          # Backup database
task db:reset           # Reset database (destructive)
```

Database location: `./data/chat-history.db`

### Analytics & Payments
```bash
task analytics:summary   # View analytics summary
task payment:stats       # View payment statistics
task payment:test        # Test Solana Pay integration
```

## Architecture

### Tech Stack
- **Next.js 15** with App Router and Server Actions
- **Bun** as package manager and runtime
- **TypeScript** with strict checking
- **Tailwind CSS** + shadcn/ui components
- **Ollama** for AI chat (local LLM)
- **Solana Pay** for payments
- **SQLite** (better-sqlite3) for data persistence
- **RAG** (optional: ChromaDB for knowledge base)
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
│   ├── api/chat/          # Chat API route handler
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   └── page.tsx           # Home page
├── actions/               # Server Actions (Next.js)
│   ├── chat-action.ts     # Chat operations
│   ├── meeting-action.ts  # Meeting scheduling
│   └── payment-action.ts  # Payment processing
├── lib/                   # Core business logic
│   ├── ollamaChat.ts      # AI chat with RAG integration
│   ├── chatHistory.ts     # SQLite database layer
│   ├── meetingPayments.ts # Payment configuration
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
│   └── icons/            # Icon components
├── utils/                # Utility functions
└── hooks/                # React hooks

content/
└── blog/                 # Blog posts (MDX files)
    └── *.mdx             # 39 posts imported from decebalonprogramming.net

data/
└── chat-history.db       # SQLite database (created on init)

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
- Uses Ollama (llama3.2:3b) for chat responses
- Optional RAG system (ChromaDB) for portfolio context
- Gracefully falls back to stub if RAG unavailable
- Detects meeting/availability intents from user messages
- Streams responses for better UX

**Database Layer:**
- Single SQLite database with 4 tables: `conversations`, `messages`, `analytics_events`, `payments`
- All DB operations in `chatHistory.ts` using better-sqlite3
- WAL mode enabled for better concurrency

**Meeting System:**
- Integrates with Google Calendar API for availability checks
- Sends confirmation emails via Resend
- Supports paid meetings via Solana Pay
- Local meeting storage in SQLite + JSON backup

**Payment Integration:**
- Solana Pay for crypto payments
- Meeting types have different pricing (free, 0.05 SOL, 0.1 SOL, 0.15 SOL)
- Payment status tracked in database

### Important Configuration

**next.config.ts:**
- TypeScript and ESLint errors ignored during builds (use `task lint` and `task type-check` instead)
- Uses Turbopack for fast dev mode (not webpack)
- Native packages (better-sqlite3, chromadb) externalized via `serverExternalPackages`
- Server Actions body size limit: 2MB

**Environment Variables:**
See `.env.example` for all required variables. Key ones:
- `OLLAMA_BASE_URL` - Must be set for AI chat
- `NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS` - Required for payments
- `RESEND_API_KEY` - Required for emails
- `GOOGLE_REFRESH_TOKEN` - Required for calendar integration

### Development Notes

1. **Before starting development:**
   ```bash
   task ai:status    # Ensure Ollama is running
   task db:init      # Initialize database
   task test:install # Install Playwright browsers (first time only)
   ```

2. **Client vs Server Components:**
   - Any component using React hooks (`useState`, `useEffect`, `useContext`, etc.) MUST have `'use client'` at the top
   - E2E tests will catch missing directives early
   - Server components are the default in Next.js 15 App Router

3. **RAG system** is optional and may fail to load (chromadb issues). The app gracefully falls back to a stub implementation.

4. **Payment testing:** Use Solana devnet for testing. Set `NEXT_PUBLIC_SOLANA_NETWORK=devnet`.

5. **Database changes:** The schema auto-initializes on first import of `chatHistory.ts`. For manual changes, use SQLite CLI or update the schema in that file.

6. **Adding new meeting types:** Edit `MEETING_TYPES_WITH_PRICING` in `src/lib/meetingPayments.ts` and `MEETING_TYPES` in `src/lib/portfolioContext.ts`.

7. **Styling:** Uses Tailwind + shadcn/ui. Components are in `src/components/ui/`. Use `cn()` utility from `src/lib/utils.ts` for conditional classes.

8. **Testing before deployment:**
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
Edit system prompt in `src/lib/ollamaChat.ts:294-316`

### Add new analytics events
Use `trackEvent()` from `src/lib/chatHistory.ts` with custom event types

### Update database schema
Modify SQL in `src/lib/chatHistory.ts:25-72` (runs on initialization)
