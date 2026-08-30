# Portfolio traffic accountability

Source design: [portfolio traffic flywheel](./plans/2026-08-30-portfolio-traffic-flywheel-design.md).

## Current decision

- Organic distribution: allowed.
- Paid acquisition: blocked until tagged organic demand produces a qualifying
  completion or purchase and no delivery/value-proof blocker remains.
- Internal QA, founder activity, test payment, and automation: never demand.

## Source contract

Every manually shared product link must include:

```text
utm_source=<channel-or-site>
utm_medium=<organic-social|community|creator|newsletter|portfolio|play>
utm_campaign=<bet-slug>_<YYYY-MM>
utm_content=<asset-or-message-variant>
bet=<bet-slug>
```

No customer data belongs in URLs.

## Weekly scorecard

| Bet | Flagship asset | Qualified activation | Search/AI channel | Community/partner channel | Current evidence |
| --- | --- | --- | --- | --- | --- |
| AllSource | `/event-replay-debugging` | Restart/provenance proof or hosted activation | Agent memory, event replay, event sourcing | GitHub, Rust, MCP, agent builders | Unknown until production analytics reconciliation |
| ChargeWindow | `/guides/ev-charging-fees` | Paid completed calculation receipt | Flat/apartment EV charging fee searches | Resident, leaseholder, EV creator groups | No verified organic purchase |
| SolarQuote Check UK | `/solar-quote-cost-per-kwp` | Paid completed two-quote receipt | Solar quote comparison searches | Homeowner solar communities and creators | No verified organic purchase |
| Move to Own UK | `/tenancy-with-option-to-purchase` | Authority-confirmed property submission | Empty BTL and tenancy-option searches | Landlord accountants, brokers, communities | No verified qualifying property |
| ReefDose | `/reef-dosing-calculator` | Paid completed real dose-card receipt | Reef dose calculator and label arithmetic | UK reef clubs, creators, retailers | No verified organic purchase |
| Viewing Ledger UK | `/property-viewing-checklist` | Real-viewing twelve-check completion and print | Property viewing checklist searches | First-time-buyer communities and creators | No verified qualified completion |
| Edit Scope Ledger UK | `/example` | Paid completed real scope and handoff ledger | Fixed-price video editing quote searches | Editor communities and creator newsletters | No verified organic purchase |
| Sponsor Ledger UK | `/knowledge/pricing-a-sponsor-slot` | Paid completed real-enquiry sponsor pack | Newsletter sponsor pricing searches | beehiiv/Substack operators and newsletters | No verified organic purchase |

## Review sequence

1. Search Console: query/page impressions, clicks, CTR, and indexing exceptions.
2. AI-answer checks: named product, correct category, exact audience, proof link,
   owner attribution, and unsupported-claim count.
3. Product analytics: tagged landing, first-value action, completion, purchase,
   refund, and fulfilment evidence.
4. Play Console: store listing visitors, acquisition, first open, and product
   activation by country and source.
5. Keep one winning message per channel. Stop variants producing visits without
   activation. Record unknown when evidence is absent or delayed.

## Distribution ledger

Append one row per published asset or direct outreach batch. Never record names,
emails, property details, quote inputs, financial inputs, or reef measurements.

| Date | Bet | Channel | Tagged URL/content | Audience | Reach evidence | Activation evidence | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-30 | Portfolio | WolvenTech + founder directories | `product_directory` | Cross-product discovery | Live directories and eight proof routes return 200; audience reach unknown | Unknown | Keep until tagged product evidence is available |

## Next organic assets

- AllSource: recorded restart/replay proof using one reproducible event stream.
- ChargeWindow: fictional whole-session fee breakdown, ending at paid calculator.
- SolarQuote: fictional two-quote overlay with scope gaps, not installer ranking.
- Move to Own: landlord readiness worksheet for empty BTL, ending at intake.
- ReefDose: one product-label arithmetic walkthrough, without target advice.
- Viewing Ledger: one real-viewing walkthrough with fictional property details.
- Edit Scope: one owner-rate worked scope and change-trigger walkthrough.
- Sponsor Ledger: one four-issue sponsor fulfilment walkthrough.
