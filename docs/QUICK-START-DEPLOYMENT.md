# Quick Start: Deploy to Vercel + Railway

5-minute deployment guide for your portfolio with AI chat.

## Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)

## 🚀 Step 1: Deploy Ollama to Railway (2 minutes)

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repository
4. Railway auto-detects `Dockerfile.ollama`
5. Click **"Deploy"**
6. Wait for deployment to complete
7. Go to **Settings** → **Networking** → Click **"Generate Domain"**
8. Copy your Railway URL (e.g., `https://ollama-production-abc123.up.railway.app`)

### Pull AI Models

In Railway dashboard:
1. Click **"Shell"** (console icon)
2. Run:
   ```bash
   ollama pull llama3.2:3b
   ollama pull nomic-embed-text
   ```
3. Wait ~10 minutes for models to download

## 🌐 Step 2: Deploy to Vercel (3 minutes)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in
2. Click **"Import Project"** → Select this repository
3. Before deploying, add environment variables:

### Required Environment Variables

Click **"Environment Variables"** and add:

```bash
OLLAMA_BASE_URL=https://your-railway-url.railway.app
NEXT_PUBLIC_ENABLE_RAG=true
DATABASE_PATH=/tmp/chat-history.db
CHROMADB_PATH=/tmp/chroma_data
```

### Optional (for full features)

```bash
# Email confirmations
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@yourdomain.com

# Google Calendar
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Solana payments
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=your_wallet
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

4. Click **"Deploy"**
5. Wait 2-3 minutes for build to complete

## ✅ Step 3: Verify

1. Visit your Vercel URL
2. Click chat icon in bottom right
3. Send a message: "What services do you offer?"
4. AI should respond with your services from the knowledge base

## 🎉 You're Live!

Your portfolio is now deployed with:
- ✅ AI chat powered by Ollama
- ✅ RAG knowledge base (your expertise)
- ✅ Meeting scheduling
- ✅ Blog and case studies

## Next Steps

- [ ] Add custom domain in Vercel
- [ ] Configure email service (Resend)
- [ ] Set up Google Calendar integration
- [ ] Enable Solana payments (optional)
- [ ] Monitor usage in Railway/Vercel dashboards

## Troubleshooting

**Chat not responding?**
- Check Railway service is running
- Verify `OLLAMA_BASE_URL` in Vercel settings
- Check Railway logs for errors

**"Loading..." forever?**
- Models may still be downloading in Railway
- Check Railway shell: `ollama list`

**Need help?**
- Read full guide: [docs/DEPLOYMENT.md](./DEPLOYMENT.md)
- Check Railway docs: https://docs.railway.app
- Check Vercel docs: https://vercel.com/docs
