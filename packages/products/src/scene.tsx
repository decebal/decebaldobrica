const ATLAS_COLUMNS = 4
const ATLAS_ROWS = 4
const ATLAS_WIDTH = 1448
const ATLAS_HEIGHT = 1448

export function ProductScene({ cell, label }: { cell: number; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '1',
        maxWidth: 280,
        margin: '0 auto 24px',
        borderRadius: 16,
        background: '#f5f1e8',
      }}
    >
      <img
        src="/images/products/scenes-20261008.webp"
        alt=""
        width={ATLAS_WIDTH}
        height={ATLAS_HEIGHT}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          width: `${ATLAS_COLUMNS * 100}%`,
          height: `${ATLAS_ROWS * 100}%`,
          maxWidth: 'none',
          left: `${-(cell % ATLAS_COLUMNS) * 100}%`,
          top: `${-Math.floor(cell / ATLAS_COLUMNS) * 100}%`,
        }}
      />
    </div>
  )
}
