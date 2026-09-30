import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { gameAccess } from '@/lib/game-access'
import { progressLimiter, checkLimit } from '@/lib/rate-limit'
import { isValidLevel, isValidTotalDischarged } from '@/lib/progress-validation'
import type { LevelStat } from '@/types/database'

// GET /api/progress — return completed levels + stats for the current user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { success } = await checkLimit(progressLimiter, user.id)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { data, error } = await createAdminClient()
    .from('progress')
    .select('completed_levels, level_stats, reset_version')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'Progress unavailable' }, { status: 503 })
  const completedLevels: number[] = data?.completed_levels ?? []
  const levelStats: Record<string, LevelStat> = data?.level_stats ?? {}
  return NextResponse.json({ completedLevels, levelStats, resetVersion: data?.reset_version ?? 0 })
}

// POST /api/progress — upsert a completed level + save its stats
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { success } = await checkLimit(progressLimiter, user.id)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const access = await gameAccess(supabase, user)

  const body = await req.json() as {
    level: number
    totalDischarged?: number
    resetVersion?: number
  }
  const { level, totalDischarged = 0, resetVersion = 0 } = body

  if (!isValidLevel(level)) return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  if (!Number.isInteger(resetVersion) || resetVersion < 0) return NextResponse.json({ error: 'Invalid reset version' }, { status: 400 })
  if (!isValidTotalDischarged(totalDischarged)) return NextResponse.json({ error: 'Invalid stats' }, { status: 400 })
  if (level > 1 && !access.allowed) return NextResponse.json({ error: 'Purchase required' }, { status: 403 })

  const stat: LevelStat = { totalDischarged, completedAt: new Date().toISOString() }
  const { data, error } = await createAdminClient().rpc('save_level_progress', {
    p_user_id: user.id, p_level: level, p_stat: stat,
    p_reset_version: resetVersion, p_is_admin: access.isAdmin,
  })
  if (error) return NextResponse.json({ error: 'Progress unavailable' }, { status: 503 })
  if (data?.error === 'stale_progress') return NextResponse.json(data, { status: 409 })
  if (data?.error === 'purchase_required') return NextResponse.json({ error: 'Purchase required' }, { status: 403 })
  return NextResponse.json(data)
}

// DELETE /api/progress — reset all progress
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { success } = await checkLimit(progressLimiter, user.id)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { data, error } = await createAdminClient().rpc('reset_level_progress', { p_user_id: user.id })
  if (error) return NextResponse.json({ error: 'Could not reset progress' }, { status: 503 })
  return NextResponse.json(data)
}
