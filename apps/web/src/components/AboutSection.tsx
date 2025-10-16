'use client'

import { config } from '@/lib/personalConfig'
import { Highlighter } from '@decebal/ui/highlighter'
import NumberTicker from '@decebal/ui/number-ticker'
import { motion } from 'framer-motion'
import { Award, Briefcase, GraduationCap, Heart, TrendingUp, Users, Zap } from 'lucide-react'
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
    { value: 15, label: 'Years Experience', icon: Briefcase, suffix: '+' },
    { value: 3, label: 'Productivity Gains', icon: TrendingUp, suffix: 'x' },
    { value: 70, label: 'Cost Reduction', icon: Zap, suffix: '%' },
    { value: 10, label: 'Team Size Led', icon: Users, suffix: '+' },
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
                    {config.professional.yearsExperience} years as a {config.professional.title}.
                    Recently led engineering teams at Ebury and built smart contract solutions at
                    Mundo Wallet. {config.achievements.description}.
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
                    {config.education.degree} from {config.education.institution}.{' '}
                    {config.education.certifications.slice(0, 2).join(', ')}, and ongoing
                    professional development.
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
                    Led teams of {config.achievements.teamSize} engineers at Tellimer, Breakout
                    Clips, and multiple startups. Expert in trunk development, monorepo strategies,
                    and cloud architecture.
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
                    Writing extensively about AI engineering, event sourcing, and software
                    architecture. Passionate about GenAI integration and emerging technologies.
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
