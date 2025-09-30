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

See parent directory for full documentation and migration guides.
