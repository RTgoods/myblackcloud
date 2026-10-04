import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Only this account can see/use this page — checked server-side here, not
// just hidden in the sidebar.
const ADMIN_EMAIL = 'g00dsman@yahoo.com'

// Keep in sync with EVENT_KINDS in public/game/assets/js/game.js.
const EVENTS: { kind: string; label: string }[] = [
  { kind: 'power', label: 'Power Bump' },
  { kind: 'party', label: 'Another Birthday Party' },
  { kind: 'heyrt', label: 'Hey RT' },
  { kind: 'clean', label: 'Not My Mess' },
  { kind: 'od', label: 'OD in the Bathroom' },
  { kind: 'ortx', label: 'OR Transport' },
  { kind: 'high', label: 'Contact High' },
  { kind: 'zomb', label: "It's Going Around" },
  { kind: 'fire', label: 'Smoking Cessation' },
  { kind: 'bugs', label: 'Bed Bug Stomp' },
  { kind: 'fight', label: "It's Kicked Off" },
  { kind: 'rant', label: 'A Word, Please' },
  { kind: 'niv', label: 'Baby Needs NIV' },
]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  return (
    <div className="min-h-screen px-4 py-16" style={{ background: '#06090C' }}>
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-block mb-6 py-2 text-sm font-bold" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud Main</Link>

        <div className="text-center mb-8">
          <p className="text-[11px] font-black tracking-[3px] uppercase mb-3" style={{ color: '#C9A227' }}>Admin</p>
          <h1 className="font-black uppercase" style={{ fontSize: 26, letterSpacing: 4, color: '#D7E3EC' }}>Black Cloud Event Test Links</h1>
          <p className="mt-2 text-[12px]" style={{ color: '#5C6D7A' }}>
            Each link launches Level 1 and forces that event to fire immediately, instead of waiting on the random trigger.
          </p>
        </div>

        <div className="rounded-sm p-6" style={{ background: '#0C1116', border: '1px solid #1D2831', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <div className="grid gap-3 sm:grid-cols-2">
            {EVENTS.map((e) => (
              <Link
                key={e.kind}
                href={`/play?level=1&event=${e.kind}`}
                className="rounded-sm px-4 py-3 text-center text-[11px] font-black uppercase tracking-[1px] transition hover:-translate-y-0.5"
                style={{
                  background: 'rgba(56,214,224,0.06)',
                  border: '1px solid rgba(56,214,224,0.25)',
                  color: '#38D6E0',
                }}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
