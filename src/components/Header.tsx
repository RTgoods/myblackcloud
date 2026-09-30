import Link from 'next/link'

export function Header() {
  return (
    <header className="px-4 py-4" style={{ borderBottom: '1px solid #1D2831' }}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-black uppercase" style={{ color: '#D7E3EC', letterSpacing: 3, fontSize: 15 }}>
          My<span style={{ color: '#38D6E0' }}>Black</span>Cloud
        </Link>
        <nav className="flex items-center gap-5 text-[12px] uppercase tracking-[1px]" style={{ color: '#9fb0bc' }}>
          <Link href="/leaderboard" style={{ color: 'inherit' }}>Leaderboard</Link>
          <Link href="/auth/login" style={{ color: 'inherit' }}>Sign In</Link>
        </nav>
      </div>
    </header>
  )
}
