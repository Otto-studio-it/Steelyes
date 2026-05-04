import type { User } from '@supabase/supabase-js'

/**
 * Admin flag: prefer `app_metadata.is_admin` (only service role / dashboard can set).
 * `user_metadata.is_admin` is still accepted for backward compatibility — remove once
 * every admin user has `app_metadata.is_admin` in Supabase Auth (User → raw app metadata).
 */
export function userIsAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  if (user.app_metadata?.is_admin === true) return true
  return user.user_metadata?.is_admin === true
}
