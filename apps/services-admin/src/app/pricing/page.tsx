'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface PricingStats {
  totalConfigs: number
  meetingTypes: number
  serviceTiers: number
  newsletterTiers: number
  depositTypes: number
}

export default function PricingAdminPage() {
  const [stats, setStats] = useState<PricingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/pricing/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to load pricing stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pricing Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage pricing for meetings, services, newsletters, and deposits
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Meeting Types"
            value={stats?.meetingTypes || 0}
            subtitle="Pricing configs"
            color="blue"
            icon="📅"
          />
          <StatCard
            title="Service Tiers"
            value={stats?.serviceTiers || 0}
            subtitle="Unlockable services"
            color="green"
            icon="🔓"
          />
          <StatCard
            title="Newsletter Tiers"
            value={stats?.newsletterTiers || 0}
            subtitle="Subscription levels"
            color="purple"
            icon="📰"
          />
          <StatCard
            title="Deposit Types"
            value={stats?.depositTypes || 0}
            subtitle="Refundable deposits"
            color="orange"
            icon="💰"
          />
        </div>

        {/* Pricing Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingCategoryCard
            title="Meeting Types"
            description="Configure pricing for different meeting durations and types"
            icon="📅"
            count={stats?.meetingTypes || 0}
            href="/pricing/meetings"
            examples={['Quick Chat (15 min)', 'Discovery Call (30 min)', 'Strategy Session (60 min)']}
          />

          <PricingCategoryCard
            title="Service Access Tiers"
            description="Manage pricing for gated services and content"
            icon="🔓"
            count={stats?.serviceTiers || 0}
            href="/pricing/services"
            examples={['Unlock All Pricing', 'Premium Content Access']}
          />

          <PricingCategoryCard
            title="Newsletter Subscriptions"
            description="Set pricing for newsletter subscription tiers"
            icon="📰"
            count={stats?.newsletterTiers || 0}
            href="/pricing/newsletter"
            examples={['Free', 'Premium ($14.99/mo)', 'Founding Member ($300 lifetime)']}
          />

          <PricingCategoryCard
            title="Service Deposits"
            description="Configure refundable deposits for various services"
            icon="💰"
            count={stats?.depositTypes || 0}
            href="/pricing/deposits"
            examples={['Fractional CTO Deposit', 'Case Study Deposit', 'Technical Writing Deposit']}
          />
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Pricing System Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                💡 Multi-Currency Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Each pricing config supports SOL, BTC, ETH, and USD. Update prices across all currencies or set individual values.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔄 Instant Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Changes to pricing are reflected immediately across the website and all payment flows.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🎯 Active/Inactive
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Toggle pricing configs on/off without deleting them. Inactive configs won't show to users.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ⭐ Popular Items
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mark items as "popular" to highlight them in pricing displays and increase conversions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: {
  title: string
  value: number
  subtitle: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  icon: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  }

  return (
    <div className={`rounded-lg border-2 ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  )
}

function PricingCategoryCard({
  title,
  description,
  icon,
  count,
  href,
  examples,
}: {
  title: string
  description: string
  icon: string
  count: number
  href: string
  examples: string[]
}) {
  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all border-2 border-transparent hover:border-black dark:hover:border-white p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{icon}</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="bg-black dark:bg-white text-white dark:text-black text-sm font-bold px-3 py-1 rounded-full">
          {count}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">EXAMPLES:</p>
        <ul className="space-y-1">
          {examples.map((example) => (
            <li key={example} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <span className="text-gray-400">•</span>
              {example}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-black dark:text-white font-medium flex items-center gap-2">
        Manage Pricing →
      </div>
    </Link>
  )
}
