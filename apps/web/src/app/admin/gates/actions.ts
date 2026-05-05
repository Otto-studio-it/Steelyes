'use server'

import { z } from 'zod'
import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const UpdateGatePriceSchema = z.object({
  id: z.string().uuid(),
  base_price_manual_gbp: z.coerce.number().min(0),
  base_price_auto_gbp: z.coerce.number().min(0).nullable(),
})

export async function updateGatePrice(formData: FormData): Promise<AdminActionResult> {
  const parsed = UpdateGatePriceSchema.safeParse({
    id: formData.get('id'),
    base_price_manual_gbp: formData.get('base_price_manual_gbp'),
    base_price_auto_gbp: formData.get('base_price_auto_gbp') || null,
  })

  if (!parsed.success) {
    return { error: 'Dati non validi.' }
  }

  const denied = await requireAdmin()
  if (denied) return denied

  const client = getServiceRoleClient()
  const { error } = await client
    .from('gates')
    .update({
      base_price_manual_gbp: parsed.data.base_price_manual_gbp,
      base_price_auto_gbp: parsed.data.base_price_auto_gbp,
    })
    .eq('id', parsed.data.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/gates')
  return { success: true }
}
