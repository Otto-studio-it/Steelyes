'use server'

import type { FinishCode, GateStyle, GateType } from '@steelyes/gate-engine'
import { Resend } from 'resend'

import { finishLabel, gateTypeLabel, styleLabel } from '@/lib/configurator/labels'
import { buildQuoteSharePath, isValidShareToken } from '@/lib/configurator/share-token'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

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

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const projectType = (formData.get('project_type') as string | null)?.trim() ?? ''
  const postcode = (formData.get('postcode') as string | null)?.trim() ?? ''
  const message = (formData.get('message') as string | null)?.trim() ?? ''
  const shareToken = (formData.get('share_token') as string | null)?.trim() ?? ''

  if (!name || !email || !message) {
    return { status: 'error', message: 'Name, email and project details are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const supabase = getServiceRoleClient()
  let configurationId: string | null = null
  let configurationSummary = ''

  if (shareToken && isValidShareToken(shareToken)) {
    const { data: configurationRow } = await supabase
      .from('configurations')
      .select('id, gate_type, parameters')
      .eq('share_token', shareToken)
      .maybeSingle()

    if (configurationRow) {
      configurationId = configurationRow.id
      const parameters = configurationRow.parameters as {
        gateType?: string
        style?: string
        widthMm?: number
        heightMm?: number
        finish?: string
      }

      if (parameters.gateType && parameters.style && parameters.widthMm && parameters.heightMm && parameters.finish) {
        configurationSummary = [
          gateTypeLabel(parameters.gateType as GateType),
          styleLabel(parameters.style as GateStyle),
          `${parameters.widthMm} × ${parameters.heightMm} mm`,
          finishLabel(parameters.finish as FinishCode),
        ].join(' · ')
      }
    }
  }

  if (configurationId) {
    const { firstName, lastName } = splitName(name)
    const { error: quoteError } = await supabase.from('quote_requests').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      postcode: postcode || '—',
      configuration_id: configurationId,
      status: 'new',
      turnstile_verified: false,
    })

    if (quoteError) {
      console.error('Quote request insert error:', quoteError)
      return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
    }
  }

  const { error: dbError } = await supabase.from('leads').insert({
    name,
    email,
    project_type: projectType || null,
    postcode: postcode || null,
    message: configurationId
      ? `${message}\n\nConfiguration reference: ${buildQuoteSharePath(shareToken)}${configurationSummary ? `\nConfiguration summary: ${configurationSummary}` : ''}`
      : message,
    status: 'new',
  })

  if (dbError) {
    console.error('Lead insert error:', dbError)
    return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
  }

  const resend = new Resend(env.RESEND_API_KEY)

  try {
    const { error: resendError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'steelyes755@gmail.com',
      subject: configurationId
        ? `New configurator quote — ${name}`
        : `New enquiry — ${name} (${projectType || 'Steel project'})`,
      html: `
      <h2 style="font-family:sans-serif">${configurationId ? 'New configurator quote request' : 'New project enquiry'}</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Name</td><td style="padding:8px 12px">${name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold">Email</td><td style="padding:8px 12px"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Project type</td><td style="padding:8px 12px;background:#f5f5f5">${projectType || '—'}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold">Postcode</td><td style="padding:8px 12px">${postcode || '—'}</td></tr>
        ${configurationId ? `<tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Configuration</td><td style="padding:8px 12px;background:#f5f5f5">${buildQuoteSharePath(shareToken)}${configurationSummary ? `<br>${configurationSummary}` : ''}</td></tr>` : ''}
        <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;background:#f5f5f5">Details</td><td style="padding:8px 12px;white-space:pre-wrap;background:#f5f5f5">${message}</td></tr>
      </table>
      <p style="color:#999;font-size:11px;margin-top:24px;font-family:sans-serif">Submitted via steelyes.co.uk contact form</p>
    `,
    })
    if (resendError) {
      console.error('Resend notify error (lead still saved):', resendError)
    }
  } catch (err) {
    console.error('Resend notify threw (lead still saved):', err)
  }

  return { status: 'success' }
}
