'use client'

import { getAllCaseStudies } from '@/data/caseStudies'
import { AlertCircle, ArrowRight, CheckCircle2, Lightbulb, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FullCaseStudiesSection = () => {
  const caseStudies = getAllCaseStudies()

  return (
    <section id="work" className="py-20">
      <div className="section-container">
        <h2 className="section-title">Case Studies</h2>
        <p className="section-subtitle">
          Real transformations. Real results. See how I help teams move from chaos to clarity.
        </p>

        <div className="mt-16 space-y-16">
          {caseStudies.map((study) => (
            <Link key={study.id} href={`/work/${study.slug}`} className="block group">
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-brand-teal/50 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-teal/20 hover:scale-[1.02]">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-teal/20 to-brand-teal/10 p-8 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-brand-teal/30 rounded-full text-brand-teal text-sm font-medium mb-3">
                        {study.industry}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-brand-teal transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-xl text-gray-100">{study.tagline}</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                      {study.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[100px] text-center"
                        >
                          <div className="text-2xl font-bold text-brand-teal">{metric.value}</div>
                          <div className="text-xs text-gray-200 mt-1">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Grid - Gamma Style */}
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Frustration */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        <h4 className="text-lg font-bold">Frustration</h4>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="bg-white/5 rounded-lg p-3 border-l-2 border-red-400/50">
                          <p className="text-gray-200 text-xs mb-1 uppercase font-semibold">
                            Problem
                          </p>
                          <p className="text-white line-clamp-3">
                            {study.problem.replace(/\*\*/g, '').substring(0, 150)}...
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border-l-2 border-orange-400/50">
                          <p className="text-gray-200 text-xs mb-1 uppercase font-semibold">
                            Impact
                          </p>
                          <p className="text-white line-clamp-2">
                            {study.impact.replace(/\*\*/g, '').substring(0, 120)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fix */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-teal">
                        <TrendingUp className="h-5 w-5" />
                        <h4 className="text-lg font-bold">Fix</h4>
                      </div>
                      <div className="space-y-2">
                        {study.outcomes.slice(0, 3).map((outcome) => (
                          <div
                            key={outcome}
                            className="flex items-start gap-2 bg-white/5 rounded-lg p-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                            <p className="text-white text-sm line-clamp-2">
                              {outcome.replace(/\*\*/g, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Future */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Lightbulb className="h-5 w-5" />
                        <h4 className="text-lg font-bold">Future</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 rounded-lg p-3 border border-yellow-400/20">
                          <p className="text-gray-200 text-xs mb-1 uppercase font-semibold">
                            Key Lesson
                          </p>
                          <p className="text-white text-sm line-clamp-3">
                            {study.lesson.replace(/\*\*/g, '')}
                          </p>
                        </div>
                        <div className="text-xs text-gray-200 flex items-center gap-1">
                          <span>Read full case study</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Metrics */}
                <div className="md:hidden px-8 pb-8">
                  <div className="flex gap-2 flex-wrap">
                    {study.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1 min-w-[100px] text-center"
                      >
                        <div className="text-xl font-bold text-brand-teal">{metric.value}</div>
                        <div className="text-xs text-gray-200 mt-1">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
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

export default FullCaseStudiesSection
