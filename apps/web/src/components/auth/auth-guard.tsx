'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser, type AuthUser } from '@/lib/auth'
import { AuthContext } from './auth-context'

/**
 * Client-side route guard. Redirects to /login when no session is present.
 * Renders nothing until the auth check resolves, to avoid a flash of content.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) {
      router.replace('/login')
      return
    }
    setUser(stored)
    setChecked(true)
  }, [router])

  if (!checked || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    )
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
