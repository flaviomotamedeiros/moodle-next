/**
 * Typed client for the moodle-next API.
 * Requests are proxied through Next.js rewrites to the NestJS backend,
 * so the browser never talks to the legacy Moodle directly.
 */

export interface ApiError {
  error: string
  message: string
}

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('mn_token', token)
      else localStorage.removeItem('mn_token')
    }
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('mn_token')
    }
    return this.token
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`/api${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...init?.headers,
      },
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as ApiError | null
      throw new Error(body?.message ?? `Request failed: ${res.status}`)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }
  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
  }
  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
  }
  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const api = new ApiClient()

// ── Domain DTOs (mirror the API responses) ──────────────────────────

export interface Course {
  id: string
  fullName: string
  shortName: string
  categoryId: string
  visible: boolean
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  role: 'student' | 'teacher' | 'guest'
  status: 'active' | 'suspended'
}

export interface GradebookEntry {
  finalGrade: number | null
  grades: {
    id: string
    activityId: string
    value: number | null
    maxValue: number
    feedback?: string
  }[]
}
