import Link from 'next/link'

export function Footer() {
  return (
    <footer
      className="flex flex-col items-center gap-3 px-4 py-10 text-center text-[11px] tracking-[1px]"
      style={{ color: '#5C6D7A', borderTop: '1px solid #1D2831', background: '#0a0d10' }}
    >
      <p className="font-black uppercase tracking-[2px]" style={{ color: '#D0A34B' }}>
        Original browser game · Buy once · Play forever
      </p>
      <p>
        Payments secured by <span style={{ color: '#38D6E0' }}>Stripe</span>
      </p>
      <div className="flex gap-4">
        <Link href="/terms" style={{ color: 'inherit' }}>Terms</Link>
        <Link href="/privacy" style={{ color: 'inherit' }}>Privacy</Link>
      </div>
      <p>© {new Date().getFullYear()} MyBlackCloud</p>
    </footer>
  )
}
