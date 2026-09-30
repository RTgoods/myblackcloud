import Link from 'next/link'

export function Footer() {
  return (
    <footer className="px-4 py-10 text-center text-[11px] tracking-[1px]" style={{ color: '#5C6D7A', borderTop: '1px solid #1D2831' }}>
      <div className="flex justify-center gap-5 mb-3">
        <Link href="/privacy" style={{ color: 'inherit' }}>Privacy</Link>
        <Link href="/terms" style={{ color: 'inherit' }}>Terms</Link>
        <Link href="/leaderboard" style={{ color: 'inherit' }}>Leaderboard</Link>
      </div>
      <p>© {new Date().getFullYear()} MyBlackCloud</p>
    </footer>
  )
}
