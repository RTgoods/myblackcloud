'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignOutButton } from './SignOutButton'

interface Props {
  email: string | null
  unlocked: boolean
}

export function Sidebar({ email, unlocked }: Props) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 rounded-md"
        style={{ background: '#10262E', border: '1px solid #2B505C', color: '#B4E3E9', fontSize: 18 }}
      >
        ☰
      </button>

      {open && (
        <button
          onClick={close}
          aria-label="Close menu"
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.6)', border: 'none' }}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto flex flex-col shrink-0 transition-transform duration-200 overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ width: 264, background: 'linear-gradient(180deg,#0A161B,#081218)', borderRight: '1px solid #16323A', padding: '20px 16px' }}
        aria-label="Site navigation"
      >
        <Link href="/" onClick={close} className="block pb-4" style={{ borderBottom: '1px solid #1D343E' }}>
          <span className="font-black uppercase" style={{ color: '#D7E3EC', letterSpacing: 2, fontSize: 22 }}>SHIFT</span>
          <small style={{ fontSize: 10, fontWeight: 600, color: '#38D6E0', border: '1px solid #28505A', borderRadius: 3, padding: '3px 6px', marginLeft: 8, background: '#10282D' }}>ICU</small>
        </Link>

        <div className="mt-4 mb-2 flex flex-col gap-2 text-[11px]">
          {email ? (
            <>
              <p style={{ color: unlocked ? '#35E07F' : '#91ADB8', wordBreak: 'break-all' }}>{email}</p>
              <p style={{ color: '#5C6D7A' }}>{unlocked ? 'All levels unlocked' : 'Level 1 free'}</p>
              <SignOutButton />
            </>
          ) : (
            <>
              <p style={{ color: '#91ADB8' }}>Guest · Level 1 free</p>
              <Link
                href="/auth/login" onClick={close}
                style={{ color: '#B4E3E9', border: '1px solid #2B505C', background: '#10262E', display: 'block', padding: '10px 8px', borderRadius: 4, textAlign: 'center', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}
              >
                Sign In / Sign Up
              </Link>
            </>
          )}
        </div>

        <nav className="flex flex-col gap-3 mt-4 pt-4 text-[11px] uppercase tracking-[1px]" style={{ borderTop: '1px solid #1D343E', color: '#9fb0bc' }}>
          <Link href="/game" onClick={close} style={{ color: 'inherit' }}>Play SHIFT</Link>
          <Link href="/leaderboard" onClick={close} style={{ color: 'inherit' }}>Leaderboard</Link>
        </nav>

        <div className="mt-auto pt-4 flex gap-4 text-[10px]" style={{ borderTop: '1px solid #1D343E', color: '#5C6D7A' }}>
          <Link href="/privacy" onClick={close} style={{ color: 'inherit' }}>Privacy</Link>
          <Link href="/terms" onClick={close} style={{ color: 'inherit' }}>Terms</Link>
        </div>
      </aside>
    </>
  )
}
