import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — MyBlackCloud' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-16" style={{ background: '#06090C' }}>
      <div className="max-w-2xl mx-auto" style={{ color: '#D7E3EC' }}>
        <Link href="/" className="inline-block mb-8 text-sm" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud</Link>
        <h1 className="font-black uppercase mb-6" style={{ fontSize: 28, letterSpacing: 2 }}>Privacy Policy</h1>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#9fb0bc' }}>
          <p>We collect the account information you provide (email address) and gameplay data needed to run the game: level progress, in-game stats, and leaderboard scores.</p>
          <p>Payment is processed by Stripe. We never see or store your card details — Stripe handles that directly.</p>
          <p>We do not sell your data. We use it only to run MyBlackCloud: authenticate you, save your progress, and process your purchase.</p>
          <p>Contact us with any privacy questions via the support address on our home page.</p>
          <p style={{ color: '#5C6D7A' }}>This is placeholder policy text — replace with your reviewed policy before launch.</p>
        </div>
      </div>
    </div>
  )
}
