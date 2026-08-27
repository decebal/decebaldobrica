// src/app/page.tsx
// Homepage with all sections

import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import TestimonialSection from '@/components/TestimonialSection'
import WorkSection from '@/components/WorkSection'
import { config } from '@/lib/personalConfig'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rust Systems & Agentic AI Engineer',
  description: config.metaDescription,
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ServicesSection />
      <TestimonialSection />
      <Footer />
    </div>
  )
}
