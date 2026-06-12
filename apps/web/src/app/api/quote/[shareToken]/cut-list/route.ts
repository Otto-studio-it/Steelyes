import { NextResponse } from 'next/server'

import { buildGateCutList, serializeCutListCsv } from '@steelyes/gate-engine'

import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { isValidShareToken } from '@/lib/configurator/share-token'
import { buildWorkshopCutListPdf } from '@/lib/configurator/workshop-pdf'

export async function GET(
  request: Request,
  context: { params: { shareToken: string } },
): Promise<NextResponse> {
  const { shareToken } = context.params

  if (!isValidShareToken(shareToken)) {
    return NextResponse.json({ error: 'Invalid share token' }, { status: 400 })
  }

  const config = await loadGateConfigurationByShareToken(shareToken)
  if (!config) {
    return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
  }

  const url = new URL(request.url)
  const format = url.searchParams.get('format')

  if (format === 'pdf') {
    const pdf = await buildWorkshopCutListPdf({ config, shareToken })
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="steelyes-workshop-${shareToken}.pdf"`,
      },
    })
  }

  const csv = serializeCutListCsv(buildGateCutList(config))
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="steelyes-cut-list-${shareToken}.csv"`,
    },
  })
}
