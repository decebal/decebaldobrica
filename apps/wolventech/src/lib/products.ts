export type Product = {
  worksheetHref: string
  worksheetLabel: string
  artCell: number
  artAlt: string
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
    worksheetHref: "https://www.all-source.xyz/event-replay-validation-checklist",
    worksheetLabel: "Event Replay Validation Checklist",
    artCell: 0,
    artAlt: "Three linked event blocks leading to a rebuilt stack of state",
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
    worksheetHref: "https://chargewindow.com/ev-charging-session-cost-example",
    worksheetLabel: "EV Charging Session Cost Example",
    artCell: 7,
    artAlt: "An EV charging plug beside separate energy, parking, time and fee blocks",
    name: 'ChargeWindow',
    category: 'EV charging',
    description:
      'EV charging cost calculator that combines entered energy, connection, parking and idle fees into a whole-session estimate.',
    audience: 'Residents using a building-selected EV charger provider.',
    outcome: 'Understand the full session cost and the choices available under the applicable tariff.',
    href: 'https://chargewindow.com',
    proofHref: 'https://chargewindow.com/guides/ev-charging-fees',
    proofLabel: 'See every fee in one session',
    commercialModel: '£29 once · no account',
    cta: 'Open ChargeWindow',
  },
  {
    slug: 'solarquote-check-uk',
    worksheetHref: "https://solarquote-check-uk.com/solar-quote-questions-template",
    worksheetLabel: "Solar Quote Questions Template",
    artCell: 6,
    artAlt: "Two solar installation quote cards with roof panels and batteries",
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
    worksheetHref: "https://movetoownuk.com/landlord-option-discussion-checklist",
    worksheetLabel: "Landlord Option Discussion Checklist",
    artCell: 9,
    artAlt: "A house with separate tenancy and purchase documents beside a key",
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
    worksheetHref: "https://reefdose.com/reef-supplement-label-worksheet",
    worksheetLabel: "Reef Supplement Label Worksheet",
    artCell: 8,
    artAlt: "A reef aquarium beside a closed supplement bottle and measuring cylinder",
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
    worksheetHref: "https://viewingledger.com/property-viewing-notes-template",
    worksheetLabel: "Property Viewing Notes Template",
    artCell: 1,
    artAlt: "A model house beside a twelve-check notebook and a cost sheet",
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
    worksheetHref: "https://editscopeledger.com/video-edit-change-request-template",
    worksheetLabel: "Video Edit Change Request Template",
    artCell: 4,
    artAlt: "A video editing timeline beside a change request card and scissors",
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
    worksheetHref: "https://sponsorledger.app/newsletter-sponsor-recap-template",
    worksheetLabel: "Newsletter Sponsor Recap Template",
    artCell: 3,
    artAlt: "Four newsletter issues arranged in a sponsor booking rack",
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
  {
    slug: 'talk-run-card-uk',
    worksheetHref: "https://talkruncard.com/conference-talk-overrun-checklist",
    worksheetLabel: "Conference Talk Overrun Checklist",
    artCell: 2,
    artAlt: "A lectern, cue cards and a clock divided into talk sections",
    name: "Talk Run Card UK",
    audience: "Speakers preparing a fixed-slot conference talk.",
    outcome: "Record rehearsal sections, identify overruns and protect time for questions.",
    href: "https://talkruncard.com",
    proofHref: "https://talkruncard.com/guides/30-minute-talk-run-card",
    category: "Conference speaking",
    description: "Record rehearsal sections, identify overruns and protect time for questions.",
    proofLabel: "Worked thirty-minute timing card",
    commercialModel: "Free planning and first-run preview; paid release not announced here",
    cta: "Explore Talk Run Card UK",
  },
  {
    slug: 'logo-handoff-card-uk',
    worksheetHref: "https://logohandoffcard.com/logo-handoff-acceptance-template",
    worksheetLabel: "Logo Handoff Acceptance Template",
    artCell: 5,
    artAlt: "Organised logo delivery folders beside an acceptance checklist",
    name: "Logo Handoff Card UK",
    audience: "UK microbusiness owners reviewing a commissioned logo delivery.",
    outcome: "Record expected files, missing variants and questions before acceptance.",
    href: "https://logohandoffcard.com",
    proofHref: "https://logohandoffcard.com/guide",
    category: "Design handoff",
    description: "Record expected files, missing variants and questions before acceptance.",
    proofLabel: "Logo file handoff guide",
    commercialModel: "Free handoff preview; paid availability shown on the product site",
    cta: "Explore Logo Handoff Card UK",
  },
  {
    slug: 'aplaceahead',
    worksheetHref: "https://aplaceahead.com/compare-three-family-homes",
    worksheetLabel: "Compare Three Family Homes",
    artCell: 10,
    artAlt: "Three model family homes arranged above a map and source cards",
    name: "A Place Ahead",
    audience: "Households comparing family homes and school admissions evidence.",
    outcome: "Keep property facts, school questions and daily-life needs in one comparison.",
    href: "https://aplaceahead.com",
    proofHref: "https://aplaceahead.com/school-first-home-search",
    category: "Family-home research",
    description: "Keep property facts, school questions and daily-life needs in one comparison.",
    proofLabel: "School evidence checklist",
    commercialModel: "Free public guides and calculator; working research remains private",
    cta: "Explore A Place Ahead",
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
