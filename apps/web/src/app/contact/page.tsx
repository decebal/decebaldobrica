// src/app/contact/page.tsx
// Contact page with booking form and AI chat

import { bookMeeting } from '@/actions/meeting-action'
import Footer from '@/components/Footer'
import ContactBookingPage from '@decebal/booking/ContactBookingPage'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Contact & Book',
  description:
    'Schedule a consultation to discuss how engineering leadership services can accelerate your startup',
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
            <p className="text-gray-300">Preparing contact form...</p>
          </div>
        </div>
      }
    >
      <ContactBookingPage
        bookingAction={bookMeeting}
        chatConfig={{ enabled: true }}
        footer={<Footer />}
      />
    </Suspense>
  )
}
