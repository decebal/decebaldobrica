# RAG-Based Content Generation Guide

Complete guide to generating evergreen leadership content using your personal knowledge base and experiences.

## 🎯 What This System Does

This system combines **AnythingLLM** (RAG platform) with **Groq** (fast LLM) to generate blog posts that:
- **Match your writing style** by learning from your previous posts
- **Incorporate your frameworks** by referencing your knowledge base
- **Include your experiences** by pulling from case studies and retrospectives
- **Use proven methodologies** like STAR and Golden Nuggets structure

## 🚀 Quick Start (5 Minutes)

### Step 1: Start AnythingLLM Locally

```bash
# From project root
docker compose -f docker-compose.anythingllm.yml up -d

# Verify it's running
docker ps | grep anythingllm
```

Access AnythingLLM at: **http://localhost:3102**

### Step 2: Initial Setup

1. **Create admin password** (first-time only)
2. **Configure Groq**:
   - LLM Provider: "Groq"
   - API Key: Your Groq API key from https://console.groq.com
   - Model: `llama-3.1-70b-versatile`
3. **Create Workspace**:
   - Name: "Leadership Blog Content"
   - Mode: "Chat"
   - Slug: `leadership-blog-content`

### Step 3: Build Your Knowledge Base

```bash
# Export your existing blog posts
node scripts/export-blog-to-kb.js

# This copies all posts from apps/web/content/blog/ to knowledge-base/blog-posts/
```

**Upload to AnythingLLM**:
1. Go to "Documents" in AnythingLLM UI
2. Click "Upload Documents"
3. Upload files from `knowledge-base/`:
   - `blog-posts/` - Your existing articles
   - `frameworks/` - OKR, STAR, North Star documents
   - `experience/` - Your case studies (add your own!)
   - `technical/` - Technical content (add your own!)
4. Assign to "Leadership Blog Content" workspace

### Step 4: Configure Environment Variables

Add to `apps/newsletter-admin/.env`:

```bash
# Groq (Required)
GROQ_API_KEY=gsk_your_actual_groq_key

# AnythingLLM (Local)
ANYTHINGLLM_API_URL=http://localhost:3102
ANYTHINGLLM_API_KEY=your_token_from_anythingllm_settings
ANYTHINGLLM_WORKSPACE_SLUG=leadership-blog-content
```

To get your AnythingLLM API key:
1. Open AnythingLLM UI (http://localhost:3102)
2. Go to Settings → API Keys
3. Generate new API key
4. Copy to `.env`

### Step 5: Start Newsletter Admin

```bash
# Start the admin dashboard
task dev:admin

# Or manually:
cd apps/newsletter-admin && bun run dev
```

Access at: **http://localhost:3101**

### Step 6: Generate Your First Post

1. Navigate to **AI Blog Composer** (🤖 AI Blog in nav)
2. Select **AnythingLLM (RAG)** mode
3. Enter topic: e.g., "How I Scaled an Engineering Team from 5 to 50"
4. Add key points:
   ```
   - Started with 5 engineers in 2021
   - Grew to 50 by 2023
   - Implemented OKR framework
   - Built hiring pipeline
   - Maintained <5% attrition
   - Used STAR methodology
   ```
5. Click **Generate Full Blog Post**
6. Wait for RAG research and generation (~2-3 minutes)
7. Review, edit, and export as MDX

## 📚 Building a Comprehensive Knowledge Base

### What to Include

#### 1. Your Blog Posts (Automatic)
```bash
# Run export script
node scripts/export-blog-to-kb.js
```

All your existing blog posts will be copied to `knowledge-base/blog-posts/`

#### 2. Leadership Frameworks (Provided)

Already included in `knowledge-base/frameworks/`:
- `okr-framework.md` - OKR goal-setting
- `star-methodology.md` - STAR storytelling
- `north-star-framework.md` - Product North Star metrics

**Add your own**:
```bash
# Create new framework
touch knowledge-base/frameworks/your-framework.md
```

#### 3. Personal Experiences (You Create)

Create files in `knowledge-base/experience/`:

**Example: `scaling-team.md`**
```markdown
# Scaling Engineering Team at [Company]

## Context
When I joined [Company] as CTO in Jan 2021, we had 5 engineers...

## Challenge
We needed to scale to 50+ engineers while maintaining quality and culture...

## Actions Taken
1. **Built Hiring Pipeline**
   - Created structured interview process
   - Trained hiring managers
   - Implemented 4-stage funnel
   - Result: 15% offer acceptance rate → 75%

2. **Implemented OKR Framework**
   - Quarterly goal setting
   - Weekly check-ins
   - Transparent progress tracking
   - Result: Team alignment score 6.2 → 8.9

[Continue with more details...]

## Results
- Team: 5 → 52 engineers (940% growth)
- Attrition: <3% voluntary turnover
- Velocity: 3x increase in feature delivery
- Satisfaction: Glassdoor 3.2 → 4.7

## Key Lessons
1. Culture is built through systems, not slogans
2. Hire slow, onboard fast
3. OKRs only work with weekly check-ins
```

#### 4. Technical Deep Dives

Create files in `knowledge-base/technical/`:

**Example: `api-latency-optimization.md`**
```markdown
# API Latency Optimization: 800ms → 120ms

## Problem
API response times were averaging 800ms, causing user complaints...

## Analysis
[Your technical investigation]

## Solution
[Your implementation details]

## Results
[Metrics and impact]

## Code Examples
[Actual code snippets]
```

### Knowledge Base Structure

```
knowledge-base/
├── blog-posts/          # Auto-exported from your blog
│   ├── post-1.md
│   ├── post-2.md
│   └── ...
├── frameworks/          # Leadership/business frameworks
│   ├── okr-framework.md
│   ├── star-methodology.md
│   ├── north-star-framework.md
│   └── [your-frameworks].md
├── experience/          # Your case studies
│   ├── scaling-team.md
│   ├── incident-response.md
│   └── [your-experiences].md
└── technical/           # Technical deep dives
    ├── architecture-decisions.md
    ├── performance-optimization.md
    └── [your-technical-content].md
```

### Tips for Great Knowledge Base Content

1. **Be Specific**
   - Include actual metrics (not "improved a lot")
   - Use real numbers (not "significant increase")
   - Name technologies, tools, frameworks

2. **Include Context**
   - Company size, team size, industry
   - Timeline and constraints
   - Why decisions were made

3. **Document Failures**
   - What didn't work
   - Why it failed
   - What you learned
   - (The AI will learn from these too!)

4. **Use Your Voice**
   - Write naturally, as you speak
   - Include opinions and hot takes
   - Add personality and humor
   - The AI will mimic this style

## 🎨 Content Generation Modes

### Mode 1: AnythingLLM (RAG) - Recommended

**Best for**: Evergreen leadership content that matches your style

**How it works**:
1. Searches your knowledge base for relevant content
2. Finds matching frameworks, experiences, examples
3. Generates content using STAR structure
4. Incorporates your writing style from previous posts

**Pros**:
- Personalized to your experiences
- Matches your writing style
- References specific frameworks you use
- Includes concrete examples from your work

**Cons**:
- Requires knowledge base setup
- Slower (2-3 minutes vs 30 seconds)
- Needs local AnythingLLM running or deployed

**Best for topics like**:
- "How I Scaled [Something] at [Company]"
- "Lessons from [Experience]"
- "Using [Framework] to [Achieve Goal]"

### Mode 2: Groq (Basic)

**Best for**: Quick drafts, generic content, testing

**How it works**:
1. Direct LLM call with your prompt
2. No knowledge base reference
3. Generic STAR structure
4. Fast generation (30 seconds)

**Pros**:
- Fast generation
- No setup required
- Works immediately with just Groq API key

**Cons**:
- Generic content
- Doesn't know your style
- No specific examples
- May lack depth

**Best for topics like**:
- Generic how-to guides
- Industry trends
- Quick drafts for editing

## 📖 Content Generation Workflow

### For Maximum Quality

**Step 1: Research (Optional but Recommended)**

Before generating, manually check your knowledge base:
1. Search AnythingLLM for relevant content
2. Note which frameworks apply
3. Identify relevant experiences
4. Find similar posts you've written

**Step 2: Detailed Topic + Context**

**❌ Weak prompt**:
- Topic: "Engineering Leadership"
- Key Points: (empty)

**✅ Strong prompt**:
- Topic: "How I Grew My Engineering Team 10x While Maintaining Culture"
- Key Points:
  ```
  - Timeline: Jan 2021 to Dec 2023
  - Team growth: 5 → 52 engineers
  - Framework used: OKRs for alignment
  - Key metrics: <3% attrition, 75% offer accept rate
  - Biggest challenge: Maintaining culture during hypergrowth
  - Solution: Documented values, structured onboarding, weekly 1-on-1s
  - Tools: Lattice for OKRs, Greenhouse for hiring
  - Geography: Distributed team across 3 time zones
  ```

**Step 3: Generate**

1. Select **AnythingLLM (RAG)** mode
2. Enter detailed topic and context
3. Click "Generate Full Blog Post"
4. Watch progress log for research findings
5. Wait 2-3 minutes for all sections

**Step 4: Review & Edit**

The AI generates 8 sections:
1. **Hook** - Review for impact, make it punchier
2. **Situation** - Verify context is accurate
3. **Task** - Ensure objectives are clear
4. **Action** - Add/edit specific implementation details
5. **Result** - Verify all metrics are correct
6. **Golden Nuggets** - Ensure insights are unique
7. **Thinking Tools** - Check frameworks are explained well
8. **Conclusion** - Strengthen call-to-action

**Common Edits**:
- Add code snippets (AI won't generate full code)
- Verify all numbers and metrics
- Add more personality and voice
- Include relevant links and resources
- Add images/diagrams (describe where they should go)

**Step 5: Regenerate Sections**

Click "Regenerate" on any section that needs improvement. The AI will:
- Keep context from other sections
- Generate fresh alternative content
- Maintain your knowledge base references

**Step 6: Export & Publish**

1. Click "Export MDX"
2. Move file to `apps/web/content/blog/`
3. Add hero image path to frontmatter
4. Review in blog locally: `task dev`
5. Commit and deploy

## 🔍 Troubleshooting

### AnythingLLM Not Starting

```bash
# Check logs
docker logs anythingllm-local

# Restart
docker compose -f docker-compose.anythingllm.yml restart

# Full reset
docker compose -f docker-compose.anythingllm.yml down -v
docker compose -f docker-compose.anythingllm.yml up -d
```

### "ANYTHINGLLM_API_KEY is not configured"

1. Open AnythingLLM UI: http://localhost:3102
2. Settings → API Keys
3. Create new API key
4. Copy to `apps/newsletter-admin/.env`
5. Restart admin: `task dev:admin`

### Generated Content is Generic

**Problem**: Not using your knowledge base

**Solutions**:
1. Verify workspace has documents assigned
2. Check documents processed successfully (no errors in UI)
3. Use more specific topics that match your knowledge base
4. Add more content to your knowledge base

### Generation is Slow

**AnythingLLM (RAG)**: 2-3 minutes is normal
- Searches knowledge base
- Processes 8 sections with context

**Groq (Basic)**: Should be <30 seconds
- If slow, check Groq API status

### Content Doesn't Match My Style

**Solutions**:
1. Upload more of your writing
2. Ensure blog posts are assigned to workspace
3. Add documents that capture your voice
4. Be more specific in tone selection

## 🚢 Deploying to Production

### Deploy AnythingLLM to Railway

See full guide: `docs/ANYTHINGLLM_SETUP.md`

**Quick steps**:
```bash
railway init
railway up

# Set environment variables in Railway dashboard
GROQ_API_KEY=xxx
AUTH_TOKEN=xxx
JWT_SECRET=xxx
```

Update `apps/newsletter-admin/.env`:
```bash
ANYTHINGLLM_API_URL=https://your-instance.railway.app
ANYTHINGLLM_API_KEY=your_production_token
```

## 📊 Measuring Success

Track these metrics:
- **Time to Draft**: RAG vs manual writing
- **Edit Time**: How much editing needed
- **Content Quality**: Reader engagement
- **Style Match**: How much sounds like you
- **Knowledge Utilization**: % of posts using RAG

## 🎓 Advanced Tips

### 1. Specialized Workspaces

Create multiple workspaces for different content types:
- "Technical Deep Dives" - Architecture, code, performance
- "Leadership Lessons" - Team building, culture, management
- "Product Strategy" - Roadmaps, prioritization, metrics

### 2. Regular Knowledge Base Updates

**After each post**:
```bash
# Add new post to knowledge base
cp apps/web/content/blog/new-post.mdx knowledge-base/blog-posts/new-post.md

# Upload to AnythingLLM
# (via UI or API)
```

### 3. Document Templates

Create templates for common post types:

**Case Study Template** (`knowledge-base/templates/case-study.md`):
```markdown
# [Title]: [Metric Improvement]

## Context
- Company: [Name, size, industry]
- Role: [Your role]
- Team: [Size, structure]
- Timeline: [Duration]

## Challenge
[Specific problem with business impact]

## Solution
[3-5 key actions with details]

## Results
[Metrics table]

## Lessons
[Key takeaways]
```

### 4. Prompt Engineering

**For better hooks**:
"Create a hook that uses a surprising statistic from the knowledge base"

**For more technical depth**:
"Include code examples and architecture diagrams in the Action section"

**For better stories**:
"Use storytelling tone with specific anecdotes from my experiences"

## 🆘 Getting Help

**Documentation**:
- AnythingLLM Setup: `docs/ANYTHINGLLM_SETUP.md`
- AI Blog Composer: `docs/AI_BLOG_COMPOSER.md`
- This Guide: `docs/RAG_CONTENT_GENERATION_GUIDE.md`

**Resources**:
- AnythingLLM Docs: https://docs.useanything.com
- Groq Docs: https://console.groq.com/docs
- RAG Concepts: https://www.pinecone.io/learn/rag/

**Common Issues**:
- Check Docker is running: `docker ps`
- Verify API keys are set: `env | grep ANYTHINGLLM`
- Check logs: `docker logs anythingllm-local`

---

**Ready to start?** Run `docker compose -f docker-compose.anythingllm.yml up -d` and start generating!
