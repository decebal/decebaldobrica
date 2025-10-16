'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

type ConfirmationStatus = 'loading' | 'success' | 'error'

interface ConfirmationResult {
  success: boolean
  message?: string
  error?: string
  subscriber?: {
    email: string
    name?: string
    tier: 'free' | 'premium' | 'founding'
  }
}

function NewsletterConfirmContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [result, setResult] = useState<ConfirmationResult | null>(null)

  useEffect(() => {
    async function confirmSubscription() {
      if (!token) {
        setStatus('error')
        setResult({
          success: false,
          error: 'Missing confirmation token. Please check your email link.',
        })
        return
      }

      try {
        const response = await fetch(`/api/newsletter/confirm?token=${token}`, {
          method: 'GET',
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setResult(data)
        } else {
          setStatus('error')
          setResult({
            success: false,
            error: data.error || 'Failed to confirm subscription.',
          })
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setResult({
          success: false,
          error: 'An unexpected error occurred. Please try again.',
        })
      }
    }

    confirmSubscription()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Confirming your subscription...
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Please wait a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <svg
                  className="h-12 w-12 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Success"
                >
                  <title>Success</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You're all set! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {result?.message || 'Your newsletter subscription has been confirmed.'}
            </p>
            {result?.subscriber && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subscribed as:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {result.subscriber.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Tier: <span className="capitalize font-medium">{result.subscriber.tier}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              You'll receive a welcome email shortly. Newsletters will arrive in your inbox weekly.
            </p>
            <div className="space-y-3">
              <Link
                href="/blog"
                className="block w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Read the Blog
              </Link>
              <Link
                href="/"
                className="block w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                <svg
                  className="h-12 w-12 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Error"
                >
                  <title>Error</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Confirmation Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {result?.error || "We couldn't confirm your subscription."}
            </p>
            <div className="space-y-3">
              <Link
                href="/blog"
                className="block w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Try Subscribing Again
              </Link>
              <Link
                href="/"
                className="block w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h1>
            </div>
          </div>
        </div>
      }
    >
      <NewsletterConfirmContent />
    </Suspense>
  )
}
