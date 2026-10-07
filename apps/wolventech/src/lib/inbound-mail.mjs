import { createHmac, timingSafeEqual } from 'node:crypto'
import { forwardingDestination, REVIEW_REASONS, screenInbound } from './mail-screening.mjs'

const ALIAS = 'decebal@wolventech.com'
const RECIPIENTS = new Set([ALIAS, 'support@wolventech.com'])
const API = 'https://api.resend.com'
const MAX_RAW = 20 * 1024 * 1024
const MAX_EVENT = 64 * 1024
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function recoveryAllowed(raw, id, now) {
  try {
    const grant = JSON.parse(raw)
    const start = Date.parse(grant.starts_at)
    const end = Date.parse(grant.expires_at)
    return Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end &&
      end > start && end - start <= 3600000 && Array.isArray(grant.email_ids) &&
      grant.email_ids.length <= 100 && grant.email_ids.every((value) => typeof value === 'string' && UUID.test(value)) &&
      grant.email_ids.includes(id)
  } catch {
    return false
  }
}

export function verifySignature(body, headers, secret, now = Date.now()) {
  const id = headers.get('svix-id')
  const timestamp = headers.get('svix-timestamp')
  const signatures = headers.get('svix-signature') || ''
  if (!id || !timestamp || !/^\d+$/.test(timestamp) || !secret?.startsWith('whsec_')) return false
  if (Math.abs(now / 1000 - Number(timestamp)) > 300) return false
  const key = Buffer.from(secret.slice(6), 'base64')
  if (key.length < 16) return false
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest()
  return signatures.split(' ').some((part) => {
    if (!part.startsWith('v1,')) return false
    const actual = Buffer.from(part.slice(3), 'base64')
    return actual.length === expected.length && timingSafeEqual(actual, expected)
  })
}

async function boundedBytes(response, limit) {
  if (Number(response.headers.get('content-length')) > limit) throw new Error('size_limit')
  const reader = response.body?.getReader()
  if (!reader) throw new Error('missing_body')
  const chunks = []
  let size = 0
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) throw new Error('size_limit')
      chunks.push(Buffer.from(value))
    }
  } finally {
    await reader.cancel()
    reader.releaseLock()
  }
  return Buffer.concat(chunks)
}

function includesAlias(recipients) {
  return Array.isArray(recipients) && recipients.some((r) => typeof r === 'string' && RECIPIENTS.has(r.toLowerCase()))
}

function replyAddress(from) {
  if (typeof from !== 'string' || /[\r\n]/.test(from)) return undefined
  const address = (from.match(/<([^<>]+)>$/)?.[1] || from).trim()
  return /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(address) ? address : undefined
}

const result = (status, state) => Response.json({ status: state }, { status, headers: { 'cache-control': 'no-store' } })

export async function forwardInbound(request, env, fetcher = fetch, now = Date.now()) {
  const destination = forwardingDestination(env)
  if (!env.RESEND_API_KEY || !env.RESEND_INBOUND_WEBHOOK_SECRET || !destination) return result(503, 'not_configured')
  let body
  try {
    body = (await boundedBytes(request, MAX_EVENT)).toString('utf8')
  } catch {
    return result(413, 'payload_too_large')
  }
  if (!verifySignature(body, request.headers, env.RESEND_INBOUND_WEBHOOK_SECRET, now)) return result(401, 'invalid_signature')
  let event
  try { event = JSON.parse(body) } catch { return result(400, 'invalid_json') }
  if (event?.type !== 'email.received' || !includesAlias(event?.data?.to)) return result(200, 'ignored')
  const id = event.data.email_id
  if (typeof id !== 'string' || !UUID.test(id)) return result(400, 'invalid_email_id')
  // Resend deduplicates sends for 24h. Older events need an operator-reviewed
  // exact-ID grant lasting at most one hour, shorter than that deduplication window.
  const created = Date.parse(event.created_at)
  if (!Number.isFinite(created) || created > now + 300000) return result(409, 'manual_recovery_required')
  if (now - created > 23 * 3600000 && !recoveryAllowed(env.RESEND_INBOUND_RECOVERY, id, now)) return result(409, 'manual_recovery_required')
  const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}` }
  try {
    const source = await fetcher(`${API}/emails/receiving/${id}`, { headers, signal: AbortSignal.timeout(15000) })
    if (!source.ok) return result(502, 'source_unavailable')
    const email = JSON.parse((await boundedBytes(source, 5 * 1024 * 1024)).toString('utf8'))
    if (email.id !== id || !includesAlias(email.to)) return result(422, 'recipient_mismatch')
    const screening = screenInbound(email)
    if (screening.action === 'quarantine') {
      const sent = await fetcher(`${API}/emails`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json', 'Idempotency-Key': `wolven-inbound-${id}` },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          from: `Wolven Tech mail <${ALIAS}>`, to: [destination],
          subject: '[Mail review] Message held for review',
          headers: { 'X-Wolven-Inbound-Id': id, 'X-Wolven-Mail-Action': 'quarantine' },
          text: `A message was held in Resend. Its content, links and attachments were not forwarded.\n\n${screening.reasons.map(reason => REVIEW_REASONS[reason]).join('\n')}\n\nReview received email ID ${id} in your Resend account: https://resend.com/emails\nResend normally retains email for 30 days from receipt. Review promptly. No reply was sent to the sender.`,
        }),
      })
      return sent.ok ? result(200, 'quarantined') : result(502, 'review_notice_failed')
    }
    const rawUrl = new URL(email.raw?.download_url)
    // Raw data URLs come from the authenticated provider, never webhook input.
    if (rawUrl.protocol !== 'https:' || rawUrl.username || rawUrl.password) return result(502, 'invalid_source')
    const raw = await fetcher(rawUrl.toString(), { signal: AbortSignal.timeout(20000), redirect: 'error' })
    if (!raw.ok) return result(502, 'content_unavailable')
    const content = (await boundedBytes(raw, MAX_RAW)).toString('base64')
    const sender = replyAddress(email.from)
    const subject = typeof email.subject === 'string' ? email.subject.replace(/[\r\n]/g, ' ').slice(0, 900) : '(no subject)'
    const sent = await fetcher(`${API}/emails`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', 'Idempotency-Key': `wolven-inbound-${id}` },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: `Wolven Tech mail <${ALIAS}>`, to: [destination],
        subject: `Fwd: ${subject}`,
        headers: { 'X-Wolven-Inbound-Id': id, 'X-Wolven-Mail-Action': 'forward' },
        ...(sender ? { reply_to: sender } : {}),
        text: `Forwarded from Wolven Tech. Original sender: ${sender || '(see attached original)'}.\nAutomated checks found no configured warning. This is not a guarantee that links or attachments are safe.\n\n${typeof email.text === 'string' ? email.text : 'Open the attached original message for its content.'}`,
        attachments: [{ filename: 'original-message.eml', content, content_type: 'message/rfc822' }],
      }),
    })
    if (!sent.ok) return result(502, 'forward_failed')
    // Never log bodies, subjects, addresses, auth tokens or signed download URLs.
    return result(200, 'forwarded')
  } catch {
    return result(502, 'forward_failed')
  }
}
