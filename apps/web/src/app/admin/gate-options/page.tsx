import { redirect } from 'next/navigation'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin/require-admin'
import { OptionCard } from './OptionCard'

export const dynamic = 'force-dynamic'

export default async function GateOptionsAdminPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const client = getServiceRoleClient()
  const { data: options, error } = await client
    .from('gate_options')
    .select('id, name, slug, flat_price_gbp, per_unit_price_gbp, unit_type, notes')
    .order('name')

  const tbd = (options ?? []).filter((o) => o.per_unit_price_gbp === null && o.unit_type != null)
  const rest = (options ?? []).filter((o) => !(o.per_unit_price_gbp === null && o.unit_type != null))

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Gestione Prezzi
        </p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a]">
          Addon & Opzioni
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {"Tocca un'opzione per modificare il prezzo. I campi marcati TBD attendono conferma."}
        </p>

        {error && (
          <p className="mt-4 font-mono text-xs text-[#ba1a1a]">Errore: {error.message}</p>
        )}

        {tbd.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#795916]">
              ⚠ In attesa di conferma prezzi
            </p>
            <div className="flex flex-col gap-2">
              {tbd.map((o) => (o ? <OptionCard key={o.id} option={o} /> : null))}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
              Opzioni configurate
            </p>
            <div className="flex flex-col gap-2">
              {rest.map((o) => (o ? <OptionCard key={o.id} option={o} /> : null))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
