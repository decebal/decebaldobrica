import Footer from '@/components/Footer'
import { getAllCaseStudies, getCaseStudy } from '@/data/caseStudies'
import {
  AlertCircle,
  ArrowLeft,
  Building,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  User,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface CaseStudyPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const studies = getAllCaseStudies()
  return studies.map((study) => ({
    slug: study.slug,
  }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: study.title,
    description: study.tagline,
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    notFound()
  }

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <div className="section-container max-w-6xl">
          {/* Back Button */}
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-teal/80 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Case Studies
          </Link>

          {/* Hero Section - Gamma Style */}
          <div className="bg-gradient-to-br from-brand-teal/20 via-brand-teal/10 to-transparent rounded-3xl p-12 mb-12 border border-brand-teal/30">
            <div className="inline-block px-4 py-2 bg-brand-teal/30 rounded-full text-brand-teal text-sm font-medium mb-4">
              {study.industry}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{study.title}</h1>
            <p className="text-2xl text-gray-100 mb-8">{study.tagline}</p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {study.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
                >
                  <div className="text-3xl font-bold text-brand-teal mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-200 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Frustration Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-400/20 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Frustration</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Person Card */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-brand-teal/20 p-3 rounded-xl">
                    <User className="h-5 w-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{study.personName}</h3>
                    <p className="text-brand-teal">{study.personTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-200 mb-4">
                  <Building className="h-4 w-4" />
                  <span>
                    {study.companyName} • {study.companyIndustry}
                  </span>
                </div>
              </div>

              {/* Role Card */}
              <div className="bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 backdrop-blur-sm rounded-2xl p-6 border border-brand-teal/20">
                <h3 className="text-sm font-medium text-brand-teal mb-2 uppercase">My Role</h3>
                <p className="text-white font-semibold text-lg">{study.role}</p>
              </div>
            </div>

            {/* Problem & Impact */}
            <div className="mt-6 space-y-6">
              <div className="bg-gradient-to-br from-red-400/10 to-red-400/5 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-red-400">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-red-400">⚠️</span> The Problem
                </h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{study.problem}</ReactMarkdown>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-orange-400">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-orange-400">💥</span> The Impact
                </h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{study.impact}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Fix Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-teal/20 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-brand-teal" />
              </div>
              <h2 className="text-3xl font-bold text-white">Fix</h2>
            </div>

            {/* Framework */}
            <div className="bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 backdrop-blur-sm rounded-2xl p-6 border border-brand-teal/20 mb-6">
              <h3 className="text-sm font-medium text-brand-teal mb-2 uppercase">Framework</h3>
              <p className="text-white text-lg leading-relaxed">{study.framework}</p>
            </div>

            {/* Actions & Outcomes Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Actions */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-brand-teal">⚡</span> Actions Taken
                </h3>
                <ul className="space-y-3">
                  {study.actions.map((action) => (
                    <li key={action} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
                      <div className="text-white prose prose-invert max-w-none">
                        <ReactMarkdown>{action}</ReactMarkdown>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 backdrop-blur-sm rounded-2xl p-6 border border-brand-teal/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-brand-teal">🎯</span> Outcomes
                </h3>
                <ul className="space-y-3">
                  {study.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
                      <div className="text-white prose prose-invert max-w-none">
                        <ReactMarkdown>{outcome}</ReactMarkdown>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Future Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/20 p-3 rounded-xl">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Future</h2>
            </div>

            {/* Lesson */}
            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20 mb-6">
              <h3 className="text-sm font-medium text-yellow-400 mb-3 uppercase">💡 Key Lesson</h3>
              <div className="text-white text-xl prose prose-invert max-w-none leading-relaxed">
                <ReactMarkdown>{study.lesson}</ReactMarkdown>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">📋</span> Prescriptions
              </h3>
              <ul className="space-y-3">
                {study.prescriptions.map((prescription) => (
                  <li key={prescription} className="flex items-start gap-3">
                    <div className="bg-yellow-400/20 rounded-full p-1 shrink-0 mt-0.5">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="text-white prose prose-invert max-w-none">
                      <ReactMarkdown>{prescription}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-brand-teal/20 to-brand-teal/10 rounded-2xl p-8 border border-brand-teal/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Facing similar challenges?</h3>
            <p className="text-gray-100 mb-6 max-w-2xl mx-auto text-lg">
              Let's talk. I'll help you decode the gap, align your team, and weaponize AI for speed,
              not chaos.
            </p>
            <Link
              href={`/contact?category=${encodeURIComponent(`Case Study: ${study.title}`)}`}
              className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Schedule a Tactical Briefing
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
              >
                <title>Arrow Right Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
