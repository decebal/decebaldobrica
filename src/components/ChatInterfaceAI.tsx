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
    "Hello! I'm John's AI assistant. I can help you learn about John's work, services, and I can even schedule a meeting for you. How can I help you today?",
  timestamp: new Date(),
}

const ChatInterfaceAI = () => {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingMeeting, setPendingMeeting] = useState<any>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    scrollToBottom()
    inputRef.current?.focus()

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

    try {
      // Call the AI API (use environment variable for production)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${API_URL}/api/chat`, {
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

                if (parsed.type === 'conversation_id') {
                  setConversationId(parsed.conversationId)
                } else if (parsed.type === 'text') {
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
                } else if (parsed.type === 'tool') {
                  // Handle tool calls (like meeting scheduling)
                  if (parsed.content.result?.message) {
                    toast({
                      title: '✅ Meeting Scheduled',
                      description: 'Check your messages for details',
                    })
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Chat error:', error)

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble connecting to the AI service right now. This might be because the API server isn't running or the API key isn't configured. Please make sure to start the API server with 'npm run dev:api' and set your OPENAI_API_KEY environment variable.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)

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
      <div className="bg-gradient-to-b from-brand-navy/90 to-brand-darknavy/90 min-h-[450px] max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="px-5 py-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`${message.role === 'user' ? 'text-right' : 'text-left'} animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-2 mb-1">
                {message.role === 'assistant' && <Bot className="w-4 h-4 text-brand-teal mt-1" />}
                <div
                  className={`inline-block px-4 py-3 rounded-lg max-w-[85%] transition-all duration-300 ${
                    message.role === 'user'
                      ? 'bg-brand-teal text-white rounded-br-none hover:shadow-md hover:shadow-brand-teal/30 ml-auto'
                      : 'bg-white/10 text-white rounded-bl-none hover:bg-white/15'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                </div>
                {message.role === 'user' && <User className="w-4 h-4 text-gray-400 mt-1" />}
              </div>
              <div
                className={`text-xs text-gray-400 px-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}

          {isLoading && (
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

          <div ref={messagesEndRef} />
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
          placeholder="Ask about John's work or schedule a meeting..."
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
              <li>• Tell you about John's services and expertise</li>
              <li>• Check availability and schedule a meeting</li>
              <li>• Answer questions about John's portfolio</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Book Meeting Buttons */}
      <div className="mt-4 p-4 bg-brand-navy/50 border border-brand-teal/20 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-brand-teal" />
          <h4 className="text-sm font-medium text-brand-teal">Quick Book a Meeting</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MEETING_TYPES_WITH_PRICING).map(([type]) => {
            const config = getMeetingConfig(type)
            if (!config) return null

            return (
              <button
                key={type}
                onClick={() => handleBookMeeting(type)}
                className="group relative p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-teal/50 rounded-lg transition-all duration-300 text-left"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white mb-1">{type}</span>
                  <div className="flex items-center gap-1">
                    {config.requiresPayment ? (
                      <>
                        <span className="text-xs text-brand-teal font-semibold">
                          {formatSOL(config.price)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatUSDEquivalent(config.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-green-400 font-semibold">FREE</span>
                    )}
                  </div>
                </div>
                {config.requiresPayment && (
                  <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <CreditCard className="w-3 h-3 text-brand-teal" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          💳 Paid meetings accept Solana Pay • Free meetings are instant
        </p>
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
