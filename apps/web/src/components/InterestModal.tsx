'use client'

import { Button } from '@decebal/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@decebal/ui/dialog'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface InterestModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planId: 'premium' | 'founding'
  userEmail?: string
}

export function InterestModal({
  isOpen,
  onClose,
  planName,
  planId,
  userEmail,
}: InterestModalProps) {
  const [email, setEmail] = useState(userEmail || '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          planId,
          planName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage("Thanks for your interest! We'll notify you when this plan is available.")
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to register interest. Please try again.')
    }
  }

  const handleClose = () => {
    setStatus('idle')
    setEmail('')
    setMessage('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {status === 'success' ? 'Interest Registered!' : `Interested in ${planName}?`}
          </DialogTitle>
          <DialogDescription>
            {status === 'success'
              ? "We've saved your email and will let you know as soon as this plan becomes available."
              : "This plan is coming soon! Leave your email and we'll notify you when it's ready."}
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-full bg-brand-teal/20 p-4">
              <CheckCircle2 className="h-12 w-12 text-brand-teal" />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400">{message}</p>
            <Button onClick={handleClose} className="w-full bg-brand-teal hover:bg-brand-teal/80">
              Got it!
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={status === 'loading'}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 bg-brand-teal hover:bg-brand-teal/80"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Notify Me'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
