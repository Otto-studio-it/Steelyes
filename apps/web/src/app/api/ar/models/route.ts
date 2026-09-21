import { NextResponse } from 'next/server'

import { putArModel, arModelStoreBackendLabel } from '@/lib/configurator/ar/ar-model-store'
import {
  AR_MODEL_MAX_BYTES,
  AR_MODEL_TTL_SECONDS,
  isLocalOrPrivateArUrl,
  validateArModelBytes,
  type ArModelFormat,
} from '@/lib/configurator/ar/ar-handoff'
import { env } from '@/lib/env'
import { checkRateLimit, clientKeyFromHeaders, RATE_LIMIT_MESSAGE, RATE_LIMITS } from '@/lib/security/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function resolvePublicOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  if (forwardedHost && !forwardedHost.includes('localhost')) {
    return `${forwardedProto ?? 'https'}://${forwardedHost}`
  }

  const coolifyUrl = process.env.COOLIFY_URL?.replace(/\/$/, '')
  if (coolifyUrl) return coolifyUrl

  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (siteUrl && !siteUrl.includes('localhost')) return siteUrl

  const host = request.headers.get('host')
  if (host && !host.includes('localhost')) {
    return `${forwardedProto ?? 'https'}://${host}`
  }

  return new URL(request.url).origin
}

async function readBodyCapped(request: Request, maxBytes: number): Promise<Uint8Array | null> {
  const reader = request.body?.getReader()
  if (!reader) return new Uint8Array()

  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return bytes
}

/** Upload a client-exported GLB/USDZ and get a short-lived HTTPS URL for native AR. */
export async function POST(request: Request) {
  const formatHeader = request.headers.get('x-ar-format')
  const format: ArModelFormat | null =
    formatHeader === 'usdz' || formatHeader === 'glb' ? formatHeader : null
  if (!format) {
    return NextResponse.json({ error: 'x-ar-format must be glb or usdz' }, { status: 400 })
  }

  const limit = checkRateLimit(RATE_LIMITS.arUpload, clientKeyFromHeaders(request.headers))
  if (!limit.ok) {
    return NextResponse.json(
      { error: RATE_LIMIT_MESSAGE, code: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  // Never buffer more than the cap, whether or not the client declares a Content-Length.
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > AR_MODEL_MAX_BYTES) {
    return NextResponse.json({ error: 'Model file is too large' }, { status: 413 })
  }
  const bytes = await readBodyCapped(request, AR_MODEL_MAX_BYTES)
  if (!bytes) {
    return NextResponse.json({ error: 'Model file is too large' }, { status: 413 })
  }
  const validationError = validateArModelBytes(format, bytes)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const entry = putArModel(format, bytes)
  const origin = resolvePublicOrigin(request)
  const url = `${origin}/api/ar/models/${entry.id}.${format}`

  return NextResponse.json({
    id: entry.id,
    format,
    url,
    expiresAt: entry.expiresAt,
    expiresInSeconds: AR_MODEL_TTL_SECONDS,
    phoneReachable: !isLocalOrPrivateArUrl(url),
  })
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    store: arModelStoreBackendLabel(),
    ttlSeconds: AR_MODEL_TTL_SECONDS,
  })
}
