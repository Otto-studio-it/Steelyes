import { userIsAdmin } from '@/lib/admin/user-is-admin'
import { getServerClient } from '@/lib/supabase/server'

/** Call at the start of every admin Server Action before using the service role client. */
export async function requireAdmin(): Promise<{ error: string } | null> {
  const supabase = await getServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return { error: 'Non autenticato.' }
  if (!userIsAdmin(user)) return { error: 'Non autorizzato.' }

  return null
}
