import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import {
  BarChart,
  Briefcase,
  Clock,
  Code,
  Compass,
  Database,
  FileText,
  Lightbulb,
  MonitorSmartphone,
  PenTool,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const services = [
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Fractional CTO Services',
    description:
      'Strategic technical leadership for VC-backed startups. Technology strategy, architecture reviews, and team building.',
    teaser: 'Retainer-based',
    featured: true,
  },
  {
    icon: <PenTool className="h-8 w-8" />,
    title: 'Technical Writing & Case Studies',
    description:
      'Developer-focused content that drives SEO and leads. Blog posts, tutorials, and B2B case studies showcasing technical wins.',
    teaser: 'Per article or retainer • Pricing on request',
    featured: true,
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Architecture Documentation',
    description:
      'Clear, maintainable system documentation. Architecture diagrams, API docs, and decision records that accelerate onboarding.',
    teaser: 'Project-based pricing',
    featured: false,
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: 'Performance Optimization',
    description:
      'Proven track record of 30%+ API improvements. Database tuning, caching strategies, and infrastructure optimization.',
    teaser: 'Custom engagement',
    featured: false,
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: 'Technical Due Diligence',
    description:
      'Comprehensive technical assessment for VC firms evaluating portfolio companies or new investments.',
    teaser: 'For VC firms',
    featured: false,
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Team Acceleration',
    description:
      'Mentor engineering teams to ship faster and maintain velocity through proven development practices.',
    teaser: 'Included in retainer',
    featured: false,
  },
]

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="section-title">How I Can Help</h2>
        <p className="section-subtitle">
          From fractional CTO services to technical content creation—strategic expertise that
          accelerates your startup's growth.
        </p>

        {/* Featured Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services
            .filter((service) => service.featured)
            .map((service, index) => (
              <div
                key={index}
                className="brand-card p-8 rounded-lg hover-glow transition-all duration-300"
              >
                <div className="bg-brand-teal/20 rounded-lg p-4 inline-block mb-6 text-brand-teal">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
                <p className="text-gray-400 text-sm mb-6 italic">{service.teaser}</p>
                <Link href="/services">
                  <ShimmerButton className="w-full">View Details & Pricing</ShimmerButton>
                </Link>
              </div>
            ))}
        </div>

        {/* Other Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services
            .filter((service) => !service.featured)
            .map((service, index) => (
              <div
                key={index}
                className="brand-card p-6 rounded-lg hover-lift transition-all duration-300"
              >
                <div className="bg-brand-teal/10 rounded-lg p-3 inline-block mb-4 text-brand-teal">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{service.description}</p>
                <p className="text-gray-400 text-xs italic">{service.teaser}</p>
              </div>
            ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to accelerate your portfolio velocity?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you need fractional CTO services, technical content, or architecture
            documentation—let's discuss how I can help you ship faster and scale smarter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services">
              <Button size="lg" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                View All Services & Pricing
              </Button>
            </Link>
            <Link href="/contact?category=General+Consultation">
              <Button
                size="lg"
                variant="outline"
                className="border-brand-teal/30 text-white hover:bg-brand-teal/10"
              >
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
