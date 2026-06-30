'use client'

import { useCurrentUser } from '@/components/auth/auth-context'

export function Greeting() {
  const user = useCurrentUser()
  const firstName = user.name.split(' ')[0]

  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-tight">Olá, {firstName} 👋</h1>
      <p className="mt-1 text-muted-foreground">
        Aqui está um resumo da sua jornada de aprendizagem.
      </p>
    </header>
  )
}
