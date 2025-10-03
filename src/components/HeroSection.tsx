'use client'

import { config } from '@/lib/personalConfig'
import { ChevronDown, Play } from 'lucide-react'
import React, { useState } from 'react'
import { GlowButton } from './ui/glow-button'
import { NeonButton } from './ui/neon-button'
import { SpotlightCard } from './ui/spotlight-card'
import { featureFlags } from '@/lib/featureFlags'

const HeroSection = () => {
  const [showVideo, setShowVideo] = useState(false)

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen pt-20 flex items-center relative">
      <div className="section-container flex flex-col md:flex-row items-center">
        <div className="flex-1 md:pr-8 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-white">
            Hello, I'm <span className="text-brand-teal">{config.name}</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            {config.tagline}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <GlowButton onClick={scrollToAbout}>Learn More About Me</GlowButton>
            <NeonButton
              onClick={() => (window.location.href = '/contact?category=Homepage+Hero')}
            >
              Get in Touch
            </NeonButton>
          </div>
        </div>
        <div className="flex-1 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <SpotlightCard className="max-w-sm md:max-w-md mx-auto">
            {featureFlags.enableHomepageVideo ? (
              // Video feature enabled - show video player
              !showVideo ? (
                <div className="relative aspect-video">
                  <img
                    src="/images/avatar.jpg"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors rounded-lg group"
                  >
                    <div className="bg-brand-teal rounded-full p-3 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                      <Play className="text-white w-8 h-8" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="aspect-video">
                  <video
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                    src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            ) : (
              // Video feature disabled - show static image only
              <div className="aspect-video">
                <img
                  src="/images/avatar.jpg"
                  alt={config.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={scrollToAbout}
          className="bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white/20 transition-colors"
        >
          <ChevronDown className="text-brand-teal" />
        </button>
      </div>
    </section>
  )
}

export default HeroSection
