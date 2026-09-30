import { middlewareLimiter, checkLimit } from './lib/rate-limit'
import { NextResponse, type NextRequest } from 'next/server'

// The game's own HTML/JS is public (level 1 is free, even for guests) — it is
// never gated at the file level. The real boundary is server-side, in the
// /api/access, /api/progress and /api/leaderboard routes: levels 2-8 only
// persist if the requesting user has a completed purchase. This middleware's
// only job is the highest-leverage, cheapest-to-apply defense: an IP rate
// limit ahead of every request, before any Supabase call is made.
export async function middleware(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1'
  const { success } = await checkLimit(middlewareLimiter, ip)
  if (!success) return new NextResponse('Too many requests', { status: 429 })
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
