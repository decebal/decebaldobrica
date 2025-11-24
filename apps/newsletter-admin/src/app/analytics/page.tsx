'use client'

import { newsletterApi } from '@/lib/api'
import {
  BarChart3,
  DollarSign,
  Mail,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface AnalyticsData {
  totalSubscribers: number
  freeSubscribers: number
  premiumSubscribers: number
  foundingSubscribers: number
  avgOpenRate: number
  avgClickRate: number
  totalIssues: number
  monthlyGrowth: number
  revenue: {
    mrr: number
    arr: number
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await newsletterApi.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
        setTimeout(() => setShowMetrics(true), 100)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const data = analytics || {
    totalSubscribers: 0,
    freeSubscribers: 0,
    premiumSubscribers: 0,
    foundingSubscribers: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
    totalIssues: 0,
    monthlyGrowth: 0,
    revenue: { mrr: 0, arr: 0 },
  }

  const totalPaidSubscribers = data.premiumSubscribers + data.foundingSubscribers
  const paidConversionRate =
    data.totalSubscribers > 0 ? (totalPaidSubscribers / data.totalSubscribers) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 inline-flex items-center gap-2 font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Newsletter Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Track performance, engagement, and revenue
          </p>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Subscribers',
              value: data.totalSubscribers.toLocaleString(),
              change: `+${data.monthlyGrowth}% this month`,
              icon: <Users className="h-6 w-6" />,
              color: 'from-purple-500 to-violet-500',
              positive: data.monthlyGrowth > 0,
              delay: '0s',
            },
            {
              title: 'Open Rate',
              value: `${data.avgOpenRate.toFixed(1)}%`,
              subtitle: 'Average',
              icon: <Mail className="h-6 w-6" />,
              color: 'from-blue-500 to-cyan-500',
              delay: '0.1s',
            },
            {
              title: 'Click Rate',
              value: `${data.avgClickRate.toFixed(1)}%`,
              subtitle: 'Average',
              icon: <MousePointerClick className="h-6 w-6" />,
              color: 'from-green-500 to-emerald-500',
              delay: '0.2s',
            },
            {
              title: 'Issues Sent',
              value: data.totalIssues,
              subtitle: 'Total newsletters',
              icon: <BarChart3 className="h-6 w-6" />,
              color: 'from-fuchsia-500 to-pink-500',
              delay: '0.3s',
            },
          ].map((metric) => (
            <div
              key={metric.title}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 dark:border-purple-900/20 transform transition-all duration-500 hover:scale-105"
              style={{
                opacity: showMetrics ? 1 : 0,
                transform: showMetrics ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: metric.delay,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} text-white shadow-lg`}
                >
                  {metric.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.title}</p>
              {metric.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500">{metric.subtitle}</p>
              )}
              {metric.change && (
                <div
                  className={`inline-flex items-center gap-1 text-sm font-medium ${
                    metric.positive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.positive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {metric.change}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Subscriber Breakdown */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8 border border-purple-100 dark:border-purple-900/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
            Subscriber Breakdown
          </h2>
          <div className="space-y-6">
            {[
              {
                tier: 'Free Tier',
                count: data.freeSubscribers,
                total: data.totalSubscribers,
                color: 'bg-gray-500',
                bgColor: 'bg-gray-100 dark:bg-gray-700',
              },
              {
                tier: 'Premium',
                count: data.premiumSubscribers,
                total: data.totalSubscribers,
                color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
              },
              {
                tier: 'Founding Members',
                count: data.foundingSubscribers,
                total: data.totalSubscribers,
                color: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20',
              },
            ].map((tier) => {
              const percentage = tier.total > 0 ? (tier.count / tier.total) * 100 : 0
              return (
                <div key={tier.tier}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {tier.tier}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tier.count.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${tier.color} transition-all duration-1000 ease-out`}
                      style={{
                        width: showMetrics ? `${percentage}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Conversion Rate */}
          <div className="mt-8 pt-8 border-t border-purple-100 dark:border-purple-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Paid Conversion Rate
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalPaidSubscribers} of {data.totalSubscribers} total subscribers
                </p>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {paidConversionRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Revenue Metrics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800/30">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                Monthly Recurring Revenue (MRR)
              </p>
              <p className="text-4xl font-bold text-green-900 dark:text-green-300">
                ${data.revenue.mrr.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                From {totalPaidSubscribers} paid subscriber
                {totalPaidSubscribers !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800/30">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                Annual Recurring Revenue (ARR)
              </p>
              <p className="text-4xl font-bold text-blue-900 dark:text-blue-300">
                ${data.revenue.arr.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                Projected annual revenue
              </p>
            </div>
          </div>
        </div>

        {/* Engagement Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/30">
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-4">
            💡 Engagement Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-400">
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Industry average open rate: 21.5% - aim to beat it!
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              A/B test subject lines for better open rates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Send newsletters on Tuesdays or Wednesdays
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Keep emails under 500 words for better engagement
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
