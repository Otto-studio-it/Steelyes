'use server'

import { redirect } from 'next/navigation'
import { userIsAdmin } from '@/lib/admin/user-is-admin'
import { getServerClient } from '@/lib/supabase/server'

export type AdminAuthState = {
  error: string | null
}

function normalizeRedirectTo(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return '/admin/dashboard'
  return value.startsWith('/admin') ? value : '/admin/dashboard'
}

export async function loginAdmin(
  _prevState: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const rawEmail = formData.get('email')
  const rawPassword = formData.get('password')
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''
  const password = typeof rawPassword === 'string' ? rawPassword : ''
  const redirectTo = normalizeRedirectTo(formData.get('redirectTo'))

  if (!email || !password) {
    return { error: 'Inserisci email e password.' }
  }

  const supabase = await getServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    // Network / paused project surfaces as fetch failure — don't pretend it's bad credentials.
    const msg = (error?.message || '').toLowerCase()
    if (msg.includes('fetch') || msg.includes('network') || error?.name === 'AuthRetryableFetchError') {
      return {
        error:
          'Impossibile raggiungere Supabase (progetto pausato o rete). Controlla NEXT_PUBLIC_SUPABASE_URL e lo stato del progetto.',
      }
    }
    return { error: 'Email o password errati.' }
  }

  if (!userIsAdmin(data.user)) {
    await supabase.auth.signOut()
    return { error: 'Account non autorizzato come admin.' }
  }

  redirect(redirectTo)
}

export async function logoutAdmin() {
  const supabase = await getServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
