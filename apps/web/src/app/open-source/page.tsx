import Footer from '@/components/Footer'
import { jsonLd } from '@/lib/structuredData'
import { ArrowRight, Github } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open-source Rust & Claude Projects',
  description:
    'Open-source work by Decebal Dobrica and Wolven Tech: Rust systems, Claude Code tooling, MCP infrastructure, and evaluated Rust examples.',
  alternates: { canonical: '/open-source' },
}

const projects = [
  {
    name: 'rust-v2',
    href: 'https://github.com/wolven-tech/rust-v2',
    owner: 'Wolven Tech',
    description:
      'MIT-licensed all-Rust monorepo: Axum API, Dioxus frontends, event sourcing, and AllSource as the datastore.',
    topics: ['Rust', 'Axum', 'Dioxus', 'event sourcing'],
  },
  {
    name: 'claude-healthline',
    href: 'https://github.com/decebal/claude-healthline',
    owner: 'Decebal Dobrica',
    description:
      'MIT-licensed Rust status line for Claude Code showing agent-health signals, MCP attention, context use, and live spend.',
    topics: ['Rust', 'Claude Code', 'MCP', 'developer tooling'],
  },
  {
    name: 'decebal-claude-skills',
    href: 'https://github.com/decebal/decebal-claude-skills',
    owner: 'Decebal Dobrica',
    description:
      'Claude Code skills, guides, and repository configuration used in practical agent workflows.',
    topics: ['Claude Code', 'skills', 'agent workflow'],
  },
  {
    name: 'curated-claude-skills',
    href: 'https://github.com/decebal/curated-claude-skills',
    owner: 'Decebal Dobrica',
    description:
      'A small skills collection selected for workflows that need durable memory, executable proof, or a real binary.',
    topics: ['Claude Code', 'skills', 'verification'],
  },
  {
    name: 'devcontainers-best-practices',
    href: 'https://github.com/decebal/devcontainers-best-practices',
    owner: 'Decebal Dobrica',
    description:
      'Dev Containers and Claude Code reference template with a supporting presentation.',
    topics: ['Dev Containers', 'Claude Code', 'environment'],
  },
  {
    name: 'rust-crate-radar',
    href: 'https://github.com/decebal/rust-crate-radar',
    owner: 'Decebal Dobrica',
    description:
      'MIT-licensed runnable examples used to evaluate Rust crates by maintenance, adoption risk, cost, and architectural fit.',
    topics: ['Rust', 'examples', 'technology radar'],
  },
  {
    name: 'mcp-log-server',
    href: 'https://github.com/wolven-tech/mcp-log-server',
    owner: 'Wolven Tech',
    description: 'MCP server work for making engineering logs accessible to tool-using agents.',
    topics: ['MCP', 'logs', 'agents'],
  },
]

export default function OpenSourcePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Open-source Rust and Claude projects by Decebal Dobrica',
    url: 'https://decebaldobrica.com/open-source',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.name,
        url: project.href,
      })),
    },
  }

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <main className="pb-20 pt-28">
        <div className="section-container max-w-6xl">
          <header className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
              Maintained in public
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">
              Open-source Rust and Claude projects
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-200">
              Current repositories I author or maintain with Wolven Tech. Descriptions and license
              labels below follow their GitHub metadata; each repository remains the primary source.
            </p>
          </header>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.href}
                className="rounded-xl border border-white/15 bg-white/5 p-6"
              >
                <p className="text-sm text-brand-teal">{project.owner}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{project.name}</h2>
                <p className="mt-4 leading-7 text-gray-200">{project.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.name} topics`}>
                  {project.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-100"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-brand-teal hover:underline"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                  View repository
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
