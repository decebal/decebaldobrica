'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/subscribers', label: 'Subscribers' },
  { href: '/interests', label: 'Plan Interests' },
  { href: '/compose', label: 'Compose' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/settings', label: 'Settings' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              📧 Newsletter Admin
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="https://decebaldobrica.com"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View Site →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
