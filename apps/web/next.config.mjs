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
