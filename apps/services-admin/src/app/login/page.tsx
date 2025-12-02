'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Authentication failed')
        setLoading(false)
        return
      }

      // Check if user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .eq('is_active', true)
        .single()

      if (adminError || !adminUser) {
        await supabase.auth.signOut()
        setError('You do not have admin access to this dashboard')
        setLoading(false)
        return
      }

      // Record login
      await supabase.rpc('record_admin_login', { user_id: data.user.id })

      // Redirect to dashboard
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
      // Note: If successful, the browser will redirect to Google
    } catch (err) {
      console.error('Google login error:', err)
      setError('Failed to initiate Google sign-in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-cyan-950 dark:via-teal-950 dark:to-emerald-950 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-2xl shadow-teal-500/20 mb-6">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Services Admin
          </h2>
          <p className="text-foreground/70 text-lg">Sign in to manage pricing and services</p>
        </div>

        {/* Login Form */}
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none transition-colors placeholder:text-muted-foreground"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-3"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none transition-colors placeholder:text-muted-foreground"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg overflow-hidden ${
                loading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white hover:scale-105 shadow-teal-500/20'
              }`}
            >
              {!loading && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 via-emerald-600 via-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'rainbow-shimmer 3s linear infinite',
                  }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div
                className="w-full border-t-2 border-gradient-to-r from-transparent via-teal-200 to-transparent dark:via-teal-800/50"
                style={{
                  borderImage:
                    'linear-gradient(to right, transparent, rgb(153 246 228), transparent) 1',
                }}
              />
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 py-2 bg-gradient-to-br from-cyan-50/90 to-teal-50/90 dark:from-cyan-950/90 dark:to-teal-950/90 backdrop-blur-sm text-sm font-semibold text-teal-700 dark:text-teal-300 rounded-full border-2 border-teal-200/50 dark:border-teal-800/50 shadow-lg shadow-teal-500/10">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg bg-background border-2 border-input text-foreground hover:border-teal-400 dark:hover:border-teal-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-teal-100 via-emerald-100 to-cyan-100 dark:from-cyan-950 dark:via-teal-950 dark:to-cyan-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundSize: '200% 100%',
                animation: 'rainbow-shimmer 3s linear infinite',
              }}
            />
            <div className="relative z-10 flex items-center justify-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </div>
          </button>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-center text-muted-foreground">
              Admin access only. Contact your administrator if you need access.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full border border-teal-200 dark:border-teal-800/30">
            <svg
              className="h-4 w-4 text-teal-600 dark:text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
              Protected by Supabase Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
