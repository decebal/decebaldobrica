# Monorepo Migration Guide

Step-by-step guide to complete the migration.

## ✅ Phase 1: Foundation (DONE)

- ✅ Created monorepo structure
- ✅ Root package.json with Turborepo
- ✅ Turbo.json configuration
- ✅ Biome configuration
- ✅ TypeScript tooling configs
- ✅ README

## 🚀 Phase 2: Migrate Web App (NEXT)

### Step 1: Copy Current App to apps/web

```bash
# From the portofolio-nextjs directory
cd /Users/decebaldobrica/Projects/personal/portofolio-nextjs

# Copy essential files and directories
cp -r src ../portofolio-monorepo/apps/web/
cp -r public ../portofolio-monorepo/apps/web/
cp -r content ../portofolio-monorepo/apps/web/
cp -r data ../portofolio-monorepo/apps/web/
cp -r tests ../portofolio-monorepo/apps/web/

# Copy config files
cp package.json ../portofolio-monorepo/apps/web/
cp next.config.ts ../portofolio-monorepo/apps/web/
cp tailwind.config.ts ../portofolio-monorepo/apps/web/
cp postcss.config.mjs ../portofolio-monorepo/apps/web/
cp .env.example ../portofolio-monorepo/apps/web/
cp Taskfile.yml ../portofolio-monorepo/apps/web/
cp playwright.config.ts ../portofolio-monorepo/apps/web/

# Copy documentation
cp -r docs ../portofolio-monorepo/
```

### Step 2: Update apps/web/package.json

Replace the `name` and add workspace dependencies:

```json
{
  "name": "@decebal/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "type-check": "tsc --noEmit",
    "test": "bun test",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:install": "playwright install"
  },
  "dependencies": {
    "@decebal/ui": "workspace:*",
    "@decebal/database": "workspace:*",
    "@decebal/newsletter": "workspace:*",
    "@decebal/analytics": "workspace:*",
    "@decebal/payments": "workspace:*",
    // ... rest of existing dependencies
  }
}
```

### Step 3: Create apps/web/tsconfig.json

```json
{
  "extends": "../../tooling/typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@decebal/ui": ["../../packages/ui/src"],
      "@decebal/database": ["../../packages/database/src"],
      "@decebal/newsletter": ["../../packages/newsletter/src"],
      "@decebal/analytics": ["../../packages/analytics/src"],
      "@decebal/payments": ["../../packages/payments/src"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📦 Phase 3: Extract Packages

### packages/ui

**Create package.json:**
```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo/packages/ui
```

```json
{
  "name": "@decebal/ui",
  "version": "1.0.0",
  "private": true,
  "exports": {
    "./*": "./src/*.tsx"
  },
  "scripts": {
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "*",
    "@radix-ui/react-alert-dialog": "*",
    "@radix-ui/react-avatar": "*",
    "@radix-ui/react-checkbox": "*",
    "@radix-ui/react-dialog": "*",
    "@radix-ui/react-dropdown-menu": "*",
    "@radix-ui/react-label": "*",
    "@radix-ui/react-popover": "*",
    "@radix-ui/react-progress": "*",
    "@radix-ui/react-radio-group": "*",
    "@radix-ui/react-scroll-area": "*",
    "@radix-ui/react-select": "*",
    "@radix-ui/react-separator": "*",
    "@radix-ui/react-slider": "*",
    "@radix-ui/react-slot": "*",
    "@radix-ui/react-switch": "*",
    "@radix-ui/react-tabs": "*",
    "@radix-ui/react-toast": "*",
    "@radix-ui/react-tooltip": "*",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.3"
  }
}
```

**Move UI components:**
```bash
# Copy shadcn/ui components
cp -r ../portofolio-nextjs/src/components/ui/* ./src/

# Copy lib/utils.ts
mkdir -p ./src/lib
cp ../portofolio-nextjs/src/lib/utils.ts ./src/lib/
```

**Create tsconfig.json:**
```json
{
  "extends": "../../tooling/typescript/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### packages/database

```json
{
  "name": "@decebal/database",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.49.2"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  }
}
```

**Create src/index.ts:**
```typescript
export { getSupabaseClient, getSupabaseAdmin } from './client'
export type * from './types'
```

**Create src/client.ts:**
```typescript
import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
```

### packages/newsletter

```json
{
  "name": "@decebal/newsletter",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@decebal/database": "workspace:*",
    "@supabase/supabase-js": "^2.49.2",
    "zod": "^3.24.1"
  }
}
```

**Move newsletter logic:**
```bash
cp ../portofolio-nextjs/src/lib/newsletter.ts ./src/index.ts
```

### packages/analytics

```json
{
  "name": "@decebal/analytics",
  "version": "1.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx"
  },
  "scripts": {
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "posthog-js": "^1.200.0",
    "posthog-node": "^4.3.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0"
  }
}
```

**Move PostHog components:**
```bash
mkdir -p ./src/components
cp ../portofolio-nextjs/src/components/PostHog*.tsx ./src/components/
cp ../portofolio-nextjs/src/lib/analytics.ts ./src/index.ts
```

## 🔧 Phase 4: Update Imports

After extracting packages, update imports in `apps/web`:

### Find and Replace

**UI Components:**
```
From: @/components/ui/
To: @decebal/ui/
```

**Newsletter:**
```
From: @/lib/newsletter
To: @decebal/newsletter
```

**Database:**
```
From: @/lib/chatHistory (Supabase parts)
To: @decebal/database
```

**Analytics:**
```
From: @/lib/analytics
To: @decebal/analytics
```

**From: @/components/PostHog**
```
To: @decebal/analytics/components/PostHog
```

## 🧪 Phase 5: Test

```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo

# Install dependencies
bun install

# Try to build
bun run build:web

# If successful, start dev
bun run dev:web
```

## 📝 Phase 6: Create Newsletter Admin App

This will be done after the main app is working in the monorepo.

## 🚀 Phase 7: Deploy

Update Vercel settings to point to the monorepo and build from `apps/web`.

---

## ⚠️ Important Notes

1. **Don't delete old repo yet** - Keep `portofolio-nextjs` until everything works
2. **Git** - Initialize git in monorepo root, not in apps
3. **Environment variables** - Copy `.env.local` to each app
4. **Node modules** - Will be hoisted to root by Bun workspaces

## 🆘 Troubleshooting

### "Cannot find module @decebal/ui"

Install dependencies from root:
```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo
bun install
```

### Build fails with import errors

Check tsconfig.json paths are correct in each app.

### Turborepo cache issues

```bash
bun run clean
bun install
```

---

## Next Step

Run the commands in **Phase 2: Step 1** to copy the current app to `apps/web`.

Once that's done, I'll help you:
1. Extract the packages
2. Update all imports
3. Get everything building
4. Create the newsletter admin app

Ready to proceed? Let me know and I'll guide you through each step!
