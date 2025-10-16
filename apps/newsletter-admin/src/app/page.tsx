"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        const response = await fetch(`${baseUrl}/api/newsletter/stats`)
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to load stats:", error)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Newsletter Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage subscribers, compose newsletters, and view analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Subscribers"
            value={stats?.totalSubscribers || 0}
            trend="+12% this month"
            color="blue"
          />
          <StatCard
            title="Premium Subscribers"
            value={stats?.premiumSubscribers || 0}
            subtitle={`+ ${stats?.foundingSubscribers || 0} founding`}
            color="green"
          />
          <StatCard
            title="Open Rate"
            value={`${stats?.avgOpenRate || 0}%`}
            subtitle="Average across all issues"
            color="purple"
          />
          <StatCard
            title="Total Issues"
            value={stats?.totalIssues || 0}
            subtitle="Newsletters sent"
            color="orange"
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Manage Subscribers"
            description="View, filter, and manage your newsletter subscribers"
            icon="👥"
            href="/subscribers"
          />
          <ActionCard
            title="Compose Newsletter"
            description="Write and send newsletters to your subscribers"
            icon="✍️"
            href="/compose"
          />
          <ActionCard
            title="View Analytics"
            description="Track performance, engagement, and growth"
            icon="📊"
            href="/analytics"
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>New subscriber: john@example.com</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>Newsletter sent: "Building with Next.js 15"</span>
              <span>1 day ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>Premium upgrade: sarah@example.com</span>
              <span>2 days ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/compose"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Compose Newsletter
          </Link>
          <Link
            href="/subscribers"
            className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View Subscribers
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  trend,
  color,
}: {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  color: "blue" | "green" | "purple" | "orange"
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <span className={`text-sm px-2 py-1 rounded ${colorClasses[color]}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function ActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  )
}
