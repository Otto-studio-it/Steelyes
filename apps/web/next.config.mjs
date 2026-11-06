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
 * Stricter CSP with better protection against XSS and injection attacks.
 * 
 * Script policy: 'unsafe-inline' is kept for compatibility with:
 * - Cloudflare Turnstile (challenge iframe injects inline scripts)
 * - Next.js bootstrap and hydration (inlines framework chunks)
 * - JSON-LD structured data (inline <script type="application/ld+json">)
 * - Google Consent Mode default state (inline script in <head>)
 * 
 * Full nonce-based CSP would require:
 * 1. Middleware to generate per-request nonces
 * 2. Passing nonces to all inline scripts including Next.js chunks (complex in App Router)
 * 3. Reconfiguring Turnstile to work with strict-dynamic (may not be supported)
 * 
 * Current policy enforces:
 * - No eval (except in dev for HMR)
 * - External scripts pinned to trusted origins (Turnstile, Google when enabled)
 * - No plugins, no data: URIs in scripts
 * - Form actions restricted to same origin
 * - Base URI locked to prevent base tag hijacking
 * 
 * This policy is ENFORCED (not Report-Only) because:
 * - It blocks major attack vectors (plugins, external scripts, base tag)
 * - unsafe-inline is required for existing functionality but still provides meaningful protection
 * - CSP violation reports are logged for monitoring
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
  const googleAdsEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim());

  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    dev ? "'unsafe-eval'" : '',
    'https://challenges.cloudflare.com',
    googleAdsEnabled ? 'https://www.googletagmanager.com' : '',
  ].filter(Boolean).join(' ');

  const connectSources = [
    "'self'",
    supabaseOrigin,
    googleAdsEnabled ? 'https://www.google-analytics.com' : '',
    googleAdsEnabled ? 'https://analytics.google.com' : '',
    googleAdsEnabled ? 'https://www.googletagmanager.com' : '',
    dev ? 'ws: wss:' : '',
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ');

  const imgSources = [
    "'self'",
    'data:',
    'blob:',
    'https://steelyes-foto.lon1.cdn.digitaloceanspaces.com',
    googleAdsEnabled ? 'https://www.google.com' : '',
    googleAdsEnabled ? 'https://www.google.co.uk' : '',
    googleAdsEnabled ? 'https://googleads.g.doubleclick.net' : '',
  ].filter(Boolean).join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSources}`,
    "media-src 'self' https://steelyes-foto.lon1.cdn.digitaloceanspaces.com",
    "font-src 'self' data:",
    `connect-src ${connectSources}`,
    'frame-src https://challenges.cloudflare.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    'upgrade-insecure-requests',
    'report-uri /api/csp-report',
  ].join('; ');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
  // Native ELF binaries must stay out of the Webpack graph. Coolify/nixpacks
  // builds on main failed with "Module parse failed" on @resvg .node files.
  serverExternalPackages: ['@resvg/resvg-js', 'sharp'],
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
  experimental: {
    // Reserved for future experimental features
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
        // Prevent vm browserify polyfill from being bundled (uses eval, breaks CSP).
        // Server-only code (API routes, server actions) should not leak to client.
        vm: false,
        'vm-browserify': false,
      }
      config.resolve.fallback = {
        ...config.resolve.fallback,
        vm: false,
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
          { key: 'Content-Security-Policy', value: buildContentSecurityPolicy("'self'") },
        ],
      },
      // /embed/* is loaded in an iframe by partner sites (public/embed-snippet.js). X-Frame-Options
      // cannot express an allowlist, so framing is controlled by an ENFORCED frame-ancestors here.
      {
        source: '/embed/:path*',
        headers: [
          ...BASE_SECURITY_HEADERS,
          { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(EMBED_FRAME_ANCESTORS) },
        ],
      },
    ];
  },
};

export default nextConfig;
