/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Disable font optimization during CI build to avoid network-related crashes
  optimizeFonts: process.env.CI !== 'true',
  images: {
    formats: ['image/avif', 'image/webp'],
    // Avoid macOS AppleDouble sidecars corrupting Next's generated image cache
    // when the development workspace lives on an external volume.
    unoptimized: process.env.NODE_ENV === 'development',
  },
  transpilePackages: ['@steelyes/gate-engine'],
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@resvg/resvg-js': false,
      }
    }
    return config
  },
  async redirects() {
    return [
      // Canonicalize non-www -> www (sitemap/robots.txt declare www as canonical).
      // Without this, steelyes.co.uk and www.steelyes.co.uk both serve 200 with
      // identical content and no way for search engines to pick one.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'steelyes.co.uk' }],
        destination: 'https://www.steelyes.co.uk/:path*',
        permanent: true,
      },
      // Legacy service URLs → current paths (fix GSC 404 errors)
      {
        source: '/services/glass-balustrades',
        destination: '/services/balconies',
        permanent: true,
      },
      {
        source: '/services/steel-structures',
        destination: '/services/structures',
        permanent: true,
      },
      {
        source: '/services/security-grills',
        destination: '/services/security',
        permanent: true,
      },
      {
        source: '/services/platforms',
        destination: '/services/staircases',
        permanent: true,
      },
      // Legacy legal page URLs
      {
        source: '/privacy',
        destination: '/legal/privacy-policy',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/legal/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/legal/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/legal/terms',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/legal/cookie-policy',
        permanent: true,
      },
      // Quote/configurator aliases
      {
        source: '/quote',
        destination: '/configurator',
        permanent: true,
      },
      {
        source: '/design',
        destination: '/configurator',
        permanent: true,
      },
      {
        source: '/builder',
        destination: '/configurator',
        permanent: true,
      },
      // Legacy gate URLs (underscore → hyphen)
      {
        source: '/gates/sliding',
        destination: '/gates/tracked-sliding',
        permanent: true,
      },
      {
        source: '/gates/cantilever-sliding',
        destination: '/gates/cantilever',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            // camera=(self) required for Quick Look / Scene Viewer AR handoff
            value: 'camera=(self), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
