'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PowerUpItem {
  index: string
  name: string
  category: string
  price: string
  description: string
  icon: string
  color: string
}

interface PackToolItem {
  id: string
  name: string
  size: number
  description: string
  icon: string
  color: string
}

interface Props {
  powerUps: PowerUpItem[]
  respiratoryTools: PackToolItem[]
  nursingTools: PackToolItem[]
}

const PACK_TOOL_IMAGES: Record<string, string> = {
  SUCT: 'suction-cath', YANK: 'yankauer', INLINE: 'inline-suction', ABG: 'abg-syringe',
  VENTK: 'venturi-kit', NC: 'nasal-cannula', NRB: 'non-rebreather', FLOW: 'flowmeter',
  XTREE: 'christmas-tree', MDI: 'mdi-spacer', NEB: 'neb-kit', BVM: 'bvm',
  PEEP: 'peep-valve', ETCO2: 'etco2-detector', TLUNG: 'test-lung', MANO: 'cuff-manometer',
  IVK: 'iv-start-kit', ABX: 'antibiotic', FLUID: 'fluid-bag', PRESS: 'pressor',
  FOLEY: 'foley-kit', NGT: 'ng-tube', BCULT: 'blood-cultures', GLUC: 'glucometer',
  INSUL: 'insulin', LEADS: 'ecg-leads', DRESS: 'dressing-kit', PAIN: 'analgesia',
  TURN: 'slide-sheet', CHART: 'chart', BLOOD: 'blood-unit', SUPP: 'suppository',
}

const POWER_UP_IMAGES: Record<string, string> = {
  'Blue Can': 'blue-can', 'Green Can': 'green-can', 'Amber Can': 'amber-can',
  'Violet Can': 'violet-can', 'Full Tank': 'full-tank', 'Second Wind': 'second-wind',
  'Loaded Kit': 'loaded-kit', 'Charge Nurse': 'charge-nurse', 'A Friend': 'a-friend',
  'Second Chance': 'second-chance', 'Bigger Pack': 'bigger-pack', 'Deep Reserves': 'deep-reserves',
  'Narcan Kit': 'narcan-kit',
}

const RESPIRATORY_TOOL_IDS = new Set(['SUCT', 'YANK', 'INLINE', 'ABG', 'VENTK', 'NC', 'NRB', 'FLOW', 'XTREE', 'MDI', 'NEB', 'BVM', 'PEEP', 'ETCO2', 'TLUNG', 'MANO'])

function PowerUpArtwork({ icon, color, name }: { icon: string; color: string; name: string }) {
  const image = POWER_UP_IMAGES[name]
  if (image) {
    return (
      <Image
        src={`/images/My-Black-Cloud-Tool-Icons/Shared-Power-Ups/${image}.webp`}
        alt={name}
        width={512}
        height={512}
        sizes="112px"
        quality={75}
        loading="lazy"
        className="h-28 w-28 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)]"
      />
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-28 w-28 drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)]">
      <defs>
        <radialGradient id={`power-glow-${icon}`}>
          <stop stopColor={color} stopOpacity=".34" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`power-metal-${icon}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f4fbff" stopOpacity=".72" />
          <stop offset=".42" stopColor="#9fb6c0" stopOpacity=".18" />
          <stop offset="1" stopColor="#17252c" stopOpacity=".56" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#power-glow-${icon})`} />
      <ellipse cx="32" cy="56" rx="18" ry="3" fill="#000" opacity=".36" />
      {icon === 'can' && (
        <>
          <rect x="23" y="9" width="18" height="46" rx="5" fill="#26343d" stroke="#c3d2db" strokeWidth="2" />
          <path d="M25 25h14v15H25z" fill={color} />
          <path d="M34 27l-5 7h4l-2 5 7-8h-4l2-4z" fill="white" />
          <path d="M27 6h10v4H27z" fill="#d2dbe0" />
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
        <path d="M17 34V17a3 3 0 0 1 6 0v12-18a3 3 0 0 1 6 0v18-16a3 3 0 0 1 6 0v17-12a3 3 0 0 1 6 0v17l3-5a4 4 0 0 1 7 4l-8 14H26L15 41a5 5 0 0 1 2-7z" fill={color} stroke="#806515" strokeWidth="2" strokeLinejoin="round" />
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

function PackToolArtwork({ icon, color, id, name }: { icon: string; color: string; id: string; name: string }) {
  const image = PACK_TOOL_IMAGES[id]
  if (image) {
    const pack = RESPIRATORY_TOOL_IDS.has(id) ? 'RT-Pack' : 'RN-Pack'
    return (
      <Image
        src={`/images/My-Black-Cloud-Tool-Icons/${pack}/${image}.webp`}
        alt={name}
        width={512}
        height={512}
        sizes="112px"
        quality={75}
        loading="lazy"
        className="h-28 w-28 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)]"
      />
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 96 96" className="h-28 w-28 drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)]">
      <defs>
        <radialGradient id={`tool-glow-${icon}`}>
          <stop stopColor={color} stopOpacity=".3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`tool-metal-${icon}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f4fbff" stopOpacity=".72" />
          <stop offset=".42" stopColor="#9fb6c0" stopOpacity=".18" />
          <stop offset="1" stopColor="#17252c" stopOpacity=".56" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="47" r="45" fill={`url(#tool-glow-${icon})`} />
      <ellipse cx="48" cy="84" rx="24" ry="3" fill="#000" opacity=".36" />
      {icon === 'yankauer' && (
        <>
          <path d="M25 74 48 51l14-16 7-15 8 4-7 17-15 17-21 21c-5 5-14 1-13-5 0-2 1-4 4-6z" fill={color} stroke="#e5f4f7" strokeWidth="3" strokeLinejoin="round" />
          <path d="m61 35 11 6m-21 10 6 6M28 72l6 6" stroke="#20313a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="72" cy="23" rx="6" ry="4" transform="rotate(28 72 23)" fill="#eff7fa" stroke={color} strokeWidth="2" />
        </>
      )}
      {icon === 'inline' && (
        <>
          <path d="M12 48h23m26 0h23" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <rect x="32" y="31" width="32" height="34" rx="7" fill="#b9dce5" fillOpacity=".44" stroke="#e2f3f7" strokeWidth="3" />
          <path d="M39 34v28m18-28v28M12 40v16m72-16v16" stroke="#28404a" strokeWidth="3" />
          <path d="M38 36h18" stroke="#fff" strokeWidth="3" opacity=".72" />
        </>
      )}
      {icon === 'venturi' && (
        <>
          <path d="M18 36q30-19 60 0v22q-30 21-60 0z" fill={color} fillOpacity=".8" stroke="#e7f5f5" strokeWidth="3" />
          <path d="M18 43 7 36m71 7 11-7M32 39v17m16-22v28m16-23v17" stroke="#20313a" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 70h12v12H42zM45 82h6v7h-6z" fill="#f2b33d" stroke="#e7f5f5" strokeWidth="2" />
          <path d="M45 74h6" stroke="#20313a" strokeWidth="2" />
        </>
      )}
      {icon === 'ngtube' && (
        <>
          <path d="M33 17v30c0 17 27 10 27 25 0 7-7 11-15 7-8-4-7-15 0-20" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <path d="M27 14h13v10H27z" fill="#c6d7dd" stroke="#f0f7f8" strokeWidth="2" />
          <path d="M32 17v29c0 8 8 10 16 11" fill="none" stroke="#edf9fa" strokeWidth="1.6" opacity=".8" />
          <circle cx="45" cy="79" r="3" fill="#f2b33d" />
        </>
      )}
      {icon === 'airway' && (
        <>
          <path d="M22 56c8-17 22-22 38-20 12 2 16 10 16 19 0 10-7 17-18 17H39c-10 0-19-6-17-16z" fill={color} fillOpacity=".82" stroke="#d7e3ec" strokeWidth="3" />
          <path d="M40 72c0 9 7 12 7 18m14-18c0 9 7 12 7 18" fill="none" stroke="#91c7d4" strokeWidth="3" />
          <circle cx="37" cy="44" r="4" fill="#e9f7f7" />
        </>
      )}
      {icon === 'suction' && (
        <>
          <path d="M20 35h35v13H20zM55 38h16v7H55M71 42c9 0 8 13 1 17l-15 11c-9 7-17 4-20-2" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M25 35v13m8-13v13m8-13v13" stroke="#14232b" strokeWidth="2" />
        </>
      )}
      {icon === 'syringe' && (
        <>
          <path d="m28 68 38-38 10 10-38 38z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="m55 31 10 10M48 39l9 9M40 47l9 9M32 55l9 9M26 70l-8 8m12-4-9 9" stroke="#20313a" strokeWidth="3" />
        </>
      )}
      {icon === 'mask' && (
        <>
          <path d="M21 32q27-17 54 0v27q-27 20-54 0z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="M21 40 9 35m66 5 12-5M35 38v17m13-20v23m13-20v17" fill="none" stroke="#263a44" strokeWidth="3" />
          <circle cx="48" cy="71" r="5" fill="#d7e3ec" />
        </>
      )}
      {icon === 'cannula' && (
        <>
          <path d="M20 24c0 33 9 48 28 48s28-15 28-48M37 70v10m22-10v10M37 80h-7m29 0h7" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <circle cx="37" cy="65" r="4" fill="#d7e3ec" /><circle cx="59" cy="65" r="4" fill="#d7e3ec" />
        </>
      )}
      {icon === 'flowmeter' && (
        <>
          <rect x="33" y="16" width="30" height="62" rx="7" fill="#1a2830" stroke={color} strokeWidth="4" />
          <path d="M39 25h18v36H39z" fill="#91c7d4" fillOpacity=".55" stroke="#d7e3ec" strokeWidth="2" />
          <circle cx="48" cy="42" r="6" fill={color} stroke="#d7e3ec" strokeWidth="2" />
          <path d="M28 78h40M40 16v-7h16v7" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'connector' && (
        <>
          <path d="M20 35h24v-16m0 16v27m0-27h31M44 62H25v17m19-17h29v17" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 35h8m46 0h8M22 79h8m39 0h8" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'inhaler' && (
        <>
          <rect x="40" y="15" width="24" height="43" rx="5" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="M35 57h36v20H35zM18 62h18v15H18zM18 65h-6" fill="#41515a" stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M50 24h4v22h-4z" fill="#eff7fa" />
        </>
      )}
      {icon === 'nebulizer' && (
        <>
          <path d="M27 53h42l-5 27H32z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="M48 53V36m0 0c0-14 19-15 19-3v7M35 36c-7-7 1-16 7-10m9-7c-4-8 5-14 10-7" fill="none" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="25" r="4" fill="#9edfed"/><circle cx="56" cy="15" r="3" fill="#9edfed"/>
        </>
      )}
      {icon === 'bag' && (
        <>
          <path d="M35 20h26v10l13 8v43H22V38l13-8z" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M35 30h26m-27 8v29h28V38M43 47v12m-6-6h12" fill="none" stroke="#20313a" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'valve' && (
        <>
          <circle cx="48" cy="50" r="24" fill="#1a2830" stroke={color} strokeWidth="5" />
          <path d="M48 26V13m-9 0h18M28 50H15m66 0H68M48 74v10" stroke="#d7e3ec" strokeWidth="5" strokeLinecap="round" />
          <path d="m48 35-9 18h9l-2 12 12-20h-9l3-10z" fill={color} />
        </>
      )}
      {icon === 'monitor' && (
        <>
          <rect x="13" y="21" width="70" height="49" rx="7" fill="#101b21" stroke={color} strokeWidth="4" />
          <path d="M20 47h13l6-13 9 25 8-19 6 7h14" fill="none" stroke="#71e3ba" strokeWidth="4" strokeLinejoin="round" />
          <path d="M42 70v9m12-9v9m-20 0h40" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'lung' && (
        <>
          <path d="M47 17v25m2-12 10-11v21c12-21 23-14 23 7v18c0 12-10 18-24 12-8-4-9-14-9-23m-2-24L37 19v21C25 19 14 26 14 47v18c0 12 10 18 24 12 8-4 9-14 9-23" fill={color} fillOpacity=".85" stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
        </>
      )}
      {icon === 'gauge' && (
        <>
          <circle cx="48" cy="49" r="30" fill="#101b21" stroke={color} strokeWidth="5" />
          <path d="M28 59a22 22 0 0 1 40 0M48 49l13-14" fill="none" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="49" r="5" fill={color} />
          <path d="M29 68h38" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'kit' && (
        <>
          <rect x="18" y="31" width="60" height="45" rx="6" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="M34 31v-9h28v9M18 45h60M43 40v19m-9-10h19" fill="none" stroke="#20313a" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'vial' && (
        <>
          <path d="M36 17h24v12l9 10v39H27V39l9-10z" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M36 17h24m-23 36h31M42 42h12" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'tubeBag' && (
        <>
          <path d="M31 17h34v10l-5 8v39H36V35l-5-8z" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M36 55h24m-12-38v27m0 0 17 13" fill="none" stroke="#d7e3ec" strokeWidth="4" strokeLinecap="round" />
          <circle cx="65" cy="58" r="5" fill="#91c7d4" />
        </>
      )}
      {icon === 'foley' && (
        <>
          <path d="M27 48h44v29H27zM36 48V24h20v24m-10-24v-9m0 38c0 12 19 5 19 19" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M34 60h30m-15-12v29" stroke="#20313a" strokeWidth="3" />
        </>
      )}
      {icon === 'samples' && (
        <>
          <path d="M20 23h18v52H20zm38 0h18v52H58z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="M22 47h14v24H22zm38-11h14v35H60zM24 16h10m28 0h10" fill="#a8202b" stroke="#d7e3ec" strokeWidth="3" />
        </>
      )}
      {icon === 'meter' && (
        <>
          <rect x="28" y="12" width="40" height="69" rx="7" fill="#111d23" stroke={color} strokeWidth="4" />
          <rect x="36" y="22" width="24" height="24" rx="3" fill="#9edfed" />
          <path d="M40 58h16M48 50v16" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="73" r="3" fill="#d7e3ec" />
        </>
      )}
      {icon === 'ecg' && (
        <>
          <path d="M20 23v25c0 22 12 31 28 31s28-9 28-31V23" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <path d="M18 47h19l7-13 9 27 8-14h18" fill="none" stroke="#d7e3ec" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="20" cy="22" r="5" fill={color}/><circle cx="76" cy="22" r="5" fill={color}/>
        </>
      )}
      {icon === 'dressing' && (
        <>
          <path d="m22 66 43-43c7-7 20 6 13 13L35 79c-7 7-20-6-13-13z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="m37 63 22-22m-31 12 22-22m-8 43 22-22" stroke="#20313a" strokeWidth="4" />
        </>
      )}
      {icon === 'capsule' && (
        <>
          <path d="M27 70c-9-9-9-24 0-33l14-14c9-9 24-9 33 0s9 24 0 33L60 70c-9 9-24 9-33 0z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="m36 61 29-29" stroke="#20313a" strokeWidth="4" />
          <path d="m27 37 21 21" stroke="#e8f4f5" strokeWidth="2" opacity=".7" />
        </>
      )}
      {icon === 'sheet' && (
        <>
          <path d="m18 28 24-13 36 18-24 13zM18 28v36l36 18V46m0 36 24-14V33" fill={color} fillOpacity=".85" stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="m31 35 22 11m-22 2 22 11m-22 2 22 11" stroke="#20313a" strokeWidth="3" />
        </>
      )}
      {icon === 'chart' && (
        <>
          <path d="M26 17h42v62H26zM36 17v-7h22v7" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M35 35h24M35 47h24M35 59h17M35 70h20" stroke="#20313a" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {icon === 'blood' && (
        <>
          <path d="M27 25h42v52H27zM38 25v-9h20v9" fill={color} stroke="#d7e3ec" strokeWidth="3" strokeLinejoin="round" />
          <path d="M31 53h34v20H31z" fill="#a8202b" />
          <path d="M48 55c-8 9-8 13 0 17 8-4 8-8 0-17z" fill="#f7d4c9" />
        </>
      )}
      {icon === 'suppository' && (
        <>
          <path d="M48 15c13 15 22 26 22 39a22 22 0 1 1-44 0c0-13 9-24 22-39z" fill={color} stroke="#d7e3ec" strokeWidth="3" />
          <path d="M38 57c2 8 8 12 16 11" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
        </>
      )}
      <path d="M18 86h60" stroke={`url(#tool-metal-${icon})`} strokeWidth="1.5" opacity=".7" />
    </svg>
  )
}

const TAB_BUTTON = 'min-h-12 flex-1 rounded-[4px] border px-4 text-[11px] font-black uppercase tracking-[2px] transition'
const ROLE_BUTTON = 'min-h-10 rounded-[4px] border px-4 text-[10px] font-black uppercase tracking-[2px] transition'

export function FieldGuideTabs({ powerUps, respiratoryTools, nursingTools }: Props) {
  const [tab, setTab] = useState<'tools' | 'powerups'>('tools')
  const [role, setRole] = useState<'RT' | 'RN'>('RT')
  const items = tab === 'tools' ? role === 'RT' ? respiratoryTools : nursingTools : powerUps

  return (
    <section className="border-b border-[#2a2e31] bg-[#0a0d10] px-4 py-14 sm:px-6 md:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[3px] text-[#d6b36b]">Field Guide</p>
          <h2 className="text-3xl font-black uppercase text-white md:text-4xl">Choose the gear that survives the shift.</h2>
        </div>

        <div role="tablist" aria-label="Field guide categories" className="mb-5 flex max-w-[440px] gap-3">
          <button
            id="field-guide-tools-tab"
            type="button"
            role="tab"
            aria-selected={tab === 'tools'}
            aria-controls="field-guide-panel"
            onClick={() => setTab('tools')}
            className={TAB_BUTTON}
            style={{ color: tab === 'tools' ? '#f2c94d' : '#9eaab0', background: tab === 'tools' ? '#005bbb' : '#101b21', borderColor: tab === 'tools' ? '#38d6e0' : '#2a3c47' }}
          >
            Pack Tools · {role === 'RT' ? respiratoryTools.length : nursingTools.length}
          </button>
          <button
            id="field-guide-powerups-tab"
            type="button"
            role="tab"
            aria-selected={tab === 'powerups'}
            aria-controls="field-guide-panel"
            onClick={() => setTab('powerups')}
            className={TAB_BUTTON}
            style={{ color: tab === 'powerups' ? '#f2c94d' : '#9eaab0', background: tab === 'powerups' ? '#005bbb' : '#101b21', borderColor: tab === 'powerups' ? '#38d6e0' : '#2a3c47' }}
          >
            Power-ups · {powerUps.length}
          </button>
        </div>

        <div className="mb-4 flex min-h-8 flex-wrap items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#91a8b5]">
          {tab === 'tools' ? (
            <>
              <span>{role === 'RT' ? 'Respiratory therapy kit' : 'Nursing kit'} · {items.length} items</span>
              <div role="group" aria-label="Pack role" className="flex gap-2">
                <button type="button" aria-pressed={role === 'RT'} className={ROLE_BUTTON} onClick={() => setRole('RT')} style={{ color: role === 'RT' ? '#06090c' : '#aab5bc', background: role === 'RT' ? '#38d6e0' : '#101b21', borderColor: role === 'RT' ? '#38d6e0' : '#2a3c47' }}>RT</button>
                <button type="button" aria-pressed={role === 'RN'} className={ROLE_BUTTON} onClick={() => setRole('RN')} style={{ color: role === 'RN' ? '#06090c' : '#aab5bc', background: role === 'RN' ? '#38d6e0' : '#101b21', borderColor: role === 'RN' ? '#38d6e0' : '#2a3c47' }}>RN</button>
              </div>
            </>
          ) : (
            <span>Shop inventory · Coin prices</span>
          )}
        </div>

        <div id="field-guide-panel" role="tabpanel" aria-labelledby={tab === 'tools' ? 'field-guide-tools-tab' : 'field-guide-powerups-tab'} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, itemIndex) => {
            const indexLabel = 'index' in item ? item.index : String(itemIndex + 1).padStart(2, '0')
            return (
            <article key={item.name} className="overflow-hidden rounded-[8px] border border-[#2a3c47] bg-[#0c151b]">
              <div className="relative flex h-40 items-center justify-center border-b border-[#2a3c47] bg-[linear-gradient(145deg,#142630,#0b1419)]">
                <span className="absolute left-4 top-3 text-[10px] font-bold tracking-[2px] text-[#7893a1]">{indexLabel}</span>
                {tab === 'tools' ? (
                  <PackToolArtwork icon={(item as PackToolItem).icon} color={item.color} id={(item as PackToolItem).id} name={item.name} />
                ) : (
                  <PowerUpArtwork icon={(item as PowerUpItem).icon} color={item.color} name={item.name} />
                )}
                <span className="absolute bottom-3 right-3 rounded-[4px] bg-[#06090c]/90 px-3 py-2 text-[10px] font-bold text-[#f2c94d]">
                  {tab === 'tools' ? `${(item as PackToolItem).size} ${((item as PackToolItem).size === 1) ? 'slot' : 'slots'}` : (item as PowerUpItem).price}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-[#6bb8f2]">
                  {tab === 'tools' ? `${role} pack tool` : (item as PowerUpItem).category}
                </p>
                <h3 className="mt-2 text-lg font-black uppercase leading-tight text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#aab5bc]">{item.description}</p>
              </div>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}