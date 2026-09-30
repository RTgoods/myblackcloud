import type { User } from '@supabase/supabase-js'
import type { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Only trusted Auth app_metadata may grant administrator access.
export function isGameAdmin(user: User | null) {
  return user?.app_metadata?.role === 'admin'
}

export async function gameAccess(db: ReturnType<typeof createServerClient<Database>>, user: User | null) {
  if (!user) return { allowed: false, isAdmin: false }
  const isAdmin = isGameAdmin(user)
  if (isAdmin) return { allowed: true, isAdmin: true }
  const { data: purchase, error } = await db.from('purchases').select('id').eq('user_id', user.id).eq('status', 'completed').maybeSingle()
  return { unavailable: !!error, allowed: !error && !!purchase, isAdmin: false }
}
