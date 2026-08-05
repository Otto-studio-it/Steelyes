import { NextResponse } from 'next/server'

import { getArModel } from '@/lib/configurator/ar/ar-model-store'
import type { ArModelFormat } from '@/lib/configurator/ar/ar-handoff'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: { id: string }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type, Content-Disposition',
} as const

function parseModelId(raw: string): { id: string; format: ArModelFormat } | null {
  const match = /^([0-9a-f-]{36})\.(glb|usdz)$/i.exec(raw)
  if (!match) return null
  return {
    id: match[1]!,
    format: match[2]!.toLowerCase() as ArModelFormat,
  }
}

function modelResponse(entry: NonNullable<ReturnType<typeof getArModel>>, method: 'GET' | 'HEAD') {
  const headers = new Headers({
    'Content-Type': entry.contentType,
    'Content-Length': String(entry.bytes.byteLength),
    'Cache-Control': 'private, max-age=60, no-transform',
    'Content-Disposition': `inline; filename="steelyes-gate.${entry.format}"`,
    ...CORS_HEADERS,
  })

  if (method === 'HEAD') {
    return new NextResponse(null, { status: 200, headers })
  }

  return new NextResponse(new Uint8Array(entry.bytes), {
    status: 200,
    headers,
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function HEAD(_request: Request, context: RouteContext) {
  const parsed = parseModelId(context.params.id)
  if (!parsed) {
    return new NextResponse(null, { status: 404, headers: CORS_HEADERS })
  }

  const entry = getArModel(parsed.id)
  if (!entry || entry.format !== parsed.format) {
    return new NextResponse(null, {
      status: 410,
      headers: {
        ...CORS_HEADERS,
        'X-AR-Error': 'ar_model_expired',
      },
    })
  }

  return modelResponse(entry, 'HEAD')
}

export async function GET(_request: Request, context: RouteContext) {
  const parsed = parseModelId(context.params.id)
  if (!parsed) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS })
  }

  const entry = getArModel(parsed.id)
  if (!entry || entry.format !== parsed.format) {
    return NextResponse.json(
      { error: 'Model expired or missing — regenerate from View in your space.', code: 'ar_model_expired' },
      { status: 410, headers: CORS_HEADERS },
    )
  }

  return modelResponse(entry, 'GET')
}
