"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { newsletterApi } from "@/lib/api"

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

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await newsletterApi.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white" />
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Newsletter Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track performance, engagement, and revenue
          </p>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Subscribers"
            value={data.totalSubscribers}
            change={`+${data.monthlyGrowth}% this month`}
            changeType="positive"
          />
          <MetricCard
            title="Open Rate"
            value={`${data.avgOpenRate}%`}
            subtitle="Average"
          />
          <MetricCard
            title="Click Rate"
            value={`${data.avgClickRate}%`}
            subtitle="Average"
          />
          <MetricCard
            title="Issues Sent"
            value={data.totalIssues}
            subtitle="Total newsletters"
          />
        </div>

        {/* Subscriber Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Subscriber Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TierCard
              tier="Free"
              count={data.freeSubscribers}
              percentage={
                data.totalSubscribers > 0
                  ? (data.freeSubscribers / data.totalSubscribers) * 100
                  : 0
              }
              color="gray"
            />
            <TierCard
              tier="Premium"
              count={data.premiumSubscribers}
              percentage={
                data.totalSubscribers > 0
                  ? (data.premiumSubscribers / data.totalSubscribers) * 100
                  : 0
              }
              color="blue"
            />
            <TierCard
              tier="Founding"
              count={data.foundingSubscribers}
              percentage={
                data.totalSubscribers > 0
                  ? (data.foundingSubscribers / data.totalSubscribers) * 100
                  : 0
              }
              color="purple"
            />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Revenue Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Monthly Recurring Revenue (MRR)
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${data.revenue.mrr.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Annual Recurring Revenue (ARR)
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${data.revenue.arr.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeType,
}: {
  title: string
  value: string | number
  subtitle?: string
  change?: string
  changeType?: "positive" | "negative"
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
      {change && (
        <p
          className={`text-sm ${
            changeType === "positive"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  )
}

function TierCard({
  tier,
  count,
  percentage,
  color,
}: {
  tier: string
  count: number
  percentage: number
  color: "gray" | "blue" | "purple"
}) {
  const colorClasses = {
    gray: "bg-gray-100 dark:bg-gray-700",
    blue: "bg-blue-100 dark:bg-blue-900/20",
    purple: "bg-purple-100 dark:bg-purple-900/20",
  }

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {tier}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {count}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {percentage.toFixed(1)}% of total
      </p>
    </div>
  )
}
