# Deployment Guide: Vercel + Railway

This guide covers deploying your portfolio to **Vercel** (Next.js app) and **Railway** (Ollama AI service).

## Architecture

```
┌─────────────────┐
│     Vercel      │  ← Next.js App (Frontend + API Routes)
│  (Next.js App)  │
└────────┬────────┘
         │
         │ HTTPS Requests
         │
         ▼
┌─────────────────┐
│    Railway      │  ← Ollama AI Service
│  (Ollama LLM)   │
└─────────────────┘
```

## Step 1: Deploy Ollama to Railway

### 1.1 Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 1.2 Deploy Ollama Service

**Option A: Using Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy Ollama service
railway up
```

**Option B: Using Railway Dashboard**

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Connect your GitHub repository
3. Railway will detect `Dockerfile.ollama` and `railway.json`
4. Click **"Deploy"**

### 1.3 Pull Ollama Models

After deployment, you need to pull the required models:

```bash
# Connect to Railway shell
railway shell

# Pull models (this may take 10-15 minutes)
ollama pull llama3.2:3b
ollama pull nomic-embed-text

# Verify models are installed
ollama list
```

### 1.4 Get Railway Service URL

1. Go to your Railway project dashboard
2. Click on the Ollama service
3. Go to **Settings** → **Networking** → **Generate Domain**
4. Copy the public URL (e.g., `https://your-ollama.railway.app`)

### 1.5 Enable Persistent Storage (Important!)

1. In Railway dashboard, click your Ollama service
2. Go to **Variables** tab
3. Add volume mount for model persistence:
   - Click **"New Variable"**
   - Add: `RAILWAY_VOLUME_MOUNT_PATH=/root/.ollama`

This ensures your pulled models persist across deployments.

## Step 2: Deploy Next.js App to Vercel

### 2.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2.2 Configure Environment Variables

Before deploying, set these environment variables in Vercel:

**Required Variables:**

```bash
# Ollama Service (use your Railway URL)
OLLAMA_BASE_URL=https://your-ollama.railway.app

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# Database (Vercel uses /tmp for ephemeral storage)
DATABASE_PATH=/tmp/chat-history.db

# RAG System
NEXT_PUBLIC_ENABLE_RAG=true
CHROMADB_PATH=/tmp/chroma_data

# Feature Flags
NEXT_PUBLIC_ENABLE_PAID_MEETINGS=false
NEXT_PUBLIC_ENABLE_HOMEPAGE_VIDEO=false
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

**Optional Services:**

```bash
# Google Calendar (if using meeting scheduling)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token
CALENDAR_OWNER_EMAIL=your-email@example.com

# Email - Resend (for meeting confirmations)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com

# Solana Pay (for paid meetings)
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=your_wallet_address
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# PostHog Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2.3 Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js configuration
4. Add environment variables in **Settings** → **Environment Variables**
5. Click **"Deploy"**

### 2.4 Custom Domain (Optional)

1. Go to your Vercel project
2. **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_APP_URL` environment variable

## Step 3: Verify Deployment

### 3.1 Test Ollama Service

```bash
# Test Railway Ollama endpoint
curl https://your-ollama.railway.app/api/tags

# Should return list of installed models
```

### 3.2 Test Next.js App

1. Visit your Vercel URL
2. Navigate to the homepage
3. Open the AI chat interface
4. Send a test message
5. Check browser console for any errors

### 3.3 Check Logs

**Vercel Logs:**
- Go to your Vercel project
- Click **"Deployments"** → Select latest deployment → **"Runtime Logs"**
- Look for RAG initialization messages:
  ```
  🔧 Initializing RAG system...
  📚 Loading 5 knowledge base documents...
  ✅ RAG system initialized successfully
  ```

**Railway Logs:**
- Go to Railway dashboard
- Click your Ollama service → **"Deployments"** tab
- Check for successful startup

## Important Notes

### ⚠️ Vercel Limitations

1. **Ephemeral Storage**: Vercel's filesystem is read-only except `/tmp`, which is cleared on each cold start
   - ChromaDB will re-index knowledge base on cold starts (~30 seconds)
   - SQLite chat history is lost between deployments
   - Consider using a hosted database for production (PostgreSQL, MongoDB)

2. **Serverless Functions**:
   - Max execution time: 10 seconds (Hobby), 60 seconds (Pro)
   - If RAG initialization takes too long, consider lazy loading

3. **Build Time**:
   - ChromaDB and native dependencies are externalized (`serverExternalPackages`)
   - Build should complete in 2-3 minutes

### 🚀 Optimizations

**For Better Performance:**

1. **Use Railway for Full Stack** (Alternative deployment):
   - Deploy both Next.js + Ollama on Railway
   - Get persistent storage for ChromaDB and SQLite
   - Avoid cold start re-indexing

2. **Upgrade to Vercel Pro**:
   - Longer serverless function timeouts
   - Better performance for RAG queries

3. **Database Migration**:
   - Move from SQLite to PostgreSQL (Vercel Postgres)
   - Or use Supabase for hosted PostgreSQL

## Troubleshooting

### RAG System Not Working

**Error**: `Failed to connect to ChromaDB`

**Solution**:
- Check that ChromaDB path is writable
- On Vercel, ensure `CHROMADB_PATH=/tmp/chroma_data`
- Check logs for initialization errors

### Ollama Connection Errors

**Error**: `Error connecting to Ollama service`

**Solution**:
- Verify `OLLAMA_BASE_URL` is set correctly in Vercel
- Check Railway Ollama service is running
- Test Railway URL: `curl https://your-ollama.railway.app/api/tags`
- Ensure Railway has public networking enabled

### Chat Not Responding

**Possible Causes**:
1. Ollama models not pulled on Railway
2. Ollama service sleeping (Railway free tier)
3. CORS issues (if using different domains)

**Solutions**:
- Pull models: `railway run ollama pull llama3.2:3b`
- Upgrade Railway plan to prevent sleeping
- Check Railway logs for errors

### Knowledge Base Not Loading

**Error**: No RAG context in responses

**Solution**:
- Verify knowledge base files exist in `src/knowledge-base/`
- Check that `NEXT_PUBLIC_ENABLE_RAG=true`
- Review Vercel function logs for initialization errors
- Cold starts will re-index (expected behavior)

## Cost Estimates

### Railway
- **Hobby Plan**: $5/month
  - Services may sleep after inactivity
  - 512MB RAM, shared CPU
  - Good for development/testing

- **Starter Plan**: $20/month
  - No sleeping
  - 8GB RAM (enough for llama3.2:3b)
  - Recommended for production

### Vercel
- **Hobby Plan**: Free
  - 100GB bandwidth
  - Serverless functions included
  - Great for personal projects

- **Pro Plan**: $20/month
  - Longer function timeouts (60s)
  - Better for production RAG workloads

**Total**: $5-40/month depending on your plan choices

## Next Steps

1. ✅ Deploy Ollama to Railway
2. ✅ Pull required models
3. ✅ Deploy Next.js to Vercel
4. ✅ Configure environment variables
5. ✅ Test chat functionality
6. 🔄 Monitor logs and performance
7. 🔄 Consider database migration for production
8. 🔄 Set up custom domain

## Support

For issues:
- Railway: [Railway Docs](https://docs.railway.app)
- Vercel: [Vercel Docs](https://vercel.com/docs)
- Ollama: [Ollama GitHub](https://github.com/ollama/ollama)
