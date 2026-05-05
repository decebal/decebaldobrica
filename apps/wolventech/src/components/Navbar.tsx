import { navLinks } from '@/lib/content'
import { Button } from '@decebal/ui/button'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-rust-line bg-rust-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-rust-bg/75">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-7 py-4">
        <a
          href="/"
          aria-label="Wolven Tech home"
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-rust-ink hover:no-underline"
        >
          <span
            aria-hidden="true"
            className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-[#ce422b] to-[#ffa657] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />
          <span>
            <span className="text-rust-primary-2">wolven</span>
            <span>-tech</span>
          </span>
        </a>
        <nav aria-label="primary" className="hidden gap-6 text-sm text-rust-ink-soft md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-rust-amber hover:no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button
          asChild
          size="sm"
          className="bg-rust-primary font-semibold text-white hover:bg-rust-primary-2"
        >
          <a href="/contact">Book discovery</a>
        </Button>
      </div>
    </header>
  )
}
