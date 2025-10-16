'use client'

import { Button } from '@decebal/ui/button'
import { Input } from '@decebal/ui/input'
import { Mail, Sparkles, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

interface NewsletterSignupProps {
  variant?: 'inline' | 'featured' | 'minimal'
  showBenefits?: boolean
}

export function NewsletterSignup({
  variant = 'featured',
  showBenefits = true,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Check your email to confirm your subscription!')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }

  // Minimal variant (for sidebar or footer)
  if (variant === 'minimal') {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-brand-teal" />
          <h3 className="text-lg font-semibold text-white">Newsletter</h3>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Weekly insights on AI, Rust, and serverless architecture.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-teal hover:bg-brand-teal/80"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        {status === 'success' && <p className="text-sm text-brand-teal mt-3">{message}</p>}
        {status === 'error' && <p className="text-sm text-red-400 mt-3">{message}</p>}
      </div>
    )
  }

  // Inline variant (within blog post list)
  if (variant === 'inline') {
    return (
      <div className="bg-gradient-to-br from-brand-teal/10 via-brand-blue/5 to-brand-teal/10 backdrop-blur-sm rounded-lg p-8 border border-brand-teal/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-teal/20 mb-4">
            <Mail className="h-8 w-8 text-brand-teal" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Don't Miss New Posts</h3>
          <p className="text-gray-300 mb-6">
            Join 2,000+ developers getting weekly insights on AI engineering, Rust, and serverless
            architecture.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-brand-teal"
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="bg-brand-teal hover:bg-brand-teal/80 text-white font-semibold px-8"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          {status === 'success' && (
            <p className="text-brand-teal mt-4 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              {message}
            </p>
          )}
          {status === 'error' && <p className="text-red-400 mt-4">{message}</p>}
          <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    )
  }

  // Featured variant (main newsletter section)
  return (
    <div className="bg-gradient-to-br from-brand-darknavy via-brand-blue/20 to-brand-darknavy backdrop-blur-sm rounded-xl p-8 md:p-12 border border-brand-teal/30 shadow-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-teal/20 mb-6">
            <Mail className="h-10 w-10 text-brand-teal" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the Newsletter</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get weekly insights on AI engineering, Rust, serverless architecture, and technical
            leadership. Join 2,000+ developers building the future.
          </p>
        </div>

        {/* Benefits */}
        {showBenefits && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-brand-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Weekly Insights</h3>
                <p className="text-sm text-gray-300">
                  Practical, actionable content every Saturday morning
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-brand-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Deep Dives</h3>
                <p className="text-sm text-gray-300">
                  Technical tutorials, case studies, and architecture patterns
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-brand-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Join Community</h3>
                <p className="text-sm text-gray-300">
                  Connect with developers, CTOs, and tech leaders
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Form */}
        <form onSubmit={handleSubscribe} className="space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-brand-teal h-12"
            />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-brand-teal h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-teal hover:bg-brand-teal/80 text-white font-semibold h-12 text-lg"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe for Free'}
          </Button>

          {status === 'success' && (
            <div className="bg-brand-teal/20 border border-brand-teal/50 rounded-lg p-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-teal flex-shrink-0" />
              <p className="text-brand-teal">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">{message}</p>
            </div>
          )}

          <p className="text-sm text-center text-gray-400">
            No spam. Unsubscribe anytime. Read by 2,000+ developers.
          </p>
        </form>

        {/* Premium CTA */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-300 mb-4">
            Want exclusive deep dives, case studies, and code templates?
          </p>
          <a
            href="/newsletter#premium"
            className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-teal/80 font-semibold"
          >
            Learn about Premium
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
            >
              <title>Arrow Right Icon</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
