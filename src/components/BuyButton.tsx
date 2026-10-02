'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/pricing'

interface Props {
  userId: string | undefined
  hasPurchased: boolean
}

export function BuyButton({ userId, hasPurchased }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleBuy = async () => {
    if (!userId) {
      router.push('/auth/login?redirect=%2F')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setLoading(false)
    }
  }

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg,#38D6E0 0%,#1FA9B3 100%)',
    color: '#06090C',
    fontSize: 11,
    letterSpacing: 3,
    padding: '16px 28px',
    minHeight: 52,
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.2,
    fontWeight: 900,
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: 3,
    cursor: loading ? 'default' : 'pointer',
    opacity: loading ? 0.7 : 1,
  }

  if (hasPurchased) {
    return (
      <div className="w-full text-center">
        <a href="/game" className="inline-block" style={buttonStyle}>▶ Start Your Shift</a>
        <p className="mt-2 text-[10px] tracking-[2px] uppercase" style={{ color: '#35E07F' }}>All 8 levels unlocked</p>
      </div>
    )
  }

  return (
    <div className="w-full text-center">
      <button onClick={handleBuy} disabled={loading} style={buttonStyle}>
        {loading ? 'Redirecting…' : `Unlock Full Shift — ${formatPrice()}`}
      </button>
      {error && <p className="mt-2 text-[11px] tracking-[1px]" style={{ color: '#FF3B4E' }}>{error}</p>}
    </div>
  )
}
