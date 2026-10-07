# Inbound mail screening

## Decision and incident

Keep screening inside the existing Next.js inbound handler. Accept the founder's
two approved aliases and route to a private Fly-configured destination. Preserve
signature verification and exact-message, expiring recovery grants.

A later website deployment omitted the unmerged forwarding handler, causing 404s
and disabling the Resend webhook. The invariant is that every website release
contains and health-checks the signed inbound route. Docker regression tests and
a dedicated Fly check enforce that invariant for this deployment configuration.

## Alternatives

- Existing Gmail filtering: no infrastructure change, but no control over original
  content before it reaches the mailbox through a trusted forwarding address.
- Local deterministic screening: selected. No new processor, subscription, model
  download or network lookups of sender-controlled links.
- Dedicated mail-security gateway: stronger reputation and malware analysis, but
  requires a separate provider decision and infrastructure configuration.

## Data flow

Signed event → canonical received-email API → recipient validation → screening.
Ordinary mail retains the existing text plus original EML forwarding behavior.
Flagged mail stays in Resend; only a safe review notice goes to the mailbox.
The same idempotency key covers both outcomes, preventing a replay from creating
both an original forward and a notice within the provider's deduplication window.

Only receiving-service authentication verdicts establish sender authentication.
Message headers can add negative warnings but never override a server failure.
No original sender-controlled content enters quarantine notices. Nothing is
automatically deleted, bounced, released or replied to. No LLM receives mail.

## Failure and review boundaries

Missing authentication, absent attachment metadata or excessive screening size
means review. Provider/network failures return a retryable status. Resend retains
the original under its account retention policy, normally 30 days; the notice
is not a permanent archive. An operator reviews the original in Resend and can
manually forward a false positive after independent sender verification.

This baseline cannot detect every authenticated scam, novel malicious PDF, encoded
HTML trick or compromised sender. It does not claim antivirus or reputation checks.
The strict rules can hold legitimate mail; reason codes and recoverable originals
make that visible. Filters are unit-tested with synthetic, non-sensitive messages.

## Verification

Tests cover ordinary Salesforce activation links, forged PASS headers, missing
and failed authentication, active attachments, misleading URLs, control characters,
credential requests, size limits and safe quarantine payloads. Handler tests cover
both approved aliases, signature failures, old-event grants, idempotency, provider
failures and release health checks. Production recovery requires inspecting actual
webhook attempts and outbound provider receipts, not only event summary labels.

Implementation: `apps/wolventech/src/lib/mail-screening.mjs`,
`apps/wolventech/src/lib/inbound-mail.mjs`, `tooling/mail-recovery/main.rs`.
