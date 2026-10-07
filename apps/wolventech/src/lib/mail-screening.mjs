import { isIP } from 'node:net'

const SHORTENERS = new Set(['bit.ly', 'tinyurl.com', 't.co', 'shorturl.at', 'rb.gy', 'is.gd'])
const ACTIVE_FILE = /\.(?:exe|com|scr|bat|cmd|ps1|vbs|vbe|js|jse|wsf|hta|lnk|msi|iso|img|zip|rar|7z|html?|svg|docm|xlsm|pptm)$/i
const ACTIVE_TYPE = /(?:javascript|x-msdownload|x-dosexec|x-sh|x-executable|text\/html|image\/svg\+xml|zip|rar|7z|macroenabled)/i
const MAILBOX = /^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/

export const REVIEW_REASONS = Object.freeze({
  authentication_failed: 'The receiving service reported failed sender authentication.',
  authentication_unverified: 'The receiving service could not establish sender authentication.',
  reported_spam: 'The message carries a negative spam verdict.',
  reported_virus: 'The message carries a negative virus verdict.',
  dangerous_attachment: 'An attachment is active content, a macro document or an archive requiring review.',
  attachment_metadata_missing: 'Attachment metadata could not be checked.',
  suspicious_link: 'A link uses an obscured address, unsafe scheme, IP address or URL shortener.',
  misleading_link: 'A displayed web address differs from its link destination.',
  credential_request: 'The message asks the recipient to disclose credentials or recovery codes.',
  spam_pattern: 'The message matches a common prize, payment or investment scam phrase.',
  content_too_large: 'The message exceeds the automatic screening limit.',
})

export function forwardingDestination(env) {
  const address = env.RESEND_INBOUND_FORWARD_TO
  return typeof address === 'string' && MAILBOX.test(address) ? address : undefined
}

function decodeEntities(value) {
  return value.replace(/&#(x[0-9a-f]+|\d+);?|&(amp|colon|sol|commat|period|tab|newline);/gi, (_, numeric, named) => {
    if (!numeric) return { amp: '&', colon: ':', sol: '/', commat: '@', period: '.', tab: '\t', newline: '\n' }[named.toLowerCase()]
    const code = numeric[0].toLowerCase() === 'x' ? Number.parseInt(numeric.slice(1), 16) : Number(numeric)
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '\ufffd'
  })
}

function linkHost(value, reasons) {
  const decoded = decodeEntities(value).trim()
  if (/^(?:mailto:|tel:|#)/i.test(decoded)) return undefined
  if (/[\u0000-\u0020\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/u.test(decoded)) reasons.add('suspicious_link')
  let url
  try { url = new URL(decoded) } catch { reasons.add('suspicious_link'); return undefined }
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (url.protocol !== 'https:' || url.username || url.password || isIP(host.replace(/^\[|\]$/g, '')) ||
      host.split('.').some(part => part.startsWith('xn--')) || SHORTENERS.has(host)) reasons.add('suspicious_link')
  return host
}

export function screenInbound(email) {
  const reasons = new Set()
  const auth = email.authentication
  if (auth?.dmarc === 'fail' || (auth?.spf === 'fail' && auth?.dkim === 'fail')) reasons.add('authentication_failed')
  else if (!(auth?.dmarc === 'pass' || (auth?.dmarc === 'gray' && (auth?.spf === 'pass' || auth?.dkim === 'pass')))) reasons.add('authentication_unverified')

  // Header PASS values are sender-controlled and never establish trust.
  for (const [name, raw] of Object.entries(email.headers ?? {})) {
    const value = String(raw)
    if ((/^x-ses-spam-verdict$/i.test(name) && /\bfail\b/i.test(value)) ||
        (/^x-spam-(?:flag|status)$/i.test(name) && /^yes\b/i.test(value.trim()))) reasons.add('reported_spam')
    if (/^x-ses-virus-verdict$/i.test(name) && /\bfail\b/i.test(value)) reasons.add('reported_virus')
  }
  if (!Array.isArray(email.attachments)) reasons.add('attachment_metadata_missing')
  for (const attachment of Array.isArray(email.attachments) ? email.attachments : []) {
    if (!attachment || typeof attachment.filename !== 'string' || typeof attachment.content_type !== 'string') {
      reasons.add('attachment_metadata_missing')
      continue
    }
    const name = String(attachment.filename ?? '').trim()
    if (ACTIVE_FILE.test(name) || /[\u202a-\u202e\u2066-\u2069]/u.test(name) ||
        ACTIVE_TYPE.test(String(attachment.content_type ?? ''))) reasons.add('dangerous_attachment')
  }
  const html = typeof email.html === 'string' ? email.html : ''
  const text = typeof email.text === 'string' ? email.text : ''
  if (html.length + text.length > 250000) reasons.add('content_too_large')
  else {
    for (const match of html.matchAll(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) linkHost(match[1] ?? match[2] ?? match[3], reasons)
    for (const match of text.matchAll(/https?:\/\/[^\s<>"']+/gi)) linkHost(match[0].replace(/[.,;)]+$/, ''), reasons)
    for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi)) {
      const label = decodeEntities(match[4].replace(/<[^>]*>/g, '')).trim()
      if (/^(?:https?:\/\/|www\.|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/|$))/i.test(label)) {
        const actual = linkHost(match[1] ?? match[2] ?? match[3], reasons)
        let shown
        try { shown = new URL(/^https?:\/\//i.test(label) ? label : `https://${label}`).hostname.replace(/^www\./, '') } catch { reasons.add('misleading_link') }
        if (actual && shown && actual !== shown && !actual.endsWith(`.${shown}`)) reasons.add('misleading_link')
      }
    }
    const prose = `${email.subject ?? ''}\n${text}\n${html.replace(/<[^>]*>/g, ' ')}`
    if (/\b(?:reply|respond|send|provide)\s+(?:to\s+\w+\s+)?(?:with\s+)?(?:us\s+)?(?:your\s+)?(?:password|seed phrase|recovery phrase|verification code|one.time password)\b/i.test(prose)) reasons.add('credential_request')
    if (/\b(?:claim your (?:cash|prize|lottery)|guaranteed (?:investment )?returns|pay (?:a |the )?release fee)\b/i.test(prose)) reasons.add('spam_pattern')
  }
  return { action: reasons.size ? 'quarantine' : 'forward', reasons: [...reasons].sort() }
}
