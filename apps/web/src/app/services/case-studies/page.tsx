'use client'

import Footer from '@/components/Footer'
import PricingGate from '@/components/PricingGate'
import { Button } from '@decebal/ui/button'
import { ShimmerButton } from '@decebal/ui/shimmer-button'
import {
  ArrowRight,
  BarChart,
  Check,
  Clock,
  Coffee,
  Download,
  FileText,
  LineChart,
  Mail,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CaseStudiesPage = () => {
  const examples = [
    {
      company: 'Twilio',
      industry: 'Communications SaaS',
      revenue: '$9B+',
      metric: '10% uplift',
      detail: 'in authorization rates',
      description:
        'How Twilio achieved 10% authorization rate improvement and 1.5% revenue uplift through payment optimization.',
      tags: ['B2B SaaS', 'Payment Optimization', 'Enterprise'],
    },
    {
      company: 'LunarCrush',
      industry: 'AI Analytics',
      cost: '$25k → $5k',
      metric: '80% cost reduction',
      detail: 'in infrastructure',
      description:
        'How LunarCrush cut cloud costs by 80% while scaling AI-driven real-time analytics with edge computing.',
      tags: ['Infrastructure', 'Cost Optimization', 'AI/ML'],
    },
    {
      company: 'MotorTrend',
      industry: 'Media & Entertainment',
      scale: 'Millions of views',
      metric: '7x faster builds',
      detail: 'deployment speed',
      description:
        'How MotorTrend achieved 7x faster build times and enhanced developer productivity at scale.',
      tags: ['Performance', 'Developer Experience', 'Scale'],
    },
    {
      company: 'Freshworks',
      industry: 'Cloud Software',
      status: 'Public company',
      metric: 'Sub-millisecond',
      detail: 'response times',
      description:
        'How Freshworks scaled authentication microservices and user analytics through modern caching architecture.',
      tags: ['Architecture', 'Database', 'Microservices'],
    },
  ]

  const packages = [
    {
      name: 'Mini Case Study',
      price: '$3,000-$4,000',
      duration: '1 week turnaround',
      ideal: 'SMB & Startups',
      features: [
        '1,000-1,500 words',
        'Customer interview (1 hour)',
        'Single use case focus',
        'Performance metrics',
        '1 revision round',
        'Delivered in 1 week',
      ],
      cta: 'Order Mini Study',
      href: '/contact?service=Mini+Case+Study',
    },
    {
      name: 'Full Case Study',
      price: '$6,000-$10,000',
      duration: '2-3 week turnaround',
      ideal: 'Growth Companies',
      popular: true,
      features: [
        '2,000-3,000 word narrative',
        'Customer interview & research (2-3 hours)',
        'Technical implementation analysis',
        'Performance metrics & business impact',
        'Architecture diagrams & visualizations',
        '2 revision rounds',
        'Multiple distribution formats',
      ],
      cta: 'Order Full Study',
      href: '/contact?service=Full+Case+Study',
    },
    {
      name: 'Case Study Series',
      price: '$25,000',
      duration: '6-8 weeks',
      ideal: 'Enterprise & Series B+',
      features: [
        '5 comprehensive case studies',
        'Consistent format & branding',
        'Cross-promotion strategy',
        'Quarterly planning sessions',
        'Content calendar',
        'Volume discount pricing',
      ],
      cta: 'Order Series',
      href: '/contact?service=Case+Study+Series',
    },
  ]

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Proven Lead Generation',
      description:
        '79% of marketers rate case studies as "extremely effective". They convert 3x better than blog posts.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Build Trust & Credibility',
      description:
        'Real customer stories with metrics build trust faster than any marketing copy. Social proof that sells.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Sales Enablement',
      description:
        'Arm your sales team with concrete success stories. Shorten sales cycles by addressing objections proactively.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'SEO & Thought Leadership',
      description:
        'Rank for customer names, use cases, and technical keywords. Establish authority in your vertical.',
    },
  ]

  const process = [
    {
      step: '1',
      title: 'Customer Selection',
      description: 'Identify customers with compelling success stories and strong metrics.',
      duration: '1-2 days',
    },
    {
      step: '2',
      title: 'Research & Interviews',
      description: 'Deep-dive interviews with customer technical teams and stakeholders.',
      duration: '2-3 hours',
    },
    {
      step: '3',
      title: 'Data Analysis',
      description: 'Analyze metrics, performance data, and business impact. Create visualizations.',
      duration: '3-5 days',
    },
    {
      step: '4',
      title: 'Writing & Design',
      description: 'Craft narrative using STAR methodology. Add diagrams, quotes, and visuals.',
      duration: '1 week',
    },
    {
      step: '5',
      title: 'Review & Revision',
      description: 'Customer review, legal approval, technical accuracy check. Iterate.',
      duration: '3-5 days',
    },
    {
      step: '6',
      title: 'Delivery & Distribution',
      description: 'Final assets in multiple formats (web, PDF, social). Distribution strategy.',
      duration: '2-3 days',
    },
  ]

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="section-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-sm font-semibold">
                B2B Case Study Writing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Turn Customer Wins Into
              <br />
              <span className="text-brand-teal">Revenue-Driving Case Studies</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Technical case studies that showcase your product's impact with real metrics,
              compelling narratives, and social proof that closes deals.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link href="/contact?service=Case+Study">
                <ShimmerButton className="px-8 py-3">
                  <BarChart className="mr-2 h-5 w-5" />
                  Start Your Case Study
                </ShimmerButton>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-8 py-3 bg-transparent border-2 border-brand-teal/30 text-white hover:bg-brand-teal/10 rounded-lg transition-all duration-300 flex items-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Pricing (PDF)
              </button>
            </div>
            <p className="text-sm text-gray-400">
              88% of B2B companies use case studies • Average company has 45 case studies • 79% rate
              them "extremely effective"
            </p>
          </div>
        </div>

        {/* Example Case Studies */}
        <div className="section-container py-16 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Premium Case Study Examples
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Learn from the best. These case studies from top-tier companies command premium
              pricing ($6k-$10k) because they deliver results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {examples.map((example, idx) => (
                <div key={idx} className="brand-card p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{example.company}</h3>
                      <p className="text-sm text-gray-400">{example.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-teal">{example.metric}</div>
                      <div className="text-xs text-gray-400">{example.detail}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{example.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {example.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {example.revenue && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="text-sm text-gray-400">Company Scale: </span>
                      <span className="text-sm text-white font-semibold">
                        {example.revenue} revenue
                      </span>
                    </div>
                  )}
                  {example.cost && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="text-sm text-gray-400">Cost Impact: </span>
                      <span className="text-sm text-white font-semibold">{example.cost}/month</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="section-container py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Invest in Case Studies?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="brand-card p-8 rounded-lg">
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
        <PricingGate serviceName="case studies">
          <div className="section-container py-16 bg-white/5">
            <div className="max-w-6xl mx-auto">
              {/* Thanks for coffee banner */}
              <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto text-center">
                <Coffee className="h-8 w-8 text-brand-teal mx-auto mb-3" />
                <p className="text-white font-semibold mb-2">☕ Thanks for the coffee!</p>
                <p className="text-gray-300 text-sm">
                  You now have access to transparent pricing for case study services. Below you'll
                  find detailed packages with exact pricing, turnaround times, and what's included.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-white text-center mb-4">
                Case Study Packages
              </h2>
              <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                From quick-turn mini studies to comprehensive enterprise case studies. All include
                customer interviews, metrics analysis, and compelling narratives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
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
                    <div className="text-3xl font-bold text-brand-teal mb-1">{pkg.price}</div>
                    <div className="text-sm text-gray-400 mb-2">{pkg.duration}</div>
                    <div className="text-sm text-brand-teal mb-6">Ideal for: {pkg.ideal}</div>

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
        </PricingGate>

        {/* Process Section */}
        <div className="section-container py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              The Case Study Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {process.map((step, idx) => (
                <div key={idx} className="brand-card p-6 rounded-lg">
                  <div className="bg-brand-teal/10 border-2 border-brand-teal rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-brand-teal">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                  <div className="text-xs text-brand-teal flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {step.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STAR Methodology Section */}
        <div className="section-container py-16 bg-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              STAR Methodology Framework
            </h2>
            <div className="space-y-6">
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="bg-brand-teal text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                    S
                  </span>
                  Situation
                </h3>
                <p className="text-gray-300">
                  Set the scene. Company background, industry context, growth trajectory, and the
                  specific challenge that needed solving.
                </p>
              </div>

              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="bg-brand-teal text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                    T
                  </span>
                  Task
                </h3>
                <p className="text-gray-300">
                  Define the goal. What needed to be accomplished? Why was it critical? What were
                  the constraints and requirements?
                </p>
              </div>

              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="bg-brand-teal text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                    A
                  </span>
                  Action
                </h3>
                <p className="text-gray-300">
                  Show the solution. Technical implementation, architecture decisions, integration
                  process. The "how" with enough detail to be credible.
                </p>
              </div>

              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="bg-brand-teal text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                    R
                  </span>
                  Result
                </h3>
                <p className="text-gray-300">
                  Prove the impact. Quantifiable metrics, business outcomes, customer quotes, and
                  what's next for the customer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included Section */}
        <div className="section-container py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Customer interview & research',
                'Technical implementation analysis',
                'Performance metrics & business impact',
                'Architecture diagrams (when applicable)',
                'Customer quotes & testimonials',
                'Before/after comparisons',
                'Data visualizations & charts',
                'Multiple distribution formats (web, PDF, social)',
                'SEO optimization',
                'Legal review coordination',
                'Multiple revision rounds',
                'Distribution strategy recommendations',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-brand-teal mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="section-container py-16">
          <div className="max-w-3xl mx-auto brand-card p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Showcase Your Success Stories?
            </h2>
            <p className="text-gray-300 mb-8">
              Let's turn your customer wins into compelling case studies that drive leads, shorten
              sales cycles, and build credibility.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link href="/contact?service=Case+Study+Quote">
                <ShimmerButton className="px-8 py-3">
                  <Mail className="mr-2 h-5 w-5" />
                  Get a Quote
                </ShimmerButton>
              </Link>
              <Link href="/contact?service=Case+Study&deposit=true">
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-brand-teal text-brand-teal hover:bg-brand-teal/10"
                >
                  Pay Deposit & Start
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Average turnaround: 2-3 weeks for full case studies
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
                  How do you find customers to interview?
                </h3>
                <p className="text-gray-300">
                  You identify happy customers with strong results. I handle the outreach,
                  interviews, and follow-ups. I'll work with your customer success team to find the
                  best candidates.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  What if we don't have metrics?
                </h3>
                <p className="text-gray-300">
                  I help you find them. Through customer interviews and your internal data, we can
                  uncover performance improvements, time savings, cost reductions, or other
                  quantifiable impacts.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  Can you handle technical depth?
                </h3>
                <p className="text-gray-300">
                  Yes. With 15+ years of engineering experience (Rust, TypeScript, PostgreSQL,
                  blockchain), I can write about complex architectures, performance optimizations,
                  and technical implementations with credibility.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">What formats do you deliver?</h3>
                <p className="text-gray-300">
                  Web-ready HTML/markdown, PDF for sales enablement, LinkedIn/Twitter threads for
                  social, and optional blog post format. You own all rights to repurpose however you
                  need.
                </p>
              </div>
              <div className="brand-card p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">Do you do video case studies?</h3>
                <p className="text-gray-300">
                  Written case studies are my specialty. However, I can provide scripts and
                  interview questions if you want to produce video content in parallel.
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

export default CaseStudiesPage
