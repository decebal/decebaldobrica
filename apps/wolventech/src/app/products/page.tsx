import { portfolioHref, products } from '@/lib/products'
import { Badge } from '@decebal/ui/badge'
import { Button } from '@decebal/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@decebal/ui/card'
import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products built by Wolven Tech',
  description:
    'Eight focused products from Wolven Tech, each with a defined buyer, useful outcome, proof route, and commercial model.',
  alternates: { canonical: '/products' },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Products built by Wolven Tech',
  itemListElement: products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: product.name,
      description: product.description,
      url: product.href,
      creator: { '@id': 'https://wolventech.com/#organization' },
    },
  })),
}

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-[1160px] px-7 pb-20 pt-20">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from local product data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <section className="max-w-3xl">
        <div className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-rust-primary-2">
          <span className="h-[2px] w-[26px] rounded-sm bg-rust-primary" />
          Wolven Tech products
        </div>
        <h1 className="text-[clamp(36px,5.3vw,60px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-rust-ink">
          Small products for <span className="text-gradient-rust">specific decisions</span>.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-rust-ink-soft">
          Each product owns one problem, one audience, and one primary action. Wolven Tech builds
          and operates the software; each product domain carries its own guidance, policies, and
          conversion path.
        </p>
      </section>

      <section
        aria-label="Product portfolio"
        className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {products.map((product) => (
          <Card key={product.name} className="flex flex-col border-rust-line bg-rust-surface">
            <CardHeader className="space-y-3">
              <Badge
                variant="outline"
                className="w-max border-rust-primary/40 bg-rust-primary/10 text-[10px] uppercase tracking-[0.12em] text-rust-primary-2"
              >
                {product.category}
              </Badge>
              <CardTitle className="text-2xl tracking-tight text-rust-ink">
                {product.name}
              </CardTitle>
              <CardDescription className="text-[14.5px] leading-relaxed text-rust-ink-soft">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-6">
              <dl className="space-y-4 border-t border-dashed border-rust-line-soft pt-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-rust-muted">
                    Built for
                  </dt>
                  <dd className="mt-1 text-rust-ink-soft">{product.audience}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-rust-muted">
                    Useful outcome
                  </dt>
                  <dd className="mt-1 text-rust-ink-soft">{product.outcome}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-rust-muted">
                    Access
                  </dt>
                  <dd className="mt-1 text-rust-ink-soft">{product.commercialModel}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="w-max bg-rust-primary font-semibold text-white hover:bg-rust-primary-2"
                >
                  <a href={portfolioHref(product, 'product')}>
                    {product.cta}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <a
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-rust-primary-2 underline decoration-rust-line underline-offset-4 hover:decoration-rust-primary"
                  href={portfolioHref(product, 'proof')}
                >
                  {product.proofLabel}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-14 rounded-xl border border-rust-line bg-rust-elevated p-7">
        <h2 className="text-xl font-bold text-rust-ink">Need engineering behind a product?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-rust-ink-soft">
          Product work informs Wolven Tech advisory: Rust systems, event sourcing, web delivery,
          payments, analytics, and production operations under one accountable owner.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-5 border-rust-line bg-transparent text-rust-ink hover:bg-rust-surface"
        >
          <a href="/contact">Discuss an engagement</a>
        </Button>
      </section>
    </main>
  )
}
