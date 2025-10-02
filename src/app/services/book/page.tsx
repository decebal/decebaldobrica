'use client'

import { bookMeeting } from '@/actions/meeting-action'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import {
  MEETING_TYPES_WITH_PRICING,
  formatSOL,
  formatUSDEquivalent,
  type MeetingPaymentConfig,
} from '@/lib/meetingPayments'
import { Calendar, Clock, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BookServicePage() {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPaymentConfig | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  })

  const meetingTypes = Object.values(MEETING_TYPES_WITH_PRICING)

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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        paymentId,
      })

      if (result.success) {
        setBookingSuccess(true)
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

  if (bookingSuccess) {
    return (
      <div className="min-h-screen relative">
        <main className="pt-24 pb-16">
          <div className="section-container py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="bg-green-500/20 p-6 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">Booking Confirmed!</h1>
              <p className="text-xl text-gray-300 mb-8">
                Your meeting has been successfully scheduled. You'll receive a calendar invitation
                and confirmation email shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/services">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                  </Button>
                </Link>
                <Link href="/">
                  <Button>Go to Home</Button>
                </Link>
              </div>
            </div>
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
          <Link
            href="/services"
            className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Book a Consultation</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Choose the consultation type that best fits your needs and schedule a time to connect.
          </p>
        </div>

        {/* Meeting Types */}
        <div className="section-container py-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Select Meeting Type</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {meetingTypes.map((config) => (
              <Card
                key={config.meetingType}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedMeeting?.meetingType === config.meetingType
                    ? 'border-brand-teal shadow-lg shadow-brand-teal/20'
                    : 'border-white/10'
                } bg-white/5 backdrop-blur-sm`}
                onClick={() => handleSelectMeeting(config.meetingType)}
              >
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    {config.meetingType.split('(')[0].trim()}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{config.duration} minutes</span>
                    </div>
                    {config.requiresPayment ? (
                      <div className="flex items-center gap-2 text-brand-teal font-semibold">
                        <CreditCard className="h-4 w-4" />
                        <span>
                          {formatSOL(config.price)}
                          <span className="text-xs ml-1">
                            {formatUSDEquivalent(config.price)}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-green-500 font-semibold">Free</div>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        {selectedMeeting && (
          <div className="section-container py-8">
            <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
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
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
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
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
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
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px]"
                    />
                  </div>

                  {selectedMeeting.requiresPayment && (
                    <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-brand-teal mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white mb-1">Payment Required</h4>
                          <p className="text-sm text-gray-300">
                            This consultation requires a payment of {formatSOL(selectedMeeting.price)}{' '}
                            ({formatUSDEquivalent(selectedMeeting.price)}). You'll be redirected to
                            complete the payment after booking.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
