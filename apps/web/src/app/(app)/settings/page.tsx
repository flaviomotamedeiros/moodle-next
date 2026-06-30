'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useCurrentUser } from '@/components/auth/auth-context'

const ROLE_LABEL = { student: 'Estudante', teacher: 'Professor', admin: 'Administrador' } as const

export default function SettingsPage() {
  const user = useCurrentUser()

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-muted-foreground">Gerencie seu perfil e preferências.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{ROLE_LABEL[user.role]}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" defaultValue={user.username} disabled />
            </div>
          </div>

          <Button>Salvar alterações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PreferenceRow label="Notificações por e-mail" description="Receber resumos de atividades e notas" defaultChecked />
          <PreferenceRow label="Notificações no aplicativo" description="Alertas em tempo real na plataforma" defaultChecked />
          <PreferenceRow label="Resumo semanal" description="Um panorama do seu progresso toda segunda-feira" />
        </CardContent>
      </Card>
    </div>
  )
}

function PreferenceRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
      <input type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-primary" />
    </label>
  )
}
