export type NavLink = { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Engagements', href: '/#engagements' },
  { label: 'Open Source', href: '/#artifacts' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/#about' },
]

export type ProofPoint = {
  value: string
  label: string
  sub: string
}

export const proofPoints: ProofPoint[] = [
  { value: '1M+', label: 'Lines of production Rust shipped', sub: 'across 4 platforms' },
  { value: '6–10×', label: 'Memory reduction', sub: 'vs. TypeScript services' },
  { value: '75%', label: 'Infrastructure cost cut', sub: 'serverless-first redesigns' },
  { value: '15+', label: 'Years shipping code', sub: 'fintech · SaaS · Web3' },
]

export type Service = {
  kicker: string
  title: string
  description: string
  scope: string[]
  price: string
}

export const services: Service[] = [
  {
    kicker: 'Fixed scope · 1–2 weeks',
    title: 'Technical Due Diligence',
    description:
      'For VC partners and acquirers evaluating a Rust-heavy or event-sourced codebase. We assess workspace health, clippy discipline, async boundaries, test coverage, observability, operational maturity, and security hygiene.',
    scope: ['Codebase audit', 'Architecture review', 'Risk register', 'Written report'],
    price: '48-hour turnaround available for time-sensitive deals.',
  },
  {
    kicker: 'Retainer · 1–3 days/week',
    title: 'Fractional Rust Architect',
    description:
      'Embedded on your platform team as a senior-to-staff architect. Code reviews, architecture decisions, team mentoring, and hands-on work when the hot path needs to ship. Typical terms: 3-month minimum, monthly retainer.',
    scope: ['Architecture', 'Code reviews', 'Mentoring', 'Hands-on'],
    price: 'Best fit: seed to Series B teams with < 10 Rust engineers.',
  },
  {
    kicker: 'Fixed scope · 4–12 weeks',
    title: 'Platform Sprint',
    description:
      'Design and build one concrete thing, end to end: an event-sourced service, an MCP server, a WASM migration, or a Tauri application. You get code, documentation, and a runbook. We show up, scope it, and ship it.',
    scope: ['Event sourcing', 'MCP / agents', 'WASM', 'Tauri'],
    price: 'Fixed fee. Weekly demos. Source license on delivery.',
  },
  {
    kicker: 'Monthly · async',
    title: 'Advisor',
    description:
      'A monthly architecture review and a staff-engineer sounding board. Async-first (written + Loom), with a 60-minute sync whenever you need one. Best for technical founders who want a second opinion they can trust.',
    scope: ['Monthly review', 'Async chat', '60-min sync'],
    price: 'Flat monthly retainer. Cancel any time.',
  },
]

export type Case = {
  tag: string
  title: string
  description: string
  facts: Array<{ n: string; l: string }>
  stack: string[]
  href?: string
  linkLabel?: string
}

export const cases: Case[] = [
  {
    tag: 'Desktop AI · Event Sourcing',
    title: 'Event-Sourced AI Desktop Platform',
    description:
      'Tauri 2 desktop app with embedded LLM agents and first-class MCP support, backed by a custom event store and projection engine. CI-enforced clean-architecture boundaries across a ten-crate workspace.',
    facts: [
      { n: '~145K', l: 'LOC Rust' },
      { n: '409', l: 'Tests (unit + integration)' },
      { n: '3', l: 'Criterion bench suites' },
    ],
    stack: ['tauri 2', 'tokio', 'axum', 'rig-core', 'rmcp', 'ts-rs', 'argon2', 'ed25519-dalek'],
  },
  {
    tag: 'Fintech · gRPC Microservices',
    title: 'Fintech Microservices Monorepo',
    description:
      'Thirteen-crate monorepo combining Tonic gRPC, Axum HTTP, compile-time-checked Postgres via SQLx, Redis caching, and an event-sourced domain layer using custom AggregateRoot / ApplyEvent traits. OpenTelemetry end-to-end.',
    facts: [
      { n: '~548K', l: 'LOC Rust' },
      { n: '3,295+', l: 'Test annotations' },
      { n: '595+', l: 'async_trait impls' },
    ],
    stack: [
      'axum',
      'tonic',
      'prost',
      'sqlx',
      'redis',
      'opentelemetry',
      'rusty-money',
      'testcontainers',
    ],
  },
  {
    tag: 'AllSource · Wolven Tech product',
    title: 'AllSource: Embedded Rust Event Store',
    description:
      'Embedded Rust event store with an AI-ready product suite. Four-crate Edition-2024 workspace with an Elixir NIF bridge. Write-ahead log + Parquet columnar storage with zero-copy Arrow IPC on the hot path; hybrid full-text + vector search via Tantivy, fastembed, and instant-distance. Seven-day durability stress harness validates correctness under concurrent writers and crash recovery.',
    facts: [
      { n: '~353K', l: 'LOC Rust' },
      { n: '1,998', l: 'Public handlers' },
      { n: '16+', l: 'Feature flags' },
    ],
    stack: [
      'arrow',
      'parquet',
      'datafusion',
      'tantivy',
      'fastembed',
      'rocksdb',
      'simd-json',
      'hotpath',
    ],
    href: 'https://www.all-source.xyz/',
    linkLabel: 'all-source.xyz',
  },
  {
    tag: 'SaaS · WASM Frontend',
    title: 'Event-Sourced SaaS with WASM Frontend',
    description:
      'Ten-crate workspace where domain crates dual-compile to native and wasm32. Leptos 0.8 client, Axum server, Stripe Connect via async-stripe, and better-auth bridged to a custom event-sourced database adapter. OpenAPI-driven contracts.',
    facts: [
      { n: '10', l: 'Workspace crates' },
      { n: '33+', l: 'Public endpoints' },
      { n: '8', l: 'Handler domains' },
    ],
    stack: ['axum', 'leptos', 'wasm-bindgen', 'async-stripe', 'better-auth', 'tower', 'openapi'],
  },
]

export type Artifact = {
  badge: string
  title: string
  code: string
  description: string
  href: string
  linkLabel: string
}

export const artifacts: Artifact[] = [
  {
    badge: 'crates.io',
    title: 'monorepo-meta',
    code: 'cargo install monorepo-meta',
    description:
      'Unified Rust task orchestrator for modern monorepos. Tokio + tmux, ~5 MB idle memory, 3000+ lines/sec log throughput, ~2.7 MB release binary. One command to run everything.',
    href: 'https://crates.io/crates/monorepo-meta',
    linkLabel: 'View on crates.io',
  },
  {
    badge: 'Template · MIT',
    title: 'wolven-tech/rust-v1',
    code: 'bunx degit wolven-tech/rust-v1',
    description:
      'Production-ready Rust (Axum + Clean Architecture) + Next.js monorepo template with the meta orchestrator, JSON status mode, and CI baked in. Latest release v0.7.1.',
    href: 'https://github.com/wolven-tech/rust-v1',
    linkLabel: 'View on GitHub',
  },
  {
    badge: 'Agent tooling',
    title: 'wolven-tech/mcp-log-server',
    code: 'mix run',
    description:
      'An Elixir Model Context Protocol log server built to support Rust agent workflows. Pairs with rig-core and rmcp-based Rust agents for structured, queryable logs.',
    href: 'https://github.com/wolven-tech/mcp-log-server',
    linkLabel: 'View on GitHub',
  },
  {
    badge: 'Framework',
    title: 'AllFrame',
    code: 'all-source-os.github.io/all-frame',
    description:
      'The Composable Rust API Framework. Write your handler once, expose it via REST, GraphQL, and gRPC. Built-in HTTP/2 server, compile-time DI, CQRS, and MCP -- all TDD from day zero.',
    href: 'https://all-source-os.github.io/all-frame',
    linkLabel: 'View on GitHub',
  },
]

export type Step = { num: string; title: string; body: string }

export const steps: Step[] = [
  {
    num: '01',
    title: 'Discovery (30 min)',
    body: 'A short call. I ask the hard questions, you get a written proposal within 48 hours.',
  },
  {
    num: '02',
    title: 'Scope & contract',
    body: 'Fixed fee, fixed outcome, fixed timeline. Retainers have a defined runway. No open-ended billing.',
  },
  {
    num: '03',
    title: 'Ship weekly',
    body: "Weekly demo, Loom recording, or PR. Whatever matches your team's rhythm. Progress is visible.",
  },
  {
    num: '04',
    title: 'Handover',
    body: 'Code, docs, runbook, architecture notes. Your team owns what we built. We disappear on request.',
  },
]

export const credentials: string[] = [
  '15+ years production software',
  '1M+ LOC Rust shipped (4 platforms)',
  'Author of AllSource (embedded Rust event store)',
  'Author of AllFrame (Rust framework)',
  'Technical Lead, Ebury (2025)',
  'Software Architect, Tellimer (2019–2023)',
  'Certified Fractional CTO (Tech Leaders)',
  'B.Sc. IT & Maths, Military Technical Academy',
  'Published: monorepo-meta on crates.io',
  'Based in London · Available worldwide (remote)',
]

export type SiteLink = { label: string; href: string }

export const socialLinks: SiteLink[] = [
  { label: 'decebaldobrica.com', href: 'https://decebaldobrica.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/decebaldobrica' },
  { label: 'github.com/wolven-tech', href: 'https://github.com/wolven-tech' },
  { label: '@ddonprogramming', href: 'https://x.com/ddonprogramming' },
]

export const contactEmail = 'discovery@decebaldobrica.com'

export type TerminalLine = {
  type: 'comment' | 'section' | 'entry' | 'prompt' | 'blank'
  key?: string
  value?: string
  text?: string
}

export const terminalManifest: TerminalLine[] = [
  { type: 'comment', text: '# what we refuse to compromise on' },
  { type: 'section', text: '[lints.rust]' },
  { type: 'entry', key: 'unsafe_code', value: '"forbid"' },
  { type: 'entry', key: 'unused_must_use', value: '"warn"' },
  { type: 'blank' },
  { type: 'section', text: '[principles]' },
  { type: 'entry', key: 'architecture', value: '"clean, ci-enforced"' },
  { type: 'entry', key: 'event_sourcing', value: '"first-class"' },
  { type: 'entry', key: 'observability', value: '"tracing + otel, always"' },
  { type: 'entry', key: 'benchmarks', value: '"criterion, checked-in"' },
  { type: 'entry', key: 'gen_ai', value: '"accelerator, not crutch"' },
  { type: 'blank' },
  {
    type: 'prompt',
    text: "$ cargo build --release # and we'll ship it.",
  },
]
