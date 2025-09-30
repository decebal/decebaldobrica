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
  webpack: (config, { isServer }) => {
    // Fix for better-sqlite3
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3',
    })

    // Ignore chromadb in client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        chromadb: false,
      }
    }

    // Ignore dynamic imports that cause issues
    config.ignoreWarnings = [
      { module: /node_modules\/chromadb/ },
      { module: /node_modules\/@langchain/ },
    ]

    return config
  },
}

export default nextConfig
