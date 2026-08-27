import { LegalDocument } from '@/components/LegalDocument'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description:
    'How decebaldobrica.com handles contact, booking, analytics, and payment information.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Privacy notice"
      summary="This notice explains the information handled by decebaldobrica.com, why it is needed, and how to ask about it."
      sections={[
        {
          heading: 'Information you provide',
          paragraphs: [
            'Contact, booking, newsletter, and checkout forms may collect the details you enter, such as your name, email address, company, project context, and scheduling choices.',
            'Do not include credentials, production data, health information, or other sensitive material in an initial enquiry.',
          ],
        },
        {
          heading: 'How information is used',
          paragraphs: [
            'Information is used only for the reason it was supplied and related administration.',
          ],
          bullets: [
            'Responding to an enquiry or arranging a meeting',
            'Providing a requested newsletter or digital product',
            'Processing a payment and keeping required transaction records',
            'Diagnosing reliability, security, and usability problems',
          ],
        },
        {
          heading: 'Service providers',
          paragraphs: [
            'The site uses specialist providers for hosting, email, scheduling, payments, and product analytics. Each provider receives only the information needed for its function and applies its own privacy terms.',
            'PostHog is configured for cookieless product measurement. Session recording and error data are intended to diagnose product use; form fields and sensitive values should be masked or excluded from capture.',
          ],
        },
        {
          heading: 'Retention and your choices',
          paragraphs: [
            'Records are kept only while needed for the purpose, legal obligations, security, or dispute handling. Retention can vary by record type and provider.',
            'You can ask what personal information is held, request correction or deletion where applicable, or object to processing by using the contact address below.',
          ],
        },
      ]}
    />
  )
}
