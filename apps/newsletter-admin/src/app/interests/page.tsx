'use client'

import { getSupabaseAdmin } from '@decebal/database'
import { Badge } from '@decebal/ui/badge'
import { Button } from '@decebal/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@decebal/ui/table'
import { Download, Mail, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PlanInterest {
  id: string
  email: string
  plan_id: string
  plan_name: string
  created_at: string
  notified_at: string | null
}

export default function InterestsPage() {
  const [interests, setInterests] = useState<PlanInterest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'premium' | 'founding'>('all')

  useEffect(() => {
    fetchInterests()
  }, [])

  const fetchInterests = async () => {
    try {
      const response = await fetch('/api/admin/interests')
      const data = await response.json()
      setInterests(data.interests || [])
    } catch (error) {
      console.error('Failed to fetch interests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInterests = interests.filter((interest) => {
    if (filter === 'all') return true
    return interest.plan_id === filter
  })

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Plan', 'Registered At', 'Notified'],
      ...filteredInterests.map((i) => [
        i.email,
        i.plan_name,
        new Date(i.created_at).toLocaleString(),
        i.notified_at ? 'Yes' : 'No',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plan-interests-${filter}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    total: interests.length,
    premium: interests.filter((i) => i.plan_id === 'premium').length,
    founding: interests.filter((i) => i.plan_id === 'founding').length,
    notified: interests.filter((i) => i.notified_at).length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Plan Interest Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Users interested in premium newsletter plans
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Interests
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <Users className="h-12 w-12 text-brand-teal" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.premium}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Premium
              </Badge>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Founding</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.founding}
                </p>
              </div>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Founding
              </Badge>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notified</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.notified}
                </p>
              </div>
              <Mail className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filter === 'premium' ? 'default' : 'outline'}
                onClick={() => setFilter('premium')}
              >
                Premium ({stats.premium})
              </Button>
              <Button
                variant={filter === 'founding' ? 'default' : 'outline'}
                onClick={() => setFilter('founding')}
              >
                Founding ({stats.founding})
              </Button>
            </div>

            <Button onClick={exportToCSV} className="bg-brand-teal hover:bg-brand-teal/80">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Interests Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-teal border-r-transparent" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading interests...</p>
            </div>
          ) : filteredInterests.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">No interests registered yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell className="font-medium">{interest.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          interest.plan_id === 'premium'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }
                      >
                        {interest.plan_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(interest.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {interest.notified_at ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Notified
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
