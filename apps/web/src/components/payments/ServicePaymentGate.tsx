'use client'

import { checkWalletAccess } from '@/actions/wallet-action'
import { getServiceAccessTier } from '@/lib/serviceAccessConfig'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Check, Lock, Unlock, Wallet } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import PaymentModal from './PaymentModal'

interface ServicePaymentGateProps {
  serviceSlug: string
  children: React.ReactNode
}

export default function ServicePaymentGate({ serviceSlug, children }: ServicePaymentGateProps) {
  const { publicKey, connected } = useWallet()
  const [hasAccess, setHasAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const tier = getServiceAccessTier(serviceSlug)

  // Check access when wallet connects
  useEffect(() => {
    async function checkAccess() {
      if (!connected || !publicKey) {
        setHasAccess(false)
        setIsChecking(false)
        return
      }

      setIsChecking(true)
      try {
        const result = await checkWalletAccess({
          walletAddress: publicKey.toString(),
          serviceSlug,
        })

        setHasAccess(result.hasAccess)
      } catch (error) {
        console.error('Failed to check access:', error)
        setHasAccess(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAccess()
  }, [connected, publicKey, serviceSlug])

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>
  }

  // Loading state
  if (isChecking && connected) {
    return (
      <div className="min-h-[600px] flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4" />
          <p className="text-gray-300">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!tier) {
    return (
      <div className="min-h-[600px] flex items-center justify-center py-16">
        <div className="text-center text-red-400">
          <p>Invalid service configuration</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[600px] flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="brand-card p-12 rounded-lg text-center">
            {/* Lock Icon */}
            <div className="bg-brand-teal/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-brand-teal" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-4">{tier.name}</h2>
            <p className="text-gray-300 mb-2 text-lg">{tier.description}</p>

            {/* Price */}
            <div className="text-4xl font-bold text-brand-teal mb-8">
              {tier.price.toFixed(3)} SOL{' '}
              <span className="text-xl text-gray-400">(~${tier.priceUSD})</span>
            </div>

            {/* Benefits */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-xl font-bold text-white mb-4">What You'll Get:</h3>
              <ul className="space-y-3">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <Check className="h-5 w-5 text-brand-teal mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wallet Connection / Payment */}
            {!connected ? (
              <div>
                <p className="text-gray-300 mb-6">Connect your Solana wallet to unlock access</p>
                <div className="flex justify-center">
                  <WalletMultiButton className="!bg-brand-teal hover:!bg-brand-teal/90 !text-white !font-semibold !px-8 !py-4 !rounded-lg !text-lg" />
                </div>
                <p className="text-sm text-gray-400 mt-6">
                  <Wallet className="inline h-4 w-4 mr-1" />
                  Supports Phantom, Solflare, and all standard Solana wallets
                </p>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all inline-flex items-center"
                >
                  <Unlock className="mr-2 h-5 w-5" />
                  Unlock Now
                </button>
                <p className="text-sm text-gray-400 mt-6">
                  One-time payment • Instant access • Lifetime validity
                </p>
              </div>
            )}

            {/* Why This Works */}
            <div className="mt-8 pt-8 border-t border-white/10 text-left">
              <h3 className="text-lg font-bold text-white mb-3">Why Unlock?</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <span className="text-brand-teal">•</span> Shows you're serious about quality work
                </li>
                <li>
                  <span className="text-brand-teal">•</span> Filters tire-kickers and respects
                  everyone's time
                </li>
                <li>
                  <span className="text-brand-teal">•</span> Premium pricing for premium expertise
                </li>
                <li>
                  <span className="text-brand-teal">•</span> Web3-native • Transparent • Trustless
                </li>
              </ul>
            </div>

            {/* Alternative CTA */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-4">Not ready to unlock?</p>
              <a href="/contact" className="text-brand-teal hover:text-brand-teal/80 underline">
                Schedule a free discovery call instead
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && publicKey && (
        <PaymentModal
          serviceSlug={serviceSlug}
          walletAddress={publicKey.toString()}
          amount={tier.price}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setHasAccess(true)
            setShowPaymentModal(false)
          }}
        />
      )}
    </>
  )
}
