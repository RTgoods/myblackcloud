'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const onPlayPage = pathname?.startsWith('/play') ?? false

  return (
    <div className={`flex-1 min-w-0 ${onPlayPage ? '' : 'pt-14 md:pt-0'}`}>
      {children}
      {!onPlayPage && <Footer />}
    </div>
  )
}
