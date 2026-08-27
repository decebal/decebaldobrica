import { ArrowRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => (
  <section className="flex min-h-[min(860px,100svh)] items-center pb-20 pt-28">
    <div className="section-container grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
          Decebal Dobrica · Founder, Wolven Tech
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
          Rust systems and agentic AI, built for production.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200 md:text-xl">
          I design event-sourced backends, durable agent memory, and AI-assisted engineering
          systems. Published work includes AllSource and 1M+ lines of production Rust across
          fintech, identity, SaaS, and Web3.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/work"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-teal px-6 py-3 font-semibold text-brand-darknavy transition-colors hover:bg-brand-teal/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            View current work
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a
            href="https://wolventech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-brand-teal hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            Hire through Wolven Tech
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <figure className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-3 shadow-2xl shadow-black/30">
          <Image
            src="/images/avatar.jpg"
            alt="Decebal Dobrica"
            width={720}
            height={720}
            sizes="(max-width: 1024px) 80vw, 38vw"
            priority
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
        <figcaption className="mt-4 text-center text-sm text-gray-200">
          Principal engineer, product builder, and open-source maintainer.
        </figcaption>
      </figure>
    </div>
  </section>
)

export default HeroSection
