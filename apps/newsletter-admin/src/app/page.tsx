'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface NewsletterStats {
  totalSubscribers: number
  freeSubscribers: number
  premiumSubscribers: number
  foundingSubscribers: number
  totalIssues: number
  avgOpenRate: number
  avgClickRate: number
}

export default function NewsletterAdminPage() {
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/newsletter/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 dark:border-violet-800" />
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 absolute top-0 left-0" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-700 dark:via-purple-700 dark:to-fuchsia-700 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white">Newsletter Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Newsletter Dashboard
            </h1>
            <p className="text-purple-100 dark:text-purple-200 text-lg max-w-2xl">
              Manage your subscribers, compose engaging content, and track your newsletter's
              performance
            </p>
          </div>
        </div>

        {/* Quick Stats with Animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Subscribers"
            value={stats?.totalSubscribers || 0}
            gradient="from-blue-500 to-cyan-500"
            icon="👥"
            delay={0}
            trend="+12%"
          />
          <StatCard
            title="Premium"
            value={stats?.premiumSubscribers || 0}
            gradient="from-green-500 to-emerald-500"
            icon="💎"
            delay={100}
            subtitle={`+ ${stats?.foundingSubscribers || 0} founding`}
          />
          <StatCard
            title="Open Rate"
            value={`${stats?.avgOpenRate || 0}%`}
            gradient="from-purple-500 to-pink-500"
            icon="📧"
            delay={200}
          />
          <StatCard
            title="Total Issues"
            value={stats?.totalIssues || 0}
            gradient="from-orange-500 to-red-500"
            icon="📰"
            delay={300}
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main CTA - Compose Newsletter */}
          <Link
            href="/compose"
            className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-purple-900 to-fuchsia-900 dark:from-white dark:via-purple-100 dark:to-fuchsia-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                ✍️
              </div>
              <h2 className="text-3xl font-bold text-white dark:text-black mb-3">
                Compose Newsletter
              </h2>
              <p className="text-purple-200 dark:text-purple-800 mb-6 text-lg">
                Create and send engaging content to your subscribers
              </p>
              <div className="inline-flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-xl font-semibold group-hover:gap-4 transition-all">
                Start Writing
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Subscriber Growth Summary */}
          <div className="rounded-2xl bg-white/60 dark:bg-purple-900/60 backdrop-blur-xl border border-purple-200 dark:border-purple-700 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-purple-900 dark:text-white mb-4">
              Subscriber Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Free Tier
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats?.freeSubscribers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Premium
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats?.premiumSubscribers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Founding
                </span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {stats?.foundingSubscribers || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-white mb-4 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              title="Manage Subscribers"
              description="View, filter, and manage your newsletter audience"
              icon="👥"
              href="/subscribers"
              gradient="from-blue-500 to-cyan-600"
            />
            <ActionCard
              title="View Analytics"
              description="Track performance, engagement, and growth metrics"
              icon="📊"
              href="/analytics"
              gradient="from-purple-500 to-pink-600"
            />
            <ActionCard
              title="Newsletter Settings"
              description="Configure templates, branding, and preferences"
              icon="⚙️"
              href="/settings"
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white/60 dark:bg-purple-900/60 backdrop-blur-xl border border-purple-200 dark:border-purple-700 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-purple-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            Recent Activity
          </h3>
          <div className="space-y-2">
            <ActivityItem
              icon="👤"
              text="New subscriber: john@example.com"
              time="2 hours ago"
              color="blue"
            />
            <ActivityItem
              icon="📨"
              text='Newsletter sent: "Building with Next.js 15"'
              time="1 day ago"
              color="purple"
            />
            <ActivityItem
              icon="💎"
              text="Premium upgrade: sarah@example.com"
              time="2 days ago"
              color="green"
            />
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="rounded-2xl bg-white/60 dark:bg-purple-900/60 backdrop-blur-xl border border-purple-200 dark:border-purple-700 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-purple-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Newsletter Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Send newsletters consistently - weekly or bi-weekly schedules work best</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Personalize subject lines to improve open rates by 26%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>A/B test different content formats to understand what resonates</span>
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
  trend,
  subtitle,
}: {
  title: string
  value: string | number
  gradient: string
  icon: string
  delay: number
  trend?: string
  subtitle?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white dark:bg-purple-900 p-5 shadow-lg hover:shadow-xl transition-all duration-500 border border-purple-200 dark:border-purple-700 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <p
            className={`text-3xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
          >
            {value}
          </p>
          {trend && (
            <span
              className={`text-xs font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
            >
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
  )
}

function ActionCard({
  title,
  description,
  icon,
  href,
  gradient,
}: {
  title: string
  description: string
  icon: string
  href: string
  gradient: string
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-purple-900 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 dark:border-purple-700 hover:scale-[1.02]"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-bold text-purple-900 dark:text-white group-hover:text-white transition-colors mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-white/90 transition-colors mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-900 dark:text-white group-hover:text-white transition-colors group-hover:gap-3">
          Open
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  )
}

function ActivityItem({
  icon,
  text,
  time,
  color,
}: {
  icon: string
  text: string
  time: string
  color: 'blue' | 'purple' | 'green'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${colorClasses[color]} transition-all hover:scale-[1.01]`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</span>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">{time}</span>
    </div>
  )
}
