import Footer from '@/components/Footer'
import Link from 'next/link'

interface LegalSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export function LegalDocument({
  eyebrow,
  title,
  summary,
  sections,
}: {
  eyebrow: string
  title: string
  summary: string
  sections: LegalSection[]
}) {
  return (
    <div className="relative min-h-screen">
      <main className="pb-20 pt-28">
        <article className="section-container max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">{title}</h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">{summary}</p>
          <p className="mt-3 text-sm text-gray-200">Last updated: 27 August 2026</p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-gray-200">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul className="list-disc space-y-2 pl-6">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-12 rounded-xl border border-white/15 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Questions</h2>
            <p className="mt-3 text-gray-200">
              Email{' '}
              <a
                className="text-brand-teal hover:underline"
                href="mailto:discovery@decebaldobrica.com"
              >
                discovery@decebaldobrica.com
              </a>{' '}
              or review commercial services at{' '}
              <a className="text-brand-teal hover:underline" href="https://wolventech.com">
                Wolven Tech
              </a>
              .
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex min-h-12 items-center text-brand-teal hover:underline"
            >
              Contact Decebal
            </Link>
          </aside>
        </article>
      </main>
      <Footer />
    </div>
  )
}
