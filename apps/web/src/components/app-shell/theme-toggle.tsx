'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/** Minimal theme toggle — persists to localStorage, respects system on first load. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('mn_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('mn_theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
    </button>
  )
}
