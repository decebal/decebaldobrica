// src/app/layout.tsx
// Root layout for Next.js App Router

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'John Doe - Portfolio',
    template: '%s | John Doe Portfolio',
  },
  description: 'Professional portfolio with AI chat assistant powered by Ollama',
  keywords: ['portfolio', 'AI', 'chat', 'Ollama', 'Solana Pay'],
  authors: [{ name: 'John Doe' }],
  creator: 'John Doe',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'John Doe Portfolio',
    title: 'John Doe - Portfolio',
    description: 'Professional portfolio with AI chat assistant',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Doe - Portfolio',
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
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
