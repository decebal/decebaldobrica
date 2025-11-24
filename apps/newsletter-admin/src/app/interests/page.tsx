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
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-100 to-pink-100 dark:from-violet-950 dark:via-fuchsia-950 dark:to-pink-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Plan Interest Tracker 🎯
          </h1>
          <p className="text-foreground/70 text-lg">
            Users interested in premium newsletter plans
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-border hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-semibold mb-1">
              Total Interests
            </p>
            <p className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-violet-500 bg-clip-text text-transparent">
              {stats.total}
            </p>
          </div>

          <div className="group bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-border hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-semibold mb-1">Premium</p>
            <p className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {stats.premium}
            </p>
          </div>

          <div className="group bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-border hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-lg">
                <Badge className="bg-white/20 text-white border-white/30">★</Badge>
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-semibold mb-1">Founding</p>
            <p className="text-4xl font-bold bg-gradient-to-br from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              {stats.founding}
            </p>
          </div>

          <div className="group bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-border hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-semibold mb-1">Notified</p>
            <p className="text-4xl font-bold bg-gradient-to-br from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {stats.notified}
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="font-semibold"
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filter === 'premium' ? 'default' : 'outline'}
                onClick={() => setFilter('premium')}
                className="font-semibold"
              >
                💎 Premium ({stats.premium})
              </Button>
              <Button
                variant={filter === 'founding' ? 'default' : 'outline'}
                onClick={() => setFilter('founding')}
                className="font-semibold"
              >
                ⭐ Founding ({stats.founding})
              </Button>
            </div>

            <Button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold shadow-lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Interests Table */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent" />
              <p className="mt-4 text-muted-foreground font-medium">Loading interests...</p>
            </div>
          ) : filteredInterests.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground font-medium">No interests registered yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 border-b border-border">
                  <TableHead className="text-foreground font-bold">Email</TableHead>
                  <TableHead className="text-foreground font-bold">Plan</TableHead>
                  <TableHead className="text-foreground font-bold">Registered</TableHead>
                  <TableHead className="text-foreground font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterests.map((interest) => (
                  <TableRow key={interest.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors border-b border-border">
                    <TableCell className="font-semibold text-foreground">{interest.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          interest.plan_id === 'premium'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 font-semibold'
                            : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-0 font-semibold'
                        }
                      >
                        {interest.plan_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-medium">
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
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-semibold">
                          ✓ Notified
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-semibold">
                          ⏳ Pending
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
