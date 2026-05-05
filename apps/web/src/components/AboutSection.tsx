'use client'

import { config } from '@/lib/personalConfig'
import { Highlighter } from '@decebal/ui/highlighter'
import NumberTicker from '@decebal/ui/number-ticker'
import { Award, Briefcase, Code2, GraduationCap, Heart, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useEffect, useRef } from 'react'

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.animate-on-scroll')
            let i = 0
            for (const el of elements) {
              setTimeout(() => {
                el.classList.add('animate-slide-up', 'opacity-100')
              }, 150 * i)
              i++
            }
          }
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const stats = [
    { value: 15, label: 'Years shipping production code', icon: Briefcase, suffix: '+' },
    { value: 1, label: 'Lines of production Rust', icon: Code2, suffix: 'M+' },
    { value: 75, label: 'Infrastructure cost cut', icon: Zap, suffix: '%' },
    { value: 3, label: 'Team velocity lift', icon: TrendingUp, suffix: '×' },
  ]

  return (
    <section id="about" className="py-20" ref={sectionRef}>
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">{config.tagline}</p>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-brand-teal/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-teal/20">
                <stat.icon className="h-6 w-6 text-brand-teal mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  <NumberTicker value={stat.value} />
                  <span className="text-brand-teal">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    <Highlighter color="#03c9a9" action="underline" isView>
                      Professional Experience
                    </Highlighter>
                  </h3>
                  <p className="text-white">
                    {config.professional.yearsExperience} years building fintech, SaaS, and Web3
                    platforms — now concentrated on Rust systems engineering as founder of Wolven
                    Tech. I've architected event-sourced platforms spanning native desktop (Tauri),
                    gRPC microservices (Tonic + Axum), embedded analytics (Arrow + DataFusion), and
                    WASM frontends (Leptos). Previously Technical Lead at Ebury and Software
                    Architect at Tellimer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    <Highlighter color="#03c9a9" action="underline" isView>
                      Education & Certifications
                    </Highlighter>
                  </h3>
                  <p className="text-white">
                    B.Sc. in IT & Mathematics from {config.education.institution}. Linux/Unix system
                    administration, Zend Certified PHP Engineer, Tech Leaders Fractional CTO
                    certification. Continuous Rust practice: workspace-lint discipline, Criterion
                    benchmarking, Edition 2024.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    <Highlighter color="#03c9a9" action="underline" isView>
                      Technical Leadership
                    </Highlighter>
                  </h3>
                  <p className="text-white">
                    Led engineering teams of up to {config.achievements.teamSize} across Tellimer,
                    Breakout Clips, Ebury, and multiple founder-mode startups. Expert in trunk-based
                    delivery, monorepo strategy (Turborepo, Cargo workspaces, Meta orchestrator),
                    and clean-architecture enforcement through CI. I help leaders see the
                    architecture, then help teams earn it.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    <Highlighter color="#03c9a9" action="underline" isView>
                      Technical Writing & Innovation
                    </Highlighter>
                  </h3>
                  <p className="text-white">
                    I write about Rust systems design, event sourcing, agentic AI workflows, and how
                    small teams outbuild big ones. Public artifacts: monorepo-meta on crates.io, the
                    wolven-tech/rust-v1 template, and the mcp-log-server. Wolven Tech is my current
                    operating vehicle — a Rust-only advisory practice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative animate-on-scroll opacity-0 transition-all duration-500">
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-brand-teal/20 rounded-lg -z-10 animate-pulse" />
              <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-brand-teal/20 rounded-lg -z-10 animate-pulse" />
              <img
                src="/images/gallery/img-07.jpg"
                alt="Professional portrait"
                className="w-full h-auto rounded-lg shadow-lg object-cover border border-brand-teal/20 transition-transform duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-teal/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
