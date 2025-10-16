import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AdminNav } from "@/components/AdminNav"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Newsletter Admin - Decebal Dobrica",
  description: "Newsletter management dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <AdminNav />
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
