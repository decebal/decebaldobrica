import Footer from '@/components/Footer'
import FullCaseStudiesSection from '@/components/FullCaseStudiesSection'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Rust, AI & Engineering Leadership Case Studies',
  description:
    'Production case studies covering Rust systems, agentic AI, platform architecture, and engineering leadership outcomes.',
  alternates: { canonical: '/work' },
}

const WorkPage = () => {
  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <header className="section-container pt-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            Work
          </p>
          <h1 className="max-w-4xl text-4xl font-bold text-white md:text-6xl">
            Engineering work, with constraints and outcomes
          </h1>
        </header>
        <FullCaseStudiesSection />
      </main>
      <Footer />
    </div>
  )
}

export default WorkPage
