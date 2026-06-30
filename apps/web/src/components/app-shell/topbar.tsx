'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, PanelLeft } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'
import { useSidebar } from './sidebar-context'

export function Topbar() {
  const router = useRouter()
  const { toggle } = useSidebar()
  const [query, setQuery] = useState('')

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <button
        onClick={toggle}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Expandir ou colapsar menu"
      >
        <PanelLeft className="size-[18px]" />
      </button>

      <form onSubmit={onSearch} className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar cursos, atividades…"
          className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background"
          aria-label="Buscar"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
