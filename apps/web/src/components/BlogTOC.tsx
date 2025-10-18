'use client'

import { Button } from '@decebal/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Lightbulb,
  List,
  Target,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface TOCSection {
  id: string
  title: string
  level: number
  type: 'situation' | 'task' | 'action' | 'result' | 'nugget' | 'tool' | 'conclusion' | 'default'
  readingTime: number // in seconds
  children?: TOCSection[]
}

interface BlogTOCProps {
  content: string
}

// Calculate reading time (200 words per minute)
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.ceil((words / 200) * 60) // seconds
}

// Detect section type from title
function detectSectionType(title: string): TOCSection['type'] {
  const lower = title.toLowerCase()
  if (lower.includes('situation') || lower.includes('challenge') || lower.includes('problem')) {
    return 'situation'
  }
  if (lower.includes('task') || lower.includes('goal') || lower.includes('objective')) {
    return 'task'
  }
  if (lower.includes('action') || lower.includes('implementation') || lower.includes('step')) {
    return 'action'
  }
  if (lower.includes('result') || lower.includes('impact') || lower.includes('metric')) {
    return 'result'
  }
  if (lower.includes('nugget') || lower.includes('insight') || lower.includes('lesson')) {
    return 'nugget'
  }
  if (lower.includes('tool') || lower.includes('thinking') || lower.includes('framework')) {
    return 'tool'
  }
  if (lower.includes('conclusion') || lower.includes('summary') || lower.includes('takeaway')) {
    return 'conclusion'
  }
  return 'default'
}

// Get icon and color for section type
function getSectionStyle(type: TOCSection['type']) {
  switch (type) {
    case 'situation':
      return { icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' }
    case 'task':
      return { icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' }
    case 'action':
      return { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' }
    case 'result':
      return { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' }
    case 'nugget':
      return { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' }
    case 'tool':
      return { icon: Wrench, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' }
    case 'conclusion':
      return { icon: BookOpen, color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/30' }
    default:
      return { icon: List, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' }
  }
}

export function BlogTOC({ content }: BlogTOCProps) {
  const [sections, setSections] = useState<TOCSection[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [totalReadingTime, setTotalReadingTime] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [progress, setProgress] = useState(0)

  // Parse content and build TOC
  useEffect(() => {
    const lines = content.split('\n')
    const parsedSections: TOCSection[] = []
    let currentH2: TOCSection | null = null
    let sectionContent = ''
    let sectionStartIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const h2Match = line.match(/^##\s+(.+)$/)
      const h3Match = line.match(/^###\s+(.+)$/)

      if (h2Match || h3Match) {
        // Save previous section's reading time
        if (currentH2 && sectionContent) {
          currentH2.readingTime = calculateReadingTime(sectionContent)
          sectionContent = ''
        }

        if (h2Match) {
          const title = h2Match[1].trim()
          currentH2 = {
            id: `section-${parsedSections.length}`,
            title,
            level: 2,
            type: detectSectionType(title),
            readingTime: 0,
            children: [],
          }
          parsedSections.push(currentH2)
          sectionStartIndex = i
        } else if (h3Match && currentH2) {
          const title = h3Match[1].trim()
          const child: TOCSection = {
            id: `section-${parsedSections.length - 1}-${currentH2.children!.length}`,
            title,
            level: 3,
            type: detectSectionType(title),
            readingTime: 0,
          }
          currentH2.children!.push(child)
        }
      } else {
        sectionContent += line + '\n'
      }
    }

    // Calculate final section reading time
    if (currentH2 && sectionContent) {
      currentH2.readingTime = calculateReadingTime(sectionContent)
    }

    // Calculate total reading time
    const total = parsedSections.reduce((sum, section) => sum + section.readingTime, 0)
    setTotalReadingTime(total)
    setSections(parsedSections)
  }, [content])

  // Track active section and progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120
      const articleContent = document.querySelector('article .prose')
      if (!articleContent) return

      const headings = articleContent.querySelectorAll('h2, h3')
      if (headings.length === 0) return

      let currentIndex = 0
      let foundActive = false

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i] as HTMLElement
        if (heading.offsetTop <= scrollPosition) {
          currentIndex = i
          foundActive = true
        }
      }

      if (foundActive && headings[currentIndex]) {
        const activeId = headings[currentIndex].id
        setActiveSection(activeId)

        // Calculate progress
        const progressPercent = ((currentIndex + 1) / headings.length) * 100
        setProgress(progressPercent)

        // Calculate time remaining
        // Handle both H2 and H3 sections
        let currentSectionIndex = sections.findIndex(s => s.id === activeId)

        // If not found in H2s, check if it's an H3
        if (currentSectionIndex < 0) {
          // Extract H2 index from H3 id (e.g., "section-2-1" -> 2)
          const h2Index = activeId.split('-')[1]
          if (h2Index) {
            currentSectionIndex = Number.parseInt(h2Index, 10)
          }
        }

        if (currentSectionIndex >= 0) {
          const remainingSections = sections.slice(currentSectionIndex + 1)
          const remaining = remainingSections.reduce((sum, s) => sum + s.readingTime, 0)
          setTimeRemaining(remaining)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Add IDs to headings
  useEffect(() => {
    // Wait a bit for content to render
    const timer = setTimeout(() => {
      const articleContent = document.querySelector('article .prose')
      if (!articleContent) return

      const headings = articleContent.querySelectorAll('h2, h3')
      let h2Index = 0
      let h3Index = 0

      for (const heading of headings) {
        if (heading.tagName === 'H2') {
          heading.id = `section-${h2Index}`
          h2Index++
          h3Index = 0
        } else if (heading.tagName === 'H3') {
          heading.id = `section-${h2Index - 1}-${h3Index}`
          h3Index++
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [content])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  const scrollToSection = (id: string) => {
    console.log('[BlogTOC] scrollToSection called with ID:', id)
    const element = document.getElementById(id)

    if (element) {
      console.log('[BlogTOC] Element found:', element.tagName, element.textContent?.substring(0, 50))

      // Get element's absolute position from top of page
      const elementTop = element.getBoundingClientRect().top + window.scrollY
      // Apply offset for fixed header
      const offset = 120
      const targetPosition = elementTop - offset

      console.log('[BlogTOC] Scrolling from', window.scrollY, 'to', targetPosition)

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
      setIsOpen(false)
    } else {
      console.warn(`[BlogTOC] Could not find element with ID: ${id}`)

      // Debug: show all headings with their IDs
      const allHeadings = document.querySelectorAll('article .prose h2, article .prose h3')
      console.log('[BlogTOC] Available headings:')
      for (const heading of allHeadings) {
        console.log(` - ID: "${heading.id}", Text: "${heading.textContent?.substring(0, 40)}"`)
      }
    }
  }

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return '< 1 min'
    const minutes = Math.ceil(seconds / 60)
    return `${minutes} min`
  }

  if (sections.length === 0) return null

  return (
    <>
      {/* Mobile: Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        type="button"
        aria-label="Open table of contents"
      >
        <div className="relative">
          {/* Progress ring */}
          <svg className="w-16 h-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-800"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="text-brand-teal transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>

          {/* Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-brand-teal flex items-center justify-center shadow-lg shadow-brand-teal/50">
              <List className="h-6 w-6 text-gray-900" />
            </div>
          </div>

          {/* Progress badge */}
          <div className="absolute -top-1 -right-1 bg-brand-teal text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {Math.round(progress)}%
          </div>
        </div>
      </motion.button>

      {/* Mobile: Slide-up Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-gray-900 rounded-t-3xl shadow-2xl lg:hidden max-h-[85vh] flex flex-col"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-brand-teal" />
                  <h3 className="text-lg font-bold text-white">Table of Contents</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  type="button"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Reading Progress</span>
                  <div className="flex items-center gap-2 text-brand-teal font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeRemaining)} left</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-teal to-brand-teal/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>{Math.round(progress)}% complete</span>
                  <span>{formatTime(totalReadingTime)} total</span>
                </div>
              </div>

              {/* Sections list */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-2">
                  {sections.map((section) => {
                    const style = getSectionStyle(section.type)
                    const Icon = style.icon
                    const isActive = activeSection === section.id
                    const hasChildren = section.children && section.children.length > 0
                    const isExpanded = expandedSections.has(section.id)

                    return (
                      <div key={section.id}>
                        {/* H2 Section */}
                        <button
                          onClick={() => {
                            if (hasChildren) {
                              toggleSection(section.id)
                            } else {
                              scrollToSection(section.id)
                            }
                          }}
                          className={`
                            w-full flex items-center gap-3 p-3 rounded-lg transition-all
                            ${isActive ? `${style.bg} border ${style.border}` : 'hover:bg-white/5'}
                          `}
                          type="button"
                        >
                          <Icon className={`h-5 w-5 flex-shrink-0 ${style.color}`} />
                          <div className="flex-1 text-left">
                            <div className={`font-medium ${isActive ? style.color : 'text-gray-300'}`}>
                              {section.title}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{formatTime(section.readingTime)}</span>
                            {hasChildren && (
                              <div className="text-gray-400">
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </div>
                            )}
                          </div>
                        </button>

                        {/* H3 Subsections */}
                        <AnimatePresence>
                          {hasChildren && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-800 pl-4">
                                {section.children!.map((child) => {
                                  const childActive = activeSection === child.id
                                  return (
                                    <button
                                      key={child.id}
                                      onClick={() => scrollToSection(child.id)}
                                      className={`
                                        w-full text-left p-2 rounded text-sm transition-colors
                                        ${childActive ? 'text-brand-teal bg-brand-teal/10' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'}
                                      `}
                                      type="button"
                                    >
                                      {child.title}
                                    </button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-teal text-gray-900 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
                  type="button"
                >
                  <ArrowUp className="h-4 w-4" />
                  Back to Top
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop: Sticky Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed left-8 top-32 w-80 max-h-[calc(100vh-10rem)] overflow-y-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-brand-teal" />
              <h2 className="text-xl font-bold text-white">Contents</h2>
            </div>

            {/* Progress */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <div className="flex items-center gap-2 text-brand-teal font-medium">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeRemaining)} left</span>
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-teal to-brand-teal/50"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-2">
              {sections.map((section) => {
                const style = getSectionStyle(section.type)
                const Icon = style.icon
                const isActive = activeSection === section.id
                const hasChildren = section.children && section.children.length > 0
                const isExpanded = expandedSections.has(section.id) || isActive

                return (
                  <div key={section.id}>
                    <button
                      onClick={() => {
                        scrollToSection(section.id)
                        if (hasChildren) toggleSection(section.id)
                      }}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left
                        ${isActive ? `${style.bg} border ${style.border}` : 'hover:bg-white/5'}
                      `}
                      type="button"
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${style.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${isActive ? style.color : 'text-gray-300'}`}>
                          {section.title}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(section.readingTime)}</span>
                    </button>

                    {/* Subsections */}
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-7 mt-1 space-y-1">
                            {section.children!.map((child) => {
                              const childActive = activeSection === child.id
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => scrollToSection(child.id)}
                                  className={`
                                    w-full text-left p-2 rounded text-sm transition-colors
                                    ${childActive ? 'text-brand-teal' : 'text-gray-400 hover:text-gray-300'}
                                  `}
                                  type="button"
                                >
                                  {child.title}
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
