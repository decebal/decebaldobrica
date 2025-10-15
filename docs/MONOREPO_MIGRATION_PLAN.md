# Monorepo Migration Plan

Inspired by [Midday v1](https://github.com/midday-ai/v1)

## 🎯 Goals

Transform the current single Next.js app into a scalable monorepo with:
- **apps/web** - Main portfolio website (current project)
- **apps/api** - Supabase Edge Functions / API routes
- **apps/newsletter** - Newsletter admin dashboard
- **packages/*** - Shared libraries

## 📦 Proposed Structure

```
portofolio-monorepo/
├── apps/
│   ├── web/                      # Main portfolio website
│   │   ├── src/
│   │   │   ├── app/             # Next.js App Router
│   │   │   ├── components/      # Web-specific components
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   ├── newsletter/               # Newsletter admin & automation
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/  # Admin dashboard
│   │   │   │   ├── compose/    # Newsletter composer
│   │   │   │   └── analytics/  # Analytics dashboard
│   │   │   └── components/
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── api/                      # Supabase Edge Functions
│       ├── newsletter-send/
│       ├── social-publish/
│       ├── payment-webhook/
│       └── ai-media-generate/
│
├── packages/
│   ├── ui/                       # Shared UI components (shadcn/ui)
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── newsletter-signup.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── database/                 # Supabase client & types
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── types.ts
│   │   │   └── migrations/
│   │   └── package.json
│   │
│   ├── newsletter/               # Newsletter business logic
│   │   ├── src/
│   │   │   ├── subscriber.ts
│   │   │   ├── issue.ts
│   │   │   ├── events.ts
│   │   │   └── analytics.ts
│   │   └── package.json
│   │
│   ├── email/                    # Email templates & sending
│   │   ├── src/
│   │   │   ├── templates/
│   │   │   │   ├── welcome.tsx
│   │   │   │   ├── confirmation.tsx
│   │   │   │   └── newsletter.tsx
│   │   │   └── send.ts
│   │   └── package.json
│   │
│   ├── social/                   # Social media automation
│   │   ├── src/
│   │   │   ├── linkedin.ts
│   │   │   ├── twitter.ts
│   │   │   └── media-gen.ts
│   │   └── package.json
│   │
│   ├── analytics/                # PostHog & tracking
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── events.ts
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   ├── payments/                 # Stripe & Solana Pay
│   │   ├── src/
│   │   │   ├── stripe.ts
│   │   │   ├── solana.ts
│   │   │   └── webhooks.ts
│   │   └── package.json
│   │
│   └── config/                   # Shared configuration
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── tooling/
│   ├── typescript/
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── react.json
│   └── biome/
│       └── biome.json
│
├── docs/                         # Documentation
│   ├── newsletter/
│   ├── deployment/
│   └── development/
│
├── scripts/                      # Shared scripts
│   ├── publish-blog-post.ts
│   └── migrate-database.ts
│
├── package.json                  # Root package.json
├── turbo.json                    # Turborepo config
├── bun.lockb                     # Bun lockfile
└── README.md
```

## 🛠️ Technology Stack

**Build System:**
- ✅ Turborepo - Monorepo orchestration
- ✅ Bun - Package manager & runtime
- ✅ Biome - Linting & formatting

**Frameworks:**
- ✅ Next.js 15 - Web & newsletter apps
- ✅ React 19 - UI framework
- ✅ TypeScript - Type safety

**Backend:**
- ✅ Supabase - Database & auth
- ✅ Supabase Edge Functions - Serverless API
- ✅ Resend - Email delivery

**Infrastructure:**
- ✅ Vercel - Web hosting
- ✅ Supabase Cloud - Database
- ✅ Cloudflare R2/Supabase Storage - Media

## 📋 Migration Steps

### Phase 1: Setup Monorepo Infrastructure (Day 1)

**1. Create New Monorepo Directory**
```bash
cd ~/Projects/personal
mkdir portofolio-monorepo
cd portofolio-monorepo
```

**2. Initialize Root Package**
```bash
bun init -y
```

**3. Install Turborepo**
```bash
bun add -D turbo
```

**4. Create Directory Structure**
```bash
mkdir -p apps/web apps/newsletter apps/api
mkdir -p packages/ui packages/database packages/newsletter packages/email packages/social packages/analytics packages/payments packages/config
mkdir -p tooling/typescript tooling/biome
mkdir -p docs scripts
```

**5. Create Root `package.json`**
```json
{
  "name": "decebal-portfolio",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules",
    "format": "biome format --write .",
    "db:push": "bun run --cwd packages/database push",
    "db:migrate": "bun run --cwd packages/database migrate"
  },
  "devDependencies": {
    "@biomejs/biome": "latest",
    "turbo": "latest",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18",
    "bun": ">=1.0"
  }
}
```

**6. Create `turbo.json`**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### Phase 2: Migrate Current App to `apps/web` (Day 2)

**1. Copy Current Project**
```bash
# From portofolio-nextjs
cp -r src apps/web/
cp -r public apps/web/
cp -r content apps/web/
cp package.json apps/web/
cp next.config.ts apps/web/
cp tsconfig.json apps/web/
cp tailwind.config.ts apps/web/
cp postcss.config.mjs apps/web/
cp .env.example apps/web/
```

**2. Update `apps/web/package.json`**
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
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.5.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@decebal/ui": "workspace:*",
    "@decebal/database": "workspace:*",
    "@decebal/newsletter": "workspace:*",
    "@decebal/analytics": "workspace:*"
  }
}
```

### Phase 3: Extract Shared Packages (Day 3-4)

**1. Create `packages/ui`**

Move all shadcn/ui components:
```bash
mkdir -p packages/ui/src
mv apps/web/src/components/ui/* packages/ui/src/
```

`packages/ui/package.json`:
```json
{
  "name": "@decebal/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/button.tsx",
    "./input": "./src/input.tsx",
    "./card": "./src/card.tsx"
  },
  "dependencies": {
    "react": "^19.0.0",
    "@radix-ui/react-*": "*",
    "class-variance-authority": "*",
    "clsx": "*",
    "tailwind-merge": "*"
  }
}
```

`packages/ui/src/index.ts`:
```typescript
export { Button } from './button'
export { Input } from './input'
export { Card, CardContent, CardHeader } from './card'
// ... all components
```

**2. Create `packages/database`**

`packages/database/src/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function getSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

**3. Create `packages/newsletter`**

Move `src/lib/newsletter.ts`:
```bash
mv apps/web/src/lib/newsletter.ts packages/newsletter/src/index.ts
```

**4. Create `packages/email`**

React Email templates:
```bash
mkdir -p packages/email/src/templates
```

`packages/email/src/templates/welcome.tsx`:
```tsx
import { Html, Button, Container, Heading, Text } from '@react-email/components'

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Container>
        <Heading>Welcome to Decebal's Newsletter!</Heading>
        <Text>Hi {name},</Text>
        <Text>Thanks for subscribing...</Text>
        <Button href="https://decebaldobrica.com">Visit Site</Button>
      </Container>
    </Html>
  )
}
```

**5. Create `packages/analytics`**

Move PostHog code:
```bash
mv apps/web/src/lib/analytics.ts packages/analytics/src/index.ts
mv apps/web/src/components/PostHog* packages/analytics/src/components/
```

**6. Create `packages/payments`**

```typescript
// packages/payments/src/stripe.ts
export async function createCheckoutSession(data: CheckoutData) {
  // Stripe logic
}

// packages/payments/src/solana.ts
export async function createSolanaPayment(data: PaymentData) {
  // Solana Pay logic
}
```

### Phase 4: Create Newsletter Admin App (Day 5-6)

**Structure:**
```
apps/newsletter/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard overview
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Subscriber stats
│   │   ├── subscribers/
│   │   │   ├── page.tsx             # List subscribers
│   │   │   └── [id]/page.tsx        # Subscriber detail
│   │   ├── compose/
│   │   │   ├── page.tsx             # Compose newsletter
│   │   │   └── [id]/page.tsx        # Edit draft
│   │   ├── issues/
│   │   │   ├── page.tsx             # Past issues
│   │   │   └── [id]/page.tsx        # Issue analytics
│   │   ├── analytics/
│   │   │   └── page.tsx             # Engagement metrics
│   │   └── settings/
│   │       └── page.tsx             # Newsletter settings
│   └── components/
│       ├── SubscriberTable.tsx
│       ├── NewsletterComposer.tsx
│       ├── AnalyticsCharts.tsx
│       └── EmailPreview.tsx
└── package.json
```

**Features:**
- View all subscribers with filtering
- Compose newsletters with rich editor
- Send test emails
- Schedule newsletters
- View analytics (open rates, clicks)
- Manage segments (free, premium, founding)

### Phase 5: Create Supabase Edge Functions (Day 7)

**apps/api/newsletter-send/index.ts:**
```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { issueId } = await req.json()

  // Get newsletter issue
  // Get active subscribers
  // Send emails via Resend
  // Track events

  return new Response(JSON.stringify({ success: true }))
})
```

**apps/api/social-publish/index.ts:**
```typescript
serve(async (req) => {
  const { blogPostSlug } = await req.json()

  // Generate AI media
  // Post to LinkedIn
  // Post to Twitter
  // Track in database

  return new Response(JSON.stringify({ success: true }))
})
```

### Phase 6: Update Import Paths (Day 8)

**Before:**
```typescript
import { Button } from '@/components/ui/button'
import { subscribeToNewsletter } from '@/lib/newsletter'
```

**After:**
```typescript
import { Button } from '@decebal/ui/button'
import { subscribeToNewsletter } from '@decebal/newsletter'
```

**Update all files:**
```bash
# Use find and replace
# @/components/ui -> @decebal/ui
# @/lib/newsletter -> @decebal/newsletter
# etc.
```

### Phase 7: Configure TypeScript (Day 9)

**tooling/typescript/base.json:**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@decebal/ui": ["./packages/ui/src"],
      "@decebal/database": ["./packages/database/src"],
      "@decebal/newsletter": ["./packages/newsletter/src"]
    }
  }
}
```

**apps/web/tsconfig.json:**
```json
{
  "extends": "../../tooling/typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Phase 8: Test & Deploy (Day 10)

**1. Test Locally**
```bash
# Root
bun install
bun run dev

# Should start:
# - apps/web on port 3000
# - apps/newsletter on port 3001
```

**2. Deploy**

**Vercel (apps/web):**
```bash
# vercel.json
{
  "buildCommand": "cd ../.. && turbo build --filter=@decebal/web",
  "outputDirectory": "apps/web/.next"
}
```

**Vercel (apps/newsletter):**
```bash
# Separate Vercel project
{
  "buildCommand": "cd ../.. && turbo build --filter=@decebal/newsletter",
  "outputDirectory": "apps/newsletter/.next"
}
```

**Supabase Edge Functions:**
```bash
supabase functions deploy newsletter-send
supabase functions deploy social-publish
```

## 📊 Benefits

### 1. Code Reuse
- UI components shared across web & newsletter apps
- Business logic in packages
- No duplication

### 2. Faster Development
- Change button once, updates everywhere
- Turborepo caching
- Parallel builds

### 3. Better Organization
- Clear separation of concerns
- Each package has single responsibility
- Easier to navigate

### 4. Easier Testing
- Test packages independently
- Mock dependencies easily
- Better test coverage

### 5. Team Scalability
- Team members can work on different apps
- No merge conflicts
- Clear ownership

### 6. Deploy Independence
- Deploy web without touching newsletter
- Deploy API functions separately
- Faster deployments

## 🔄 Migration Timeline

**Week 1:**
- Day 1-2: Setup monorepo, migrate web app
- Day 3-4: Extract shared packages
- Day 5-6: Build newsletter admin app
- Day 7: Create Edge Functions

**Week 2:**
- Day 8-9: Update imports, configure TypeScript
- Day 10: Test, deploy, celebrate! 🎉

## 💡 Alternative: Gradual Migration

Don't want to do it all at once? Migrate gradually:

**Phase 1:** Just extract UI components
```
portofolio-nextjs/
├── packages/
│   └── ui/
└── (rest of current structure)
```

**Phase 2:** Add newsletter package

**Phase 3:** Full monorepo

## 🎯 Recommended Approach

**For Your Use Case:**

1. **Now:** Finish newsletter Phase 2-3 in current structure
2. **After Launch:** Migrate to monorepo when you have:
   - Multiple apps (web, newsletter admin)
   - Shared packages being duplicated
   - Need for Edge Functions

**Or Start Now If:**
- You want clean architecture from day 1
- Planning to build admin dashboard soon
- Want to follow Midday's proven structure

## 📝 Next Steps

**Option A: Migrate Now**
1. I create the full monorepo structure
2. Migrate current code
3. Build newsletter admin app
4. Deploy all pieces

**Option B: Finish Newsletter First**
1. Complete Phase 2-3 (emails, payments)
2. Launch newsletter
3. Then migrate to monorepo
4. Build admin dashboard

Which approach would you prefer?
