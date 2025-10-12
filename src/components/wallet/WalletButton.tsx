'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React from 'react'

export function WalletButton() {
  return (
    <WalletMultiButton
      className="!bg-brand-teal hover:!bg-brand-teal/90 !text-white !font-semibold !px-6 !py-3 !rounded-lg !transition-all"
      style={{
        backgroundColor: 'rgb(var(--brand-teal))',
        color: 'white',
      }}
    />
  )
}

export function WalletInfo() {
  const { publicKey, connected } = useWallet()

  if (!connected || !publicKey) return null

  const address = publicKey.toString()
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <div className="text-sm text-gray-300">
      Connected: <span className="text-brand-teal font-mono">{shortAddress}</span>
    </div>
  )
}
