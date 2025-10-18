# AnythingLLM Service App

Monorepo-integrated service manager for AnythingLLM RAG platform.

## Overview

This app provides a managed interface to the AnythingLLM Docker container, integrated with the monorepo's tooling and workflow.

## Quick Start

```bash
# From project root
task llm:start     # Start AnythingLLM
task llm:status    # Check status
task llm:logs      # View logs
task llm:stop      # Stop service

# Or from this directory
cd apps/anything-llm
bun start          # Start service
bun run status     # Check status
bun run logs       # View logs (Ctrl+C to exit)
bun run stop       # Stop service
bun run restart    # Restart service
bun run shell      # Access container shell
bun run clean      # Stop and remove all data
```

## Features

- **Automatic Health Checks**: Verifies service is healthy before reporting ready
- **Startup Management**: Handles container lifecycle automatically
- **Status Monitoring**: Real-time status checks with detailed info
- **Log Streaming**: Easy access to container logs
- **Error Handling**: Clear error messages and troubleshooting hints
- **Monorepo Integration**: Works seamlessly with task commands

## Service Details

- **Port**: 3102 (external) → 3001 (internal)
- **Container**: `anythingllm-local`
- **Data**: Persisted in `../../anythingllm-storage/`
- **Knowledge Base**: `../../knowledge-base/` (mounted read-only)

## First-Time Setup

After starting the service for the first time:

1. **Open UI**: http://localhost:3102
2. **Create admin password**
3. **Configure Groq**:
   - LLM Provider: "Groq"
   - API Key: Your key from https://console.groq.com
   - Model: `llama-3.1-70b-versatile`
4. **Create workspace**: "leadership-blog-content"
5. **Upload documents**:
   - Go to Documents → Upload
   - Select files from `../../knowledge-base/`
6. **Get API key**:
   - Settings → API Keys
   - Generate new key
   - Add to `../newsletter-admin/.env`:
     ```bash
     ANYTHINGLLM_API_URL=http://localhost:3102
     ANYTHINGLLM_API_KEY=your_key_here
     ANYTHINGLLM_WORKSPACE_SLUG=leadership-blog-content
     ```

## Commands

### Start Service

```bash
bun start
```

**What it does**:
- Checks if Docker is available
- Checks container status
- Starts container if not running
- Waits for health check to pass
- Shows access URL and next steps

**Output**:
```
╔═══════════════════════════════════════╗
║   AnythingLLM Service Manager      ║
╚═══════════════════════════════════════╝

✓ Docker is available
ℹ Creating and starting container...
⏳ Waiting... 5s
✓ AnythingLLM is ready at http://localhost:3102

✓ Service started successfully!
ℹ Access UI: http://localhost:3102
ℹ View logs: bun run logs
ℹ Stop service: bun run stop
```

### Check Status

```bash
bun run status
```

**Shows**:
- Docker availability
- Container status (running/stopped/not found)
- Container uptime
- Health check results
- Access URL
- Useful commands

### View Logs

```bash
bun run logs
```

**Shows**:
- Real-time streaming logs
- All container output
- Press Ctrl+C to exit

### Stop Service

```bash
bun run stop
```

**What it does**:
- Gracefully stops the container
- Preserves all data in `anythingllm-storage/`
- Can be restarted with `bun start`

### Restart Service

```bash
bun run restart
```

**What it does**:
- Stops the service
- Starts it again
- Useful for applying configuration changes

### Access Shell

```bash
bun run shell
```

**What it does**:
- Opens interactive bash shell in container
- Useful for debugging
- Type `exit` to close

### Clean All Data

```bash
bun run clean
```

**⚠️ WARNING**: This removes all data!

**What it does**:
- Stops container
- Removes container
- Removes all volumes (documents, settings, etc.)
- Fresh start on next `bun start`

## Integration with Newsletter Admin

The newsletter admin app uses AnythingLLM for RAG-based content generation:

1. **Ensure AnythingLLM is running**:
   ```bash
   task llm:start
   ```

2. **Configure admin app** (`apps/newsletter-admin/.env`):
   ```bash
   ANYTHINGLLM_API_URL=http://localhost:3102
   ANYTHINGLLM_API_KEY=your_key_from_anythingllm
   ANYTHINGLLM_WORKSPACE_SLUG=leadership-blog-content
   ```

3. **Start admin**:
   ```bash
   task dev:admin
   ```

4. **Generate content**:
   - Open http://localhost:3101/compose/blog
   - Select "AnythingLLM (RAG)" mode
   - Generate personalized content

## Troubleshooting

### Docker not available

**Error**: "Docker is not available"

**Solution**:
- Install Docker Desktop
- Ensure Docker is running
- Check: `docker --version`

### Port already in use

**Error**: "Bind for 0.0.0.0:3102 failed: port is already allocated"

**Solution**:
```bash
# Find what's using port 3102
lsof -ti:3102

# Kill the process
kill $(lsof -ti:3102)

# Or stop the container
bun run stop
```

### Container fails to start

**Error**: Container starts but health check fails

**Solution**:
```bash
# View logs
bun run logs

# Common issues:
# - Insufficient memory (increase Docker memory limit)
# - Corrupted data (run bun run clean)
# - Missing API key (check docker-compose.anythingllm.yml)
```

### Service not responding

**Symptoms**: Container running but UI not accessible

**Solution**:
```bash
# Check status
bun run status

# If unhealthy, restart
bun run restart

# If still fails, clean and restart
bun run clean
bun start
```

## Development

### File Structure

```
apps/anything-llm/
├── package.json       # Scripts and dependencies
├── README.md          # This file
└── src/
    ├── server.js      # Main service manager
    ├── stop.js        # Stop script
    └── status.js      # Status checker
```

### Health Check

The service manager uses AnythingLLM's `/api/ping` endpoint for health checks:
- **Endpoint**: `http://localhost:3102/api/ping`
- **Expected response**: `{"online":true}`
- **Purpose**: Verify service is ready before reporting success

### Dependencies

- **chalk**: Terminal colors (optional)
- **dotenv**: Environment variables
- **Docker**: Required for running the service

### Environment Variables

Can be set in `../../docker-compose.anythingllm.yml`:

```yaml
environment:
  GROQ_API_KEY: ${GROQ_API_KEY}
  AUTH_TOKEN: ${ANYTHINGLLM_AUTH_TOKEN}
  JWT_SECRET: ${ANYTHINGLLM_JWT_SECRET}
  DISABLE_TELEMETRY: true
```

## Production Deployment

For production, deploy to Railway instead:

1. Follow `../../docs/ANYTHINGLLM_SETUP.md`
2. Update admin app to use production URL
3. This local service is for development only

## Support

- **Documentation**: `../../docs/ANYTHINGLLM_SETUP.md`
- **Content Guide**: `../../docs/RAG_CONTENT_GENERATION_GUIDE.md`
- **AnythingLLM Docs**: https://docs.useanything.com

---

**Quick Commands Reference**:

```bash
task llm:start    # Start
task llm:status   # Status
task llm:logs     # Logs
task llm:stop     # Stop
```
