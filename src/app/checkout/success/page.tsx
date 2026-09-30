import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { checkoutStatus, type CheckoutStatus } from '@/lib/checkout-status'

export const metadata = { title: 'Payment Status — MyBlackCloud' }
export const dynamic = 'force-dynamic'

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) redirect(`/auth/login?redirect=${encodeURIComponent('/checkout/success' + (sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ''))}`)
  const status: CheckoutStatus = sessionId ? await checkoutStatus(db, stripe, user.id, sessionId) : 'invalid'
  const confirmed = status === 'confirmed'
  const message = {
    confirmed: 'Purchase confirmed. All 8 shifts are unlocked.',
    pending: 'We are waiting for payment and access confirmation. Please do not pay again — refresh in a moment.',
    unpaid: 'This checkout has not been paid. Return home to try again.',
    invalid: 'No valid checkout was found for your account.',
    unavailable: 'We could not verify your payment right now. Please check again before paying.',
  }[status]

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 py-16" style={{ background: '#06090C' }}>
      <div className="max-w-md w-full">
        <div className="h-0.5 mb-10 mx-auto w-24" style={{ background: 'linear-gradient(90deg, transparent, #38D6E0, transparent)' }} />
        <p className="mb-4 text-[10px] font-black tracking-[3px] uppercase" style={{ color: '#35E07F' }}>
          {confirmed ? 'FULL ACCESS READY' : 'PAYMENT STATUS'}
        </p>
        <h1 className="font-black uppercase leading-none mb-6" style={{ fontSize: 'clamp(32px, 8vw, 52px)', letterSpacing: '0.1em', color: '#D7E3EC' }}>
          {confirmed ? 'GOOD TO GO' : 'CHECKOUT'}
        </h1>
        <p className="mb-10 text-[12px] tracking-[1px]" style={{ color: '#5C6D7A' }}>{message}</p>
        <Link
          href={confirmed ? '/game' : '/'}
          className="inline-block rounded-sm font-black uppercase"
          style={{ background: 'linear-gradient(180deg,#38D6E0 0%,#1FA9B3 100%)', color: '#06090C', padding: '14px 40px', fontSize: 13, letterSpacing: 3 }}
        >
          {confirmed ? 'Start Your Shift' : 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}
