'use client'

import { config } from '@/lib/personalConfig'
import { Highlighter } from '@decebal/ui/highlighter'
import { Coffee, Copy, Github, Linkedin, Mail, MapPin, Twitter } from 'lucide-react'
import React, { useState } from 'react'

const Footer = () => {
  const [copied, setCopied] = useState(false)

  const ethAddress = (config as { ethAddress?: string }).ethAddress || 'decebaldobrica.eth'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ethAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="bg-brand-darknavy/80 text-white pt-16 pb-8 border-t border-brand-teal/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">{config.name}</h3>
            <p className="text-gray-300 mb-4">{config.tagline}</p>
            <div className="flex space-x-4">
              <a
                href={config.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-teal transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={config.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-teal transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href={config.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-teal transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-brand-teal transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="/work" className="text-gray-400 hover:text-brand-teal transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-brand-teal transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-brand-teal shrink-0" />
                <span className="text-gray-400">{config.contact.location}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-brand-teal" />
                <a
                  href={`mailto:${config.contact.email}`}
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  {config.contact.email}
                </a>
              </li>
              <li className="mt-4 pt-4 border-t border-white/10 coffee-section">
                <div className="flex items-center justify-between gap-3 bg-white/5 rounded-lg p-3 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-brand-teal" />
                    <span className="text-sm font-semibold text-white">
                      <Highlighter color="#03c9a9" action="highlight">
                        Buy me a coffee
                      </Highlighter>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-brand-darknavy/50 rounded px-3 py-2 border border-brand-teal/20">
                    <code className="text-xs text-brand-teal font-mono">{ethAddress}</code>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="text-gray-400 hover:text-brand-teal transition-colors shrink-0"
                      title="Copy address"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {copied && (
                  <p className="text-xs text-brand-teal mt-2 font-semibold animate-fade-in">
                    ✓ Address copied!
                  </p>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
