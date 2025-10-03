// src/app/api/chat/route.ts
// API Route for streaming AI responses using Server-Sent Events

import { addMessage, createConversation, trackEvent } from '@/lib/chatHistory'
import { generateOllamaChatResponse } from '@/lib/ollamaChat'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  conversationId: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
})

/**
 * POST /api/chat
 * Streaming endpoint for AI chat responses
 * Returns Server-Sent Events (SSE) stream
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, conversationId, userId } = chatRequestSchema.parse(body)

    // Create or get conversation
    let currentConversationId = conversationId
    if (!currentConversationId) {
      const conversation = createConversation(userId, {
        source: 'web',
        userAgent: req.headers.get('user-agent') || 'unknown',
      })
      currentConversationId = conversation.id
      trackEvent(
        'conversation_started',
        { conversationId: currentConversationId },
        userId,
        currentConversationId
      )
    }

    // Get last user message
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === 'user') {
      addMessage(currentConversationId, 'user', lastUserMessage.content)
      trackEvent(
        'message_sent',
        {
          role: 'user',
          length: lastUserMessage.content.length,
        },
        userId,
        currentConversationId
      )
    }

    // Create ReadableStream for SSE
    const encoder = new TextEncoder()
    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial data with conversation ID
          const initData = JSON.stringify({
            type: 'init',
            conversationId: currentConversationId,
          })
          controller.enqueue(encoder.encode(`data: ${initData}\n\n`))

          // Generate AI response stream
          const responseStream = await generateOllamaChatResponse(
            messages,
            currentConversationId,
            userId
          )

          // Stream chunks to client
          for await (const chunk of responseStream) {
            fullResponse += chunk

            const data = JSON.stringify({
              type: 'chunk',
              content: chunk,
            })

            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Save complete response to database
          if (fullResponse) {
            addMessage(currentConversationId, 'assistant', fullResponse)
            trackEvent(
              'message_sent',
              {
                role: 'assistant',
                length: fullResponse.length,
              },
              userId,
              currentConversationId
            )
          }

          // Send completion event
          const completeData = JSON.stringify({
            type: 'complete',
            fullResponse,
          })
          controller.enqueue(encoder.encode(`data: ${completeData}\n\n`))

          // Close stream
          controller.close()
        } catch (error) {
          // Send error event
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

/**
 * GET /api/chat?conversationId=xxx
 * Get conversation history
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'conversationId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { getConversation, getMessages } = await import('@/lib/chatHistory')

    const conversation = getConversation(conversationId)
    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const messages = getMessages(conversationId)

    return new Response(
      JSON.stringify({
        success: true,
        conversation,
        messages,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
