import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import TestimonialSection from '@/components/TestimonialSection'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Engineering Leadership Testimonials',
  description:
    'Recommendations from product and engineering leaders who worked directly with Decebal Dobrica.',
  alternates: { canonical: '/testimonials' },
}

const galleryImages = [
  {
    src: '/images/gallery/ethglobal-certificate.jpg',
    alt: 'ETHGlobal Certificate',
    caption: 'ETHGlobal Achievement',
  },
  {
    src: '/images/gallery/hackerrank-certificate.jpg',
    alt: 'HackerRank Certificate',
    caption: 'HackerRank Certification',
  },
  {
    src: '/images/gallery/img-01.jpg',
    alt: 'Passions',
    caption: 'Passions',
  },
  {
    src: '/images/gallery/img-02.jpg',
    alt: 'Passions',
    caption: 'Passions',
  },
  {
    src: '/images/gallery/img-03.jpg',
    alt: 'Technical workshop',
    caption: 'Technical workshop',
  },
  {
    src: '/images/gallery/img-04.jpg',
    alt: 'Passions',
    caption: 'Passions',
  },
  {
    src: '/images/gallery/img-05.jpg',
    alt: 'Passions',
    caption: 'Passions',
  },
  {
    src: '/images/gallery/img-06.jpg',
    alt: 'Passions',
    caption: 'Passions',
  },
  {
    src: '/images/gallery/img-07.jpg',
    alt: 'Tech meetup',
    caption: 'Tech meetup',
  },
  {
    src: '/images/gallery/img-08.jpg',
    alt: 'Personal motivation',
    caption: 'Personal motivation',
  },
  {
    src: '/images/gallery/img-09.jpg',
    alt: 'Past teams - peacock.io',
    caption: 'Past teams - peacock.io',
  },
  {
    src: '/images/gallery/img-10.jpg',
    alt: 'Key Practices',
    caption: 'Key Practices',
  },
  {
    src: '/images/gallery/img-11.webp',
    alt: 'Key Practices',
    caption: 'Key Practices',
  },
]

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <header className="section-container pt-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            References
          </p>
          <h1 className="max-w-4xl text-4xl font-bold text-white md:text-6xl">
            What engineering and product leaders say
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-200">
            Direct recommendations from people who managed or shipped alongside me.
          </p>
        </header>
        <TestimonialSection />

        {/* Gallery Section */}
        <section className="py-20">
          <div className="section-container">
            <h2 className="section-title">Gallery</h2>
            <p className="section-subtitle">
              Moments from conferences, workshops, and professional events
            </p>
            <div className="mt-12">
              <Gallery images={galleryImages} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default TestimonialsPage
