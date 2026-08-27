import { getAllCaseStudies } from '@/data/caseStudies'
import { ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

const WorkSection = () => {
  const caseStudies = getAllCaseStudies().slice(0, 3)

  return (
    <section id="work" className="py-20">
      <div className="section-container">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            Evidence
          </p>
          <h2 className="section-title">Selected engineering outcomes</h2>
          <p className="section-subtitle">
            Architecture decisions, constraints, and measured outcomes from production work—not a
            rotating wall of logos.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/work/${study.slug}`}
              className="group flex min-h-full flex-col rounded-xl border border-white/15 bg-white/5 p-6 transition-colors hover:border-brand-teal/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
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
              <p className="mb-6 flex-1 text-sm leading-6 text-gray-200">{study.tagline}</p>
              <dl className="mb-6 grid grid-cols-2 gap-2">
                {study.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-white/5 p-3">
                    <dt className="text-xs text-gray-200">{metric.label}</dt>
                    <dd className="mt-1 text-lg font-bold text-brand-teal">{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal">
                Read case study
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/work"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-brand-teal/60 px-5 py-3 font-semibold text-brand-teal transition-colors hover:bg-brand-teal/10"
          >
            View all case studies
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default WorkSection
