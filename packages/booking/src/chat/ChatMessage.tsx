'use client'

import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

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

export function ChatMessage({ message, index }: ChatMessageProps) {
  return (
    <div
      className={`py-6 px-4 ${message.role === 'assistant' ? 'bg-white/5' : ''} animate-slide-up`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {message.role === 'assistant' && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        {message.role === 'user' && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-white">
            {message.role === 'assistant' ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc ml-5 mb-4 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-5 mb-4 space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="leading-7">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-brand-teal">{children}</strong>
                    ),
                    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                    code: ({ children }) => (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-brand-teal">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-white/10 p-4 rounded-lg overflow-x-auto my-4 border border-white/10">
                        {children}
                      </pre>
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
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words leading-7">{message.content}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
