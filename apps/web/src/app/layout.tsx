// src/app/layout.tsx
// Root layout for Next.js App Router

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { PostHogErrorBoundary } from '@decebal/analytics/components/PostHogErrorBoundary'
import { PostHogErrorHandler } from '@decebal/analytics/components/PostHogErrorHandler'
import { PostHogPageView } from '@decebal/analytics/components/PostHogPageView'
import ScrollToTop from '@/components/ScrollToTop'
import TexturedBackground from '@/components/TexturedBackground'
import { Toaster as Sonner } from '@decebal/ui/sonner'
import { Toaster } from '@decebal/ui/toaster'
import { config } from '@/lib/personalConfig'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: `${config.name} - ${config.professional.title}`,
    template: `%s | ${config.name}`,
  },
  description: config.tagline,
  keywords: [
    'Fractional CTO',
    'Blockchain',
    'Web3',
    'TypeScript',
    'Rust',
    'Serverless',
    'VC-backed startups',
    'Technical Leadership',
    'AI Engineering',
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
