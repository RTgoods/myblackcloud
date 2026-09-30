import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { PRICE_CENTS } from '@/lib/pricing'
import { checkoutLimiter, checkLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkoutSession, CheckoutError } from '@/lib/checkout-session'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { success } = await checkLimit(checkoutLimiter, user.id)
  if (!success) return NextResponse.json({ error: 'Too many requests, please slow down.' }, { status: 429 })

  // Prevent duplicate purchases
  const { data: rawExisting, error: purchaseError } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (purchaseError) return NextResponse.json({ error: 'Checkout unavailable' }, { status: 503 })
  const existing = rawExisting as { id: string } | null
  if (existing) {
    return NextResponse.json({ error: 'Already purchased' }, { status: 409 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (request.headers.get('origin') ?? 'http://localhost:3000')

  let session
  try {
    session = await checkoutSession(createAdminClient(), stripe, user.id, {
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MyBlackCloud — Full Access',
              description: 'One-time unlock for all 8 shifts.',
            },
            unit_amount: PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('Stripe checkout session error:', message)
    return NextResponse.json({ error: err instanceof CheckoutError ? err.message : 'Checkout unavailable. Please try again.' }, { status: err instanceof CheckoutError ? err.status : 503 })
  }

  return NextResponse.json({ url: session.url })
}
