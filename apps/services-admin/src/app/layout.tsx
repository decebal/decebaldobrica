import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AdminHeader } from '@/components/AdminHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Services Admin - Decebal Dobrica',
  description: 'Services & pricing management dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
