import { ArrowUpRight, Github } from 'lucide-react'
import Image from 'next/image'

const workflowStages = [
  {
    title: 'Discover',
    body: 'Read repository state, constraints, and failure history before proposing a change.',
  },
  {
    title: 'Specify',
    body: 'Turn outcomes into acceptance criteria and dependency-aware Chronis work.',
  },
  {
    title: 'Build',
    body: 'Claim narrow work. Keep decisions, code, and progress inspectable.',
  },
  {
    title: 'Verify',
    body: 'Test behavior, then run gates whose result this change can honestly prove.',
  },
  {
    title: 'Learn',
    body: 'Freeze the evaluator. Keep measured improvements and record failed experiments too.',
  },
]

const repositorySuites = [
  {
    provider: 'Claude Code',
    name: 'decebal-claude-skills',
    href: 'https://github.com/decebal/decebal-claude-skills',
    description:
      'Provider-specific craft backed by portable rules, hooks, project templates, and executable Rust checks.',
    metrics: ['54 skills', '20 Rust gate crates', '15 incident-backed rules'],
  },
  {
    provider: 'OpenAI Codex',
    name: 'decebal-codex-skills',
    href: 'https://github.com/decebal/decebal-codex-skills',
    description:
      'Codex-native skills, policy, and hooks with Chronis execution, Rust gates, SEO/ASO tooling, and capped autoresearch.',
    metrics: ['55 skills', '21 Rust gate crates', 'Chronis workflow'],
  },
]

export default function HowIWorkSection() {
  return (
    <section id="how-i-work" aria-labelledby="how-i-work-title" className="scroll-mt-24">
      <div className="section-container">
        <div className="border-y border-white/15 py-12 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
                How I work
              </p>
              <h2
                id="how-i-work-title"
                className="mt-4 max-w-xl text-3xl font-bold leading-tight text-white md:text-5xl"
              >
                Evidence before confidence.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-200">
                AI accelerates implementation. It does not remove responsibility. My workflow makes
                scope, decisions, checks, and learning visible from first inspection through
                handover.
              </p>
              <p className="mt-6 border-l-2 border-brand-teal pl-4 text-sm leading-6 text-gray-200">
                Included tooling is not automatically enforced. Every project selects rules and
                gates matching its real paths, risks, and delivery contract.
              </p>
            </div>

            <figure>
              <Image
                src="/images/how-i-work-workflow.webp"
                alt="A five-stage 3D workflow moving from repository inspection through planning, building, verification, and measured experiments"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="h-auto w-full drop-shadow-[0_28px_45px_rgba(0,0,0,0.32)]"
              />
              <figcaption className="mt-2 text-center text-xs text-gray-300">
                Inspect → plan → build → gate → improve
              </figcaption>
            </figure>
          </div>

          <ol className="mt-14 grid border-t border-white/15 md:grid-cols-5">
            {workflowStages.map((stage, index) => (
              <li
                key={stage.title}
                className="border-b border-white/15 py-6 md:border-b-0 md:border-r md:px-5 md:last:border-r-0"
              >
                <span className="font-mono text-xs text-brand-teal">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-200">{stage.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid border-y border-white/15 lg:grid-cols-2 lg:divide-x lg:divide-white/15">
            {repositorySuites.map((suite) => (
              <article key={suite.name} className="py-7 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-teal">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {suite.provider}
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-white">{suite.name}</h3>
                <p className="mt-3 max-w-xl leading-7 text-gray-200">{suite.description}</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-100">
                  {suite.metrics.map((metric) => (
                    <li
                      key={metric}
                      className="before:mr-2 before:text-brand-teal before:content-['/']"
                    >
                      {metric}
                    </li>
                  ))}
                </ul>
                <a
                  href={suite.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  Inspect {suite.provider} suite
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
