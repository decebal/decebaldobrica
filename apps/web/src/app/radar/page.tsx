import CrateRadar from '@/components/CrateRadar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rust & AI Crate Radar',
  description:
    'A living Tech Radar of the Rust + AI ecosystem — agent SDKs, inference engines, vector/RAG crates, and dev tooling — each vetted for maintenance and adoption and placed by an Adopt / Trial / Assess / Hold verdict. Updated as new issues of the Rust Systems & Agentic AI newsletter ship.',
  openGraph: {
    title: 'Rust & AI Crate Radar',
    description:
      'A living Tech Radar of the Rust + AI ecosystem, vetted for maintenance and adoption. Adopt / Trial / Assess / Hold.',
    type: 'website',
  },
}

export default function RadarPage() {
  return (
    <div className="relative min-h-screen">
      {/* Full-bleed: the radar breaks out of `section-container` and owns the
          viewport below the fixed navbar (pt-20 ≈ navbar height). The hero sets
          its own height of calc(100svh - 5rem); the footer follows on scroll. */}
      <main className="pt-20">
        <CrateRadar />
      </main>
      <Footer />
    </div>
  )
}
