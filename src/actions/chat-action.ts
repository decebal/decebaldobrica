// src/actions/chat.ts
// Server Action for AI chat

'use server'

import { z } from 'zod'
import { createConversation, addMessage, trackEvent } from '@/lib/chatHistory'
import { generateOllamaChatResponse } from '@/lib/ollamaChat'

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
})

export async function sendChatMessage(input: z.infer<typeof chatSchema>) {
  try {
    // Validate input
    const { messages, conversationId, userId } = chatSchema.parse(input)

    // Create or get conversation
    let currentConversationId = conversationId
    if (!currentConversationId) {
      const conversation = createConversation(userId, {
        source: 'web',
        userAgent: 'next',
      })
      currentConversationId = conversation.id
      trackEvent('conversation_started', { conversationId: currentConversationId }, userId, currentConversationId)
    }

    // Get last user message
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === 'user') {
      // Save user message
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

    // Generate AI response
    const responseStream = await generateOllamaChatResponse(
      messages,
      currentConversationId,
      userId
    )

    // Collect full response
    let fullResponse = ''
    for await (const chunk of responseStream) {
      fullResponse += chunk
    }

    // Save assistant response
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

    return {
      success: true,
      conversationId: currentConversationId,
      response: fullResponse,
    }
  } catch (error) {
    console.error('Chat action error:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Action for getting conversation history
export async function getConversationHistory(conversationId: string) {
  try {
    const { getConversation, getMessages } = await import('@/lib/chatHistory')

    const conversation = getConversation(conversationId)
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      }
    }

    const messages = getMessages(conversationId)

    return {
      success: true,
      conversation,
      messages,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
