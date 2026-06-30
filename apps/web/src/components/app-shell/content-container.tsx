'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'

/** Centers page content and widens it when the sidebar is collapsed. */
export function ContentContainer({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <div
      className={cn(
        'mx-auto transition-[max-width] duration-200',
        collapsed ? 'max-w-[88rem]' : 'max-w-6xl',
      )}
    >
      {children}
    </div>
  )
}
