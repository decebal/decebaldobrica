import { PORTFOLIO_CONTEXT } from '@/lib/portfolioContext'
import { createGroq } from '@ai-sdk/groq'
import { convertToCoreMessages, streamText } from 'ai'
import { PostHog } from 'posthog-node'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Initialize PostHog for server-side tracking
let posthog: PostHog | null = null
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  })
}

export async function POST(req: Request) {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  try {
    const { messages } = await req.json()

    // Track conversation start if this is the first message
    if (messages.length === 1 && posthog) {
      posthog.capture({
        distinctId: conversationId,
        event: 'chat_conversation_started',
        properties: {
          conversation_id: conversationId,
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Track user message
    if (posthog) {
      const lastMessage = messages[messages.length - 1]
      posthog.capture({
        distinctId: conversationId,
        event: 'chat_message_sent',
        properties: {
          role: 'user',
          message_length: lastMessage.content?.length || 0,
          conversation_id: conversationId,
          timestamp: new Date().toISOString(),
        },
      })
    }

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      system: PORTFOLIO_CONTEXT,
      messages: convertToCoreMessages(messages),
      temperature: 0.7,
      maxTokens: 400,
      onFinish: async (result) => {
        // Track assistant response
        if (posthog) {
          posthog.capture({
            distinctId: conversationId,
            event: 'chat_message_sent',
            properties: {
              role: 'assistant',
              message_length: result.text?.length || 0,
              conversation_id: conversationId,
              timestamp: new Date().toISOString(),
              tokens_used: result.usage?.totalTokens || 0,
            },
          })
          await posthog.shutdown()
        }
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)

    // Track error
    if (posthog) {
      posthog.capture({
        distinctId: conversationId,
        event: 'chat_error',
        properties: {
          error_type: 'api_error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          conversation_id: conversationId,
          timestamp: new Date().toISOString(),
        },
      })
      await posthog.shutdown()
    }

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
