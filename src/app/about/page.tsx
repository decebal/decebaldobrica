'use client'

import Footer from '@/components/Footer'
import { GlowButton } from '@/components/ui/glow-button'
import { NeonButton } from '@/components/ui/neon-button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { config } from '@/lib/personalConfig'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import React, { useEffect } from 'react'

const AboutPage = () => {
  // Initialize animations on component mount
  useEffect(() => {
    // Add animation classes to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item')
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-slide-up', 'opacity-100')
      }, 100 * index)
    })
  }, [])

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
                  <p className="text-lg text-brand-paragraph mt-2 animate-fade-in">
                    {config.professional.title}
                  </p>
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
                    onClick={() => (window.location.href = '/contact?category=About+Page')}
                  >
                    <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Contact Me</span>
                  </NeonButton>
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  About Me
                </h2>
                <div className="prose prose-lg max-w-none text-white">
                  <p>
                    I'm a technology leader specializing in AI engineering, software architecture, and digital transformation.
                    As a {config.professional.title}, I help organizations navigate complex technological challenges and build scalable, innovative solutions.
                  </p>
                  <p>
                    Most recently, I led a team of 7 engineers at <strong>Ebury</strong> as Engineering Manager, reducing customer onboarding time by 35% through
                    modular architecture and automation. Concurrently, I worked as a Smart Contract Engineer at <strong>Mundo Wallet</strong>, transforming
                    a crypto wallet into a fintech app for high-inflation markets and cutting blockchain infrastructure costs by 60%.
                  </p>
                  <p>
                    With over {config.professional.yearsExperience} years of experience, I've helped VC-backed startups overcome their toughest challenge:
                    portfolio velocity. My track record includes {config.achievements.description}.
                  </p>
                  <p>
                    I'm passionate about emerging technologies—from AI engineering and GenAI integration to blockchain
                    and event-driven architectures. I write extensively about software architecture, guide development
                    teams through technological transformations, and translate complex technical concepts into actionable
                    strategies. My approach combines strategic technical leadership with hands-on execution, ensuring
                    teams don't just build—they build right.
                  </p>
                </div>
              </section>

              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      AI Engineering & GenAI
                    </h3>
                    <p className="text-white">
                      Leading AI integration strategies for development teams, navigating GenAI adoption
                      challenges, and building intelligent systems that enhance productivity and innovation.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Cloud Architecture & SaaS
                    </h3>
                    <p className="text-white">
                      Expert in cloud management, serverless architectures, and SaaS development. Proven
                      track record of reducing infrastructure costs by 75% through smart AWS optimization.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Technology Strategy & Leadership
                    </h3>
                    <p className="text-white">
                      Fractional CTO guiding startups through digital transformation. Led teams of 25+
                      engineers, increasing productivity by 300% through modern development practices.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Blockchain & Web Development
                    </h3>
                    <p className="text-white">
                      Deep expertise in blockchain technologies, custom software development, and building
                      scalable web applications from MVPs to production-ready systems.
                    </p>
                  </div>
                </div>
              </section>

              {/* Experience Section with Updated Timeline */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  Experience
                </h2>
                <div className="space-y-6">
                  {/* Timeline items */}
                  <div className="relative pl-8 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-gradient-to-b before:from-brand-teal before:to-brand-teal/20">
                    {/* Timeline items */}
                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Engineering Manager
                        </h3>
                        <p className="text-brand-teal mb-2">Ebury · Full-time · Apr 2025 - Sep 2025</p>
                        <p className="text-white mb-3">
                          Led engineering team improving customer onboarding journey in a hybrid London-based role.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Led a team of 7 engineers to reduce onboarding time by 35% through workflow simplification and automation</li>
                          <li>Introduced modular architecture to decouple KYC logic, improving test coverage by 40%</li>
                          <li>Fostered strong engineering culture with pairing and mentoring, increasing delivery velocity by 25%</li>
                          <li>Tech stack: TypeScript, Node.js, React, Python, AWS, GitHub Actions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Part-time Smart Contract Engineer
                        </h3>
                        <p className="text-brand-teal mb-2">Mundo Wallet · Contract · Apr 2025 - Sep 2025</p>
                        <p className="text-white mb-3">
                          Transformed crypto wallet into fintech app for high-inflation, restricted-currency markets.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Aligned product and technical strategy for USD-scarce markets with high inflation</li>
                          <li>Repurposed crypto wallet with virtual card integration for everyday business use cases</li>
                          <li>Cut 3rd-party blockchain stack costs by 60% through indexer optimization</li>
                          <li>Delivered smart contract and wallet optimizations driving scalability and sustainable growth</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          {config.professional.currentRole}
                        </h3>
                        <p className="text-brand-teal mb-2">{config.professional.currentCompany} • Ongoing</p>
                        <p className="text-white mb-3">
                          Leading technology strategy and architecture for fintech innovation. Focusing on AI
                          engineering, digital transformation, and building scalable financial technology solutions.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Driving AI integration and GenAI adoption strategies</li>
                          <li>Technology strategy and digital transformation leadership</li>
                          <li>Cloud architecture and SaaS development</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Technical Lead
                        </h3>
                        <p className="text-brand-teal mb-2">Breakout Clips</p>
                        <p className="text-white mb-3">
                          Drove transformative improvements in development efficiency and codebase management.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Increased developer productivity by 300% through trunk development implementation</li>
                          <li>Unified codebase through monorepo strategy</li>
                          <li>Streamlined technology stack focus</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Software Architect</h3>
                        <p className="text-brand-teal mb-2">Tellimer</p>
                        <p className="text-white mb-3">
                          Led large-scale engineering teams and delivered significant cost optimizations.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Reduced AWS infrastructure costs by 75%</li>
                          <li>Launched MVPs for "Parsel.io" and "Scriber.to"</li>
                          <li>Managed teams of over 25 engineers</li>
                          <li>Tech stack: NodeJS, ReactJS, Rust, Golang, Postgres, AWS</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Previous Roles</h3>
                        <p className="text-brand-teal mb-2">Flyt, Funeral Zone, eMag & Others</p>
                        <p className="text-white">
                          Diverse experience in software engineering across multiple industries, from backend
                          development to architectural leadership. Built expertise in blockchain, cloud
                          infrastructure, event-driven architectures, and team coaching.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2 animate-fade-in">
                  Education
                </h2>
                <div className="relative before:absolute before:inset-y-0 before:left-[17px] before:w-0.5 before:bg-brand-teal/70 ml-[18px]">
                  <div className="timeline-item relative pl-8 pb-10 opacity-0 transition-all duration-500">
                    <div className="absolute w-8 h-8 bg-gradient-to-b from-brand-teal to-brand-teal/80 rounded-full -left-[17px] top-0 z-10 shadow-md shadow-brand-teal/20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-darknavy rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {config.education.degree}
                    </h3>
                    <p className="text-brand-teal mb-2">{config.education.institution} • {config.education.years}</p>
                    <p className="text-white">
                      Advanced software engineering studies with focus on building robust,
                      scalable systems and technical leadership fundamentals.
                    </p>
                  </div>

                  <div className="timeline-item relative pl-8 opacity-0 transition-all duration-500">
                    <div className="absolute w-8 h-8 bg-gradient-to-b from-brand-teal to-brand-teal/80 rounded-full -left-[17px] top-0 z-10 shadow-md shadow-brand-teal/20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-darknavy rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Professional Certifications
                    </h3>
                    <p className="text-brand-teal mb-2">Various • Ongoing</p>
                    <p className="text-white mb-2">
                      Continuous learning through professional certifications and technical training.
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                      {config.education.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
