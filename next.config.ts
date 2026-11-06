import type { NextConfig } from 'next'

// The GitHub Pages workflow sets this. Pages serves a static export from a sub-path.
const pagesBasePath = process.env.PAGES_BASE_PATH
// Cloudflare Workers Builds sets WORKERS_CI. DEPLOY_ADAPTER=cloudflare forces a Cloudflare build elsewhere.
const isCloudflare = Boolean(process.env.WORKERS_CI) || process.env.DEPLOY_ADAPTER === 'cloudflare'

const nextConfig: NextConfig = {
  // OpenNext bundles the standalone output, so `opennextjs-cloudflare build --skipNextBuild` reuses this build.
  output: pagesBasePath !== undefined ? 'export' : isCloudflare ? 'standalone' : undefined,
  basePath: pagesBasePath,
  images: {
    // GitHub Pages has no image optimizer. On Cloudflare, optimization needs an Images binding (see README).
    unoptimized: pagesBasePath !== undefined || isCloudflare,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      }
    ],
  },
  async headers() {
    // these are also defined in the root layout since github pages doesn't support headers
    const headers = [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self'",
      },
    ];
    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
};

export default nextConfig