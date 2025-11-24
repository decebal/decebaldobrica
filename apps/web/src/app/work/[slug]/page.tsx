import {
  KPIRadialChart,
  PhaseDurationChart,
  TechRadarChart,
  TechStackPieChart,
} from '@/components/CaseStudyCharts'
import Footer from '@/components/Footer'
import { getAllCaseStudies, getCaseStudy } from '@/data/caseStudies'
import {
  AlertCircle,
  ArrowLeft,
  Building,
  CheckCircle2,
  ExternalLink,
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

          {/* Enhanced Content - TOGAF Phases */}
          {study.togafPhases && study.togafPhases.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-400/20 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>Architecture Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">TOGAF Architecture Development Method</h2>
              </div>

              <div className="bg-gradient-to-br from-purple-400/10 to-purple-400/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 mb-6">
                <p className="text-gray-100 text-lg mb-6">
                  Comprehensive 12-day sprint implementing TOGAF ADM Phases A-H with enterprise rigor at
                  startup speed.
                </p>

                {/* Phase Duration Chart */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-purple-400 mb-4 uppercase text-center">Phase Timeline Visualization</h4>
                  <PhaseDurationChart phases={study.togafPhases} />
                </div>
              </div>

              <div className="space-y-4">
                {study.togafPhases.map((phase, idx) => (
                  <div
                    key={phase.phase}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-purple-400/20 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <span className="text-purple-400 font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{phase.phase}</h3>
                          <span className="px-3 py-1 bg-purple-400/20 rounded-full text-purple-400 text-sm font-medium">
                            {phase.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h4 className="text-sm font-medium text-purple-400 mb-3 uppercase">
                          Deliverables
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-start gap-2 text-gray-200 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {phase.kpis && phase.kpis.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-purple-400 mb-3 uppercase">KPIs</h4>
                          <ul className="space-y-2">
                            {phase.kpis.map((kpi) => (
                              <li key={kpi} className="flex items-start gap-2 text-gray-200 text-sm">
                                <TrendingUp className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                                <span>{kpi}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Content - Detailed KPIs */}
          {study.detailedKpis && study.detailedKpis.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-400/20 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>Chart Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Detailed Performance Metrics</h2>
              </div>

              <div className="space-y-8">
                {study.detailedKpis.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-blue-400">📊</span>
                      {category.category}
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.metrics.map((metric) => (
                        <div
                          key={metric.name}
                          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-blue-400/30 transition-colors"
                        >
                          <h4 className="text-sm font-medium text-blue-400 mb-4 text-center">{metric.name}</h4>

                          {/* Radial Chart for visual impact */}
                          {typeof metric.before === 'number' && typeof metric.after === 'number' && (
                            <div className="mb-4">
                              <KPIRadialChart
                                name={metric.name}
                                before={metric.before}
                                after={metric.after}
                                unit={metric.unit}
                                improvement={metric.improvement}
                              />
                            </div>
                          )}

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Before:</span>
                              <span className="text-red-400 font-mono">
                                {typeof metric.before === 'number'
                                  ? metric.before.toLocaleString()
                                  : metric.before}{' '}
                                {metric.unit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">After:</span>
                              <span className="text-green-400 font-mono font-bold">
                                {typeof metric.after === 'number'
                                  ? metric.after.toLocaleString()
                                  : metric.after}{' '}
                                {metric.unit}
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 justify-center">
                              <TrendingUp className="h-4 w-4 text-green-400" />
                              <span className="text-green-400 text-sm font-semibold">
                                {metric.improvement}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Content - Architecture Diagrams */}
          {study.architectureDiagrams && study.architectureDiagrams.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-400/20 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>Diagram Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Architecture Diagrams</h2>
              </div>

              <div className="space-y-8">
                {study.architectureDiagrams.map((diagram) => (
                  <div
                    key={diagram.title}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{diagram.title}</h3>
                      <p className="text-gray-200 text-lg">{diagram.description}</p>
                    </div>

                    {/* Technology Visualization Charts */}
                    {diagram.layers && diagram.layers.length > 0 && diagram.type === 'technology-stack' && (
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-br from-green-400/5 to-green-400/10 backdrop-blur-sm rounded-xl p-6 border border-green-400/20">
                          <h4 className="text-lg font-bold text-white mb-4 text-center">Technology Distribution (Pie Chart)</h4>
                          <TechStackPieChart layers={diagram.layers} />
                        </div>
                        <div className="bg-gradient-to-br from-green-400/5 to-green-400/10 backdrop-blur-sm rounded-xl p-6 border border-green-400/20">
                          <h4 className="text-lg font-bold text-white mb-4 text-center">Technology Radar</h4>
                          <TechRadarChart layers={diagram.layers} />
                        </div>
                      </div>
                    )}

                    {diagram.layers && diagram.layers.length > 0 && (
                      <div className="space-y-4">
                        {diagram.layers.map((layer, idx) => (
                          <div
                            key={layer.name}
                            className="bg-gradient-to-br from-green-400/10 to-green-400/5 backdrop-blur-sm rounded-xl p-5 border border-green-400/20"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="bg-green-400/20 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-white mb-2">{layer.name}</h4>
                                <p className="text-gray-300 text-sm mb-3">{layer.purpose}</p>
                              </div>
                            </div>

                            <div className="ml-11">
                              <h5 className="text-sm font-medium text-green-400 mb-2 uppercase">
                                Technologies
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {layer.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-3 py-1 bg-white/10 rounded-full text-gray-200 text-sm border border-white/10"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References & Citations */}
          {study.references && study.references.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-400/20 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>References Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">References & Sources</h2>
              </div>

              <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/20 mb-6">
                <p className="text-gray-100 text-lg">
                  All metrics, costs, and claims are backed by official pricing pages, industry research, and
                  established standards.
                </p>
              </div>

              <div className="space-y-8">
                {study.references.map((refCategory) => (
                  <div key={refCategory.category}>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-orange-400">📚</span>
                      {refCategory.category}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {refCategory.items.map((ref) => (
                        <a
                          key={ref.url}
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-orange-400/30 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                              {ref.title}
                            </h4>
                            <ExternalLink className="h-4 w-4 text-orange-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          <p className="text-gray-300 text-sm leading-relaxed">{ref.description}</p>

                          <div className="mt-3 pt-3 border-t border-white/10">
                            <span className="text-xs text-orange-400 font-mono">{ref.url}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Migration Planning Techniques */}
          {study.migrationPlanningTechniques && study.migrationPlanningTechniques.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-400/20 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>Migration Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">TOGAF Migration Planning Techniques</h2>
              </div>

              <div className="bg-gradient-to-br from-indigo-400/10 to-indigo-400/5 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 mb-6">
                <p className="text-gray-100 text-lg">
                  Systematic migration planning using TOGAF-certified techniques to reduce risk, track dependencies, and ensure successful enterprise architecture transformation.
                </p>
              </div>

              <div className="space-y-6">
                {study.migrationPlanningTechniques.map((technique) => (
                  <div
                    key={technique.name}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-indigo-400/30 transition-colors"
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">{technique.name}</h3>
                    <p className="text-gray-200 mb-4">{technique.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-indigo-400 mb-3 uppercase flex items-center gap-2">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" role="img">
                            <title>Document Icon</title>
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                          Artifacts
                        </h4>
                        <ul className="space-y-2">
                          {technique.artifacts.map((artifact) => (
                            <li key={artifact} className="flex items-start gap-2 text-gray-200 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{artifact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-indigo-400 mb-3 uppercase flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Key Insights
                        </h4>
                        <ul className="space-y-2">
                          {technique.insights.map((insight) => (
                            <li key={insight} className="flex items-start gap-2 text-gray-200 text-sm">
                              <TrendingUp className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Learned */}
          {study.lessonsLearned && study.lessonsLearned.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-400/20 p-3 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Lessons Learned</h2>
              </div>

              <div className="space-y-6">
                {study.lessonsLearned.map((category) => (
                  <div
                    key={category.category}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-yellow-400">📝</span>
                      {category.category}
                    </h3>

                    <ul className="space-y-3">
                      {category.lessons.map((lesson) => (
                        <li key={lesson} className="flex items-start gap-3">
                          <div className="bg-yellow-400/20 rounded-full p-1 shrink-0 mt-0.5">
                            <Lightbulb className="h-4 w-4 text-yellow-400" />
                          </div>
                          <span className="text-gray-200">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Success Factors */}
          {study.criticalSuccessFactors && study.criticalSuccessFactors.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-400/20 p-3 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Critical Success Factors</h2>
              </div>

              <div className="bg-gradient-to-br from-green-400/10 to-green-400/5 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20 mb-6">
                <p className="text-gray-100 text-lg">
                  Key factors that enabled successful execution and outcomes, based on TOGAF best practices and real-world implementation experience.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {study.criticalSuccessFactors.map((factor, idx) => (
                  <div
                    key={factor}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-green-400/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-green-400/20 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                        <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                      </div>
                      <span className="text-gray-200 text-sm">{factor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Governance & Change Management */}
          {study.governanceModel && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-400/20 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>Shield Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Governance & Change Management</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-red-400">🏛️</span> Governance Structure
                  </h3>
                  <p className="text-gray-200">{study.governanceModel.structure}</p>
                </div>

                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-red-400">⚖️</span> Decision Rights
                  </h3>
                  <ul className="space-y-2">
                    {study.governanceModel.decisionRights.map((right) => (
                      <li key={right} className="flex items-start gap-2 text-gray-200 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{right}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-red-400">📅</span> Review Cadence
                    </h3>
                    <p className="text-gray-200 text-sm">{study.governanceModel.reviewCadence}</p>
                  </div>

                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-red-400">🚨</span> Escalation Path
                    </h3>
                    <p className="text-gray-200 text-sm">{study.governanceModel.escalationPath}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
