export type Product = {
  slug: string
  name: string
  category: string
  description: string
  audience: string
  outcome: string
  href: string
  proofHref: string
  proofLabel: string
  commercialModel: string
  cta: string
}

export const products: Product[] = [
  {
    slug: 'allsource',
    name: 'AllSource',
    category: 'Developer infrastructure',
    description:
      'AI-native event store built in Rust, with immutable event history, replay, projections, graph exploration, MCP access, and query services for realtime, HTTP, and analytics reads.',
    audience: 'Teams building event-sourced software and durable AI-agent memory.',
    outcome: 'Keep complete history and serve each read workload through the right query path.',
    href: 'https://www.all-source.xyz',
    proofHref: 'https://www.all-source.xyz/event-replay-debugging',
    proofLabel: 'See restart-safe replay',
    commercialModel: 'Apache-2.0 self-hosting · hosted plans from £18.99/month',
    cta: 'Explore AllSource',
  },
  {
    slug: 'chargewindow',
    name: 'ChargeWindow',
    category: 'EV charging',
    description:
      'England-first EV charging cost calculator that compares tariff windows and turns vehicle, battery, and charger details into a clear charging plan.',
    audience: 'UK EV drivers comparing when and how much to charge.',
    outcome: 'Understand charging-window cost before changing routine or tariff.',
    href: 'https://chargewindow.com',
    proofHref: 'https://chargewindow.com/guides/ev-charging-fees',
    proofLabel: 'See every fee in one session',
    commercialModel: '£29 once · no account',
    cta: 'Open ChargeWindow',
  },
  {
    slug: 'solarquote-check-uk',
    name: 'SolarQuote Check UK',
    category: 'Home solar',
    description:
      'Independent comparison tool for two written residential solar PV quotes, showing scope gaps and mismatched assumptions line by line.',
    audience: 'English homeowners choosing between solar installation quotes.',
    outcome: 'Ask better questions before selecting an installer.',
    href: 'https://solarquote-check-uk.com',
    proofHref: 'https://solarquote-check-uk.com/solar-quote-cost-per-kwp',
    proofLabel: 'Inspect quote comparison method',
    commercialModel: '£29 once · independent comparison',
    cta: 'Compare solar quotes',
  },
  {
    slug: 'move-to-own-uk',
    name: 'Move to Own UK',
    category: 'Property',
    description:
      'England-first marketplace for landlords considering a signed tenancy plus a separate option-to-purchase route.',
    audience: 'Landlords with empty buy-to-let property and prospective buyers building a deposit.',
    outcome: 'Let landlords set terms, review applicants, and choose who moves in.',
    href: 'https://movetoownuk.com',
    proofHref: 'https://movetoownuk.com/tenancy-with-option-to-purchase',
    proofLabel: 'Understand agreement route',
    commercialModel: '£0 upfront · landlord success fee after move-in trigger',
    cta: 'See Move to Own UK',
  },
  {
    slug: 'reefdose',
    name: 'ReefDose',
    category: 'Reef keeping',
    description:
      'Deterministic reef supplement arithmetic using keeper-chosen target, net water volume, product-label effect, and any stated daily maximum.',
    audience: 'UK one-tank reef keepers working from a representable supplement label.',
    outcome: 'Produce a transparent dose card without outsourcing chemistry judgement.',
    href: 'https://reefdose.com',
    proofHref: 'https://reefdose.com/reef-dosing-calculator',
    proofLabel: 'Inspect label-to-dose arithmetic',
    commercialModel: '£29 once · one tank · local history',
    cta: 'Open ReefDose',
  },
  {
    slug: 'viewing-ledger-uk',
    name: 'Viewing Ledger UK',
    category: 'Property viewing',
    description:
      'Free twelve-check viewing record with explicit states, follow-up questions, and buyer-entered first-year cost arithmetic.',
    audience: 'UK home buyers preparing for or comparing in-person property viewings.',
    outcome: 'Leave each viewing with one comparable local record and clear follow-ups.',
    href: 'https://viewingledger.com',
    proofHref: 'https://viewingledger.com/property-viewing-checklist',
    proofLabel: 'Use twelve-check guide',
    commercialModel: 'Free · local-first · no account',
    cta: 'Use Viewing Ledger',
  },
  {
    slug: 'edit-scope-ledger-uk',
    name: 'Edit Scope Ledger UK',
    category: 'Freelance video editing',
    description:
      'Owner-set fixed-price video edit scope, contribution view, review limits, change triggers, and delivery handoff record.',
    audience: 'UK freelance video editors answering a real fixed-price brief.',
    outcome:
      'Make included work, contribution, changes, and handoff inspectable before work starts.',
    href: 'https://editscopeledger.com',
    proofHref: 'https://editscopeledger.com/example',
    proofLabel: 'Inspect worked £1,991 scope',
    commercialModel: 'Free preview · £39 export and handoff unlock',
    cta: 'Open Edit Scope Ledger',
  },
  {
    slug: 'sponsor-ledger-uk',
    name: 'Sponsor Ledger UK',
    category: 'Newsletter operations',
    description:
      'Sponsor quote, availability, booking, fulfilment, contribution, and recap record for one real newsletter enquiry.',
    audience: 'UK newsletter operators turning sponsor enquiries into repeatable issue delivery.',
    outcome: 'Keep quote promises and four-issue fulfilment in one inspectable pack.',
    href: 'https://sponsorledger.app',
    proofHref: 'https://sponsorledger.app/knowledge/pricing-a-sponsor-slot',
    proofLabel: 'Inspect sponsor pricing method',
    commercialModel: 'Free worked pack · £39 once for real enquiry workflow',
    cta: 'Open Sponsor Ledger',
  },
]

export function portfolioHref(product: Product, surface: 'product' | 'proof'): string {
  const url = new URL(surface === 'product' ? product.href : product.proofHref)
  url.searchParams.set('utm_source', 'wolventech.com')
  url.searchParams.set('utm_medium', 'portfolio')
  url.searchParams.set('utm_campaign', 'product_directory')
  url.searchParams.set('utm_content', `${product.slug}_${surface}`)
  url.searchParams.set('bet', product.slug)
  return url.toString()
}
