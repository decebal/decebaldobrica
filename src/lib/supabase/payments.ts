import { createClient } from './server'

export async function ensureUserProfile(walletAddress: string, userId: string) {
  const supabase = await createClient()

  // Check if profile exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (existing) return existing.id

  // Create profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      wallet_address: walletAddress,
      wallet_chain: 'solana',
    })
    .select()
    .single()

  if (error) throw error
  return data.id
}

export async function savePaymentToSupabase(
  walletAddress: string,
  serviceSlug: string,
  amount: number,
  reference: string,
  userId?: string
) {
  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (!profile) {
    throw new Error('User profile not found. Please connect your wallet first.')
  }

  // Create payment record
  const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const { error } = await supabase.from('payment_transactions').insert({
    id: paymentId,
    user_id: profile.id,
    wallet_address: walletAddress,
    service_slug: serviceSlug,
    amount,
    reference,
    status: 'pending',
  })

  if (error) throw error
  return paymentId
}

export async function confirmPayment(paymentId: string, signature: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('payment_transactions')
    .update({
      status: 'confirmed',
      signature,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', paymentId)

  if (error) throw error
}

export async function grantServiceAccess(
  walletAddress: string,
  serviceSlug: string,
  paymentId: string
) {
  const supabase = await createClient()

  // Get user
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (!profile) throw new Error('User not found')

  // Grant access (upsert to avoid duplicates)
  const { error } = await supabase.from('user_service_access').upsert(
    {
      user_id: profile.id,
      wallet_address: walletAddress,
      service_slug: serviceSlug,
      payment_id: paymentId,
    },
    {
      onConflict: 'wallet_address,service_slug',
    }
  )

  if (error) throw error
}

export async function checkAccess(walletAddress: string, serviceSlug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('user_service_access')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('service_slug', serviceSlug)
    .single()

  return { hasAccess: !!data, access: data }
}

export async function getUserPayments(walletAddress: string, limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getUserAccess(walletAddress: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_service_access')
    .select('*')
    .eq('wallet_address', walletAddress)

  if (error) throw error
  return data || []
}
