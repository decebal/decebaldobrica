'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, List } from 'lucide-react'
import { Button } from '@decebal/ui/button'

interface TOCSection {
  id: string
  title: string
  level: number
}

interface BlogTOCProps {
  content: string
}

export function BlogTOC({ content }: BlogTOCProps) {
  const [sections, setSections] = useState<TOCSection[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const [showBackButton, setShowBackButton] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  // Parse headings from content
  useEffect(() => {
    const headingRegex = /^#{2,3}\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))

    const parsedSections = matches.map((match, index) => {
      const level = match[0].indexOf('###') === 0 ? 3 : 2
      const title = match[1].trim()
      const id = `section-${index}`

      return { id, title, level }
    })

    setSections(parsedSections)
  }, [content])

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      // Check if TOC is visible
      if (tocRef.current) {
        const rect = tocRef.current.getBoundingClientRect()
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
        setShowBackButton(!isVisible && window.scrollY > 300)
      }

      // Find active section based on scroll position
      const scrollPosition = window.scrollY + 100

      const headings = document.querySelectorAll('h2, h3')
      let currentSection = ''

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement
        if (element.offsetTop <= scrollPosition) {
          currentSection = `section-${index}`
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Add IDs to headings for navigation
  useEffect(() => {
    const headings = document.querySelectorAll('h2, h3')
    headings.forEach((heading, index) => {
      heading.id = `section-${index}`
    })
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (sections.length === 0) return null

  return (
    <>
      {/* Table of Contents - Timeline Style */}
      <div
        ref={tocRef}
        className="mb-12 bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-6">
          <List className="h-5 w-5 text-brand-teal" />
          <h2 className="text-2xl font-bold text-white">Table of Contents</h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-teal via-brand-teal/50 to-transparent" />

          {/* Timeline items */}
          <div className="space-y-4">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id
              const isH3 = section.level === 3

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    relative flex items-start gap-4 w-full text-left group transition-all
                    ${isH3 ? 'pl-8' : 'pl-0'}
                  `}
                  type="button"
                >
                  {/* Timeline dot */}
                  <div
                    className={`
                    relative z-10 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all
                    ${
                      isActive
                        ? 'bg-brand-teal border-brand-teal scale-125'
                        : 'bg-gray-900 border-brand-teal/50 group-hover:border-brand-teal group-hover:bg-brand-teal/20'
                    }
                  `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-brand-teal animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Section title */}
                  <div className="flex-1 pt-0.5">
                    <span
                      className={`
                      block transition-colors
                      ${isH3 ? 'text-sm' : 'text-base font-medium'}
                      ${
                        isActive
                          ? 'text-brand-teal'
                          : 'text-gray-400 group-hover:text-brand-teal'
                      }
                    `}
                    >
                      {section.title}
                    </span>
                    {isActive && (
                      <span className="block text-xs text-brand-teal/70 mt-1">
                        Currently reading
                      </span>
                    )}
                  </div>

                  {/* Section number */}
                  <span
                    className={`
                    text-xs font-mono transition-colors
                    ${
                      isActive
                        ? 'text-brand-teal'
                        : 'text-gray-600 group-hover:text-brand-teal/70'
                    }
                  `}
                  >
                    {index + 1}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Reading progress indicator */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Reading Progress</span>
            <span className="text-brand-teal font-medium">
              {sections.findIndex((s) => s.id === activeSection) + 1} / {sections.length}
            </span>
          </div>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-teal to-brand-teal/50 transition-all duration-300"
              style={{
                width: `${((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          type="button"
          aria-label="Back to table of contents"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-brand-teal/20 rounded-full blur-xl group-hover:bg-brand-teal/30 transition-all" />

            {/* Button */}
            <Button
              size="icon"
              className="
                relative w-14 h-14 rounded-full
                bg-brand-teal hover:bg-brand-teal/90
                text-gray-900 shadow-lg shadow-brand-teal/50
                transition-all duration-300
                group-hover:scale-110
              "
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </div>

          {/* Tooltip */}
          <div className="
            absolute bottom-full right-0 mb-2
            px-3 py-1.5 rounded-lg
            bg-gray-900 border border-brand-teal/30
            text-sm text-gray-300 whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
          ">
            Back to top
          </div>
        </button>
      )}
    </>
  )
}
