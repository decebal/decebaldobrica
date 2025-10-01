'use client'

import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import React, { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechGrowth Inc.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    quote:
      'Working with John has been an exceptional experience. His attention to detail and creative approach helped transform our brand identity. The results have exceeded our expectations.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CEO',
    company: 'Innovate Solutions',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
    quote:
      'John delivered beyond our expectations. His strategic thinking and technical expertise made our project a success. I highly recommend his services to anyone looking for quality work.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Product Manager',
    company: 'DataSphere',
    image:
      'https://images.unsplash.com/photo-1569913486515-b74bf7751574?auto=format&fit=crop&w=150&h=150',
    quote:
      'The level of professionalism and skill that John brings to the table is remarkable. He understood our vision immediately and executed it flawlessly.',
    rating: 4,
  },
]

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <section id="testimonials" className="py-20">
      <div className="section-container">
        <h2 className="section-title">Client Testimonials</h2>
        <p className="section-subtitle">
          Hear what my clients have to say about their experiences working with me.
        </p>

        <div className="relative max-w-4xl mx-auto mt-16">
          {/* Position the buttons outside the testimonial card */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-brand-teal/20 hover:bg-brand-teal/30 text-white backdrop-blur-sm p-3 rounded-full shadow-md z-10 -ml-6 md:-ml-8 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="text-white" />
          </button>

          <div className="overflow-hidden px-10">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="brand-card rounded-xl shadow-lg p-8 md:p-10 relative">
                    <div className="absolute top-6 right-6 text-brand-teal opacity-30">
                      <Quote size={64} />
                    </div>

                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-brand-teal"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                        <p className="text-gray-300">
                          {testimonial.role}, {testimonial.company}
                        </p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? 'text-brand-teal fill-brand-teal' : 'text-gray-500'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <blockquote className="text-gray-300 text-lg italic relative z-10">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-brand-teal/20 hover:bg-brand-teal/30 text-white backdrop-blur-sm p-3 rounded-full shadow-md z-10 -mr-6 md:-mr-8 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="text-white" />
          </button>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-brand-teal' : 'bg-white/20'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
