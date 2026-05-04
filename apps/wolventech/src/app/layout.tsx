import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wolventech.io'

export const metadata: Metadata = {
  title: {
    default: 'Wolven Tech: Rust advisory for HFT, HPC & 24/7 platforms',
    template: '%s | Wolven Tech',
  },
  description:
    'Wolven Tech is a Rust-only technical advisory practice for HFT, prop trading, HPC, and 24/7 platforms where microseconds and state integrity matter. Event-sourced backends, Tokio/Axum systems, WASM modules, AI-agentic Rust. Founded and operated by Decebal Dobrica.',
  metadataBase: new URL(siteUrl),
  keywords: [
    'Rust advisory',
    'Fractional Rust architect',
    'High-frequency trading',
    'HFT',
    'Prop trading',
    'HPC',
    'Low-latency Rust',
    '24/7 platforms',
    'Event sourcing',
    'Embedded event store',
    'AllSource',
    'AllFrame',
    'Tokio',
    'Axum',
    'WASM',
    'MCP',
    'Tauri',
    'Technical due diligence',
    'Decebal Dobrica',
  ],
  authors: [{ name: 'Decebal Dobrica', url: 'https://decebaldobrica.com' }],
  creator: 'Decebal Dobrica',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Wolven Tech',
    title: 'Wolven Tech: Rust advisory for HFT, HPC & 24/7 platforms',
    description:
      'Rust-only advisory for HFT, prop trading, HPC, and 24/7 platforms. Event-sourced backends, Tokio/Axum systems, WASM, AI-agentic Rust. Founded by Decebal Dobrica.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wolven Tech: Rust advisory for HFT, HPC & 24/7 platforms',
    description:
      'Rust-only advisory for HFT, prop trading, HPC, and 24/7 platforms. Event-sourced backends, Tokio/Axum systems, WASM, AI-agentic Rust. Founded by Decebal Dobrica.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0d10',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} ${inter.className}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
