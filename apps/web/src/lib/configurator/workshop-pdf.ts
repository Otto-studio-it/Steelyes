import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { buildGateCutList, type GateConfig } from '@steelyes/gate-engine'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 48

export async function buildWorkshopCutListPdf(input: {
  config: GateConfig
  shareToken: string
}): Promise<Uint8Array> {
  const cutList = buildGateCutList(input.config)
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  page.drawText('Steelyes — Workshop cut list', {
    x: MARGIN,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  y -= 28

  page.drawText(`Reference: ${input.shareToken}`, { x: MARGIN, y, size: 10, font, color: rgb(0.35, 0.35, 0.35) })
  y -= 18
  page.drawText(`${cutList.widthMm} × ${cutList.heightMm} mm · ${cutList.gateType.replace(/_/g, ' ')}`, {
    x: MARGIN,
    y,
    size: 11,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })
  y -= 28

  page.drawText('Line items', { x: MARGIN, y, size: 13, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
  y -= 20

  for (const line of cutList.lines) {
    if (y < MARGIN + 40) break
    page.drawText(
      `${line.quantity}× ${line.profile} @ ${line.lengthMm}mm — ${line.role}${line.note ? ` (${line.note})` : ''}`,
      { x: MARGIN, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) },
    )
    y -= 14
  }

  y -= 10
  for (const note of cutList.notes) {
    if (y < MARGIN) break
    page.drawText(note, { x: MARGIN, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 12
  }

  return pdf.save()
}
