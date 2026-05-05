import { redirect } from 'next/navigation'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin/require-admin'
import { FencingCard } from './FencingCard'
import { NewFencingForm } from './NewFencingForm'

export const dynamic = 'force-dynamic'

export default async function FencingAdminPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const client = getServiceRoleClient()
  const { data: panels, error } = await client
    .from('fencing_panels')
    .select('id, style, finish, base_price_gbp, price_per_m2_gbp, notes')
    .order('style')
    .order('finish')

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Gestione Prezzi
        </p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a]">
          Pannelli Recinzione
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Inserisci prezzi appena Marius li conferma. Tocca per modificare.
        </p>

        {error && (
          <p className="mt-4 font-mono text-xs text-[#ba1a1a]">Errore: {error.message}</p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {(panels ?? []).length === 0 && !error && (
            <p className="font-mono text-sm text-zinc-400">
              Nessun pannello ancora. Aggiungine uno qui sotto.
            </p>
          )}
          {(panels ?? []).map((p) => (p ? <FencingCard key={p.id} panel={p} /> : null))}
        </div>

        <div className="mt-6">
          <NewFencingForm />
        </div>
      </main>
    </>
  )
}
