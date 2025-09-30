// src/app/page.tsx
// Homepage - Server Component example

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-4 py-24 md:py-32">
        <div className="flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-brand-teal to-brand-purple bg-clip-text text-transparent">
              John Doe
            </span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Full-stack developer specializing in modern web applications, AI integration, and
            blockchain technology.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/work">
            <Button size="lg" variant="outline">
              View Work
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 mt-8">
          <Link
            href="https://github.com"
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link
            href="mailto:hello@example.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-xl font-bold">AI Chat Assistant</h3>
            <p className="text-muted-foreground">
              Powered by Ollama - completely free and runs locally. Context-aware responses about
              my work and services.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-xl font-bold">Meeting Scheduler</h3>
            <p className="text-muted-foreground">
              Book meetings directly through the AI chat. Integrated with Google Calendar and email
              notifications.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-xl font-bold">Crypto Payments</h3>
            <p className="text-muted-foreground">
              Accept Solana payments for premium consultations. Fast, secure, and low-fee
              transactions.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
