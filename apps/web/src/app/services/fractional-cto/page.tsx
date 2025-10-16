'use client'

import Footer from '@/components/Footer'
import PricingGate from '@/components/PricingGate'
import { Button } from '@decebal/ui/button'
import { ShimmerButton } from '@decebal/ui/shimmer-button'
import {
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  Coffee,
  Download,
  Mail,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FractionalCTOPage = () => {
  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Accelerate Velocity',
      description:
        'Ship faster with strategic technical leadership. Make decisions in hours, not weeks.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Reduce Risk',
      description:
        'Avoid costly technical debt and architecture mistakes. Build it right the first time.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Scale Your Team',
      description:
        'Hire better engineers faster. Implement processes that maintain velocity as you grow.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'No Full-Time Commitment',
      description:
        'Get executive-level expertise without $250k+ salary, equity, or long-term lock-in.',
    },
  ]

  const packages = [
    {
      name: 'Startup Advisory',
      price: '$12,000/month',
      commitment: '15 hours/month',
      ideal: 'Seed to Series A startups',
      features: [
        'Technology strategy & roadmap development',
        'Architecture reviews & technical guidance',
        'Hiring strategy & candidate evaluation',
        'Bi-weekly 1:1 strategy sessions',
        'Async Slack/email support',
        'Quarterly OKR planning',
      ],
      cta: 'Start Advisory',
      href: '/contact?service=Startup+Advisory',
    },
    {
      name: 'Technical Leadership',
      price: '$18,000/month',
      commitment: '25 hours/month',
      ideal: 'Series A-B growth companies',
      popular: true,
      features: [
        'Everything in Startup Advisory',
        'Hands-on architecture design & code reviews',
        'Sprint planning & technical oversight',
        'Engineering culture & process development',
        'Weekly team meetings & standup participation',
        'On-call for technical escalations',
        'Board deck preparation & investor updates',
      ],
      cta: 'Start Leadership',
      href: '/contact?service=Technical+Leadership',
    },
    {
      name: 'Project-Based',
      price: 'From $20,000',
      commitment: 'Custom scope',
      ideal: 'Specific initiatives or due diligence',
      features: [
        'Technology stack evaluation & selection',
        'Complete system architecture design',
        'Technical due diligence for investors/acquirers',
        'Engineering team assessment & hiring plan',
        'Cloud migration strategy & execution',
        'Custom deliverables based on your needs',
      ],
      cta: 'Discuss Project',
      href: '/contact?service=Project+Based+CTO',
    },
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Discovery Call',
      description: 'Free 15-minute call to understand your challenges and goals.',
      duration: '15 min',
    },
    {
      step: '2',
      title: 'Technical Assessment',
      description: 'Review your tech stack, team, and roadmap. Identify quick wins.',
      duration: '1-2 hours',
    },
    {
      step: '3',
      title: 'Proposal & Onboarding',
      description: 'Custom engagement plan with clear deliverables and timeline.',
      duration: '2-3 days',
    },
    {
      step: '4',
      title: 'Start Making Impact',
      description: 'Begin strategic work immediately. First deliverables within week 1.',
      duration: 'Week 1',
    },
  ]

  const results = [
    { metric: '30%', label: 'Average performance improvement' },
    { metric: '300%', label: 'Developer productivity increase' },
    { metric: '75%', label: 'Infrastructure cost reduction' },
    { metric: '6-12', label: 'Typical engagement (months)' },
  ]

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="section-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-sm font-semibold">
                Fractional CTO Services
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Strategic Technical Leadership
              <br />
              <span className="text-brand-teal">Without the Full-Time Cost</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Get executive-level technical expertise for your VC-backed startup. Ship faster, scale
              smarter, and avoid costly mistakes—starting at $12k/month.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link href="/contact?service=Fractional+CTO">
                <ShimmerButton className="px-8 py-3">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Schedule Discovery Call
                </ShimmerButton>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-8 py-3 bg-transparent border-2 border-brand-teal/30 text-white hover:bg-brand-teal/10 rounded-lg transition-all duration-300 flex items-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Service Guide (PDF)
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Trusted by seed to Series B startups • No long-term contracts • Start in days, not
              weeks
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="section-container py-16 bg-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Proven Track Record</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {results.map((result) => (
                <div key={result.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-brand-teal mb-2">
                    {result.metric}
                  </div>
                  <div className="text-gray-300">{result.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="section-container py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Fractional CTO?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="brand-card p-8 rounded-lg">
                  <div className="bg-brand-teal/10 rounded-lg p-4 inline-block mb-4 text-brand-teal">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <PricingGate serviceName="fractional CTO services">
          <div className="section-container py-16 bg-white/5">
            <div className="max-w-6xl mx-auto">
              {/* Thanks for coffee banner */}
              <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto text-center">
                <Coffee className="h-8 w-8 text-brand-teal mx-auto mb-3" />
                <p className="text-white font-semibold mb-2">☕ Thanks for the coffee!</p>
                <p className="text-gray-300 text-sm">
                  You now have access to transparent pricing for fractional CTO services. Below
                  you'll find detailed engagement packages with exact monthly rates and time
                  commitments.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-white text-center mb-4">
                Choose Your Engagement
              </h2>
              <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                Flexible packages designed for different stages and needs. All include immediate
                start, no long-term contracts, and month-to-month flexibility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`brand-card p-8 rounded-lg relative ${
                      pkg.popular ? 'ring-2 ring-brand-teal' : ''
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-brand-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-brand-teal mb-1">{pkg.price}</div>
                    <div className="text-sm text-gray-400 mb-2">{pkg.commitment}</div>
                    <div className="text-sm text-brand-teal mb-6">Ideal for: {pkg.ideal}</div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-brand-teal mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={pkg.href}>
                      <Button
                        className={`w-full ${
                          pkg.popular
                            ? 'bg-brand-teal hover:bg-brand-teal/90 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {pkg.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PricingGate>

        {/* Process Section */}
        <div className="section-container py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="bg-brand-teal/10 border-2 border-brand-teal rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-teal">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                  <div className="text-xs text-brand-teal flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {step.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What You Get Section */}
        <div className="section-container py-16 bg-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">What You Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Technology strategy aligned with business goals',
                'Architecture decisions that scale',
                'Hiring & team building guidance',
                'Engineering culture & best practices',
                'Vendor & tool evaluation',
                'Technical roadmap development',
                'Code review & quality assurance',
                'Cost optimization strategies',
                'Security & compliance guidance',
                'Investor & board communication',
                'Crisis management & technical escalation',
                'Knowledge transfer & documentation',
              ].map((item) => (
                <div key={item} className="flex items-start">
                  <Check className="h-5 w-5 text-brand-teal mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ideal For Section */}
        <div className="section-container py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Who This Is For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="brand-card p-6 rounded-lg">
                <Target className="h-8 w-8 text-brand-teal mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Early-Stage Founders</h3>
                <p className="text-gray-300 mb-4">
                  Non-technical founders who need strategic technical guidance to build the right
                  product and hire the right team.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Seed to Series A</li>
                  <li>• 0-10 engineers</li>
                  <li>• Building MVP or scaling</li>
                </ul>
              </div>

              <div className="brand-card p-6 rounded-lg">
                <Rocket className="h-8 w-8 text-brand-teal mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Growing Startups</h3>
                <p className="text-gray-300 mb-4">
                  Companies scaling fast who need senior technical leadership but aren't ready for a
                  full-time CTO.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Series A-B</li>
                  <li>• 10-50 engineers</li>
                  <li>• Rapid growth phase</li>
                </ul>
              </div>

              <div className="brand-card p-6 rounded-lg">
                <Users className="h-8 w-8 text-brand-teal mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">VC Firms</h3>
                <p className="text-gray-300 mb-4">
                  Providing technical leadership across portfolio companies to accelerate velocity
                  and reduce risk.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Portfolio support</li>
                  <li>• Technical due diligence</li>
                  <li>• Value creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="section-container py-16">
          <div className="max-w-3xl mx-auto brand-card p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Accelerate Your Startup?
            </h2>
            <p className="text-gray-300 mb-8">
              Schedule a free 15-minute discovery call to discuss your technical challenges and
              goals. No pressure, just an honest conversation about how I can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link href="/contact?service=Fractional+CTO+Discovery">
                <ShimmerButton className="px-8 py-3">
                  <Mail className="mr-2 h-5 w-5" />
                  Schedule Discovery Call
                </ShimmerButton>
              </Link>
              <Link href="/contact?service=Fractional+CTO&deposit=true">
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-brand-teal text-brand-teal hover:bg-brand-teal/10"
                >
                  Pay Deposit & Skip Queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Deposits are fully refundable if we decide not to work together
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="section-container py-16 bg-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Common Questions</h2>
            <div className="space-y-6">
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  How is this different from hiring a full-time CTO?
                </h3>
                <p className="text-gray-300">
                  You get senior-level expertise immediately without $250k+ salary, equity dilution,
                  or recruitment time. Perfect for startups that need strategic guidance but aren't
                  ready for a full-time executive.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  Can you work with our existing team?
                </h3>
                <p className="text-gray-300">
                  Absolutely. I integrate with your existing engineering team, providing leadership,
                  guidance, and support without replacing anyone. I make your team more effective.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  What if we need more or fewer hours?
                </h3>
                <p className="text-gray-300">
                  Packages are flexible. We can adjust hours month-to-month based on your needs. No
                  long-term contracts or commitments required.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">Do you write code?</h3>
                <p className="text-gray-300">
                  Yes, when needed. I do architecture design, code reviews, and critical path
                  implementation. However, my primary focus is strategic leadership—making your team
                  10x more effective, not replacing them.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  What technologies do you specialize in?
                </h3>
                <p className="text-gray-300">
                  Rust, TypeScript/Node.js, React/Next.js, PostgreSQL, blockchain (Solana,
                  Ethereum), serverless architectures, and cloud infrastructure (AWS, Vercel). But
                  strategic leadership transcends specific technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FractionalCTOPage
