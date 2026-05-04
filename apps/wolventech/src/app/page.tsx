import SectionHeader from '@/components/SectionHeader'
import TerminalManifest from '@/components/TerminalManifest'
import {
  artifacts,
  cases,
  contactEmail,
  credentials,
  proofPoints,
  services,
  socialLinks,
  steps,
} from '@/lib/content'
import { Badge } from '@decebal/ui/badge'
import { Button } from '@decebal/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@decebal/ui/card'
import { ArrowUpRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <main id="top" className="pb-20">
      {/* ─────────── HERO ─────────── */}
      <section className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 px-7 pb-16 pt-20 md:grid-cols-[1.2fr_0.8fr] md:gap-14 md:pt-24">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-rust-primary-2">
            <span className="inline-flex items-center gap-2.5">
              <span className="h-[2px] w-[26px] rounded-sm bg-rust-primary" />
              Rust-only technical advisory
            </span>
            <Badge
              variant="outline"
              className="border-rust-primary/40 bg-rust-primary/10 text-[10px] tracking-[0.08em] text-rust-primary-2"
            >
              now open for engagements
            </Badge>
          </div>
          <h1 className="text-[clamp(36px,5.3vw,60px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-rust-ink">
            Rust systems, <span className="text-gradient-rust">shipped with intent</span>.
          </h1>
          <p className="mt-5 max-w-[620px] text-lg text-rust-ink-soft">
            Wolven Tech is a one-person, Rust-only advisory practice, built for HFT, prop trading,
            HPC, and 24/7 platforms where microseconds and state integrity matter. Event-sourced
            backends, Tokio/Axum services, WASM modules, AI-agentic Rust. Quiet, cheap, correct.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-rust-primary font-semibold text-white shadow-[0_10px_28px_-14px_rgba(206,66,43,0.7)] hover:bg-rust-primary-2"
            >
              <a href="#contact">Book a discovery call</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-rust-line bg-transparent text-rust-ink hover:bg-rust-elevated hover:text-rust-ink"
            >
              <a href="#engagements">See engagements</a>
            </Button>
          </div>
        </div>
        <TerminalManifest />
      </section>

      {/* ─────────── PROOF ─────────── */}
      <section aria-label="Proof points" className="mx-auto max-w-[1160px] px-7 py-14">
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {proofPoints.map((p) => (
            <div key={p.label} className="rounded-xl border border-rust-line bg-rust-surface p-5">
              <div className="text-[28px] font-extrabold tracking-tight text-rust-primary-2">
                {p.value}
              </div>
              <div className="mt-1.5 text-[13px] text-rust-ink-soft">{p.label}</div>
              <div className="mt-1 text-xs text-rust-muted">{p.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── SERVICES ─────────── */}
      <section id="services" className="mx-auto max-w-[1160px] scroll-mt-24 px-7 py-14">
        <SectionHeader
          kicker="Services"
          title="Four ways we engage."
          subtitle="Pick the shape that matches your constraint. Every engagement starts with a 30-minute discovery call and a written proposal. No surprises, no vapor."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((s) => (
            <Card
              key={s.title}
              className="border-rust-line bg-rust-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-rust-primary"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-rust-primary-2">
                  {s.kicker}
                </div>
                <CardTitle className="text-xl tracking-tight text-rust-ink">{s.title}</CardTitle>
                <CardDescription className="text-[14.5px] leading-relaxed text-rust-ink-soft">
                  {s.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {s.scope.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-rust-line-soft bg-rust-chip px-2.5 py-1 text-[11px] tracking-wide text-rust-ink-soft"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <p className="mt-3.5 border-t border-dashed border-rust-line-soft pt-3.5 text-[13px] text-rust-muted">
                  {s.price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─────────── ENGAGEMENTS ─────────── */}
      <section id="engagements" className="mx-auto max-w-[1160px] scroll-mt-24 px-7 py-14">
        <SectionHeader
          kicker="Engagements"
          title="Four production Rust platforms."
          subtitle="Three anonymized client engagements plus AllSource, our flagship embedded Rust event store. Client names and domains are held confidential; the technical facts are not."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <Card
              key={c.title}
              className="border-rust-line bg-gradient-to-b from-rust-surface to-rust-surface/60"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-rust-primary-2">
                  {c.tag}
                </div>
                <CardTitle className="text-[19px] tracking-tight text-rust-ink">
                  {c.title}
                </CardTitle>
                <CardDescription className="text-[14.5px] leading-relaxed text-rust-ink-soft">
                  {c.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2.5 border-t border-dashed border-rust-line-soft pt-3.5">
                  {c.facts.map((f) => (
                    <div key={`${c.title}-${f.l}`}>
                      <div className="text-[17px] font-bold text-rust-ink">{f.n}</div>
                      <div className="mt-0.5 text-[11.5px] text-rust-muted">{f.l}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.stack.map((t) => (
                    <span
                      key={`${c.title}-${t}`}
                      className="mono rounded-full border border-rust-line-soft bg-rust-chip px-2.5 py-[3px] text-[11px] text-rust-ink-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-rust-primary-2 hover:text-rust-amber"
                  >
                    {c.linkLabel ?? c.href}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─────────── ARTIFACTS ─────────── */}
      <section id="artifacts" className="mx-auto max-w-[1160px] scroll-mt-24 px-7 py-14">
        <SectionHeader
          kicker="Open source"
          title="Public artifacts."
          subtitle="Proof you can read. Every one of these is live on crates.io or GitHub, MIT-licensed where applicable."
        />
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {artifacts.map((a) => (
            <Card
              key={a.title}
              className="flex flex-col border-rust-line bg-rust-surface transition-all hover:-translate-y-0.5 hover:border-rust-primary"
            >
              <CardHeader className="space-y-2.5 pb-3">
                <Badge
                  variant="outline"
                  className="w-max border-rust-amber/30 bg-rust-amber/10 text-[11px] tracking-[0.12em] text-rust-amber"
                >
                  {a.badge}
                </Badge>
                <CardTitle className="text-[17px] text-rust-ink">{a.title}</CardTitle>
                <code className="mono text-xs text-rust-muted">{a.code}</code>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm leading-relaxed text-rust-ink-soft">{a.description}</p>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-rust-primary-2 hover:text-rust-amber"
                >
                  {a.linkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─────────── PROCESS ─────────── */}
      <section id="process" className="mx-auto max-w-[1160px] scroll-mt-24 px-7 py-14">
        <SectionHeader
          kicker="Process"
          title="How a Wolven Tech engagement runs."
          subtitle="No bloated discovery phase. No slide-ware deliverables. We're calibrated for teams that want to ship, not teams that want to plan to ship."
        />
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative rounded-xl border border-rust-line bg-rust-surface p-6"
            >
              <span className="absolute -top-3 left-5 rounded-full bg-rust-primary px-2.5 py-[3px] text-[12px] font-bold tracking-widest text-white">
                {step.num}
              </span>
              <h4 className="mt-2 text-[15px] font-semibold text-rust-ink">{step.title}</h4>
              <p className="mt-1 text-[13.5px] leading-relaxed text-rust-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── ABOUT ─────────── */}
      <section id="about" className="mx-auto max-w-[1160px] scroll-mt-24 px-7 py-14">
        <SectionHeader kicker="Operated by" title="Decebal Dobrica." />
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4 text-[15.5px] leading-relaxed text-rust-ink-soft">
            <p>
              Rust engineering leader with 15+ years of fintech, SaaS, and Web3 experience.
              Previously Technical Lead at Ebury, Software Architect at Tellimer, and fractional CTO
              across multiple founder-mode startups.
            </p>
            <p>
              I started Wolven Tech because the teams I most want to help (small, ambitious,
              technical) keep asking the same questions:{' '}
              <em>
                can Rust actually replace this TypeScript service? How do we event-source without
                drowning in ceremony? What does a staff-engineer-quality architecture review look
                like, in writing?
              </em>
            </p>
            <p>
              Wolven Tech is how I answer those questions professionally. One operator. Rust only.
              No subcontracting.
            </p>
            <p className="flex flex-wrap gap-x-3 gap-y-2 pt-2 text-sm">
              {socialLinks.map((s, i) => (
                <span key={s.href} className="flex items-center gap-3">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rust-primary-2 underline-offset-4 hover:text-rust-amber hover:underline"
                  >
                    {s.label}
                  </a>
                  {i < socialLinks.length - 1 ? <span className="text-rust-muted">·</span> : null}
                </span>
              ))}
            </p>
          </div>
          <aside className="rounded-2xl border border-rust-line bg-rust-surface p-6">
            <h4 className="text-[13px] font-bold uppercase tracking-[0.14em] text-rust-primary-2">
              Credentials
            </h4>
            <ul className="mt-3 space-y-2.5">
              {credentials.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm leading-relaxed text-rust-ink-soft"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-rust-primary-2" aria-hidden />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ─────────── CONTACT ─────────── */}
      <section
        id="contact"
        className="mx-auto mt-8 max-w-[1160px] scroll-mt-24 rounded-2xl border border-rust-line bg-[linear-gradient(120deg,rgba(206,66,43,0.12),rgba(255,166,87,0.08))] p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-[30px] font-extrabold tracking-tight text-rust-ink">
              Ready to talk Rust?
            </h2>
            <p className="mt-1.5 text-rust-ink-soft">
              Thirty minutes, no commitment. If it&rsquo;s a fit, you&rsquo;ll have a written
              proposal within 48 hours.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-rust-primary font-semibold text-white shadow-[0_10px_28px_-14px_rgba(206,66,43,0.7)] hover:bg-rust-primary-2"
          >
            <a href={`mailto:${contactEmail}?subject=Wolven%20Tech%20discovery`}>{contactEmail}</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
