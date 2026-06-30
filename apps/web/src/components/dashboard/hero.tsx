'use client'

import { useCurrentUser } from '@/components/auth/auth-context'

const ROLE_LABEL = { student: 'Estudante', teacher: 'Professor', admin: 'Administrador' } as const

function greetingByHour(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function DashboardHero({ courseCount }: { courseCount?: number }) {
  const user = useCurrentUser()
  const firstName = user.name.split(' ')[0]

  return (
    <section className="gradient-brand relative overflow-hidden rounded-2xl p-8 text-white shadow-sm sm:p-10">
      {/* One quiet highlight for depth */}
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">
        <p className="text-sm font-medium text-white/70">{greetingByHour()},</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{firstName} 👋</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
          {courseCount != null
            ? `Você está em ${courseCount} curso${courseCount === 1 ? '' : 's'}. Continue de onde parou.`
            : 'Bem-vindo de volta à sua jornada de aprendizagem.'}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
          {ROLE_LABEL[user.role]}
        </div>
      </div>
    </section>
  )
}
