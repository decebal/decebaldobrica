# AI Blog Post Composer

AI-powered blog post creation system using Groq (Llama 3.1 70B) to generate comprehensive blog posts following your STAR + Golden Nuggets methodology.

## Features

### 🤖 AI-Powered Generation
- **Full Post Generation**: Generate all sections at once based on topic and key points
- **Individual Section Regeneration**: Refine any section with one click
- **Manual Editing**: Edit AI-generated content directly in the interface
- **Export to MDX**: Download ready-to-publish markdown files

### 📝 Blog Structure (STAR + Golden Nuggets)

1. **Hook** - Viral opening (3-4 lines)
2. **Situation** - Context and problem description
3. **Task** - Goals, constraints, success metrics
4. **Action** - 3-5 key actions with implementation details
5. **Result** - Metrics, business impact, lessons learned
6. **Golden Nuggets (3)** - Business insights with frameworks
7. **Thinking Tools (3)** - Mental models and when to use them
8. **Conclusion** - Summary and call to action

## Access

**URL:** http://localhost:3101/compose/blog

## Usage

### Quick Start

1. **Open AI Blog Composer** in newsletter admin
2. **Enter Topic**: e.g., "How I Reduced API Latency by 80% Using Rust"
3. **Add Context** (optional): Bullet points of key details, metrics, technical decisions
4. **Set Audience**: Default is "CTOs and Engineering Leaders"
5. **Choose Tone**: Professional, Casual, Technical, or Storytelling
6. **Generate**: Click "Generate Full Blog Post"

### Refining Content

- **Regenerate Section**: Click "Regenerate" on any section for fresh content
- **Manual Edits**: Edit text directly in the textarea
- **Export**: Download as `.mdx` file ready for `content/blog/`

### Example Workflow

```bash
# 1. Generate post via AI Blog Composer
# 2. Export MDX file
# 3. Move to blog content directory
mv ~/Downloads/how-i-reduced-api-latency.mdx apps/web/content/blog/

# 4. Review and edit
code apps/web/content/blog/how-i-reduced-api-latency.mdx

# 5. Publish
task publish -- how-i-reduced-api-latency
```

## Configuration

### Groq API Setup

The AI composer uses Groq's Llama 3.1 70B model for high-quality writing.

**Required Environment Variable:**
```bash
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**Get API Key:**
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Navigate to API Keys
4. Create new key and copy to `.env`

**Model Details:**
- Model: `llama-3.1-70b-versatile`
- Temperature: 0.7 (creative but focused)
- Max Tokens: 4096 per section
- Cost: Free tier includes generous limits

## Advanced: Deploy AnythingLLM on Railway (Optional)

For more advanced use cases (RAG, document analysis, custom knowledge bases), you can deploy AnythingLLM:

### Option 1: Railway Deploy Button

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/anythingllm)

### Option 2: Manual Railway Setup

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
railway init

# 4. Deploy AnythingLLM
railway add
# Select "AnythingLLM" from templates

# 5. Configure environment variables in Railway dashboard
# - LLM_PROVIDER=groq
# - GROQ_API_KEY=gsk_your_key
# - AUTH_TOKEN=your_secure_token
```

### AnythingLLM Features

- **Custom Knowledge Bases**: Upload your technical docs, previous blog posts
- **RAG (Retrieval Augmented Generation)**: AI responses based on your documents
- **Multiple LLM Providers**: Groq, OpenAI, Anthropic, local models
- **Document Chat**: Ask questions about your uploaded content
- **Web UI**: Beautiful interface for document management

### Integration with Blog Composer

Once AnythingLLM is deployed, you can:

1. **Upload Previous Posts**: Build knowledge base of your writing style
2. **Query for Ideas**: "What topics haven't I covered about Rust?"
3. **Fact-Check**: Verify technical details against your docs
4. **Style Matching**: Generate content that matches your voice

**Example API Call:**
```typescript
const response = await fetch('https://your-anythingllm.railway.app/api/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Generate a blog post outline about microservices migration',
    mode: 'chat'
  })
})
```

## Tips for Best Results

### Topic Selection
✅ **Good Topics:**
- "How I Reduced AWS Costs by 60% with Serverless"
- "Building a Real-Time Analytics Dashboard with WebSockets"
- "Migrating a Monolith to Microservices: Lessons from 6 Months"

❌ **Avoid:**
- Too broad: "Software Engineering Best Practices"
- Too vague: "My Thoughts on Tech"
- Too narrow: "How to Install Node.js"

### Key Points/Context

Provide specific details for better output:

```
✅ Good Context:
- Started with 3s average API response time
- Used Rust to replace Python bottlenecks
- Implemented connection pooling and caching
- Final result: 200ms average (85% improvement)
- Reduced server costs from $2000/mo to $800/mo
- Team: 2 backend engineers, 3 weeks

❌ Weak Context:
- Made API faster
- Used Rust
- Saved money
```

### Editing AI Output

1. **Verify Metrics**: Check all numbers and percentages
2. **Add Code Examples**: AI can suggest but won't generate actual code blocks
3. **Personal Touch**: Add your voice, anecdotes, and opinions
4. **Links**: Add resource links, documentation refs
5. **SEO**: Refine title and description for search

## Troubleshooting

### "GROQ_API_KEY is not configured"
- Ensure `GROQ_API_KEY` is set in your `.env` file
- Restart dev server after adding: `task dev:admin`

### Generation Takes Too Long
- Groq is fast (usually <5 seconds per section)
- Check network connection
- Try regenerating if it times out

### Content Quality Issues
- Add more specific context in "Key Points"
- Try different tone settings
- Manually edit and regenerate specific sections
- Use "Regenerate" button to get alternative versions

## Future Enhancements

Potential improvements to consider:

- [ ] Save drafts to database
- [ ] Content templates for different post types
- [ ] SEO optimization suggestions
- [ ] Automatic image generation (DALL-E integration)
- [ ] Social media post generation for cross-posting
- [ ] A/B testing different hooks
- [ ] Integration with AnythingLLM for RAG
- [ ] Voice-to-text for recording ideas
- [ ] Multi-language support

## Cost Estimates

### Groq (Current)
- **Free Tier**: 30 requests/minute, 6,000 tokens/minute
- **Cost per Post**: ~$0.00 (within free tier)
- **Monthly Usage**: Unlimited blog posts (practically free)

### AnythingLLM on Railway (Optional)
- **Railway Costs**: ~$5-10/month for hobby tier
- **Storage**: ~$2/month for 10GB documents
- **Total**: ~$7-12/month for advanced features

## Support

**Issues?** Check the logs:
```bash
# Admin app logs
tail -f apps/newsletter-admin/.next/build.log

# API route logs
# Check browser console or Railway logs
```

**Questions?** Reference:
- [Groq Documentation](https://console.groq.com/docs)
- [AnythingLLM Docs](https://docs.useanything.com)
- [Railway Docs](https://docs.railway.app)
