import { NextResponse } from 'next/server'

import { checkRateLimit, clientKeyFromHeaders } from '@/lib/security/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const REPORT_LIMIT = { name: 'csp-report', limit: 20, windowMs: 10 * 60_000 }
const MAX_BODY_BYTES = 8 * 1024

function field(report: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = report[key]
    if (typeof value === 'string' && value) return value.slice(0, 200)
  }
  return ''
}

/**
 * Sink for Content-Security-Policy(-Report-Only) violations. Logs one compact line per report so
 * the policy can be tuned from the container logs before it is enforced. Never trusts the body.
 */
export async function POST(request: Request) {
  if (!checkRateLimit(REPORT_LIMIT, clientKeyFromHeaders(request.headers)).ok) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    const text = (await request.text()).slice(0, MAX_BODY_BYTES)
    const parsed = JSON.parse(text) as unknown
    const entry = Array.isArray(parsed) ? parsed[0] : parsed
    const wrapper = (entry ?? {}) as Record<string, unknown>
    const report = (wrapper['csp-report'] ?? wrapper.body ?? wrapper) as Record<string, unknown>

    console.warn(
      '[csp-report]',
      JSON.stringify({
        directive: field(report, 'effective-directive', 'effectiveDirective', 'violated-directive'),
        blocked: field(report, 'blocked-uri', 'blockedURL'),
        document: field(report, 'document-uri', 'documentURL'),
        source: field(report, 'source-file', 'sourceFile'),
      }),
    )
  } catch {
    // Malformed report — nothing to log.
  }

  return new NextResponse(null, { status: 204 })
}
