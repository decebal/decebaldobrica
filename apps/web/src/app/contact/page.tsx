// src/app/contact/page.tsx
// Contact page with booking form and AI chat

import { bookMeeting } from '@/actions/meeting-action'
import Footer from '@/components/Footer'
import ContactBookingPage from '@decebal/booking/ContactBookingPage'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Discuss a Rust, AI, or Technical Leadership Project',
  description:
    'Contact Decebal Dobrica about Rust systems, agentic AI architecture, or technical leadership through Wolven Tech.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28">
      <header className="section-container mb-8 max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
          Contact
        </p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Discuss a Rust, AI, or technical leadership project
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-200">
          Share the system, constraint, or decision you need help with. Commercial work is delivered
          through Wolven Tech.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="section-container min-h-80 max-w-4xl rounded-xl border border-white/15 bg-white/5 p-8">
            <p className="text-gray-200">Preparing secure contact form…</p>
          </div>
        }
      >
        <ContactBookingPage
          bookingAction={bookMeeting}
          chatConfig={{ enabled: true }}
          footer={<Footer />}
        />
      </Suspense>
    </div>
  )
}
