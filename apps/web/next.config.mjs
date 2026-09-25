const BASE_SECURITY_HEADERS = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    // camera=(self) required for Quick Look / Scene Viewer AR handoff
    value: 'camera=(self), microphone=(), geolocation=()',
  },
];

/**
 * Partner sites allowed to iframe /embed/*: space- or comma-separated origins in
 * EMBED_ALLOWED_ORIGINS (e.g. "https://partner.co.uk https://www.partner.co.uk").
 * Unset = 'self' only, i.e. third-party embedding stays off until a partner is configured.
 */
const EMBED_FRAME_ANCESTORS = [
  "'self'",
  ...(process.env.EMBED_ALLOWED_ORIGINS ?? '')
    .split(/[\s,]+/)
    .filter((origin) => /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(origin)),
].join(' ');

/**
 * Report-only for now: violations are logged by /api/csp-report without breaking the site.
 * Next.js inlines bootstrap scripts, so script-src keeps 'unsafe-inline' until nonces are wired;
 * the policy still pins external script / frame / connect origins and blocks plugins and <base>.
 * Promote to `Content-Security-Policy` once the report log is quiet.
 */
function buildContentSecurityPolicy(frameAncestors) {
  const supabaseOrigin = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin;
    } catch {
      return '';
    }
  })();
  const dev = process.env.NODE_ENV !== 'production';

  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''} https://consent.cookiebot.com https://consentcdn.cookiebot.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://imgsct.cookiebot.com https://steelyes-foto.lon1.cdn.digitaloceanspaces.com",
    "media-src 'self' https://steelyes-foto.lon1.cdn.digitaloceanspaces.com",
    "font-src 'self' data:",
    `connect-src 'self' ${supabaseOrigin} https://consent.cookiebot.com https://consentcdn.cookiebot.com${dev ? ' ws: wss:' : ''}`.replace(/\s+/g, ' '),
    'frame-src https://challenges.cloudflare.com https://consentcdn.cookiebot.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    'report-uri /api/csp-report',
  ].join('; ');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Disable font optimization during CI build to avoid network-related crashes
  optimizeFonts: process.env.CI !== 'true',
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'steelyes-foto.lon1.cdn.digitaloceanspaces.com',
      },
    ],
    // Avoid macOS AppleDouble sidecars corrupting Next's generated image cache
    // when the development workspace lives on an external volume.
    unoptimized: process.env.NODE_ENV === 'development',
  },
  transpilePackages: ['@steelyes/gate-engine'],
  poweredByHeader: false,
  experimental: {
    // Native ELF binaries must stay out of the Webpack graph. Coolify/nixpacks
    // builds on main failed with "Module parse failed" on @resvg .node files.
    serverComponentsExternalPackages: ['@resvg/resvg-js', 'sharp'],
    outputFileTracingIncludes: {
      '/api/**/*': [
        './node_modules/@resvg/resvg-js/**/*',
        './node_modules/@resvg/resvg-js-linux-x64-gnu/**/*',
        '../../node_modules/@resvg/resvg-js/**/*',
        '../../node_modules/@resvg/resvg-js-linux-x64-gnu/**/*',
        './node_modules/sharp/**/*',
        '../../node_modules/sharp/**/*',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      type: 'asset/resource',
    })

    const externals = ['@resvg/resvg-js', 'sharp']
    const previous = config.externals
    config.externals = [
      ...(Array.isArray(previous) ? previous : previous ? [previous] : []),
      ({ request }, callback) => {
        if (
          typeof request === 'string' &&
          externals.some((pkg) => request === pkg || request.startsWith(`${pkg}/`))
        ) {
          return callback(null, `commonjs ${request}`)
        }
        callback()
      },
    ]

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@resvg/resvg-js': false,
        sharp: false,
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
      // Everything except the partner embed: never framed by other sites.
      {
        source: '/((?!embed/).*)',
        headers: [
          ...BASE_SECURITY_HEADERS,
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy-Report-Only', value: buildContentSecurityPolicy("'self'") },
        ],
      },
      // /embed/* is loaded in an iframe by partner sites (public/embed-snippet.js). X-Frame-Options
      // cannot express an allowlist, so framing is controlled by an ENFORCED frame-ancestors here.
      {
        source: '/embed/:path*',
        headers: [
          ...BASE_SECURITY_HEADERS,
          { key: 'Content-Security-Policy', value: `frame-ancestors ${EMBED_FRAME_ANCESTORS}` },
          { key: 'Content-Security-Policy-Report-Only', value: buildContentSecurityPolicy(EMBED_FRAME_ANCESTORS) },
        ],
      },
    ];
  },
};

export default nextConfig;
