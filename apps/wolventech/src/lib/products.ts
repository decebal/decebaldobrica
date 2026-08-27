export type Product = {
  name: string
  category: string
  description: string
  audience: string
  outcome: string
  href: string
  cta: string
}

export const products: Product[] = [
  {
    name: 'AllSource',
    category: 'Developer infrastructure',
    description:
      'AI-native event store built in Rust, with immutable event history, replay, projections, graph exploration, MCP access, and query services for realtime, HTTP, and analytics reads.',
    audience: 'Teams building event-sourced software and durable AI-agent memory.',
    outcome: 'Keep complete history and serve each read workload through the right query path.',
    href: 'https://www.all-source.xyz',
    cta: 'Explore AllSource',
  },
  {
    name: 'ChargeWindow',
    category: 'EV charging',
    description:
      'England-first EV charging cost calculator that compares tariff windows and turns vehicle, battery, and charger details into a clear charging plan.',
    audience: 'UK EV drivers comparing when and how much to charge.',
    outcome: 'Understand charging-window cost before changing routine or tariff.',
    href: 'https://chargewindow.com',
    cta: 'Open ChargeWindow',
  },
  {
    name: 'SolarQuote Check UK',
    category: 'Home solar',
    description:
      'Independent comparison tool for two written residential solar PV quotes, showing scope gaps and mismatched assumptions line by line.',
    audience: 'English homeowners choosing between solar installation quotes.',
    outcome: 'Ask better questions before selecting an installer.',
    href: 'https://solarquote-check-uk.com',
    cta: 'Compare solar quotes',
  },
  {
    name: 'Move to Own UK',
    category: 'Property',
    description:
      'England-first marketplace for landlords considering a signed tenancy plus a separate option-to-purchase route.',
    audience: 'Landlords with empty buy-to-let property and prospective buyers building a deposit.',
    outcome: 'Let landlords set terms, review applicants, and choose who moves in.',
    href: 'https://movetoownuk.com',
    cta: 'See Move to Own UK',
  },
]
