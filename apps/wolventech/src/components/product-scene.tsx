export function ProductScene({ cell, label }: { cell: number; label: string }) {
  return (
    <div role="img" aria-label={label} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1', maxWidth: 280, margin: '0 auto 24px', borderRadius: 16, background: '#f5f1e8' }}>
      {/* One cached static atlas; no WebGL or client runtime. */}
      <img src="/images/products/scenes-20260924.webp" alt="" width={1448} height={1086} loading="lazy" decoding="async" style={{ position: 'absolute', width: '400%', height: '300%', maxWidth: 'none', left: `${-(cell % 4) * 100}%`, top: `${-Math.floor(cell / 4) * 100}%` }} />
    </div>
  )
}
