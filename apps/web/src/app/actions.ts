'use server'

import { Resend } from 'resend'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot — bots fill this hidden field
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const projectType = (formData.get('project_type') as string | null)?.trim() ?? ''
  const postcode = (formData.get('postcode') as string | null)?.trim() ?? ''
  const message = (formData.get('message') as string | null)?.trim() ?? ''

  if (!name || !email || !message) {
    return { status: 'error', message: 'Name, email and project details are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // Save lead to Supabase
  const supabase = getServiceRoleClient()
  const { error: dbError } = await supabase.from('leads').insert({
    name,
    email,
    project_type: projectType || null,
    postcode: postcode || null,
    message,
    status: 'new',
  })

  if (dbError) {
    console.error('Lead insert error:', dbError)
    return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
  }

  // Notify admin via Resend
  const resend = new Resend(env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'steelyes755@gmail.com',
    subject: `New enquiry — ${name} (${projectType || 'Steel project'})`,
    html: `
      <h2 style="font-family:sans-serif">New project enquiry</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Name</td><td style="padding:8px 12px">${name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold">Email</td><td style="padding:8px 12px"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Project type</td><td style="padding:8px 12px;background:#f5f5f5">${projectType || '—'}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold">Postcode</td><td style="padding:8px 12px">${postcode || '—'}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;background:#f5f5f5">Details</td><td style="padding:8px 12px;white-space:pre-wrap;background:#f5f5f5">${message}</td></tr>
      </table>
      <p style="color:#999;font-size:11px;margin-top:24px;font-family:sans-serif">Submitted via steelyes.co.uk contact form</p>
    `,
  })

  return { status: 'success' }
}
