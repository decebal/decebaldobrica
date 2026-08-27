import { LegalDocument } from '@/components/LegalDocument'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Information',
  description:
    'How cancellation and refund terms are determined for products and Wolven Tech services.',
  alternates: { canonical: '/refunds' },
}

export default function RefundsPage() {
  return (
    <LegalDocument
      eyebrow="Purchases"
      title="Cancellation and refund information"
      summary="Cancellation and refund rights depend on what was purchased, whether delivery began, and the written terms shown before payment."
      sections={[
        {
          heading: 'Engineering services',
          paragraphs: [
            'Professional services are governed by the signed order, statement of work, or contract. That document should state deposits, milestones, cancellation, work already performed, expenses, acceptance, and any refund conditions.',
          ],
        },
        {
          heading: 'Meetings and fixed-scope work',
          paragraphs: [
            'Booking and product pages should show the applicable rescheduling, cancellation, and delivery terms before payment. If the page and your receipt differ, contact us with the receipt so the transaction can be checked.',
          ],
        },
        {
          heading: 'Digital products',
          paragraphs: [
            'Access or delivery details are provided at checkout or by email. Statutory rights are not excluded. Eligibility may differ once immediate digital delivery has begun with the consent required by applicable law.',
          ],
        },
        {
          heading: 'Requesting a review',
          paragraphs: [
            'Send the order reference, purchase date, product or service name, and reason for the request. Do not send payment-card details. A request is assessed against the checkout terms, delivery evidence, and applicable law.',
          ],
        },
      ]}
    />
  )
}
