'use client'

import { initializeServicePayment, verifyServicePayment } from '@/actions/payment-action'
import { Button } from '@decebal/ui/button'
import { AlertCircle, Check, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface PaymentModalProps {
  serviceSlug: string
  walletAddress: string
  amount: number
  onClose: () => void
  onSuccess: () => void
}

type PaymentStatus = 'initializing' | 'pending' | 'verifying' | 'confirmed' | 'failed'

export default function PaymentModal({
  serviceSlug,
  walletAddress,
  amount,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [status, setStatus] = useState<PaymentStatus>('initializing')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [dbPaymentId, setDbPaymentId] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verificationAttempts, setVerificationAttempts] = useState(0)

  // Initialize payment
  useEffect(() => {
    async function initPayment() {
      try {
        const result = await initializeServicePayment({
          walletAddress,
          serviceSlug,
          amount,
        })

        if (!result.success) {
          setError(result.error || 'Failed to initialize payment')
          setStatus('failed')
          return
        }

        setQrCode(result.payment.qrCode)
        setPaymentUrl(result.payment.url)
        setDbPaymentId(result.payment.dbPaymentId)
        setReference(result.payment.reference)
        setStatus('pending')
      } catch (err) {
        console.error('Payment initialization error:', err)
        setError('Failed to initialize payment')
        setStatus('failed')
      }
    }

    initPayment()
  }, [walletAddress, serviceSlug, amount])

  // Poll for payment verification
  useEffect(() => {
    if (status !== 'pending' || !reference || !dbPaymentId) return

    const interval = setInterval(async () => {
      try {
        setVerificationAttempts((prev) => prev + 1)

        const result = await verifyServicePayment({
          reference,
          dbPaymentId,
          walletAddress,
          serviceSlug,
        })

        if (!result.success) {
          // Don't set error on verification failure, just continue polling
          return
        }

        if (result.status === 'confirmed') {
          setStatus('confirmed')
          clearInterval(interval)

          // Wait a moment then call onSuccess
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      } catch (err) {
        console.error('Verification error:', err)
        // Continue polling even on error
      }
    }, 3000) // Check every 3 seconds

    // Stop polling after 5 minutes
    const timeout = setTimeout(
      () => {
        clearInterval(interval)
        if (status === 'pending') {
          setError(
            'Payment verification timed out. Please contact support if you made the payment.'
          )
          setStatus('failed')
        }
      },
      5 * 60 * 1000
    )

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [status, reference, dbPaymentId, walletAddress, serviceSlug, onSuccess])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg max-w-md w-full p-8 relative">
        {/* Close Button */}
        {status !== 'confirmed' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Initializing */}
        {status === 'initializing' && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-brand-teal animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Initializing Payment...</p>
            <p className="text-gray-400 text-sm">Generating QR code</p>
          </div>
        )}

        {/* Pending Payment */}
        {status === 'pending' && qrCode && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Scan to Pay</h3>
            <p className="text-gray-300 mb-6">
              Scan with your Solana wallet or click the button below
            </p>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg mb-6 inline-block">
              <Image src={qrCode} alt="Payment QR Code" width={256} height={256} />
            </div>

            {/* Amount */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-1">Amount</p>
              <p className="text-2xl font-bold text-brand-teal">{amount.toFixed(3)} SOL</p>
            </div>

            {/* Pay Button */}
            {paymentUrl && (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold px-6 py-3 rounded-lg mb-4 transition-all"
              >
                Open in Wallet App
              </a>
            )}

            {/* Status */}
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Waiting for payment... (check {verificationAttempts})</span>
            </div>
          </div>
        )}

        {/* Verifying */}
        {status === 'verifying' && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-brand-teal animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Verifying Payment...</p>
            <p className="text-gray-400 text-sm">Confirming on blockchain</p>
          </div>
        )}

        {/* Confirmed */}
        {status === 'confirmed' && (
          <div className="text-center">
            <div className="bg-green-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h3>
            <p className="text-gray-300 mb-6">Access granted. Unlocking content...</p>
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div className="text-center">
            <div className="bg-red-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Failed</h3>
            <p className="text-gray-300 mb-6">{error || 'Something went wrong'}</p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
