import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json(
    {
      token: process.env.POSTHOG_PROJECT_TOKEN || null,
      host: process.env.POSTHOG_HOST || null,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
