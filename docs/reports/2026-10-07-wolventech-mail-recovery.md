# Wolven Tech mail repair and recovery

## Cause and scope

The deployed website lacked `/api/email/inbound`. Resend attempts returned 404,
and the provider disabled its webhook.
The original forwarding implementation existed on an unmerged local branch.
Production image `seo-55a4ebd` did not contain the route.

The audit found 23 events, including 15 historically failed events. Every attempt
for those 15 returned 404 before recovery. Three targeted the configured alias
`decebal@wolventech.com`; nine targeted `support@wolventech.com`, one `sales@`,
and two `scott@`. Existing forwarding covered only `decebal@`.

## Repair

The repair uses current main `d30a1546248508722ca353e21e106176f3bee990`, preserving
the website's current service pages. It restores signature-verified forwarding,
adds a dedicated readiness route and Fly check, runs regression tests in the
Docker build, and provides a bounded Rust recovery tool. No credentials were
copied from Fly to the local machine.

Fly release v12 at `2026-10-07T18:42:38Z` deployed image digest
`sha256:4fd90830d7878890aca80ab3186d1a89277d9e9cdd7be2fc8275ecfc0152dfe7`.
The existing Resend webhook was re-enabled after readiness verification.

## Recovery evidence

Each approved event was replayed once. A temporary exact-ID grant permitted the
two older messages while retaining signature checks and the fixed Gmail destination.
Latest attempts returned HTTP 200 with `forwarded`.

| Received date | Recovered messages | Provider outcome |
|---|---:|---|
| 2026-10-01 | 2 | delivered |
| 2026-10-07 | 1 | delivered |

Private message and receipt identifiers remain in Resend rather than this public repository.

Receipt attribution uses serial replay timestamps and the complete outbound list:
two forwards before recovery, five afterwards, with exactly three new delivered
receipts. Resend's retrieved receipt did not expose the custom correlation header.
Gmail inbox placement was not inspected. No other recipient's message was replayed.

Resend's API retained historical `failed` event summaries despite successful manual
attempts. The dashboard showed Success and HTTP 200 for the recovered event.
The recovery tool verifies actual attempt responses and refuses replay
when a prior attempt is no longer exclusively 404.

The temporary `RESEND_INBOUND_RECOVERY` secret was removed after delivery. Fly
confirmed both original Resend credentials remained deployed and both active
machine health checks passed after the rolling update.

## Checks

- 14 forwarding tests passed, with 38 assertions, locally and inside Docker.
- Focused TypeScript check for the route passed.
- Rust operator tool compiled successfully.
- Production Next.js build passed. Existing build configuration skips global
  TypeScript and lint validation; a whole-workspace validation was not performed.
- Public webhook GET: 200 `ready`; unsigned POST: 401 `invalid_signature`.
- Both health checks passed on running Fly machine `e8204ddfed1d28`.
- Spare machine `83d1301f41d478` remained stopped as before.
- Homepage and `/services/rust-consulting` returned 200.

## Support recovery and screening

The founder approved a repair PR and support forwarding to the existing destination,
with spam and phishing filtering. The old branch belongs to an earlier session and
is not rewritten. Merge the repair before subsequent source deployments.
Sales and Scott recipients remain outside the configured route.

The filter uses provider authentication and conservative content checks. Flagged
mail remains in Resend, with a safe review notice sent to the configured mailbox.
See the [screening design](../plans/2026-10-07-inbound-mail-screening-design.md).

Fly release v14 at `2026-10-07T19:11:41Z` deployed image digest
`sha256:adc96975437c0c4f21d42da32c3cc19153dd0bad9903a822c7489ab2b5c425fe`.
Both approved aliases now use the same filter and private destination setting.

All nine failed support events had complete histories containing only 404 responses.
Each was screened against canonical receiving metadata before one replay.
Recovery attempts ran from `2026-10-07T19:15:44.688Z` through
`2026-10-07T19:21:09.796Z`. Every latest attempt returned HTTP 200.

| Outcome | Messages | Delivery evidence |
|---|---:|---|
| Original forwarded | 6 | Six delivered receipts |
| Original held; safe review notice sent | 3 | Three delivered notice receipts |

One held message had failed DMARC and a suspicious link; one had unverified
authentication and a suspicious link; one had unverified authentication alone.
These are screening warnings, not a determination that the messages are malicious.
No original content or attachments from held messages were forwarded or deleted.
Originals remain subject to Resend's standard 30-day retention from receipt.

The complete outbound list increased from five to fourteen records, exactly nine
new records, all marked `delivered`. Serial replay and receipt timestamps support
attribution. Gmail inbox placement was not checked. Sales and Scott events were
not replayed, and the three previously recovered messages were not resent.

The exact-ID recovery allowance was removed. Final Fly release v16 completed at
`2026-10-07T19:22:22Z` with the same screening image. The secret inventory confirms
the allowance is absent and permanent mail settings are deployed. Both checks on
the running machine pass; the spare remains stopped. Readiness, homepage and the
Rust consulting page return 200 after cleanup.

Final code checks: 27 tests and 103 assertions passed locally and inside the
production image build. Focused route TypeScript, Rust compilation, Rust formatting,
and whitespace checks passed. The production build retains its existing global
type/lint skips. The configured local hook directory has no pre-commit or pre-push
executables; checks were run explicitly and the PR includes a forwarding-test CI job.

Procedure: [inbound mail runbook](../runbooks/wolventech-mail-recovery.md).
