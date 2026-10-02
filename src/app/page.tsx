import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { gameAccess } from '@/lib/game-access'
import { BuyButton } from '@/components/BuyButton'
import { FieldGuideTabs } from '@/components/FieldGuideTabs'
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
  {
    index: '13',
    name: 'Narcan Kit',
    category: 'Event reward',
    price: 'Earned in play',
    description: 'Clears a contact high. Earned as a power-up during an event.',
    icon: 'skull',
    color: '#E8E4DA',
  },
]

const respiratoryTools = [
  { id: 'SUCT', name: 'Suction cath', size: 1, description: 'Remove airway secretions with controlled suction.', icon: 'suction', color: '#38D6E0' },
  { id: 'YANK', name: 'Yankauer', size: 1, description: 'Clear oral secretions with a rigid suction tip.', icon: 'yankauer', color: '#6BB8F2' },
  { id: 'INLINE', name: 'Inline suction', size: 1, description: 'Suction secretions without disconnecting the circuit.', icon: 'inline', color: '#7FD4E0' },
  { id: 'ABG', name: 'ABG syringe', size: 1, description: 'Collect an arterial blood gas sample.', icon: 'syringe', color: '#8FE04A' },
  { id: 'VENTK', name: 'Venturi kit', size: 1, description: 'Deliver oxygen at a controlled concentration.', icon: 'venturi', color: '#F2B33D' },
  { id: 'NC', name: 'Nasal cannula', size: 1, description: 'Provide low-flow supplemental oxygen.', icon: 'cannula', color: '#38D6E0' },
  { id: 'NRB', name: 'Non-rebreather', size: 1, description: 'Provide high-concentration oxygen with a reservoir mask.', icon: 'mask', color: '#6BB8F2' },
  { id: 'FLOW', name: 'Flowmeter', size: 2, description: 'Set and monitor oxygen flow from the wall supply.', icon: 'flowmeter', color: '#8FE04A' },
  { id: 'XTREE', name: 'Christmas tree', size: 1, description: 'Connect oxygen tubing to the flow source.', icon: 'connector', color: '#F2B33D' },
  { id: 'MDI', name: 'MDI + spacer', size: 1, description: 'Deliver a metered inhaled medication dose.', icon: 'inhaler', color: '#C96BD8' },
  { id: 'NEB', name: 'Neb kit', size: 1, description: 'Deliver medication as an aerosol mist.', icon: 'nebulizer', color: '#7FD4E0' },
  { id: 'BVM', name: 'BVM', size: 2, description: 'Provide manual ventilation with a bag and mask.', icon: 'bag', color: '#38D6E0' },
  { id: 'PEEP', name: 'PEEP valve', size: 1, description: 'Maintain positive pressure during exhalation.', icon: 'valve', color: '#F2B33D' },
  { id: 'ETCO2', name: 'ETCO2 detector', size: 1, description: 'Check exhaled carbon dioxide during ventilation.', icon: 'monitor', color: '#6BB8F2' },
  { id: 'TLUNG', name: 'Test lung', size: 1, description: 'Check ventilator function and circuit setup.', icon: 'lung', color: '#8FE04A' },
  { id: 'MANO', name: 'Cuff manometer', size: 1, description: 'Measure airway tube cuff pressure.', icon: 'gauge', color: '#C9A227' },
]

const nursingTools = [
  { id: 'IVK', name: 'IV start kit', size: 1, description: 'Prepare supplies for peripheral IV access.', icon: 'kit', color: '#38D6E0' },
  { id: 'ABX', name: 'Antibiotic', size: 1, description: 'Administer the ordered antimicrobial dose.', icon: 'vial', color: '#8FE04A' },
  { id: 'FLUID', name: 'Fluid bag', size: 2, description: 'Give the ordered IV fluid bolus.', icon: 'tubeBag', color: '#6BB8F2' },
  { id: 'PRESS', name: 'Pressor', size: 1, description: 'Support blood pressure with the ordered infusion.', icon: 'vial', color: '#F2B33D' },
  { id: 'FOLEY', name: 'Foley kit', size: 2, description: 'Place a urinary catheter and drainage bag.', icon: 'foley', color: '#38D6E0' },
  { id: 'NGT', name: 'NG tube', size: 1, description: 'Place a tube for enteral access or decompression.', icon: 'ngtube', color: '#7FD4E0' },
  { id: 'BCULT', name: 'Blood cultures', size: 1, description: 'Collect cultures for the infection workup.', icon: 'samples', color: '#C96BD8' },
  { id: 'GLUC', name: 'Glucometer', size: 1, description: 'Check the patient’s blood glucose.', icon: 'meter', color: '#8FE04A' },
  { id: 'INSUL', name: 'Insulin', size: 1, description: 'Give the ordered insulin dose.', icon: 'syringe', color: '#F2B33D' },
  { id: 'LEADS', name: 'ECG leads', size: 1, description: 'Connect the patient to cardiac monitoring.', icon: 'ecg', color: '#38D6E0' },
  { id: 'DRESS', name: 'Dressing kit', size: 1, description: 'Clean and dress the wound site.', icon: 'dressing', color: '#6BB8F2' },
  { id: 'PAIN', name: 'Analgesia', size: 1, description: 'Give the ordered pain medication.', icon: 'capsule', color: '#C96BD8' },
  { id: 'TURN', name: 'Slide sheet', size: 2, description: 'Reposition the patient with assisted movement.', icon: 'sheet', color: '#7FD4E0' },
  { id: 'CHART', name: 'Chart', size: 1, description: 'Record the care step and patient response.', icon: 'chart', color: '#F2B33D' },
  { id: 'BLOOD', name: 'Blood unit', size: 1, description: 'Hang the ordered blood product.', icon: 'blood', color: '#C43A44' },
  { id: 'SUPP', name: 'Suppository', size: 1, description: 'Administer the ordered rectal medication.', icon: 'suppository', color: '#8FE04A' },
]

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
      </section>

      <section className="border-b border-[#163040] bg-[#06090c] px-4 py-6 sm:px-6 md:px-8 xl:px-10">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-3">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={user ? '/play?level=1' : '/auth/login?mode=signup'}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[4px] px-3 text-center text-[11px] font-black uppercase tracking-[3px] text-[#06090c] shadow-[0_12px_30px_rgba(53,224,127,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
              style={{ background: 'linear-gradient(180deg,#6FE0A8 0%,#2BA86B 100%)' }}
            >
              {user ? 'Play Level 1 Free' : 'Sign Up to Play Level 1 Free'}
            </Link>

            <div className="w-full">
              <BuyButton userId={user?.id} hasPurchased={access.allowed} />
            </div>
          </div>
          {!access.allowed && <PurchaseNote />}
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

      <FieldGuideTabs powerUps={fieldGuide} respiratoryTools={respiratoryTools} nursingTools={nursingTools} />

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
