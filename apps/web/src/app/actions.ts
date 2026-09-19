'use server'

import type {
  FinishCode,
  GateConfig,
  GateStyle,
  GateType,
  PricingResult,
  SerializedGateConfigV1,
} from '@steelyes/gate-engine'
import { calculateIndicativeGatePrice, deserializeGateConfig } from '@steelyes/gate-engine'
import { z } from 'zod'

import { formatConfigurationSummaryText } from '@/lib/configurator/configuration-summary'
import {
  emailMyDesignUnexpectedFailureState,
  emailSendFailureState,
  quoteLeadMessage,
  shouldFailQuoteWhenQuoteRequestInsertFails,
  turnstileFailureMessage,
} from '@/lib/configurator/lead-pipeline'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { captureServerEvent } from '@/lib/analytics/posthog-server'
import {
  sendCustomerConfirmationEmail,
  sendContactConfirmationEmail,
  sendDesignSaveEmail,
  sendWorkshopLeadEmail,
} from '@/lib/email/send'
import { dispatchTenantLeadWebhook } from '@/lib/platform/lead-webhook'
import { loadTenantBundle } from '@/lib/platform/load-tenant'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { SITE_SURVEY_FIELD_LABEL, finishLabel, gateTypeLabel, siteSurveyLabel, styleLabel } from '@/lib/configurator/labels'
import { buildIndicativeQuotePdf, buildQuotePdfFilename } from '@/lib/configurator/quote-pdf'
import { workshopPdfAttachment, type WorkshopPdfAttachment } from '@/lib/email/workshop-pdf-attachment'
import { buildQuotePdfPath, buildQuoteSharePath, isValidShareToken } from '@/lib/configurator/share-token'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success'; customerEmailSent?: boolean; shareUrl?: string }
  | { status: 'error'; message: string }

const EmailSchema = z.string().trim().toLowerCase().email().max(254)
const QuoteSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: EmailSchema,
  phone: z.string().trim().max(40),
  projectType: z.string().trim().max(120),
  postcode: z.string().trim().max(20),
  message: z.string().trim().max(5000),
  shareToken: z.string().trim().max(128),
  turnstileToken: z.string().trim().max(2048),
  source: z.enum(['contact_form', 'configurator']),
})

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '—' }
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

function absoluteSiteUrl(path: string): string {
  const base = env.NEXT_PUBLIC_SITE_URL ?? 'https://steelyes.co.uk'
  return `${base.replace(/\/$/, '')}${path}`
}

type ConfigurationContext = {
  configurationId: string | null
  configurationSummary: string
  pricingSummary: string
  shareUrl: string
  pdfUrl: string
  pdfAttachment: WorkshopPdfAttachment | null
}

async function buildWorkshopQuotePdfAttachment(input: {
  config: GateConfig
  pricing: PricingResult
  shareToken: string
  shareUrl: string
}): Promise<WorkshopPdfAttachment | null> {
  try {
    const pdfBytes = await buildIndicativeQuotePdf(input)
    return workshopPdfAttachment({
      filename: buildQuotePdfFilename(input.shareToken),
      bytes: pdfBytes,
    })
  } catch (error) {
    console.error('Workshop quote PDF build failed:', error)
    return null
  }
}

async function loadConfigurationContext(
  shareToken: string,
  options?: { attachPdf?: boolean },
): Promise<ConfigurationContext> {
  const empty: ConfigurationContext = {
    configurationId: null,
    configurationSummary: '',
    pricingSummary: '',
    shareUrl: shareToken && isValidShareToken(shareToken) ? absoluteSiteUrl(buildQuoteSharePath(shareToken)) : '',
    pdfUrl: shareToken && isValidShareToken(shareToken) ? absoluteSiteUrl(buildQuotePdfPath(shareToken)) : '',
    pdfAttachment: null,
  }

  if (!shareToken || !isValidShareToken(shareToken)) {
    return { ...empty, shareUrl: '', pdfUrl: '' }
  }

  try {
    const supabase = getServiceRoleClient()
    const { data: configurationRow } = await supabase
      .from('configurations')
      .select('id, gate_type, parameters')
      .eq('share_token', shareToken)
      .maybeSingle()

    if (!configurationRow) {
      return empty
    }

    const context: ConfigurationContext = {
      ...empty,
      configurationId: configurationRow.id,
    }

    try {
      const config = deserializeGateConfig(configurationRow.parameters as SerializedGateConfigV1)
      const pricingCatalog = await fetchPricingCatalog()
      const pricing = calculateIndicativeGatePrice(config, pricingCatalog)
      context.configurationSummary = formatConfigurationSummaryText(config, pricing)
      context.pricingSummary = `${pricing.totalLabel} (${pricing.disclaimer})`
      if (options?.attachPdf) {
        context.pdfAttachment = await buildWorkshopQuotePdfAttachment({
          config,
          pricing,
          shareToken,
          shareUrl: context.shareUrl,
        })
      }
    } catch {
      const parameters = configurationRow.parameters as {
        gateType?: string
        style?: string
        widthMm?: number
        heightMm?: number
        finish?: string
        siteSurveyRequested?: boolean
      }

      if (parameters.gateType && parameters.style && parameters.widthMm && parameters.heightMm && parameters.finish) {
        context.configurationSummary = [
          gateTypeLabel(parameters.gateType as GateType),
          styleLabel(parameters.style as GateStyle),
          `${parameters.widthMm} × ${parameters.heightMm} mm`,
          finishLabel(parameters.finish as FinishCode),
          `${SITE_SURVEY_FIELD_LABEL}: ${siteSurveyLabel(parameters.siteSurveyRequested === true)}`,
        ].join(' · ')
      }
    }

    return context
  } catch (error) {
    console.error('Configuration context load error:', error)
    return empty
  }
}

type QuoteSubmissionInput = {
  name: string
  email: string
  phone: string
  projectType: string
  postcode: string
  message: string
  shareToken: string
  turnstileToken: string
  source: 'contact_form' | 'configurator'
}

async function processQuoteSubmission(input: QuoteSubmissionInput): Promise<ContactFormState> {
  try {
    const parsed = QuoteSubmissionSchema.safeParse(input)
    if (!parsed.success) return { status: 'error', message: 'Please check the details and try again.' }
    const { name, email, phone, projectType, postcode, message, shareToken, source } = parsed.data

    const turnstile = await verifyTurnstile(parsed.data.turnstileToken)
    if (!turnstile.ok) {
      return { status: 'error', message: turnstileFailureMessage(turnstile.reason) }
    }
    const turnstileVerified = true

    const supabase = getServiceRoleClient()
    const context = await loadConfigurationContext(shareToken, { attachPdf: true })
    const { configurationId, configurationSummary, pricingSummary, shareUrl, pdfUrl, pdfAttachment } = context

    if (configurationId) {
      const { firstName, lastName } = splitName(name)
      const { error: quoteError } = await supabase.from('quote_requests').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        postcode: postcode || '—',
        configuration_id: configurationId,
        status: 'new',
        turnstile_verified: turnstileVerified,
      })

      if (quoteError) {
        console.error('Quote request insert error:', quoteError)
        if (shouldFailQuoteWhenQuoteRequestInsertFails()) {
          return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
        }
      }
    }

    const { error: dbError } = await supabase.from('leads').insert({
      name,
      email,
      phone: phone || null,
      project_type: projectType || null,
      postcode: postcode || null,
      message: quoteLeadMessage({ message, shareToken, configurationSummary }),
      status: 'new',
    })

    if (dbError) {
      console.error('Lead insert error:', dbError)
      return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
    }

    const workshopEmailSent = await sendWorkshopLeadEmail({
      name,
      email,
      phone,
      projectType,
      postcode,
      message,
      shareUrl,
      pdfUrl,
      configurationSummary,
      hasConfiguration: Boolean(shareUrl),
      pdfAttachment,
    })

    let customerEmailSent: boolean | undefined
    if (shareUrl) {
      customerEmailSent = await sendCustomerConfirmationEmail({
        name,
        email,
        message,
        shareUrl,
        pdfUrl,
        configurationSummary,
        pricingSummary,
      })
    } else {
      customerEmailSent = await sendContactConfirmationEmail({ name, email })
    }

    await dispatchTenantLeadWebhook(loadTenantBundle('steelyes'), {
      event: source === 'configurator' ? 'configurator_quote_submitted' : 'contact_form_submitted',
      email,
      name,
      share_token: shareToken || null,
      configuration_id: configurationId,
    })

    await captureServerEvent(email, source === 'configurator' ? 'configurator quote submitted' : 'contact form submitted', {
      has_configuration: Boolean(configurationId),
      share_token: shareToken || null,
      turnstile_verified: turnstileVerified,
    })

    if (!workshopEmailSent) {
      console.error('Lead persisted but workshop notification failed')
    }

    return { status: 'success', customerEmailSent, shareUrl: shareUrl || undefined }
  } catch (error) {
    console.error('Quote submission error:', error)
    return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
  }
}

function readField(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const message = readField(formData, 'message')
  if (!message) {
    return { status: 'error', message: 'Name, email and project details are required.' }
  }

  return processQuoteSubmission({
    name: readField(formData, 'name'),
    email: readField(formData, 'email'),
    phone: readField(formData, 'phone'),
    projectType: readField(formData, 'project_type'),
    postcode: readField(formData, 'postcode'),
    message,
    shareToken: readField(formData, 'share_token'),
    turnstileToken: readField(formData, 'turnstile_token'),
    source: 'contact_form',
  })
}

/**
 * Quote request submitted from inside the configurator (final step form).
 * Same pipeline as the contact form, but message is optional and the
 * configuration share token is required.
 */
export async function submitConfiguratorQuote(formData: FormData): Promise<ContactFormState> {
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const shareToken = readField(formData, 'share_token')
  if (!shareToken || !isValidShareToken(shareToken)) {
    return { status: 'error', message: 'Could not attach your configuration. Please try again.' }
  }

  return processQuoteSubmission({
    name: readField(formData, 'name'),
    email: readField(formData, 'email'),
    phone: readField(formData, 'phone'),
    projectType: 'Gate configurator',
    postcode: readField(formData, 'postcode'),
    message: readField(formData, 'message'),
    shareToken,
    turnstileToken: readField(formData, 'turnstile_token'),
    source: 'configurator',
  })
}

export type EmailMyDesignState =
  | { status: 'idle' }
  | { status: 'success'; shareUrl?: string }
  | { status: 'error'; message: string; shareUrl?: string }

/**
 * "Email me my design": captures the customer's email against a saved
 * configuration and sends the share link. Also feeds the abandoned-design
 * reminder job via design_captures.
 */
export async function emailMyDesign(formData: FormData): Promise<EmailMyDesignState> {
  if (formData.get('website')) {
    return { status: 'success' }
  }

  try {
    const emailResult = EmailSchema.safeParse(readField(formData, 'email'))
    const shareToken = readField(formData, 'share_token')

    if (!emailResult.success) {
      return { status: 'error', message: 'Please enter a valid email address.' }
    }
    const email = emailResult.data

    const turnstile = await verifyTurnstile(readField(formData, 'turnstile_token'))
    if (!turnstile.ok) {
      return { status: 'error', message: turnstileFailureMessage(turnstile.reason) }
    }

    if (!shareToken || !isValidShareToken(shareToken)) {
      return { status: 'error', message: 'Could not save your design. Please try again.' }
    }

    const context = await loadConfigurationContext(shareToken)
    if (!context.shareUrl) {
      return { status: 'error', message: 'Could not find your saved design. Please try again.' }
    }

    if (context.configurationId) {
      try {
        const supabase = getServiceRoleClient()
        const { error: captureError } = await supabase
          .from('design_captures')
          .upsert(
            {
              email,
              configuration_id: context.configurationId,
              share_token: shareToken,
            },
            { onConflict: 'email,configuration_id', ignoreDuplicates: true },
          )

        if (captureError) {
          console.error('Design capture insert error:', captureError)
        }
      } catch (error) {
        console.error('Design capture insert threw:', error)
      }
    }

    const sent = await sendDesignSaveEmail({
      email,
      shareUrl: context.shareUrl,
      pdfUrl: context.pdfUrl,
      configurationSummary: context.configurationSummary,
    })

    if (!sent) {
      return emailSendFailureState(context.shareUrl)
    }

    try {
      await captureServerEvent(email, 'design emailed to customer', {
        share_token: shareToken,
        configuration_id: context.configurationId,
      })
    } catch (error) {
      console.error('Design emailed analytics failed:', error)
    }

    return { status: 'success', shareUrl: context.shareUrl }
  } catch (error) {
    console.error('Email my design error:', error)
    const shareToken = readField(formData, 'share_token')
    const shareUrl =
      shareToken && isValidShareToken(shareToken) ? absoluteSiteUrl(buildQuoteSharePath(shareToken)) : undefined
    return emailMyDesignUnexpectedFailureState(shareUrl)
  }
}
