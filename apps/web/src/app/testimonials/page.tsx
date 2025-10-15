import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import TestimonialSection from '@/components/TestimonialSection'
import React from 'react'

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
