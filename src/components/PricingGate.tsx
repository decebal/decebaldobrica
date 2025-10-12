'use client'

import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Coffee, Lock, Mail, Unlock } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'

interface PricingGateProps {
  serviceName: string
  children: React.ReactNode
}

const PricingGate: React.FC<PricingGateProps> = ({ serviceName, children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)

  // Check if user has already unlocked pricing (stored in localStorage)
  useEffect(() => {
    const unlocked = localStorage.getItem('pricing_unlocked')
    const unlockedEmail = localStorage.getItem('pricing_email')
    if (unlocked === 'true' && unlockedEmail) {
      setIsUnlocked(true)
      setEmail(unlockedEmail)
    }
  }, [])

  const handleBuyMeCoffee = () => {
    // Scroll to footer where coffee payment is
    const footer = document.querySelector('footer')
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Highlight the coffee section
      const coffeeSection = footer.querySelector('.coffee-section')
      if (coffeeSection) {
        coffeeSection.classList.add('ring-2', 'ring-brand-teal', 'animate-pulse')
        setTimeout(() => {
          coffeeSection?.classList.remove('animate-pulse')
        }, 2000)
      }
    }
    // Show email form so they can unlock after sending
    setTimeout(() => {
      setShowEmailForm(true)
    }, 3000)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      // Store in localStorage
      localStorage.setItem('pricing_unlocked', 'true')
      localStorage.setItem('pricing_email', email)
      setIsUnlocked(true)

      // TODO: Send email to your system for lead tracking
      // You could call an API endpoint here to save the email
      console.log('Pricing unlocked for:', email)
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="brand-card p-12 rounded-lg">
          <div className="bg-brand-teal/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-brand-teal" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Premium Pricing • Serious Clients Only
          </h2>

          <p className="text-gray-300 mb-8 text-lg">
            My {serviceName} pricing is reserved for serious prospects. Send $5+ in ETH to my
            address (scroll to footer) to unlock transparent pricing and package details.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Why This Approach?</h3>
            <ul className="text-left text-gray-300 space-y-3">
              <li className="flex items-start">
                <span className="text-brand-teal mr-2">•</span>
                <span>Filters tire-kickers and respects my time (and yours)</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-teal mr-2">•</span>
                <span>Shows you're serious about investing in quality work</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-teal mr-2">•</span>
                <span>Pricing is premium and I work with clients who value expertise</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-teal mr-2">•</span>
                <span>Coffee keeps me caffeinated for your project 😊</span>
              </li>
            </ul>
          </div>

          {!showEmailForm ? (
            <div>
              <ShimmerButton className="px-8 py-4 text-lg mb-4" onClick={handleBuyMeCoffee}>
                <Coffee className="mr-2 h-5 w-5" />
                Scroll to Coffee Payment (Footer)
              </ShimmerButton>
              <p className="text-sm text-gray-400">
                Send $5+ in ETH, then return here and enter your email to unlock pricing
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-6 mb-6">
                <p className="text-brand-teal font-semibold mb-2">☕ Ready to unlock pricing?</p>
                <p className="text-sm text-gray-300">
                  After sending payment to the ETH address in the footer, enter your email below to
                  unlock pricing. Access is permanent and never expires.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white py-3"
                >
                  <Unlock className="mr-2 h-5 w-5" />
                  Unlock Pricing
                </Button>
              </form>

              <p className="text-xs text-gray-400 mt-4">
                Your email is only used to send you the pricing guide and occasional updates about
                my services. Unsubscribe anytime.
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-4">Not ready to unlock pricing?</p>
            <a href="/contact" className="text-brand-teal hover:text-brand-teal/80 underline">
              Schedule a free discovery call instead
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingGate
