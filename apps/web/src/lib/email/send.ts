import { Resend } from 'resend'

import { BUSINESS, PRICING_DISCLAIMER } from '@/lib/marketing/business'
import { env } from '@/lib/env'
import { escapeEmailHtml } from '@/lib/email/html'
import { getServiceRoleClient } from '@/lib/supabase/server'

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

/** Send and record the provider result; callers decide whether failure blocks their workflow. */
async function sendEmail(options: {
  kind: string
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
  idempotencyKey?: string
}): Promise<boolean> {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) {
    console.error(`Resend skipped (${options.subject}): RESEND_API_KEY is not configured`)
    return false
  }

  const subject = options.subject.replace(/[\r\n]+/g, ' ').slice(0, 200)
  let supabase: ReturnType<typeof getServiceRoleClient> | null = null
  let delivery: { id: string } | null = null
  try {
    supabase = getServiceRoleClient()
    const { data } = await supabase
      .from('email_deliveries')
      .insert({ kind: options.kind, recipient: options.to.toLowerCase(), subject })
      .select('id')
      .maybeSingle()
    delivery = data
  } catch (err) {
    console.error('email_deliveries insert failed:', err)
  }

  try {
    const resend = new Resend(apiKey)
    const emailOptions = {
      to: options.to,
      subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    }
    const { data, error } = await resend.emails.send(
      { from: EMAIL_FROM, ...emailOptions },
      options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined,
    )
    if (error) {
      console.error(`Resend error (${options.subject}):`, error)
      await markEmailDelivery(supabase, delivery?.id, {
        status: 'failed',
        error_message: error.message,
      })
      return false
    }
    await markEmailDelivery(supabase, delivery?.id, {
      status: 'sent',
      resend_email_id: data?.id ?? null,
    })
    return true
  } catch (err) {
    console.error(`Resend threw (${options.subject}):`, err)
    await markEmailDelivery(supabase, delivery?.id, {
      status: 'failed',
      error_message: err instanceof Error ? err.message : 'Unknown provider error',
    })
    return false
  }
}

async function markEmailDelivery(
  supabase: ReturnType<typeof getServiceRoleClient> | null,
  deliveryId: string | undefined,
  patch: { status: string; error_message?: string; resend_email_id?: string | null },
): Promise<void> {
  if (!supabase || !deliveryId) return
  try {
    const { error } = await supabase.from('email_deliveries').update(patch).eq('id', deliveryId)
    if (error) {
      console.error('email_deliveries update failed:', error)
    }
  } catch (err) {
    console.error('email_deliveries update threw:', err)
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
  const safe = {
    name: escapeEmailHtml(input.name),
    email: escapeEmailHtml(input.email),
    phone: escapeEmailHtml(input.phone),
    projectType: escapeEmailHtml(input.projectType),
    postcode: escapeEmailHtml(input.postcode),
    message: escapeEmailHtml(input.message),
    configurationSummary: escapeEmailHtml(input.configurationSummary),
  }
  const rows = [
    tableRow('Name', safe.name, true),
    tableRow('Email', `<a href="mailto:${safe.email}">${safe.email}</a>`, false),
    tableRow('Phone', safe.phone || '—', true),
    tableRow('Project type', safe.projectType || '—', false),
    tableRow('Postcode', safe.postcode || '—', true),
    input.hasConfiguration
      ? tableRow(
          'Configuration',
          `${input.shareUrl}${safe.configurationSummary ? `<br>${safe.configurationSummary}` : ''}${input.pdfUrl ? `<br><a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}`,
          false,
        )
      : '',
    tableRow('Details', safe.message || '—', true),
  ].join('')

  const tag = input.hasConfiguration ? '[PREVENTIVO]' : '[LEAD]'
  const base = input.hasConfiguration
    ? `New configurator quote — ${input.name}`
    : `New enquiry — ${input.name} (${input.projectType || 'Steel project'})`
  const ref = shortRef(input.shareUrl)

  return sendEmail({
    kind: input.hasConfiguration ? 'workshop_quote' : 'workshop_lead',
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

export async function sendContactConfirmationEmail(input: {
  name: string
  email: string
}): Promise<boolean> {
  const firstName = input.name.split(/\s+/)[0] || input.name
  return sendEmail({
    kind: 'customer_contact_confirmation',
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'We received your Steelyes enquiry',
    html: emailShell(
      `Thank you, ${escapeEmailHtml(firstName)}`,
      `<p style="${BODY_STYLE}">We have received your project enquiry. Our workshop will review it and respond within one business day.</p>
       <p style="${BODY_STYLE}">If you need to add anything, simply reply to this email.</p>`,
    ),
    text: [
      `Thank you, ${firstName}`,
      'We have received your project enquiry. Our workshop will review it and respond within one business day.',
      'If you need to add anything, simply reply to this email.',
      `Steelyes · ${BUSINESS.phoneDisplay} · ${BUSINESS.email}`,
    ].join('\n\n'),
  })
}

export async function sendCustomerConfirmationEmail(
  input: CustomerConfirmationEmailInput,
): Promise<boolean> {
  const firstName = input.name.split(' ')[0] || input.name
  return sendEmail({
    kind: 'customer_quote_confirmation',
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'Your Steelyes gate configuration',
    html: emailShell(
      `Thank you, ${escapeEmailHtml(firstName)}`,
      `
      <p style="${BODY_STYLE}">
        We received your quote request. Our workshop will review your configuration and follow up after any site survey needed.
      </p>
      ${input.configurationSummary ? `<p style="${BODY_STYLE}"><strong>Configuration:</strong> ${escapeEmailHtml(input.configurationSummary)}</p>` : ''}
      ${input.pricingSummary ? `<p style="${BODY_STYLE}"><strong>Indicative estimate:</strong> ${escapeEmailHtml(input.pricingSummary)}</p>` : ''}
      <p style="${BODY_STYLE}">
        <a href="${input.shareUrl}">View your saved configuration</a>
        ${input.pdfUrl ? ` · <a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}
      </p>
      ${input.message ? `<p style="${BODY_STYLE}">Your message:<br>${escapeEmailHtml(input.message).replace(/\n/g, '<br>')}</p>` : ''}
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
  quoteRequestId: string
  firstName: string
  email: string
  shareUrl: string
  pdfUrl: string
}

export async function sendQuoteReadyEmail(input: QuoteReadyEmailInput): Promise<boolean> {
  return sendEmail({
    kind: 'customer_quote_ready',
    idempotencyKey: `quote-ready/${input.quoteRequestId}`,
    to: input.email,
    replyTo: WORKSHOP_EMAIL,
    subject: 'Your Steelyes quote is ready',
    html: emailShell(
      `Good news, ${escapeEmailHtml(input.firstName)}`,
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
    kind: 'customer_design_saved',
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
      ${input.configurationSummary ? `<p style="${BODY_STYLE}"><strong>Configuration:</strong> ${escapeEmailHtml(input.configurationSummary)}</p>` : ''}
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
    kind: 'customer_design_reminder',
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
    kind: 'workshop_intake_update',
    to: WORKSHOP_EMAIL,
    subject: `[INTAKE] Client intake update — ${input.clientName}${ref ? ` #${ref}` : ''}`,
    html: internalEmailShell(
      'Client intake aggiornato',
      `
      <p style="${BODY_STYLE}"><strong>${escapeEmailHtml(input.clientName)}</strong> ha aggiornato una risposta.</p>
      <p style="${BODY_STYLE}"><strong>Domanda:</strong> ${escapeEmailHtml(input.questionLabel)}</p>
      <p style="${BODY_STYLE}"><strong>Stato:</strong> ${escapeEmailHtml(input.status)}</p>
      <p style="${BODY_STYLE}"><strong>Progresso:</strong> ${escapeEmailHtml(input.progressSummary)}</p>
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
