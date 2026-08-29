import { ArrowRight, Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => (
  <section className="flex min-h-[min(860px,100svh)] items-center pb-20 pt-28">
    <div className="section-container grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
          Principal Rust &amp; AI engineer · London / remote UK
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
          Rust and AI engineering for ambitious London teams.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200 md:text-xl">
          15+ years shipping production software and 1M+ lines of Rust across fintech, identity,
          SaaS, and Web3. I join hard delivery problems as a hands-on principal engineer, technical
          lead, or founding engineer.
        </p>

        <ul className="mt-7 flex max-w-2xl flex-wrap gap-x-6 gap-y-2 border-y border-white/15 py-4 text-sm text-gray-100">
          <li className="before:mr-2 before:text-brand-teal before:content-['/']">
            London + remote UK
          </li>
          <li className="before:mr-2 before:text-brand-teal before:content-['/']">
            Outside-IR35 contracts via Wolven Tech
          </li>
          <li className="before:mr-2 before:text-brand-teal before:content-['/']">
            Select founding engineer roles
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact?category=General+Consultation"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-teal px-6 py-3 font-semibold text-brand-darknavy transition-colors hover:bg-brand-teal/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            Discuss an engagement
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/work"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-brand-teal hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            Review case studies
          </Link>
        </div>
        <a
          href="/resume/decebal-dobrica-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-gray-100 hover:text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download CV
        </a>
        <p className="max-w-2xl text-xs leading-5 text-gray-300">
          Outside-IR35 status remains subject to client determination and actual working practices.
        </p>
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
          Decebal Dobrica · Founder, Wolven Tech · Open-source maintainer
        </figcaption>
      </figure>
    </div>
  </section>
)

export default HeroSection
