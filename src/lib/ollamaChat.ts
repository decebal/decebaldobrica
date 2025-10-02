import { trackEvent } from '@/lib/chatHistory'
import { sendMeetingConfirmation } from '@/lib/emailService'
import type { Meeting } from '@/lib/emailService'
import {
  checkAvailability as checkGoogleAvailability,
  createCalendarEvent as createGoogleEvent,
} from '@/lib/googleCalendar'
import { MEETING_TYPES } from '@/lib/portfolioContext'
import {
  createCalendarEvent,
  formatMeetingConfirmation,
  formatTimeSlot,
  generateTimeSlots,
  getMeetings,
  hasConflict,
  saveMeeting,
} from '@/utils/calendar'
import { Ollama } from 'ollama'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

let ragSystem: any = null
let initializeRAG: any = null
let queryKnowledgeBase: any = null
let buildContext: any = null

/**
 * Initialize RAG system on server start
 */
export async function initOllamaChat() {
  try {
    // Lazy load RAG system to avoid build issues with chromadb
    if (!initializeRAG) {
      try {
        const ragModule = await import('@/lib/ragSystem')
        initializeRAG = ragModule.initializeRAG
        queryKnowledgeBase = ragModule.queryKnowledgeBase
        buildContext = ragModule.buildContext
      } catch {
        // Fallback to stub if RAG system can't be loaded
        const stubModule = await import('@/lib/ragSystemStub')
        initializeRAG = stubModule.initializeRAG
        queryKnowledgeBase = stubModule.queryKnowledgeBase
        buildContext = stubModule.buildContext
      }
    }
    ragSystem = await initializeRAG()
    console.log('✅ Ollama chat system initialized')
  } catch (error) {
    console.warn('⚠️  RAG system initialization failed, will run without it:', error)
  }
}

/**
 * Detect if user wants to schedule a meeting
 */
function detectMeetingIntent(message: string): boolean {
  const meetingKeywords = [
    'schedule',
    'meeting',
    'book',
    'appointment',
    'consultation',
    'available',
    'availability',
    'meet',
    'call',
    'talk',
    'discuss',
  ]

  const lowerMessage = message.toLowerCase()
  return meetingKeywords.some((keyword) => lowerMessage.includes(keyword))
}

/**
 * Detect if user is asking about availability
 */
function detectAvailabilityIntent(message: string): boolean {
  const availabilityKeywords = [
    'available',
    'availability',
    'free',
    'open',
    'when can',
    'time slot',
  ]

  const lowerMessage = message.toLowerCase()
  return availabilityKeywords.some((keyword) => lowerMessage.includes(keyword))
}

/**
 * Extract date from message (simple implementation)
 */
function extractDate(message: string): string | null {
  // Simple date patterns (you can enhance this)
  const datePatterns = [
    /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /\d{1,2}\/\d{1,2}\/\d{4}/, // MM/DD/YYYY
  ]

  for (const pattern of datePatterns) {
    const match = message.match(pattern)
    if (match) {
      return match[0]
    }
  }

  // Check for relative dates
  const today = new Date()
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('tomorrow')) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (lowerMessage.includes('next week')) {
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek.toISOString().split('T')[0]
  }

  return null
}

/**
 * Schedule a meeting with Google Calendar and email integration
 */
async function scheduleMeeting(
  date: Date,
  duration: number,
  type: string,
  contactName?: string,
  contactEmail?: string,
  notes?: string,
  conversationId?: string,
  userId?: string
): Promise<string> {
  try {
    // Create local meeting record
    const meeting = createCalendarEvent({
      date,
      duration,
      type,
      contactName,
      contactEmail,
      notes,
    })

    // Save to local storage
    saveMeeting(meeting)

    // Try to create Google Calendar event
    let calendarEventId: string | null = null
    try {
      calendarEventId = await createGoogleEvent({
        summary: `${type} with ${contactName || 'Guest'}`,
        description: notes || `Meeting scheduled via portfolio chat`,
        startTime: date,
        endTime: new Date(date.getTime() + duration * 60000),
        attendees: contactEmail ? [contactEmail] : [],
        location: 'Video Conference',
      })

      if (calendarEventId) {
        console.log('✅ Google Calendar event created:', calendarEventId)
      }
    } catch (calError) {
      console.warn('⚠️  Could not create Google Calendar event:', calError)
    }

    // Try to send confirmation email
    if (contactEmail) {
      try {
        const emailMeeting: Meeting = {
          id: meeting.id,
          type: meeting.type,
          date: meeting.date,
          duration: meeting.duration,
          contactName: meeting.contactName,
          contactEmail: meeting.contactEmail,
          notes: meeting.notes,
        }

        const emailSent = await sendMeetingConfirmation(emailMeeting)
        if (emailSent) {
          console.log('✅ Confirmation email sent to', contactEmail)
        }
      } catch (emailError) {
        console.warn('⚠️  Could not send confirmation email:', emailError)
      }
    }

    // Track meeting scheduled event
    if (conversationId) {
      trackEvent(
        'meeting_scheduled',
        {
          meetingId: meeting.id,
          type,
          duration,
          hasEmail: !!contactEmail,
          googleCalendarUsed: !!calendarEventId,
        },
        userId,
        conversationId
      )
    }

    return formatMeetingConfirmation(meeting)
  } catch (error) {
    console.error('Error scheduling meeting:', error)
    return 'I encountered an error while scheduling the meeting. Please try again or contact me directly.'
  }
}

/**
 * Check availability for a date
 */
async function checkAvailability(
  date: string,
  conversationId?: string,
  userId?: string
): Promise<string> {
  try {
    const requestedDate = new Date(date)
    const allSlots = generateTimeSlots(requestedDate, 30)
    const existingMeetings = getMeetings()

    // Check local calendar conflicts
    const availableSlots = allSlots.filter(
      (slot) => slot.available && !hasConflict(slot, existingMeetings)
    )

    // If Google Calendar is configured, check against it too
    const googleAvailableSlots = []
    for (const slot of availableSlots) {
      const startTime = new Date(slot.start)
      const endTime = new Date(slot.end)
      const isAvailable = await checkGoogleAvailability(startTime, endTime)
      if (isAvailable) {
        googleAvailableSlots.push(slot)
      }
    }

    // Use Google Calendar results if available, otherwise use local
    const finalSlots = googleAvailableSlots.length > 0 ? googleAvailableSlots : availableSlots

    const formattedSlots = finalSlots.map((slot) => formatTimeSlot(slot))

    // Track availability check
    if (conversationId) {
      trackEvent(
        'availability_checked',
        {
          date,
          slotsFound: formattedSlots.length,
          googleCalendarUsed: googleAvailableSlots.length > 0,
        },
        userId,
        conversationId
      )
    }

    if (formattedSlots.length === 0) {
      return `I don't have any available slots on ${date}. Would you like to try another date?`
    }

    return `Here are my available times on ${date} (EST):\n\n${formattedSlots.slice(0, 8).join('\n')}\n\nWould you like to schedule a meeting for one of these times?`
  } catch (error) {
    return `I had trouble checking availability for that date. Please provide a date in YYYY-MM-DD format.`
  }
}

/**
 * Generate chat response using Ollama + RAG
 */
export async function generateOllamaChatResponse(
  messages: ChatMessage[],
  conversationId?: string,
  userId?: string
): Promise<AsyncIterableIterator<string>> {
  const ollama = new Ollama({ host: 'http://localhost:11434' })

  // Get the last user message
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()

  if (!lastUserMessage) {
    throw new Error('No user message found')
  }

  // Check for meeting/availability intents
  if (detectAvailabilityIntent(lastUserMessage.content)) {
    const date = extractDate(lastUserMessage.content)
    if (date) {
      const availabilityResponse = await checkAvailability(date, conversationId, userId)
      return (async function* () {
        yield availabilityResponse
      })()
    } else {
      return (async function* () {
        yield "I'd be happy to check my availability! Could you please provide a specific date? For example: 'Are you available on 2025-10-15?' or 'What's your availability next Tuesday?'"
      })()
    }
  }

  // Query RAG system for relevant context
  let contextInfo = ''
  if (ragSystem) {
    try {
      const relevantDocs = await queryKnowledgeBase(
        lastUserMessage.content,
        ragSystem.collection,
        ragSystem.embeddings,
        3
      )

      if (relevantDocs.length > 0) {
        contextInfo = buildContext(relevantDocs)
      }
    } catch (error) {
      console.error('RAG query error:', error)
    }
  }

  // Build system prompt
  const systemPrompt = `You are a helpful AI assistant for Decebal Dobrica's professional portfolio website.

Your role is to:
1. Answer questions about Decebal's work, services, and expertise
2. Help visitors schedule meetings
3. Provide accurate information based on the knowledge base
4. Be professional, friendly, and concise

${contextInfo}

Important guidelines:
- Use the context above to provide accurate answers
- If asked about scheduling, guide users to provide date/time preferences
- Be conversational but professional
- Keep responses concise (2-3 paragraphs max)
- If you don't know something, admit it honestly

Meeting scheduling info:
- Available Monday-Friday, 9 AM - 5 PM EST
- Meeting types: ${MEETING_TYPES.join(', ')}
- Duration: 30 minutes or 1 hour
`

  // Build conversation history
  const conversationHistory = messages.map((m) => ({
    role: m.role === 'system' ? 'system' : m.role,
    content: m.content,
  }))

  // Add system prompt at the beginning
  conversationHistory.unshift({
    role: 'system',
    content: systemPrompt,
  })

  // Stream response from Ollama
  const response = await ollama.chat({
    model: 'llama3.2:3b',
    messages: conversationHistory as any,
    stream: true,
  })

  // Return async generator for streaming
  return (async function* () {
    for await (const part of response) {
      if (part.message?.content) {
        yield part.message.content
      }
    }
  })()
}
