import Link from 'next/link'
import type { ReactNode } from 'react'

export default function ServicePage({
  title,
  intro,
  children,
  relatedHref,
  relatedLabel,
}: {
  title: string
  intro: string
  children: ReactNode
  relatedHref: string
  relatedLabel: string
}) {
  return (
    <main className="mx-auto max-w-[960px] px-7 pb-20 pt-20 md:pt-24">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-rust-ink-soft">
        <Link href="/" className="underline underline-offset-4">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href="/#services" className="underline underline-offset-4">
          Services
        </Link>
      </nav>
      <header className="border-b border-rust-line pb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-rust-primary-2">
          Work directly with Decebal Dobrica
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-rust-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-[760px] text-lg leading-8 text-rust-ink-soft">{intro}</p>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-md bg-rust-primary px-5 py-3 font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust-primary"
        >
          Discuss your codebase
        </Link>
      </header>
      <article className="max-w-[760px] space-y-10 py-10 text-base leading-8 text-rust-ink-soft [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-rust-ink [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-6 [&_a]:text-rust-primary-2 [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </article>
      <aside className="rounded-xl border border-rust-line bg-rust-surface p-6">
        <h2 className="text-xl font-bold text-rust-ink">Choose the next step</h2>
        <p className="mt-3 leading-7 text-rust-ink-soft">
          Start with the decision you need to make, the system involved and the evidence available.
          Share a non-confidential summary first. Access and scope are agreed before repository
          review.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-rust-primary-2">
          <Link href="/contact" className="underline underline-offset-4">
            Send a project brief
          </Link>
          <Link href={relatedHref} className="underline underline-offset-4">
            {relatedLabel}
          </Link>
          <Link href="/#engagements" className="underline underline-offset-4">
            Read the engagement summaries
          </Link>
        </div>
      </aside>
    </main>
  )
}
