// src/app/contact/page.tsx
// Contact page with AI chat

import ChatInterfaceAI from '@/components/ChatInterfaceAI'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch via AI chat assistant or traditional contact methods',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-8">
        <div className="w-full max-w-3xl px-4 mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-brand-heading mb-2">Let's Connect</h1>
            <p className="text-gray-300">
              Chat with my AI assistant to learn more about my work or schedule a meeting
            </p>
          </div>
          <ChatInterfaceAI />
        </div>
      </main>

      <Footer />
    </div>
  )
}
