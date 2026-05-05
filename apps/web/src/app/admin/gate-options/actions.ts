'use server'

import { z } from 'zod'
import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const UpdateOptionSchema = z.object({
  id: z.string().uuid(),
  flat_price_gbp: z.coerce.number().min(0),
  per_unit_price_gbp: z.coerce.number().min(0).nullable(),
})

export async function updateGateOption(formData: FormData): Promise<AdminActionResult> {
  const rawPerUnit = formData.get('per_unit_price_gbp')
  const parsed = UpdateOptionSchema.safeParse({
    id: formData.get('id'),
    flat_price_gbp: formData.get('flat_price_gbp'),
    per_unit_price_gbp: rawPerUnit && String(rawPerUnit).trim() !== '' ? rawPerUnit : null,
  })

  if (!parsed.success) return { error: 'Dati non validi.' }

  const denied = await requireAdmin()
  if (denied) return denied

  const client = getServiceRoleClient()
  const { error } = await client
    .from('gate_options')
    .update({
      flat_price_gbp: parsed.data.flat_price_gbp,
      per_unit_price_gbp: parsed.data.per_unit_price_gbp,
    })
    .eq('id', parsed.data.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/gate-options')
  return { success: true }
}
