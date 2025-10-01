'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { checkSolanaPayment, createSolanaPayment, generateUniqueReference } from '@/utils/solanaPay'
import type { PublicKey } from '@solana/web3.js'
import React, { useEffect, useRef, useState } from 'react'
import SolanaIcon from './icons/SolanaIcon'

interface SolanaPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  serviceName: string
  onPaymentSuccess: () => void
}

const SolanaPaymentModal = ({
  open,
  onOpenChange,
  amount,
  serviceName,
  onPaymentSuccess,
}: SolanaPaymentModalProps) => {
  const { toast } = useToast()
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const [reference, setReference] = useState<PublicKey | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  // Generate payment QR code
  useEffect(() => {
    if (open && qrCodeRef.current) {
      const initialize = async () => {
        try {
          setLoading(true)

          // Clear previous QR code
          qrCodeRef.current.innerHTML = ''

          // Generate a unique reference for this payment
          const newReference = generateUniqueReference()
          setReference(newReference)

          // Create Solana Pay URL and QR code
          const { url, qrCode } = await createSolanaPayment(
            amount,
            newReference.toString(),
            `Payment for ${serviceName}`,
            `Thank you for booking ${serviceName}`
          )

          setPaymentUrl(url)

          // Add QR code to the DOM
          qrCodeRef.current.appendChild(qrCode)
          setLoading(false)
        } catch (error) {
          console.error('Error creating payment:', error)
          toast({
            title: 'Error creating payment',
            description: 'There was an error setting up Solana Pay. Please try again.',
            variant: 'destructive',
          })
          setLoading(false)
        }
      }

      initialize()
    }

    // Cleanup
    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = ''
      }
    }
  }, [open, amount, serviceName, toast])

  // Function to check payment status
  const checkPayment = async () => {
    if (!reference) return

    setCheckingPayment(true)

    await checkSolanaPayment(
      reference,
      amount,
      () => {
        // Success
        toast({
          title: 'Payment successful!',
          description: 'Your payment has been confirmed. Thank you!',
        })
        setCheckingPayment(false)
        onOpenChange(false)
        onPaymentSuccess()
      },
      (error) => {
        // Error
        toast({
          title: 'Payment not confirmed',
          description: error,
          variant: 'destructive',
        })
        setCheckingPayment(false)
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-brand-darknavy border border-brand-teal/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl mb-2 flex items-center gap-2">
            <SolanaIcon className="text-brand-teal" size={24} />
            Solana Pay
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Scan the QR code with a Solana Pay compatible wallet to complete your payment of{' '}
            {amount} SOL.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
            </div>
          ) : (
            <>
              <div ref={qrCodeRef} className="flex justify-center mb-4"></div>

              {paymentUrl && (
                <div className="text-center mb-4">
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal hover:underline text-sm"
                  >
                    Open in Wallet
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <p>
              Amount: <span className="text-white">{amount} SOL</span>
            </p>
          </div>
          <Button
            onClick={checkPayment}
            disabled={checkingPayment || loading}
            className="bg-brand-teal hover:bg-brand-teal/90 text-white"
          >
            {checkingPayment ? 'Checking...' : 'Check Payment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SolanaPaymentModal
