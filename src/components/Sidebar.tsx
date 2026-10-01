'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SignOutButton } from './SignOutButton'
import rtMale from '../../public/images/characters/rt-male-face.webp'
import rtFemale from '../../public/images/characters/rt-female-face.webp'
import nurseMale from '../../public/images/characters/nurse-male-face.webp'
import nurseFemale from '../../public/images/characters/nurse-female-face.webp'

type Role = 'RT' | 'RN'
type Gender = 'male' | 'female'

const PORTRAITS: Record<Role, Record<Gender, typeof rtMale>> = {
  RT: { male: rtMale, female: rtFemale },
  RN: { male: nurseMale, female: nurseFemale },
}

interface Props {
  email: string | null
  handle?: string | null
  role?: Role
  gender?: Gender
  unlocked: boolean
  isAdmin?: boolean
  completedLevels?: number[]
}

export function Sidebar({ email, handle = null, role = 'RT', gender = 'male', unlocked, isAdmin = false, completedLevels = [] }: Props) {
  const isLevelUnlocked = (n: number) => n === 1 || isAdmin || (unlocked && completedLevels.includes(n - 1))
  const name = handle?.trim() || email?.split('@')[0] || null
  const portrait = PORTRAITS[role][gender]
  const [open, setOpen] = useState(true)
  const close = () => setOpen(false)
  // Dismiss the overlay drawer on mobile after navigating, but leave the
  // persistent desktop sidebar exactly as it was — it must not collapse
  // just because a nav link was clicked.
  const closeOnMobile = () => {
    if (window.matchMedia('(max-width: 767px)').matches) close()
  }

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) setOpen(false)
  }, [])

  return (
    <>
      <aside
        className="sticky top-0 left-0 h-screen flex flex-col shrink-0 transition-all duration-200 overflow-y-auto"
        style={{
          width: open ? 264 : 56,
          background: 'linear-gradient(180deg,#0b1420,#06090c 42%)',
          borderRight: '1px solid #163040',
          padding: open ? '20px 16px' : '20px 8px',
        }}
        aria-label="Site navigation"
      >
        <div className="flex items-center justify-between gap-2 pb-4" style={{ borderBottom: '1px solid #163040' }}>
          {open && (
            <Link href="/" onClick={closeOnMobile} className="block min-w-0">
              <span className="block font-black uppercase leading-tight" style={{ color: '#38D6E0', letterSpacing: 1, fontSize: 17 }}>
                My Black Cloud
              </span>
            </Link>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={open}
            className="shrink-0 w-8 h-8 rounded-md"
            style={{ background: '#0b1420', border: '1px solid #1c3a42', color: '#38D6E0', fontSize: 16 }}
          >
            ☰
          </button>
        </div>

        {open && (
          <>
            <div className="mt-4 mb-2 flex flex-col gap-2 text-[11px]">
              {email ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="relative block shrink-0 overflow-hidden rounded-full" style={{ width: 44, height: 44, border: '1px solid #1c3a42', background: '#081019' }}>
                      <Image src={portrait} alt="" fill className="object-cover" sizes="44px" />
                    </span>
                    <p className="min-w-0 flex-1 text-[15px] font-bold" style={{ color: unlocked ? '#35E07F' : '#9eaab0', wordBreak: 'break-all' }}>{name}</p>
                    <Link
                      href="/settings" onClick={closeOnMobile}
                      className="shrink-0 text-[10px] uppercase tracking-[1px]" style={{ color: '#5c6d7a' }}
                    >
                      Settings
                    </Link>
                  </div>
                  <p style={{ color: '#5C6D7A' }}>{unlocked ? 'All levels unlocked' : 'Level 1 free'}</p>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <p style={{ color: '#6ec9e0' }}>Guest · Level 1 free</p>
                  <Link
                    href="/auth/login" onClick={closeOnMobile}
                    style={{ color: '#bfe9f0', border: '1px solid #1c3a42', background: '#0d1b20', display: 'block', padding: '10px 8px', borderRadius: 4, textAlign: 'center', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}
                  >
                    Sign In / Sign Up
                  </Link>
                </>
              )}
            </div>

            <nav className="flex flex-col gap-3 mt-4 pt-4 text-[11px] uppercase tracking-[1px]" style={{ borderTop: '1px solid #163040', color: '#9eaab0' }}>
              <Link href="/play" onClick={closeOnMobile} style={{ color: '#38D6E0' }}>Play SHIFT</Link>
              <Link href="/leaderboard" onClick={closeOnMobile} style={{ color: 'inherit' }}>Leaderboard</Link>
            </nav>

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #163040' }}>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[2px]" style={{ color: '#5c6d7a' }}>Shift Directory</p>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
                  const playable = isLevelUnlocked(n)
                  return (
                    <Link
                      key={n}
                      href={`/play?level=${n}`}
                      onClick={closeOnMobile}
                      aria-label={`Launch Level ${n}`}
                      className="flex items-center justify-center rounded-[4px] text-[11px] font-black"
                      style={{
                        height: 32,
                        color: playable ? '#38D6E0' : '#5c6d7a',
                        border: '1px solid #1c3a42',
                        background: '#081019',
                      }}
                    >
                      {n}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="mt-auto pt-4 flex gap-4 text-[10px]" style={{ borderTop: '1px solid #163040', color: '#5c6d7a' }}>
              <Link href="/privacy" onClick={closeOnMobile} style={{ color: 'inherit' }}>Privacy</Link>
              <Link href="/terms" onClick={closeOnMobile} style={{ color: 'inherit' }}>Terms</Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
