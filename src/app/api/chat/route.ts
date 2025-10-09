import { PORTFOLIO_CONTEXT } from '@/lib/portfolioContext'
import { createGroq } from '@ai-sdk/groq'
import { convertToCoreMessages, streamText } from 'ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      system: PORTFOLIO_CONTEXT,
      messages: convertToCoreMessages(messages),
      temperature: 0.7,
      maxTokens: 400,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
