import { createClient } from './client'

export async function signInWithSolanaWallet() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithWeb3({
    chain: 'solana',
    statement: 'Access premium content on decebaldobrica.com',
  })

  if (error) throw error
  return data
}

export async function getCurrentWalletUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getWalletAddress(): Promise<string | null> {
  const user = await getCurrentWalletUser()
  if (!user) return null

  // Wallet address is stored in user metadata or as part of user id
  return user.user_metadata?.wallet_address || null
}
