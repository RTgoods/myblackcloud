'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const signOut = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    } finally {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button onClick={signOut} disabled={loading} style={{ color: 'inherit', background: 'none', border: 'none', padding: 0, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1 }}>
      {loading ? 'Signing out…' : 'Sign Out'}
    </button>
  )
}
