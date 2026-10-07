# Wolven Tech inbound mail

## Routing and release contract

Resend calls `https://wolventech.com/api/email/inbound` for `email.received`.
The handler accepts only `decebal@wolventech.com` and `support@wolventech.com`.
`RESEND_INBOUND_FORWARD_TO` names the private destination. Other recipients are
acknowledged without forwarding.
The original message is attached as an EML file, with a plain-text summary.

The handler verifies the raw-body signature, recipient and provider email ID.
It limits payload sizes and rejects stale signatures. Runtime credentials remain
in Fly secrets: `RESEND_API_KEY`, `RESEND_INBOUND_WEBHOOK_SECRET` and
`RESEND_INBOUND_FORWARD_TO`. The recovery tool also uses `RESEND_INBOUND_WEBHOOK_ID`.
Never print credentials, signed download URLs or message contents in reports.

Before release, run:

```bash
gtimeout -k 5 120 bun test apps/wolventech/tests/inbound-mail.test.mjs apps/wolventech/tests/mail-screening.test.mjs
```

The same test runs in the Docker build and GitHub workflow. The Fly configuration
checks both `/api/healthz` and `/api/email/inbound`. The latter returns 200 with
`{"status":"ready"}` only when both credentials and a valid destination exist. An unsigned POST must return
401. Configuration readiness alone does not prove delivery; verify a real signed
event and its outbound provider receipt after a repair.

Merge the repair PR before later releases. Deploying an older source tree can
remove both the handler and its health check.

## Recovery

The Rust operator tool uses Node already installed on the Fly machine to call
Resend with that machine's existing credential. No key is copied locally. Each
operation has a process deadline and the owner kills and reaps a timed-out child.

```bash
gtimeout -k 5 60 rustc tooling/mail-recovery/main.rs -o /private/tmp/wolventech-mail-recovery
/private/tmp/wolventech-mail-recovery audit
/private/tmp/wolventech-mail-recovery sent
```

1. Confirm the failed event belongs to the intended recipient. Inspect every
   attempt, including pagination. Automatic recovery is restricted to events
   whose attempts all returned 404 before the handler could run. Mixed failures
   require reconciliation against outbound receipts before any resend.
2. Restore the route and confirm readiness and unsigned-request rejection.
3. Events older than 23 hours require an exact-ID grant in
   `RESEND_INBOUND_RECOVERY`: JSON with `starts_at`, `expires_at`, and `email_ids`.
   Its validity must not exceed one hour. Include only reviewed, never-forwarded
   IDs. Set it through Fly's secret input, not a repository file.
   Run `screen EXACT_EVENT_ID` first to preview whether recovery will forward the
   original or send a quarantine notice.
4. Re-enable the existing webhook, then replay each approved event:

   ```bash
   /private/tmp/wolventech-mail-recovery enable
   /private/tmp/wolventech-mail-recovery replay EXACT_EVENT_ID
   /private/tmp/wolventech-mail-recovery verify EXACT_EVENT_ID
   /private/tmp/wolventech-mail-recovery sent
   ```

5. Verify webhook success and the outbound provider's `delivered` state. Match
   `X-Wolven-Inbound-Id` to the received email ID where the provider exposes it.
   Provider delivery means acceptance by the recipient mail server; inspect the
   Gmail inbox separately before claiming inbox placement.
   A manually replayed event can retain its historical aggregate `failed` status
   after a 200 response. Inspect the latest attempt through `verify` or `details`,
   then reconcile the outbound receipt; do not replay again based on the summary.
6. Remove `RESEND_INBOUND_RECOVERY` from Fly and verify the route remains ready.
   Do not renew grants for successful events.

The stable send key is `wolven-inbound-EMAIL_ID`. Resend retains idempotency keys
for 24 hours, so old replays must never be treated as automatically duplicate-safe.
The age gate, exact recovery list and bounded validity prevent unreviewed replay.
Manual replays do not schedule automatic retries; verify each one explicitly.

Provider reference: [Resend webhook API](https://github.com/resend/resend-openapi/blob/main/resend.yaml).

## Spam and phishing review

`mail-screening.mjs` runs before any original-message download or forwarding.
It uses the authenticated API's `authentication` field, never PASS claims from
message headers. Failed or unverified authentication, negative spam/virus headers,
active attachments or archives, suspicious or misleading URLs, and selected scam
phrases cause quarantine. Sender-controlled negative headers can trigger review
but can never override a warning or establish trust.

Quarantine sends only a fixed-subject, plain-text notice with reason descriptions
and the provider email ID. Original sender text, subject, body, links and attachments
are excluded. No bounce or reply is sent to the sender. A failed notice returns 502
so delivery can retry; successful quarantine returns 200.

Open the received message in the signed-in Resend dashboard, using its email ID.
Verify a questionable sender through a separate, known contact route. For a false
positive, download the original from Resend and forward it manually from the mailbox
after review. Do not weaken global screening to release one message.

Resend's documented standard retention is 30 days from receipt. Review notices are
not backups of the original; review before provider retention expires. This is a
heuristic filter, not antivirus or a URL-reputation service. It does not unpack
archives, scan PDF bytes, fetch links or guarantee safe mail. Legitimate forwarded
mail, old mail lacking authentication and URL shorteners may require manual review.

References: [provider authentication](https://resend.com/docs/api-reference/emails/retrieve-received-email),
[retention](https://resend.com/docs/knowledge-base/account-quotas-and-limits#data-retention).
