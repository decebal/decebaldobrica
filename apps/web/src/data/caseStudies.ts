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
  },
  {
    id: '4',
    slug: 'premium-newsletter-launch-stack',
    title: 'From Overengineered to MVP — Launch in 12 Days',
    tagline: 'Turning editorial ambition into rapid execution',
    industry: 'Digital Media',
    role: 'Product Strategy & Modern Stack Implementation',

    // Frustration
    personName: 'The Founder',
    personTitle: 'Founder & CEO',
    companyName: 'Premium Financial Newsletter',
    companyIndustry: 'Digital media startup targeting premium financial newsletters',
    problem:
      'The initial product was overbuilt before it was validated.\n\nInstead of launching lean, the team tried to solve for every possible editorial edge case — quickly outgrowing Ghost CMS and needing custom development far too early.\n\n*What happens when perfectionism becomes paralysis?*',
    impact:
      'The overengineering backfired.\n\n**Ghost couldn\'t handle the complexity**, so the team pivoted mid-build.\n\n**Custom development became urgent**, leading to last-minute hiring and inconsistent execution.\n\n**Costs ballooned**, with rushed freelancers and unclear specs.\n\nThey **missed the market window**, watching others launch simpler products first.\n\n"We thought we were being smart by building everything editors might want.\n\nIn reality, we were slowing ourselves down — and solving for problems we didn\'t even have yet."\n\n**The hidden cost:** Not just money—but momentum.',

    // Fix
    framework:
      'Rebuilt using a **high-speed, modern product stack**: flexible tools and elite partners that prioritize momentum over overkill.',
    actions: [
      '**Used Base44 and lovable.dev** together for rapid brand identity and UX clarity — turning ambiguity into clean, conversion-focused designs in days',
      '**Rebuilt frontend on ShadCN UI**, tapping into a modern component system to **slash development time by over 60%**',
      '**Used Claude Code** for rapid prototyping and faster iteration cycles',
      'Ruthlessly trimmed scope to what real users needed — not theoretical "must-haves"',
      'Re-centered around **shipping fast and learning live**, instead of perfecting on paper',
    ],
    outcomes: [
      '**MVP shipped in 12 days**, down from 3+ months of spinning wheels',
      '**Dev costs dropped by over 50%**, thanks to smarter tooling and scoped effort',
      '**Validated user demand with early subscribers**, creating a feedback loop to guide V2',
      'Team morale soared — no more firefighting, just focused progress',
    ],

    // Future
    lesson:
      '**Speed wins.** The right tools and collaborators can get you to market fast — with a product that looks great, feels premium, and delivers results.',
    prescriptions: [
      "Don't customize early — constrain scope and build what users will pay for now",
      'Use **Base44 and lovable.dev** to design a brand and UX that converts — without hiring a full team',
      'Build on **ShadCN UI** to avoid reinventing UI from scratch',
      '**Prototype and iterate with Claude Code** to reduce engineering drag',
    ],

    color: 'green',
    metrics: [
      { label: 'Time to Launch', value: '12 days (was 3+ months)' },
      { label: 'Dev Costs', value: '50% ↓' },
      { label: 'Team Morale', value: 'Soared' },
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies
}
