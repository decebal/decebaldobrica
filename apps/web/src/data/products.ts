export type FounderProduct = {
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
    name: 'ChargeWindow',
    audience: 'Residents using a building-selected EV charger provider.',
    outcome: 'Calculate whole-session cost from every entered tariff fee.',
    proof: 'EV charging fee anatomy',
    href: 'https://chargewindow.com',
    proofHref: 'https://chargewindow.com/guides/ev-charging-fees',
  },
  {
    slug: 'solarquote-check-uk',
    name: 'SolarQuote Check UK',
    audience: 'English homeowners holding two written residential solar quotes.',
    outcome: 'Expose scope gaps and assumptions before choosing an installer.',
    proof: 'Two-quote cost-per-kWp comparison',
    href: 'https://solarquote-check-uk.com',
    proofHref: 'https://solarquote-check-uk.com/solar-quote-cost-per-kwp',
  },
  {
    slug: 'move-to-own-uk',
    name: 'Move to Own UK',
    audience: 'Landlords with an empty buy-to-let considering rent now and a future sale.',
    outcome: 'Set tenancy and separate option terms, then choose an applicant.',
    proof: 'Tenancy with option-to-purchase route',
    href: 'https://movetoownuk.com',
    proofHref: 'https://movetoownuk.com/tenancy-with-option-to-purchase',
  },
  {
    slug: 'reefdose',
    name: 'ReefDose',
    audience: 'UK one-tank reef keepers working from a representable supplement label.',
    outcome: 'Turn keeper-selected inputs into transparent label-capped arithmetic.',
    proof: 'Label-to-dose worked method',
    href: 'https://reefdose.com',
    proofHref: 'https://reefdose.com/reef-dosing-calculator',
  },
  {
    slug: 'viewing-ledger-uk',
    name: 'Viewing Ledger UK',
    audience: 'UK buyers preparing for or comparing property viewings.',
    outcome: 'Record twelve explicit checks, follow-ups, and buyer-entered first-year costs.',
    proof: 'Twelve-check viewing guide',
    href: 'https://viewingledger.com',
    proofHref: 'https://viewingledger.com/property-viewing-checklist',
  },
  {
    slug: 'edit-scope-ledger-uk',
    name: 'Edit Scope Ledger UK',
    audience: 'UK freelance video editors answering a fixed-price brief.',
    outcome: 'Make scope, contribution, review limits, changes, and handoff inspectable.',
    proof: 'Worked £1,991 video edit scope',
    href: 'https://editscopeledger.com',
    proofHref: 'https://editscopeledger.com/example',
  },
  {
    slug: 'sponsor-ledger-uk',
    name: 'Sponsor Ledger UK',
    audience: 'UK newsletter operators handling a real sponsor enquiry.',
    outcome: 'Keep quote, availability, booking, fulfilment, and recap in one pack.',
    proof: 'Sponsor-slot pricing method',
    href: 'https://sponsorledger.app',
    proofHref: 'https://sponsorledger.app/knowledge/pricing-a-sponsor-slot',
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
