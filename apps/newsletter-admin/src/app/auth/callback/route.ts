import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    if (!data.user) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    // Check if user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      // User is not an admin, sign them out
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/login?error=unauthorized`)
    }

    // Record login
    try {
      await supabase.rpc('record_admin_login', { user_id: data.user.id })
    } catch (err) {
      console.error('Failed to record admin login:', err)
      // Continue anyway - this is not critical
    }

    // Redirect to dashboard
    return NextResponse.redirect(`${origin}/`)
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}
