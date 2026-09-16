import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib'
import QRCode from 'qrcode'
import {
  buildGateRenderPlan,
  calculateIndicativeGatePrice,
  type GateConfig,
  type GateRenderPlan,
  type GateRenderPrimitive,
  type PricingCatalog,
  type PricingResult,
} from '@steelyes/gate-engine'

import {
  buildConfigurationSummaryLines,
  formatConfigurationSummaryText,
} from '@/lib/configurator/configuration-summary'
import { rasterizeDesignMaster } from '@/lib/configurator/design-master-pdf'
import { formatLabelText } from '@/lib/configurator/labels'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 48
const LINE_HEIGHT = 16

// Render plans emit both hex and rgba() colors; alpha is carried separately
// by primitive.opacity, so only the RGB channels matter here.
function parseHexColor(color: string): ReturnType<typeof rgb> {
  const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgbaMatch) {
    return rgb(Number(rgbaMatch[1]) / 255, Number(rgbaMatch[2]) / 255, Number(rgbaMatch[3]) / 255)
  }

  const normalized = color.replace('#', '')
  const value = normalized.length === 3
    ? normalized
        .split('')
        .map((char) => char + char)
        .join('')
    : normalized
  const red = Number.parseInt(value.slice(0, 2), 16) / 255
  const green = Number.parseInt(value.slice(2, 4), 16) / 255
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255

  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    // Unknown color format — fall back to the ink colour instead of crashing.
    return rgb(27 / 255, 28 / 255, 26 / 255)
  }

  return rgb(red, green, blue)
}

function drawRenderPlanPreview(page: PDFPage, plan: GateRenderPlan, box: { x: number; y: number; width: number; height: number }) {
  const scale = Math.min(box.width / plan.width, box.height / plan.height)
  const originX = box.x
  const originY = box.y + box.height

  const toPdfY = (svgY: number, height = 0) => originY - svgY * scale - height * scale

  const drawPrimitive = (primitive: GateRenderPrimitive) => {
    if (primitive.kind === 'rect') {
      page.drawRectangle({
        x: originX + primitive.x * scale,
        y: toPdfY(primitive.y, primitive.height),
        width: primitive.width * scale,
        height: primitive.height * scale,
        borderWidth: (primitive.strokeWidth ?? 0) * scale * 0.5,
        borderColor: primitive.stroke ? parseHexColor(primitive.stroke) : undefined,
        color: primitive.fill && primitive.fill !== 'none' ? parseHexColor(primitive.fill) : undefined,
        opacity: primitive.opacity ?? 1,
      })
      return
    }

    if (primitive.kind === 'line') {
      page.drawLine({
        start: { x: originX + primitive.x1 * scale, y: toPdfY(primitive.y1) },
        end: { x: originX + primitive.x2 * scale, y: toPdfY(primitive.y2) },
        thickness: (primitive.strokeWidth ?? 1) * scale * 0.6,
        color: parseHexColor(primitive.stroke ?? '#1B1C1A'),
        opacity: primitive.opacity ?? 1,
      })
    }
  }

  for (const primitive of [...plan.background, ...plan.primitives]) {
    drawPrimitive(primitive)
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines.length > 0 ? lines : ['']
}

export async function buildIndicativeQuotePdf(input: {
  config: GateConfig
  pricing: PricingResult
  shareToken: string
  shareUrl: string
}): Promise<Uint8Array> {
  const { config, pricing, shareToken, shareUrl } = input
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  const drawLine = (text: string, options?: { bold?: boolean; size?: number; gap?: number }) => {
    const size = options?.size ?? 11
    const gap = options?.gap ?? LINE_HEIGHT
    const activeFont = options?.bold ? fontBold : font

    for (const line of wrapText(text, 88)) {
      if (y < MARGIN + 40) {
        page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = PAGE_HEIGHT - MARGIN
      }
      page.drawText(line, {
        x: MARGIN,
        y,
        size,
        font: activeFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      y -= gap
    }
  }

  drawLine('Steelyes — Estimated gate quote', { bold: true, size: 18, gap: 24 })
  drawLine(`Reference: ${shareToken}`, { size: 10, gap: 14 })
  drawLine(`View online: ${shareUrl}`, { size: 10, gap: 20 })

  try {
    const qrPng = await QRCode.toBuffer(shareUrl, { type: 'png', margin: 1, width: 180 })
    const qrImage = await pdf.embedPng(qrPng)
    page.drawImage(qrImage, {
      x: PAGE_WIDTH - MARGIN - 96,
      y: PAGE_HEIGHT - MARGIN - 96,
      width: 96,
      height: 96,
    })
    page.drawText('Scan for live config', {
      x: PAGE_WIDTH - MARGIN - 96,
      y: PAGE_HEIGHT - MARGIN - 108,
      size: 8,
      font,
      color: rgb(0.35, 0.35, 0.35),
    })
  } catch {
    // QR generation is best-effort only.
  }

  drawLine('Configuration summary', { bold: true, size: 13, gap: 18 })
  for (const line of buildConfigurationSummaryLines(config, pricing)) {
    drawLine(`${line.label}: ${line.value}`, { size: 10 })
  }

  y -= 8
  drawLine('Price breakdown', { bold: true, size: 13, gap: 18 })
  for (const item of pricing.breakdown) {
    const amount =
      item.amountGbp === null ? 'Price on request' : `£${item.amountGbp.toLocaleString('en-GB')}`
    drawLine(`${formatLabelText(item.label)} — ${amount}`, { size: 10 })
    if (item.note) {
      drawLine(item.note, { size: 9, gap: 12 })
    }
  }

  y -= 8
  drawLine(`${pricing.totalLabel} (${pricing.status === 'survey_required' ? 'survey required' : 'estimated'})`, {
    bold: true,
    size: 12,
    gap: 18,
  })

  drawLine(pricing.disclaimer, { size: 10 })
  drawLine(
    'This document is not a contract. Final pricing follows site survey and workshop confirmation.',
    { size: 10 },
  )
  drawLine(formatConfigurationSummaryText(config, pricing), { size: 9, gap: 12 })

  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  y = PAGE_HEIGHT - MARGIN
  drawLine('Design drawing', { bold: true, size: 16, gap: 22 })
  drawLine(`${config.widthMm} mm × ${config.heightMm} mm · ${config.gateType.split('_').join(' ')}`, { size: 10, gap: 16 })

  try {
    const master = rasterizeDesignMaster(config)
    const pngImage = await pdf.embedPng(master.png)
    const maxWidth = PAGE_WIDTH - MARGIN * 2
    const maxHeight = PAGE_HEIGHT - MARGIN * 2 - 90
    const scale = Math.min(maxWidth / pngImage.width, maxHeight / pngImage.height)
    const drawWidth = pngImage.width * scale
    const drawHeight = pngImage.height * scale
    page.drawImage(pngImage, {
      x: MARGIN + (maxWidth - drawWidth) / 2,
      y: MARGIN + 28,
      width: drawWidth,
      height: drawHeight,
    })
    page.drawText(
      `Design drawing · official master · ${master.slug.replace(/_/g, ' ')}`,
      {
        x: MARGIN,
        y: MARGIN + 10,
        size: 8,
        font,
        color: rgb(0.35, 0.35, 0.35),
      },
    )
  } catch {
    drawLine('Official master unavailable — schematic fallback.', { size: 9, gap: 14 })
    const renderPlan = buildGateRenderPlan(config, { viewMode: 'installation' })
    drawRenderPlanPreview(page, renderPlan, {
      x: MARGIN,
      y: MARGIN + 40,
      width: PAGE_WIDTH - MARGIN * 2,
      height: PAGE_HEIGHT - MARGIN * 2 - 80,
    })
  }

  return pdf.save()
}

export function buildQuotePdfFilename(shareToken: string): string {
  return `steelyes-gate-quote-${shareToken}.pdf`
}

export function calculateQuotePricing(config: GateConfig, catalog: PricingCatalog): PricingResult {
  return calculateIndicativeGatePrice(config, catalog)
}
