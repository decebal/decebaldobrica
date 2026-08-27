import Footer from '@/components/Footer'
import { getServiceOffering, serviceOfferings } from '@/lib/serviceOfferings'
import { breadcrumbSchema, jsonLd, serviceSchema } from '@/lib/structuredData'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return serviceOfferings.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const offering = getServiceOffering(slug)
  if (!offering) return { title: 'Service not found' }

  return {
    title: offering.title,
    description: offering.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      type: 'website',
      url: `/services/${slug}`,
      title: offering.title,
      description: offering.description,
      images: ['/opengraph-image.png'],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const offering = getServiceOffering(slug)
  if (!offering) notFound()

  const path = `/services/${offering.slug}`
  const schema = serviceSchema({
    name: offering.title,
    description: offering.description,
    path,
    areaServed: offering.areaServed,
  })
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: offering.shortTitle, path },
  ])

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />
      <main className="pb-20 pt-28">
        <div className="section-container max-w-6xl">
          <Link
            href="/services"
            className="inline-flex min-h-12 items-center gap-2 text-brand-teal hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All services
          </Link>

          <header className="mt-10 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
              Delivered through Wolven Tech
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">
              {offering.title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-200">{offering.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?category=${encodeURIComponent(offering.shortTitle)}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-teal px-6 py-3 font-semibold text-brand-darknavy hover:bg-brand-teal/85"
              >
                Discuss this system
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/work"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:border-brand-teal hover:text-brand-teal"
              >
                See case-study evidence
              </Link>
            </div>
            <div className="mt-8 rounded-xl border border-brand-teal/30 bg-brand-teal/10 p-6">
              <h2 className="text-lg font-semibold text-white">Target outcome</h2>
              <p className="mt-2 leading-7 text-gray-100">{offering.outcome}</p>
            </div>
          </header>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <section>
              <h2 className="text-3xl font-bold text-white">Good fit when</h2>
              <ul className="mt-6 space-y-4">
                {offering.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-200">
                    <CheckCircle2
                      className="mt-1 h-5 w-5 shrink-0 text-brand-teal"
                      aria-hidden="true"
                    />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-3xl font-bold text-white">What you receive</h2>
              <ul className="mt-6 space-y-4">
                {offering.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-200">
                    <CheckCircle2
                      className="mt-1 h-5 w-5 shrink-0 text-brand-teal"
                      aria-hidden="true"
                    />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-16">
            <h2 className="text-3xl font-bold text-white">How the work runs</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {offering.method.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-xl border border-white/15 bg-white/5 p-6"
                >
                  <p className="text-sm font-semibold text-brand-teal">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 leading-7 text-gray-200">{step.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-white/15 bg-white/5 p-8">
            <h2 className="text-3xl font-bold text-white">Check evidence and next steps</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {offering.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-4 py-3 font-medium text-white transition-colors hover:border-brand-teal hover:text-brand-teal"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
