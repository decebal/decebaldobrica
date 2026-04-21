import { bookMeeting } from '@/actions/meeting-action'
import Footer from '@/components/Footer'
import ContactBookingPage from '@decebal/booking/ContactBookingPage'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Book discovery',
  description:
    'Book a 30-minute discovery call with Wolven Tech to discuss Rust advisory, architecture review, or platform work.',
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Loading…</h1>
            <p className="text-rust-ink-soft">Preparing discovery form…</p>
          </div>
        </div>
      }
    >
      <ContactBookingPage
        bookingAction={bookMeeting}
        enablePayments={false}
        theme="rust"
        chatConfig={{ enabled: false }}
        footer={<Footer />}
      />
    </Suspense>
  )
}
