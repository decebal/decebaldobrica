import { terminalManifest } from '@/lib/content'
import { cn } from '@decebal/ui/lib/utils'

export default function TerminalManifest({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Wolven Tech manifest"
      className={cn(
        'overflow-hidden rounded-2xl border border-rust-line bg-rust-surface shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-rust-line bg-rust-elevated px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 mono text-xs tracking-wide text-rust-muted">
          ~/wolven-tech — cargo manifest
        </span>
      </div>
      <div className="mono px-5 py-5 text-[13px] leading-relaxed text-rust-ink-soft">
        <pre className="m-0 whitespace-pre-wrap break-words">
          {terminalManifest.map((line, idx) => {
            const key = `term-${idx}`
            if (line.type === 'blank') return <div key={key}>{'\u00A0'}</div>
            if (line.type === 'comment')
              return (
                <div key={key} className="text-rust-muted">
                  {line.text}
                </div>
              )
            if (line.type === 'section')
              return (
                <div key={key} className="text-[#ff8a65]">
                  {line.text}
                </div>
              )
            if (line.type === 'prompt')
              return (
                <div key={key}>
                  <span className="text-rust-amber">$</span>
                  <span className="text-rust-ink-soft"> cargo build --release</span>
                  <span className="text-rust-muted"> # and we&rsquo;ll ship it.</span>
                </div>
              )
            return (
              <div key={key}>
                <span className="text-[#90caf9]">{line.key}</span>
                <span className="text-rust-ink-soft"> = </span>
                <span className="text-[#a5d6a7]">{line.value}</span>
              </div>
            )
          })}
        </pre>
      </div>
    </aside>
  )
}
