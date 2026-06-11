import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import {
  calculateIndicativeGatePrice,
  type GateConfig,
  type PricingCatalog,
  type PricingResult,
} from '@steelyes/gate-engine'

import {
  buildConfigurationSummaryLines,
  formatConfigurationSummaryText,
} from '@/lib/configurator/configuration-summary'
import { formatLabelText } from '@/lib/configurator/labels'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 48
const LINE_HEIGHT = 16

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

  drawLine('Steelyes — Indicative gate quote', { bold: true, size: 18, gap: 24 })
  drawLine(`Reference: ${shareToken}`, { size: 10, gap: 14 })
  drawLine(`View online: ${shareUrl}`, { size: 10, gap: 20 })

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
  drawLine(`${pricing.totalLabel} (${pricing.status === 'survey_required' ? 'survey required' : 'indicative'})`, {
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

  return pdf.save()
}

export function buildQuotePdfFilename(shareToken: string): string {
  return `steelyes-gate-quote-${shareToken}.pdf`
}

export function calculateQuotePricing(config: GateConfig, catalog: PricingCatalog): PricingResult {
  return calculateIndicativeGatePrice(config, catalog)
}
