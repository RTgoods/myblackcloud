import Link from 'next/link'

export const metadata = { title: 'Terms of Service — MyBlackCloud' }

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-16" style={{ background: '#06090C' }}>
      <div className="max-w-2xl mx-auto" style={{ color: '#D7E3EC' }}>
        <Link href="/" className="inline-block mb-8 text-sm" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud</Link>
        <h1 className="font-black uppercase mb-6" style={{ fontSize: 28, letterSpacing: 2 }}>Terms of Service</h1>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#9fb0bc' }}>
          <p>MyBlackCloud is a browser game. Level 1 is free to play. A one-time payment unlocks the remaining levels for your account.</p>
          <p>Purchases are final. If something went wrong with your payment or access, contact support via the address on our home page.</p>
          <p>Don&apos;t attempt to bypass access controls, automate gameplay, or interfere with other players&apos; use of the site.</p>
          <p>The game is provided as-is, without warranty. We may update or take down the service at any time.</p>
          <p style={{ color: '#5C6D7A' }}>This is placeholder terms text — replace with your reviewed terms before launch.</p>
        </div>
      </div>
    </div>
  )
}
