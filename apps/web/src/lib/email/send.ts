import { Resend } from 'resend'

import { BUSINESS, PRICING_DISCLAIMER } from '@/lib/marketing/business'
import { env } from '@/lib/env'

/**
 * Single place for all transactional email. Sender/workshop addresses are
 * env-driven so the verified Resend domain can be swapped in without code
 * changes once DNS (SPF/DKIM/DMARC) is confirmed.
 */
const EMAIL_FROM = process.env.RESEND_FROM ?? 'Steelyes <info@steelyes.co.uk>'
/** Destination for all site leads / quote notifications (override with WORKSHOP_EMAIL). */
const WORKSHOP_EMAIL = process.env.WORKSHOP_EMAIL ?? BUSINESS.email

const BODY_STYLE = 'font-family:sans-serif;font-size:14px;line-height:1.6'
const FOOTNOTE_STYLE = 'color:#666;font-size:12px;margin-top:24px;font-family:sans-serif'

function emailShell(heading: string, bodyHtml: string): string {
  return `
  <h2 style="font-family:sans-serif">${heading}</h2>
  ${bodyHtml}
  <p style="${FOOTNOTE_STYLE}">${PRICING_DISCLAIMER}<br>
  Steelyes · ${BUSINESS.phoneDisplay} · ${BUSINESS.email}</p>
  `
}

/** Shell for internal ops notices (workshop inbox) — no customer pricing disclaimer. */
function internalEmailShell(heading: string, bodyHtml: string): string {
  return `
  <h2 style="font-family:sans-serif">${heading}</h2>
  ${bodyHtml}
  <p style="color:#999;font-size:11px;margin-top:24px;font-family:sans-serif">Submitted via steelyes.co.uk</p>
  `
}

/**
 * Short uppercase reference derived from a share/intake URL's last path segment,
 * so a lead/intake email can be found by ref code instead of opening it.
 */
function shortRef(url: string): string {
  const last = url.split('/').filter(Boolean).pop()?.split('?')[0] ?? ''
  return last.length >= 6 ? last.slice(0, 6).toUpperCase() : ''
}

/** Fire-and-log send; email failures must never fail the enclosing request. */
async function sendEmail(options: {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}): Promise<boolean> {
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const { error } = await resend.emails.send({ from: EMAIL_FROM, ...options })
    if (error) {
      console.error(`Resend error (${options.subject}):`, error)
      return false
    }
    return true
  } catch (err) {
    console.error(`Resend threw (${options.subject}):`, err)
    return false
  }
}

export type WorkshopLeadEmailInput = {
  name: string
  email: string
  phone: string
  projectType: string
  postcode: string
  message: string
  shareUrl: string
  pdfUrl: string
  configurationSummary: string
  hasConfiguration: boolean
}

function tableRow(label: string, valueHtml: string, shaded: boolean): string {
  const bg = shaded ? ';background:#f5f5f5' : ''
  return `<tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top${bg}">${label}</td><td style="padding:8px 12px;white-space:pre-wrap${bg}">${valueHtml}</td></tr>`
}

export async function sendWorkshopLeadEmail(input: WorkshopLeadEmailInput): Promise<boolean> {
  const rows = [
    tableRow('Name', input.name, true),
    tableRow('Email', `<a href="mailto:${input.email}">${input.email}</a>`, false),
    tableRow('Phone', input.phone || '—', true),
    tableRow('Project type', input.projectType || '—', false),
    tableRow('Postcode', input.postcode || '—', true),
    input.hasConfiguration
      ? tableRow(
          'Configuration',
          `${input.shareUrl}${input.configurationSummary ? `<br>${input.configurationSummary}` : ''}${input.pdfUrl ? `<br><a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}`,
          false,
        )
      : '',
    tableRow('Details', input.message || '—', true),
  ].join('')

  const tag = input.hasConfiguration ? '[PREVENTIVO]' : '[LEAD]'
  const base = input.hasConfiguration
    ? `New configurator quote — ${input.name}`
    : `New enquiry — ${input.name} (${input.projectType || 'Steel project'})`
  const ref = shortRef(input.shareUrl)

  return sendEmail({
    to: WORKSHOP_EMAIL,
    replyTo: input.email,
    subject: `${tag} ${base}${ref ? ` #${ref}` : ''}`,
    html: internalEmailShell(
      input.hasConfiguration ? 'New configurator quote request' : 'New project enquiry',
      `<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">${rows}</table>`,
    ),
    text: [
      input.hasConfiguration ? 'New configurator quote request' : 'New project enquiry',
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || '—'}`,
      `Project type: ${input.projectType || '—'}`,
      `Postcode: ${input.postcode || '—'}`,
      input.hasConfiguration ? `Configuration: ${input.shareUrl}` : '',
      input.hasConfiguration && input.pdfUrl ? `PDF: ${input.pdfUrl}` : '',
      `Details: ${input.message || '—'}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })
}

export type CustomerConfirmationEmailInput = {
  name: string
  email: string
  message: string
  shareUrl: string
  pdfUrl: string
  configurationSummary: string
  pricingSummary: string
}

export async function sendCustomerConfirmationEmail(
  input: CustomerConfirmationEmailInput,
): Promise<boolean> {
  const firstName = input.name.split(' ')[0] || input.name
  return sendEmail({
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'Your Steelyes gate configuration',
    html: emailShell(
      `Thank you, ${firstName}`,
      `
      <p style="${BODY_STYLE}">
        We received your quote request. Our workshop will review your configuration and follow up after any site survey needed.
      </p>
      ${input.configurationSummary ? `<p style="${BODY_STYLE}"><strong>Configuration:</strong> ${input.configurationSummary}</p>` : ''}
      ${input.pricingSummary ? `<p style="${BODY_STYLE}"><strong>Indicative estimate:</strong> ${input.pricingSummary}</p>` : ''}
      <p style="${BODY_STYLE}">
        <a href="${input.shareUrl}">View your saved configuration</a>
        ${input.pdfUrl ? ` · <a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}
      </p>
      ${input.message ? `<p style="${BODY_STYLE}">Your message:<br>${input.message.replace(/\n/g, '<br>')}</p>` : ''}
      `,
    ),
    text: [
      `Thank you, ${firstName}`,
      'We received your quote request. Our workshop will review your configuration and follow up after any site survey needed.',
      input.configurationSummary ? `Configuration: ${input.configurationSummary}` : '',
      input.pricingSummary ? `Indicative estimate: ${input.pricingSummary}` : '',
      `View your saved configuration: ${input.shareUrl}`,
      input.pdfUrl ? `Download estimate PDF: ${input.pdfUrl}` : '',
      input.message ? `Your message:\n${input.message}` : '',
      `${PRICING_DISCLAIMER}\nSteelyes · ${BUSINESS.phoneDisplay} · ${BUSINESS.email}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
  })
}

export type QuoteReadyEmailInput = {
  firstName: string
  email: string
  shareUrl: string
  pdfUrl: string
}

export async function sendQuoteReadyEmail(input: QuoteReadyEmailInput): Promise<boolean> {
  return sendEmail({
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'Your Steelyes quote is ready',
    html: emailShell(
      `Good news, ${input.firstName}`,
      `
      <p style="${BODY_STYLE}">
        We have reviewed your gate configuration and your quote is on its way. If it has not arrived alongside this
        message, it will follow shortly from our workshop.
      </p>
      <p style="${BODY_STYLE}">
        <a href="${input.shareUrl}">View your configuration</a>
        ${input.pdfUrl ? ` · <a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}
      </p>
      <p style="${BODY_STYLE}">
        Questions or ready to go ahead? Call us on <a href="tel:${BUSINESS.phone}">${BUSINESS.phoneDisplay}</a>
        or simply reply to this email.
      </p>
      `,
    ),
    text: [
      `Good news, ${input.firstName}`,
      'We have reviewed your gate configuration and your quote is on its way. If it has not arrived alongside this message, it will follow shortly from our workshop.',
      `View your configuration: ${input.shareUrl}`,
      input.pdfUrl ? `Download estimate PDF: ${input.pdfUrl}` : '',
      `Questions or ready to go ahead? Call us on ${BUSINESS.phoneDisplay} or simply reply to this email.`,
      `${PRICING_DISCLAIMER}\nSteelyes · ${BUSINESS.phoneDisplay} · ${BUSINESS.email}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
  })
}

export type DesignSaveEmailInput = {
  email: string
  shareUrl: string
  pdfUrl: string
  configurationSummary: string
}

export async function sendDesignSaveEmail(input: DesignSaveEmailInput): Promise<boolean> {
  return sendEmail({
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'Your saved Steelyes gate design',
    html: emailShell(
      'Your gate design is saved',
      `
      <p style="${BODY_STYLE}">
        Here is your saved gate design. Open the link below any time to review it, keep editing, or request a quote
        when you are ready.
      </p>
      ${input.configurationSummary ? `<p style="${BODY_STYLE}"><strong>Configuration:</strong> ${input.configurationSummary}</p>` : ''}
      <p style="${BODY_STYLE}">
        <a href="${input.shareUrl}">View your saved design</a>
        ${input.pdfUrl ? ` · <a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}
      </p>
      `,
    ),
    text: [
      'Your gate design is saved',
      'Here is your saved gate design. Open the link below any time to review it, keep editing, or request a quote when you are ready.',
      input.configurationSummary ? `Configuration: ${input.configurationSummary}` : '',
      `View your saved design: ${input.shareUrl}`,
      input.pdfUrl ? `Download estimate PDF: ${input.pdfUrl}` : '',
      `${PRICING_DISCLAIMER}\nSteelyes · ${BUSINESS.phoneDisplay} · ${BUSINESS.email}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
  })
}

export type AbandonedReminderEmailInput = {
  email: string
  shareUrl: string
}

export async function sendAbandonedReminderEmail(
  input: AbandonedReminderEmailInput,
): Promise<boolean> {
  return sendEmail({
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'Your Steelyes gate design is waiting',
    html: emailShell(
      'Still thinking it over?',
      `
      <p style="${BODY_STYLE}">
        You saved a gate design with us recently. It is still here whenever you want to pick it up again —
        review it, tweak it, or request a survey-led quote in a couple of clicks.
      </p>
      <p style="${BODY_STYLE}">
        <a href="${input.shareUrl}">Open your saved design</a>
      </p>
      <p style="${BODY_STYLE}">
        Prefer to talk it through? Call <a href="tel:${BUSINESS.phone}">${BUSINESS.phoneDisplay}</a> and we will help
        you get the measurements and options right.
      </p>
      `,
    ),
    text: [
      'Still thinking it over?',
      'You saved a gate design with us recently. It is still here whenever you want to pick it up again — review it, tweak it, or request a survey-led quote in a couple of clicks.',
      `Open your saved design: ${input.shareUrl}`,
      `Prefer to talk it through? Call ${BUSINESS.phoneDisplay} and we will help you get the measurements and options right.`,
      `${PRICING_DISCLAIMER}\nSteelyes · ${BUSINESS.phoneDisplay} · ${BUSINESS.email}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
  })
}

export type ClientIntakeUpdateEmailInput = {
  clientName: string
  questionLabel: string
  status: string
  adminUrl: string
  intakeUrl: string
  progressSummary: string
}

/** Notify workshop when Marius (or admin) updates an intake answer. */
export async function sendClientIntakeUpdateEmail(
  input: ClientIntakeUpdateEmailInput,
): Promise<boolean> {
  const ref = shortRef(input.intakeUrl)
  return sendEmail({
    to: WORKSHOP_EMAIL,
    subject: `[INTAKE] Client intake update — ${input.clientName}${ref ? ` #${ref}` : ''}`,
    html: internalEmailShell(
      'Client intake aggiornato',
      `
      <p style="${BODY_STYLE}"><strong>${input.clientName}</strong> ha aggiornato una risposta.</p>
      <p style="${BODY_STYLE}"><strong>Domanda:</strong> ${input.questionLabel}</p>
      <p style="${BODY_STYLE}"><strong>Stato:</strong> ${input.status}</p>
      <p style="${BODY_STYLE}"><strong>Progresso:</strong> ${input.progressSummary}</p>
      <p style="${BODY_STYLE}">
        <a href="${input.adminUrl}">Apri pannello dati cliente</a>
        · <a href="${input.intakeUrl}">Apri link intake</a>
      </p>
      `,
    ),
    text: [
      'Client intake aggiornato',
      `${input.clientName} ha aggiornato una risposta.`,
      `Domanda: ${input.questionLabel}`,
      `Stato: ${input.status}`,
      `Progresso: ${input.progressSummary}`,
      `Pannello dati cliente: ${input.adminUrl}`,
      `Link intake: ${input.intakeUrl}`,
    ].join('\n'),
  })
}
