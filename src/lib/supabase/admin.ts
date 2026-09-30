import { createClient } from '@supabase/supabase-js'

// Only import in server routes/components. Never expose the service role to clients.
// Deliberately untyped (no <Database> generic): RPC calls (save_level_progress,
// submit_leaderboard_score, reserve_checkout, reset_level_progress) aren't
// represented in Database['public']['Functions'], and typing this client would
// make every .rpc() call a compile error.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
