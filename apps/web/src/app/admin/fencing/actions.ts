'use server'

import { z } from 'zod'
import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const UpsertFencingSchema = z.object({
  id: z.string().uuid().optional(),
  style: z.enum(['modern', 'classic', 'privacy', 'victorian'] as const),
  finish: z.enum(['metal', 'composite'] as const),
  base_price_gbp: z.coerce.number().min(0),
  price_per_m2_gbp: z.coerce.number().min(0),
  notes: z.string().optional(),
})

export async function upsertFencingPanel(formData: FormData): Promise<AdminActionResult> {
  const id = formData.get('id')
  const parsed = UpsertFencingSchema.safeParse({
    id: id && String(id).trim() !== '' ? id : undefined,
    style: formData.get('style'),
    finish: formData.get('finish'),
    base_price_gbp: formData.get('base_price_gbp'),
    price_per_m2_gbp: formData.get('price_per_m2_gbp'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) return { error: 'Dati non validi.' }

  const denied = await requireAdmin()
  if (denied) return denied

  const client = getServiceRoleClient()

  if (parsed.data.id) {
    const { error } = await client
      .from('fencing_panels')
      .update({
        base_price_gbp: parsed.data.base_price_gbp,
        price_per_m2_gbp: parsed.data.price_per_m2_gbp,
        notes: parsed.data.notes ?? null,
      })
      .eq('id', parsed.data.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await client.from('fencing_panels').insert({
      style: parsed.data.style,
      finish: parsed.data.finish,
      base_price_gbp: parsed.data.base_price_gbp,
      price_per_m2_gbp: parsed.data.price_per_m2_gbp,
      notes: parsed.data.notes ?? null,
    })
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/fencing')
  return { success: true }
}
