import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import {
  INTAKE_QUESTIONS,
  INTAKE_SECTIONS,
  type IntakeAnswerStatus,
} from '@/lib/client-intake/questions'
import { formatAnswerValue, type IntakeProgress } from '@/lib/client-intake/progress'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 42
const LINE = 12

const STATUS_IT: Record<IntakeAnswerStatus, string> = {
  confirmed: 'Confermato',
  provisional: 'Provvisorio',
  proposed: 'Da confermare',
  missing: 'Mancante',
}

export type IntakeExportAnswer = {
  question_id: string
  value_json: unknown
  status: IntakeAnswerStatus
  source?: string
  updated_at?: string
}

export type IntakeExportInput = {
  clientName: string
  sessionStatus: string
  generatedAt: string
  progress: IntakeProgress
  answers: IntakeExportAnswer[]
}

export async function buildIntakeExportPdf(input: IntakeExportInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const ink = rgb(27 / 255, 28 / 255, 26 / 255)
  const muted = rgb(100 / 255, 100 / 255, 100 / 255)
  const accent = rgb(158 / 255, 0 / 255, 12 / 255)

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  const ensureSpace = (need: number) => {
    if (y - need < MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - MARGIN
    }
  }

  const drawWrapped = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; indent?: number },
  ) => {
    const size = opts.size ?? 9
    const useFont = opts.bold ? fontBold : font
    const color = opts.color ?? ink
    const indent = opts.indent ?? 0
    const maxWidth = PAGE_WIDTH - MARGIN * 2 - indent
    const words = text.split(/\s+/)
    let line = ''

    const flush = (chunk: string) => {
      ensureSpace(LINE + 2)
      page.drawText(chunk, {
        x: MARGIN + indent,
        y,
        size,
        font: useFont,
        color,
      })
      y -= LINE
    }

    for (const word of words) {
      const next = line ? `${line} ${word}` : word
      if (useFont.widthOfTextAtSize(next, size) > maxWidth && line) {
        flush(line)
        line = word
      } else {
        line = next
      }
    }
    if (line) flush(line)
  }

  page.drawText('STEELYES — Client intake', {
    x: MARGIN,
    y,
    size: 14,
    font: fontBold,
    color: accent,
  })
  y -= 18
  drawWrapped(`Cliente: ${input.clientName}`, { bold: true, size: 10 })
  drawWrapped(`Stato sessione: ${input.sessionStatus} · Generato: ${input.generatedAt}`, {
    size: 8,
    color: muted,
  })
  drawWrapped(
    `Progresso: ${input.progress.confirmed} confermati · ${input.progress.provisional} provvisori · ${input.progress.proposed} da confermare · ${input.progress.missing} mancanti · ${input.progress.blockingMissing} bloccanti aperti`,
    { size: 8, color: muted },
  )
  y -= 8

  const byId = new Map(input.answers.map((a) => [a.question_id, a]))

  for (const section of INTAKE_SECTIONS) {
    const qs = INTAKE_QUESTIONS.filter((q) => q.section === section.id)
    ensureSpace(28)
    page.drawText(section.title.toUpperCase(), {
      x: MARGIN,
      y,
      size: 10,
      font: fontBold,
      color: accent,
    })
    y -= 14
    drawWrapped(section.intro, { size: 8, color: muted })
    y -= 4

    for (const q of qs) {
      const answer = byId.get(q.id)
      const status = (answer?.status ?? 'missing') as IntakeAnswerStatus
      ensureSpace(36)
      drawWrapped(`${q.label}${q.blocking ? ' [BLOCCANTE]' : ''}`, { bold: true, size: 9 })
      drawWrapped(`Stato: ${STATUS_IT[status]}${answer?.source ? ` · fonte ${answer.source}` : ''}`, {
        size: 8,
        color: muted,
        indent: 8,
      })
      drawWrapped(formatAnswerValue(answer?.value_json ?? q.seed?.value ?? null), {
        size: 9,
        indent: 8,
      })
      y -= 6
    }
    y -= 4
  }

  return pdf.save()
}
