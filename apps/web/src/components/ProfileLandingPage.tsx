'use client'

import Footer from '@/components/Footer'
import {
  type RelatedBlogPost,
  RelatedBlogPosts,
  RelatedCaseStudies,
  type RelatedCaseStudy,
} from '@/components/RelatedContentSection'
import { config } from '@/lib/personalConfig'
import { NeonButton } from '@decebal/ui/neon-button'
import { ShimmerButton } from '@decebal/ui/shimmer-button'
import { ArrowRight, FileText, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

export interface ExpertiseItem {
  title: string
  description: string
  icon?: ReactNode
  skills?: string[]
}

export interface CrossLink {
  title: string
  tagline: string
  href: string
  icon?: ReactNode
}

interface ProfileLandingPageProps {
  // Hero content
  specialty: string
  tagline: string
  heroDescription: string | ReactNode

  // Expertise section
  expertise: ExpertiseItem[]

  // Related content
  relatedBlogPosts: RelatedBlogPost[]
  relatedCaseStudies: RelatedCaseStudy[]

  // CTA configuration
  contactCategory: string
  primaryCTAText?: string

  // Cross-links
  crossLinks: CrossLink[]

  // Optional custom sections
  children?: ReactNode
}

export function ProfileLandingPage({
  specialty,
  tagline,
  heroDescription,
  expertise,
  relatedBlogPosts,
  relatedCaseStudies,
  contactCategory,
  primaryCTAText = 'Get in Touch',
  crossLinks,
  children,
}: ProfileLandingPageProps) {
  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Information Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="text-center lg:text-left">
                  <div className="relative mx-auto lg:mx-0 w-48 h-48 rounded-full overflow-hidden border-4 border-brand-teal mb-6 shadow-lg shadow-brand-teal/20 animate-fade-in">
                    <img
                      src="/images/avatar.jpg"
                      alt={config.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-brand-heading animate-fade-in">
                    {config.name}
                  </h1>
                  <p className="text-lg text-brand-teal mt-2 animate-fade-in font-medium">
                    {specialty}
                  </p>
                  <p className="text-sm text-brand-paragraph mt-1 animate-fade-in">{tagline}</p>

                  {/* Availability Status */}
                  <div className="mt-4 animate-fade-in">
                    <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm px-3 py-1 rounded-full border border-emerald-500/30">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      Available for projects
                    </span>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-start space-x-4 animate-fade-in">
                  <a
                    href={config.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-heading hover:text-brand-teal transition-colors transform hover:scale-110 duration-200"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href={config.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-heading hover:text-brand-teal transition-colors transform hover:scale-110 duration-200"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="text-brand-heading hover:text-brand-teal transition-colors transform hover:scale-110 duration-200"
                  >
                    <Mail size={24} />
                  </a>
                </div>

                <div className="flex flex-col space-y-4">
                  <ShimmerButton
                    className="w-full group flex items-center justify-center gap-2 text-white"
                    onClick={() => window.open('/resume/decebal-dobrica-resume.pdf', '_blank')}
                  >
                    <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Download Resume</span>
                  </ShimmerButton>

                  <NeonButton
                    className="w-full group"
                    onClick={() => {
                      window.location.href = `/contact?category=${encodeURIComponent(contactCategory)}`
                    }}
                  >
                    <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>{primaryCTAText}</span>
                  </NeonButton>
                </div>

                {/* Other Expertise Links */}
                <div className="hidden lg:block pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-3">
                    Other Expertise
                  </p>
                  <div className="space-y-2">
                    {crossLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-white/70 hover:text-brand-teal transition-colors"
                      >
                        {link.icon}
                        <span>{link.title}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  About
                </h2>
                <div className="prose prose-lg max-w-none text-white">
                  {typeof heroDescription === 'string' ? <p>{heroDescription}</p> : heroDescription}
                </div>
              </section>

              {/* Expertise Section */}
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expertise.map((item) => (
                    <div
                      key={item.title}
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {item.icon && (
                          <div className="text-brand-teal flex-shrink-0">{item.icon}</div>
                        )}
                        <h3 className="text-xl font-semibold text-brand-heading">{item.title}</h3>
                      </div>
                      <p className="text-white">{item.description}</p>
                      {item.skills && item.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-brand-teal/10 text-brand-teal text-xs px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Custom sections */}
              {children}

              {/* Related Case Studies */}
              <RelatedCaseStudies caseStudies={relatedCaseStudies} title="Relevant Case Studies" />

              {/* Related Blog Posts */}
              <RelatedBlogPosts
                posts={relatedBlogPosts}
                title="Related Articles"
                viewAllHref="/blog"
              />

              {/* Cross-links for mobile */}
              <section className="lg:hidden animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  Other Expertise
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {crossLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-brand-teal/20 flex items-center justify-between hover:border-brand-teal/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {link.icon && <div className="text-brand-teal">{link.icon}</div>}
                        <div>
                          <h3 className="text-brand-heading font-medium">{link.title}</h3>
                          <p className="text-white/60 text-sm">{link.tagline}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Final CTA */}
              <section className="animate-fade-in bg-gradient-to-r from-brand-teal/10 to-brand-navy/10 p-8 rounded-lg border border-brand-teal/30">
                <h2 className="text-2xl font-bold mb-4 text-brand-heading">
                  Ready to Work Together?
                </h2>
                <p className="text-white/80 mb-6">
                  Let's discuss how I can help with your {specialty.toLowerCase()} needs.
                </p>
                <NeonButton
                  className="group"
                  onClick={() => {
                    window.location.href = `/contact?category=${encodeURIComponent(contactCategory)}`
                  }}
                >
                  <span>{primaryCTAText}</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </NeonButton>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
