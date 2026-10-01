'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/play')) return null
  return <Footer />
}
