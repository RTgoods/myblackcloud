'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Sidebar.module.css'

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
    <button onClick={signOut} disabled={loading} className={styles.signOutButton}>
      {loading ? 'Signing out…' : 'Sign Out'}
    </button>
  )
}
