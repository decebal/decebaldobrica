import { config } from '@/lib/personalConfig'
import { Briefcase, Code2, ExternalLink, Gauge, Network } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const stats = [
  { value: '15+', label: 'years shipping production software', icon: Briefcase },
  { value: '1M+', label: 'lines of production Rust shipped', icon: Code2 },
  { value: '75%', label: 'infrastructure cost reduction in a named case study', icon: Gauge },
  { value: '25+', label: 'engineers led across delivery teams', icon: Network },
]

const AboutSection = () => (
  <section id="about" className="py-20">
    <div className="section-container">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
          Operating context
        </p>
        <h2 className="section-title text-left">Engineer, founder, and maintainer</h2>
        <p className="text-lg leading-8 text-gray-200">
          I lead Wolven Tech and build Rust systems, event-sourced products, and agentic AI
          workflows. Claims below are scoped to the work described in linked case studies; they are
          not generic promises for every project.
        </p>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/15 bg-white/5 p-6">
            <stat.icon className="mb-4 h-6 w-6 text-brand-teal" aria-hidden="true" />
            <dd className="text-3xl font-bold text-white">{stat.value}</dd>
            <dt className="mt-2 text-sm leading-6 text-gray-200">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6 text-base leading-8 text-gray-200">
          <p>
            Current work spans AllSource, an AI-native Rust event store; AllFrame, a Rust
            application framework; and product engineering across the Wolven Tech portfolio. I work
            directly in code, architecture, delivery systems, and product evidence.
          </p>
          <p>
            Earlier roles covered fintech, identity, SaaS, and Web3 systems. That range is useful
            when a team must connect low-level performance or reliability decisions to product and
            operating constraints.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-5 py-3 font-semibold text-white hover:border-brand-teal hover:text-brand-teal"
            >
              Full background
            </Link>
            <a
              href={config.wolvenTechUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-brand-teal/60 px-5 py-3 font-semibold text-brand-teal hover:bg-brand-teal/10"
            >
              Wolven Tech
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <Image
          src="/images/gallery/img-07.jpg"
          alt="Decebal Dobrica speaking at a technology event"
          width={960}
          height={720}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full rounded-xl border border-white/15 object-cover shadow-xl"
        />
      </div>
    </div>
  </section>
)

export default AboutSection
