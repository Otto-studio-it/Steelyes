import type { User } from '@supabase/supabase-js'

/**
 * Admin flag lives in `app_metadata.is_admin` only — that field can be written just by the
 * service role / Supabase dashboard. `user_metadata` is user-editable (signUp / updateUser
 * with the public anon key), so it must never grant privileges.
 */
export function userIsAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  return user.app_metadata?.is_admin === true
}
