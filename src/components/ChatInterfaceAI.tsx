'use client'

import { useToast } from '@/hooks/use-toast'
import {
  MEETING_TYPES_WITH_PRICING,
  createPaymentTransaction,
  formatSOL,
  formatUSDEquivalent,
  getMeetingConfig,
  requiresPayment,
} from '@/lib/meetingPayments'
import { generateUniqueReference } from '@/utils/solanaPay'
import { Bot, Calendar, CreditCard, Loader2, Send, User } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import SolanaPaymentModal from './SolanaPaymentModal'
import { ChatMessage } from './ChatMessage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  meetingRequest?: {
    type: string
    date?: string
    duration?: number
    requiresPayment: boolean
    price?: number
  }
}

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content:
    "Hello! I'm Decebal's AI assistant. I can help you learn about his fractional CTO services, blockchain expertise, and schedule a consultation. Whether you're a VC firm or startup founder, I'm here to help. What would you like to know?",
  timestamp: new Date('2024-01-01T12:00:00Z'),
}

const ChatInterfaceAI = () => {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingMeeting, setPendingMeeting] = useState<any>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [userJustSent, setUserJustSent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Smart scroll: only when user sends a message, bot is typing, or user is at bottom
  useEffect(() => {
    if (!chatContainerRef.current) return

    const container = chatContainerRef.current
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

    // Auto-scroll if:
    // 1. User just sent a message, OR
    // 2. Bot is currently streaming/typing, OR
    // 3. User is already near the bottom of the chat
    if (userJustSent || streamingMessageId || isNearBottom) {
      // Scroll within the chat container only, not the page
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
      setUserJustSent(false)
    }
  }, [messages, userJustSent, streamingMessageId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setUserJustSent(true) // Trigger scroll for user message

    try {
      // Call the AI API (use relative URL in Next.js)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: input },
          ],
          conversationId,
          userId: 'guest', // TODO: Replace with actual user ID if you have auth
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''
      const currentMessageId = `assistant-${Date.now()}`

      if (reader) {
        // Set streaming state for the current message
        setStreamingMessageId(currentMessageId)

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') {
                break
              }

              try {
                const parsed = JSON.parse(data)

                if (parsed.type === 'init') {
                  // Set conversation ID from API
                  setConversationId(parsed.conversationId)
                } else if (parsed.type === 'chunk') {
                  // Streaming chunk from API
                  assistantMessage += parsed.content

                  // Detect meeting request in the message
                  const meetingKeywords = ['schedule', 'meeting', 'book', 'consultation']
                  const hasMeetingIntent = meetingKeywords.some((keyword) =>
                    assistantMessage.toLowerCase().includes(keyword)
                  )

                  // Update or add assistant message
                  setMessages((prev) => {
                    const existingIndex = prev.findIndex((m) => m.id === currentMessageId)
                    if (existingIndex >= 0) {
                      const updated = [...prev]
                      updated[existingIndex] = {
                        ...updated[existingIndex],
                        content: assistantMessage,
                      }
                      return updated
                    } else {
                      return [
                        ...prev,
                        {
                          id: currentMessageId,
                          role: 'assistant',
                          content: assistantMessage,
                          timestamp: new Date(),
                        },
                      ]
                    }
                  })
                } else if (parsed.type === 'complete') {
                  // Stream complete - stop streaming animation
                  console.log('✅ Response complete')
                  setStreamingMessageId(null)
                } else if (parsed.type === 'error') {
                  // Handle error from API
                  console.error('API Error:', parsed.error)
                  setStreamingMessageId(null)
                  throw new Error(parsed.error)
                }
              } catch (e) {
                // Skip invalid JSON
                if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                  console.error('Stream parsing error:', e)
                }
              }
            }
          }
        }
      }

      setIsLoading(false)
      setStreamingMessageId(null)
    } catch (error) {
      console.error('Chat error:', error)

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble connecting to the AI service right now. This might be because Ollama isn't running or isn't configured properly. Please make sure Ollama is running at http://localhost:11434 with the llama3.2 model installed.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
      setStreamingMessageId(null)

      toast({
        title: 'Connection Error',
        description: 'Unable to connect to AI service',
        variant: 'destructive',
      })
    }
  }

  // Handle booking a meeting with payment
  const handleBookMeeting = (meetingType: string) => {
    const config = getMeetingConfig(meetingType)

    if (!config) {
      toast({
        title: 'Invalid Meeting Type',
        description: 'Please select a valid meeting type',
        variant: 'destructive',
      })
      return
    }

    // Store pending meeting info
    setPendingMeeting({
      type: meetingType,
      duration: config.duration,
      price: config.price,
      requiresPayment: config.requiresPayment,
    })

    if (config.requiresPayment) {
      // Show payment modal
      setShowPaymentModal(true)
    } else {
      // Free meeting - proceed directly
      confirmMeetingBooking(meetingType)
    }
  }

  // Confirm meeting booking after payment (or for free meetings)
  const confirmMeetingBooking = async (meetingType: string) => {
    // Send confirmation message to chat
    const confirmMessage = `Great! I'd like to book a ${meetingType}. Please provide your email and preferred date/time.`

    setInput(confirmMessage)

    // Automatically send the message
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
    await handleSend(syntheticEvent)
  }

  // Handle successful payment
  const handlePaymentSuccess = () => {
    if (pendingMeeting) {
      toast({
        title: '✅ Payment Successful!',
        description: `Your payment of ${formatSOL(pendingMeeting.price)} has been confirmed.`,
      })

      confirmMeetingBooking(pendingMeeting.type)
      setPendingMeeting(null)
    }
  }

  return (
    <div
      data-testid="chat-interface"
      className={`w-full transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Chat header with AI indicator */}
      <div className="bg-gradient-to-r from-brand-teal to-brand-teal/80 text-white px-6 py-4 rounded-t-lg shadow-lg flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-20"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-glow"></div>
        <Bot className="w-6 h-6 mr-2 relative z-10" />
        <div className="relative z-10">
          <h3 className="font-medium text-lg">AI Assistant</h3>
          <p className="text-xs text-white/80">Context-aware • Meeting Scheduler</p>
        </div>
      </div>

      {/* Chat message area */}
      <div
        ref={chatContainerRef}
        className="bg-gradient-to-b from-brand-navy/90 to-brand-darknavy/90 min-h-[450px] max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <div className="px-5 py-6 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              index={index}
              isStreaming={message.id === streamingMessageId}
            />
          ))}

          {isLoading && !streamingMessageId && (
            <div className="flex items-start gap-2 text-left animate-fade-in">
              <Bot className="w-4 h-4 text-brand-teal mt-1" />
              <div className="bg-white/10 text-white px-4 py-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                <div className="flex space-x-1">
                  <span
                    className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                    style={{ animationDelay: '0s' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></span>
                </div>
                <span className="text-sm text-gray-300">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="bg-gradient-to-r from-brand-navy to-brand-darknavy p-4 rounded-b-lg border-t border-white/10 flex animate-slide-up shadow-lg"
        style={{ animationDelay: '0.3s' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Decebal's work or schedule a meeting..."
          className="flex-1 bg-white/5 border border-white/20 rounded-l-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-transparent transition-all duration-300 placeholder:text-white/40"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-brand-teal text-white rounded-r-lg hover:bg-brand-teal/80 transition-all duration-300 disabled:opacity-50 px-4 flex items-center justify-center group relative"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </form>

      {/* Helpful info */}
      <div className="mt-4 p-3 bg-brand-teal/10 border border-brand-teal/20 rounded-lg">
        <div className="flex items-start gap-2 text-sm text-gray-300">
          <Calendar className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
          <div className="w-full">
            <p className="font-medium text-brand-teal">💡 Try asking me to:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>
                <button
                  onClick={() => setInput("Tell me about your fractional CTO services")}
                  className="text-left hover:text-brand-teal transition-colors cursor-pointer"
                >
                  • Tell you about fractional CTO services
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInput('How can you help VC-backed startups?')}
                  className="text-left hover:text-brand-teal transition-colors cursor-pointer"
                >
                  • How Decebal helps VC-backed startups
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInput('I want to schedule a consultation')}
                  className="text-left hover:text-brand-teal transition-colors cursor-pointer"
                >
                  • Schedule a consultation
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* Payment Modal */}
      {pendingMeeting && (
        <SolanaPaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          amount={pendingMeeting.price}
          serviceName={pendingMeeting.type}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default ChatInterfaceAI
