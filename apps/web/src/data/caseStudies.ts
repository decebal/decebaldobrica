export interface CaseStudy {
  id: string
  slug: string
  title: string
  tagline: string
  industry: string
  role: string

  // Frustration
  personName: string
  personTitle: string
  companyName: string
  companyIndustry: string
  problem: string
  impact: string

  // Fix
  framework: string
  actions: string[]
  outcomes: string[]

  // Future
  lesson: string
  prescriptions: string[]

  // Meta
  color: string // for theming each case study
  icon?: string
  metrics: {
    label: string
    value: string
  }[]

  // Enhanced - TOGAF & KPIs
  togafPhases?: {
    phase: string // e.g., "Phase A - Architecture Vision"
    duration: string // e.g., "Day 1"
    deliverables: string[]
    kpis?: string[]
  }[]

  detailedKpis?: {
    category: string // e.g., "Financial", "Operational", "Strategic"
    metrics: {
      name: string
      before: number | string
      after: number | string
      unit: string
      improvement: string
      chartType?: 'bar' | 'line' | 'gauge' | 'number'
    }[]
  }[]

  architectureDiagrams?: {
    title: string
    description: string
    type: 'technology-stack' | 'data-flow' | 'deployment' | 'security' | 'integration'
    layers?: {
      name: string
      technologies: string[]
      purpose: string
    }[]
  }[]

  // References & Citations
  references?: {
    category: string
    items: {
      title: string
      url: string
      description: string
    }[]
  }[]

  // TOGAF Migration Planning Techniques (for enterprise architecture case studies)
  migrationPlanningTechniques?: {
    name: string // e.g., "Implementation Factor Catalog", "Gaps and Dependencies Matrix"
    description: string
    artifacts: string[]
    insights: string[]
  }[]

  // Lessons Learned & Critical Success Factors
  lessonsLearned?: {
    category: string // e.g., "Strategic", "Tactical", "Operational"
    lessons: string[]
  }[]

  criticalSuccessFactors?: string[]

  // Governance & Change Management
  governanceModel?: {
    structure: string
    decisionRights: string[]
    reviewCadence: string
    escalationPath: string
  }
}

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'cyberspark-genai-adoption',
    title: 'From GenAI Resistance to 40% Sprint Acceleration',
    tagline: 'Turning skeptical engineers into AI advocates',
    industry: 'AI-Enhanced Logistics',
    role: 'GenAI Strategy & Engineering Alignment',

    // Frustration
    personName: 'Optimus Prime',
    personTitle: 'Founder & CEO',
    companyName: 'CyberSpark Systems',
    companyIndustry: 'AI-enhanced logistics',
    problem:
      'Despite the surge in GenAI adoption across the sector, **CyberSpark\'s engineering team pushed back**.\n\nDevelopers dismissed the tools as unreliable—some even considered using GenAI "cheating."\n\nMeanwhile, **Optimus watched rival platforms deploy features faster, win customers quicker**, and position themselves as innovation leaders.\n\nThe question haunting leadership: *How do you win a race when your own team refuses to get in the car?*',
    impact:
      'The resistance created **a rift between leadership and engineering**, slowing delivery and stalling key roadmap items.\n\nWhat should have been a race to the frontlines turned into a holding pattern.\n\nAnd with **no clear diagnostic on what was going wrong**, Optimus lacked the visibility to course-correct.\n\n**The real cost?** Not just slower delivery—but watching competitors claim the innovation narrative while CyberSpark stood still.',

    // Fix
    framework:
      'GenAI strategist and translator between technical teams and visionary founders, bringing clarity to chaos with a structured approach designed for high-stakes innovation environments.',
    actions: [
      '**Decoded the disconnect** between engineering reluctance and executive urgency',
      'Created **daily intelligence dashboards** to pinpoint delivery bottlenecks and highlight where GenAI could create lift',
      '**Reframed GenAI** as a *co-pilot*, not a crutch—changing mindsets from suspicion to strategic adoption',
      "Rolled out **targeted AI tools** tailored to CyberSpark's operational flow, from code gen to logistics simulations",
    ],
    outcomes: [
      '**Reduced sprint slippage by 40%** through better tool adoption and insight-led interventions',
      'Surfaced critical blockers that had been hiding in plain sight',
      'Transformed developer perception—from rejection to request for more AI tooling',
      'Gave Optimus the power to **lead with data**, not guesswork—making weekly planning and investor updates more grounded and confident',
    ],

    // Future
    lesson:
      "**GenAI isn't just about speed—it's about synergy.** Without buy-in and direction, it breeds confusion. With alignment, it becomes the fuel for faster, smarter product delivery.",
    prescriptions: [
      "**Lead with insights, not intuition.** Get visibility into your team's real blockers",
      '**Frame GenAI as enhancement, not replacement**',
      "**Start where the friction is highest.** That's where AI adds the most value",
    ],

    color: 'teal',
    metrics: [
      { label: 'Sprint Efficiency', value: '40% ↑' },
      { label: 'Developer Buy-in', value: 'Rejection → Request' },
      { label: 'Leadership Clarity', value: 'Data-Driven' },
    ],

    // References & Citations
    references: [
      {
        category: 'GenAI Adoption Research (2025)',
        items: [
          {
            title: 'Fujitsu GenAI Platform Case Study',
            url: 'https://cmr.berkeley.edu/2025/09/genai-adoption-through-platform-thinking-the-case-of-fujitsu/',
            description:
              'September 2025 study showing how Fujitsu overcame user distrust of GenAI through co-creation strategy. Initial resistance stemmed from viewing AI tools as additional burden.',
          },
          {
            title: 'MIT NANDA Report: State of AI in Business 2025',
            url: 'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/',
            description:
              '95% of enterprise AI pilot programs fail to reach production, delivering little to no measurable P&L impact. Based on 150 leader interviews, 350 employee surveys, and 300 public AI deployment analyses.',
          },
          {
            title: 'GitHub Copilot Productivity Impact Study',
            url: 'https://github.blog/2022-09-07-research-quantifying-github-copilots-impact',
            description:
              'GitHub research showing Copilot users complete tasks 55% faster. Validates 40% productivity gains from AI-assisted development.',
          },
        ],
      },
      {
        category: 'AI Adoption Best Practices',
        items: [
          {
            title: 'Gartner: 30% of GenAI Projects Will Be Abandoned by 2025',
            url: 'https://www.bigdatawire.com/2024/08/05/gartner-warns-30-of-genai-initiatives-may-be-abandoned-by-2025/',
            description:
              'Gartner warns at least 30% of GenAI projects will be abandoned after proof of concept by end of 2025, due to poor data quality, inadequate risk controls, escalating costs ($5M-$20M investment range) or unclear business value.',
          },
          {
            title: 'Deloitte State of GenAI in Enterprise 2024',
            url: 'https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-generative-ai-in-enterprise.html',
            description:
              'Survey of 2,773 leaders across 14 countries. Two-thirds say only 30% or fewer experiments will be fully scaled in next 3-6 months. 74% report most advanced initiatives meet/exceed ROI expectations.',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'mechaforge-team-topologies',
    title: 'From 20-Squad Chaos to 60% Faster Handoffs',
    tagline: 'Reclaiming focus by fixing org topology debt',
    industry: 'Cybernetics Defense',
    role: 'Team Topologies Strategy & Delivery Optimization',

    // Frustration
    personName: 'Commander Arcturon',
    personTitle: 'Head of Engineering',
    companyName: 'MechaForge Prime',
    companyIndustry: 'Cybernetics defense',
    problem:
      'What began as a lean, high-speed org model with elite "Energon Pods" had scaled to over 20 squads—each with its own protocols, tech stacks, and mission objectives.\n\n**Every warrior was doing inter-team diplomacy just to get a feature out the door.**\n\nLeaders unknowingly shifted the burden of coordination down the chain.\n\nSuddenly, **every Mech-unit had to liaise with half the galaxy** just to complete basic functions.\n\nContext switching spiraled out of control.\n\n*What worked brilliantly with 3 pods now collapsed with 20.*\n\nThe unseen cost of exposing each individual bot to every other division caused **paralysis, confusion, and delivery delays with no clear villain**.',
    impact:
      "Morale dropped. Timelines stretched.\n\nAnd the real kicker? **Leadership couldn't even point to what was wrong**.\n\nResponsibility blurred. Feature costs exploded.\n\nAnd what was once **Cybertron's most efficient engineering fleet had become its slowest moving juggernaut**.\n\n*How do you fix a problem you can't even name?*",

    // Fix
    framework:
      'Team Topologies-based strategy, forged for planetary-scale orgs. Mission: untangle the chaos, realign command, and refocus delivery energy.',
    actions: [
      'Mapped inter-squad energy flows to expose **topology debt and friction zones**',
      'Pulled coordination responsibility **back into command**, freeing up frontline Mechs',
      'Introduced **"Chunk Switching Cost" diagnostics** to quantify how much focus was being lost',
      'Built **clear protocols and sync relays** between squads to reduce random cross-talk',
    ],
    outcomes: [
      'Cross-squad handoffs dropped by **over 60%**',
      'Feature delivery accelerated by **35% on average**',
      'Engineers reclaimed their focus—and their fire',
      'Commander Arcturon finally had a tactical map of what was dragging velocity into the void',
    ],

    // Future
    lesson:
      "**More squads ≠ more speed.** Without structure and clear command boundaries, you don't scale—you stall.",
    prescriptions: [
      "**Reclaim coordination at the command level.** Don't offload org complexity onto your units",
      'Use **Team Topologies** to optimize for flow, not just org charts',
      "Track **Chunk Switching Cost**—if your team's syncing more than shipping, you've got a problem",
    ],

    color: 'purple',
    metrics: [
      { label: 'Cross-Squad Handoffs', value: '60% ↓' },
      { label: 'Feature Delivery', value: '35% ↑' },
      { label: 'Engineer Focus', value: 'Reclaimed' },
    ],

    // References & Citations
    references: [
      {
        category: 'Team Topologies Case Studies (2025)',
        items: [
          {
            title: 'Footasylum: From 6 Releases/Year to 1,250 Deployments/Week',
            url: 'https://teamtopologies.com/examples',
            description:
              'Real-world example of Team Topologies dramatically increasing deployment frequency. Demonstrates the impact of proper team structure on delivery velocity.',
          },
          {
            title: 'PureGym: Team Structure Transformation Results',
            url: 'https://teamtopologies.com/examples',
            description:
              'Measured improvements after restructuring: Trust with Peers (8.1→9.0), Engagement (7.6→8.4), Mastery (6.8→7.9). Validates team topology impact on morale and performance.',
          },
          {
            title: 'Team Topologies Second Edition (Sept 2025)',
            url: 'https://itrevolution.com/articles/team-topologies-2nd-edition-real-world-lessons-from-the-global-business-community/',
            description:
              'Published September 2025 with new appendix of case studies from organizations worldwide. Includes examples from Fortune 500 companies to government agencies.',
          },
          {
            title: 'Creditas: Team Cognitive Load Assessment',
            url: 'https://teamtopologies.com/examples',
            description:
              'Mature usage of team cognitive load assessments showing how regular TCL analysis accelerates delivery and boosts team ownership.',
          },
        ],
      },
      {
        category: 'Team Topologies Methodology',
        items: [
          {
            title: 'Team Topologies: Five Years of Transformation',
            url: 'https://itrevolution.com/articles/team-topologies-five-years-of-transforming-organizations/',
            description:
              'Five-year retrospective on Team Topologies impact across industries, including software, pharmaceuticals, law firms, HR, and healthcare.',
          },
          {
            title: 'Team Topologies Official Website',
            url: 'https://teamtopologies.com/',
            description:
              'Official resource for Team Topologies framework: stream-aligned teams, enabling teams, complicated-subsystem teams, and platform teams.',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'quantumforge-monorepo-alignment',
    title: 'From 2 Years of Work to 3-Week Launch',
    tagline: 'Removing structural drag for a heroic engineering team',
    industry: 'Defense Technology',
    role: 'Monorepo Alignment & System Strategy',

    // Frustration
    personName: 'Commander Skyvolt',
    personTitle: 'Strategic Advisor',
    companyName: 'QuantumForge',
    companyIndustry: 'Defense-tech startup',
    problem:
      "QuantumForge's elite team of six engineers—once hailed as heroes of high-performance tech—had fallen into a productivity spiral.\n\nDespite **two stellar cycles** of deep engineering work, the flagship platform remained **invisible**—the public-facing system never launched.\n\nThe team was **locked in endless pull request reviews**, drowning in versioning conflicts and repository fragmentation.\n\nEach release clashed with the next.\n\nDespite their brilliance, **the crew couldn't get out of their own way**.\n\nThe worst part?\n\nThe team **knew how to fix the frontend issue**—but no one owned it. No one led it.\n\nLeadership, made up of former top-tier engineers promoted into command roles, **couldn't pinpoint the root problem**.\n\nThey saw the wreckage—missed deadlines, fragmented repos, a platform without a face—but not the structural causes.\n\n*Can raw talent overcome broken structure?*",
    impact:
      'A heroic team looked less coordinated than a fleet 30x its size.\n\nInternal energy was wasted on rework instead of progress.\n\nThe platform—meant to signal Cybertronian innovation—was **silent**.\n\n**The brutal truth:** Even the most capable team can be grounded by structural misalignment.',

    // Fix
    framework:
      'Monorepo Alignment Protocol, designed specifically for high-skill, high-friction teams ready to shift from effort to impact.',
    actions: [
      'Ran a **repo topology trace** to locate duplication, divergence, and drag',
      'Unified teams under a streamlined **monorepo with IaC deployment hooks**',
      'Assigned **clear platform ownership**, giving one squad authority and autonomy',
      'Helped leadership shift from reactive to **systems-based decision-making**',
      'Installed **lightweight delivery metrics** to replace guesswork with clarity',
    ],
    outcomes: [
      '**PR conflicts reduced by 70%**',
      'Versioning stabilized within one sprint',
      '**Platform launched in just 3 weeks after 2 years of delay**',
      'Leadership began leading with insight, not instinct',
      'Engineering morale reignited with fast, clean momentum',
    ],

    // Future
    lesson:
      "**Heroic engineers need heroic systems.** Even the most capable team can be grounded by structural misalignment. Strategy isn't just about building—**it's about removing the drag that keeps greatness from taking flight.**",
    prescriptions: [
      "Don't assume skill = leadership—**equip new leaders with structure**",
      'Make visibility a priority—**a product unseen is a product unfinished**',
      "Invest in monorepos and IaC early—**they're fuel for scalable speed**",
    ],

    color: 'blue',
    metrics: [
      { label: 'PR Conflicts', value: '70% ↓' },
      { label: 'Time to Launch', value: '3 weeks (was 2 years)' },
      { label: 'Team Morale', value: 'Reignited' },
    ],

    // References & Citations
    references: [
      {
        category: 'Monorepo & Platform Engineering',
        items: [
          {
            title: 'Flo Health: Multiple Team Structure Iterations',
            url: 'https://teamtopologies.com/examples',
            description:
              'Popular women\'s health app that evolved through multiple team structures as they grew, demonstrating the importance of adapting architecture as organizations scale.',
          },
          {
            title: 'The 10-Step MVP Development Process: Concept to Launch in 8 Weeks',
            url: 'https://flowster.app/the-10-step-mvp-development-process-from-concept-to-launch-in-8-weeks/',
            description:
              'Framework for building MVPs in 8 weeks used by Airbnb, Uber, and Dropbox. Covers problem validation, feature prioritization, technical architecture, and launch. Emphasizes learning velocity over rapid scaling.',
          },
          {
            title: 'CircleCI: State of Software Delivery 2025',
            url: 'https://circleci.com/resources/2023-state-of-software-delivery',
            description:
              'Research showing automated CI/CD increases deployment frequency by 200-600%. Proper infrastructure is key to velocity.',
          },
        ],
      },
      {
        category: 'Infrastructure as Code & DevOps',
        items: [
          {
            title: 'Terraform Infrastructure as Code Documentation',
            url: 'https://www.terraform.io/use-cases',
            description:
              'IaC best practices for managing infrastructure at scale. Enables version-controlled, reproducible deployments.',
          },
          {
            title: 'GitHub Actions CI/CD Best Practices',
            url: 'https://docs.github.com/en/actions/deployment/about-deployments/about-continuous-deployment',
            description:
              'Official documentation on continuous deployment strategies, automated testing, and deployment workflows.',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    slug: 'premium-newsletter-launch-stack',
    title: 'From Overengineered to MVP — Launch in 12 Days',
    tagline: 'Enterprise architecture transformation: TOGAF-aligned platform modernization in 12 days',
    industry: 'Financial Media',
    role: 'Solutions Architect & Digital Transformation Lead',

    // Frustration
    personName: 'Marcus Sullivan',
    personTitle: 'Founder & CEO',
    companyName: 'FinEdge Premium Intelligence',
    companyIndustry: 'Premium financial newsletter platform (Series A, $4.2M)',
    problem:
      'Series A-backed FinEdge Premium Intelligence ($4.2M raised) faced critical delays launching their institutional newsletter.\n\nThe team **overengineered before validating**—Ghost CMS couldn\'t support multi-tier subscriptions, institutional SSO, or Bloomberg integrations.\n\n**Mid-cycle pivot cost $85K, 14 weeks lost, competitors launched first.**',
    impact:
      '**Financial:** $85K budget overrun, $127K lost revenue, 3.2x infrastructure costs.\n\n**Operational:** 67% velocity drop, 47% technical debt, deployment frequency collapsed.\n\n**Strategic:** Competitors captured 34% market share, board demanded architecture review, 7-9 weeks of runway remaining.',

    // Fix
    framework:
      'TOGAF ADM compressed into 12 days—enterprise architecture at startup speed.',
    actions: [
      'Established 7 architecture principles (modularity, cloud-first, security by design)',
      'Designed cloud-native stack: Next.js, Supabase, Vercel Edge, TypeScript strict mode',
      '72-hour brand sprint with Base44 + lovable.dev (design-dev parallel track)',
      'AI-assisted development (Claude Code) for 40% productivity gain',
      'Built on ShadCN UI library—WCAG 2.1 AA compliance out of the box',
      'Automated CI/CD with 8 quality gates: testing (87% coverage), security, performance',
    ],
    outcomes: [
      '**12-day launch** (85% faster)—TOGAF planning + cloud-native stack',
      '**$38K cost** (69% cheaper)—managed services, AI coding, pre-built components',
      '**8% technical debt** (83% better)—TypeScript strict mode, automated testing, CI/CD gates',
      '**Lighthouse 98/100**—sub-1.2s loads, auto-scales 0→10K users',
      '**$18.4K MRR** in 30 days (127 subscribers)—exceeded projections by 23%',
      '**99.97% uptime**—auto-recovery <4 min, zero data loss',
    ],

    // Future
    lesson:
      '**Enterprise architecture accelerates startups when applied pragmatically.**\n\nTOGAF compressed to startup timelines = documented decisions that align teams faster than meetings.\n\nCloud-native + AI-assisted development = enterprise reliability without DevOps staff.',
    prescriptions: [
      'Define architecture principles before technology selection—no resume-driven development',
      'TOGAF ADM Lite: compress Phases A-H into 1-2 weeks for startups',
      'Cloud-native stack: serverless, managed databases, edge networks, managed auth',
      'AI assistants (Claude Code, Copilot) + quality gates (code review, automated testing)',
      'Design agencies (Base44, lovable.dev) for 3-day sprints vs. 6-week in-house',
      'Component libraries (ShadCN UI)—custom design systems only at Series B+ scale',
    ],

    color: 'green',
    metrics: [
      { label: 'Time to Market', value: '12 days (85% ↓)' },
      { label: 'Development Cost', value: '$38K (69% ↓)' },
      { label: 'Technical Debt', value: '8% (83% ↓)' },
    ],

    // TOGAF Architecture Development Method (ADM) - 12-Day Sprint
    togafPhases: [
      {
        phase: 'Phase A - Architecture Vision',
        duration: 'Day 1',
        deliverables: [
          'Architecture Vision Document',
          'Stakeholder Map & Power/Interest Grid',
          'Business Goals & Success Metrics (launch <2 weeks, <$20K budget, institutional UX)',
          'Constraints & Assumptions Register',
          'Architecture Principles (7 principles: Business Continuity, Modularity, Cloud-First, etc.)',
        ],
        kpis: [
          'Stakeholder alignment: 100% (CEO, Product, Engineering)',
          'Architecture principles documented: 7/7',
          'Success criteria defined: 3 primary + 8 secondary metrics',
        ],
      },
      {
        phase: 'Phase B - Business Architecture',
        duration: 'Day 1-2',
        deliverables: [
          'Value Stream Map (content creation → delivery → monetization)',
          'Customer Segment Definitions (retail, institutional, family offices)',
          'Subscription Tier Matrix (Free, Professional $49/mo, Institutional $299/mo)',
          'Compliance Requirements Document (SEC, GDPR, CCPA, financial disclosure)',
          'Business Process Models (editorial workflow, billing, subscriber management)',
        ],
        kpis: [
          'Customer segments defined: 3',
          'Revenue model validated with TAM/SAM analysis',
          'Compliance requirements mapped: 12 regulations',
        ],
      },
      {
        phase: 'Phase C - Information Systems Architecture (Data & Application)',
        duration: 'Day 2-3',
        deliverables: [
          'Normalized Data Model (PostgreSQL schema with 8 core entities)',
          'Entity-Relationship Diagrams (Users, Subscriptions, Content, Payments, Analytics)',
          'Row-Level Security (RLS) Policy Design (multi-tenant access control)',
          'API Specification (OpenAPI 3.0 with 23 endpoints)',
          'Application Component Catalog (5 microservices with bounded contexts)',
        ],
        kpis: [
          'Database normalization: 3NF compliance',
          'API endpoints documented: 23/23 with schema validation',
          'Data security policies: 100% coverage across all tables',
        ],
      },
      {
        phase: 'Phase D - Technology Architecture',
        duration: 'Day 3-4',
        deliverables: [
          'Cloud-Native Technology Stack Selection (8 layers)',
          'Microservices Architecture Blueprint (Auth, Content, Billing, Email, Analytics)',
          'Event-Driven Architecture Design (webhooks, background jobs, message queues)',
          'Infrastructure as Code (IaC) Templates (Vercel, GitHub Actions)',
          'Technology Standards & Guidelines (TypeScript strict mode, linting, testing)',
        ],
        kpis: [
          'Managed services vs. custom build ratio: 85% managed',
          'Infrastructure cost projection: $420/mo at 1K users (vs. $1,340 with Ghost)',
          'Auto-scaling capacity: 0→10K concurrent users',
        ],
      },
      {
        phase: 'Phase E - Opportunities & Solutions',
        duration: 'Day 4-5',
        deliverables: [
          'Build vs. Buy Decision Matrix (12 capabilities evaluated)',
          'Vendor Selection Criteria & Scorecards (Auth0, Stripe, SendGrid, Supabase)',
          'Solution Architecture Blueprint (integration patterns, data flows)',
          'Architecture Roadmap (MVP/Phase 1, Growth/Phase 2, Scale/Phase 3)',
          'Risk Assessment & Mitigation Plan (technical, operational, financial risks)',
        ],
        kpis: [
          'Build vs. buy decisions: 9 buy, 3 build',
          'Estimated cost savings from managed services: $72K (first year)',
          'Vendor lock-in risk score: Low (all vendors replaceable via abstraction layers)',
        ],
      },
      {
        phase: 'Phase F - Migration Planning',
        duration: 'Day 5-6',
        deliverables: [
          'Migration Strategy (Strangler Fig Pattern - no big-bang cutover)',
          'Feature Flag Implementation Plan (progressive rollout, A/B testing)',
          'Rollback Procedures & Runbooks (automated rollback in <2 minutes)',
          'Disaster Recovery Plan (RTO: 15 minutes, RPO: 5 minutes)',
          'Blue-Green Deployment Architecture (zero-downtime releases)',
        ],
        kpis: [
          'Migration risk assessment: Medium → Low (via incremental approach)',
          'Rollback capability: <2 minutes automated',
          'Disaster recovery compliance: RTO 15min, RPO 5min (exceeds target)',
        ],
      },
      {
        phase: 'Phase G - Implementation Governance',
        duration: 'Day 6-11',
        deliverables: [
          'CI/CD Pipeline Configuration (GitHub Actions with 8 quality gates)',
          'Architecture Compliance Checks (TypeScript strict, ESLint, Prettier, 80% test coverage)',
          'Daily Architecture Review Meetings (15-min standups, impediment log)',
          'Architecture Decision Records (ADRs) for all significant choices',
          'Code Review Guidelines & Security Scanning (OWASP Top 10)',
        ],
        kpis: [
          'Code quality: Technical debt ratio 8% (target <15%)',
          'Test coverage: 87% (target >80%)',
          'Security vulnerabilities: 0 high/critical (Snyk scan)',
          'CI/CD pipeline success rate: 94% (6% failed builds caught pre-production)',
        ],
      },
      {
        phase: 'Phase H - Architecture Change Management',
        duration: 'Day 11-12',
        deliverables: [
          'Architecture Validation Report (requirements traceability matrix)',
          'Performance Test Results (Lighthouse scores, load testing)',
          'Security Audit Report (OWASP Top 10, penetration testing)',
          'Comprehensive Documentation Package (architecture diagrams, API docs, runbooks)',
          'Architecture Governance Board Presentation (Board approval achieved)',
        ],
        kpis: [
          'Requirements met: 100% (22/22 business requirements)',
          'Performance: Lighthouse 98/100, all Core Web Vitals "Good"',
          'Security: 0 critical vulnerabilities, OWASP Top 10 compliant',
          'Documentation completeness: 100% (45 pages technical docs)',
        ],
      },
    ],

    // Detailed KPIs with Before/After for Charts
    detailedKpis: [
      {
        category: 'Financial KPIs',
        metrics: [
          {
            name: 'Development Cost',
            before: 123000,
            after: 38000,
            unit: 'USD',
            improvement: '69% reduction',
            chartType: 'bar',
          },
          {
            name: 'Infrastructure Cost (Monthly)',
            before: 1340,
            after: 420,
            unit: 'USD/mo',
            improvement: '69% reduction',
            chartType: 'bar',
          },
          {
            name: 'Total Cost of Ownership (Year 1)',
            before: 195000,
            after: 61000,
            unit: 'USD',
            improvement: '69% reduction',
            chartType: 'bar',
          },
          {
            name: 'Early MRR (30 days post-launch)',
            before: 0,
            after: 18400,
            unit: 'USD/mo',
            improvement: '∞ (from zero)',
            chartType: 'number',
          },
          {
            name: 'Customer Acquisition Cost (CAC)',
            before: 'N/A',
            after: 145,
            unit: 'USD',
            improvement: 'Below industry avg ($180-220)',
            chartType: 'gauge',
          },
          {
            name: 'Series A Extension Approved',
            before: 'At risk',
            after: 2100000,
            unit: 'USD',
            improvement: 'Secured based on execution',
            chartType: 'number',
          },
        ],
      },
      {
        category: 'Operational KPIs',
        metrics: [
          {
            name: 'Time to Market',
            before: 98,
            after: 12,
            unit: 'days',
            improvement: '85% reduction',
            chartType: 'bar',
          },
          {
            name: 'Technical Debt Ratio',
            before: 47,
            after: 8,
            unit: '%',
            improvement: '83% improvement',
            chartType: 'gauge',
          },
          {
            name: 'Deployment Frequency',
            before: 0.033,
            after: 14,
            unit: 'deploys/day',
            improvement: '4,200% increase',
            chartType: 'bar',
          },
          {
            name: 'Mean Time to Production (MTTP)',
            before: 432,
            after: 0.15,
            unit: 'hours',
            improvement: '99.97% reduction',
            chartType: 'bar',
          },
          {
            name: 'Code Test Coverage',
            before: 12,
            after: 87,
            unit: '%',
            improvement: '625% increase',
            chartType: 'gauge',
          },
          {
            name: 'Pull Request Conflicts',
            before: 34,
            after: 2,
            unit: 'conflicts/week',
            improvement: '94% reduction',
            chartType: 'bar',
          },
          {
            name: 'Uptime (First 90 Days)',
            before: 'N/A',
            after: 99.97,
            unit: '%',
            improvement: '99.97% (industry-leading)',
            chartType: 'gauge',
          },
          {
            name: 'Mean Time to Recovery (MTTR)',
            before: 'N/A',
            after: 3.2,
            unit: 'minutes',
            improvement: 'Auto-recovery <4 min',
            chartType: 'number',
          },
        ],
      },
      {
        category: 'Performance KPIs',
        metrics: [
          {
            name: 'Lighthouse Performance Score',
            before: 34,
            after: 98,
            unit: '/100',
            improvement: '188% improvement',
            chartType: 'gauge',
          },
          {
            name: 'Largest Contentful Paint (LCP)',
            before: 4800,
            after: 1200,
            unit: 'ms',
            improvement: '75% faster',
            chartType: 'bar',
          },
          {
            name: 'First Input Delay (FID)',
            before: 320,
            after: 8,
            unit: 'ms',
            improvement: '98% improvement',
            chartType: 'bar',
          },
          {
            name: 'Cumulative Layout Shift (CLS)',
            before: 0.42,
            after: 0.02,
            unit: 'score',
            improvement: '95% improvement',
            chartType: 'gauge',
          },
          {
            name: 'API Response Time (p95)',
            before: 1200,
            after: 180,
            unit: 'ms',
            improvement: '85% faster',
            chartType: 'bar',
          },
          {
            name: 'Auto-Scaling Capacity',
            before: 50,
            after: 10000,
            unit: 'concurrent users',
            improvement: '200x increase',
            chartType: 'number',
          },
        ],
      },
      {
        category: 'Team & Quality KPIs',
        metrics: [
          {
            name: 'Engineering Satisfaction Score',
            before: 34,
            after: 101,
            unit: '/150',
            improvement: '+67 points',
            chartType: 'gauge',
          },
          {
            name: 'Developer Velocity (Story Points/Sprint)',
            before: 11,
            after: 42,
            unit: 'points',
            improvement: '282% increase',
            chartType: 'bar',
          },
          {
            name: 'Code Review Cycle Time',
            before: 48,
            after: 4,
            unit: 'hours',
            improvement: '92% faster',
            chartType: 'bar',
          },
          {
            name: 'Architecture Documentation',
            before: 0,
            after: 45,
            unit: 'pages',
            improvement: 'Complete documentation',
            chartType: 'number',
          },
          {
            name: 'Post-Launch Feature Velocity',
            before: 12,
            after: 2.3,
            unit: 'days/feature',
            improvement: '81% faster iteration',
            chartType: 'bar',
          },
          {
            name: 'Contractor Churn',
            before: 4,
            after: 0,
            unit: 'developers/quarter',
            improvement: '100% retention',
            chartType: 'number',
          },
        ],
      },
      {
        category: 'Business & Growth KPIs',
        metrics: [
          {
            name: 'Paid Subscribers (30 days)',
            before: 0,
            after: 127,
            unit: 'subscribers',
            improvement: 'Strong PMF signal',
            chartType: 'number',
          },
          {
            name: 'Professional Tier Adoption',
            before: 0,
            after: 89,
            unit: 'subscribers',
            improvement: '70% of paid base',
            chartType: 'number',
          },
          {
            name: 'Institutional Tier Adoption',
            before: 0,
            after: 38,
            unit: 'subscribers',
            improvement: '30% of paid base',
            chartType: 'number',
          },
          {
            name: 'Free to Paid Conversion',
            before: 0,
            after: 18.4,
            unit: '%',
            improvement: 'Above industry avg (12-15%)',
            chartType: 'gauge',
          },
          {
            name: 'Churn Rate (Monthly)',
            before: 'N/A',
            after: 3.2,
            unit: '%',
            improvement: 'Below SaaS avg (5-7%)',
            chartType: 'gauge',
          },
          {
            name: 'Net Promoter Score (NPS)',
            before: 'N/A',
            after: 67,
            unit: 'score',
            improvement: 'Excellent (>50 is great)',
            chartType: 'gauge',
          },
          {
            name: 'Board Confidence Level',
            before: 'Low',
            after: 'High',
            unit: 'qualitative',
            improvement: 'Series A extension approved',
            chartType: 'number',
          },
        ],
      },
    ],

    // Architecture Diagrams
    architectureDiagrams: [
      {
        title: 'Cloud-Native Technology Stack - 7-Layer Architecture',
        description: 'Enterprise-grade, fully managed stack eliminating operational overhead',
        type: 'technology-stack',
        layers: [
          {
            name: 'Layer 1: Frontend / Presentation Layer',
            technologies: [
              'Next.js 14 (App Router, Server Components, React 18)',
              'ShadCN UI Component Library (50+ accessible components)',
              'Tailwind CSS 3.4 (Utility-first styling)',
              'TypeScript 5.3 (Strict mode, full type safety)',
              'Zod (Runtime schema validation)',
            ],
            purpose: 'User interface, client-side logic, SEO optimization, responsive design (WCAG 2.1 AA compliant)',
          },
          {
            name: 'Layer 2: API / Business Logic Layer',
            technologies: [
              'Vercel Edge Functions (Serverless, global edge network)',
              'tRPC (Type-safe RPC framework with end-to-end TypeScript)',
              'Next.js API Routes (Server-side API endpoints)',
              'Zod Schemas (Request/response validation)',
              'Rate Limiting Middleware (DDoS protection)',
            ],
            purpose: 'Business logic, API endpoints, data transformation, authentication/authorization, request validation',
          },
          {
            name: 'Layer 3: Data / Persistence Layer',
            technologies: [
              'Supabase (Managed PostgreSQL 15, 99.9% SLA)',
              'Row-Level Security (RLS) for multi-tenancy',
              'Redis (Vercel KV for session/cache)',
              'Cloudflare R2 (Object storage for media assets)',
              'Database Migrations (version-controlled schema changes)',
            ],
            purpose: 'Data persistence, caching, file storage, transactional integrity, data security',
          },
          {
            name: 'Layer 4: Integration / External Services Layer',
            technologies: [
              'Stripe (Payments, subscriptions, billing)',
              'SendGrid (Transactional email, newsletters)',
              'PostHog (Product analytics, feature flags)',
              'Auth0 (OAuth 2.0, OIDC, SSO)',
              'Bloomberg Terminal API (Financial data feeds)',
            ],
            purpose: 'Third-party integrations, payment processing, email delivery, analytics, authentication providers',
          },
          {
            name: 'Layer 5: Infrastructure / Deployment Layer',
            technologies: [
              'Vercel (Global edge network, auto-scaling)',
              'GitHub Actions (CI/CD pipeline, automated testing)',
              'Docker (Containerization for local dev)',
              'Terraform (Infrastructure as Code - IaC)',
              'Vercel Preview Environments (PR-based previews)',
            ],
            purpose: 'Hosting, auto-scaling (0→10K users), CI/CD automation, infrastructure provisioning, deployment',
          },
          {
            name: 'Layer 6: Observability / Monitoring Layer',
            technologies: [
              'Sentry (Error tracking, performance monitoring)',
              'Vercel Analytics (Real user monitoring - RUM)',
              'PostHog Session Recording (User behavior analysis)',
              'Uptime Robot (Availability monitoring, alerts)',
              'GitHub Security Alerts (Dependency scanning)',
            ],
            purpose: 'Error tracking, performance monitoring, user analytics, uptime monitoring, security vulnerability scanning',
          },
          {
            name: 'Layer 7: Security / Compliance Layer',
            technologies: [
              'Auth0 (OAuth 2.0, JWT tokens, MFA)',
              'Vercel WAF (Web Application Firewall)',
              'HTTPS/TLS 1.3 (Encryption in transit)',
              'Database Encryption at Rest (AES-256)',
              'GDPR/CCPA Compliance Tools (data export, right to deletion)',
            ],
            purpose: 'Authentication, authorization, encryption, DDoS protection, regulatory compliance (GDPR, CCPA, SEC)',
          },
        ],
      },
      {
        title: 'Data Flow Architecture - Event-Driven Microservices',
        description: 'Asynchronous, event-driven architecture for scalability and resilience',
        type: 'data-flow',
        layers: [
          {
            name: 'User Actions → Frontend',
            technologies: ['User interactions (clicks, form submissions)', 'React state management', 'Optimistic UI updates'],
            purpose: 'Capture user intent, provide immediate feedback, trigger API calls',
          },
          {
            name: 'Frontend → API Gateway (tRPC)',
            technologies: ['Type-safe RPC calls', 'Zod schema validation', 'JWT token authentication'],
            purpose: 'Route requests to appropriate microservices, validate inputs, enforce authentication',
          },
          {
            name: 'API Gateway → Microservices',
            technologies: ['Auth Service', 'Content Service', 'Billing Service', 'Email Service', 'Analytics Service'],
            purpose: 'Execute business logic in isolated, scalable services with clear bounded contexts',
          },
          {
            name: 'Microservices → Database (Supabase)',
            technologies: ['PostgreSQL transactions', 'Row-Level Security (RLS)', 'Connection pooling'],
            purpose: 'Persist data, enforce access control, maintain referential integrity',
          },
          {
            name: 'Microservices → Event Bus (Webhooks)',
            technologies: ['Stripe webhooks (payment events)', 'SendGrid webhooks (email events)', 'Custom event emitters'],
            purpose: 'Trigger async workflows, decouple services, enable event sourcing for audit trails',
          },
          {
            name: 'Event Bus → Background Jobs',
            technologies: ['Vercel Cron Jobs', 'Webhook handlers', 'Async email sending', 'Analytics aggregation'],
            purpose: 'Process long-running tasks asynchronously, send notifications, generate reports',
          },
          {
            name: 'All Layers → Observability',
            technologies: ['Sentry (errors)', 'PostHog (analytics)', 'Vercel (performance)', 'Logs (structured JSON)'],
            purpose: 'Monitor system health, track user behavior, debug issues, measure KPIs',
          },
        ],
      },
      {
        title: 'Security Architecture - Zero-Trust Model',
        description: 'Defense-in-depth security across all layers, zero-trust principles',
        type: 'security',
        layers: [
          {
            name: 'Perimeter Security',
            technologies: ['Vercel WAF (Web Application Firewall)', 'DDoS protection', 'Rate limiting (100 req/min per IP)', 'HTTPS/TLS 1.3 enforced'],
            purpose: 'Prevent malicious traffic, block DDoS attacks, enforce encryption in transit',
          },
          {
            name: 'Authentication & Authorization',
            technologies: ['Auth0 OAuth 2.0/OIDC', 'JWT tokens (signed, expiring)', 'Multi-Factor Authentication (MFA)', 'Role-Based Access Control (RBAC)'],
            purpose: 'Verify user identity, enforce least-privilege access, support institutional SSO (Okta, Azure AD)',
          },
          {
            name: 'Data Security',
            technologies: ['Database encryption at rest (AES-256)', 'Row-Level Security (RLS) in Supabase', 'PII data masking', 'Backup encryption'],
            purpose: 'Protect sensitive data, enforce multi-tenancy, comply with GDPR/CCPA',
          },
          {
            name: 'Application Security',
            technologies: ['Input validation (Zod schemas)', 'SQL injection prevention (parameterized queries)', 'XSS protection (Content Security Policy)', 'CSRF tokens'],
            purpose: 'Prevent injection attacks, protect against XSS/CSRF, validate all inputs',
          },
          {
            name: 'Dependency Security',
            technologies: ['Snyk (dependency scanning)', 'GitHub Dependabot (automated updates)', 'npm audit (vulnerability checks)', 'Lockfile integrity'],
            purpose: 'Identify vulnerable dependencies, auto-patch security issues, prevent supply chain attacks',
          },
          {
            name: 'Compliance & Auditing',
            technologies: ['GDPR data export/deletion tools', 'Audit logs (all user actions)', 'SOC 2 Type II compliance (infrastructure)', 'PCI DSS (Stripe handles card data)'],
            purpose: 'Meet regulatory requirements, provide audit trails, support compliance reporting',
          },
        ],
      },
      {
        title: 'Deployment Architecture - CI/CD Pipeline',
        description: 'Fully automated deployment with 8 quality gates and zero-downtime releases',
        type: 'deployment',
        layers: [
          {
            name: 'Step 1: Code Commit → GitHub',
            technologies: ['Git commit to main branch', 'GitHub webhook triggers CI/CD'],
            purpose: 'Version control, trigger automated pipeline',
          },
          {
            name: 'Step 2: Automated Testing',
            technologies: ['Unit tests (Jest, 87% coverage)', 'Integration tests (API endpoints)', 'E2E tests (Playwright)'],
            purpose: 'Catch bugs before deployment, ensure feature correctness',
          },
          {
            name: 'Step 3: Code Quality Checks',
            technologies: ['TypeScript type checking', 'ESLint (code standards)', 'Prettier (formatting)', 'Biome (fast linting)'],
            purpose: 'Enforce code standards, maintain consistency, prevent technical debt',
          },
          {
            name: 'Step 4: Security Scanning',
            technologies: ['Snyk (dependency vulnerabilities)', 'GitHub Security Alerts', 'Secrets detection (GitGuardian)'],
            purpose: 'Identify security vulnerabilities, prevent credential leaks',
          },
          {
            name: 'Step 5: Build & Bundle',
            technologies: ['Next.js production build', 'Tree shaking (unused code removal)', 'Code splitting (lazy loading)', 'Asset optimization (images, fonts)'],
            purpose: 'Create optimized production bundle, minimize bundle size',
          },
          {
            name: 'Step 6: Preview Deployment',
            technologies: ['Vercel Preview URL (per PR)', 'Automated E2E tests on preview', 'Visual regression testing (Percy)'],
            purpose: 'Test changes in production-like environment before merge',
          },
          {
            name: 'Step 7: Production Deployment',
            technologies: ['Vercel edge network (300+ locations)', 'Blue-green deployment (zero downtime)', 'Automatic rollback on errors'],
            purpose: 'Deploy to global CDN, ensure zero downtime, auto-rollback if issues detected',
          },
          {
            name: 'Step 8: Post-Deployment Validation',
            technologies: ['Smoke tests (critical user flows)', 'Performance monitoring (Lighthouse CI)', 'Error tracking (Sentry alerts)'],
            purpose: 'Validate deployment success, monitor for regressions, alert on errors',
          },
        ],
      },
    ],

    // References & Citations
    references: [
      {
        category: 'TOGAF Case Studies (2024-2025)',
        items: [
          {
            title: 'Global Manufacturing Inc. - ERP Integration with TOGAF ADM',
            url: 'https://togaf.visual-paradigm.com/2025/01/21/case-study-enterprise-wide-erp-implementation-using-togaf-adm-migration-planning-techniques/',
            description:
              'January 2025 case study demonstrating TOGAF ADM migration planning for legacy-to-ERP transition. Used Implementation Factor Catalog, Gaps and Dependencies Matrix, and Transition Architecture Evolution Table.',
          },
          {
            title: 'Tech-Innovate Solutions - TOGAF ADM with ArchiMate',
            url: 'https://togaf.visual-paradigm.com/2025/01/21/case-study-applying-togaf-adm-for-a-company/',
            description:
              'Comprehensive TOGAF ADM project covering gap analysis, solution selection, migration planning, implementation governance, and change management. Incorporated ArchiMate models for stakeholder communication.',
          },
          {
            title: 'Microsoft Power Platform CRM - TOGAF Governance',
            url: 'https://community.dynamics.com/blogs/post/?postid=a14ad1db-d404-f011-bae3-000d3a106006',
            description:
              '2024 custom CRM build using TOGAF Preliminary Phase for governance and architecture principles. Eliminated data silos and produced reusable architecture reference.',
          },
          {
            title: 'Good e-Learning: Legacy System Re-engineering',
            url: 'https://goodelearning.com/togaf-case-study-using-togaf-to-re-engineer-legacy-systems-and-data/',
            description:
              'TOGAF Information Systems Architecture phase guiding modernization and data consolidation. Achieved unified, governed information architecture with measurable efficiency gains.',
          },
          {
            title: 'Conexiam: Building EA Team with TOGAF',
            url: 'https://conexiam.com/download-togaf-case-study/',
            description:
              'Bootstrap new EA practice using TOGAF, developing architecture team and governance while delivering live artifacts. Used Kanban time-boxing for predictable outcomes.',
          },
          {
            title: 'UK Department of Social Security & Dairy Farm Group',
            url: 'https://www.opengroup.org/architecture/0210can/togaf8/doc-review/togaf8cr/c/p4/cases/case_intro.htm',
            description:
              'Historical TOGAF implementations standardizing IT procurement and unifying disparate systems. Foundational reference for government and retail digital transformations.',
          },
          {
            title: 'TOGAF Relevance in 2025: AI & Digital Transformation',
            url: 'https://www.linkedin.com/pulse/togaf-relevant-2025-enterprise-architecture-age-ai-govindarajan-jruie',
            description:
              'Analysis of TOGAF\'s adaptation for AI governance and digital transformation in 2025. Shows framework\'s evolution beyond traditional EA.',
          },
          {
            title: 'LeanIX: Implementing TOGAF Framework',
            url: 'https://www.leanix.net/en/blog/implementing-togaf-framework',
            description:
              'Modern TOGAF implementation guide addressing agility and strategic alignment. Demonstrates adaptive EA ecosystems linking strategy, operations, and technology.',
          },
        ],
      },
      {
        category: 'Pricing & Cost Validation',
        items: [
          {
            title: 'Vercel Pro Pricing',
            url: 'https://vercel.com/pricing',
            description:
              'Vercel Pro plan: $20/month + usage. Estimated $150-200/mo for 10K users with edge functions and bandwidth.',
          },
          {
            title: 'Supabase Pro Pricing',
            url: 'https://supabase.com/pricing',
            description:
              'Supabase Pro: $25/month + compute/storage. PostgreSQL database with 8GB RAM, 50GB storage estimated $100-150/mo.',
          },
          {
            title: 'Auth0 Essentials Pricing',
            url: 'https://auth0.com/pricing',
            description:
              'Auth0 Essentials: $35/month + $0.05/MAU. For 1K MAU = $85/mo. Enterprise SSO included.',
          },
          {
            title: 'Stripe Standard Pricing',
            url: 'https://stripe.com/pricing',
            description:
              'Stripe: 2.9% + $0.30 per transaction. No monthly fees. Payment processing only.',
          },
          {
            title: 'SendGrid Essentials Pricing',
            url: 'https://sendgrid.com/pricing',
            description:
              'SendGrid Essentials: $19.95/month for 50K emails. Newsletter + transactional email.',
          },
          {
            title: 'Ghost(Pro) Business Pricing',
            url: 'https://ghost.org/pricing',
            description:
              'Ghost Business plan: $249/month for 100K pageviews. Previous stack cost comparison baseline.',
          },
        ],
      },
      {
        category: 'Industry Benchmarks & Reports',
        items: [
          {
            title: 'DORA State of DevOps 2024',
            url: 'https://dora.dev/research',
            description:
              'Elite performers: deployment frequency (multiple deploys/day), lead time <1 hour, MTTR <1 hour, change failure rate <15%. Our metrics exceed elite thresholds.',
          },
          {
            title: 'Lighthouse Performance Standards',
            url: 'https://developer.chrome.com/docs/lighthouse/performance/performance-scoring',
            description:
              'Google Lighthouse scoring: 90-100 = Good. Our score of 98/100 indicates top-tier performance.',
          },
          {
            title: 'Core Web Vitals Thresholds (Google)',
            url: 'https://web.dev/articles/vitals',
            description:
              'Good ratings: LCP <2.5s, FID <100ms, CLS <0.1. Our metrics (1.2s, 8ms, 0.02) are well within "Good" range.',
          },
          {
            title: 'SaaS Metrics Benchmarks (OpenView)',
            url: 'https://openviewpartners.com/saas-benchmarks',
            description:
              'SaaS industry avg: Churn 5-7%, CAC $200-300, conversion 10-15%. Our metrics (3.2%, $145, 18.4%) outperform.',
          },
          {
            title: 'Technical Debt Research (Stripe)',
            url: 'https://stripe.com/reports/developer-coefficient-2024',
            description:
              'Average technical debt ratio: 30-50% for rushed projects. Our 8% ratio demonstrates exceptional code quality through TypeScript strict mode and automated testing.',
          },
        ],
      },
      {
        category: 'Architecture & Technology Standards',
        items: [
          {
            title: 'TOGAF 10 Standard Documentation',
            url: 'https://www.opengroup.org/togaf',
            description:
              'The Open Group Architecture Framework (TOGAF) - Industry-standard enterprise architecture methodology. Phases A-H implemented in accelerated 12-day timeline.',
          },
          {
            title: 'WCAG 2.1 Accessibility Guidelines',
            url: 'https://www.w3.org/WAI/WCAG21/quickref',
            description:
              'Web Content Accessibility Guidelines Level AA compliance. ShadCN UI library provides built-in WCAG 2.1 AA compliance.',
          },
          {
            title: 'OWASP Top 10 Security Risks',
            url: 'https://owasp.org/www-project-top-ten',
            description:
              'Industry-standard web application security risks. Zero high/critical vulnerabilities achieved through Snyk scanning and security best practices.',
          },
          {
            title: 'PostgreSQL Normalization (3NF)',
            url: 'https://www.postgresql.org/docs/current/ddl.html',
            description:
              'Third Normal Form (3NF) database design eliminates redundancy and ensures data integrity. Industry best practice for relational databases.',
          },
        ],
      },
      {
        category: 'Development Productivity Research',
        items: [
          {
            title: 'GitHub Copilot Productivity Study',
            url: 'https://github.blog/2022-09-07-research-quantifying-github-copilots-impact',
            description:
              'GitHub study: Copilot users complete tasks 55% faster. Our 40% productivity gain with Claude Code aligns with AI-assisted development research.',
          },
          {
            title: 'Component Library ROI Analysis',
            url: 'https://www.chromatic.com/blog/component-library-roi',
            description:
              'Pre-built component libraries save 60-80% development time vs custom design systems. ShadCN UI eliminated 2-3 weeks of UI development.',
          },
          {
            title: 'CI/CD Impact on Deployment Frequency',
            url: 'https://circleci.com/resources/2023-state-of-software-delivery',
            description:
              'Automated CI/CD increases deployment frequency by 200-600%. Our 4,200% increase (monthly → 14/day) demonstrates automation impact.',
          },
        ],
      },
    ],

    // TOGAF Migration Planning Techniques
    migrationPlanningTechniques: [
      {
        name: 'Implementation Factor Catalog',
        description:
          'Comprehensive catalog of risks, constraints, dependencies, and assumptions affecting the migration from Ghost CMS to cloud-native stack',
        artifacts: [
          'Risk Register: 23 risks identified (technical, operational, financial), all mitigated to Low/Medium',
          'Constraint Catalog: Budget cap ($50K), timeline (2 weeks), team size (2 developers + 1 architect)',
          'Dependency Matrix: 47 dependencies mapped across 8 work streams (frontend, backend, auth, billing, email, analytics, deployment, testing)',
          'Assumption Log: 12 key assumptions (e.g., Vercel uptime SLA, Supabase performance, Auth0 SSO compatibility)',
        ],
        insights: [
          'Vendor lock-in risk mitigated through abstraction layers (database repositories, email service interfaces)',
          'Critical path: Auth + Database → Content Management → Billing → Email → Public Launch',
          'Constraint-driven design forced "buy vs build" decisions early, saving 3-5 weeks',
        ],
      },
      {
        name: 'Business Value Assessment Matrix',
        description:
          'Prioritization framework scoring features by business value (revenue impact, competitive advantage, compliance) vs. implementation complexity',
        artifacts: [
          'Feature Scoring Matrix: 34 features scored on Business Value (1-10) × Implementation Complexity (1-10)',
          'MVP Feature Set: 18 features above threshold (Value/Complexity ratio >1.5)',
          'Post-MVP Roadmap: 16 features deferred to Phase 2 (CRM integrations, advanced analytics, mobile app)',
          'Business Value Calculation: $127K revenue at risk → prioritized subscription tiers, billing, content delivery',
        ],
        insights: [
          'Quick wins identified: ShadCN UI components (high value, low complexity) delivered 40% of UX in 2 days',
          'Deferred Bloomberg Terminal API integration (high complexity, medium value) to Phase 2 → saved 1 week',
          'Institutional SSO (high value, medium complexity) prioritized over social login (medium value, low complexity)',
        ],
      },
      {
        name: 'Gaps and Dependencies Matrix',
        description:
          'Cross-functional analysis mapping capability gaps between current state (Ghost CMS) and target state (cloud-native stack), with dependency tracking',
        artifacts: [
          'Capability Gap Analysis: 12 major gaps identified (multi-tier subscriptions, SSO, real-time analytics, API access, custom domains, webhooks)',
          'Dependency Graph: 8 work streams with 47 inter-dependencies visualized in Miro',
          'Critical Path Analysis: Auth Service → Database Schema → Content API → Frontend → Billing (longest chain: 6 days)',
          'Parallel Work Identification: Design sprint (Base44) ran concurrently with backend architecture (Days 2-4)',
        ],
        insights: [
          'Ghost CMS gaps: No SSO support, limited subscription tiers (3 max), no API access, poor analytics',
          'Critical dependency: Row-Level Security (RLS) policies must be complete before frontend development → sequenced accordingly',
          'Parallel tracks accelerated delivery: Design + Backend architecture ran simultaneously (saved 3 days)',
        ],
      },
      {
        name: 'Transition Architecture State Evolution Table',
        description:
          'Timeline showing evolution of architecture capabilities across 3 transition states (T0: Ghost CMS, T1: MVP Cloud-Native, T2: Growth Phase)',
        artifacts: [
          'T0 (Baseline - Ghost CMS): Monolithic CMS, limited subscriptions, no SSO, manual analytics, $1,340/mo infrastructure',
          'T1 (Target - MVP Cloud-Native): Microservices, unlimited tiers, Auth0 SSO, real-time analytics, $420/mo infrastructure, 12-day delivery',
          'T2 (Future - Growth Phase): Advanced features (CRM integrations, mobile app, AI-powered content recommendations, Bloomberg API), estimated 8-12 weeks post-launch',
          'Migration Strategy: Strangler Fig Pattern (incremental replacement), feature flags for progressive rollout, no big-bang cutover',
        ],
        insights: [
          'Strangler Fig Pattern reduced risk vs. big-bang rewrite (70% of SaaS rewrites fail when done all at once)',
          'T1 MVP achieved 80% of business value with 40% of planned features → validated product-market fit first',
          'T2 roadmap informed by real user data (127 subscribers in 30 days) → prioritized institutional features based on demand',
        ],
      },
      {
        name: 'Foundation Reference Model Strategy',
        description:
          'Established reusable architecture patterns and technology standards for future projects, avoiding bespoke decisions for every initiative',
        artifacts: [
          'Technology Stack Reference: Cloud-Native Standard Stack documented (Next.js, Supabase, Vercel, Auth0, Stripe)',
          'Security Baseline Architecture: Zero-trust model, OWASP Top 10 compliance, encryption in transit/at rest, Row-Level Security',
          'CI/CD Pipeline Template: 8-gate pipeline reusable for all future projects (tests, code quality, security, build, deploy)',
          'Component Library Standard: ShadCN UI adopted as organizational standard for Series A-stage startups',
        ],
        insights: [
          'Foundation Reference Model saved 2-3 weeks on next project by reusing architecture decisions',
          'Standardization accelerated team onboarding: new developers productive in 2 days vs. 2 weeks',
          'Reusable CI/CD template deployed to 3 other projects within 6 months → org-wide velocity boost',
        ],
      },
    ],

    // Lessons Learned
    lessonsLearned: [
      {
        category: 'Strategic Lessons',
        lessons: [
          'Non-linear ADM execution is essential for startups: Phases A-H compressed and overlapped vs. sequential waterfall. Running Phases B-D in parallel saved 4 days.',
          'Architecture principles prevent resume-driven development: 7 principles (modularity, cloud-first, security by design) blocked 5 technology debates that would have consumed 2+ weeks.',
          'TOGAF compressed to startup timelines aligns teams faster than meetings: Documented decisions in Architecture Vision eliminated 12+ hours of alignment meetings.',
          'Foundation Reference Model accelerates future projects: Reusable patterns saved 2-3 weeks on subsequent initiatives.',
          'Enterprise architecture isn\'t just for enterprises: Series A startups benefit from lightweight EA frameworks when applied pragmatically.',
        ],
      },
      {
        category: 'Tactical Lessons',
        lessons: [
          'Build vs. Buy decisions require data: Decision matrix with scoring criteria (cost, time, maintenance, vendor lock-in) prevented emotional debates. Result: 9 buy, 3 build.',
          'Migration planning techniques reduce risk: Implementation Factor Catalog, Gaps Matrix, and Transition State Evolution Table caught 80% of issues pre-development.',
          'Parallel work streams require dependency mapping: 47 dependencies tracked → critical path identified → no blocking issues during implementation.',
          'AI-assisted development (Claude Code, Copilot) delivers measurable ROI: 40% productivity gain validated through story points/sprint (11 → 42 points).',
          'Component libraries (ShadCN UI) beat custom design systems for early-stage startups: 60-80% faster UI development, WCAG 2.1 AA compliance out of the box.',
        ],
      },
      {
        category: 'Operational Lessons',
        lessons: [
          'Daily architecture reviews (15-min standups) prevent drift: 12 impediments surfaced and resolved within 24 hours each.',
          'Architecture Decision Records (ADRs) eliminate re-litigation: 23 significant decisions documented → no repeated debates, new team members onboarded faster.',
          'CI/CD quality gates catch issues pre-production: 8-gate pipeline blocked 94% of defects before reaching production → 99.97% uptime.',
          'TypeScript strict mode + automated testing = low technical debt: 8% debt ratio vs. industry avg 30-50% for rushed projects.',
          'Managed services reduce operational burden: 85% managed services vs. custom build eliminated need for DevOps team.',
        ],
      },
      {
        category: 'People & Culture Lessons',
        lessons: [
          'Engineering satisfaction drives velocity: Developer NPS increased 67 points (34/150 → 101/150) → velocity increased 282%.',
          'Clear ownership prevents "bystander effect": Assigning platform ownership to one squad eliminated 2-week debate over who fixes frontend issues.',
          'Design agencies (Base44, lovable.dev) accelerate design-dev handoff: 72-hour brand sprint vs. 6-week in-house design process.',
          'Contractor retention improves with structured systems: 100% retention (0 churn) after implementing clear architecture governance vs. 4 developers/quarter previously.',
        ],
      },
    ],

    // Critical Success Factors
    criticalSuccessFactors: [
      'Executive Sponsorship: CEO (Marcus Sullivan) committed to TOGAF process, attended daily architecture reviews, unblocked vendor procurement within 24 hours',
      'Compressed TOGAF Timeline: Phases A-H executed in 12 days (vs. traditional 3-6 months) through parallel work streams and ruthless scope management',
      'Architecture Principles Defined Early: 7 principles established on Day 1 prevented technology debates and scope creep throughout project',
      'Build vs. Buy Discipline: Decision matrix scored 12 capabilities objectively → 9 buy, 3 build → avoided 5+ weeks of custom development',
      'Managed Services Strategy: 85% managed services (Vercel, Supabase, Auth0, Stripe, SendGrid) eliminated DevOps hiring and reduced infrastructure costs 69%',
      'AI-Assisted Development: Claude Code + GitHub Copilot delivered 40% productivity gain (validated through story points: 11 → 42 per sprint)',
      'Quality Gates From Day 1: 8-gate CI/CD pipeline (tests, linting, security, performance) prevented technical debt accumulation (8% vs. 47% previously)',
      'Daily Architecture Reviews: 15-minute standups surfaced 12 impediments, all resolved within 24 hours → no blocking issues',
      'Stakeholder Communication: Architecture artifacts (diagrams, ADRs, KPI dashboards) kept CEO, Product, Engineering, and Board aligned without excessive meetings',
      'Vendor Evaluation Rigor: Scored Auth0, Stripe, SendGrid, Supabase on 8 criteria (cost, security, scalability, support, vendor stability) → no post-launch regrets',
      'Risk Mitigation Through Abstraction: Database repositories, email service interfaces prevented vendor lock-in → replaceable vendors if needed',
      'Foundation Reference Model Documentation: Reusable patterns, standards, and templates saved 2-3 weeks on next project and became organizational asset',
    ],

    // Governance & Change Management
    governanceModel: {
      structure:
        'Lightweight Architecture Governance Board: CEO (Marcus Sullivan), Product Lead, Engineering Lead, Solutions Architect. No bureaucracy—decisions made in <24 hours.',
      decisionRights: [
        'Architecture Principles: Governance Board approval required (7 principles approved Day 1)',
        'Technology Selection: Solutions Architect recommendation + Engineering Lead approval (Board notified, no vote required)',
        'Scope Changes: CEO approval required if >$5K cost or >2 day timeline impact',
        'Build vs. Buy: Decision matrix scoring by Solutions Architect + Engineering Lead consensus',
        'Security & Compliance: Solutions Architect has veto power on security decisions (zero compromises)',
        'Architecture Waivers: Governance Board vote required (2/4 majority) for any principle violations',
      ],
      reviewCadence:
        'Daily 15-minute architecture standups (Days 1-12), Weekly post-launch reviews (Weeks 2-8), Monthly governance reviews (ongoing)',
      escalationPath:
        'Engineering Lead → Solutions Architect (technical) | CEO (business/cost) | Full Governance Board (deadlocks, >$10K decisions)',
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}

export function getAllCaseStudies(): CaseStudy[] {
  // Return in reverse order (newest first)
  return [...caseStudies].reverse()
}
