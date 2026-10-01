import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { gameAccess } from '@/lib/game-access'
import { BuyButton } from '@/components/BuyButton'
import { formatPrice } from '@/lib/pricing'
import heroImage from '../../public/images/shift-hero.webp'
import patientRadarImage from '../../public/images/patient-radar.webp'
import toolGrabImage from '../../public/images/tool-grab.webp'
import clearShiftImage from '../../public/images/clear-shift.webp'

export const dynamic = 'force-dynamic'

const playSteps = [
  {
    number: '01',
    title: 'Get the patient on your radar',
    description:
      'Read the room, watch the black-cloud pressure meter, and identify the patient who needs the next intervention before the clock runs out.',
    image: patientRadarImage,
  },
  {
    number: '02',
    title: 'Grab the right tool',
    description:
      'Use the right equipment for the right patient, keep your bag stocked, and move quickly through the hallway before alerts stack up.',
    image: toolGrabImage,
  },
  {
    number: '03',
    title: 'Clear the shift',
    description:
      'Stabilize the unit, finish each task cleanly, and unlock the next level when your score and speed are high enough to survive the chaos.',
    image: clearShiftImage,
  },
]

const fieldGuide = [
  {
    index: '01',
    name: 'Blue Can',
    category: 'Power-up',
    price: '8 coins',
    description: 'Get an 8-second speed rush and restore 25 energy.',
    icon: 'can',
    color: '#4A9CE0',
  },
  {
    index: '02',
    name: 'Green Can',
    category: 'Power-up',
    price: '16 coins',
    description: 'Get an 11-second speed rush and restore 50 energy.',
    icon: 'can',
    color: '#8FE04A',
  },
  {
    index: '03',
    name: 'Amber Can',
    category: 'Power-up',
    price: '26 coins',
    description: 'Get a 15-second speed rush and restore 75 energy.',
    icon: 'can',
    color: '#F2A03D',
  },
  {
    index: '04',
    name: 'Violet Can',
    category: 'Power-up',
    price: '40 coins',
    description: 'Get a 20-second speed rush and refill your energy.',
    icon: 'can',
    color: '#C96BD8',
  },
  {
    index: '05',
    name: 'Full Tank',
    category: 'Power-up',
    price: '18 coins',
    description: 'Restore your energy to its current maximum.',
    icon: 'battery',
    color: '#38D6E0',
  },
  {
    index: '06',
    name: 'Second Wind',
    category: 'Power-up',
    price: '22 coins',
    description: 'Sprint at full speed for 20 seconds.',
    icon: 'bolt',
    color: '#8FE04A',
  },
  {
    index: '07',
    name: 'Loaded Kit',
    category: 'Power-up',
    price: '24 coins',
    description: 'Adds missing supplies for the bed you are working at.',
    icon: 'kit',
    color: '#D9B44A',
  },
  {
    index: '08',
    name: 'Charge Nurse',
    category: 'Power-up',
    price: '34 coins',
    description: 'Clears floor distractions and adds 25 seconds to patient timers.',
    icon: 'hand',
    color: '#F2C94D',
  },
  {
    index: '09',
    name: 'A Friend',
    category: 'Power-up',
    price: '50 coins',
    description: 'Calls in another RT to help cover the most urgent bed.',
    icon: 'friend',
    color: '#7FD4E0',
  },
  {
    index: '10',
    name: 'Second Chance',
    category: 'Power-up',
    price: '120 coins',
    description: 'Keep going after a loss. It activates when you need it.',
    icon: 'skull',
    color: '#D8D2C8',
  },
  {
    index: '11',
    name: 'Bigger Pack',
    category: 'Permanent upgrade',
    price: '70 coins',
    description: 'Permanently adds two slots, for eight items in your pack.',
    icon: 'pack',
    color: '#D9B44A',
  },
  {
    index: '12',
    name: 'Deep Reserves',
    category: 'Permanent upgrade',
    price: '90 coins',
    description: 'Permanently raises your maximum energy from 100 to 150.',
    icon: 'deepBattery',
    color: '#38D6E0',
  },
]

function ItemIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-10 w-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
      {icon === 'can' && (
        <>
          <rect x="23" y="9" width="18" height="46" rx="5" fill="#26343d" stroke="#c3d2db" strokeWidth="2" />
          <path d="M25 25h14v15H25z" fill={color} />
          <path d="M34 27l-5 7h4l-2 5 7-8h-4l2-4z" fill="white" />
          <path d="M27 6h10v4H27z" rx="2" fill="#d2dbe0" />
        </>
      )}
      {icon === 'battery' && (
        <>
          <rect x="18" y="12" width="28" height="42" rx="5" fill="#1a2830" stroke={color} strokeWidth="3" />
          <path d="M26 7h12v6H26z" fill="#1a2830" stroke={color} strokeWidth="2" />
          <path d="M35 20l-10 15h8l-4 11 13-17h-8l4-9z" fill={color} />
        </>
      )}
      {icon === 'bolt' && <path d="M36 5 15 35h14l-3 24 24-34H35l1-20z" fill={color} stroke="#eff7fa" strokeWidth="2" strokeLinejoin="round" />}
      {icon === 'kit' && (
        <>
          <rect x="12" y="22" width="40" height="30" rx="6" fill={color} stroke="#f0d67a" strokeWidth="2" />
          <path d="M23 22v-7h18v7M12 34h40M29 29h6v11h-6zM26.5 31.5h11v6h-11z" fill="#26343d" stroke="#26343d" strokeWidth="2" />
        </>
      )}
      {icon === 'hand' && (
        <>
          <path d="M17 34V17a3 3 0 0 1 6 0v12-18a3 3 0 0 1 6 0v18-16a3 3 0 0 1 6 0v17-12a3 3 0 0 1 6 0v17l3-5a4 4 0 0 1 7 4l-8 14H26L15 41a5 5 0 0 1 2-7z" fill={color} stroke="#806515" strokeWidth="2" strokeLinejoin="round" />
        </>
      )}
      {icon === 'friend' && (
        <>
          <circle cx="22" cy="19" r="8" fill={color} />
          <circle cx="43" cy="19" r="8" fill="#b8ecf2" />
          <path d="M8 51c0-12 5-19 14-19s14 7 14 19H8zm21 0c0-9 5-15 13-15s14 6 14 15H29z" fill={color} stroke="#18383d" strokeWidth="2" />
        </>
      )}
      {icon === 'skull' && (
        <>
          <path d="m10 45 44-28M10 17l44 28" stroke="#c9c2b4" strokeWidth="5" strokeLinecap="round" />
          <path d="M32 9c-12 0-20 9-20 20 0 7 4 12 10 15v9h20v-9c6-3 10-8 10-15 0-11-8-20-20-20z" fill={color} stroke="#8e877a" strokeWidth="2" />
          <ellipse cx="25" cy="29" rx="4" ry="6" fill="#1a1814" />
          <ellipse cx="39" cy="29" rx="4" ry="6" fill="#1a1814" />
          <path d="m32 34-3 5h6zM25 47v6m7-6v6m7-6v6" stroke="#1a1814" strokeWidth="2" />
        </>
      )}
      {icon === 'pack' && (
        <>
          <path d="M22 20v-6a10 10 0 0 1 20 0v6" fill="none" stroke="#f0d67a" strokeWidth="4" />
          <rect x="12" y="19" width="40" height="34" rx="8" fill={color} stroke="#f0d67a" strokeWidth="2" />
          <path d="M19 27h26v17H19z" fill="#8c711e" />
          <path d="M29 31h6v9h-6zm-2 2h10v5H27z" fill="#8fe04a" />
        </>
      )}
      {icon === 'deepBattery' && (
        <>
          <rect x="19" y="11" width="26" height="44" rx="5" fill="#1a2830" stroke={color} strokeWidth="3" />
          <path d="M26 6h12v6H26z" fill="#1a2830" stroke={color} strokeWidth="2" />
          <path d="M24 40h16v10H24z" fill={color} />
          <path d="M35 16 25 31h8l-3 10 13-17h-8l4-8z" fill={color} />
        </>
      )}
    </svg>
  )
}

const missionSpecs = [
  { label: 'Platform', value: 'Any browser' },
  { label: 'Genre', value: 'ICU shift simulator' },
  { label: 'Levels', value: '8 shifts + boss rounds' },
  { label: 'Install', value: 'None required' },
]

function PurchaseNote() {
  return (
    <p
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs font-medium tracking-[0.04em] text-white"
      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.95)' }}
    >
      <span>One-time payment</span>
      <span aria-hidden="true" className="text-[#38d6e0]">·</span>
      <span>Instant access</span>
      <span aria-hidden="true" className="text-[#38d6e0]">·</span>
      <span>Level 1 is always free</span>
    </p>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const access = await gameAccess(supabase, user)

  return (
    <main className="min-h-screen bg-[#070b0d] text-[#ecf4fb]">
      <section className="relative w-full overflow-hidden bg-[#06090c]">
        <Image
          src={heroImage}
          alt="MyBlackCloud hospital hallway art with a dark cloud and healthcare staff"
          priority
          className="h-auto w-full object-contain brightness-110"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(6, 9, 12, 0.55) 72%, #06090c 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 py-5 sm:px-6 md:px-8 xl:px-10">
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-3">
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={user ? '/play?level=1' : '/auth/login?mode=signup'}
                className="inline-flex min-h-[52px] items-center justify-center rounded-[4px] px-7 text-[11px] font-black uppercase tracking-[3px] text-[#06090c] shadow-[0_12px_30px_rgba(53,224,127,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                style={{ background: 'linear-gradient(180deg,#6FE0A8 0%,#2BA86B 100%)' }}
              >
                {user ? 'Play Level 1 Free' : 'Sign Up to Play Level 1 Free'}
              </Link>

              <div className="inline-flex min-h-[52px] items-center justify-center">
                <BuyButton userId={user?.id} hasPurchased={access.allowed} />
              </div>
            </div>
            {!access.allowed && <PurchaseNote />}
          </div>
        </div>
      </section>

      <section className="bg-[#06090c] px-4 pt-5 pb-6 sm:px-6 sm:pt-6 md:px-8 xl:px-10 lg:pt-8 lg:pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[3px] text-[#d6b36b]">About This Game</p>
          <p className="text-base leading-7 text-[#c3ced5] md:text-lg">
            SHIFT is a browser-based ICU time-management game. Bounce between patients, handle the black-cloud events
            that disrupt your unit, and keep every bed stable before the next alarm fires. Responsive
            controls work on desktop, tablet, and mobile — no install, no plugins.
          </p>
          <p className="mt-4 text-base leading-7 text-[#c3ced5] md:text-lg">
            Level 1 is free. Unlock all 8 levels for {formatPrice()} and your progress is saved to your account.
          </p>
        </div>
      </section>

      <section className="border-b border-[#2a2e31] bg-black px-4 pt-6 pb-14 sm:px-6 md:px-8 lg:pt-8 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-[3px] text-[#38d6e0]">How to Play</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {playSteps.map((step) => (
              <article
                key={step.number}
                className="overflow-hidden rounded-[10px] border border-[#272d31] bg-[#0f1417] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
              >
                <div className="relative h-52 w-full overflow-hidden border-b border-[#272d31] bg-[#0b0f12]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[3px] text-[#d6b36b]">Step {step.number}</span>
                    <span className="rounded-full border border-[#1e3a42] bg-[#0d1d22] px-2 py-1 text-[9px] font-bold uppercase tracking-[2px] text-[#38d6e0]">
                      ICU run
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-black uppercase leading-tight text-white">{step.title}</h3>
                  <p className="text-sm leading-6 text-[#aab5bc]">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0d10] px-4 py-14 sm:px-6 md:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[3px] text-[#d6b36b]">Field Guide</p>
              <h2 className="text-3xl font-black uppercase text-white md:text-4xl">Choose the gear that survives the shift.</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[2px] text-[#ced7dd]">
              <span className="rounded-full border border-[#2a3c47] bg-[#0d1b20] px-3 py-2 text-[#38d6e0]">Power-ups</span>
              <span className="rounded-full border border-[#403425] bg-[#1d160f] px-3 py-2 text-[#d6b36b]">Permanent upgrades</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fieldGuide.map((item) => (
              <article
                key={item.name}
                className="flex min-h-[220px] flex-col rounded-[8px] border border-[#2a2f34] bg-[#0d1115] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px] border border-[#2a2f34] bg-[#111a1e]">
                    <ItemIcon icon={item.icon} color={item.color} />
                  </div>
                  <span className={`text-right text-[9px] font-black uppercase tracking-[1.5px] ${item.category === 'Permanent upgrade' ? 'text-[#d6b36b]' : 'text-[#38d6e0]'}`}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-base font-black uppercase leading-tight text-white">{item.name}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[1px] text-[#d6b36b]">{item.price}</p>
                <p className="mt-2 text-xs leading-5 text-[#9eaab0]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2a2e31] bg-[#0f1417] px-4 py-10 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-10 gap-y-4">
          {missionSpecs.map((spec) => (
            <div key={spec.label} className="min-w-[140px]">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-[#5c6d7a]">{spec.label}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[1px] text-[#dfeaf4]">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2a2e31] bg-[#0f1417] px-4 py-14 sm:px-6 md:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-[18px] border border-[#2d363d] bg-[linear-gradient(135deg,#10181d_0%,#0c1115_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-[3px] text-[#d6b36b]">Ready to start</span>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black uppercase leading-tight text-white md:text-5xl">
                Save the unit. Unlock the full game.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#aab5bc]">
                Start with the free opening shift, then unlock all eight levels for {formatPrice()} and keep your progress tied to your account.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 md:items-end">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href={user ? '/play' : '/auth/login?mode=signup'}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-[4px] border border-[#f3d189] bg-[#d6b36b] px-7 text-[11px] font-black uppercase tracking-[3px] text-[#090d10] shadow-[0_12px_30px_rgba(214,179,107,0.35)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {user ? 'Open the Shift' : 'Sign Up'}
                </Link>

                <div className="inline-flex min-h-[52px] items-center justify-center">
                  <BuyButton userId={user?.id} hasPurchased={access.allowed} />
                </div>
              </div>
              {!access.allowed && <PurchaseNote />}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
