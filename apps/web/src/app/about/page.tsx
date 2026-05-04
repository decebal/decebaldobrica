'use client'

import Footer from '@/components/Footer'
import { config } from '@/lib/personalConfig'
import { GlowButton } from '@decebal/ui/glow-button'
import { NeonButton } from '@decebal/ui/neon-button'
import { ShimmerButton } from '@decebal/ui/shimmer-button'
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
                    onClick={() => {
                      window.location.href = '/contact?category=About+Page'
                    }}
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
                    I'm a Rust engineering leader and the founder of{' '}
                    <a
                      href="https://wolventech.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:underline"
                    >
                      Wolven Tech
                    </a>
                    , a Rust-only technical advisory practice. I've architected and shipped 1M+
                    lines of production Rust across four event-sourced platforms, including
                    desktop AI tooling, gRPC microservices, embedded analytics engines, and WASM
                    frontends. I authored AllSource, an embedded Rust event store with WAL and
                    Parquet columnar storage built for 24/7 throughput, plus AllFrame, the Rust
                    framework that powers it.
                  </p>
                  <p>
                    Currently <strong>Senior Software Engineer at iProov</strong>, building
                    deepfake-detection and liveness-verification features that protect ~5M
                    biometric transactions per year, while modernising the JS/WASM stack (Biome,
                    Bun, buf.build) for 30%+ CI/CD gains. Previously{' '}
                    <strong>Technical Lead at Ebury</strong>,{' '}
                    <strong>Engineering Manager at Tellimer</strong>, and{' '}
                    <strong>Technical Lead at Breakout Clips</strong>, with{' '}
                    {config.professional.yearsExperience} years across fintech, identity, SaaS and
                    Web3.
                  </p>
                  <p>
                    Wolven Tech is my operating vehicle for specialist Rust engagements: HFT, HPC,
                    trading, and 24/7 platforms where microseconds and state integrity matter.
                    Typical outcomes vs. equivalent TypeScript services: 6–10× memory reduction,
                    8× smaller release binaries, 5× faster startup. I also lead 0→1 AI-augmented
                    product delivery. The clearest example: a production AI document-parsing
                    platform on AWS Bedrock + SageMaker that powered multiple fintech analytics
                    products and cut AWS cost by 75%.
                  </p>
                  <p>
                    I write about Rust systems design, event sourcing, agentic AI workflows, and how
                    small teams outbuild big ones. Public artifacts include{' '}
                    <a
                      href="https://crates.io/crates/monorepo-meta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:underline"
                    >
                      monorepo-meta
                    </a>{' '}
                    on crates.io and the{' '}
                    <a
                      href="https://github.com/wolven-tech/rust-v1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:underline"
                    >
                      wolven-tech/rust-v1
                    </a>{' '}
                    production template. Based in London, available fully remote on a B2B
                    (Outside-IR35) basis.
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
                      Leading AI integration strategies for development teams, navigating GenAI
                      adoption challenges, and building intelligent systems that enhance
                      productivity and innovation.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Cloud Architecture & SaaS
                    </h3>
                    <p className="text-white">
                      Expert in cloud management, serverless architectures, and SaaS development.
                      Proven track record of reducing infrastructure costs by 75% through smart AWS
                      optimization.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Technology Strategy & Leadership
                    </h3>
                    <p className="text-white">
                      Engineering Leader guiding startups through digital transformation. Led teams
                      of 25+ engineers, increasing productivity by 300% through modern development
                      practices.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Blockchain & Web Development
                    </h3>
                    <p className="text-white">
                      Deep expertise in blockchain technologies, custom software development, and
                      building scalable web applications from MVPs to production-ready systems.
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
                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Senior Software Engineer</h3>
                        <p className="text-brand-teal mb-2">
                          iProov · Full-time · Nov 2025 - Present
                        </p>
                        <p className="text-white mb-3">
                          Biometric face verification at scale. Building deepfake-detection and
                          liveness features for regulated identity assurance.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Shipping verified-video features (deepfake detection, liveness) for
                            safety-critical, ML-adjacent identity workflows
                          </li>
                          <li>
                            Modernised the JS/WASM stack (Biome, Bun, buf.build), improving CI/CD
                            and build performance by 30%+
                          </li>
                          <li>
                            Hardened an encrypted-WebSocket channel protecting ~5M biometric
                            transactions per year
                          </li>
                          <li>Tech stack: TypeScript, WebAssembly, Bun, buf.build, WebSockets</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Founder & Principal Rust Engineer
                        </h3>
                        <p className="text-brand-teal mb-2">
                          Wolven Tech · Ongoing · 2025 - Present
                        </p>
                        <p className="text-white mb-3">
                          Specialist Rust technical advisory for HFT, HPC, trading, and 24/7
                          platforms. Author of AllSource and AllFrame.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Authored AllSource, an embedded Rust event store with WAL, Parquet
                            columnar storage, zero-copy Arrow IPC, and a 7-day durability stress
                            harness
                          </li>
                          <li>Authored AllFrame, the Rust framework that powers AllSource</li>
                          <li>
                            Engagement models: Technical Due Diligence, Fractional Architect,
                            Platform Sprint, Advisor
                          </li>
                          <li>
                            Public Rust: monorepo-meta on crates.io (Tokio + tmux task
                            orchestrator, ~2.7 MB binary), wolven-tech/rust-v1 production
                            template, mcp-log-server
                          </li>
                          <li>
                            Tech stack: Rust (Tokio, Axum, Tonic, Arrow/Parquet, DataFusion,
                            RocksDB, Leptos, Tauri 2)
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Technical Lead</h3>
                        <p className="text-brand-teal mb-2">
                          Ebury · Full-time · Apr 2025 - Sep 2025
                        </p>
                        <p className="text-white mb-3">
                          Architected a fully-audited event-sourced platform handling 2M
                          requests/day at regulated-fintech reliability standards.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Designed the event store and projection model; piloted Node.js → Bun +
                            Elysia.js migration cutting API latency 25% and CI/CD build 30%
                          </li>
                          <li>
                            Led a cross-functional team of 10+ through the cutover; introduced
                            Claude and Cursor into developer workflows
                          </li>
                          <li>
                            Reduced onboarding time by 65% while preserving regulatory compliance
                          </li>
                          <li>
                            Tech stack: TypeScript, React, Bun, Elysia.js, AWS, event sourcing
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Part-time Smart Contract Engineer
                        </h3>
                        <p className="text-brand-teal mb-2">
                          Mundo Wallet · Contract · Apr 2025 - Sep 2025
                        </p>
                        <p className="text-white mb-3">
                          Repositioned a non-custodial Web3 wallet into a fintech app with
                          virtual-card integration for USD-scarce markets.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Delivered Rust smart-contract and wallet-feature optimizations on
                            Solana driving sustainable growth
                          </li>
                          <li>
                            Cut 3rd-party blockchain stack costs by 60% through indexer
                            optimisation and chain selection
                          </li>
                          <li>Tech stack: Rust, Solana, Anchor</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Part-time Senior Developer
                        </h3>
                        <p className="text-brand-teal mb-2">
                          HedgeX Capital · Contract · Nov 2024 - Mar 2026
                        </p>
                        <p className="text-white mb-3">
                          Auto-rebalancing crypto strategy engine in Rust + WASM, deployed as
                          serverless Fermyon workloads.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Lifted measured trading efficiency 15% via low-latency execution across
                            multiple exchange WebSockets
                          </li>
                          <li>
                            Improved scalability 20% with a modular Rust + WASM architecture for
                            rapid strategy iteration
                          </li>
                          <li>
                            Tuned hot-path allocation and serialization for sub-second exchange
                            quote ingestion; Supabase as GraphQL data plane
                          </li>
                          <li>Tech stack: Rust, WASM, Fermyon, Supabase</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Senior Software Engineer
                        </h3>
                        <p className="text-brand-teal mb-2">
                          BrainRocket · Full-time · Dec 2024 - Mar 2025
                        </p>
                        <p className="text-white mb-3">
                          Greenfield Jackpot platform (0→1), architected for high concurrency and
                          fault tolerance.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Designed responsibility-focused microservices (NestJS, NATS.io, AWS) and
                            a C4 architectural model that drove cross-team alignment
                          </li>
                          <li>
                            Established CI/CD pipelines on AWS + Vercel to shorten feedback loops
                          </li>
                          <li>Tech stack: Bun, NestJS, TypeScript, Kubernetes, AWS</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Part-time Senior Software Engineer
                        </h3>
                        <p className="text-brand-teal mb-2">
                          VendueTech · Contract · Sep 2024 - Jan 2025
                        </p>
                        <p className="text-white mb-3">
                          Public-auction analytics platform on Azure with multi-layered RBAC.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Designed a multi-layered RBAC system enabling fine-grained feature access</li>
                          <li>
                            Increased access efficiency 40% by centralising public auction data
                            into an Azure-based platform
                          </li>
                          <li>Tech stack: Python, React, Azure</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Technical Lead</h3>
                        <p className="text-brand-teal mb-2">
                          Breakout Clips · Full-time · Mar 2023 - Jul 2024
                        </p>
                        <p className="text-white mb-3">
                          AI-assisted video tooling. High-performance render pipeline on GCP Cloud
                          Run + FFmpeg.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>Cut video-rendering latency 30% via FFmpeg + GCP Cloud Run + Pub/Sub pipeline</li>
                          <li>
                            Reduced CI/CD infra cost 40% with a Pulumi IaC pipeline and ephemeral
                            preview environments
                          </li>
                          <li>
                            Transitioned engineering to trunk-based development, cutting integration
                            issues 20%
                          </li>
                          <li>Tech stack: TypeScript, Python, GCP Cloud Run, FFmpeg, Pulumi</li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Engineering Manager</h3>
                        <p className="text-brand-teal mb-2">
                          Tellimer · Full-time · Aug 2019 - Mar 2023
                        </p>
                        <p className="text-white mb-3">
                          AI and fintech analytics platforms. Delivered a 0→1 production AI
                          document-parsing platform on AWS Bedrock + SageMaker.
                        </p>
                        <ul className="text-white text-sm space-y-1 list-disc list-inside">
                          <li>
                            Led research and delivery of a Python/FastAPI AI parsing pipeline,
                            commercialised across multiple fintech analytics products
                          </li>
                          <li>Cut AWS cost 75% through a serverless-first architecture</li>
                          <li>
                            Guided REST → GraphQL migration; directed a team of 9 engineers with
                            agile rituals and structured mentorship
                          </li>
                          <li>
                            Tech stack: TypeScript, Python, FastAPI, AWS (Lambda, SageMaker,
                            Bedrock), GraphQL, Pulumi
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm" />
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Earlier Roles</h3>
                        <p className="text-brand-teal mb-2">
                          Flyt, Funeral Zone, eMAG, eRepublik Labs & Others · 2010 - 2019
                        </p>
                        <p className="text-white">
                          Software Architect and Senior Engineer roles across PHP, Python, and
                          JavaScript stacks. Built expertise in serverless architecture, event
                          sourcing, GraphQL, blockchain, and team leadership.
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
                      <div className="w-4 h-4 bg-brand-darknavy rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{config.education.degree}</h3>
                    <p className="text-brand-teal mb-2">
                      {config.education.institution} • {config.education.years}
                    </p>
                    <p className="text-white">
                      Advanced software engineering studies with focus on building robust, scalable
                      systems and technical leadership fundamentals.
                    </p>
                  </div>

                  <div className="timeline-item relative pl-8 opacity-0 transition-all duration-500">
                    <div className="absolute w-8 h-8 bg-gradient-to-b from-brand-teal to-brand-teal/80 rounded-full -left-[17px] top-0 z-10 shadow-md shadow-brand-teal/20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-darknavy rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Professional Certifications
                    </h3>
                    <p className="text-brand-teal mb-2">Various • Ongoing</p>
                    <p className="text-white mb-2">
                      Continuous learning through professional certifications and technical
                      training.
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                      {config.education.certifications.map((cert) => (
                        <li key={cert}>{cert}</li>
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
