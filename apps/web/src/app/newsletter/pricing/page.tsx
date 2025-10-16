'use client'

import { CryptoPaymentSelector } from '@/components/CryptoPaymentSelector'
import { InterestModal } from '@/components/InterestModal'
import { isFeatureEnabled } from '@/lib/featureFlags'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

interface PricingTier {
  id: 'free' | 'premium' | 'founding'
  name: string
  price: string
  priceUsd: number
  interval: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceUsd: 0,
    interval: '/forever',
    description: 'Get weekly insights delivered to your inbox',
    features: [
      'Weekly newsletter with latest articles',
      'Curated tech insights and tips',
      'Access to free content',
      'No spam, unsubscribe anytime',
    ],
    cta: 'Subscribe for Free',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$14.99',
    priceUsd: 14.99,
    interval: '/month',
    description: 'Unlock exclusive content and deep dives',
    features: [
      'All free benefits',
      'Exclusive premium content and tutorials',
      'In-depth technical deep dives',
      'Code examples and projects',
      'Early access to new articles',
      'Priority email support',
    ],
    cta: 'Upgrade to Premium',
    highlighted: true,
  },
  {
    id: 'founding',
    name: 'Founding Member',
    price: '$300',
    priceUsd: 300,
    interval: '/lifetime',
    description: 'One-time payment for lifetime access',
    features: [
      'All premium benefits',
      'Lifetime access - pay once, access forever',
      'Direct access for questions',
      'Founding member community',
      'Your name in supporters list (optional)',
      '1:1 consultation call (60 min)',
    ],
    cta: 'Become a Founding Member',
  },
]

function PricingContent() {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [highlightedTier, setHighlightedTier] = useState<string | null>(null)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [interestPlan, setInterestPlan] = useState<{ id: 'premium' | 'founding'; name: string }>()
  const searchParams = useSearchParams()
  const freeTierRef = useRef<HTMLDivElement>(null)

  // Auto-highlight and scroll to free tier if coming from welcome email
  useEffect(() => {
    const tier = searchParams.get('tier')
    if (tier === 'free') {
      setHighlightedTier('free')
      // Scroll to free tier after a brief delay
      setTimeout(() => {
        freeTierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [searchParams])

  const handleSelectTier = (tier: PricingTier) => {
    if (tier.id === 'free') {
      // Redirect to free signup
      window.location.href = '/blog#newsletter'
      return
    }

    // Check if the plan is enabled via feature flags
    const isPremiumEnabled = tier.id === 'premium' && isFeatureEnabled('premiumSubscriptionsEnabled')
    const isFoundingEnabled = tier.id === 'founding' && isFeatureEnabled('foundingMemberEnabled')

    if (isPremiumEnabled || isFoundingEnabled) {
      // Plan is enabled, proceed with payment
      setSelectedTier(tier)
    } else {
      // Plan is coming soon, show interest modal
      setInterestPlan({ id: tier.id as 'premium' | 'founding', name: tier.name })
      setShowInterestModal(true)
    }
  }

  const handlePaymentSuccess = async (paymentData: {
    paymentId: string
    chain: string
    amount: number
  }) => {
    // After payment is confirmed, upgrade the subscriber
    try {
      const response = await fetch('/api/newsletter/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier?.id,
          paymentId: paymentData.paymentId,
          chain: paymentData.chain,
          amount: paymentData.amount,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to success page
        window.location.href = '/newsletter/success'
      } else {
        alert('Payment verified but upgrade failed. Please contact support.')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('An error occurred. Please contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get insights on software engineering, web development, and building products. Pay with
            crypto or fiat.
          </p>
        </div>

        {selectedTier ? (
          /* Payment Modal */
          <div className="max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setSelectedTier(null)}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
            >
              ← Back to pricing
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedTier.name} Subscription
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedTier.description}</p>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedTier.price}
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                    {selectedTier.interval}
                  </span>
                </div>
              </div>

              <CryptoPaymentSelector
                amount={selectedTier.priceUsd}
                onSuccess={handlePaymentSuccess}
                metadata={{
                  type: 'newsletter_subscription',
                  tier: selectedTier.id,
                }}
              />
            </div>
          </div>
        ) : (
          /* Pricing Tiers */
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                ref={tier.id === 'free' ? freeTierRef : null}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  tier.highlighted ? 'ring-4 ring-black dark:ring-white scale-105 md:scale-110' : ''
                } ${
                  highlightedTier === tier.id
                    ? 'ring-4 ring-brand-teal dark:ring-brand-teal animate-pulse'
                    : ''
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black px-4 py-1 text-sm font-medium">
                    Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[48px]">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{tier.interval}</span>
                  </div>

                  {/* Coming Soon Badge */}
                  {tier.id !== 'free' &&
                    ((tier.id === 'premium' && !isFeatureEnabled('premiumSubscriptionsEnabled')) ||
                      (tier.id === 'founding' && !isFeatureEnabled('foundingMemberEnabled'))) && (
                      <div className="flex justify-center mb-3">
                        <span className="inline-block bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          Coming Soon
                        </span>
                      </div>
                    )}

                  <button
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mb-6 ${
                      tier.highlighted
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                        : 'border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tier.cta}
                  </button>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          role="img"
                          aria-label="Checkmark"
                        >
                          <title>Checkmark</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        {!selectedTier && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept cryptocurrency (SOL, BTC, ETH, USDC) with ultra-low fees, as well as
                  traditional fiat payments (USD, EUR, GBP).
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Premium subscriptions can be cancelled anytime. Founding members get lifetime
                  access with a one-time payment.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Is my email address safe?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely. We never share your email with third parties. You can unsubscribe
                  anytime with a single click.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        {!selectedTier && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Blog
            </Link>
          </div>
        )}
      </div>

      {/* Interest Modal */}
      {interestPlan && (
        <InterestModal
          isOpen={showInterestModal}
          onClose={() => {
            setShowInterestModal(false)
            setInterestPlan(undefined)
          }}
          planName={interestPlan.name}
          planId={interestPlan.id}
        />
      )}
    </div>
  )
}

export default function NewsletterPricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-teal border-r-transparent" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pricing...</p>
          </div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  )
}
