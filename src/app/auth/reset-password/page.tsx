'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ background: '#06090C' }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-block py-3 text-sm" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud</Link>
        <form
          className="space-y-5 rounded-sm p-6"
          style={{ background: '#0C1116', border: '1px solid #1D2831', borderTop: '3px solid #38D6E0' }}
          onSubmit={async event => {
            event.preventDefault()
            if (password !== confirmation) { setMessage('Passwords do not match.'); return }
            setBusy(true); setMessage('')
            try {
              const db = createClient()
              const { data: { user }, error: sessionError } = await db.auth.getUser()
              if (sessionError || !user) { setMessage('This reset link has expired. Request a new link from the sign-in page.'); return }
              const { error } = await db.auth.updateUser({ password })
              if (error) setMessage(error.message)
              else { setDone(true); setMessage('Password updated. You can return to the game.') }
            } catch { setMessage('Could not connect. Please try again.') }
            finally { setBusy(false) }
          }}
        >
          <h1 className="text-xl font-black uppercase" style={{ color: '#D7E3EC' }}>Choose a new password</h1>
          {!done && (
            <>
              <label className="block text-sm" style={{ color: '#C9A227' }}>
                New password
                <input autoComplete="new-password" className="mt-2 w-full rounded-sm p-3 text-base" style={{ background: '#06090C', border: '1px solid #1D2831', color: '#D7E3EC' }} type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} />
              </label>
              <label className="block text-sm" style={{ color: '#C9A227' }}>
                Confirm password
                <input autoComplete="new-password" className="mt-2 w-full rounded-sm p-3 text-base" style={{ background: '#06090C', border: '1px solid #1D2831', color: '#D7E3EC' }} type="password" minLength={6} required value={confirmation} onChange={e => setConfirmation(e.target.value)} />
              </label>
              <button disabled={busy} className="w-full rounded-sm p-3 font-black uppercase disabled:opacity-60" style={{ background: '#38D6E0', color: '#06090C' }}>
                {busy ? 'Saving…' : 'Save password'}
              </button>
            </>
          )}
          {message && <p role="status" className="text-sm" style={{ color: '#D7E3EC' }}>{message}</p>}
          <Link href={done ? '/' : '/auth/login'} className="block py-2 text-sm" style={{ color: '#38D6E0' }}>{done ? 'Return to home' : 'Back to sign in'}</Link>
        </form>
      </div>
    </div>
  )
}
