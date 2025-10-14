'use client'

import Marquee from '@/components/ui/marquee'
import { getAllCaseStudies } from '@/data/caseStudies'
import { ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const WorkSection = () => {
  const caseStudies = getAllCaseStudies()

  return (
    <section id="work" className="py-20">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="section-title">Case Studies</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Real transformations. Real results. See how I help teams move from chaos to clarity.
          </p>
        </div>

        {/* Compact Marquee Display */}
        <div className="relative overflow-hidden -mx-4 md:-mx-8">
          <Marquee pauseOnHover className="[--duration:30s]">
            {caseStudies.map((study) => (
              <Link
                key={study.id}
                href={`/work/${study.slug}`}
                className="group relative flex w-80 flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-6 transition-all duration-300 hover:border-brand-teal/50 hover:shadow-lg hover:shadow-brand-teal/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-block px-3 py-1 bg-brand-teal/30 rounded-full text-brand-teal text-xs font-medium">
                    {study.industry}
                  </div>
                  <Briefcase className="h-5 w-5 text-brand-teal/60" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-teal transition-colors line-clamp-1">
                  {study.title}
                </h3>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{study.tagline}</p>

                {/* Compact Metrics */}
                <div className="flex gap-2 mb-4">
                  {study.metrics.slice(0, 2).map((metric, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center"
                    >
                      <div className="text-lg font-bold text-brand-teal">{metric.value}</div>
                      <div className="text-xs text-gray-300">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Read More */}
                <div className="flex items-center gap-1 text-xs text-brand-teal group-hover:gap-2 transition-all">
                  <span>Read case study</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </Marquee>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-brand-darknavy"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-brand-darknavy"></div>
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal border border-brand-teal/30 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          >
            View All Case Studies
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-brand-teal/20 to-brand-teal/10 rounded-2xl p-8 border border-brand-teal/30 max-w-3xl">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to transform your team?</h3>
            <p className="text-gray-100 mb-6">
              If you're a founder facing resistance, misalignment, or chaos—let's decode the gap,
              align your team, and weaponize AI for speed, not confusion.
            </p>
            <Link
              href="/contact?category=Case+Study+Interest"
              className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Schedule a Tactical Briefing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkSection
