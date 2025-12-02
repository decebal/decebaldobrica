// src/app/layout.tsx
// Root layout for Next.js App Router

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import TexturedBackground from '@/components/TexturedBackground'
import { config } from '@/lib/personalConfig'
import { PostHogErrorBoundary } from '@decebal/analytics/components/PostHogErrorBoundary'
import { PostHogErrorHandler } from '@decebal/analytics/components/PostHogErrorHandler'
import { PostHogPageView } from '@decebal/analytics/components/PostHogPageView'
import { Toaster as Sonner } from '@decebal/ui/sonner'
import { Toaster } from '@decebal/ui/toaster'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: `${config.name} - ${config.professional.title}`,
    template: `%s | ${config.name}`,
  },
  description: config.tagline,
  keywords: [
    'Engineering Leader',
    'Full-Stack Architecture',
    'Team Growth',
    'SaaS Platforms',
    'AI Platforms',
    'TypeScript',
    'Rust',
    'Serverless',
    'Technical Leadership',
  ],
  authors: [{ name: config.name }],
  creator: config.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || config.website),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: `${config.name} - ${config.professional.title}`,
    title: `${config.name} - ${config.professional.title}`,
    description: config.tagline,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.name} - ${config.professional.title}`,
    description: config.tagline,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <PostHogErrorBoundary>
            <PostHogPageView />
            <PostHogErrorHandler />
            <ScrollToTop />
            <TexturedBackground />
            <Navbar />
            {children}
            <Toaster />
            <Sonner />
          </PostHogErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
