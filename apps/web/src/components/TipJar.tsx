'use client'

import PaymentMethodSelector from '@/components/PaymentMethodSelector'
import SolanaPaymentModal from '@/components/SolanaPaymentModal'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@decebal/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@decebal/ui/dialog'
import { GlowButton } from '@decebal/ui/glow-button'
import { Input } from '@decebal/ui/input'
import { Coffee, DollarSign, Heart } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

interface TipJarProps {
  title: string
  author?: string
}

const TipJar: React.FC<TipJarProps> = ({ title, author = 'the author' }) => {
  const { toast } = useToast()
  const [tipAmount, setTipAmount] = useState<number>(1)
  const [showTipDialog, setShowTipDialog] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('solana')
  const [showSolanaModal, setShowSolanaModal] = useState<boolean>(false)

  const predefinedAmounts = [1, 3, 5, 10]

  const handleTipAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setTipAmount(Number.isNaN(value) ? 0 : value)
  }

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
  }

  const handleProceedToPayment = () => {
    if (tipAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid tip amount',
        variant: 'destructive',
      })
      return
    }

    if (paymentMethod === 'solana') {
      setShowTipDialog(false)
      setShowSolanaModal(true)
    } else if (paymentMethod === 'stripe') {
      // For demonstration purposes, just show a toast
      toast({
        title: 'Stripe payment selected',
        description: 'Stripe integration would be implemented here',
      })
    } else if (paymentMethod === 'paypal') {
      // For demonstration purposes, just show a toast
      toast({
        title: 'PayPal payment selected',
        description: 'PayPal integration would be implemented here',
      })
    }
  }

  const handleSolanaPaymentSuccess = () => {
    toast({
      title: 'Thank you for your tip!',
      description: `Your ${tipAmount} SOL tip is greatly appreciated.`,
    })
  }

  return (
    <>
      <div className="flex flex-col items-center mt-12 mb-6 p-6 border border-brand-teal/20 rounded-lg bg-brand-darknavy/30 text-center">
        <Heart className="w-8 h-8 text-brand-teal mb-4" />
        <h3 className="text-xl font-medium text-brand-heading mb-2">Enjoyed this article?</h3>
        <p className="text-gray-300 mb-4">
          If you found this content helpful, consider supporting {author} with a tip.
        </p>
        <Button
          onClick={() => setShowTipDialog(true)}
          variant="outline"
          className="group border-brand-teal/30 hover:border-brand-teal/60 hover:bg-brand-teal/10 transition-all"
        >
          <Coffee className="mr-2 h-4 w-4 text-brand-teal group-hover:text-brand-teal" />
          <span className="text-brand-teal">Buy me a coffee</span>
        </Button>
      </div>

      {/* Tip Dialog */}
      <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <DialogContent className="bg-brand-darknavy border border-brand-teal/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl mb-2">Support this content</DialogTitle>
            <DialogDescription className="text-gray-300">
              Thanks for supporting "{title}". Choose your tip amount and payment method.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6">
              <label htmlFor="tip-amount" className="block text-sm font-medium text-gray-300 mb-2">
                Amount
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={tipAmount === amount ? 'default' : 'outline'}
                    className={tipAmount === amount ? 'bg-brand-teal hover:bg-brand-teal/90' : ''}
                    onClick={() => setTipAmount(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  id="tip-amount"
                  type="number"
                  value={tipAmount}
                  onChange={handleTipAmountChange}
                  min="0.1"
                  step="0.1"
                  className="bg-transparent border-gray-700 focus:border-brand-teal"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="block text-sm font-medium text-gray-300 mb-2">Payment Method</div>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelectMethod={handlePaymentMethodChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <GlowButton onClick={handleProceedToPayment}>Proceed to payment</GlowButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Solana Payment Modal */}
      <SolanaPaymentModal
        open={showSolanaModal}
        onOpenChange={setShowSolanaModal}
        amount={tipAmount}
        serviceName={`Tip for "${title}"`}
        onPaymentSuccess={handleSolanaPaymentSuccess}
      />
    </>
  )
}

export default TipJar
