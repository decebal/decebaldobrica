'use client'

import { bookMeeting } from '@/actions/meeting-action'
import Footer from '@/components/Footer'
import ChatInterfaceAI from '@/components/ChatInterfaceAI'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import {
  MEETING_TYPES_WITH_PRICING,
  formatSOL,
  formatUSDEquivalent,
  type MeetingPaymentConfig,
} from '@/lib/meetingPayments'
import { Calendar, Clock, CreditCard, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ComicText } from '@/components/ui/comic-text'
import { Sparkles } from '@/components/ui/sparkles'
import { Confetti } from '@/components/ui/confetti'
import { motion } from 'framer-motion'
import { getReferralData, clearReferralData, formatReferralData } from '@/utils/referralTracking'
import { featureFlags } from '@/lib/featureFlags'

export default function ContactBookingPage() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || undefined

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPaymentConfig | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [category, setCategory] = useState<string | undefined>(urlCategory)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    notes: '',
    paymentMethod: 'SOL' as 'SOL' | 'BTC' | 'ETH' | 'USDC',
    // Honeypot field for spam prevention
    website: '',
  })

  const meetingTypes = Object.values(MEETING_TYPES_WITH_PRICING).filter(
    config => featureFlags.enablePaidMeetings || !config.requiresPayment
  )

  // Load referral data from localStorage on mount
  useEffect(() => {
    const referralData = getReferralData()
    if (referralData) {
      // Merge referral data with URL category
      const enrichedCategory = formatReferralData(referralData)
      setCategory(enrichedCategory || urlCategory)
    }
  }, [urlCategory])

  // Auto-select meeting if only one option available
  useEffect(() => {
    if (meetingTypes.length === 1 && !selectedMeeting) {
      setSelectedMeeting(meetingTypes[0])
    }
  }, [meetingTypes, selectedMeeting])

  const handleSelectMeeting = (meetingType: string) => {
    const config = MEETING_TYPES_WITH_PRICING[meetingType]
    setSelectedMeeting(config)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!selectedMeeting) {
        toast({
          title: 'Error',
          description: 'Please select a meeting type',
          variant: 'destructive',
        })
        return
      }

      // Spam check: honeypot field should be empty
      if (formData.website) {
        // Bot detected - silently fail without notification
        console.log('Spam detected via honeypot field')
        setIsSubmitting(false)
        return
      }

      // For paid meetings, you'd integrate Solana Pay here
      let paymentId: string | undefined

      if (selectedMeeting.requiresPayment) {
        toast({
          title: 'Payment Required',
          description: `This meeting requires payment of ${formatSOL(selectedMeeting.price)}. Solana Pay integration coming soon!`,
        })
        // TODO: Integrate Solana Pay payment flow
        // For now, we'll skip payment validation
      }

      const result = await bookMeeting({
        meetingType: selectedMeeting.meetingType,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        email: formData.email,
        notes: formData.notes,
        category,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        paymentId,
        paymentMethod: formData.paymentMethod,
      })

      if (result.success) {
        setBookingSuccess(true)
        clearReferralData() // Clear referral tracking after successful booking
        toast({
          title: 'Meeting Booked!',
          description: 'Check your email for confirmation and calendar invite.',
        })
      } else {
        toast({
          title: 'Booking Failed',
          description: result.error || 'Please try again later',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Smooth scroll to top when booking succeeds
  useEffect(() => {
    if (bookingSuccess) {
      // Smooth scroll to top with a slight delay for the transition
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }

      // Start scroll after a brief moment
      const timer = setTimeout(scrollToTop, 100)
      return () => clearTimeout(timer)
    }
  }, [bookingSuccess])

  if (bookingSuccess) {
    return (
      <div className="min-h-screen relative">
        <Confetti particleCount={100} />
        <main className="pt-24 pb-16">
          <div className="section-container py-16">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="mb-8 flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <div className="bg-green-500/20 p-6 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              </motion.div>
              <motion.h1
                className="text-4xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <ComicText delay={0.5}>Booking Confirmed!</ComicText>
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Your meeting has been successfully scheduled. You'll receive a calendar invitation
                and confirmation email shortly.
              </motion.p>
              <motion.div
                className="flex gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href="/services">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                  </Button>
                </Link>
                <Link href="/">
                  <Button>Go to Home</Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        {/* Header */}
        <div className="section-container py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <Sparkles sparkleCount={15}>
              <ComicText>Let's Connect</ComicText>
            </Sparkles>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 max-w-2xl mb-2"
          >
            Schedule a consultation or ask me anything about my services, experience, and availability.
          </motion.p>

          {/* Referral indicator */}
          {category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 inline-block"
            >
              <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg px-4 py-2 text-sm text-brand-teal">
                📍 Coming from: <span className="font-semibold">{category}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Chat Section - Now First */}
        <div className="section-container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <MessageSquare className="h-6 w-6 text-brand-teal" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Ask My AI Assistant</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Have questions? Chat with my AI assistant for instant answers about services, availability, and more.
              <span className="text-brand-teal font-semibold"> The booking form is available below</span> if you're ready to schedule a consultation.
            </p>
            <ChatInterfaceAI />
          </motion.div>
        </div>

        {/* Booking Form Section - Now Below Chat */}
        <div className="section-container py-8">
          <div className="max-w-4xl mx-auto space-y-8">
              {meetingTypes.length > 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Available Consultations</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {meetingTypes.map((config, index) => (
                    <motion.div
                      key={config.meetingType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: selectedMeeting?.meetingType === config.meetingType ? 0 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all h-full ${
                          selectedMeeting?.meetingType === config.meetingType
                            ? 'border-brand-teal shadow-lg shadow-brand-teal/20 bg-brand-teal/5'
                            : 'border-white/10 bg-white/5'
                        } backdrop-blur-sm relative overflow-hidden group`}
                        onClick={() => handleSelectMeeting(config.meetingType)}
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        <CardHeader>
                          <CardTitle className="text-white text-lg">
                            {config.meetingType.split('(')[0].trim()}
                          </CardTitle>
                          <div className="text-gray-400 space-y-2 mt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{config.duration} minutes</span>
                            </div>
                            {config.requiresPayment ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-brand-teal font-semibold text-sm">
                                  <CreditCard className="h-4 w-4" />
                                  <span>
                                    {formatSOL(config.price)}
                                    <span className="text-xs ml-1">
                                      {formatUSDEquivalent(config.price)}
                                    </span>
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Multiple payment options
                                </div>
                              </div>
                            ) : (
                              <div className="text-green-500 font-semibold text-sm">Free</div>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Form */}
              {selectedMeeting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      Book {selectedMeeting.meetingType}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Fill in your details to schedule the meeting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            required
                            placeholder="Your Full Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-white">
                            Preferred Date *
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            required
                            value={formData.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-white">
                            Preferred Time *
                          </Label>
                          <Input
                            id="time"
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-white">
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Tell me about your project, goals, or what you'd like to discuss..."
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[120px]"
                        />
                      </div>

                      {selectedMeeting.requiresPayment && (
                        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-4 space-y-4">
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-brand-teal mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-white mb-1">Payment Required</h4>
                              <p className="text-sm text-gray-300">
                                This consultation requires a payment of {formatSOL(selectedMeeting.price)}{' '}
                                ({formatUSDEquivalent(selectedMeeting.price)}).
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-white mb-2 block">Select Payment Method</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { value: 'SOL', label: 'Solana', icon: '◎' },
                                { value: 'BTC', label: 'Bitcoin (Lightning)', icon: '₿' },
                                { value: 'ETH', label: 'Ethereum (L2)', icon: 'Ξ' },
                                { value: 'USDC', label: 'USDC', icon: '$' },
                              ].map((method) => (
                                <button
                                  key={method.value}
                                  type="button"
                                  onClick={() => handleInputChange('paymentMethod', method.value)}
                                  className={`p-3 rounded-lg border transition-all text-left ${
                                    formData.paymentMethod === method.value
                                      ? 'border-brand-teal bg-brand-teal/20 text-white'
                                      : 'border-white/20 bg-white/5 text-gray-300 hover:border-brand-teal/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{method.icon}</span>
                                    <span className="text-sm font-medium">{method.label}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Honeypot field for spam prevention - hidden from humans, visible to bots */}
                      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="Leave this field empty"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-teal hover:bg-brand-teal/80 text-white"
                        size="lg"
                      >
                        {isSubmitting ? (
                          'Processing...'
                        ) : (
                          <>
                            <Calendar className="mr-2 h-5 w-5" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                </motion.div>
              )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
