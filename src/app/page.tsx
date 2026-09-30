import { createClient } from '@/lib/supabase/server'
import { gameAccess } from '@/lib/game-access'
import { BuyButton } from '@/components/BuyButton'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const access = await gameAccess(supabase, user)

  return (
    <div style={{ background: '#06090C', color: '#D7E3EC' }}>
      <section className="px-4 py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-black tracking-[4px] uppercase mb-4" style={{ color: '#C9A227' }}>
            One fanny pack. An ICU that hides everything.
          </p>
          <h1 className="font-black uppercase leading-none mb-6" style={{ fontSize: 'clamp(40px, 9vw, 72px)', letterSpacing: '0.08em' }}>
            SHIFT
          </h1>
          <p className="mb-10 text-[15px] leading-relaxed" style={{ color: '#9fb0bc' }}>
            Pick your badge — <b style={{ color: '#38D6E0' }}>RT</b> or <b style={{ color: '#D7E3EC' }}>RN</b> — and clock in.
            Triage patients, manage airways and lines, dodge black-cloud events, and clear the unit
            across 8 escalating levels. Level 1 is free. No installs, runs right in your browser.
          </p>
          <BuyButton userId={user?.id} hasPurchased={access.allowed} />
        </div>
      </section>

      <section className="px-4 py-16" style={{ borderTop: '1px solid #1D2831' }}>
        <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <p className="font-black uppercase mb-2" style={{ color: '#38D6E0', letterSpacing: 1 }}>8 shifts</p>
            <p style={{ color: '#9fb0bc' }}>Each level adds patients, more concurrent beds, and new black-cloud events to survive.</p>
          </div>
          <div>
            <p className="font-black uppercase mb-2" style={{ color: '#C9A227', letterSpacing: 1 }}>Cloud save</p>
            <p style={{ color: '#9fb0bc' }}>Sign in and your progress follows you — pick up your shift from any device.</p>
          </div>
          <div>
            <p className="font-black uppercase mb-2" style={{ color: '#35E07F', letterSpacing: 1 }}>Leaderboard</p>
            <p style={{ color: '#9fb0bc' }}>Every discharge counts toward your best run. See where you rank.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
