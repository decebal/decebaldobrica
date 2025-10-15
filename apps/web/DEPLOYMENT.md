# Deployment Guide

Comprehensive guide for deploying your portfolio to Vercel with all integrations configured.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [Email Configuration (Resend)](#email-configuration-resend)
4. [Google Calendar Setup](#google-calendar-setup)
5. [Domain Configuration](#domain-configuration)
6. [Database Configuration](#database-configuration)
7. [Groq AI Setup](#groq-ai-setup)
8. [Solana Pay Configuration](#solana-pay-configuration)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository with latest code pushed
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Resend account for emails (https://resend.com)
- [ ] Google Cloud Console project (for Calendar API)
- [ ] Domain name (if using custom domain)
- [ ] Solana wallet address (for payments)

---

## Vercel Deployment

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `bun run build` (or leave default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `bun install`

### Step 2: Configure Build Settings

In Vercel project settings:

1. **General → Node.js Version**: 20.x or later
2. **General → Package Manager**: Bun (if available, otherwise npm)
3. **General → Environment Variables**: See [Environment Variables](#environment-variables) section

### Step 3: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables

```bash
# Next.js
NODE_ENV=production

# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@decebaldobrica.com
EMAIL_REPLY_TO=discovery@decebaldobrica.com
CALENDAR_OWNER_EMAIL=discovery@decebaldobrica.com

# Google Calendar (Optional but recommended)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Groq AI Chat
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Solana Pay (Optional)
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=your_solana_wallet_address_here

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Development-Only Variables
```bash
# These should NOT be set in production
# OLLAMA_BASE_URL=http://localhost:11434  # Only for local dev
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Vercel will provide a URL: `https://your-project.vercel.app`

---

## Email Configuration (Resend)

### Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email

### Step 2: Add and Verify Domain

#### Option A: Use Your Custom Domain (Recommended)

1. In Resend Dashboard → **Domains** → **Add Domain**
2. Enter your domain: `decebaldobrica.com`
3. Add DNS records to your domain registrar:
   - **TXT Record** for domain verification
   - **MX Records** for receiving (optional)
   - **DKIM Records** for authentication
   - **SPF Record** for sender authentication

**Example DNS Records:**
```
Type    Name                    Value
TXT     @                       resend-verify=xxxxxxxxxxxxx
TXT     _dkim.decebaldobrica    v=DKIM1; k=rsa; p=MIGfMA0G...
TXT     @                       v=spf1 include:_spf.resend.com ~all
MX      @                       feedback-smtp.resend.com (priority 10)
```

4. Wait 24-48 hours for DNS propagation
5. Click **Verify Domain** in Resend

#### Option B: Use Resend's Default Domain (Quick Start)

```bash
EMAIL_FROM=onboarding@resend.dev
```

No domain setup needed, but emails may be marked as spam.

### Step 3: Generate API Key

1. In Resend Dashboard → **API Keys** → **Create API Key**
2. Name: `Production - Portfolio Site`
3. Permission: **Full Access** (or Sending Access)
4. Copy the key: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
5. Add to Vercel environment variables as `RESEND_API_KEY`

### Step 4: Test Email Sending

After deployment:
1. Go to your site's `/contact` page
2. Book a test meeting
3. Check Resend Dashboard → **Emails** to see if it was sent
4. Check your inbox (and spam folder)

**If emails don't arrive:**
- ✅ Verify domain is verified in Resend
- ✅ Check Resend Dashboard for error logs
- ✅ Try using `onboarding@resend.dev` temporarily
- ✅ Check spam folder
- ✅ Verify `EMAIL_FROM` matches verified domain

---

## Google Calendar Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project: "Portfolio Calendar Integration"
3. Enable **Google Calendar API**:
   - Go to **APIs & Services** → **Library**
   - Search "Google Calendar API"
   - Click **Enable**

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: `Portfolio Meeting Scheduler`
   - User support email: `discovery@decebaldobrica.com`
   - Developer contact: `discovery@decebaldobrica.com`
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users: `discovery@decebaldobrica.com`, `decebal1988@gmail.com`
6. Save

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Portfolio Backend`
5. Authorized redirect URIs:
   - `https://developers.google.com/oauthplayground`
6. Click **Create**
7. Save:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

### Step 4: Generate Refresh Token

1. Go to https://developers.google.com/oauthplayground
2. Click the gear icon (⚙️) in top right
3. Check **Use your own OAuth credentials**
4. Enter your Client ID and Client Secret
5. In left panel, find **Calendar API v3**
6. Select:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
7. Click **Authorize APIs**
8. Sign in with your Google account (the calendar you want to use)
9. Click **Exchange authorization code for tokens**
10. Copy the **Refresh token**: `1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 5: Add to Vercel

Add these environment variables in Vercel:

```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CALENDAR_OWNER_EMAIL=discovery@decebaldobrica.com
```

### Step 6: Test Calendar Integration

1. Book a test meeting on your deployed site
2. Check your Google Calendar for the event
3. Verify Google Meet link is created
4. Check logs in Vercel → Functions → Logs

---

## Domain Configuration

### Option 1: Use Vercel Domain

Your site is automatically available at:
- `https://your-project.vercel.app`

No configuration needed!

### Option 2: Add Custom Domain

1. In Vercel → **Settings** → **Domains**
2. Add domain: `decebaldobrica.com`
3. Vercel will provide DNS records

#### For Root Domain (decebaldobrica.com)

Add to your domain registrar:

```
Type    Name    Value
A       @       76.76.21.21
```

#### For Subdomain (www.decebaldobrica.com)

```
Type    Name    Value
CNAME   www     cname.vercel-dns.com
```

4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate will be auto-generated

### Update Email Configuration

After domain is live, update Resend:
- Verify emails are sending from your custom domain
- Update `EMAIL_FROM` in Vercel environment variables if needed

---

## Database Configuration

Your app uses SQLite which is file-based. **Important considerations for Vercel:**

### Option 1: Vercel Postgres (Recommended for Production)

SQLite is not recommended on Vercel (ephemeral filesystem). Consider migrating to Vercel Postgres:

1. In Vercel Dashboard → **Storage** → **Create Database**
2. Choose **Postgres**
3. Name: `portfolio-db`
4. Region: Same as your deployment region
5. Copy connection string
6. Update code to use Postgres instead of SQLite (requires migration)

### Option 2: Railway PostgreSQL

1. Sign up at https://railway.app
2. Create new project
3. Add **PostgreSQL** service
4. Copy connection string
5. Add to Vercel: `DATABASE_URL=postgresql://...`

### Option 3: Keep SQLite (Development Only)

**⚠️ Warning**: SQLite on Vercel is reset on every deployment!

For development/testing only:
- Database will be lost on every deployment
- Chat history and analytics will not persist
- Meeting bookings will be lost

**To keep SQLite working:**
- No changes needed, but data is ephemeral
- Consider external backup solution

**For production, use a persistent database like Vercel Postgres or Railway.**

---

## Groq AI Setup

### Fast LLM API with Groq

Your portfolio uses **Groq** - a high-performance LLM API provider with custom LPU (Language Processing Unit) hardware for ultra-fast inference.

✅ **Free tier available** - Generous limits for personal projects
✅ **Fast responses** - Groq's custom hardware delivers quick inference
✅ **Llama 3.1 8B** - Using the `llama-3.1-8b-instant` model
✅ **Simple setup** - Just add API key to environment variables

### Getting Your Groq API Key

1. Go to https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

### Add to Vercel

Add this environment variable in Vercel Dashboard → Settings → Environment Variables:

```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The chat will automatically start working with Groq's API after deployment.

### Rate Limits (Free Tier)

- Requests per minute: varies by model
- Tokens per minute: ~6,000 for llama-3.1-8b-instant
- Should be sufficient for most personal portfolio traffic

If you need higher limits, Groq offers paid plans.

---

## Solana Pay Configuration

### Step 1: Get Solana Wallet Address

1. Install Phantom wallet: https://phantom.app
2. Create wallet or import existing
3. Switch to **Mainnet** (for production)
4. Copy your wallet address: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Add to Vercel

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_MERCHANT_ADDRESS=your_wallet_address_here
```

### Step 3: Test Payment Flow

**⚠️ Important**:
- Test on **devnet** first: `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
- Switch to **mainnet-beta** only when ready for real payments
- Update meeting prices in `src/lib/meetingPayments.ts`

---

## Post-Deployment Verification

### Checklist

After deployment, verify:

#### Core Functionality
- [ ] Homepage loads without errors
- [ ] All pages accessible (About, Work, Blog, Services, Contact)
- [ ] Images load correctly
- [ ] Mobile responsive design works
- [ ] No console errors in browser

#### Email System
- [ ] Book a test meeting
- [ ] Confirmation email received
- [ ] Email has correct branding
- [ ] Links in email work
- [ ] No errors in Resend dashboard

#### Google Calendar (if configured)
- [ ] Meeting appears in Google Calendar
- [ ] Google Meet link is created
- [ ] Calendar invitation sent
- [ ] Event details are correct

#### AI Chat (if enabled)
- [ ] Chat interface loads
- [ ] Can send messages
- [ ] Receives responses
- [ ] No errors in console

#### Analytics
- [ ] Check Vercel Analytics for traffic
- [ ] Database tracking working (if configured)

### Monitor Logs

1. Vercel → **Deployments** → Your deployment → **Functions**
2. Watch for errors
3. Check for any `⚠️` warnings

---

## Troubleshooting

### Emails Not Arriving

**Problem**: No confirmation emails received

**Solutions**:
1. Check Resend Dashboard → **Emails** for send status
2. Verify domain is verified in Resend
3. Check spam folder
4. Try `EMAIL_FROM=onboarding@resend.dev` temporarily
5. Check Vercel function logs for errors
6. Verify `RESEND_API_KEY` is set correctly

**Still not working?**
```bash
# Add detailed logging (already implemented)
# Check Vercel logs after booking a meeting
# Look for "📧 Sending meeting confirmation to..."
```

### Google Calendar Errors

**Problem**: `invalid_client` error

**Solutions**:
1. Verify all 4 Google credentials are set in Vercel
2. Check refresh token hasn't expired
3. Regenerate refresh token using OAuth Playground
4. Ensure Calendar API is enabled in Google Cloud Console
5. Check OAuth consent screen is published

**Temporary fix**: Remove Google credentials to proceed without calendar integration

### Build Failures

**Problem**: Deployment fails to build

**Solutions**:
1. Check build logs in Vercel
2. Verify `package.json` has correct dependencies
3. Run `bun run build` locally to test
4. Check for TypeScript errors: `bun run type-check`
5. Verify Node.js version: Use 20.x or later

### Database Issues

**Problem**: Chat history not persisting

**Expected**: SQLite on Vercel is ephemeral
- Data resets on every deployment
- Migrate to Vercel Postgres or Railway for persistence

### 404 on Routes

**Problem**: Blog posts or work pages show 404

**Solutions**:
1. Ensure markdown files exist in `content/posts/` and `content/work/`
2. Check file naming matches slugs
3. Verify frontmatter is valid
4. Redeploy after adding content files

### Environment Variables Not Working

**Problem**: Features not working despite setting env vars

**Solutions**:
1. After adding/changing env vars in Vercel, **redeploy**
2. Check variable names match exactly (case-sensitive)
3. No quotes needed around values in Vercel UI
4. For `NEXT_PUBLIC_*` vars, rebuild is required

---

## Production Optimization

### Performance

1. **Enable Vercel Analytics**:
   - Vercel Dashboard → Analytics → Enable
   - Monitor Core Web Vitals

2. **Image Optimization**:
   - All images already use Next.js Image component
   - Vercel handles optimization automatically

3. **Caching**:
   - Static pages cached by default
   - API routes cache as configured

### Security

1. **Content Security Policy**:
   ```typescript
   // Add to next.config.ts if needed
   headers: [
     {
       key: 'Content-Security-Policy',
       value: "default-src 'self'; ..."
     }
   ]
   ```

2. **Rate Limiting**:
   - Consider adding rate limiting to API routes
   - Use Vercel Edge Config for IP blocking if needed

3. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Rotate API keys periodically
   - Use Vercel's encrypted storage

### Monitoring

1. **Vercel Logs**:
   - Check function logs regularly
   - Set up log drains for long-term storage

2. **Error Tracking**:
   - Consider Sentry integration
   - Monitor email delivery rates in Resend

3. **Uptime Monitoring**:
   - Use UptimeRobot or similar
   - Monitor `/api/health` endpoint

---

## Quick Start Checklist

Minimal viable deployment:

1. [ ] Push code to GitHub
2. [ ] Import to Vercel
3. [ ] Set `RESEND_API_KEY` and `EMAIL_FROM=onboarding@resend.dev`
4. [ ] Deploy
5. [ ] Test booking flow
6. [ ] Verify email arrives

**That's it!** Everything else (Google Calendar, custom domain, database) can be added incrementally.

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Resend Docs**: https://resend.com/docs
- **Google Calendar API**: https://developers.google.com/calendar
- **Next.js Docs**: https://nextjs.org/docs
- **Your Codebase**: See `CLAUDE.md` for architecture details

---

## Notes

- **Cost**: Vercel free tier includes 100GB bandwidth/month
- **Resend**: Free tier includes 3,000 emails/month
- **Database**: SQLite on Vercel is NOT persistent (use Postgres for production)
- **AI Features**: Groq provides free tier for AI chat with fast inference

Good luck with your deployment! 🚀
