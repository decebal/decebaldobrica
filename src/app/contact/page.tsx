// src/app/contact/page.tsx
// Contact page with booking form and AI chat

import ContactBookingPage from '@/components/ContactBookingPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Book',
  description: 'Schedule a consultation to discuss how fractional CTO services can accelerate your startup',
}

export default function ContactPage() {
  return <ContactBookingPage />
}
