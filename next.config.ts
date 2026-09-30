import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Keep production builds from overwriting the running local preview.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  async headers() {
    return [
      // Anti-embed: prevent iframing on any domain except our own
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
      // Game HTML/JS entry points — always revalidate so updates reach players immediately
      {
        source: '/game',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/game/index.html',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      // Static assets (CSS) — 1 year immutable
      {
        source: '/game/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // JS specifically always revalidates — more specific match applied after,
      // so it overrides the immutable rule above for this path.
      {
        source: '/game/assets/js/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ]
  },
}

export default nextConfig
