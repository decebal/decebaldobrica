import { forwardInbound } from '@/lib/inbound-mail.mjs'
import { forwardingDestination } from '@/lib/mail-screening.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const ready = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_INBOUND_WEBHOOK_SECRET && forwardingDestination(process.env))
  return Response.json({ status: ready ? 'ready' : 'not_configured' }, {
    status: ready ? 200 : 503,
    headers: { 'cache-control': 'no-store' },
  })
}

export async function POST(request: Request): Promise<Response> {
  return forwardInbound(request, process.env)
}
