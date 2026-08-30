# Portfolio analytics contract

Updated: 30 August 2026.

## Decision rule

Measure sources against qualified activation, fulfilment, and revenue. Never
rank channels by likes, raw visits, installs, or founder-controlled tests.

Paid acquisition stays blocked until one tagged organic source produces a
qualified activation or purchase and no delivery blocker remains.

## Shared source properties

Public web events use `tracking_schema=3`; mobile events use
`tracking_schema=4`. Consumer-bet events carry:

```text
bet
surface
tracking_schema
traffic_role
analytics_test
analytics_test_run_id (controlled runs only)
```

Allow-listed source fields:

```text
acquisition_source
acquisition_medium
acquisition_campaign
acquisition_content (known portfolio links only)
geo_source
geo_signal
geo_attribution
```

Arbitrary UTM values are dropped. URLs stored by analytics contain origin and
path only. Query strings, fragments, customer inputs, payment identifiers, and
product records stay out of marketing analytics.

## Product outcomes

| Bet | Qualified outcome | Commercial authority | Current analytics state |
| --- | --- | --- | --- |
| AllSource | Non-founder hosted customer retained through first paid renewal | Billing plus hosted usage | GA4/Vercel; PostHog contract not used |
| ChargeWindow | Paid calculation plus downloaded record | Stripe plus product receipt | Web 3/mobile 4; portfolio attribution added in source |
| SolarQuote Check UK | Paid two-quote comparison plus downloaded record | Stripe plus product receipt | Web 3/mobile 4; portfolio attribution added in source |
| Move to Own UK | Authority-confirmed property submission | AllSource submission evidence | Web 3/mobile 4; portfolio attribution added in source |
| ReefDose | Paid real dose card plus receipt | Stripe plus product receipt | Web 3/mobile 4 in source; payment circuit absent |
| Viewing Ledger UK | Twelve checks, eight cash inputs, qualified print for real viewing | Privacy-safe event plus opt-in confirmation | Web 3/mobile 4 in source; deployment/project mapping pending |
| Edit Scope Ledger UK | Paid real-project scope export and handoff completion | Stripe plus product evidence | Acquisition and completion event circuit absent |
| Sponsor Ledger UK | Paid real-enquiry pack export | Stripe plus `sponsor.pack.*` events | Server evidence exists; acquisition event circuit absent |

## Weekly decision

For each source: record tagged landings, first-value action, qualified
completion, verified payment, refund, and fulfilled outcome. Use `unknown` when
evidence is unavailable. Keep sources producing qualified outcomes. Stop
sources producing only attention.
