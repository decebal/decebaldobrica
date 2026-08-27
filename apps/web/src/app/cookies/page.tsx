import { LegalDocument } from '@/components/LegalDocument'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie & Local Storage Notice',
  description: 'Browser storage and cookieless analytics used by decebaldobrica.com.',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Browser data"
      title="Cookie and local storage notice"
      summary="The public site is designed to use cookieless measurement. Some interactive features may still store a preference or state in your browser."
      sections={[
        {
          heading: 'Product analytics',
          paragraphs: [
            'PostHog is configured in cookieless mode to measure page use, product actions, and errors without identifying a visitor account. Production analytics configuration is reviewed separately from development traffic.',
          ],
        },
        {
          heading: 'Functional browser storage',
          paragraphs: [
            'A feature may use local storage or a cookie to remember a UI preference, newsletter or pricing state, authentication state, or another choice you made. Removing site data in your browser resets those choices.',
          ],
        },
        {
          heading: 'Third-party flows',
          paragraphs: [
            'If you open a scheduling, payment, authentication, video, or external social service, that provider may use cookies under its own policy. Those services are outside this site once you follow the external link.',
          ],
        },
        {
          heading: 'Controls',
          paragraphs: [
            'Browser settings can block or delete cookies and local storage. Blocking essential state may prevent a sign-in, checkout, or preference from working, but public articles and service information should remain accessible.',
          ],
        },
      ]}
    />
  )
}
