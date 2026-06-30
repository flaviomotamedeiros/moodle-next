'use client'

import { useEffect, useState } from 'react'
import { api } from './api-client'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Minimal data-fetching hook for authenticated GET requests.
 * Pass `null` as path to skip the request.
 */
export function useApi<T>(path: string | null): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: !!path, error: null })

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null })
      return
    }
    let active = true
    setState({ data: null, loading: true, error: null })
    api
      .get<T>(path)
      .then(data => active && setState({ data, loading: false, error: null }))
      .catch(err => active && setState({ data: null, loading: false, error: err.message }))
    return () => {
      active = false
    }
  }, [path])

  return state
}

/** Deterministic hue from a course id, for the cover gradient. */
export function hueFromId(id: string): number {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360
  return h
}
