import { BarChart, Briefcase, FileText, PenTool } from 'lucide-react'
import Link from 'next/link'

interface ServiceLink {
  href: string
  icon: React.ReactNode
  label: string
  description: string
}

const serviceLinks: ServiceLink[] = [
  {
    href: '/services',
    icon: <Briefcase className="h-5 w-5" />,
    label: 'All Services',
    description: 'View all offerings',
  },
  {
    href: '/services/case-studies',
    icon: <BarChart className="h-5 w-5" />,
    label: 'Case Studies',
    description: 'B2B success stories',
  },
  {
    href: 'https://github.com/decebal',
    icon: <FileText className="h-5 w-5" />,
    label: 'Portfolio',
    description: 'GitHub projects',
  },
]

interface ServicesNavigationProps {
  currentPath?: string
}

export default function ServicesNavigation({ currentPath }: ServicesNavigationProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-4">
      <div className="section-container">
        <nav className="flex flex-wrap justify-center gap-2 md:gap-4">
          {serviceLinks.map((link) => {
            const isActive = currentPath === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-teal text-white'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400'}>{link.icon}</span>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold">{link.label}</div>
                  <div className="text-xs opacity-75">{link.description}</div>
                </div>
                <div className="md:hidden text-sm font-semibold">{link.label}</div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
