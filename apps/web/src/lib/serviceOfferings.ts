export interface ServiceOffering {
  slug: string
  title: string
  shortTitle: string
  description: string
  outcome: string
  bestFor: string[]
  deliverables: string[]
  method: Array<{ title: string; detail: string }>
  related: Array<{ href: string; label: string }>
  areaServed?: string
}

export const serviceOfferings: ServiceOffering[] = [
  {
    slug: 'rust-performance-optimization',
    title: 'Rust Performance Optimization for Production Systems',
    shortTitle: 'Rust performance optimization',
    description:
      'Profile and improve Rust services using measured CPU, memory, allocation, latency, and throughput evidence—not speculative micro-optimizations.',
    outcome:
      'A ranked performance model, reproducible benchmarks, narrow code changes, and proof showing which constraint moved and which did not.',
    bestFor: [
      'Rust APIs with high p95 or p99 latency',
      'Services whose memory or infrastructure cost has grown faster than traffic',
      'Async systems with lock contention, backpressure, or task saturation',
      'Teams that need a defensible baseline before a rewrite',
    ],
    deliverables: [
      'Workload and benchmark definition',
      'CPU, allocation, async-runtime, and I/O profile',
      'Ranked bottleneck report tied to source locations',
      'Reviewed patches with before-and-after measurements',
      'Regression checks suitable for CI',
    ],
    method: [
      {
        title: 'Reproduce',
        detail: 'Freeze representative inputs, traffic shape, hardware, and success metrics.',
      },
      {
        title: 'Profile',
        detail:
          'Measure hot paths, allocations, contention, queueing, and I/O wait before editing.',
      },
      {
        title: 'Change narrowly',
        detail: 'Optimize the responsible layer and keep architecture changes reversible.',
      },
      {
        title: 'Prove',
        detail: 'Run identical workloads, compare variance, and document remaining limits.',
      },
    ],
    related: [
      { href: '/rust', label: 'Rust engineering profile' },
      { href: '/work', label: 'Production case studies' },
      { href: '/services/rust-architecture-review', label: 'Rust architecture review' },
    ],
  },
  {
    slug: 'rust-architecture-review',
    title: 'Rust Architecture Review Before the Rewrite',
    shortTitle: 'Rust architecture review',
    description:
      'Independent review of Rust service boundaries, concurrency, persistence, failure handling, observability, and deployment risk.',
    outcome:
      'A decision-ready architecture map: what to keep, what to change, why it matters, and the safest sequence for doing it.',
    bestFor: [
      'Teams inheriting a Rust codebase',
      'Founders preparing for enterprise load or due diligence',
      'Systems split into services without clear ownership',
      'Projects debating refactor versus rewrite',
    ],
    deliverables: [
      'System and dependency map',
      'Reliability and data-integrity risk register',
      'Concurrency and failure-mode review',
      'Prioritized architecture decisions',
      'Implementation sequence with verification gates',
    ],
    method: [
      {
        title: 'Map',
        detail: 'Trace request, event, and data paths through code and deployment boundaries.',
      },
      {
        title: 'Challenge',
        detail: 'Test failure recovery, ownership, coupling, and operational assumptions.',
      },
      {
        title: 'Prioritize',
        detail: 'Separate urgent correctness risks from useful but non-blocking cleanup.',
      },
      {
        title: 'Hand over',
        detail: 'Deliver decisions your team can implement and verify without hidden context.',
      },
    ],
    related: [
      { href: '/services/architecture-docs', label: 'Architecture documentation' },
      { href: '/services/technical-due-diligence', label: 'Technical due diligence' },
      { href: '/work', label: 'Case studies' },
    ],
  },
  {
    slug: 'rust-migration',
    title: 'Incremental Migration to Rust',
    shortTitle: 'Rust migration',
    description:
      'Move performance- or reliability-critical paths to Rust through compatibility boundaries, parity tests, and reversible rollout steps.',
    outcome:
      'A migration that earns its complexity: selected by workload evidence, shipped behind stable interfaces, and measured in production.',
    bestFor: [
      'Node.js, Python, Go, or JVM services with a proven systems bottleneck',
      'Native extensions and data-processing paths',
      'Teams that cannot pause product work for a rewrite',
      'Products requiring predictable memory use or stronger safety guarantees',
    ],
    deliverables: [
      'Migration candidate and boundary assessment',
      'Compatibility contract and parity tests',
      'Rust implementation for the selected slice',
      'Dual-run or staged rollout plan',
      'Operational handover and benchmarks',
    ],
    method: [
      {
        title: 'Select',
        detail: 'Choose one bounded path where Rust can create measurable value.',
      },
      {
        title: 'Contract',
        detail: 'Freeze inputs, outputs, errors, and observability before replacing internals.',
      },
      {
        title: 'Run in parallel',
        detail: 'Compare old and new behavior on realistic traffic where practical.',
      },
      {
        title: 'Cut over',
        detail: 'Promote only after parity, performance, and rollback conditions pass.',
      },
    ],
    related: [
      { href: '/rust', label: 'Rust development' },
      { href: '/services/rust-performance-optimization', label: 'Performance optimization' },
      { href: '/contact?category=Rust+Migration', label: 'Discuss a migration' },
    ],
  },
  {
    slug: 'agentic-ai-architecture',
    title: 'Agentic AI Architecture with Durable State',
    shortTitle: 'Agentic AI architecture',
    description:
      'Design tool-using AI systems with explicit state, durable memory, permission boundaries, evaluation, and recovery paths.',
    outcome:
      'An agent architecture that can explain what happened, resume safely, and improve under evaluation instead of relying on prompt luck.',
    bestFor: [
      'Products moving from chat demos to multi-step workflows',
      'Agents that act across customer or tenant data',
      'Teams adding MCP tools or persistent memory',
      'Workflows that need approvals, replay, audit, or human handoff',
    ],
    deliverables: [
      'Agent state and tool-boundary model',
      'Memory and provenance design',
      'Permission and approval policy',
      'Evaluation cases and failure taxonomy',
      'Reference implementation or architecture decision record',
    ],
    method: [
      {
        title: 'Model state',
        detail:
          'Separate conversation context, durable facts, workflow state, and external system truth.',
      },
      {
        title: 'Constrain tools',
        detail: 'Define scoped capabilities, validation, idempotency, and approval points.',
      },
      {
        title: 'Instrument',
        detail: 'Record decisions and tool results so failures can be replayed and classified.',
      },
      {
        title: 'Evaluate',
        detail: 'Use fixed tasks and outcome checks before expanding autonomy.',
      },
    ],
    related: [
      { href: '/ai', label: 'AI engineering profile' },
      { href: 'https://www.all-source.xyz', label: 'AllSource durable agent memory' },
      { href: '/services/claude-code-consulting', label: 'Claude Code workflows' },
    ],
  },
  {
    slug: 'claude-code-consulting',
    title: 'Claude Code Workflows for Engineering Teams',
    shortTitle: 'Claude Code consulting',
    description:
      'Turn ad hoc AI coding into a repository-aware workflow with clear instructions, scoped tasks, tests, evidence, and review gates.',
    outcome:
      'Faster delivery without lowering the bar: documented agent rules, repeatable task flows, verification, and measurable adoption signals.',
    bestFor: [
      'Teams using Claude Code without consistent repository context',
      'Monorepos where agents create oversized or conflicting changes',
      'Leaders who need auditability and review boundaries',
      'Product teams building internal skills, MCP tools, or agent loops',
    ],
    deliverables: [
      'Repository instruction and context audit',
      'Task decomposition and review workflow',
      'Reusable skills or command patterns',
      'Testing and visual-evidence gates',
      'Adoption scorecard and operating guide',
    ],
    method: [
      {
        title: 'Observe',
        detail: 'Review real tasks, failure modes, tool access, and expensive context paths.',
      },
      {
        title: 'Codify',
        detail: 'Put stable rules near the code and keep task prompts focused on outcomes.',
      },
      {
        title: 'Gate',
        detail: 'Require proportionate tests, diffs, and visual proof for product-facing changes.',
      },
      {
        title: 'Measure',
        detail: 'Track cycle time, review churn, escaped defects, and developer confidence.',
      },
    ],
    related: [
      { href: '/ai', label: 'Agentic AI engineering' },
      { href: '/blog', label: 'AI engineering articles' },
      { href: '/contact?category=Claude+Code', label: 'Discuss team workflow' },
    ],
  },
  {
    slug: 'technical-due-diligence',
    title: 'Technical Due Diligence for Software Products',
    shortTitle: 'Technical due diligence',
    description:
      'Evidence-led review of architecture, delivery risk, security posture, operational maturity, and engineering claims for buyers and founders.',
    outcome:
      'A concise risk and capability report separating verified facts, reasonable inference, and unknowns that still need evidence.',
    bestFor: [
      'Founders preparing for investment or acquisition',
      'Buyers evaluating a software product or team',
      'Investors validating technical claims',
      'Leaders inheriting a platform after a transaction',
    ],
    deliverables: [
      'Architecture and codebase evidence review',
      'Delivery, reliability, security, and data-risk register',
      'Claim-to-evidence matrix',
      'Critical questions for management',
      'Prioritized remediation plan',
    ],
    method: [
      {
        title: 'Scope',
        detail: 'Define decision, evidence access, and material risk before reviewing.',
      },
      {
        title: 'Verify',
        detail: 'Trace claims to code, tests, operations, data, and deployment evidence.',
      },
      { title: 'Separate', detail: 'Label verified facts, inference, and unknowns explicitly.' },
      { title: 'Advise', detail: 'Rank findings by decision impact and remediation cost.' },
    ],
    related: [
      { href: '/services/rust-architecture-review', label: 'Architecture review' },
      { href: '/services/engineering-leadership', label: 'Engineering leadership' },
      { href: '/contact?category=Technical+Due+Diligence', label: 'Discuss diligence scope' },
    ],
  },
  {
    slug: 'fractional-cto-london',
    title: 'Fractional CTO for London Product Teams',
    shortTitle: 'Fractional CTO London',
    description:
      'Senior technical direction for London and remote product teams needing architecture, delivery discipline, hiring support, and executive clarity.',
    outcome:
      'Clear technical priorities, explicit decisions, and a delivery system the permanent team can operate without dependency on an interim leader.',
    bestFor: [
      'London startups between product validation and scale',
      'Founders without a senior technical counterpart',
      'Teams recovering from delivery or architecture drift',
      'Companies preparing to hire a permanent CTO or VP Engineering',
    ],
    deliverables: [
      'Technical strategy and operating priorities',
      'Architecture and delivery risk review',
      'Team topology and hiring plan',
      'Engineering metrics with clear decision use',
      'Handover plan for permanent leadership',
    ],
    method: [
      {
        title: 'Diagnose',
        detail: 'Map business goals to product, system, team, and delivery constraints.',
      },
      {
        title: 'Decide',
        detail: 'Create a short technical agenda with named owners and evidence gates.',
      },
      { title: 'Embed', detail: 'Work with the team on real delivery, not detached slideware.' },
      {
        title: 'Transfer',
        detail: 'Document decisions and build leadership capacity before exit.',
      },
    ],
    related: [
      { href: '/services/engineering-leadership', label: 'Engineering leadership offer' },
      { href: '/work', label: 'Leadership case studies' },
      { href: '/contact?category=Fractional+CTO', label: 'Discuss current constraints' },
    ],
    areaServed: 'London and remote',
  },
]

export function getServiceOffering(slug: string) {
  return serviceOfferings.find((offering) => offering.slug === slug)
}
