'use client'

import Footer from '@/components/Footer'
import EthereumIcon from '@/components/icons/EthereumIcon'
import SolanaIcon from '@/components/icons/SolanaIcon'
import ServicePaymentGate from '@/components/payments/ServicePaymentGate'
import { Button } from '@decebal/ui/button'
import { ShimmerButton } from '@decebal/ui/shimmer-button'
import {
  ArrowRight,
  BarChart,
  Bitcoin,
  Briefcase,
  Check,
  FileText,
  PenTool,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

interface ServicePackage {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
}

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<string>('fractional-cto')

  const fractionalCTOPackages: ServicePackage[] = [
    {
      name: 'Startup Advisory',
      price: '$12,000/month',
      description: '15 hours/month technical leadership',
      features: [
        'Technology strategy & roadmap',
        'Architecture reviews & guidance',
        'Hiring & team building support',
        'Bi-weekly 1:1 sessions',
        'Slack/email support',
      ],
      cta: 'Start Advisory',
      href: '/contact?service=Startup+Advisory',
    },
    {
      name: 'Technical Leadership',
      price: '$18,000/month',
      description: '25 hours/month hands-on engagement',
      features: [
        'Everything in Startup Advisory',
        'Hands-on architecture & code reviews',
        'Sprint planning & technical oversight',
        'Engineering culture development',
        'Weekly team meetings',
        'On-call technical escalation',
      ],
      cta: 'Start Leadership',
      href: '/contact?service=Technical+Leadership',
      popular: true,
    },
    {
      name: 'Project-Based',
      price: 'From $20,000',
      description: 'Custom scope engagements',
      features: [
        'Technology stack selection',
        'System architecture design',
        'Technical due diligence',
        'Engineering team assessment',
        'Migration planning',
        'Custom deliverables',
      ],
      cta: 'Discuss Project',
      href: '/contact?service=Project+Based',
    },
  ]

  const technicalWritingPackages: ServicePackage[] = [
    {
      name: 'Single Article',
      price: '$750-$1,500',
      description: 'One-time technical content',
      features: [
        '1,000-2,000 word article',
        'Code examples & diagrams',
        'SEO optimization',
        '1 revision round',
        'Published within 1 week',
      ],
      cta: 'Order Article',
      href: '/contact?service=Technical+Article',
    },
    {
      name: 'Content Retainer',
      price: '$4,000/month',
      description: '4 articles per month',
      features: [
        'Everything in Single Article',
        'Content strategy consultation',
        'SEO keyword research',
        'Publishing support',
        'Analytics reporting',
        'Priority scheduling',
      ],
      cta: 'Start Retainer',
      href: '/contact?service=Content+Retainer',
      popular: true,
    },
    {
      name: 'Tutorial & Guides',
      price: '$2,500-$5,000',
      description: 'In-depth technical guides',
      features: [
        '3,000+ word comprehensive guide',
        'Working code repositories',
        'Step-by-step implementation',
        'Screenshots & diagrams',
        'Multiple revision rounds',
      ],
      cta: 'Order Guide',
      href: '/contact?service=Technical+Guide',
    },
  ]

  const caseStudyPackages: ServicePackage[] = [
    {
      name: 'Mini Case Study',
      price: '$3,000-$4,000',
      description: 'Quick-turn case study',
      features: [
        '1,000-1,500 words',
        'Customer interview (1 hour)',
        'Single use case focus',
        '1 revision round',
        'Delivered in 1 week',
      ],
      cta: 'Order Mini',
      href: '/contact?service=Mini+Case+Study',
    },
    {
      name: 'Full Case Study',
      price: '$6,000-$10,000',
      description: 'Comprehensive customer success story',
      features: [
        '2,000-3,000 word narrative',
        'Customer interview & research (2-3 hours)',
        'Technical implementation analysis',
        'Performance metrics & business impact',
        'Diagrams & data visualizations',
        '2 revision rounds',
        'Delivered in 2-3 weeks',
      ],
      cta: 'Order Full Study',
      href: '/contact?service=Full+Case+Study',
      popular: true,
    },
    {
      name: 'Case Study Series',
      price: '$25,000',
      description: '5 case studies with volume discount',
      features: [
        'Everything in Full Case Study',
        'Consistent format & branding',
        'Cross-promotion strategy',
        'Quarterly planning sessions',
        'Delivered over 6-8 weeks',
      ],
      cta: 'Order Series',
      href: '/contact?service=Case+Study+Series',
    },
  ]

  const architecturePackages: ServicePackage[] = [
    {
      name: 'Documentation Audit',
      price: '$2,500',
      description: 'Review & improvement plan',
      features: [
        'Review existing documentation',
        'Identify gaps & outdated content',
        'Prioritized improvement plan',
        'Style guide recommendations',
        'Sample updates',
      ],
      cta: 'Start Audit',
      href: '/contact?service=Documentation+Audit',
    },
    {
      name: 'Full Documentation',
      price: '$5,000-$15,000',
      description: 'Complete system documentation',
      features: [
        'Stakeholder interviews',
        'Codebase analysis',
        'Architecture diagrams (C4 model)',
        'Technology stack documentation',
        'Decision records (ADRs)',
        'Data flow & deployment diagrams',
        'Delivered as markdown/wiki',
      ],
      cta: 'Order Docs',
      href: '/contact?service=Architecture+Documentation',
      popular: true,
    },
    {
      name: 'API Documentation',
      price: '$3,000-$8,000',
      description: 'Developer-ready API docs',
      features: [
        'Endpoint documentation',
        'Request/response examples',
        'Authentication flows',
        'Error handling guide',
        'Code samples (multiple languages)',
        'OpenAPI/Swagger spec',
        'Postman collection',
      ],
      cta: 'Order API Docs',
      href: '/contact?service=API+Documentation',
    },
  ]

  const getPackages = (): ServicePackage[] => {
    switch (selectedService) {
      case 'fractional-cto':
        return fractionalCTOPackages
      case 'technical-writing':
        return technicalWritingPackages
      case 'case-studies':
        return caseStudyPackages
      case 'architecture':
        return architecturePackages
      default:
        return fractionalCTOPackages
    }
  }

  const serviceCategories = [
    {
      id: 'fractional-cto',
      icon: <Briefcase className="h-5 w-5" />,
      name: 'Fractional CTO',
      description: 'Strategic technical leadership',
    },
    {
      id: 'technical-writing',
      icon: <PenTool className="h-5 w-5" />,
      name: 'Technical Writing',
      description: 'Developer content & tutorials',
    },
    {
      id: 'case-studies',
      icon: <BarChart className="h-5 w-5" />,
      name: 'Case Studies',
      description: 'B2B success stories',
    },
    {
      id: 'architecture',
      icon: <FileText className="h-5 w-5" />,
      name: 'Architecture Docs',
      description: 'System documentation',
    },
  ]

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="section-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-fade-in">
              Services & Pricing
            </h1>
            <p
              className="text-xl text-gray-300 mb-8 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              From fractional CTO services to technical content creation—transparent pricing for
              high-impact technical expertise.
            </p>

            {/* Payment Methods */}
            <div className="animate-fade-in mb-12" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-gray-400 mb-4">Multiple payment options available:</p>
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 p-3 rounded-full mb-2">
                    <Bitcoin className="h-6 w-6 text-brand-teal" />
                  </div>
                  <span className="text-sm text-white">Bitcoin</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 p-3 rounded-full mb-2">
                    <EthereumIcon className="h-6 w-6 text-brand-teal" />
                  </div>
                  <span className="text-sm text-white">Ethereum</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 p-3 rounded-full mb-2">
                    <SolanaIcon className="h-6 w-6 text-brand-teal" />
                  </div>
                  <span className="text-sm text-white">Solana</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Category Selector */}
        <div className="section-container mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {serviceCategories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setSelectedService(category.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                    selectedService === category.id
                      ? 'border-brand-teal bg-brand-teal/10'
                      : 'border-white/10 bg-white/5 hover:border-brand-teal/50'
                  }`}
                >
                  <div
                    className={`mb-3 ${selectedService === category.id ? 'text-brand-teal' : 'text-gray-400'}`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Packages */}
        {process.env.NEXT_PUBLIC_ENABLE_WALLET_PAYMENTS === 'true' && (
          <ServicePaymentGate serviceSlug="all-pricing">
            <div className="section-container">
              <div className="max-w-6xl mx-auto">
                <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto text-center">
                  <Check className="h-8 w-8 text-brand-teal mx-auto mb-3" />
                  <p className="text-white font-semibold mb-2">🎉 Access Granted!</p>
                  <p className="text-gray-300 text-sm">
                    You now have lifetime access to transparent pricing for all my services.
                    Bookmark this page for future reference.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {getPackages().map((pkg, index) => (
                    <div
                      key={index}
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
                      <div className="text-3xl font-bold text-brand-teal mb-2">{pkg.price}</div>
                      <p className="text-gray-400 mb-6">{pkg.description}</p>

                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
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
          </ServicePaymentGate>
        )}

        {/* Why Work With Me Section */}
        <div className="section-container mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Work With Me?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Technical Depth</h3>
                <p className="text-gray-300">
                  15+ years building production systems with Rust, TypeScript, PostgreSQL, and
                  blockchain. I write about what I've actually built and optimized.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Proven Results</h3>
                <p className="text-gray-300">
                  Track record of 30%+ performance improvements, 300% productivity increases, and
                  75% infrastructure cost reductions.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Engineer Who Writes</h3>
                <p className="text-gray-300">
                  Rare combination of deep technical expertise and clear communication. I can build
                  it, optimize it, and explain it.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Startup Experience</h3>
                <p className="text-gray-300">
                  Led engineering at VC-backed startups. I understand fundraising cycles, burn
                  rates, and the pressure to ship.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Show Interest CTA */}
        <div className="section-container mt-24">
          <div className="max-w-3xl mx-auto brand-card p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8">
              Schedule a free 15-minute discovery call to discuss your needs
              {process.env.NEXT_PUBLIC_ENABLE_WALLET_PAYMENTS === 'true' &&
                ', or pay a refundable deposit to show serious interest and skip the queue'}
              .
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact?service=Discovery+Call">
                <ShimmerButton className="px-8 py-3">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Free Discovery Call
                </ShimmerButton>
              </Link>
              {process.env.NEXT_PUBLIC_ENABLE_WALLET_PAYMENTS === 'true' && (
                <Link href="/contact?service=Show+Interest&deposit=true">
                  <Button
                    size="lg"
                    className="bg-transparent border-2 border-brand-teal text-brand-teal hover:bg-brand-teal/10"
                  >
                    Pay Deposit & Skip Queue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            {process.env.NEXT_PUBLIC_ENABLE_WALLET_PAYMENTS === 'true' && (
              <p className="text-sm text-gray-400 mt-6">
                Deposits are fully refundable if we decide not to work together. They show serious
                interest and get you priority scheduling.
              </p>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="section-container mt-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  Do you work with early-stage startups?
                </h3>
                <p className="text-gray-300">
                  Yes. I specialize in seed to Series B companies. If you're pre-seed with limited
                  budget, I offer project-based engagements and technical writing that fits your
                  constraints.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  What's the typical engagement length?
                </h3>
                <p className="text-gray-300">
                  Fractional CTO retainers are typically 6-12 months with month-to-month renewal.
                  Technical writing and case studies are project-based (1-4 weeks). Architecture
                  documentation is usually 2-6 weeks.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  Can you work with our timezone?
                </h3>
                <p className="text-gray-300">
                  I'm based in London (GMT/BST) but regularly work with US and Asian teams. For
                  retainer clients, I accommodate meeting times across timezones.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  What if we need something custom?
                </h3>
                <p className="text-gray-300">
                  These packages are starting points. I create custom scopes for unique needs. Book
                  a discovery call to discuss your specific requirements.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">Do you accept equity?</h3>
                <p className="text-gray-300">
                  For the right opportunity, yes. I'm selective about equity arrangements and they
                  typically supplement (not replace) cash compensation. Let's discuss during
                  discovery.
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

export default ServicesPage
