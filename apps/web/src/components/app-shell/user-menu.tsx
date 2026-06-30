'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useCurrentUser } from '@/components/auth/auth-context'
import { logout } from '@/lib/auth'

const ROLE_LABEL = { student: 'Estudante', teacher: 'Professor', admin: 'Administrador' } as const

export function UserMenu() {
  const router = useRouter()
  const user = useCurrentUser()
  const [open, setOpen] = useState(false)

  function onLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-colors hover:bg-muted"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu do usuário"
      >
        <Avatar name={user.name} size="sm" />
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-60 origin-top-right animate-fade-in rounded-lg border border-border bg-card p-1.5 shadow-lg"
          >
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar name={user.name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</p>
              </div>
            </div>

            <div className="my-1 h-px bg-border" />

            <button
              role="menuitem"
              onClick={() => { setOpen(false); router.push('/settings') }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted"
            >
              <UserIcon className="size-4 text-muted-foreground" />
              Meu perfil
            </button>

            <button
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-danger transition-colors hover:bg-danger-subtle"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  )
}
