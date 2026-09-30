import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { gameAccess } from '@/lib/game-access'
import { SignOutButton } from './SignOutButton'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const access = user ? await gameAccess(supabase, user) : null

  return (
    <header className="px-4 py-4" style={{ borderBottom: '1px solid #1D2831' }}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-black uppercase" style={{ color: '#D7E3EC', letterSpacing: 3, fontSize: 15 }}>
          My<span style={{ color: '#38D6E0' }}>Black</span>Cloud
        </Link>
        <nav className="flex items-center gap-5 text-[12px] uppercase tracking-[1px]" style={{ color: '#9fb0bc' }}>
          <Link href="/leaderboard" style={{ color: 'inherit' }}>Leaderboard</Link>
          {user ? (
            <>
              <span style={{ color: access?.allowed ? '#35E07F' : 'inherit' }}>
                {user.email} {access?.allowed ? '· Unlocked' : '· Level 1 free'}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/auth/login" style={{ color: 'inherit' }}>Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
