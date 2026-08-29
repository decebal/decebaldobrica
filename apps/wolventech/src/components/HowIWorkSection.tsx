import { steps } from '@/lib/content'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

const workflowStages = [
  {
    title: 'Discover',
    body: 'Inspect code, constraints, operational history, and failure modes before prescribing.',
  },
  {
    title: 'Specify',
    body: 'Write acceptance criteria, boundaries, dependencies, and proof required for completion.',
  },
  {
    title: 'Build',
    body: 'Claim narrow work, ship visible slices, and keep architecture decisions close to code.',
  },
  {
    title: 'Verify',
    body: 'Test behavior and run configured gates against real paths, including hostile fixtures.',
  },
  {
    title: 'Learn',
    body: 'Compare bounded experiments, keep strict improvements, and retain failed evidence.',
  },
]

const skillSuites = [
  {
    provider: 'Claude Code',
    name: 'decebal-claude-skills',
    href: 'https://github.com/decebal/decebal-claude-skills',
    metrics: ['54 skills', '20 Rust gate crates', '15 rules'],
    description:
      'Daily engineering workflows, hooks, templates, and incident-backed rules with executable checks.',
  },
  {
    provider: 'OpenAI Codex',
    name: 'decebal-codex-skills',
    href: 'https://github.com/decebal/decebal-codex-skills',
    metrics: ['55 skills', '21 Rust gate crates', 'Chronis'],
    description:
      'Codex-native execution, command policy, Chronis work history, SEO/ASO tooling, and capped skill autoresearch.',
  },
]

export default function HowIWorkSection() {
  return (
    <section
      id="how-i-work"
      aria-labelledby="how-i-work-title"
      className="mx-auto max-w-[1160px] scroll-mt-24 px-7 py-14"
    >
      <div className="border-y border-rust-line py-10 md:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rust-primary-2">
              How I work
            </p>
            <h2
              id="how-i-work-title"
              className="mt-3 text-[clamp(30px,4.5vw,48px)] font-extrabold leading-[1.06] tracking-tight text-rust-ink"
            >
              Control the work. Keep the evidence.
            </h2>
            <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-rust-ink-soft">
              Agent-assisted engineering moves quickly. Wolven Tech makes that speed reviewable:
              explicit scope, dependency-aware execution, configured gates, and evidence your team
              can inspect after handover.
            </p>
            <p className="mt-5 border-l-2 border-rust-primary pl-4 text-[13.5px] leading-6 text-rust-muted">
              Shipped tooling is not automatically active. Gates only count when configured for real
              paths and proven against a planted failure.
            </p>
          </div>

          <figure>
            <Image
              src="/images/how-i-work-workflow.webp"
              alt="An industrial 3D workflow rig combining technical inspection, scoped platform delivery, verification, and retained improvements"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="h-auto w-full drop-shadow-[0_28px_48px_rgba(0,0,0,0.5)]"
            />
            <figcaption className="mono mt-2 text-center text-[11px] text-rust-muted">
              diligence / delivery / verification / learning
            </figcaption>
          </figure>
        </div>

        <ol className="mt-12 grid border-t border-rust-line md:grid-cols-5">
          {workflowStages.map((stage, index) => (
            <li
              key={stage.title}
              className="border-b border-rust-line py-5 md:border-b-0 md:border-r md:px-4 md:last:border-r-0"
            >
              <span className="mono text-[11px] text-rust-primary-2">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2.5 text-[16px] font-semibold text-rust-ink">{stage.title}</h3>
              <p className="mt-2 text-[13px] leading-5 text-rust-ink-soft">{stage.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="flex items-end justify-between gap-5 border-b border-rust-line pb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rust-primary-2">
                  Inspectable implementation
                </p>
                <h3 className="mt-2 text-xl font-bold text-rust-ink">Two public workflow suites</h3>
              </div>
              <span className="mono hidden text-[11px] text-rust-muted sm:block">
                source → proof
              </span>
            </div>
            <div className="divide-y divide-rust-line">
              {skillSuites.map((suite) => (
                <article key={suite.name} className="py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-rust-amber">
                        {suite.provider}
                      </p>
                      <h4 className="mt-1 text-[18px] font-semibold text-rust-ink">{suite.name}</h4>
                    </div>
                    <a
                      href={suite.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 text-[13px] font-medium text-rust-primary-2 hover:text-rust-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-amber"
                    >
                      Inspect source
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-6 text-rust-ink-soft">
                    {suite.description}
                  </p>
                  <ul className="mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-rust-muted">
                    {suite.metrics.map((metric) => (
                      <li
                        key={metric}
                        className="before:mr-2 before:text-rust-primary-2 before:content-['/']"
                      >
                        {metric}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div id="process" className="scroll-mt-24">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rust-primary-2">
              Engagement rhythm
            </p>
            <h3 className="mt-2 text-xl font-bold text-rust-ink">From call to owned system</h3>
            <ol className="mt-5 border-l border-rust-line">
              {steps.map((step) => (
                <li key={step.num} className="relative pb-5 pl-7 last:pb-0">
                  <span className="mono absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-rust-primary bg-rust-bg text-[9px] font-bold text-rust-primary-2">
                    {step.num}
                  </span>
                  <h4 className="text-[14px] font-semibold text-rust-ink">{step.title}</h4>
                  <p className="mt-1 text-[13px] leading-5 text-rust-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
