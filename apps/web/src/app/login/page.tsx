'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Logo } from '@/components/app-shell/logo'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(900px circle at 20% 10%, hsl(245 80% 70%), transparent 45%), radial-gradient(700px circle at 90% 90%, hsl(265 75% 55%), transparent 40%)',
          }}
        />
        <div className="relative">
          <Logo className="[&_span]:text-primary-foreground" />
        </div>
        <div className="relative max-w-md">
          <p className="text-2xl font-semibold leading-snug tracking-tight text-balance">
            Uma plataforma de aprendizagem moderna, construída sobre fundamentos sólidos.
          </p>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Domínio modelado com DDD · Extensível por contratos · Acessível por padrão
          </p>
        </div>
        <div className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} moodle-next
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="ana.cavalcante"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 rounded-md border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Acesso de demonstração</p>
            <p className="mt-1">
              Usuário <code className="rounded bg-background px-1 py-0.5">ana.cavalcante</code> ·
              senha <code className="rounded bg-background px-1 py-0.5">Moodle@2025</code>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
