'use client'

import { createContext, useContext } from 'react'
import type { AuthUser } from '@/lib/auth'

export const AuthContext = createContext<AuthUser | null>(null)

/** Current authenticated user. Guaranteed non-null inside the (app) shell. */
export function useCurrentUser(): AuthUser {
  const user = useContext(AuthContext)
  if (!user) throw new Error('useCurrentUser must be used within an authenticated route')
  return user
}
