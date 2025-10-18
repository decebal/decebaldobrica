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

export default function ServicesAdminHome() {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-800" />
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white">System Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Services Admin Dashboard
            </h1>
            <p className="text-blue-100 dark:text-blue-200 text-lg max-w-2xl">
              Manage all pricing, services, and revenue streams from one powerful dashboard
            </p>
          </div>
        </div>

        {/* Quick Stats with Animations */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="Total Configs"
            value={stats?.totalConfigs || 0}
            gradient="from-slate-500 to-slate-700"
            icon="📊"
            delay={0}
          />
          <StatCard
            title="Meetings"
            value={stats?.meetingTypes || 0}
            gradient="from-blue-500 to-cyan-500"
            icon="📅"
            delay={100}
          />
          <StatCard
            title="Services"
            value={stats?.serviceTiers || 0}
            gradient="from-green-500 to-emerald-500"
            icon="🔓"
            delay={200}
          />
          <StatCard
            title="Newsletter"
            value={stats?.newsletterTiers || 0}
            gradient="from-purple-500 to-pink-500"
            icon="📰"
            delay={300}
          />
          <StatCard
            title="Deposits"
            value={stats?.depositTypes || 0}
            gradient="from-orange-500 to-red-500"
            icon="💰"
            delay={400}
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main CTA - Full Pricing Dashboard */}
          <Link
            href="/pricing"
            className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-slate-900 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                💰
              </div>
              <h2 className="text-3xl font-bold text-white dark:text-black mb-3">
                Pricing Dashboard
              </h2>
              <p className="text-slate-300 dark:text-slate-700 mb-6 text-lg">
                Configure and manage all pricing models in one place
              </p>
              <div className="inline-flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-xl font-semibold group-hover:gap-4 transition-all">
                Open Dashboard
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Quick Stats Summary */}
          <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Revenue Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Active Configs
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats?.totalConfigs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Service Types
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {(stats?.serviceTiers || 0) + (stats?.meetingTypes || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subscriptions
                </span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {stats?.newsletterTiers || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Categories */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 px-1">
            Pricing Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLinkCard
              title="Meeting Types"
              description="Configure pricing for consultations and sessions"
              href="/pricing/meetings"
              icon="📅"
              count={stats?.meetingTypes || 0}
              gradient="from-blue-500 to-cyan-600"
            />
            <QuickLinkCard
              title="Service Tiers"
              description="Manage service access levels and pricing"
              href="/pricing/services"
              icon="🔓"
              count={stats?.serviceTiers || 0}
              gradient="from-green-500 to-emerald-600"
            />
            <QuickLinkCard
              title="Newsletter Tiers"
              description="Set pricing for content subscriptions"
              href="/pricing/newsletter"
              icon="📰"
              count={stats?.newsletterTiers || 0}
              gradient="from-purple-500 to-pink-600"
            />
            <QuickLinkCard
              title="Service Deposits"
              description="Configure refundable project deposits"
              href="/pricing/deposits"
              icon="💰"
              count={stats?.depositTypes || 0}
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Tips & Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Review pricing regularly to stay competitive and maximize revenue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Use geo-pricing to adjust rates based on customer location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Monitor conversion rates across different pricing tiers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  gradient,
  icon,
  delay,
}: {
  title: string
  value: number
  gradient: string
  icon: string
  delay: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-5 shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-200 dark:border-slate-700 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
        </div>
        <p className={`text-3xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
          {value}
        </p>
      </div>
    </div>
  )
}

function QuickLinkCard({
  title,
  description,
  href,
  icon,
  count,
  gradient,
}: {
  title: string
  description: string
  href: string
  icon: string
  count: number
  gradient: string
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-[1.02]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div className={`bg-gradient-to-br ${gradient} text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg`}>
            {count}
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-white transition-colors mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-white/90 transition-colors mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-white transition-colors group-hover:gap-3">
          Manage
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  )
}
