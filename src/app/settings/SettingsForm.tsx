'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Role = 'RT' | 'RN'

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
  fontWeight: 900, marginBottom: 8, color: '#C9A227',
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-sm font-black uppercase"
      style={{
        padding: '12px 10px',
        fontSize: 12,
        letterSpacing: 1,
        border: active ? '1px solid #38D6E0' : '1px solid #1D2831',
        background: active ? 'rgba(56,214,224,0.12)' : 'rgba(56,214,224,0.03)',
        color: active ? '#38D6E0' : '#9eaab0',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

interface Props {
  userId: string
  email: string
  initialHandle: string
  initialRole: Role
}

export function SettingsForm({ userId, email, initialHandle, initialRole }: Props) {
  const [handle, setHandle] = useState(initialHandle)
  const [role, setRole] = useState<Role>(initialRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const initial = (handle.trim() || email).trim().charAt(0).toUpperCase() || '?'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const trimmed = handle.trim()
    if (trimmed && (trimmed.length < 2 || trimmed.length > 20)) {
      setError('Handle must be 2–20 characters.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ display_name: trimmed || null, role })
        .eq('id', userId)
      if (updateError) setError(updateError.message)
      else {
        setMessage('Saved.')
        router.refresh()
      }
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: '#06090C' }}>
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-block mb-6 py-2 text-sm font-bold" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud</Link>

        <div className="text-center mb-8">
          <p className="text-[11px] font-black tracking-[3px] uppercase mb-3" style={{ color: '#C9A227' }}>Your Shift Profile</p>
          <h1 className="font-black uppercase" style={{ fontSize: 26, letterSpacing: 4, color: '#D7E3EC' }}>Settings</h1>
          <p className="mt-2 text-[12px]" style={{ color: '#5C6D7A' }}>{email}</p>
        </div>

        <div className="rounded-sm p-6 flex flex-col gap-6 sm:flex-row sm:items-start" style={{ background: '#0C1116', border: '1px solid #1D2831', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <div className="mx-auto w-[140px] shrink-0 sm:mx-0">
            <div
              className="flex items-center justify-center rounded-sm"
              style={{ aspectRatio: '1/1', border: '1px solid #1D2831', background: 'rgba(56,214,224,0.06)' }}
            >
              <span className="font-black" style={{ fontSize: 48, color: '#38D6E0' }}>{initial}</span>
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-[1px]" style={{ color: '#5C6D7A' }}>
              {role === 'RT' ? 'Respiratory Therapist' : 'Registered Nurse'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            <div>
              <label htmlFor="handle" style={labelStyle}>Handle (shown on the leaderboard)</label>
              <input
                id="handle" type="text" value={handle} maxLength={20}
                onChange={e => setHandle(e.target.value)}
                placeholder="Pick a handle"
                style={{
                  width: '100%', padding: '12px 14px', background: 'rgba(56,214,224,0.06)',
                  border: '1px solid rgba(56,214,224,0.25)', borderRadius: 2, color: '#D7E3EC',
                  fontSize: 16, letterSpacing: '0.5px', outline: 'none',
                }}
              />
              <p className="mt-2 text-[10px]" style={{ color: '#5C6D7A' }}>Leave blank to use the start of your email instead.</p>
            </div>

            <div>
              <label style={labelStyle}>Character</label>
              <div className="flex gap-2">
                <ToggleButton active={role === 'RT'} onClick={() => setRole('RT')}>RT</ToggleButton>
                <ToggleButton active={role === 'RN'} onClick={() => setRole('RN')}>Nurse</ToggleButton>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-sm text-[11px] tracking-[0.5px]" style={{ background: 'rgba(255,59,78,0.1)', border: '1px solid rgba(255,59,78,0.3)', color: '#FF3B4E' }}>
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-sm text-[11px] tracking-[0.5px]" style={{ background: 'rgba(53,224,127,0.1)', border: '1px solid rgba(53,224,127,0.3)', color: '#35E07F' }}>
                {message}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full rounded-sm font-black uppercase"
              style={{
                padding: '14px 32px',
                background: loading ? 'rgba(56,214,224,0.4)' : 'linear-gradient(180deg,#38D6E0 0%,#1FA9B3 100%)',
                color: '#06090C', fontSize: 13, letterSpacing: 2.5, border: 'none',
                cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
