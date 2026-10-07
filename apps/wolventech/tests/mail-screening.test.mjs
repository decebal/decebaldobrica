import { expect, test } from 'bun:test'
import { forwardingDestination, screenInbound } from '../src/lib/mail-screening.mjs'

const clean = { authentication: { spf: 'pass', dkim: 'pass', dmarc: 'pass' }, headers: {}, attachments: [], text: 'Your project update is ready.' }
const reasons = (changes) => screenInbound({ ...clean, ...changes }).reasons

test('authenticated ordinary mail and Salesforce activation link pass', () => {
  expect(screenInbound({ ...clean, html: '<a href="https://login.salesforce.com/activate?token=example">Activate your account</a>' }).action).toBe('forward')
})
test('header claims never override server authentication', () => {
  expect(reasons({ authentication: { dmarc: 'fail' }, headers: { 'Authentication-Results': 'dmarc=pass', 'X-SES-Spam-Verdict': 'PASS' } })).toContain('authentication_failed')
  expect(reasons({ authentication: null, headers: { 'Authentication-Results': 'dmarc=pass' } })).toContain('authentication_unverified')
})
test('missing, pending and failed authentication are held for review', () => {
  for (const authentication of [null, undefined, {}, { dmarc: 'unknown' }, { dmarc: 'processing_failed' }, { dmarc: 'gray', spf: 'gray', dkim: 'gray' }]) {
    expect(reasons({ authentication })).toContain('authentication_unverified')
  }
  expect(reasons({ authentication: { dmarc: 'gray', spf: 'fail', dkim: 'fail' } })).toContain('authentication_failed')
  expect(screenInbound({ ...clean, authentication: { dmarc: 'gray', dkim: 'pass', spf: 'gray' } }).action).toBe('forward')
})
test('negative spam and virus indicators cause review', () => {
  expect(reasons({ headers: { 'X-SES-Spam-Verdict': 'FAIL', 'x-ses-virus-verdict': 'FAIL' } })).toEqual(['reported_spam', 'reported_virus'])
  expect(reasons({ headers: { 'X-Spam-Status': 'Yes, score=9' } })).toContain('reported_spam')
})
test('active attachments and archives stay out of Gmail', () => {
  for (const filename of ['invoice.pdf.exe', 'offer.docm', 'script.JS ', 'login.html', 'files.zip', 'image.svg', 'report\u202egpj.exe']) {
    expect(reasons({ attachments: [{ filename, content_type: 'application/octet-stream' }] })).toContain('dangerous_attachment')
  }
  expect(reasons({ attachments: [{ filename: 'report.txt', content_type: 'application/javascript' }] })).toContain('dangerous_attachment')
  expect(reasons({ attachments: [{ filename: 'report.pdf', content_type: 'application/pdf' }] })).toEqual([])
  for (const attachments of [undefined, null, {}, [null], [{}], [{ filename: 'report.pdf' }]]) expect(reasons({ attachments })).toContain('attachment_metadata_missing')
})
test('obscured link destinations are held without fetching them', () => {
  for (const href of ['http://example.org', 'https://192.0.2.1', 'https://[::1]', 'https://login.salesforce.com@evil.example', 'https://xn--pple-43d.example', 'https://bit.ly/example', 'javascript:alert(1)', 'java&#x73;cript:alert(1)', '//evil.example', 'https://exa&#10;mple.org']) {
    expect(reasons({ html: `<a href="${href}">Open</a>` })).toContain('suspicious_link')
  }
})
test('misleading visible domains are detected with subdomains allowed', () => {
  for (const label of ['https://salesforce.com', 'www.salesforce.com', 'salesforce.com']) {
    expect(reasons({ html: `<a href="https://evil.example">${label}</a>` })).toContain('misleading_link')
  }
  expect(reasons({ html: '<a href="https://login.salesforce.com/activate">https://salesforce.com</a>' })).toEqual([])
  expect(reasons({ html: '<a href="https://salesforce.com.evil.example">https://salesforce.com</a>' })).toContain('misleading_link')
})
test('credential requests and common scam phrases are held', () => {
  expect(reasons({ text: 'Reply with your password' })).toContain('credential_request')
  expect(reasons({ text: 'Provide your seed phrase' })).toContain('credential_request')
  expect(reasons({ subject: 'Claim your prize' })).toContain('spam_pattern')
  expect(reasons({ text: 'Never share your password. Use your verification code in our app.' })).toEqual([])
})
test('screening limits hold rather than silently truncating', () => {
  expect(reasons({ text: 'a'.repeat(250001) })).toContain('content_too_large')
})
test('destination is configured and rejects header injection or multiple recipients', () => {
  expect(forwardingDestination({ RESEND_INBOUND_FORWARD_TO: 'owner@example.com' })).toBe('owner@example.com')
  for (const value of [undefined, '', 'owner@example.com\r\nBcc:other@example.com', 'one@example.com,two@example.com', 'Name <owner@example.com>']) {
    expect(forwardingDestination({ RESEND_INBOUND_FORWARD_TO: value })).toBeUndefined()
  }
})
