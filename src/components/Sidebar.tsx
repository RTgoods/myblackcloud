'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SignOutButton } from './SignOutButton'
import type { LevelStat } from '@/types/database'
import rtMale from '../../public/images/characters/rt-male-face.webp'
import rtFemale from '../../public/images/characters/rt-female-face.webp'
import nurseMale from '../../public/images/characters/nurse-male-face.webp'
import nurseFemale from '../../public/images/characters/nurse-female-face.webp'

type Role = 'RT' | 'RN'
type Gender = 'male' | 'female'

function formatLevelDuration(seconds: number | undefined) {
  if (seconds === undefined) return 'Not recorded'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

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
  levelStats?: Record<string, LevelStat>
}

export function Sidebar({ email, handle = null, role = 'RT', gender = 'male', unlocked, isAdmin = false, completedLevels = [], levelStats = {} }: Props) {
  const [savedCompletedLevels, setSavedCompletedLevels] = useState(completedLevels)
  const [savedLevelStats, setSavedLevelStats] = useState(levelStats)
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1)
  const isLevelUnlocked = (n: number) => n === 1 || ((isAdmin || unlocked) &&
    Array.from({ length: n - 1 }, (_, index) => index + 1).every((previous) => savedCompletedLevels.includes(previous)))
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
    const routeLevel = Number(new URLSearchParams(window.location.search).get('level'))
    if (routeLevel >= 1 && routeLevel <= 8) setExpandedLevel(routeLevel)
  }, [])

  useEffect(() => {
    if (!email) return
    let active = true
    const refreshProgress = async () => {
      try {
        const response = await fetch('/api/progress', { cache: 'no-store' })
        if (!response.ok) return
        const progress = await response.json()
        if (!active) return
        setSavedCompletedLevels(Array.isArray(progress.completedLevels) ? progress.completedLevels : [])
        setSavedLevelStats(progress.levelStats && typeof progress.levelStats === 'object' ? progress.levelStats : {})
      } catch {}
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === 'shift-progress-saved') void refreshProgress()
    }
    window.addEventListener('focus', refreshProgress)
    window.addEventListener('message', onMessage)
    void refreshProgress()
    return () => {
      active = false
      window.removeEventListener('focus', refreshProgress)
      window.removeEventListener('message', onMessage)
    }
  }, [email])

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 rounded-md"
          style={{ background: '#0b1420', border: '1px solid #1c3a42', color: '#38D6E0', fontSize: 18 }}
        >
          ☰
        </button>
      )}

      {open && (
        <button
          onClick={close}
          aria-label="Close menu"
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.6)', border: 'none' }}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto flex flex-col shrink-0 transition-all duration-200 overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
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
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[2px]" style={{ color: '#5c6d7a' }}>
                <span>Shift Directory</span>
                <span>01 - 08</span>
              </div>
              <div>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
                  const playable = isLevelUnlocked(n)
                  const completed = savedCompletedLevels.includes(n)
                  const expanded = expandedLevel === n
                  const firstIncompletePriorLevel = Array.from({ length: n - 1 }, (_, index) => index + 1)
                    .find((previous) => !savedCompletedLevels.includes(previous))
                  const stats = savedLevelStats[String(n)]
                  return (
                    <section key={n} className="border-b border-[#163040]">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`level-details-${n}`}
                        onClick={() => setExpandedLevel(expanded ? null : n)}
                        className="flex min-h-[66px] w-full items-center gap-3 py-2 text-left"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border text-sm font-black"
                          style={{
                            color: completed ? '#F2C94D' : playable ? '#38D6E0' : '#5c6d7a',
                            borderColor: completed ? '#806B24' : '#1c3a42',
                            background: '#081019',
                          }}
                        >
                          {completed ? '✓' : `S${n}`}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="text-[11px] font-black uppercase tracking-[2px]" style={{ color: completed ? '#F2C94D' : playable ? '#38D6E0' : '#5c6d7a' }}>
                            {completed ? 'Cleared' : `Level ${n}`}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: completed ? '#b99d35' : playable ? '#dfeaf4' : '#657485' }}>
                            {completed ? `Shift ${n} complete` : playable ? 'Ready to play' : firstIncompletePriorLevel ? `Clear level ${firstIncompletePriorLevel} first` : 'Unlock full shift'}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-lg" style={{ color: playable ? '#9eaab0' : '#5c6d7a' }}>{expanded ? '⌄' : '›'}</span>
                      </button>

                      {expanded && (
                        <div id={`level-details-${n}`} className="pb-3 pl-[52px] pr-1">
                          {completed && stats ? (
                            <>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ color: '#5c6d7a' }}>Score</p>
                                  <p className="mt-1 text-[11px] font-bold" style={{ color: '#dfeaf4' }}>{stats.totalDischarged} discharged</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ color: '#5c6d7a' }}>Time</p>
                                  <p className="mt-1 text-[11px] font-bold" style={{ color: '#dfeaf4' }}>{formatLevelDuration(stats.durationSeconds)}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ color: '#5c6d7a' }}>Coins earned</p>
                                  <p className="mt-1 text-[11px] font-bold" style={{ color: '#dfeaf4' }}>{stats.coinsEarned ?? 'Not recorded'}</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ color: '#5c6d7a' }}>Favorite tools</p>
                                {stats.favoriteTools?.length ? (
                                  <ol className="mt-1 space-y-1">
                                    {stats.favoriteTools.slice(0, 3).map((tool) => (
                                      <li key={tool.name} className="flex justify-between gap-2 text-[10px]" style={{ color: '#9eaab0' }}>
                                        <span className="truncate">{tool.name}</span>
                                        <span className="shrink-0">{tool.uses}x</span>
                                      </li>
                                    ))}
                                  </ol>
                                ) : <p className="mt-1 text-[10px]" style={{ color: '#81909c' }}>Not recorded</p>}
                              </div>
                            </>
                          ) : completed ? (
                            <p className="text-[10px] leading-5" style={{ color: '#81909c' }}>Detailed results are available for levels completed after this update.</p>
                          ) : !playable ? (
                            <p className="text-[10px] leading-5" style={{ color: '#81909c' }}>
                              {firstIncompletePriorLevel ? `Complete level ${firstIncompletePriorLevel} before this shift.` : 'Unlock the full shift to play this level.'}
                            </p>
                          ) : null}
                          {playable && (
                            <Link
                              href={`/play?level=${n}`}
                              onClick={closeOnMobile}
                              className="mt-3 flex min-h-10 w-full items-center justify-center rounded-[3px] border text-[10px] font-black uppercase tracking-[2px]"
                              style={{ color: '#06090c', background: '#38D6E0', borderColor: '#38D6E0' }}
                            >
                              {completed ? 'Replay level' : 'Play level'}
                            </Link>
                          )}
                        </div>
                      )}
                    </section>
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
