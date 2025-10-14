'use client'

import { bookMeeting } from '@/actions/meeting-action'
import ChatInterfaceAI from '@/components/ChatInterfaceAI'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ComicText } from '@/components/ui/comic-text'
import { Confetti } from '@/components/ui/confetti'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles } from '@/components/ui/sparkles'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { featureFlags } from '@/lib/featureFlags'
import {
  MEETING_TYPES_WITH_PRICING,
  type MeetingPaymentConfig,
  formatSOL,
  formatUSD,
  formatUSDEquivalent,
} from '@/lib/meetingPayments'
import { clearReferralData, formatReferralData, getReferralData } from '@/utils/referralTracking'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Info,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import TimezoneSelect, { type ITimezone } from 'react-timezone-select'

interface GeoPricingData {
  success: boolean
  location: {
    country: string
    city: string
    region: string
  }
  pricing: {
    tier: number
    tierName: string
    currency: string
    multiplier: number
    description: string
  }
  meetings: Array<{
    meetingType: string
    duration: number
    requiresPayment: boolean
    description?: string
    basePrice: number
    geoPrice: number
    formattedPrice: string
    priceCrypto: number
  }>
  discountEligible: boolean
  discountMessage: string | null
}

export default function ContactBookingPage() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || undefined

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPaymentConfig | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [category, setCategory] = useState<string | undefined>(urlCategory)
  const [geoPricing, setGeoPricing] = useState<GeoPricingData | null>(null)
  const [loadingGeo, setLoadingGeo] = useState(true)
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
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
    (config) => featureFlags.enablePaidMeetings || !config.requiresPayment
  )

  // Generate time slots based on meeting duration, filtered by timezone
  const timeSlots = useMemo(() => {
    if (!selectedMeeting || !formData.date) return []

    const slots: string[] = []
    const duration = selectedMeeting.duration
    // Determine interval: for 15-min meetings use 15min, for 30min use 30min, for 60/90 use 60min
    const interval = duration === 15 ? 15 : duration === 30 ? 30 : 60

    // Get user's timezone
    const userTimezone =
      typeof selectedTimezone === 'string' ? selectedTimezone : selectedTimezone.value
    const myTimezone = 'Europe/London'

    // Helper to get timezone offset in minutes for a specific date/time
    const getTimezoneOffset = (date: Date, tz: string): number => {
      // Format the date in both UTC and the target timezone
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }))
      return (tzDate.getTime() - utcDate.getTime()) / 60000
    }

    // Generate all possible slots in user's timezone (0-23 hours)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

        try {
          // Create a date object representing this time in the user's timezone
          // We'll use a reference date to calculate offsets
          const [year, month, day] = formData.date.split('-').map(Number)
          const referenceDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))

          // Get offset differences
          const userOffset = getTimezoneOffset(referenceDate, userTimezone)
          const myOffset = getTimezoneOffset(referenceDate, myTimezone)
          const offsetDiff = myOffset - userOffset

          // Calculate what time it would be in my timezone
          const myHour = hour + Math.floor(offsetDiff / 60)
          const myMinute = minute + (offsetDiff % 60)

          // Normalize minutes and hours
          let normalizedMyHour = myHour
          let normalizedMyMinute = myMinute

          if (normalizedMyMinute < 0) {
            normalizedMyMinute += 60
            normalizedMyHour -= 1
          } else if (normalizedMyMinute >= 60) {
            normalizedMyMinute -= 60
            normalizedMyHour += 1
          }

          // Normalize hours (handle day wraparound)
          normalizedMyHour = ((normalizedMyHour % 24) + 24) % 24

          // Only include slots that fall within my business hours (9 AM - 5 PM Europe/London)
          // Also ensure the meeting end time doesn't exceed 5 PM
          const meetingEndHour = normalizedMyHour + Math.floor((normalizedMyMinute + duration) / 60)
          const meetingEndMinute = (normalizedMyMinute + duration) % 60

          if (
            normalizedMyHour >= 9 &&
            normalizedMyHour < 17 &&
            (meetingEndHour < 17 || (meetingEndHour === 17 && meetingEndMinute === 0))
          ) {
            slots.push(timeString)
          }
        } catch (error) {
          // Skip invalid times
          continue
        }
      }
    }

    return slots
  }, [selectedMeeting, selectedTimezone, formData.date])

  // Fetch geo-pricing data on mount
  useEffect(() => {
    const fetchGeoPricing = async () => {
      try {
        const response = await fetch('/api/geo-pricing')
        if (response.ok) {
          const data = await response.json()
          setGeoPricing(data)
        }
      } catch (error) {
        console.error('Failed to fetch geo-pricing:', error)
      } finally {
        setLoadingGeo(false)
      }
    }

    fetchGeoPricing()
  }, [])

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

  // Fetch and pre-select next available slot when meeting type is selected
  useEffect(() => {
    if (!selectedMeeting) return

    const fetchNextAvailableSlot = async () => {
      try {
        const userTimezone =
          typeof selectedTimezone === 'string' ? selectedTimezone : selectedTimezone.value

        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: selectedMeeting.duration,
            timezone: userTimezone,
            daysToCheck: 14,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.slot) {
            // Pre-fill the date and time fields
            setFormData((prev) => ({
              ...prev,
              date: data.slot.date,
              time: data.slot.time,
            }))
          }
        }
      } catch (error) {
        console.error('Failed to fetch available slot:', error)
        // Silently fail - user can still manually select date/time
      }
    }

    fetchNextAvailableSlot()
  }, [selectedMeeting, selectedTimezone])

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
        timezone: typeof selectedTimezone === 'string' ? selectedTimezone : selectedTimezone.value,
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

  // Helper function to format time string to 12-hour display format
  const formatTimeDisplay = (timeString: string): string => {
    if (!timeString) return ''
    const [hour, minute] = timeString.split(':').map(Number)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  // Get geo-pricing for a specific meeting
  const getGeoPriceForMeeting = (meetingType: string) => {
    if (!geoPricing) return null
    return geoPricing.meetings.find((m) => m.meetingType === meetingType)
  }

  // Smooth scroll to top when booking succeeds
  useEffect(() => {
    if (bookingSuccess) {
      // Smooth scroll to top with a slight delay for the transition
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
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
              transition={{ duration: 0.6, ease: 'easeOut' }}
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
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href="/services">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full sm:w-auto">Go to Home</Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator on Success Page - Matches hero section style */}
            <motion.div
              className="flex justify-center mt-16 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="animate-bounce">
                <button
                  onClick={() => {
                    const chatSection = document.querySelector('[data-success-chat-section]')
                    if (chatSection) {
                      chatSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white/20 transition-colors"
                >
                  <ChevronDown className="text-brand-teal" />
                </button>
              </div>
            </motion.div>

            {/* Chat Section on Success Page */}
            <motion.div
              className="max-w-4xl mx-auto mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              data-success-chat-section
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  >
                    <MessageSquare className="h-6 w-6 text-brand-teal" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">
                    Want to Learn More About Working Together?
                  </h2>
                </div>
                <p className="text-gray-400">
                  Chat with my AI assistant to explore how we can collaborate on your project
                </p>
              </div>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <ChatInterfaceAI />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <main className="pt-14 md:pt-16 pb-12">
        {/* Compact Header */}
        <div className="px-4 md:px-8 py-1 md:py-2 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">Let's Connect</h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-300 max-w-2xl"
          >
            Schedule a consultation below
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

          {/* Geo-location and pricing info */}
          {!loadingGeo &&
            geoPricing &&
            geoPricing.location.city !== 'Unknown' &&
            geoPricing.location.country !== 'Unknown' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 space-y-2"
              >
                {/* Location indicator */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300">
                  <MapPin className="h-4 w-4 text-brand-teal" />
                  <span>
                    Detected location:{' '}
                    <span className="font-semibold text-white">
                      {geoPricing.location.city}, {geoPricing.location.country}
                    </span>
                  </span>
                </div>

                {/* Discount eligibility message */}
                {geoPricing.discountMessage && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-sm text-yellow-200 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{geoPricing.discountMessage}</span>
                  </div>
                )}
              </motion.div>
            )}
        </div>

        {/* Booking Form Section - Now First */}
        <div className="px-4 md:px-8 py-1 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto space-y-3">
            {meetingTypes.length > 1 && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-white">Available Consultations</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {meetingTypes.map((config, index) => (
                    <motion.div
                      key={config.meetingType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        rotate: selectedMeeting?.meetingType === config.meetingType ? 0 : 1,
                      }}
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
                                    {(() => {
                                      const geoPrice = getGeoPriceForMeeting(config.meetingType)
                                      if (geoPrice && geoPricing) {
                                        return (
                                          <>
                                            {geoPrice.formattedPrice}
                                            {geoPrice.geoPrice !== geoPrice.basePrice && (
                                              <span className="text-xs ml-1 text-gray-400">
                                                (base: ${geoPrice.basePrice})
                                              </span>
                                            )}
                                          </>
                                        )
                                      }
                                      return (
                                        <>
                                          {formatUSD(config.priceUSD)}
                                          <span className="text-xs ml-1">
                                            or {formatSOL(config.price)}
                                          </span>
                                        </>
                                      )
                                    })()}
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
                  <CardHeader className="pb-2 pt-3 md:pt-6">
                    <CardTitle className="text-white text-base md:text-lg">
                      Book {selectedMeeting.meetingType.split('(')[0].trim()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 pb-3 md:pb-6">
                    <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="name" className="text-white text-sm">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            required
                            placeholder="Your Full Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-white text-sm">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3">
                        <div className="grid md:grid-cols-2 gap-2 md:gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="date" className="text-white text-sm">
                              Preferred Date *
                            </Label>
                            <Input
                              id="date"
                              type="date"
                              required
                              value={formData.date}
                              min={
                                new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split('T')[0]
                              }
                              onChange={(e) => handleInputChange('date', e.target.value)}
                              className="bg-white/5 border-white/10 text-white [color-scheme:dark] cursor-pointer h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="time" className="text-white text-sm">
                              Preferred Time *
                            </Label>
                            {!formData.date ? (
                              <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-gray-400 text-xs h-9 flex items-center">
                                Please select a date first
                              </div>
                            ) : timeSlots.length === 0 ? (
                              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md px-3 py-2 text-yellow-200 text-xs flex items-center gap-2">
                                <Info className="h-3 w-3 flex-shrink-0" />
                                <span>No slots for this date</span>
                              </div>
                            ) : (
                              <Select
                                value={formData.time}
                                onValueChange={(value) => handleInputChange('time', value)}
                                required
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                                  <SelectValue placeholder="Select a time slot">
                                    {formData.time
                                      ? formatTimeDisplay(formData.time)
                                      : 'Select a time slot'}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c1c36] border-white/10 text-white max-h-[300px]">
                                  {timeSlots.map((time) => (
                                    <SelectItem
                                      key={time}
                                      value={time}
                                      className="text-white hover:bg-brand-teal/20 focus:bg-brand-teal/20"
                                    >
                                      {formatTimeDisplay(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="timezone" className="text-white text-sm">
                            Your Timezone *
                          </Label>
                          <TimezoneSelect
                            value={selectedTimezone}
                            onChange={setSelectedTimezone}
                            className="timezone-select"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 hidden md:block">
                        <Label htmlFor="notes" className="text-white text-sm">
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Tell me about your project..."
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[60px] text-sm"
                        />
                      </div>

                      {selectedMeeting.requiresPayment && (
                        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-4 space-y-4">
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-brand-teal mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-white mb-1">Payment Required</h4>
                              <p className="text-sm text-gray-300">
                                {(() => {
                                  const geoPrice = getGeoPriceForMeeting(
                                    selectedMeeting.meetingType
                                  )
                                  if (geoPrice && geoPricing) {
                                    return (
                                      <>
                                        This consultation requires a payment of{' '}
                                        <span className="font-semibold">
                                          {geoPrice.formattedPrice}
                                        </span>
                                        {geoPrice.geoPrice !== geoPrice.basePrice && (
                                          <> (base price: ${geoPrice.basePrice})</>
                                        )}{' '}
                                        or {formatSOL(selectedMeeting.price)}.
                                      </>
                                    )
                                  }
                                  return (
                                    <>
                                      This consultation requires a payment of{' '}
                                      {formatUSD(selectedMeeting.priceUSD)} or{' '}
                                      {formatSOL(selectedMeeting.price)}.
                                    </>
                                  )
                                })()}
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
                        className="w-full bg-brand-teal hover:bg-brand-teal/80 text-white h-10"
                      >
                        {isSubmitting ? (
                          'Processing...'
                        ) : (
                          <>
                            <CalendarIcon className="mr-2 h-4 w-4" />
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

        {/* Scroll Indicator - Matches hero section style */}
        <div className="px-4 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="max-w-4xl mx-auto flex justify-center"
          >
            <div className="animate-bounce">
              <button
                onClick={() => {
                  const chatSection = document.querySelector('[data-chat-section]')
                  if (chatSection) {
                    chatSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white/20 transition-colors"
              >
                <ChevronDown className="text-brand-teal" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Chat Section - Well Below the Fold */}
        <div className="px-4 md:px-8 py-16 md:py-24 max-w-7xl mx-auto" data-chat-section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <MessageSquare className="h-6 w-6 text-brand-teal" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Questions? Ask My AI Assistant</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Have questions before booking? Chat with my AI assistant for instant answers about
              services, availability, and more.
            </p>
            <ChatInterfaceAI />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
