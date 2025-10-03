'use client'

import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }
  index: number
  isStreaming?: boolean
}

export function ChatMessage({ message, index, isStreaming = false }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // For assistant messages, simulate typing at ~2x conversational pace (30ms per char)
  // This is faster than human typing (~100-150ms) but slow enough to feel natural
  useEffect(() => {
    if (message.role === 'assistant' && isStreaming) {
      if (currentIndex < message.content.length) {
        const timeout = setTimeout(() => {
          setDisplayedContent(message.content.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }, 30) // 30ms per character = ~33 chars/second (faster, more responsive)

        return () => clearTimeout(timeout)
      } else {
        setIsTypingComplete(true)
      }
    } else {
      // User messages or completed assistant messages show immediately
      setDisplayedContent(message.content)
      setIsTypingComplete(true)
    }
  }, [message.content, currentIndex, message.role, isStreaming])

  // Reset when message content changes (new streaming chunks)
  useEffect(() => {
    if (message.role === 'assistant' && isStreaming) {
      setCurrentIndex(0)
      setDisplayedContent('')
      setIsTypingComplete(false)
    } else {
      setDisplayedContent(message.content)
      setIsTypingComplete(true)
    }
  }, [message.id, message.role, isStreaming])

  return (
    <div
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
          {message.role === 'assistant' ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-brand-teal">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                  code: ({ children }) => (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-white/10 p-3 rounded-md overflow-x-auto my-2">{children}</pre>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {displayedContent}
              </ReactMarkdown>
              {isStreaming && currentIndex < message.content.length && (
                <span className="inline-block w-0.5 h-4 bg-brand-teal ml-0.5 align-middle animate-blink-cursor" />
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">{displayedContent}</div>
          )}
        </div>
        {message.role === 'user' && <User className="w-4 h-4 text-gray-400 mt-1" />}
      </div>
      <div className={`text-xs text-gray-400 px-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
        {message.timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}
