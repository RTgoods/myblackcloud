'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup' | 'recovery'

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedRedirect = searchParams.get('redirect') || '/'
  const redirectTo = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//') && !requestedRedirect.includes('\\') ? requestedRedirect : '/'
  useEffect(() => { if (searchParams.get('error') === 'callback_error') setError('That sign-in or reset link has expired. Please request a new one.') }, [searchParams])
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'recovery') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/reset-password` })
        if (error) setError(error.message)
        else setMessage('If an account exists for this email, a password reset link will arrive shortly.')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          },
        })
        if (error) setError(error.message)
        else setMessage('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else { router.push(redirectTo); router.refresh() }
      }
    } catch { setError('Could not connect. Please try again.') } finally { setLoading(false) }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(56,214,224,0.06)',
    border: '1px solid rgba(56,214,224,0.25)',
    borderRadius: 2,
    color: '#D7E3EC',
    fontSize: 16,
    letterSpacing: '0.5px',
    outline: 'none',
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16" style={{ background: '#06090C' }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-block mb-6 py-2 text-sm font-bold" style={{ color: '#38D6E0' }}>← Back to MyBlackCloud</Link>

        <div className="text-center mb-8">
          <p className="text-[11px] font-black tracking-[3px] uppercase mb-3" style={{ color: '#C9A227' }}>
            {mode === 'login' ? 'SIGN IN' : mode === 'recovery' ? 'RESET PASSWORD' : 'CREATE ACCOUNT'}
          </p>
          <h1 className="font-black uppercase" style={{ fontSize: 26, letterSpacing: 4, color: '#D7E3EC' }}>
            {mode === 'signup' ? 'Clock In' : 'MyBlackCloud'}
          </h1>
        </div>

        <div className="rounded-sm p-6" style={{ background: '#0C1116', border: '1px solid #1D2831', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[12px] tracking-[1px] uppercase font-black mb-2" style={{ color: '#C9A227' }}>Email</label>
              <input
                id="email" autoComplete="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            {mode !== 'recovery' && (
              <div>
                <label htmlFor="password" className="block text-[12px] tracking-[1px] uppercase font-black mb-2" style={{ color: '#C9A227' }}>Password</label>
                <input
                  id="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type="password"
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  placeholder="Min. 6 characters" style={inputStyle}
                />
              </div>
            )}

            {mode === 'login' && (
              <button type="button" onClick={() => { setMode('recovery'); setError(''); setMessage('') }} className="py-1 text-sm" style={{ color: '#38D6E0' }}>
                Forgot password?
              </button>
            )}

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
              className="w-full mt-2 rounded-sm font-black uppercase"
              style={{
                padding: '14px 32px',
                background: loading ? 'rgba(56,214,224,0.4)' : 'linear-gradient(180deg,#38D6E0 0%,#1FA9B3 100%)',
                color: '#06090C', fontSize: 13, letterSpacing: 2.5, border: 'none',
                cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Working…' : mode === 'login' ? 'Sign In' : mode === 'recovery' ? 'Send Reset Link' : 'Create Account'}
            </button>

            {mode === 'signup' && (
              <p className="text-center text-[10px] leading-relaxed tracking-[0.5px]" style={{ color: '#5C6D7A' }}>
                By creating an account you agree to our{' '}
                <Link href="/terms" className="underline" style={{ color: '#8a95a0' }}>Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline" style={{ color: '#8a95a0' }}>Privacy Policy</Link>.
              </p>
            )}
          </form>

          <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid #1D2831' }}>
            <p className="text-[11px] tracking-[1.5px] uppercase" style={{ color: '#5C6D7A' }}>
              {mode === 'login' ? 'No account? ' : 'Back to '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}
                className="font-black" style={{ color: '#C9A227' }}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
