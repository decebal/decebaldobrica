import { ArrowRight, BriefcaseBusiness, Github, Rocket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const engagementPaths = [
  {
    eyebrow: 'Contract delivery',
    title: 'Outside-IR35 Rust & AI contract',
    summary:
      'For delivery-critical systems that need senior ownership without a long hiring cycle. I work through Wolven Tech as a hands-on principal engineer across architecture, implementation, and handover.',
    outcomes: [
      'Production Rust, event sourcing, platform and performance work',
      'Agentic AI systems with durable memory, evals, and operational controls',
      'Fast context acquisition inside an existing team and repository',
    ],
    href: '/contact?category=Rust+Systems+Advisory',
    cta: 'Discuss a contract',
    icon: BriefcaseBusiness,
  },
  {
    eyebrow: 'Founding team',
    title: 'Founding engineer',
    summary:
      'For pre-seed and seed founders who need a technical partner able to move between product decisions, first architecture, production code, delivery practice, and early engineering hires.',
    outcomes: [
      'Zero-to-one product and platform delivery with explicit trade-offs',
      'Technical narrative for investors, diligence, and hiring',
      'Founding-level ownership without disappearing into strategy decks',
    ],
    href: '/contact?category=Engineering+Leadership',
    cta: 'Discuss a founding role',
    icon: Rocket,
  },
]

const workflowStages = [
  {
    title: 'Discover',
    body: 'Read repository state, constraints, and failure history before proposing change.',
  },
  {
    title: 'Specify',
    body: 'Turn desired outcomes into acceptance criteria and dependency-aware work.',
  },
  {
    title: 'Build',
    body: 'Keep scope narrow and make code, decisions, and progress inspectable.',
  },
  {
    title: 'Verify',
    body: 'Test behavior, then run only gates able to prove this change.',
  },
  {
    title: 'Learn',
    body: 'Freeze evaluators, keep measured improvements, and record failed experiments.',
  },
]

const repositorySuites = [
  {
    provider: 'Claude Code',
    name: 'decebal-claude-skills',
    href: 'https://github.com/decebal/decebal-claude-skills',
    detail: '54 skills · 20 Rust gate crates · 15 incident-backed rules',
  },
  {
    provider: 'OpenAI Codex',
    name: 'decebal-codex-skills',
    href: 'https://github.com/decebal/decebal-codex-skills',
    detail: '55 skills · 21 Rust gate crates · Chronis workflow',
  },
]

const ServicesSection = () => (
  <section id="services" aria-labelledby="services-title" className="relative scroll-mt-24">
    <span id="how-i-work" className="absolute -top-24" aria-hidden="true" />
    <div className="section-container">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
          Work with me
        </p>
        <h2
          id="services-title"
          className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl"
        >
          Ways to work together
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">
          Two focused paths for London and remote UK teams. Both combine hands-on engineering,
          technical leadership, and an evidence-led delivery system.
        </p>
      </header>

      <div className="mt-12 grid border-y border-white/15 lg:grid-cols-2 lg:divide-x lg:divide-white/15">
        {engagementPaths.map((path, index) => (
          <article
            key={path.title}
            data-testid="engagement-path"
            className="py-9 lg:px-10 lg:first:pl-0 lg:last:pr-0"
          >
            <div className="flex items-center justify-between gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand-teal">
                {String(index + 1).padStart(2, '0')} / {path.eyebrow}
              </p>
              <path.icon className="h-6 w-6 text-brand-teal" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold leading-tight text-white md:text-3xl">
              {path.title}
            </h3>
            <p className="mt-4 max-w-xl leading-7 text-gray-200">{path.summary}</p>
            <ul className="mt-7 space-y-3 border-l border-white/20 pl-5 text-sm leading-6 text-gray-100">
              {path.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
            <Link
              href={path.href}
              className="group mt-8 inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              {path.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-16 grid items-center gap-10 border-b border-white/15 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <figure>
          <Image
            src="/images/how-i-work-workflow.webp"
            alt="A five-stage 3D workflow moving from repository inspection through planning, building, verification, and measured experiments"
            width={1536}
            height={1024}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="h-auto w-full drop-shadow-[0_28px_45px_rgba(0,0,0,0.32)]"
          />
          <figcaption className="mt-2 text-center text-xs text-gray-300">
            Inspect → plan → build → gate → improve
          </figcaption>
        </figure>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            Delivery standard
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Evidence before confidence</h3>
          <p className="mt-4 max-w-2xl leading-7 text-gray-200">
            AI accelerates implementation; responsibility stays human. Scope, decisions, checks, and
            learning remain visible from first inspection through handover.
          </p>
          <ol className="mt-8 border-t border-white/15">
            {workflowStages.map((stage, index) => (
              <li
                key={stage.title}
                className="grid gap-2 border-b border-white/15 py-4 sm:grid-cols-[3rem_7rem_1fr] sm:items-baseline"
              >
                <span className="font-mono text-xs text-brand-teal">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-semibold text-white">{stage.title}</span>
                <span className="text-sm leading-6 text-gray-200">{stage.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            Public evidence
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Inspect the working system</h3>
          <p className="mt-3 max-w-md leading-7 text-gray-200">
            Provider-specific craft backed by portable rules, project templates, Chronis history,
            and executable Rust checks.
          </p>
        </div>
        <div className="divide-y divide-white/15 border-y border-white/15">
          {repositorySuites.map((suite) => (
            <a
              key={suite.name}
              href={suite.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid min-h-24 gap-2 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <span>
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-brand-teal">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {suite.provider}
                </span>
                <span className="mt-2 block text-lg font-semibold text-white group-hover:text-brand-teal">
                  {suite.name}
                </span>
              </span>
              <span className="text-sm text-gray-200 sm:text-right">
                {suite.detail}
                <span className="ml-2 text-brand-teal">↗</span>
              </span>
              <span className="sr-only">Inspect {suite.provider} suite</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-xs leading-5 text-gray-300">
          Outside-IR35 engagements remain subject to client determination, contract terms, and
          actual working practices. Every project selects gates matching its real risks and delivery
          contract.
        </p>
        <Link
          href="/services"
          className="group inline-flex min-h-12 shrink-0 items-center gap-2 font-semibold text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          Full services detail
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  </section>
)

export default ServicesSection
