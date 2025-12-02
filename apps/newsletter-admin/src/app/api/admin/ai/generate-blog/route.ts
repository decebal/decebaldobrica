import { generateBlogPostWithRAG, generateBlogSection } from '@/lib/anythingllm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  action: z.enum(['full_post', 'regenerate_section']),
  topic: z.string(),
  keyPoints: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  mode: z.enum(['groq', 'anythingllm']).optional().default('groq'),
  sectionId: z.string().optional(),
  sectionTitle: z.string().optional(),
  context: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .optional(),
})

async function callGroq(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile', // Larger model for better writing
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

const BLOG_STRUCTURE = [
  {
    id: 'hook',
    title: 'Hook (Viral Opening)',
    prompt:
      'Write a compelling 3-4 line hook that grabs attention immediately. Use bold statements, surprising facts, or relatable problems.',
  },
  {
    id: 'situation',
    title: 'Situation: The Challenge',
    prompt:
      'Describe the context and problem. Include:\n- What was the initial situation?\n- Why was it a problem?\n- What was the business impact?',
  },
  {
    id: 'task',
    title: 'Task: Define Clear Goals',
    prompt:
      'Define what needed to be accomplished:\n- Primary objectives (3-4 points)\n- Key constraints\n- Success metrics',
  },
  {
    id: 'actions',
    title: 'Action: Strategic Implementation',
    prompt:
      'Describe 3-5 key actions taken. For each action include:\n- What was done\n- Why this approach was chosen\n- How it was implemented\n- Immediate results',
  },
  {
    id: 'result',
    title: 'Result: Measurable Impact',
    prompt:
      'Present concrete results:\n- 4-6 key metrics (Before → After with improvement %)\n- Business impact\n- Lessons learned',
  },
  {
    id: 'golden_nuggets',
    title: 'Business Golden Nuggets (3 required)',
    prompt:
      'Extract 3 business golden nuggets. For each:\n- The key lesson\n- The framework/mental model\n- Business impact\n- Actionable advice (3-4 points)\n- Real-world application example',
  },
  {
    id: 'thinking_tools',
    title: 'Thinking Tools Used (3 required)',
    prompt:
      'Identify 3 thinking tools/mental models used. For each:\n- Tool name and description\n- How it was applied\n- Why it worked\n- When to use it\n- Example in action',
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    prompt:
      'Write a strong conclusion that:\n- Summarizes key takeaways\n- Provides a call to action\n- Leaves the reader inspired',
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      action,
      topic,
      keyPoints,
      targetAudience,
      tone,
      mode,
      sectionId,
      sectionTitle,
      context,
    } = requestSchema.parse(body)

    // Use AnythingLLM for RAG-based generation
    if (mode === 'anythingllm' && action === 'full_post') {
      try {
        const result = await generateBlogPostWithRAG({
          topic,
          keyPoints,
          targetAudience,
          tone,
        })

        return NextResponse.json({
          sections: result.sections.map((s) => ({
            id: s.id,
            title: s.title,
            content: s.content,
            aiGenerated: true,
          })),
          research: result.research,
        })
      } catch (error) {
        // Fallback to Groq if AnythingLLM fails
        console.error('[AI Blog] AnythingLLM error, falling back to Groq:', error)
        // Continue to Groq fallback below
      }
    }

    // Use AnythingLLM for section regeneration
    if (mode === 'anythingllm' && action === 'regenerate_section') {
      try {
        const section = BLOG_STRUCTURE.find((s) => s.id === sectionId)
        if (!section) {
          return NextResponse.json({ error: 'Invalid section ID' }, { status: 400 })
        }

        const content = await generateBlogSection({
          topic,
          sectionTitle: section.title,
          sectionPrompt: section.prompt,
          keyPoints,
          targetAudience,
          tone,
          context,
        })

        return NextResponse.json({ content })
      } catch (error) {
        console.error('[AI Blog] AnythingLLM error, falling back to Groq:', error)
        // Continue to Groq fallback below
      }
    }

    // Groq generation (original implementation)
    const systemPrompt = `You are an expert technical writer and CTO who specializes in writing viral LinkedIn content and technical blog posts.

Your writing style:
- Professional but engaging
- Uses the STAR methodology (Situation, Task, Action, Result)
- Includes concrete metrics and business impact
- Provides actionable insights and frameworks
- Target audience: ${targetAudience || 'CTOs and Engineering Leaders'}
- Tone: ${tone || 'professional'}

Format your output in clean markdown with proper headers, bullet points, and code blocks where appropriate.`

    if (action === 'full_post') {
      // Generate all sections
      const sections = await Promise.all(
        BLOG_STRUCTURE.map(async (section) => {
          const prompt = `Topic: ${topic}

${keyPoints ? `Key Points/Context:\n${keyPoints}\n\n` : ''}

${section.prompt}

Write ONLY the content for the "${section.title}" section. Be specific, use concrete examples, and include metrics where relevant.`

          const content = await callGroq(prompt, systemPrompt)

          return {
            id: section.id,
            title: section.title,
            content,
            aiGenerated: true,
          }
        })
      )

      return NextResponse.json({ sections })
    }

    if (action === 'regenerate_section') {
      const contextStr = context?.map((c) => `## ${c.title}\n${c.content}`).join('\n\n') || ''

      const prompt = `Topic: ${topic}

${keyPoints ? `Key Points/Context:\n${keyPoints}\n\n` : ''}

${contextStr ? `Related content from other sections:\n${contextStr}\n\n` : ''}

Regenerate the "${sectionTitle}" section with fresh content. Keep it aligned with the topic and other sections.`

      const content = await callGroq(prompt, systemPrompt)

      return NextResponse.json({ content })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    console.error('[AI Blog] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
