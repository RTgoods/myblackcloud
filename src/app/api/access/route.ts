import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gameAccess } from '@/lib/game-access'
import { accessLimiter, checkLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1'
  const { success } = await checkLimit(accessLimiter, ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const db = await createClient()
  const { data: { user }, error } = await db.auth.getUser()
  if (error && error.name !== 'AuthSessionMissingError') return NextResponse.json({ error: 'Access service unavailable' }, { status: 503 })
  const access = await gameAccess(db, user)
  if ('unavailable' in access && access.unavailable) return NextResponse.json({ error: 'Access service unavailable' }, { status: 503 })

  let role: 'RT' | 'RN' | null = null
  let gender: 'male' | 'female' | null = null
  if (user) {
    const { data: profile } = await db.from('profiles').select('role, gender').eq('id', user.id).maybeSingle()
    role = profile?.role ?? null
    gender = profile?.gender ?? null
  }

  return NextResponse.json(
    { ...access, role, gender, user: user ? { id: user.id, email: user.email } : null },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
