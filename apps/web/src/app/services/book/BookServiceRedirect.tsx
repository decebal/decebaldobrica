'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function BookServiceRedirect() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    // Redirect to /contact with category parameter if present
    const targetUrl = category ? `/contact?category=${encodeURIComponent(category)}` : '/contact'
    window.location.href = targetUrl
  }, [category])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting...</h1>
        <p className="text-gray-300">You will be redirected to the contact page.</p>
      </div>
    </div>
  )
}
