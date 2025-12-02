'use client'

import { Check, Copy, Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react'
import { useState } from 'react'

interface TerminalProps {
  children: React.ReactNode
  title?: string
  user?: string
  host?: string
  path?: string
  className?: string
  height?: string
  showCopy?: boolean
  showExpand?: boolean
}

/**
 * Terminal Component for Blog Posts
 *
 * Displays command-line output with a terminal-like interface
 *
 * @example
 * ```tsx
 * <Terminal
 *   title="Installation"
 *   user="decebal"
 *   host="macbook"
 *   path="~/projects"
 * >
 *   npm install @your/package
 *
 *   > @your/package@1.0.0 installed successfully
 *   > 42 packages added
 * </Terminal>
 * ```
 */
export function Terminal({
  children,
  title = 'Terminal',
  user = 'user',
  host = 'localhost',
  path = '~',
  className = '',
  height,
  showCopy = true,
  showExpand = true,
}: TerminalProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = async () => {
    const text = typeof children === 'string' ? children : extractText(children)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`terminal-wrapper my-6 ${className}`}>
      {/* Terminal Header */}
      <div className="terminal-header flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <div className="flex items-center gap-2">
          {/* Traffic lights (macOS style) */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* Title */}
          <div className="flex items-center gap-2 ml-4 text-gray-300 text-sm">
            <TerminalIcon className="w-4 h-4" />
            <span>{title}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          {showExpand && (
            <button
              type="button"
              onClick={toggleExpand}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className="terminal-body bg-gray-900 p-4 rounded-b-lg overflow-x-auto font-mono text-sm"
        style={{
          height: isExpanded ? 'auto' : height,
          maxHeight: isExpanded ? 'none' : height,
        }}
      >
        {/* Prompt */}
        <div className="terminal-prompt flex items-start gap-2 mb-2">
          <span className="text-green-400">
            {user}@{host}
          </span>
          <span className="text-gray-400">:</span>
          <span className="text-blue-400">{path}</span>
          <span className="text-gray-400">$</span>
        </div>

        {/* Content */}
        <div className="terminal-content text-gray-100 whitespace-pre-wrap">{children}</div>
      </div>
    </div>
  )
}

/**
 * TerminalCommand Component
 *
 * Displays a command with syntax highlighting
 */
export function TerminalCommand({ children }: { children: React.ReactNode }) {
  return (
    <div className="terminal-command text-white font-bold mb-1">
      <span className="text-gray-400 mr-2">$</span>
      {children}
    </div>
  )
}

/**
 * TerminalOutput Component
 *
 * Displays command output
 */
export function TerminalOutput({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
}) {
  const colors = {
    default: 'text-gray-300',
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }

  return <div className={`terminal-output mb-1 ${colors[variant]}`}>{children}</div>
}

/**
 * TerminalLine Component
 *
 * Displays a single line with optional prefix
 */
export function TerminalLine({
  children,
  prefix,
  variant = 'default',
}: {
  children: React.ReactNode
  prefix?: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'comment'
}) {
  const colors = {
    default: 'text-gray-300',
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    comment: 'text-gray-500',
  }

  return (
    <div className={`terminal-line ${colors[variant]}`}>
      {prefix && <span className="mr-2">{prefix}</span>}
      {children}
    </div>
  )
}

/**
 * Helper to extract text from React nodes
 */
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return extractText(node.props.children)
  }

  return ''
}

/**
 * Interactive Terminal Component
 *
 * Simulates a terminal with command/output pairs
 */
export function InteractiveTerminal({
  commands,
  title = 'Terminal',
  user = 'user',
  host = 'localhost',
  path = '~',
  className = '',
  autoPlay = false,
  delay = 1000,
}: {
  commands: Array<{
    command: string
    output: string
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  }>
  title?: string
  user?: string
  host?: string
  path?: string
  className?: string
  autoPlay?: boolean
  delay?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(autoPlay ? 0 : commands.length)

  // Auto-play logic
  useState(() => {
    if (autoPlay && currentIndex < commands.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, commands.length))
      }, delay)
      return () => clearTimeout(timer)
    }
  })

  const visibleCommands = commands.slice(0, currentIndex)

  return (
    <Terminal
      title={title}
      user={user}
      host={host}
      path={path}
      className={className}
      showCopy={false}
    >
      {visibleCommands.map((cmd, idx) => (
        <div key={idx} className="mb-3">
          <TerminalCommand>{cmd.command}</TerminalCommand>
          <TerminalOutput variant={cmd.variant}>{cmd.output}</TerminalOutput>
        </div>
      ))}
    </Terminal>
  )
}
