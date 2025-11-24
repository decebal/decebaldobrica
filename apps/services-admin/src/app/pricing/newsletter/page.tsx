'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface NewsletterPricing {
  id: string
  config_slug: string
  name: string
  description: string
  price_sol: number
  price_usd: number
  price_btc: number
  price_eth: number
  benefits: string[]
  metadata: {
    interval?: 'month' | 'lifetime' | 'forever'
    [key: string]: unknown
  }
  is_active: boolean
  is_popular: boolean
}

export default function NewsletterPricingPage() {
  const [tiers, setTiers] = useState<NewsletterPricing[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadTiers()
  }, [])

  async function loadTiers() {
    try {
      const response = await fetch('/api/pricing/newsletter')
      const data = await response.json()
      setTiers(data)
    } catch (error) {
      console.error('Failed to load newsletter tiers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    try {
      await fetch(`/api/pricing/newsletter/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentState }),
      })
      loadTiers()
    } catch (error) {
      console.error('Failed to toggle active state:', error)
    }
  }

  async function togglePopular(id: string, currentState: boolean) {
    try {
      await fetch(`/api/pricing/newsletter/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_popular: !currentState }),
      })
      loadTiers()
    } catch (error) {
      console.error('Failed to toggle popular state:', error)
    }
  }

  function formatInterval(interval?: string) {
    if (!interval || interval === 'forever') return 'Free Forever'
    if (interval === 'month') return 'Monthly'
    if (interval === 'lifetime') return 'Lifetime Access'
    return interval
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/pricing"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-block"
            >
              ← Back to Pricing
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Newsletter Tiers Pricing
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure pricing for newsletter subscription tiers
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            + Add Newsletter Tier
          </button>
        </div>

        {/* Tiers Grid */}
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 p-6 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <span className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {formatInterval(tier.metadata?.interval)}
                    </span>
                    {tier.is_popular && (
                      <span className="text-sm px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                        ⭐ Popular
                      </span>
                    )}
                    {!tier.is_active && (
                      <span className="text-sm px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{tier.description}</p>

                  {/* Pricing */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SOL Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {tier.price_sol?.toFixed(3) || '0.000'} SOL
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">USD Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${tier.price_usd?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">BTC Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {tier.price_btc?.toFixed(8) || '0.00000000'} BTC
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ETH Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {tier.price_eth?.toFixed(6) || '0.000000'} ETH
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  {tier.benefits && tier.benefits.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Includes:
                      </p>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(tier.id)}
                    className="px-4 py-2 text-sm border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(tier.id, tier.is_active)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      tier.is_active
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50'
                    }`}
                  >
                    {tier.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePopular(tier.id, tier.is_popular)}
                    className="px-4 py-2 text-sm border-2 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 font-medium rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  >
                    {tier.is_popular ? '⭐ Unmark' : 'Mark Popular'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tiers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No newsletter tiers found</p>
            <button
              type="button"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Add Your First Newsletter Tier
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
