import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable } from '@/components/LeaderboardTable'

export const metadata = { title: 'Leaderboard — MyBlackCloud' }
export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leaderboard_entries')
    .select('display_name, score, level_reached, total_codes_survived, clean_shifts, created_at')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(25)

  return (
    <div className="min-h-screen px-4 py-16" style={{ background: '#06090C' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8 text-sm" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud</Link>
        <p className="text-[11px] font-black tracking-[3px] uppercase mb-2" style={{ color: '#C9A227' }}>TOP OPERATORS</p>
        <h1 className="font-black uppercase mb-8" style={{ fontSize: 32, letterSpacing: 3, color: '#D7E3EC' }}>Leaderboard</h1>
        <div className="rounded-sm p-6" style={{ background: '#0C1116', border: '1px solid #1D2831' }}>
          <LeaderboardTable entries={data ?? []} />
        </div>
      </div>
    </div>
  )
}
