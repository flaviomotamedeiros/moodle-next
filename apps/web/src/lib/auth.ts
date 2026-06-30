/**
 * Real authentication against the API (POST /auth/login → backend AuthPlugin → mdl_user).
 * Stores the JWT (via api-client) and the user profile in localStorage.
 */
import { api } from './api-client'

export interface AuthUser {
  id: string
  username: string
  name: string
  role: 'student' | 'teacher' | 'admin'
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

const USER_KEY = 'mn_user'

export async function login(username: string, password: string): Promise<AuthUser> {
  const res = await api.post<LoginResponse>('/auth/login', { username, password })
  api.setToken(res.accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(res.user))
  return res.user
}

export function logout(): void {
  api.setToken(null)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}
