'use client'

import { ChevronDown, ChevronLeft, ChevronRight, Linkedin, Quote } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Highlight } from './ui/Highlight'

interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  avatar?: string
  relationship: string
  description: React.ReactNode
  linkedinUrl?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Brad Stephens',
    role: 'Co-founder and Head of Product',
    company: 'Breakout Clips',
    avatar: '/images/proofs/brad.svg',
    relationship: 'September 08, 2024, Brad managed Decebal directly',
    description: (
      <p>
        Working with Decebal has been a truly rewarding experience. He is one of the most{' '}
        <Highlight>dependable and reliable</Highlight> people I've had the pleasure of collaborating
        with, always delivering exceptional work, no matter how complex the challenge. His technical
        expertise is impressive, and his ability to navigate and solve problems quickly is a
        testament to his skill. What really sets Decebal apart, though, is how he{' '}
        <Highlight>consistently goes above and beyond for the team</Highlight>. He's not just
        focused on getting the job done - he deeply cares about the success of the company and the
        people he works with, always offering support and guidance to ensure we're{' '}
        <Highlight>all growing together.</Highlight> I feel fortunate to have worked with such a
        <Highlight>dedicated and thoughtful leader.</Highlight>
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
  {
    id: 2,
    name: 'Jon Heaton',
    role: 'SVP Engineering',
    company: 'Ebury',
    relationship: 'September 29, 2025, Jon managed Decebal directly',
    description: (
      <p>
        Dez works hard and strives to ensure engineers have the right tools, systems and processes
        in place to do their jobs well. He's a{' '}
        <Highlight>dedicated and hard working leader</Highlight> who cares a lot about the work and
        the team.
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
  {
    id: 3,
    name: 'Kevin Wallace',
    role: 'Data Deepdiver, Company Builder, Multi-Exit Founder',
    relationship: 'September 26, 2025, Kevin managed Decebal directly',
    description: (
      <p>
        I had the privilege of working with Decebal in a part-time capacity and his impact was
        immediate. He combined{' '}
        <Highlight>
          strong technical skill with clear communication and thoughtful problem-solving
        </Highlight>{' '}
        that led to better developer partnership relations. His methodical approach was very
        appealing to my operational background and he consistently met deadlines assigned without
        complaint.
        <br />
        <br />
        What impressed me most was how he delivered{' '}
        <Highlight>consistent, high-quality work despite a limited schedule</Highlight>. He managed
        time well, set clear expectations, and contributed at the level of a full-time teammate.
        Beyond the code, Decebal brought <Highlight>humility and professionalism</Highlight>{' '}
        (something very rare in tech/blockchain) listening first, giving thoughtful feedback, and
        raising the standard of collaboration across the team.
        <br />
        <br />
        Simply put? He made difficult tasks manageable and elevated the people around them. I would
        gladly work with Decebal again and highly recommend them for any team.
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
  {
    id: 4,
    name: 'Ian Watt',
    role: 'Co-founder and Head of Product',
    company: 'Tellimer',
    avatar: '/images/proofs/ian.svg',
    relationship: 'December 16, 2022, Ian managed Decebal directly',
    description: (
      <p>
        Dez excels at mapping out a birds-eye view of a technical solution and then{' '}
        <Highlight>working with individual team members to flesh out that solution</Highlight>. With
        his simultaneous interests in best practices and cutting-edge technology, Dez always
        encouraged us to look for the best tool for each job. Accordingly, I'm confident Decebal
        will excel at any firm looking to bring{' '}
        <Highlight>experience, technical confidence, and stability</Highlight> to its engineering
        team.
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
  {
    id: 5,
    name: 'Daniel Vliegenthart',
    role: 'Senior Data Engineer',
    company: 'Tellimer',
    avatar: '/images/proofs/daniel.svg',
    relationship: 'April 3, 2023, Daniel worked with Decebal on the same team',
    description: (
      <p>
        Decebal excels at architecting software solutions with{' '}
        <Highlight>state-of-the-art technology and frameworks</Highlight>. I have benefitted greatly
        from working with him on projects, and have learnt a lot from his extensive technical
        knowledge.
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
  {
    id: 6,
    name: 'Selçuk Cihan',
    role: 'Software Development Engineer',
    company: 'Tellimer',
    avatar: '/images/proofs/selcuk.svg',
    relationship: 'December 13, 2022, Selcuk reported directly to Decebal',
    description: (
      <p>
        As a full-stack software engineer, Decebal brings a wealth of knowledge and experience in
        modern web development. He is a versatile and adaptable developer who is able to{' '}
        <Highlight>quickly learn and apply new technologies</Highlight> to solve complex problems.
        In addition, he is always{' '}
        <Highlight>eager to share his knowledge and help his colleagues grow</Highlight> in their
        roles. As a manager, Decebal is dedicated to fostering{' '}
        <Highlight>a positive and collaborative work environment</Highlight>
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
  {
    id: 7,
    name: 'Florin Georgescu',
    role: 'QA Test Engineer',
    company: 'eMag',
    avatar: '/images/proofs/florin.svg',
    relationship: 'February 22, 2019, Florin worked with Decebal on the same team',
    description: (
      <p>
        I have known Decebal Dobrica for almost 2 years in my capacity as a QA Tester at eMAG. He
        worked with me on various projects as a Full Stack Programmer and based on his work, I would{' '}
        <Highlight>rank him as one of the best developers we have ever had</Highlight>.
      </p>
    ),
    linkedinUrl: 'https://www.linkedin.com/in/decebaldobrica/details/recommendations/',
  },
]

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [needsExpand, setNeedsExpand] = useState<Set<number>>(new Set())
  const contentRefs = useRef<Map<number, HTMLElement>>(new Map())

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const isExpanded = (id: number) => expandedIds.has(id)

  useEffect(() => {
    const newNeedsExpand = new Set<number>()
    contentRefs.current.forEach((element, id) => {
      if (element && element.scrollHeight > element.clientHeight) {
        newNeedsExpand.add(id)
      }
    })
    setNeedsExpand(newNeedsExpand)
  }, [])

  return (
    <section id="testimonials" className="py-20">
      <div className="section-container">
        <h2 className="section-title">What Others Say About Me</h2>
        <p className="section-subtitle">
          Real feedback from leaders, colleagues, and managers I've worked with.
        </p>

        <div className="relative max-w-4xl mx-auto mt-16">
          {/* Navigation Buttons */}
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
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-10 relative">
                    <div className="absolute top-6 right-6 text-brand-teal opacity-20">
                      <Quote size={64} />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex gap-4 flex-1">
                        {testimonial.avatar && (
                          <div className="shrink-0">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-brand-teal/30"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-1">{testimonial.name}</h3>
                          <p className="text-gray-100 font-medium">
                            {testimonial.role}
                            {testimonial.company && <>, {testimonial.company}</>}
                          </p>
                          <p className="text-gray-300 text-sm mt-2">{testimonial.relationship}</p>
                        </div>
                      </div>

                      {/* LinkedIn Badge */}
                      {testimonial.linkedinUrl && (
                        <a
                          href={testimonial.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          title="View on LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="hidden sm:inline">LinkedIn</span>
                        </a>
                      )}
                    </div>

                    {/* Testimonial Content */}
                    <div className="relative">
                      <blockquote
                        ref={(el) => {
                          if (el) contentRefs.current.set(testimonial.id, el)
                        }}
                        className={`text-gray-100 text-lg leading-relaxed relative z-10 ${
                          isExpanded(testimonial.id) ? '' : 'line-clamp-4'
                        }`}
                      >
                        {testimonial.description}
                      </blockquote>

                      {/* Expand/Collapse Button - Only show if content is clamped */}
                      {needsExpand.has(testimonial.id) && (
                        <button
                          onClick={() => toggleExpand(testimonial.id)}
                          className="mt-3 inline-flex items-center gap-1 text-brand-teal hover:text-brand-teal/80 text-sm font-medium transition-colors"
                        >
                          {isExpanded(testimonial.id) ? (
                            <>
                              Show less
                              <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
                            </>
                          ) : (
                            <>
                              Read more
                              <ChevronDown className="h-4 w-4 transition-transform" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
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

          {/* Pagination Dots */}
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

        {/* View All on LinkedIn CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.linkedin.com/in/decebaldobrica/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-teal/80 font-semibold"
          >
            View all recommendations on LinkedIn
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
