'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, GraduationCap, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

const NAV = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/courses', label: 'Meus cursos', icon: BookOpen },
  { href: '/grades', label: 'Notas', icon: GraduationCap },
  { href: '/notifications', label: 'Notificações', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" aria-label="moodle-next — início">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-[18px]" />
          Configurações
        </Link>
      </div>
    </aside>
  )
}
