'use client'

import { Search } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { ThemeToggle } from './theme-toggle'

export function Topbar({ userName = 'Ana Cavalcante' }: { userName?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar cursos, atividades…"
          className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background"
          aria-label="Buscar"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <button
          className="flex items-center gap-2.5 rounded-full p-0.5 transition-opacity hover:opacity-80"
          aria-label="Menu do usuário"
        >
          <Avatar name={userName} size="sm" />
        </button>
      </div>
    </header>
  )
}
