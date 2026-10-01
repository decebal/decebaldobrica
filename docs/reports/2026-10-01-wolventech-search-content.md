# Wolven Tech search-content focus

Date: 2026-10-01. Verification scope: local production builds and browser checks. Production release verification is separate.

## Positioning

Wolven Tech remains Decebal Dobrica's one-person Rust advisory practice. Search demand supports making existing services easier to discover without claiming an agency, recruitment service or broader CTO offer.

treg/DataForSEO Google Ads English average monthly estimates, collected October 1 with history through August 2026:

| Phrase | US | UK | Interpretation |
| --- | ---: | ---: | --- |
| hire rust developers | 110 | 20 | Qualify as direct work with one consultant, not staffing |
| software architecture review | 20 | 10 | Relevant to existing review work |
| software technical due diligence | 10 | 10 | More precise than property-related due diligence |
| technical due diligence checklist | 40 | 10 | Support the service with a useful evidence checklist |

Estimates are rounded, not exact search counts or traffic forecasts. Related variants overlap. “Rust Consulting” has a legal-settlement company collision; broad volume for that phrase is not treated as software demand. The detailed cross-site research and raw responses remain in the AllSource repository under `docs/seo/2026-10-01-*keyword-demand*`.

## Destinations

- `/services/rust-consulting`: Rust-language consulting and architecture review. Describes review, embedded support and a bounded build; includes intake requirements, public work and exclusions.
- `/services/software-technical-due-diligence`: codebase review for investment, acquisition or handover. Provides a checklist, report structure and an explicitly illustrative recovery-evidence finding. It excludes legal/financial advice, valuation and certification.
- `/`: clearer Rust-consulting heading and metadata, with descriptive links from existing service cards. No changes to logo assets or colour tokens.

Both service pages have distinct metadata, self-canonical URLs, cross-links, homepage entry links, sitemap entries and an existing contact destination. The shared template retains the site's Rust brand classes and bounded content width.

## Canonical-host correction

Observed in the local built artifact: metadata used `wolventech.io`, while sitemap URLs used `wolventech.com`. `src/lib/site.ts` now holds the canonical origin used by root metadata and sitemap. This also aligns organization JSON-LD. Application environment settings for other integrations are unchanged.

## Verification

Run from `apps/wolventech`:

```text
bun run build
bunx tsc --noEmit --incremental false
bunx playwright test --config playwright.seo.config.ts
```

The dedicated SEO test configuration owns its server on port 4317 and refuses reuse of an existing server. Browser tests cover homepage discovery, correct heading, canonical and Open Graph URL, description length, sitemap entry, desktop/mobile overflow and contact navigation. The contact CTA retains its dark brand background on hover; tests check text contrast of at least 4.5:1 and focusability. They do not submit personal information or send an enquiry.

Observed: production build passed; separate TypeScript validation passed; focused lint passed; both browser tests passed. Both service pages passed all 10 codex-seo static checks against generated HTML. This is not a site-wide SEO, accessibility or ranking score.

Use the codex-seo Rust CLI against `.next/server/app/services/*.html`, with the corresponding public URL as `--base-url`. Static checks cannot prove indexing, field performance or traffic gains.

The local build reports unavailable Calendar/Resend configuration. Production integration state and enquiry delivery are outside this content verification. Review the offer wording before publishing; no new price or delivery-time promise is introduced by these pages.

## Measurement after publication

After a separately authorized deployment, verify public HTML and sitemap. Compare complete 28-day Search Console windows for these paths, separating Rust-language service intent from unrelated named businesses. Inspect enquiries for fit only through consented, authorized aggregate measurement. First verify contact-event coverage; a contact-page view is not a qualified enquiry.
