import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { gameAccess } from '@/lib/game-access'
import { leaderboardLimiter, checkLimit } from '@/lib/rate-limit'
import { isValidCleanShift, isValidCodesSurvived, isValidLevel, isValidTotalDischarged } from '@/lib/progress-validation'

const TOP_N = 25

// GET /api/leaderboard — public top-N, no auth required
export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1'
  const { success } = await checkLimit(leaderboardLimiter, ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('display_name, score, level_reached, total_codes_survived, clean_shifts, created_at')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(TOP_N)

  if (error) return NextResponse.json({ error: 'Leaderboard unavailable' }, { status: 503 })
  return NextResponse.json({ entries: data ?? [] })
}

// POST /api/leaderboard — submit/update the current user's best score
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { success } = await checkLimit(leaderboardLimiter, user.id)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const access = await gameAccess(supabase, user)

  const body = await req.json() as { score?: number; levelReached?: number; codesSurvived?: number; cleanShift?: boolean }
  const { score = 0, levelReached, codesSurvived = 0, cleanShift = false } = body

  if (!isValidLevel(levelReached)) return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  if (!isValidTotalDischarged(score)) return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  if (!isValidCodesSurvived(codesSurvived)) return NextResponse.json({ error: 'Invalid codes survived' }, { status: 400 })
  if (!isValidCleanShift(cleanShift)) return NextResponse.json({ error: 'Invalid clean shift' }, { status: 400 })
  if (levelReached > 1 && !access.allowed) return NextResponse.json({ error: 'Purchase required' }, { status: 403 })

  const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle()
  const displayName = profile?.display_name?.trim() || user.email?.split('@')[0] || 'Player'

  const { error } = await createAdminClient().rpc('submit_leaderboard_score', {
    p_user_id: user.id, p_display_name: displayName, p_score: score, p_level_reached: levelReached,
    p_codes_survived: codesSurvived, p_clean_shift: cleanShift,
  })
  if (error) return NextResponse.json({ error: 'Leaderboard unavailable' }, { status: 503 })
  return NextResponse.json({ ok: true })
}
