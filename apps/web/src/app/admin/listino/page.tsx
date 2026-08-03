import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/admin/require-admin'
import { getIntakeAnswers, getLatestIntakeSession } from '@/lib/client-intake/session'
import { getServiceRoleClient } from '@/lib/supabase/server'

import { ListinoBoard, type IntakeGateSeed } from './ListinoBoard'

export const dynamic = 'force-dynamic'

/** question_id → DB gate_type for the confirm_gates intake answers */
const INTAKE_GATE_MAP: Record<string, string> = {
  'gate.double_swing.prices': 'double-swing',
  'gate.single_swing.prices': 'single-swing',
  'gate.tracked_sliding.prices': 'sliding',
  'gate.cantilever_sliding.prices': 'cantilevered',
  'gate.bifolding_double.prices': 'bifolding',
  'gate.single_bifolding.prices': 'bifolding-single',
  'gate.telescopic.prices': 'telescopic',
  'gate.radius.prices': 'sliding-radius',
}

export default async function ListinoMasterPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const client = getServiceRoleClient()

  const [gatesRes, optionsRes, fencingRes] = await Promise.all([
    client
      .from('gates')
      .select(
        'id, name, type, style, finish, min_width_mm, min_height_mm, base_price_manual_gbp, base_price_auto_gbp',
      )
      .order('type')
      .order('style')
      .order('finish'),
    client
      .from('gate_options')
      .select('id, slug, name, flat_price_gbp, per_unit_price_gbp, unit_type, notes')
      .order('name'),
    client
      .from('fencing_panels')
      .select('id, style, finish, base_price_gbp, price_per_m2_gbp, notes')
      .order('style'),
  ])

  // Marius confirmed/corrected gate prices from the latest intake session
  const intakeSeeds: Record<string, IntakeGateSeed> = {}
  const session = await getLatestIntakeSession()
  if (session) {
    const answers = await getIntakeAnswers(session.id)
    for (const a of answers) {
      const gateType = INTAKE_GATE_MAP[a.question_id]
      if (!gateType || !a.value_json || typeof a.value_json !== 'object') continue
      const v = a.value_json as Record<string, unknown>
      intakeSeeds[gateType] = {
        status: a.status,
        source: a.source,
        choice: typeof v.choice === 'string' ? v.choice : null,
        note: typeof v.note === 'string' ? v.note : '',
        victorian_auto_gbp: typeof v.victorian_auto_gbp === 'number' ? v.victorian_auto_gbp : null,
        victorian_manual_gbp:
          typeof v.victorian_manual_gbp === 'number' ? v.victorian_manual_gbp : null,
        composite_auto_gbp: typeof v.composite_auto_gbp === 'number' ? v.composite_auto_gbp : null,
        composite_manual_gbp:
          typeof v.composite_manual_gbp === 'number' ? v.composite_manual_gbp : null,
      }
    }
  }

  const loadError = gatesRes.error?.message ?? optionsRes.error?.message ?? fencingRes.error?.message

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
        Gestione Prezzi
      </p>
      <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a]">
        Listino Master
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-500">
        Tutti i prezzi in un posto solo: cancelli, opzioni decorative e recinzioni. Modifica
        inline, e dove Marius ha confermato un dato nell’intake lo vedi accanto al valore attuale.
      </p>

      {loadError && (
        <p className="mt-4 font-mono text-xs text-[#ba1a1a]">Errore caricamento: {loadError}</p>
      )}

      <ListinoBoard
        gates={gatesRes.data ?? []}
        options={optionsRes.data ?? []}
        fencing={fencingRes.data ?? []}
        intakeSeeds={intakeSeeds}
      />
    </main>
  )
}
