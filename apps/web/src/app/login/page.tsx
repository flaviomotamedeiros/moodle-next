'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
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
      <div className="bg-mesh relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-dots opacity-[0.15] [--foreground:0_0%_100%]" />
        <div className="relative">
          <Logo className="[&_span]:text-white" />
        </div>
        <div className="relative max-w-md">
          <p className="text-3xl font-semibold leading-tight tracking-tight text-balance">
            O Moodle que você conhece, reimaginado.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Mesma base de dados, uma experiência moderna, rápida e acessível.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/85">
            {[
              'Domínio modelado com DDD',
              'Extensível por contratos de plugin',
              'Acessível por padrão (WCAG AA)',
            ].map(item => (
              <li key={item} className="flex items-center gap-3">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-xs text-white/60">
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
