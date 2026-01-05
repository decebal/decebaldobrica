'use client'

import { Button } from '@decebal/ui/button'
import { cn } from '@decebal/ui/lib/utils'
import { Blocks, Brain, ChevronDown, ChevronRight, Menu, Terminal, Users, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import UserMenu from './UserMenu'

const expertiseLinks = [
  {
    href: '/about',
    label: 'Engineering Leadership',
    icon: Users,
    description: 'Fractional CTO & Team Strategy',
  },
  {
    href: '/ai',
    label: 'AI Engineering',
    icon: Brain,
    description: 'GenAI, RAG & LLM Integration',
  },
  {
    href: '/rust',
    label: 'Rust Development',
    icon: Terminal,
    description: 'High-Performance Backend Systems',
  },
  {
    href: '/smart-contracts',
    label: 'Smart Contracts',
    icon: Blocks,
    description: 'Blockchain & DeFi Solutions',
  },
]

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expertiseOpen, setExpertiseOpen] = useState(false)
  const expertiseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close expertise dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expertiseRef.current && !expertiseRef.current.contains(event.target as Node)) {
        setExpertiseOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-brand-darknavy/80 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-brand-teal">
            Decebal<span className="text-brand-heading">Dobrica</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="brand-nav-link">
            Home
          </Link>

          {/* Expertise Dropdown */}
          <div ref={expertiseRef} className="relative">
            <button
              type="button"
              onClick={() => setExpertiseOpen(!expertiseOpen)}
              className="brand-nav-link flex items-center gap-1"
            >
              Expertise
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', expertiseOpen && 'rotate-180')}
              />
            </button>
            {expertiseOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-brand-darknavy/95 backdrop-blur-md rounded-lg border border-brand-teal/20 shadow-xl p-2">
                {expertiseLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setExpertiseOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-white/5 transition-colors group"
                  >
                    <link.icon className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-heading font-medium group-hover:text-brand-teal transition-colors">
                        {link.label}
                      </div>
                      <div className="text-xs text-white/60">{link.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/work" className="brand-nav-link">
            Case Studies
          </Link>
          <Link href="/services" className="brand-nav-link">
            Services
          </Link>
          <Link href="/testimonials" className="brand-nav-link">
            Testimonials
          </Link>
          <Link href="/blog" className="brand-nav-link">
            Blog
          </Link>
          <UserMenu />
          <Link href="/contact" className="brand-btn-primary flex items-center">
            <span>Talk With Me</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden text-brand-heading"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-darknavy/95 backdrop-blur-md shadow-lg absolute top-full left-0 right-0 p-4 border-t border-brand-teal/20">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors"
            >
              Home
            </Link>

            {/* Expertise Section */}
            <div className="border-t border-white/10 pt-2">
              <p className="text-xs uppercase tracking-wider text-white/50 px-2 mb-2">Expertise</p>
              {expertiseLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors"
                >
                  <link.icon className="w-4 h-4 text-brand-teal" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2">
              <Link
                href="/work"
                onClick={closeMobileMenu}
                className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors block"
              >
                Case Studies
              </Link>
              <Link
                href="/services"
                onClick={closeMobileMenu}
                className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors block"
              >
                Services
              </Link>
              <Link
                href="/testimonials"
                onClick={closeMobileMenu}
                className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors block"
              >
                Testimonials
              </Link>
              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors block"
              >
                Blog
              </Link>
            </div>

            <div onClick={closeMobileMenu} className="border-t border-white/10 pt-2">
              <UserMenu />
            </div>
            <Link href="/contact" onClick={closeMobileMenu} className="w-full">
              <Button className="w-full bg-brand-teal hover:bg-brand-teal/90">Talk With Me</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
