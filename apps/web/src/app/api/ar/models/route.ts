import { NextResponse } from 'next/server'

import { putArModel } from '@/lib/configurator/ar/ar-model-store'
import {
  AR_MODEL_TTL_SECONDS,
  isLocalOrPrivateArUrl,
  validateArModelBytes,
  type ArModelFormat,
} from '@/lib/configurator/ar/ar-handoff'
import { env } from '@/lib/env'

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

/** Upload a client-exported GLB/USDZ and get a short-lived HTTPS URL for native AR. */
export async function POST(request: Request) {
  const formatHeader = request.headers.get('x-ar-format')
  const format: ArModelFormat | null =
    formatHeader === 'usdz' || formatHeader === 'glb' ? formatHeader : null
  if (!format) {
    return NextResponse.json({ error: 'x-ar-format must be glb or usdz' }, { status: 400 })
  }

  const buffer = await request.arrayBuffer()
  const bytes = new Uint8Array(buffer)
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
    store: 'ephemeral',
    ttlSeconds: AR_MODEL_TTL_SECONDS,
  })
}
