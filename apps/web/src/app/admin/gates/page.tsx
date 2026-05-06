import { redirect } from 'next/navigation'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin/require-admin'
import { GatesBoard } from './GatesBoard'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'

const GATES_COLUMNS_FULL =
  'id, name, type, style, finish, min_width_mm, min_height_mm, base_price_manual_gbp, base_price_auto_gbp' as const

const GATES_COLUMNS_WITHOUT_NAME =
  'id, type, style, finish, min_width_mm, min_height_mm, base_price_manual_gbp, base_price_auto_gbp' as const

function gatesNameMissingError(message: string) {
  return /gates\.name|column .*\.name .*does not exist/i.test(message)
}

type GateRow = Database['public']['Tables']['gates']['Row']

export default async function GatesAdminPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const client = getServiceRoleClient()

  let { data: gates, error } = await client
    .from('gates')
    .select(GATES_COLUMNS_FULL)
    .order('style')
    .order('type')
    .order('finish')

  if (error && gatesNameMissingError(error.message)) {
    const retry = await client
      .from('gates')
      .select(GATES_COLUMNS_WITHOUT_NAME)
      .order('style')
      .order('type')
      .order('finish')

    gates =
      retry.data?.map((row) => ({
        ...(row as Omit<GateRow, 'name'>),
        name: '',
      })) ?? null
    error = retry.error
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Gestione Prezzi
        </p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a]">
          Prezzi Cancelli
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Tocca un cancello per modificare il prezzo. Le modifiche sono immediate.
        </p>

        {error && (
          <p className="mt-4 font-mono text-xs text-[#ba1a1a]">Errore caricamento: {error.message}</p>
        )}

        {!error && gates && gates.length > 0 ? (
          <GatesBoard gates={gates} />
        ) : (
          !error && (
            <p className="mt-6 font-mono text-sm text-zinc-400">
              Nessun cancello trovato. Le migrations devono essere applicate.
            </p>
          )
        )}
      </main>
    </>
  )
}
