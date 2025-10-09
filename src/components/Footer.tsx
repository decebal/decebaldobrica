'use client'

import { Highlighter } from '@/components/ui/highlighter'
import { config } from '@/lib/personalConfig'
import { Coffee, Copy, Github, Linkedin, Mail, MapPin, Twitter } from 'lucide-react'
import React, { useState } from 'react'

const Footer = () => {
  const [copied, setCopied] = useState(false)

  const ethAddress = (config as any).ethAddress || 'decebaldobrica.eth'

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
              <li className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="h-5 w-5 text-brand-teal" />
                  <span className="text-sm font-semibold text-white">
                    <Highlighter color="#03c9a9" action="highlight">
                      Buy me a coffee
                    </Highlighter>
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 group">
                  <code className="text-xs text-brand-teal font-mono flex-1">{ethAddress}</code>
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-brand-teal transition-colors shrink-0"
                    title="Copy address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {copied && <p className="text-xs text-brand-teal mt-1">✓ Address copied!</p>}
                <p className="text-xs text-gray-500 mt-2">
                  Send ETH or ERC-20 tokens to support my work ☕
                </p>
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
