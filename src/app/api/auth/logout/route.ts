import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Only the site's own account controls may end this browser's session.
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) return NextResponse.json({ error: 'Could not sign out' }, { status: 503 })
  return NextResponse.json({ signedOut: true }, { headers: { 'Cache-Control': 'no-store' } })
}
