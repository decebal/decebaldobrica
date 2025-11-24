'use client'

import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, Shield } from 'lucide-react'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-2xl shadow-purple-500/20 mb-6">
            <Mail className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Newsletter Admin
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Sign in to manage subscribers and newsletters
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-100 dark:border-purple-900/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 animate-shake">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <Mail className="h-4 w-4 text-purple-500" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-800/50 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors placeholder:text-gray-400"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <Lock className="h-4 w-4 text-purple-500" />
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-800/50 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors placeholder:text-gray-400"
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
                  : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white hover:scale-105 shadow-purple-500/20'
              }`}
            >
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 via-pink-600 via-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rainbow-shimmer" style={{
                  backgroundSize: '200% 100%',
                  animation: 'rainbow-shimmer 3s linear infinite'
                }} />
              )}
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-gradient-to-r from-transparent via-purple-200 to-transparent dark:via-purple-800/50" style={{
                borderImage: 'linear-gradient(to right, transparent, rgb(216 180 254), transparent) 1'
              }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 py-2 bg-gradient-to-br from-purple-50/90 to-fuchsia-50/90 dark:from-purple-950/90 dark:to-fuchsia-950/90 backdrop-blur-sm text-sm font-semibold text-purple-700 dark:text-purple-300 rounded-full border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-500/10">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800/50 text-gray-700 dark:text-gray-200 hover:border-purple-400 dark:hover:border-purple-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-fuchsia-100 via-pink-100 to-purple-100 dark:from-purple-950 dark:via-fuchsia-950 dark:to-purple-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              backgroundSize: '200% 100%',
              animation: 'rainbow-shimmer 3s linear infinite'
            }} />
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

          <div className="mt-6 pt-6 border-t border-purple-100 dark:border-purple-900/20">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Lock className="h-4 w-4 text-purple-500" />
              <p>Admin access only. Contact your administrator if you need access.</p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-full border border-purple-200 dark:border-purple-800/30">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Protected by Supabase Authentication
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
