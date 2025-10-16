import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get('title') || 'Decebal Dobrica'
    const subtitle = searchParams.get('subtitle') || ''
    const author = searchParams.get('author') || 'Decebal Dobrica'
    const date = searchParams.get('date') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a1929',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1a2332 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a2332 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? '60px' : '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: subtitle ? '20px' : '40px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: '32px',
                color: '#94a3b8',
                lineHeight: 1.4,
                marginBottom: '40px',
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '40px',
              }}
            >
              {tags.slice(0, 3).map((tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#03c9a9',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '24px',
                    fontWeight: 500,
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '28px',
                color: '#94a3b8',
              }}
            >
              {author}
            </div>
            {date && (
              <div
                style={{
                  fontSize: '28px',
                  color: '#64748b',
                }}
              >
                {date}
              </div>
            )}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
