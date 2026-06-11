import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin/require-admin'

const SECTIONS = [
  {
    href: '/admin/gates',
    label: 'Prezzi Cancelli',
    desc: 'Modifica prezzi base per tipo, stile e finitura.',
    icon: '□',
  },
  {
    href: '/admin/gate-options',
    label: 'Addon & Opzioni',
    desc: 'Aggiorna prezzi per gli extra: barre, spirali, archi, ecc.',
    icon: '◈',
  },
  {
    href: '/admin/fencing',
    label: 'Pannelli Recinzione',
    desc: 'Prezzi pannelli recinzione (da inserire appena disponibili).',
    icon: '≡',
  },
  {
    href: '/admin/quotes',
    label: 'Richieste Preventivo',
    desc: 'Lead arrivati dal configuratore con la configurazione collegata.',
    icon: '✉',
  },
]

export default async function DashboardPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Pannello di Gestione
        </p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a] md:text-3xl">
          Cosa vuoi aggiornare?
        </h1>

        <div className="mt-8 flex flex-col gap-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-4 border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-[#9e000c]"
            >
              <span className="text-2xl text-[#9e000c]">{s.icon}</span>
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
                  {s.label}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{s.desc}</p>
              </div>
              <span className="ml-auto font-mono text-xs text-zinc-400">→</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
