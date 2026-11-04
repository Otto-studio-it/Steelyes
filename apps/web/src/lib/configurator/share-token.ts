const SHARE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,50}$/

// Uses Web Crypto (available in browsers and Node 18+) instead of Node's `crypto` module:
// this file is imported by client components, and `import 'crypto'` made webpack bundle
// crypto-browserify + util polyfills, which call Function() and violate the CSP.
export function createShareToken(): string {
  const bytes = new Uint8Array(9)
  globalThis.crypto.getRandomValues(bytes)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  // 9 bytes -> 12 base64 chars, no padding; same format as Buffer#toString('base64url').
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_')
}

export function isValidShareToken(value: string): boolean {
  return SHARE_TOKEN_PATTERN.test(value)
}

export function buildQuoteSharePath(shareToken: string): string {
  return `/quote/${encodeURIComponent(shareToken)}`
}

export function buildContactHandoffPath(shareToken: string): string {
  return `/contact?shareToken=${encodeURIComponent(shareToken)}`
}

export function buildQuotePdfPath(shareToken: string): string {
  return `/api/quote/${encodeURIComponent(shareToken)}/pdf`
}

export function buildCutListPath(shareToken: string, format?: 'pdf'): string {
  const base = `/api/quote/${encodeURIComponent(shareToken)}/cut-list`
  return format === 'pdf' ? `${base}?format=pdf` : base
}

export function buildConfiguratorEditorPath(shareToken: string): string {
  return `/configurator?shareToken=${encodeURIComponent(shareToken)}`
}
