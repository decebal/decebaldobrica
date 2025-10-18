# Port Migration Summary - All Ports Now 3100+

**Date**: October 18, 2025
**Status**: ✅ Complete

## Port Mapping Changes

| Service | Old Port | New Port | Status |
|---------|----------|----------|--------|
| **Main Web App** | 3000 | 3100 | ✅ Updated |
| **Newsletter Admin** | 3001 | 3101 | ✅ Updated |
| **AnythingLLM** | 3003 | 3102 | ✅ Updated |

## Files Modified

### Configuration Files (6 files)
- ✅ `apps/web/package.json` - dev and start scripts
- ✅ `apps/newsletter-admin/package.json` - dev and start scripts
- ✅ `apps/newsletter-admin/.env.example` - API URLs
- ✅ `docker-compose.anythingllm.yml` - port mapping
- ✅ `Taskfile.yml` - task descriptions
- ✅ `apps/newsletter-admin/src/lib/anythingllm.ts` - default URL

### Scripts (1 file)
- ✅ `scripts/export-blog-to-kb.js` - AnythingLLM URL

### Documentation (10+ files)
- ✅ All `docs/*.md` files updated via sed
- ✅ Created `docs/PORT_CONFIGURATION.md` - central port reference

## Testing Commands

### 1. Test Main Web App (Port 3100)
```bash
# Start server
task dev

# Should output:
# - Local: http://localhost:3100

# Test in browser
open http://localhost:3100
```

### 2. Test Newsletter Admin (Port 3101)
```bash
# Start server
task dev:admin

# Should output:
# - Local: http://localhost:3101

# Test in browser
open http://localhost:3101
```

### 3. Test AnythingLLM (Port 3102)
```bash
# Start Docker container
docker compose -f docker-compose.anythingllm.yml up -d

# Check status
docker ps | grep anythingllm

# Test in browser
open http://localhost:3102
```

### 4. Test All Together
```bash
# Terminal 1: Web app
task dev

# Terminal 2: Admin
task dev:admin

# Terminal 3: AnythingLLM
docker compose -f docker-compose.anythingllm.yml up -d

# Verify all ports
lsof -i :3100  # Should show Next.js
lsof -i :3101  # Should show Next.js
lsof -i :3102  # Should show Docker
```

## Environment Variables to Update

If you have existing `.env` or `.env.local` files, update them:

### apps/web/.env
```bash
# No changes needed (Next.js uses package.json port)
```

### apps/newsletter-admin/.env
```bash
# Update these values:
NEXT_PUBLIC_API_URL=http://localhost:3100  # Was 3000
ANYTHINGLLM_API_URL=http://localhost:3102  # Was 3003
# NEXTAUTH_URL=http://localhost:3101  # Was 3001 (if using auth)
```

## Verification Checklist

- [ ] Main web app starts on port 3100
- [ ] Newsletter admin starts on port 3101
- [ ] AnythingLLM accessible on port 3102
- [ ] All documentation references updated
- [ ] Environment variables updated
- [ ] No port conflicts

## Rollback (If Needed)

To rollback to old ports:

```bash
# Revert changes in package.json files
git checkout HEAD -- apps/web/package.json apps/newsletter-admin/package.json

# Revert docker compose
git checkout HEAD -- docker-compose.anythingllm.yml

# Revert .env.example
git checkout HEAD -- apps/newsletter-admin/.env.example

# Restart services
task dev
task dev:admin
docker compose -f docker-compose.anythingllm.yml restart
```

## Benefits of 3100+ Range

1. **No Conflicts**: Avoids commonly used ports (3000-3099)
2. **Easy to Remember**: All start with 31
3. **Sequential**: Clear pattern (3100, 3101, 3102)
4. **Room for Growth**: Can use 3103-3199 for future services

## Next Steps

1. ✅ All configuration files updated
2. ✅ All documentation updated
3. ✅ AnythingLLM restarted on new port
4. ⏭️ Update any local `.env` files
5. ⏭️ Restart all services to verify
6. ⏭️ Test end-to-end workflows

## Common Issues

### Port Already in Use

**Problem**: `Error: Port 3100 is already in use`

**Solution**:
```bash
# Find what's using the port
lsof -ti:3100

# Kill the process
kill $(lsof -ti:3100)

# Or use a different port
PORT=3200 bun run dev
```

### CORS Errors

**Problem**: Newsletter admin can't connect to main app

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL=http://localhost:3100` in admin `.env`
2. Ensure main web app is running on 3100
3. Check browser console for actual error

### Docker Container Won't Start

**Problem**: AnythingLLM container fails to start

**Solution**:
```bash
# Check logs
docker logs anythingllm-local

# Remove and recreate
docker compose -f docker-compose.anythingllm.yml down -v
docker compose -f docker-compose.anythingllm.yml up -d
```

## Reference Links

- **Main App**: http://localhost:3100
- **Newsletter Admin**: http://localhost:3101
- **AnythingLLM**: http://localhost:3102
- **Port Configuration Docs**: `docs/PORT_CONFIGURATION.md`

---

**Migration completed successfully!** All services now use the 3100+ port range.

For questions or issues, check `docs/PORT_CONFIGURATION.md` or the relevant service documentation.
