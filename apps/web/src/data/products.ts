export type FounderProduct = {
  worksheetHref: string
  worksheetLabel: string
  artCell: number
  artAlt: string
  slug: string
  name: string
  audience: string
  outcome: string
  proof: string
  href: string
  proofHref: string
}

export const founderProducts: FounderProduct[] = [
  {
    slug: 'allsource',
    worksheetHref: "https://www.all-source.xyz/event-replay-validation-checklist",
    worksheetLabel: "Event Replay Validation Checklist",
    artCell: 0,
    artAlt: "Three linked event blocks leading to a rebuilt stack of state",
    name: 'AllSource',
    audience: 'Teams building event-sourced software and durable agent memory.',
    outcome:
      'Immutable history, replay, projections, graph exploration, MCP, and workload-specific query paths.',
    proof: 'Restart-safe event replay',
    href: 'https://www.all-source.xyz',
    proofHref: 'https://www.all-source.xyz/event-replay-debugging',
  },
  {
    slug: 'chargewindow',
    worksheetHref: "https://chargewindow.com/ev-charging-session-cost-example",
    worksheetLabel: "EV Charging Session Cost Example",
    artCell: 7,
    artAlt: "An EV charging plug beside separate energy, parking, time and fee blocks",
    name: 'ChargeWindow',
    audience: 'Residents using a building-selected EV charger provider.',
    outcome: 'Calculate whole-session cost from every entered tariff fee.',
    proof: 'EV charging fee anatomy',
    href: 'https://chargewindow.com',
    proofHref: 'https://chargewindow.com/guides/ev-charging-fees',
  },
  {
    slug: 'solarquote-check-uk',
    worksheetHref: "https://solarquote-check-uk.com/solar-quote-questions-template",
    worksheetLabel: "Solar Quote Questions Template",
    artCell: 6,
    artAlt: "Two solar installation quote cards with roof panels and batteries",
    name: 'SolarQuote Check UK',
    audience: 'English homeowners holding two written residential solar quotes.',
    outcome: 'Expose scope gaps and assumptions before choosing an installer.',
    proof: 'Two-quote cost-per-kWp comparison',
    href: 'https://solarquote-check-uk.com',
    proofHref: 'https://solarquote-check-uk.com/solar-quote-cost-per-kwp',
  },
  {
    slug: 'move-to-own-uk',
    worksheetHref: "https://movetoownuk.com/landlord-option-discussion-checklist",
    worksheetLabel: "Landlord Option Discussion Checklist",
    artCell: 9,
    artAlt: "A house with separate tenancy and purchase documents beside a key",
    name: 'Move to Own UK',
    audience: 'Landlords with an empty buy-to-let considering rent now and a future sale.',
    outcome: 'Set tenancy and separate option terms, then choose an applicant.',
    proof: 'Tenancy with option-to-purchase route',
    href: 'https://movetoownuk.com',
    proofHref: 'https://movetoownuk.com/tenancy-with-option-to-purchase',
  },
  {
    slug: 'reefdose',
    worksheetHref: "https://reefdose.com/reef-supplement-label-worksheet",
    worksheetLabel: "Reef Supplement Label Worksheet",
    artCell: 8,
    artAlt: "A reef aquarium beside a closed supplement bottle and measuring cylinder",
    name: 'ReefDose',
    audience: 'UK one-tank reef keepers working from a representable supplement label.',
    outcome: 'Turn keeper-selected inputs into transparent label-capped arithmetic.',
    proof: 'Label-to-dose worked method',
    href: 'https://reefdose.com',
    proofHref: 'https://reefdose.com/reef-dosing-calculator',
  },
  {
    slug: 'viewing-ledger-uk',
    worksheetHref: "https://viewingledger.com/property-viewing-notes-template",
    worksheetLabel: "Property Viewing Notes Template",
    artCell: 1,
    artAlt: "A model house beside a twelve-check notebook and a cost sheet",
    name: 'Viewing Ledger UK',
    audience: 'UK buyers preparing for or comparing property viewings.',
    outcome: 'Record twelve explicit checks, follow-ups, and buyer-entered first-year costs.',
    proof: 'Twelve-check viewing guide',
    href: 'https://viewingledger.com',
    proofHref: 'https://viewingledger.com/property-viewing-checklist',
  },
  {
    slug: 'edit-scope-ledger-uk',
    worksheetHref: "https://editscopeledger.com/video-edit-change-request-template",
    worksheetLabel: "Video Edit Change Request Template",
    artCell: 4,
    artAlt: "A video editing timeline beside a change request card and scissors",
    name: 'Edit Scope Ledger UK',
    audience: 'UK freelance video editors answering a fixed-price brief.',
    outcome: 'Make scope, contribution, review limits, changes, and handoff inspectable.',
    proof: 'Worked £1,991 video edit scope',
    href: 'https://editscopeledger.com',
    proofHref: 'https://editscopeledger.com/example',
  },
  {
    slug: 'sponsor-ledger-uk',
    worksheetHref: "https://sponsorledger.app/newsletter-sponsor-recap-template",
    worksheetLabel: "Newsletter Sponsor Recap Template",
    artCell: 3,
    artAlt: "Four newsletter issues arranged in a sponsor booking rack",
    name: 'Sponsor Ledger UK',
    audience: 'UK newsletter operators handling a real sponsor enquiry.',
    outcome: 'Keep quote, availability, booking, fulfilment, and recap in one pack.',
    proof: 'Sponsor-slot pricing method',
    href: 'https://sponsorledger.app',
    proofHref: 'https://sponsorledger.app/knowledge/pricing-a-sponsor-slot',
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
    proof: "Worked thirty-minute timing card",
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
    proof: "Logo file handoff guide",
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
    proof: "School evidence checklist",
  },
]

export function founderProductHref(product: FounderProduct, surface: 'product' | 'proof') {
  const url = new URL(surface === 'product' ? product.href : product.proofHref)
  url.searchParams.set('utm_source', 'decebaldobrica.com')
  url.searchParams.set('utm_medium', 'portfolio')
  url.searchParams.set('utm_campaign', 'product_directory')
  url.searchParams.set('utm_content', `${product.slug}_${surface}`)
  url.searchParams.set('bet', product.slug)
  return url.toString()
}
