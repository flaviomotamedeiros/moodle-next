'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Compass, GraduationCap, ClipboardCheck, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { useSidebar } from './sidebar-context'

const NAV = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/courses', label: 'Meus cursos', icon: BookOpen },
  { href: '/explore', label: 'Explorar', icon: Compass },
  { href: '/grades', label: 'Notas', icon: GraduationCap },
  { href: '/teach', label: 'Avaliar', icon: ClipboardCheck },
  { href: '/notifications', label: 'Notificações', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed } = useSidebar()

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 lg:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center', collapsed ? 'justify-center px-0' : 'px-6')}>
        <Link href="/dashboard" aria-label="moodle-next — início">
          <Logo showText={!collapsed} />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-all',
                collapsed ? 'justify-center px-0' : 'px-3',
                active
                  ? 'bg-accent text-accent-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon className={cn('size-[18px] shrink-0', active && 'text-primary')} />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          title={collapsed ? 'Configurações' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-md py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            collapsed ? 'justify-center px-0' : 'px-3',
          )}
        >
          <Settings className="size-[18px] shrink-0" />
          {!collapsed && 'Configurações'}
        </Link>
      </div>
    </aside>
  )
}
