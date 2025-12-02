'use client'

import { newsletterApi } from '@/lib/api'
import { Download, Mail, Search, TrendingUp, UserCheck, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Subscriber {
  id: string
  email: string
  name?: string
  tier: 'free' | 'premium' | 'founding'
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  confirmed_at?: string
  created_at: string
}

type FilterTier = 'all' | 'free' | 'premium' | 'founding'
type FilterStatus = 'all' | 'pending' | 'active' | 'unsubscribed' | 'bounced'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTier, setFilterTier] = useState<FilterTier>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    async function loadSubscribers() {
      try {
        const data = await newsletterApi.getSubscribers({
          tier: filterTier !== 'all' ? filterTier : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
        })
        setSubscribers(data.subscribers || [])
      } catch (error) {
        console.error('Failed to load subscribers:', error)
      } finally {
        setLoading(false)
        setTimeout(() => setShowStats(true), 100)
      }
    }

    loadSubscribers()
  }, [filterTier, filterStatus])

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.name?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'active').length,
    premium: subscribers.filter((s) => s.tier === 'premium').length,
    founding: subscribers.filter((s) => s.tier === 'founding').length,
    newThisMonth: subscribers.filter(
      (s) => new Date(s.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      case 'founding':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
      case 'unsubscribed':
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
      case 'bounced':
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
    }
  }

  const handleExport = () => {
    const csv = [
      ['Email', 'Name', 'Tier', 'Status', 'Joined'].join(','),
      ...filteredSubscribers.map((sub) =>
        [
          sub.email,
          sub.name || '',
          sub.tier,
          sub.status,
          new Date(sub.created_at).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading subscribers...</p>
        </div>
      </div>
    )
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                Subscriber Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {filteredSubscribers.length} subscriber{filteredSubscribers.length !== 1 ? 's' : ''}{' '}
                {search && 'matching your search'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            {
              title: 'Total Subscribers',
              value: stats.total,
              icon: <Users className="h-6 w-6" />,
              color: 'from-purple-500 to-violet-500',
              delay: '0s',
            },
            {
              title: 'Active',
              value: stats.active,
              icon: <UserCheck className="h-6 w-6" />,
              color: 'from-green-500 to-emerald-500',
              delay: '0.1s',
            },
            {
              title: 'Premium',
              value: stats.premium,
              icon: <TrendingUp className="h-6 w-6" />,
              color: 'from-blue-500 to-cyan-500',
              delay: '0.2s',
            },
            {
              title: 'Founding',
              value: stats.founding,
              icon: <Mail className="h-6 w-6" />,
              color: 'from-fuchsia-500 to-pink-500',
              delay: '0.3s',
            },
            {
              title: 'New This Month',
              value: stats.newThisMonth,
              icon: <UserPlus className="h-6 w-6" />,
              color: 'from-amber-500 to-orange-500',
              delay: '0.4s',
            },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 dark:border-purple-900/20 transform transition-all duration-500 hover:scale-105"
              style={{
                opacity: showStats ? 1 : 0,
                transform: showStats ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: stat.delay,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-purple-100 dark:border-purple-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label
                htmlFor="search-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Search Subscribers
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Email or name..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 dark:border-purple-800/50 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Tier Filter */}
            <div>
              <label
                htmlFor="tier-filter"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Filter by Tier
              </label>
              <select
                id="tier-filter"
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as FilterTier)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-800/50 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="founding">Founding</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-800/50 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-purple-900/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-100 dark:divide-purple-900/20">
              <thead className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 dark:divide-purple-900/20">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {search
                          ? 'No subscribers found matching your search'
                          : 'No subscribers yet'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {subscriber.name || '—'}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getTierBadgeColor(
                            subscriber.tier
                          )}`}
                        >
                          {subscriber.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(
                            subscriber.status
                          )}`}
                        >
                          {subscriber.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
