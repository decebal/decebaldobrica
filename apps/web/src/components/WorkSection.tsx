import { getAllCaseStudies } from '@/data/caseStudies'
import { ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

const WorkSection = () => {
  const caseStudies = getAllCaseStudies().slice(0, 3)

  return (
    <section id="work" className="scroll-mt-24">
      <div className="section-container">
        <header data-testid="work-intro" className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            Evidence
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl">
            Selected engineering outcomes
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">
            Architecture decisions, constraints, and measured outcomes from production work—not a
            rotating wall of logos.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto_minmax(5rem,1fr)_auto_auto] lg:gap-y-0">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/work/${study.slug}`}
              data-testid="work-card"
              className="group grid min-h-full grid-rows-[auto_auto_auto_auto_auto] rounded-xl border border-white/15 bg-white/5 p-6 transition-colors hover:border-brand-teal/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal lg:row-span-5 lg:grid-rows-subgrid"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="rounded-full bg-brand-teal/15 px-3 py-1 text-xs font-medium text-brand-teal">
                  {study.industry}
                </span>
                <Briefcase className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-brand-teal">
                {study.title}
              </h3>
              <p className="pb-6 text-sm leading-6 text-gray-200">{study.tagline}</p>
              <dl
                data-testid="work-metrics"
                className="mb-4 grid min-h-28 grid-cols-2 border-y border-white/10"
              >
                {study.metrics.slice(0, 2).map((metric) => (
                  <div
                    key={metric.label}
                    className="min-w-0 py-4 first:pr-4 last:border-l last:border-white/10 last:pl-4"
                  >
                    <dt className="min-h-8 text-xs leading-4 text-gray-200">{metric.label}</dt>
                    <dd className="mt-1 text-[clamp(1rem,1.35vw,1.125rem)] font-bold leading-6 text-brand-teal">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <span
                data-testid="work-card-cta"
                className="inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal"
              >
                Read case study
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/work"
            className="group inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            View all case studies
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default WorkSection
