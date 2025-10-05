import { Suspense } from 'react'
import BookServiceRedirect from './BookServiceRedirect'

export default function BookServicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
            <p className="text-gray-300">Preparing your booking...</p>
          </div>
        </div>
      }
    >
      <BookServiceRedirect />
    </Suspense>
  )
}
