'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { LogOut, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * User menu.
 *
 * Migration note (event model §2): Supabase GoTrue auth has been removed, so
 * identity here is the connected Solana wallet. This is a `'use client'`
 * component and intentionally holds NO server credentials — it never imports the
 * AllSource client or service key. Any data it needs beyond the wallet adapter
 * must come from a server action / route handler.
 */
export default function UserMenu() {
  const { publicKey, disconnect } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Logged in == wallet connected (the only identity source after the cutover).
  const isLoggedIn = !!publicKey

  if (!isLoggedIn) {
    return null
  }

  const displayName = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : 'User'

  const handleLogout = async () => {
    if (publicKey) {
      await disconnect()
    }
    setIsOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="hidden md:block text-sm text-white">{displayName}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-brand-darknavy border border-white/10 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">Wallet Connected</p>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/5 rounded transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
