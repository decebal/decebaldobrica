# AI-assisted technical hiring: content plan

Prepared 21 November 2026. Status: Wolven guide and LinkedIn post published; personal-site publication remains blocked on access to its Vercel account.

## Implementation status

- Website changes are carried on branch `codex/ai-hiring-content`. The Wolven Fly deployment was made from its working tree; merge the changes before a future deployment from the default branch.
- The [Wolven guide](https://wolventech.com/guides/ai-agent-development-engagement) and [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7529932612736299008/) are live. The personal hiring article and reviewed NotebookLM infographic remain in the website checkout.
- Wolven uses opt-in PostHog analytics in the Default project. A live guide-to-contact click appeared in that project with the expected paths; no PostHog requests were observed before consent. The personal site's new events and a real completed booking remain unverified. Search Console site listing returned an empty object.
- Both sites built locally. The Wolven Fly build passed 27 tests, and its health endpoint and sitemap were verified. The personal site's Vercel deployment runs automatically through GitHub Actions. Investigate its deployment status only through GitHub Actions.
- NotebookLM produced an audio overview and two infographic candidates. The first infographic was rejected because it claimed tests prove system behaviour. The second is included in the personal article. The approved [audio](https://wolventech.com/ai-engineer-hiring-audio.m4a) is linked from the Wolven guide; no verbatim transcript has been verified.

## Commercial goal

Help a UK founder or business owner decide whether to hire a hands-on engineer, engage an adviser, or commission a bounded delivery engagement when introducing AI into software delivery. A reader should be able to understand the trade-off, inspect relevant evidence, and reach the appropriate contact path.

The [personal site](https://decebaldobrica.com/) presents Decebal as a hands-on principal Rust and AI engineer available for contracts and selected founding roles. [Wolven Tech](https://wolventech.com/) presents a one-person, Rust-only practice with architecture review, advisory and platform delivery. Do not imply a general-purpose AI agency, a staffed delivery team, or services beyond these published offers. Hiring enquiries can go to the personal site; Rust advisory and scoped platform work can go to Wolven Tech. Outside-IR35 status depends on the engagement.

## Keyword evidence

Treg's SE Ranking UK database, retrieved 21 November 2026, call `603fbc55f0cf4a2286cd04a795250c45`, charged $0.03222. Monthly search volumes and difficulty are provider estimates, not observed site traffic or a promise of ranking. CPC is omitted: currency and bidding context were not established. Intent labels below are editorial interpretations; inspect live SERPs before assigning a final page. No independently corroborating volume source was retrieved.

| Phrase | Estimated UK searches/month | Difficulty | Proposed owner and decision |
|---|---:|---:|---|
| fractional cto | 480 | 13 | Personal: compare senior technical leadership options; qualify whether fractional CTO is currently offered before claiming availability. |
| ai software development company | 140 | 31 | Wolven: qualify against Rust-only scope; do not create a broad agency promise. |
| ai consultancy london | 110 | 21 | Personal: London AI engineering and contract route, qualified by actual services. |
| hire ai developer | 90 | 36 | Personal: hiring guide and principal/founding engineer route. |
| ai implementation consultant | 90 | 22 | Personal: implementation decision guide; check service fit. |
| ai automation consultant | 70 | 0 | Discovery candidate only; difficulty zero is a provider estimate, not proof of easy ranking. |
| ai agent development company | 50 | 31 | Wolven: scoped Rust agent delivery; explain limitations. |
| ai consultant london | 40 | 15 | Personal: existing engagement page and London context. |
| ai automation for small business | 40 | 31 | Educational reach; qualify for businesses with a real software delivery need. |
| fractional cto uk | 30 | 7 | Personal: same leadership decision cluster as fractional CTO; avoid competing pages. |
| hire ai engineer | 20 | 42 | Personal: same hiring guide as hire AI developer. |
| ai developer uk | 20 | 27 | Personal: same hiring and engagement cluster. |
| ai for small business | 210 | 36 | Broad educational intent; lower priority for direct hiring conversion. |

No provider record: `ai engineer contract`, `technical cofounder`, `hire founding engineer`, `how to hire an ai engineer`, `hire fractional cto`. Missing data is not zero demand. Serpstat returned `Limits exceeded` and no charge; Search Console's site-list health probe returned an empty object, so site-level baseline and permissions remain unverified.

## Series and ownership

Each piece has an original argument, a useful decision tool and a single primary action. The source [repository roundup](https://blog.stackademic.com/10-best-ai-github-repositories-to-supercharge-your-agent-886aad14e5f6) provides the inspiration for accessible lists, not copy or rankings. Use problem, consequence, solution for decision guides; use story, lesson, action and reader-facing ending only where a verifiable story exists.

| Order | Canonical home and working title | Reader problem and evidence | Target cluster | Primary action | Media brief |
|---|---|---|---|---|---|
| 1 | Personal: **How to hire an AI engineer when you need someone to ship** | Distinguish a coding assistant user from an engineer who scopes, tests and operates a system. Include role scorecard, realistic paid exercise and human review. | hire ai developer; hire ai engineer | Discuss a contract or founding role on personal site. | NotebookLM audio overview: founder and technical lead discuss scorecard and trade-offs. |
| 2 | Wolven: **What an AI agent development engagement should deliver** | Show scope, source access, approvals, tests, telemetry and handover. Explain where Rust and a bounded platform engagement fit. | ai agent development company | Discuss a scoped platform engagement on Wolven. | Video overview: brief → boundary → build → evidence → handover. |
| 3 | Personal: **Fractional CTO, founding engineer or AI consultant: which do you need?** | Compare authority, hands-on work and ownership. Present fractional CTO as a decision category; offer only roles actually available. | fractional cto; fractional cto uk; ai implementation consultant | Review relevant personal engagement options. | Infographic: role decision tree. |
| 4 | Personal: **Five open-source building blocks to evaluate before giving an AI agent access** | Accessible roundup with use, limits and evaluation question for each: [Anthropic Skills](https://github.com/anthropics/skills), [MCP reference servers](https://github.com/modelcontextprotocol/servers), [Playwright MCP](https://github.com/microsoft/playwright-mcp), [Crawl4AI](https://github.com/unclecode/crawl4ai), [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector). MCP servers are educational references, and Playwright MCP says it is not a security boundary. | Supporting topical authority; not a validated exact-match keyword. | Read Wolven's platform-engagement scope. | NotebookLM audio: what each component enables and what the buyer must still verify. |
| 5 | Wolven: **AI-assisted engineering: what a buyer should ask to see before accepting delivery** | Explain acceptance evidence, test execution, failure handling and ownership; link to public workflow repositories as self-published evidence. | Supporting article; keyword unvalidated. | Discuss architecture review or platform engagement. | Infographic: claim → evidence → owner → handover. |

Do not duplicate full articles across domains. Cross-link related pieces with descriptive links; the original article is canonical. Confirm live URLs, offers and metadata before publication. The personal article links to Wolven when the buyer wants a company engagement; Wolven links to the personal site for background and individual roles.

## Specific trackers

These are implementation specifications, not live tracking claims. Inventory existing analytics and consent settings before changing either site. Keep personal data out of event parameters and apply the sites' actual consent rules. Cross-domain attribution depends on configured domains, linker and consent; test it rather than assume it works.

| Tracker | Signal and dimension | Source / verification | Decision |
|---|---|---|---|
| Search opportunity | UK query, page, impressions, clicks, CTR and position for each cluster above, split by domain. | Search Console property verified for each domain; record baseline and compare equal periods. | Improve page/title or consolidate overlap only after inspecting query and SERP. |
| Article to service | `content_cta_click`: article slug, destination domain, destination path, CTA placement. | Analytics debug view and one real browser click on each site. | Identify articles sending engaged readers to relevant offers. |
| Enquiry completion | `contact_submit_success` only after server-confirmed submission; site, source article and offer category when legitimately available. | Test successful and failed submissions; reconcile with actual received enquiry, with no form contents in analytics. | Count completed enquiries, not button presses. |
| Qualification | First-party, manually reviewed enquiry record: role sought, business fit, location, engagement type, source if known, outcome. | Existing CRM or contact workflow; do not invent a connected store. | Count qualified opportunities and record reasons for exclusions. |
| Media engagement | `media_play` and `media_complete`, asset ID, host and article slug where player supports events and consent permits. | Test player and event delivery; use platform analytics separately if embedded events are unavailable. | Compare media engagement with enquiry paths, not vanity plays alone. |
| Rank observation | Exact keyword, UK location/device, date, result URL and observed position; retain screenshot or SERP source. | Select a rank provider after confirming cost and access; log absent results as outside measured depth. | Monitor target page and cannibalisation; positions are location- and time-dependent. |

Define a qualified enquiry as a real business decision-maker seeking a matching technical engagement, with enough context to respond. Record unknown attribution as unknown. Review impressions, article-to-service clicks, confirmed submissions and qualified opportunities together; low-volume data does not support causal claims.

## NotebookLM production

Create a notebook from the final, source-checked article and linked public primary sources. For each selected piece produce one audio or video overview and, where supported, an infographic. Prompt: “Speak to a UK founder choosing technical help. Explain the decision, evidence to ask for, and boundaries of an AI-assisted engagement. Avoid invented examples, claims and prices. Identify uncertainty.” Review generated script, visuals and pronunciation against sources; correct or regenerate unsupported statements before using media. Store approved downloadable media in the site repository and verify playback, captions or transcript, accessibility and attribution on the deployed article.

## Release checks

1. Verify each offer, contact destination and candidate keyword against live pages and UK SERPs; establish Search Console property access and analytics baseline.
2. Draft and fact-check each article from primary sources. Include dated checks for repository capabilities and conflicts of interest for Decebal's own projects.
3. Produce and review NotebookLM media, then add accessible transcript or equivalent and source attribution.
4. Publish through the website repository's normal branch, review and deployment flow. Its `publish-post` command can also trigger newsletter and social distribution: inspect and scope it before use.
5. Verify deployed article, metadata, cross-domain links, media and event instrumentation with a real end-to-end enquiry test that does not create an unwanted message.
