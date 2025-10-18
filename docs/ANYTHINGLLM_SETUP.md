# AnythingLLM Setup Guide

Complete guide to deploying and using AnythingLLM for RAG-based content generation.

## What is AnythingLLM?

AnythingLLM is an open-source document chatbot and RAG (Retrieval Augmented Generation) platform that allows you to:
- Upload your documents (blog posts, articles, notes)
- Create a knowledge base that AI can reference
- Generate content that matches your writing style
- Incorporate your personal experiences and frameworks

## Local Development Setup (Recommended for Testing)

### Prerequisites

- Docker Desktop installed
- Groq API key (free from https://console.groq.com)

### Quick Start

1. **Start AnythingLLM locally**:
   ```bash
   # From project root
   docker compose -f docker-compose.anythingllm.yml up -d
   ```

2. **Access the UI**:
   Open http://localhost:3102

3. **First-time setup**:
   - Create admin password
   - Select "Groq" as LLM provider
   - Enter your Groq API key
   - Choose `llama-3.1-70b-versatile` model

4. **Stop when done**:
   ```bash
   docker compose -f docker-compose.anythingllm.yml down
   ```

### Local Environment Variables

Create `.env.anythingllm` in project root:

```bash
# Required
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional - Change for production
ANYTHINGLLM_AUTH_TOKEN=your_secure_token_here
ANYTHINGLLM_JWT_SECRET=your_random_jwt_secret_here
```

### Data Persistence

All data is stored in `./anythingllm-storage/`:
- Vector embeddings
- Uploaded documents
- User settings
- Chat history

**Important**: Add to `.gitignore`:
```
anythingllm-storage/
```

### Local Knowledge Base

Create a `knowledge-base/` directory:

```bash
mkdir -p knowledge-base/{blog-posts,frameworks,experience,technical}
```

This directory is mounted at `/knowledge-base` in the container for easy document uploads.

## Production Deployment to Railway

### Option 1: One-Click Deploy (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/anythingllm)

1. Click the deploy button above
2. Configure environment variables (see below)
3. Wait for deployment (3-5 minutes)
4. Get your Railway URL (e.g., `https://anythingllm-production-xxxx.up.railway.app`)

### Option 2: Manual Railway Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
railway init

# 4. Link to GitHub repo (optional)
railway link

# 5. Deploy from this directory
railway up
```

## Environment Variables

Configure these in Railway dashboard:

### Required Variables

```bash
# LLM Provider - Using Groq (fast & free)
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here

# Authentication (set a secure password)
AUTH_TOKEN=your_secure_auth_token_here

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret_here

# Storage
STORAGE_DIR=/app/server/storage
```

### Optional Variables

```bash
# Embedding Provider (for document search)
EMBEDDING_PROVIDER=native  # or 'openai' for better quality
EMBEDDING_MODEL=text-embedding-ada-002  # if using OpenAI

# Vector Database
VECTOR_DB=lancedb  # or 'pinecone', 'chroma', 'qdrant'

# Server
SERVER_PORT=3000
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## Initial Configuration

Once deployed, configure AnythingLLM:

### 1. Access Your Instance

Visit your Railway URL: `https://your-anythingllm-instance.railway.app`

### 2. First-Time Setup

1. **Set Admin Password**: Create a secure admin password
2. **Select LLM**: Choose "Groq" as your LLM provider
3. **Enter API Key**: Add your Groq API key
4. **Select Model**: Choose `llama-3.1-70b-versatile` for best quality
5. **Configure Embeddings**: Use "Native" for free or "OpenAI" for better quality

### 3. Create Your First Workspace

1. Click "New Workspace"
2. Name it "Leadership Blog Content"
3. Configure workspace settings:
   - **Chat Mode**: "Chat"
   - **Document Processing**: "Recursive Character"
   - **Chunk Size**: 1000
   - **Chunk Overlap**: 200

## Building Your Knowledge Base

### Document Types to Upload

1. **Your Blog Posts**
   - Export all your existing blog posts as markdown
   - Include metadata (date, tags, metrics)

2. **Leadership Frameworks**
   - Upload documents about leadership concepts
   - Management theories and methodologies
   - Business frameworks you use

3. **Personal Experience Documents**
   - Case studies from your career
   - Project retrospectives
   - Lessons learned documents

4. **Technical Documentation**
   - Your technical articles
   - Architecture decisions
   - Technology choices and rationale

### Upload Methods

#### Via Web UI
1. Go to "Documents" in sidebar
2. Click "Upload Documents"
3. Drag and drop files (supports .md, .txt, .pdf, .docx)
4. Wait for processing
5. Assign to workspace

#### Via API (Bulk Upload)
```bash
curl -X POST https://your-instance.railway.app/api/v1/document/upload \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -F "file=@/path/to/document.md"
```

## Preparing Your Documents

### 1. Export Existing Blog Posts

Create a script to export your blog posts:

```bash
# Export all blog posts to a directory
mkdir -p knowledge-base/blog-posts

# Copy from content/blog/
cp apps/web/content/blog/*.mdx knowledge-base/blog-posts/
```

### 2. Create Leadership Framework Documents

Example structure for `knowledge-base/frameworks/okr-framework.md`:

```markdown
# OKR Framework

## Overview
Objectives and Key Results (OKRs) is a goal-setting framework...

## When to Use
- Setting quarterly goals
- Aligning team objectives
- Measuring progress

## How I Apply It
At [Company], I used OKRs to...
[Your personal experience]

## Results
- Improved alignment by 40%
- Reduced planning time by 60%
- Increased goal achievement by 35%

## Key Lessons
1. Start with company-level OKRs
2. Cascade to teams
3. Review weekly, adjust quarterly
```

### 3. Document Your Experience

Create files like `knowledge-base/experience/scaling-team.md`:

```markdown
# Scaling Engineering Teams: My Experience

## Context
When I joined [Company] as CTO, the team was 5 engineers...

## Challenges
- Rapid hiring while maintaining quality
- Building engineering culture
- Scaling architecture and processes

## Actions Taken
1. Implemented structured hiring process
2. Created onboarding program
3. Established engineering principles

## Results
- Grew team from 5 to 50 engineers
- Maintained <5% turnover
- Shipped 10x more features

## Key Insights
[Your unique insights and lessons]
```

## Integration with Blog Composer

### Environment Variables

Add to `apps/newsletter-admin/.env`:

```bash
# AnythingLLM Integration
ANYTHINGLLM_API_URL=https://your-instance.railway.app
ANYTHINGLLM_API_KEY=your_auth_token_here
ANYTHINGLLM_WORKSPACE_SLUG=leadership-blog-content
```

### API Endpoints

AnythingLLM provides these endpoints:

```typescript
// 1. Chat with workspace (RAG query)
POST /api/v1/workspace/:slug/chat
{
  "message": "Generate a blog post about OKRs based on my experience",
  "mode": "query"
}

// 2. Upload document
POST /api/v1/document/upload
Content-Type: multipart/form-data
file: [binary]

// 3. List documents
GET /api/v1/documents

// 4. Embed document in workspace
POST /api/v1/workspace/:slug/update-embeddings
{
  "adds": [documentId1, documentId2]
}
```

## Content Generation Workflow

### 1. Basic RAG Query

Ask AnythingLLM to generate content based on your knowledge base:

```typescript
const response = await fetch(`${ANYTHINGLLM_API_URL}/api/v1/workspace/${slug}/chat`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: `Generate a blog post about: ${topic}

    Use my writing style and incorporate:
    - Relevant frameworks from my knowledge base
    - Personal experiences that match this topic
    - Concrete metrics and examples
    - STAR methodology structure

    Context: ${keyPoints}`,
    mode: 'query'
  })
})
```

### 2. Enhanced Multi-Step Generation

For better quality, use multi-step prompting:

**Step 1: Research Phase**
```
"Search my knowledge base for:
1. Relevant frameworks about [topic]
2. Personal experiences with [topic]
3. Metrics and results related to [topic]
4. Similar blog posts I've written"
```

**Step 2: Outline Phase**
```
"Based on the research, create a blog post outline for:
Topic: [topic]
Include: relevant frameworks, my experiences, concrete examples"
```

**Step 3: Content Generation**
```
"Write the full blog post following the outline.
Match my writing style and tone.
Use STAR methodology.
Include 3 golden nuggets and 3 thinking tools."
```

## Quality Control

### Tips for Best Results

1. **Document Quality**
   - Upload well-structured documents
   - Include metadata and context
   - Remove duplicates

2. **Query Optimization**
   - Be specific in your prompts
   - Reference specific frameworks or experiences
   - Iterate on prompts

3. **Review and Edit**
   - Always review AI-generated content
   - Add personal touches
   - Verify facts and metrics
   - Check for hallucinations

### Common Issues

**Issue**: Generated content doesn't match my style
**Solution**: Upload more of your writing, increase chunk size, be more specific in prompts

**Issue**: AI hallucinates facts or metrics
**Solution**: Always verify, use `mode: 'query'` to enforce RAG, review sources

**Issue**: Content is too generic
**Solution**: Add more specific examples to knowledge base, use detailed prompts

## Monitoring and Maintenance

### Regular Tasks

1. **Monthly**: Review and update knowledge base
2. **After each post**: Upload new blog post to knowledge base
3. **Quarterly**: Review content quality and adjust prompts
4. **As needed**: Add new frameworks and experiences

### Analytics

Track in PostHog:
- Content generation requests
- Time to generate vs. manual writing
- Content quality ratings
- Knowledge base utilization

## Cost Estimates

### Railway Hosting
- **Hobby Plan**: $5/month (512MB RAM, sufficient for personal use)
- **Pro Plan**: $10-20/month (1GB+ RAM, better performance)
- **Storage**: ~$0.10/GB per month

### LLM Costs (Using Groq)
- **Free Tier**: 30 requests/min, 6,000 tokens/min (sufficient for personal blog)
- **Cost**: Effectively free for personal blog use
- **Alternative**: OpenAI GPT-4 (~$0.03 per generation)

### Total Monthly Cost
- **Basic Setup**: $5/month (Railway Hobby + Groq Free)
- **Professional**: $15-25/month (Railway Pro + premium embeddings)

## Advanced Features

### Multi-Workspace Setup

Create specialized workspaces:
1. **"Technical Leadership"** - Architecture, scaling, DevOps
2. **"People Management"** - Hiring, culture, performance
3. **"Product Strategy"** - Roadmaps, prioritization, metrics
4. **"Career Growth"** - Mentorship, learning, progression

### Custom Agents

Configure agents for different content types:
- **LinkedIn Post Agent**: Short, punchy, with hooks
- **Long-Form Blog Agent**: Detailed, STAR methodology
- **Technical Deep Dive Agent**: Code examples, architecture
- **Leadership Insights Agent**: Frameworks, experiences

### API Integrations

Integrate with other tools:
- **Notion**: Sync documents automatically
- **GitHub**: Pull from markdown docs
- **Slack**: Generate content via slash commands
- **Zapier**: Automate document uploads

## Troubleshooting

### Deployment Issues

**Railway deployment fails**
```bash
# Check logs
railway logs

# Common fixes
- Increase memory allocation in Railway dashboard
- Check environment variables are set
- Verify Dockerfile syntax
```

**Can't access UI**
- Check Railway service is running
- Verify domain is active
- Check firewall/security settings

### API Issues

**401 Unauthorized**
- Verify AUTH_TOKEN is correct
- Check Authorization header format
- Regenerate token if needed

**Slow responses**
- Reduce chunk size
- Use faster embedding model
- Upgrade Railway plan

**Poor content quality**
- Upload more relevant documents
- Improve prompt specificity
- Use better base model (70B vs 8B)

## Next Steps

1. ✅ Deploy AnythingLLM to Railway
2. ✅ Configure with Groq API
3. ✅ Upload initial documents
4. ✅ Test content generation
5. ✅ Integrate with blog composer
6. ✅ Refine prompts and quality
7. ✅ Scale knowledge base

## Support Resources

- **AnythingLLM Docs**: https://docs.useanything.com
- **Railway Docs**: https://docs.railway.app
- **Groq Docs**: https://console.groq.com/docs
- **Community**: AnythingLLM Discord

---

**Ready to deploy?** Start with the One-Click Railway deployment button at the top of this guide!
