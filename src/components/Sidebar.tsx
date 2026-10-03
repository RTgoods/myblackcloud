'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SignOutButton } from './SignOutButton'
import styles from './Sidebar.module.css'
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
  const [savedCompletedLevels, setSavedCompletedLevels] = useState(completedLevels)
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
          className={`${styles.mobileToggle} md:hidden fixed top-3 left-3 z-50 w-9 h-9 rounded-md`}
        >
          ☰
        </button>
      )}

      {open && (
        <button
          onClick={close}
          aria-label="Close menu"
          className={`${styles.backdrop} md:hidden fixed inset-0 z-40`}
        />
      )}

      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : styles.drawerCollapsed} fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto flex flex-col shrink-0 transition-all duration-200 overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        aria-label="Site navigation"
      >
        <div className={`${styles.brandRow} flex items-center justify-between gap-2 pb-4`}>
          {open && (
            <Link href="/" onClick={closeOnMobile} className="block min-w-0">
              <span className={`${styles.brand} block font-black uppercase leading-tight`}>
                My Black Cloud
              </span>
              <span className={`${styles.tagline} block font-bold uppercase`}>
                Shift Happens
              </span>
            </Link>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={open}
            className={`${styles.collapseButton} shrink-0 w-8 h-8 rounded-md`}
          >
            ☰
          </button>
        </div>

        {!open && (
          <div className="mt-4 flex flex-col items-center gap-2">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
              const playable = isLevelUnlocked(n)
              const completed = savedCompletedLevels.includes(n)
              const markerClass = `${styles.levelMarker} ${completed ? styles.markerCompleted : playable ? styles.markerPlayable : styles.markerLocked} relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border text-xs font-black`
              const markerContent = (
                <>
                  {completed ? '✓' : `S${n}`}
                  {!playable && <span className={`${styles.lockBadge} absolute -right-1 -top-1`} aria-hidden="true">🔒</span>}
                </>
              )
              return playable ? (
                <Link key={n} href={`/play?level=${n}`} onClick={closeOnMobile} aria-label={`Launch level ${n}`} className={markerClass}>
                  {markerContent}
                </Link>
              ) : (
                <div key={n} aria-label={`Level ${n} locked`} className={markerClass}>
                  {markerContent}
                </div>
              )
            })}
          </div>
        )}

        {open && (
          <>
            <div className="mt-4 mb-2 flex flex-col gap-2 text-[11px]">
              <div className={`${styles.accountCard} flex items-center gap-3 rounded-[4px] p-3`}>
                <span className={`${styles.avatar} relative block h-10 w-10 shrink-0 overflow-hidden rounded-full`}>
                  <Image src={portrait} alt="" fill className="object-cover" sizes="40px" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`${styles.accountName} ${email && unlocked ? styles.unlockedText : ''} truncate text-sm font-bold`}>{name ?? 'Guest'}</p>
                  <p className={`${styles.accountStatus} ${email && unlocked ? styles.unlockedText : ''} mt-1 text-[10px]`}>
                    {email ? unlocked ? 'All levels unlocked' : 'Level 1 free' : 'Level 1 free'}
                  </p>
                </div>
                {email && (
                  <Link href="/settings" onClick={closeOnMobile} className={`${styles.settingsLink} shrink-0 text-[10px] uppercase tracking-[1px]`}>
                    Settings
                  </Link>
                )}
              </div>
              <div className={`${styles.accountAction} ${email ? styles.accountActionSecondary : styles.accountActionPrimary} rounded-[4px] px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-[1px]`}>
                {email ? <SignOutButton /> : (
                  <Link href="/auth/login" onClick={closeOnMobile} className="block">
                    Sign In / Sign Up
                  </Link>
                )}
              </div>
            </div>

            <div className={`${styles.directory} mt-4 pt-4`}>
              <div className={`${styles.directoryHeading} mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[2px]`}>
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
                  return (
                    <section key={n} className={styles.levelSection}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`level-details-${n}`}
                        onClick={() => setExpandedLevel(expanded ? null : n)}
                        className={`${styles.levelButton} ${completed ? styles.levelCompleted : playable ? styles.levelPlayable : styles.levelLocked} flex min-h-[66px] w-full items-center gap-3 py-2 text-left`}
                      >
                        <span
                          className={`${styles.levelMarker} ${completed ? styles.markerCompleted : playable ? styles.markerPlayable : styles.markerLocked} relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border text-sm font-black`}
                        >
                          {completed ? '✓' : `S${n}`}
                          {!playable && <span className={`${styles.lockBadge} absolute -right-1 -top-1`} aria-hidden="true">🔒</span>}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className={`${styles.levelName} ${completed ? styles.completedText : playable ? styles.playableText : styles.lockedText} text-[11px] font-black uppercase tracking-[2px]`}>
                            {completed ? 'Cleared' : `Level ${n}`}
                          </span>
                          <span className={`${styles.levelSubtitle} ${completed ? styles.completedSubtitle : playable ? styles.playableSubtitle : styles.lockedText} text-[11px] font-bold uppercase tracking-[1px]`}>
                            {completed ? `Shift ${n} complete` : playable ? 'Ready to play' : firstIncompletePriorLevel ? `Clear level ${firstIncompletePriorLevel} first` : 'Unlock full shift'}
                          </span>
                        </span>
                        <span aria-hidden="true" className={`${styles.chevron} text-lg`}>{expanded ? '⌄' : '›'}</span>
                      </button>

                      {expanded && (
                        <div id={`level-details-${n}`} className="pb-3 pl-[52px] pr-1">
                          {!playable && (
                            <p className={`${styles.levelNote} text-[10px] leading-5`}>
                              {firstIncompletePriorLevel ? `Complete level ${firstIncompletePriorLevel} before this shift.` : 'Unlock the full shift to play this level.'}
                            </p>
                          )}
                          {playable && (
                            <Link
                              href={`/play?level=${n}`}
                              onClick={closeOnMobile}
                              className={`${styles.playAction} mt-3 flex min-h-10 w-full items-center justify-center rounded-[3px] border text-[10px] font-black uppercase tracking-[2px]`}
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

            <div className={`${styles.footer} mt-auto pt-4 flex gap-4 text-[10px]`}>
              <Link href="/privacy" onClick={closeOnMobile}>Privacy</Link>
              <Link href="/terms" onClick={closeOnMobile}>Terms</Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
