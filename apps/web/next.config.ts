import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds - use task lint instead
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds for now
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Externalize native packages for server-side use with Turbopack/Bun
  serverExternalPackages: ['chromadb'],

  // Readable stack traces in PostHog error tracking. Off by default because it publishes the
  // source maps alongside the bundle - see docs/OBSERVABILITY.md for the posthog-cli upload
  // flow that gets symbolicated stacks without exposing them.
  productionBrowserSourceMaps: process.env.UPLOAD_SOURCEMAPS === 'true',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value:
              "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src 'self' https:",
          },
        ],
      },
    ]
  },
}

export default nextConfig
