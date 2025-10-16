# Newsletter Admin Dashboard

Admin dashboard for managing newsletter subscribers, composing newsletters, and viewing analytics.

## Features

- **Dashboard**: Overview with stats, quick actions, and recent activity
- **Subscribers**: View, filter, search, and export subscribers
- **Compose**: Write and send newsletters to any tier
- **Analytics**: Growth metrics, revenue tracking (MRR/ARR), engagement rates

## Getting Started

### 1. Install Dependencies

```bash
# From monorepo root
bun install

# Or from this directory
cd apps/newsletter-admin
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env.local

# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3000  # Points to main web app
```

### 3. Start Development Server

```bash
# From monorepo root
task dev:admin:dev

# Or from this directory
bun run dev
```

The admin dashboard will be available at **http://localhost:3001**

## Usage

### Development

```bash
task dev:admin:dev          # Start dev server (port 3001)
task dev:admin:build        # Build for production
task dev:admin:start        # Start production server
```

### Access

- **Dashboard**: http://localhost:3001
- **Subscribers**: http://localhost:3001/subscribers
- **Compose**: http://localhost:3001/compose
- **Analytics**: http://localhost:3001/analytics

## Architecture

### Separate App Benefits

1. **Security Isolation**: Admin routes are separate from public site
2. **Independent Deployment**: Can deploy admin separately
3. **Performance**: Won't affect public site performance
4. **Development**: Iterate without affecting public site

### API Communication

The admin app makes API calls to the main web app (`apps/web`):

```typescript
// apps/newsletter-admin/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export const newsletterApi = {
  getStats: () => apiClient("/api/newsletter/stats"),
  getSubscribers: (params) => apiClient("/api/newsletter/subscribers", params),
  // ...
}
```

### Pages

- `/` - Dashboard overview
- `/subscribers` - Manage subscribers
- `/compose` - Compose newsletters
- `/analytics` - View analytics

## Authentication (TODO)

Currently, the admin app has no authentication. To add:

1. Install NextAuth:
   ```bash
   bun add next-auth
   ```

2. Create auth config:
   ```typescript
   // src/lib/auth.ts
   export const authOptions = {
     providers: [
       // Add your providers
     ],
   }
   ```

3. Protect routes with middleware

4. Add `ADMIN_EMAIL` env var to restrict access

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Deploy admin dashboard
vercel --prod apps/newsletter-admin

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://decebaldobrica.com
```

Access at: `https://newsletter-admin.vercel.app` or custom domain

### Option 2: Self-Hosted

```bash
# Build
cd apps/newsletter-admin
bun run build

# Start
bun run start
```

## Tech Stack

- **Next.js 15** - App Router
- **Tailwind CSS** - Styling
- **Bun** - Package manager & runtime
- **TypeScript** - Type safety
- **next-themes** - Dark mode

## Package Dependencies

- `@decebal/database` - Supabase client
- `@decebal/email` - Email sending
- `@decebal/newsletter` - Newsletter operations
- `@decebal/social` - Social media automation

## Troubleshooting

### API Connection Errors

If you see API errors, make sure:

1. The main web app is running on port 3000:
   ```bash
   task dev:dev  # or: cd apps/web && bun run dev
   ```

2. `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`

3. CORS is configured if deploying separately

### Port Already in Use

If port 3001 is in use:

```bash
# Change port in package.json:
"dev": "next dev --port 3002"
```

## Contributing

This admin dashboard is part of the Portfolio Monorepo. See main README for contribution guidelines.

## License

Private - Not for public distribution
