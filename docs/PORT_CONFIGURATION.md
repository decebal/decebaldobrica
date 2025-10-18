# Port Configuration

All application ports in this project use the 3100+ range to avoid conflicts.

## Port Assignments

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Web App** | 3100 | http://localhost:3100 | Main portfolio/blog website |
| **Newsletter Admin** | 3101 | http://localhost:3101 | Admin dashboard for newsletter |
| **AnythingLLM** | 3102 | http://localhost:3102 | RAG content generation system |
| Reserved | 3103-3109 | - | Future services |

## External Services (Not Changed)

| Service | Port | Notes |
|---------|------|-------|
| Anvil (Ethereum) | 3002 | External blockchain service, left unchanged |

## Configuration Files

### Web App (apps/web)
- Default Next.js dev port: 3100
- Set via: `next dev --port 3100`
- Environment: `NEXT_PUBLIC_API_URL` references this port

### Newsletter Admin (apps/newsletter-admin)
- Dev port: 3101
- Set via: `next dev --port 3101`
- Start script: `next start --port 3101`
- References main app at: http://localhost:3100

### AnythingLLM (Docker)
- Container port: 3001 (internal)
- Host port: 3102 (external)
- Mapped in: `docker-compose.anythingllm.yml`
- API URL: http://localhost:3102

## Development Commands

```bash
# Start web app
cd apps/web
bun run dev  # Runs on port 3100

# Start newsletter admin
cd apps/newsletter-admin
bun run dev  # Runs on port 3101

# Start AnythingLLM
docker compose -f docker-compose.anythingllm.yml up -d  # Port 3102

# Or use task commands
task dev         # Web app on 3100
task dev:admin   # Admin on 3101
```

## Environment Variables

### apps/web/.env
```bash
# No port config needed (Next.js default via package.json)
```

### apps/newsletter-admin/.env
```bash
NEXT_PUBLIC_API_URL=http://localhost:3100
ANYTHINGLLM_API_URL=http://localhost:3102
```

## Vercel Deployment

Production deployment uses standard ports (80/443). These port configurations only apply to local development.

## Updating Ports

If you need to change ports in the future:

1. Update `package.json` dev scripts
2. Update `.env.example` files
3. Update `docker-compose.anythingllm.yml`
4. Update all documentation
5. Update Taskfile.yml
6. Restart all services

## Why 3100+?

Using 3100+ range:
- ✅ Avoids conflicts with common services (3000-3099 often used)
- ✅ Easy to remember (all start with 31)
- ✅ Clear sequential numbering
- ✅ Room for expansion (3100-3199)
