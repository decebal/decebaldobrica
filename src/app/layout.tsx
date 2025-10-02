// src/app/layout.tsx
// Root layout for Next.js App Router

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import TexturedBackground from '@/components/TexturedBackground'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Decebal Dobrica - Portfolio',
    template: '%s | Decebal Dobrica Portfolio',
  },
  description: 'Professional portfolio with AI chat assistant powered by Ollama',
  keywords: ['portfolio', 'AI', 'chat', 'Ollama', 'Solana Pay'],
  authors: [{ name: 'Decebal Dobrica' }],
  creator: 'Decebal Dobrica',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Decebal Dobrica Portfolio',
    title: 'Decebal Dobrica - Portfolio',
    description: 'Professional portfolio with AI chat assistant',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decebal Dobrica - Portfolio',
    description: 'Professional portfolio with AI chat assistant',
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
          <ScrollToTop />
          <TexturedBackground />
          <Navbar />
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
