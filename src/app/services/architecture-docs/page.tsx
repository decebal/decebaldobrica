'use client'

import Footer from '@/components/Footer'
import PricingGate from '@/components/PricingGate'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight, Check, Coffee, Download, FileText, Mail } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ArchitectureDocsPage = () => {
  const packages = [
    {
      name: 'Documentation Audit',
      price: '$2,500',
      ideal: 'Review & improvement plan',
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
      ideal: 'Complete system documentation',
      popular: true,
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
    },
    {
      name: 'API Documentation',
      price: '$3,000-$8,000',
      ideal: 'Developer-ready API docs',
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

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <div className="section-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Architecture Documentation
              <br />
              <span className="text-brand-teal">That Engineers Actually Use</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Clear, maintainable system documentation that accelerates onboarding, preserves
              knowledge, and scales with your team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact?service=Architecture+Docs">
                <ShimmerButton className="px-8 py-3">
                  <FileText className="mr-2 h-5 w-5" />
                  Start Documentation Project
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
          </div>
        </div>

        <PricingGate serviceName="architecture documentation">
          <div className="section-container py-16 bg-white/5">
            <div className="max-w-6xl mx-auto">
              {/* Thanks for coffee banner */}
              <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto text-center">
                <Coffee className="h-8 w-8 text-brand-teal mx-auto mb-3" />
                <p className="text-white font-semibold mb-2">☕ Thanks for the coffee!</p>
                <p className="text-gray-300 text-sm">
                  You now have access to transparent pricing for architecture documentation
                  services. Below you'll find packages from audits to full system documentation.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Pricing & Packages
              </h2>
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
                    <div className="text-3xl font-bold text-brand-teal mb-2">{pkg.price}</div>
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

        <div className="section-container py-16">
          <div className="max-w-3xl mx-auto brand-card p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Document Your System?</h2>
            <p className="text-gray-300 mb-8">
              Let's create documentation that your team will actually use and maintain.
            </p>
            <Link href="/contact?service=Architecture+Docs+Quote">
              <ShimmerButton className="px-8 py-3">
                <Mail className="mr-2 h-5 w-5" />
                Get a Quote
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ArchitectureDocsPage
