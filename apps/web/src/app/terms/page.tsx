import { LegalDocument } from '@/components/LegalDocument'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Website & Service Terms',
  description: 'Terms for using decebaldobrica.com and enquiring about Wolven Tech services.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Terms"
      title="Website and service terms"
      summary="These terms cover use of this personal site. Commercial engineering work is agreed separately through Wolven Tech in a written order, statement of work, or contract."
      sections={[
        {
          heading: 'Site content',
          paragraphs: [
            'Articles, examples, benchmarks, and case studies are provided for general information. They are not a warranty that another system will achieve the same result. Check the stated workload, date, and limits before relying on a technical claim.',
            'Code snippets may omit production concerns for clarity. Test and review them for your own environment.',
          ],
        },
        {
          heading: 'Commercial work',
          paragraphs: [
            'An enquiry, meeting, or proposal does not start a paid engagement. Scope, fees, acceptance criteria, intellectual property, confidentiality, expenses, and cancellation terms must be agreed in writing before work starts.',
            'Where a written commercial agreement conflicts with this page, the written agreement controls that engagement.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: [
            'Do not misuse forms, attempt unauthorized access, interfere with site operation, or submit unlawful or harmful material.',
          ],
        },
        {
          heading: 'Intellectual property and links',
          paragraphs: [
            'Unless a separate license says otherwise, original site content remains protected. Open-source projects are governed by the license in their own repository.',
            'External links are provided for context. Their content and availability are controlled by their respective owners.',
          ],
        },
      ]}
    />
  )
}
