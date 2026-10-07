import { expect, test } from 'bun:test'
import { createHmac } from 'node:crypto'
import { forwardInbound, verifySignature, recoveryAllowed } from '../src/lib/inbound-mail.mjs'
import { readFileSync } from 'node:fs'

const now = Date.now()
const secret = `whsec_${Buffer.alloc(32, 7).toString('base64')}`
const env = { RESEND_API_KEY: 'test-only', RESEND_INBOUND_WEBHOOK_SECRET: secret, RESEND_INBOUND_FORWARD_TO: 'owner@example.com' }
const authenticated = { authentication: { spf: 'pass', dkim: 'pass', dmarc: 'pass' }, attachments: [] }
const id = '00000000-0000-4000-8000-000000000001'
const event = { type: 'email.received', created_at: new Date(now).toISOString(), data: { email_id: id, to: ['decebal@wolventech.com'] } }
const grant = { starts_at: new Date(now - 1000).toISOString(), expires_at: new Date(now + 3599000).toISOString(), email_ids: [id] }
function request(value = event, time = Math.floor(now / 1000)) {
  const body = JSON.stringify(value)
  const signature = createHmac('sha256', Buffer.alloc(32, 7)).update(`msg_test.${time}.${body}`).digest('base64')
  return new Request('https://wolventech.com/api/email/inbound', { method: 'POST', body, headers: { 'svix-id': 'msg_test', 'svix-timestamp': `${time}`, 'svix-signature': `v1,${signature}` } })
}
test('missing credentials fail closed', async () => expect((await forwardInbound(request(), {})).status).toBe(503))
test('unsigned requests never fetch email', async () => {
  const req = request(); req.headers.delete('svix-signature')
  expect((await forwardInbound(req, env, () => { throw Error('unexpected fetch') }, now)).status).toBe(401)
})
test('stale signatures fail', async () => expect((await forwardInbound(request(event, Math.floor(now / 1000) - 301), env, undefined, now)).status).toBe(401))
test('official Svix reference vector verifies', () => {
  const headers = new Headers({ 'svix-id': 'msg_loFOjxBNrRLzqYUf', 'svix-timestamp': '1731705121', 'svix-signature': 'v1,rAvfW3dJ/X/qxhsaXPOyyCGmRKsaKWcsNccKXlIktD0=' })
  expect(verifySignature('{"event_type":"ping","data":{"success":true}}', headers, 'whsec_plJ3nmyCDGBKInavdOK15jsl', 1731705121000)).toBe(true)
})
test('other aliases and event types ignored without fetching', async () => {
  for (const value of [{ ...event, data: { ...event.data, to: ['other@wolventech.com'] } }, { ...event, type: 'email.sent' }]) {
    const response = await forwardInbound(request(value), env, () => { throw Error('unexpected fetch') }, now)
    expect(await response.json()).toEqual({ status: 'ignored' })
  }
})
test('old events cannot bypass expired send idempotency', async () => {
  const value = { ...event, created_at: new Date(now - 24 * 3600000).toISOString() }
  expect((await forwardInbound(request(value), env, undefined, now)).status).toBe(409)
})
test('recovery grants require exact IDs and a current window of at most one hour', () => {
  expect(recoveryAllowed(JSON.stringify(grant), id, now)).toBe(true)
  for (const value of [undefined, 'bad', 'null', '{}', JSON.stringify({ ...grant, email_ids: [] }), JSON.stringify({ ...grant, email_ids: ['*'] }), JSON.stringify({ ...grant, expires_at: new Date(now).toISOString() }), JSON.stringify({ ...grant, starts_at: new Date(now + 1000).toISOString() }), JSON.stringify({ ...grant, expires_at: new Date(now + 3600001).toISOString() })]) {
    expect(recoveryAllowed(value, id, now)).toBe(false)
  }
})
test('operator recovery keeps signature checks and never broadens recipients', async () => {
  const recovery = { ...env, RESEND_INBOUND_RECOVERY: JSON.stringify(grant) }
  const old = { ...event, created_at: new Date(now - 7 * 86400000).toISOString() }
  const unsigned = request(old); unsigned.headers.delete('svix-signature')
  const noFetch = () => { throw Error('unexpected fetch') }
  expect((await forwardInbound(unsigned, recovery, noFetch, now)).status).toBe(401)
  expect(await (await forwardInbound(request({ ...old, data: { ...old.data, to: ['other@wolventech.com'] } }), recovery, noFetch, now)).json()).toEqual({ status: 'ignored' })
})
test('reviewed old message forwards with same idempotency key and expires closed', async () => {
  const old = { ...event, created_at: new Date(now - 7 * 86400000).toISOString() }
  let sends = 0
  const fetcher = async (url, options) => {
    if (url.includes('/emails/receiving/')) return Response.json({ ...authenticated, id, to: event.data.to, from: 'sender@example.org', subject: 'Recovery', text: 'Hello', raw: { download_url: 'https://files.example.org/raw' } })
    if (url === 'https://files.example.org/raw') return new Response('Subject: Recovery\r\n\r\nHello')
    sends++
    expect(options.headers['Idempotency-Key']).toBe(`wolven-inbound-${id}`)
    expect(JSON.parse(options.body).headers['X-Wolven-Inbound-Id']).toBe(id)
    return Response.json({ id: 'sent' })
  }
  const recovery = { ...env, RESEND_INBOUND_RECOVERY: JSON.stringify(grant) }
  expect((await forwardInbound(request(old), recovery, fetcher, now)).status).toBe(200)
  expect((await forwardInbound(request(old, Math.floor((now + 3600000) / 1000)), recovery, fetcher, now + 3600000)).status).toBe(409)
  expect(sends).toBe(1)
})
test('release includes dynamic webhook route and a dedicated Fly health check', () => {
  const route = readFileSync(new URL('../src/app/api/email/inbound/route.ts', import.meta.url), 'utf8')
  expect(route).toContain('export async function POST')
  expect(route).toContain('export async function GET')
  expect(route).toContain("'force-dynamic'")
  expect(readFileSync(new URL('../fly.toml', import.meta.url), 'utf8')).toContain('path = "/api/email/inbound"')
  expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('bun test tests/inbound-mail.test.mjs tests/mail-screening.test.mjs')
})
test('forwards only to fixed Gmail, preserving raw message, with stable idempotency', async () => {
  const sent = []
  const fetcher = async (url, options) => {
    if (url.includes('/emails/receiving/')) return Response.json({ ...authenticated, id, to: event.data.to, from: 'Sender <sender@example.org>', subject: 'Test', text: 'Hello', raw: { download_url: 'https://files.example.org/raw' } })
    if (url === 'https://files.example.org/raw') return new Response('Subject: Test\r\n\r\nHello')
    sent.push(options)
    return Response.json({ id: 'sent' })
  }
  for (let n = 0; n < 2; n++) expect((await forwardInbound(request(), env, fetcher, now)).status).toBe(200)
  expect(sent[0].headers['Idempotency-Key']).toBe(sent[1].headers['Idempotency-Key'])
  const body = JSON.parse(sent[0].body)
  expect(body.to).toEqual(['owner@example.com'])
  expect(body.reply_to).toBe('sender@example.org')
  expect(Buffer.from(body.attachments[0].content, 'base64').toString()).toContain('Subject: Test')
})
test('provider recipient mismatch fails before downloading', async () => {
  expect((await forwardInbound(request(), env, async () => Response.json({ id, to: ['other@wolventech.com'] }), now)).status).toBe(422)
})
test('provider failures remain retryable without exposing errors', async () => {
  const response = await forwardInbound(request(), env, async () => new Response('secret error', { status: 429 }), now)
  expect(response.status).toBe(502)
  expect(await response.text()).not.toContain('secret')
})
test('oversized input rejected', async () => {
  expect((await forwardInbound(new Request('https://example.org', { method: 'POST', body: 'x'.repeat(65537) }), env)).status).toBe(413)
})

test('support is accepted but unknown aliases stay ignored', async () => {
  const support = { ...event, data: { ...event.data, to: ['support@wolventech.com'] } }
  const fetcher = async (url) => {
    if (url.includes('/emails/receiving/')) return Response.json({ ...authenticated, id, to: support.data.to, from: 'sender@example.org', text: 'Hello', raw: { download_url: 'https://files.example.org/raw' } })
    return url.endsWith('/raw') ? new Response('Hello') : Response.json({ id: 'sent' })
  }
  expect(await (await forwardInbound(request(support), env, fetcher, now)).json()).toEqual({ status: 'forwarded' })
})

test('quarantine sends only a safe notice, never source content or attachments', async () => {
  const sends = []
  const fetcher = async (url, options) => {
    if (url.includes('/emails/receiving/')) return Response.json({ ...authenticated, authentication: { dmarc: 'fail' }, id, to: event.data.to,
      subject: 'Malicious subject https://evil.example', from: 'attacker@evil.example', text: 'Send your password to https://evil.example', raw: { download_url: 'https://files.example.org/raw' } })
    expect(url).toBe('https://api.resend.com/emails')
    sends.push(options)
    return Response.json({ id: 'notice' })
  }
  expect(await (await forwardInbound(request(), env, fetcher, now)).json()).toEqual({ status: 'quarantined' })
  const body = JSON.parse(sends[0].body)
  expect(body.to).toEqual(['owner@example.com'])
  expect(body.attachments).toBeUndefined()
  expect(body.html).toBeUndefined()
  expect(body.reply_to).toBeUndefined()
  expect(sends[0].body).not.toContain('evil.example')
  expect(sends[0].headers['Idempotency-Key']).toBe(`wolven-inbound-${id}`)
})

test('failed quarantine notification remains retryable', async () => {
  const fetcher = async (url) => url.includes('/emails/receiving/') ? Response.json({ id, to: event.data.to }) : new Response('', { status: 429 })
  expect(await (await forwardInbound(request(), env, fetcher, now)).json()).toEqual({ status: 'review_notice_failed' })
})
