import { NextResponse } from 'next/server'

import { AR_MODEL_CONTENT_TYPES, parseArModelFile, type ArModelFormat } from '@/lib/configurator/ar/ar-handoff'
import { exportGateArModel } from '@/lib/configurator/ar/export-gate-ar-model'
import { gateConfigFromConfigurationRow } from '@/lib/configurator/configuration-db'
import { createTtlLru } from '@/lib/server/ttl-lru'
import { checkRateLimit, clientKeyFromHeaders, RATE_LIMIT_MESSAGE, RATE_LIMITS } from '@/lib/security/rate-limit'
import { getServiceRoleClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: { file: string }
}

/** Quick Look / Scene Viewer fetch from outside the page origin. */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type, Content-Disposition',
} as const

/**
 * A saved configuration never changes, so its model is stable for the life of the process.
 * Viewers issue HEAD + GET (+ retries) back to back — a small LRU absorbs those.
 */
const cache = createTtlLru<Uint8Array>({ maxEntries: 60 })

function errorResponse(status: number, error: string, method: 'GET' | 'HEAD', extra?: Record<string, string>) {
  const headers = { ...CORS_HEADERS, ...extra }
  return method === 'HEAD'
    ? new NextResponse(null, { status, headers })
    : NextResponse.json({ error }, { status, headers })
}

async function loadModel(shareToken: string, format: ArModelFormat): Promise<Uint8Array | null> {
  const key = `${shareToken}.${format}`
  const cached = cache.get(key)
  if (cached) return cached

  const supabase = getServiceRoleClient()
  const { data: row, error } = await supabase
    .from('configurations')
    .select('*')
    .eq('share_token', shareToken)
    .maybeSingle()
  if (error) throw error
  if (!row) return null

  const { bytes } = await exportGateArModel(gateConfigFromConfigurationRow(row), format)
  cache.set(key, bytes)
  return bytes
}

async function handle(request: Request, context: RouteContext, method: 'GET' | 'HEAD') {
  const parsed = parseArModelFile(context.params.file)
  if (!parsed) return errorResponse(404, 'Not found', method)

  const limit = checkRateLimit(RATE_LIMITS.arModel, clientKeyFromHeaders(request.headers))
  if (!limit.ok) {
    return errorResponse(429, RATE_LIMIT_MESSAGE, method, { 'Retry-After': String(limit.retryAfterSeconds) })
  }

  let bytes: Uint8Array | null
  try {
    bytes = await loadModel(parsed.shareToken, parsed.format)
  } catch (error) {
    console.error('AR model build failed:', error)
    return errorResponse(500, 'Could not build the 3D model.', method)
  }
  if (!bytes) return errorResponse(404, 'Saved design not found.', method)

  const headers = new Headers({
    'Content-Type': AR_MODEL_CONTENT_TYPES[parsed.format],
    'Content-Length': String(bytes.byteLength),
    'Content-Disposition': `inline; filename="steelyes-gate.${parsed.format}"`,
    'Cache-Control': 'public, max-age=300, no-transform',
    ...CORS_HEADERS,
  })

  return new NextResponse(method === 'HEAD' ? null : new Blob([bytes as BlobPart]), { status: 200, headers })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
  })
}

export async function HEAD(request: Request, context: RouteContext) {
  return handle(request, context, 'HEAD')
}

export async function GET(request: Request, context: RouteContext) {
  return handle(request, context, 'GET')
}
