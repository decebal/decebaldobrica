import Footer from '@/components/Footer'
import { founderProductHref, founderProducts } from '@/data/products'
import { jsonLd } from '@/lib/structuredData'
import { ArrowRight, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products built by Decebal Dobrica and Wolven Tech',
  description:
    'AllSource and seven focused decision tools built by Decebal Dobrica through Wolven Tech, with direct links to working product evidence.',
  alternates: { canonical: '/products' },
}

export default function ProductsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Products built by Decebal Dobrica and Wolven Tech',
    url: 'https://decebaldobrica.com/products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: founderProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: product.name,
          description: product.outcome,
          url: product.href,
          creator: { '@id': 'https://decebaldobrica.com/#person' },
        },
      })),
    },
  }

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD contains static local data escaped by jsonLd
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <main className="pb-20 pt-28">
        <div className="section-container max-w-6xl">
          <header className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
              Built through Wolven Tech
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">
              Products with one buyer, one decision, and inspectable proof
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-200">
              Current software I build and operate. Each link goes to a working product or its
              strongest public proof—not a speculative roadmap.
            </p>
          </header>

          <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Product portfolio">
            {founderProducts.map((product) => (
              <article
                key={product.slug}
                className="rounded-xl border border-white/15 bg-white/5 p-6"
              >
                <p className="text-sm font-semibold text-brand-teal">{product.audience}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{product.name}</h2>
                <p className="mt-4 leading-7 text-gray-200">{product.outcome}</p>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <a
                    href={founderProductHref(product, 'product')}
                    className="inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  >
                    Open product
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={founderProductHref(product, 'proof')}
                    className="inline-flex min-h-12 items-center gap-2 font-semibold text-gray-100 hover:text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  >
                    {product.proof}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </section>

          <p className="mt-12 max-w-3xl border-l-2 border-brand-teal pl-5 leading-7 text-gray-200">
            Wolven Tech is owner and operator. Product domains carry exact terms, privacy details,
            prices, and current availability.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
