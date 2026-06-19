// Ambient, non-interactive backdrop for the radar hero.
//
// Hybrid-render strategy: this is the CSS/canvas-style layer that gives the
// surface its "canvas" feel (glow, faint grid texture, vignette). It is FIXED
// behind the SVG and deliberately does NOT track the pan/zoom transform, which
// sidesteps the two-layers-out-of-sync trap entirely. The interactive blips
// live in the SVG above and stay focusable DOM nodes.

const gridStyle: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px),' +
    'linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)',
  backgroundSize: '44px 44px',
  maskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, black 30%, transparent 78%)',
  WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, black 30%, transparent 78%)',
}

export default function RadarBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-slate-950" />
      {/* central glow — the "energy" under the radar */}
      <div
        className="absolute left-1/2 top-[44%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(16,185,129,0.10) 38%, transparent 70%)',
        }}
      />
      {/* faint grid texture */}
      <div className="absolute inset-0" style={gridStyle} />
      {/* vignette to focus the eye on the centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 95% 90% at 50% 45%, transparent 55%, rgba(2,6,23,0.85) 100%)',
        }}
      />
    </div>
  )
}
