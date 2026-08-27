import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookServiceRedirect from './BookServiceRedirect'

export const metadata: Metadata = {
  title: 'Continue to booking',
  robots: { index: false, follow: true },
}

export default function BookServicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">Preparing secure booking…</p>
          </div>
        </div>
      }
    >
      <BookServiceRedirect />
    </Suspense>
  )
}
