import { randomBytes } from 'crypto'

const SHARE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,50}$/

export function createShareToken(): string {
  return randomBytes(9).toString('base64url')
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
