// src/app/contact/page.tsx
// Contact page with AI chat

import ChatInterfaceAI from '@/components/ChatInterfaceAI'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch via AI chat assistant or traditional contact methods',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Chat with my AI assistant to schedule a meeting or ask questions
          </p>
        </div>

        {/* AI Chat Interface */}
        <div className="mb-12">
          <ChatInterfaceAI />
        </div>

        {/* Traditional Contact Info */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Other Ways to Reach Me</h2>
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:hello@example.com" className="text-brand-teal hover:underline">
                hello@example.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">LinkedIn</h3>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-teal hover:underline"
              >
                /in/johndoe
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">GitHub</h3>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-teal hover:underline"
              >
                @johndoe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
