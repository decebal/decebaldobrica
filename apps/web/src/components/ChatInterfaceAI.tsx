'use client'

import { useChat } from '@ai-sdk/react'
import { Bot, Calendar, Loader2, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChatMessage } from './ChatMessage'

const ChatInterfaceAI = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')

  const { messages, status, error, sendMessage } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        createdAt: new Date(),
        parts: [
          {
            type: 'text',
            text: "Hello! I'm Decebal's AI assistant. I can answer questions about his fractional CTO services, blockchain expertise, and technical background. If you'd like to schedule a consultation, just let me know and I'll direct you to the booking form below!",
          },
        ],
      },
    ],
  })

  // Auto-scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages.length is intentional to track message count changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages.length])

  return (
    <div
      data-testid="chat-interface"
      className="flex flex-col h-[600px] w-full max-w-4xl mx-auto border border-white/10 rounded-lg overflow-hidden shadow-xl"
    >
      {/* Chat header */}
      <div className="bg-gradient-to-r from-brand-teal to-brand-teal/80 text-white px-6 py-3 flex items-center justify-between relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-20" />
        <div className="flex items-center relative z-10">
          <Bot className="w-5 h-5 mr-2" />
          <div>
            <h3 className="font-medium text-base">AI Assistant</h3>
            <p className="text-xs text-white/80">Powered by Groq • Llama 3.1</p>
          </div>
        </div>
      </div>

      {/* Chat message area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-brand-navy/90 to-brand-darknavy/90"
      >
        {messages.map((message, index) => {
          // Extract text content from message parts (AI SDK v5 format)
          const content = message.parts
            .filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join('')

          return (
            <ChatMessage
              key={message.id}
              message={{
                id: message.id,
                role: message.role as 'user' | 'assistant',
                content,
                timestamp: message.createdAt || new Date(),
              }}
              index={index}
              isStreaming={false}
            />
          )
        })}

        {status !== 'ready' && (
          <div className="py-6 px-4 bg-white/5 animate-fade-in">
            <div className="max-w-3xl mx-auto flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex space-x-1">
                  <span
                    className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                    style={{ animationDelay: '0s' }}
                  />
                  <span
                    className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                <span className="text-sm text-gray-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="py-6 px-4">
            <div className="max-w-3xl mx-auto bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm text-red-300">
              <p className="font-medium">Error: {error.message}</p>
              <p className="text-xs mt-1">Please check your connection and try again</p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 bg-gradient-to-r from-brand-navy to-brand-darknavy p-4 flex-shrink-0">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!input.trim() || status !== 'ready') return
            await sendMessage({ text: input })
            setInput('')
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Decebal's work or schedule a meeting..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-transparent transition-all duration-300 placeholder:text-white/40"
            disabled={status !== 'ready'}
          />
          <button
            type="submit"
            className="bg-brand-teal text-white rounded-lg hover:bg-brand-teal/80 transition-all duration-300 disabled:opacity-50 px-5 flex items-center justify-center group relative"
            disabled={status !== 'ready' || !input.trim()}
          >
            {status !== 'ready' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </form>

        {/* Suggestion chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInput('What are your fractional CTO services?')}
            type="button"
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-gray-300 hover:text-white transition-colors"
            disabled={status !== 'ready'}
          >
            Fractional CTO services
          </button>
          <button
            onClick={() => setInput('Tell me about your blockchain experience')}
            type="button"
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-gray-300 hover:text-white transition-colors"
            disabled={status !== 'ready'}
          >
            Blockchain experience
          </button>
          <button
            onClick={() => setInput('How do I schedule a consultation?')}
            type="button"
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-gray-300 hover:text-white transition-colors"
            disabled={status !== 'ready'}
          >
            Schedule consultation
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterfaceAI
