import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import {
  BarChart,
  Briefcase,
  Clock,
  Code,
  Compass,
  Database,
  Lightbulb,
  MonitorSmartphone,
  PenTool,
  Users,
} from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const services = [
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Fractional CTO Services',
    description:
      'Strategic technical leadership for VC-backed startups. Accelerate portfolio velocity while keeping costs under control.',
    featured: true,
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: 'Blockchain Development',
    description:
      'Build secure, scalable Web3 applications with Rust and TypeScript. From smart contracts to full dApps.',
    featured: true,
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: 'Serverless Architecture',
    description: 'Design and implement cost-effective, scalable cloud-native systems that grow with your startup.',
    featured: false,
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Team Acceleration',
    description: 'Mentor engineering teams to ship faster and maintain velocity through proven development practices.',
    featured: false,
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: 'Technical Due Diligence',
    description: 'Comprehensive technical assessment for VC firms evaluating portfolio companies or new investments.',
    featured: false,
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: 'MVP to Production',
    description:
      'Transform validated ideas and no-code prototypes into scalable, production-ready applications.',
    featured: false,
  },
]

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="section-title">How I Can Help</h2>
        <p className="section-subtitle">
          Turn your capital into working, high-impact software—faster.
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
                <p className="text-gray-300 mb-6">{service.description}</p>
                <Link href={`/contact?category=${encodeURIComponent(service.title)}`}>
                  <ShimmerButton className="w-full">Book a Session</ShimmerButton>
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
                <p className="text-gray-300 text-sm">{service.description}</p>
              </div>
            ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to accelerate your portfolio velocity?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a VC firm or a startup founder, let's discuss how fractional technical leadership
            can help you ship faster, scale smarter, and build right.
          </p>
          <Link href="/contact?category=General+Consultation">
            <Button size="lg" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
              Schedule Your Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
