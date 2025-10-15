# Portfolio Next.js

Modern portfolio website built with Next.js 15, powered by AI chat (Ollama), integrated payments (Solana Pay), and meeting scheduling.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development
bun run dev
```

Visit http://localhost:3000

## 📝 Available Commands

Using Taskfile (recommended):
```bash
task dev              # Start development server
task build            # Build for production
task lint:fix         # Fix linting issues
task ai:status        # Check Ollama status
task db:stats         # Database statistics
```

Using Bun directly:
```bash
bun run dev           # Development
bun run build         # Production build
bun run start         # Start production server
```

## 🛠️ Tech Stack

- Next.js 15 + App Router + Server Actions
- Bun (package manager)
- TypeScript + Biome
- Tailwind CSS + shadcn/ui
- Ollama (AI)
- Solana Pay (payments)
- SQLite (database)

## 📚 Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Full deployment guide for Vercel + Railway
- **[Quick Start Deployment](docs/QUICK-START-DEPLOYMENT.md)** - 5-minute deploy guide
- **[CLAUDE.md](CLAUDE.md)** - Development guide for Claude Code

## 🌐 Deployment

**Recommended Setup:**
- **Vercel** - Next.js frontend and API routes (free tier)
- **Railway** - Ollama AI service ($5-20/month)

```bash
# 1. Deploy Ollama to Railway
# 2. Get Railway URL
# 3. Deploy to Vercel with OLLAMA_BASE_URL=https://your-railway-url.railway.app
# 4. Done!
```

See [Quick Start Guide](docs/QUICK-START-DEPLOYMENT.md) for step-by-step instructions.

### Personal Configuration

All personal information is centralized in `src/config/personal.json`. See `docs/PERSONAL_CONFIG.md` for details.

### Blog

Blog posts are in `content/blog/` as MDX files. Current posts were imported from [decebalonprogramming.net](https://decebalonprogramming.net/) using `scripts/import-blog-posts.js`.
