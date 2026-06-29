import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/app-shell/logo'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo />
      <div>
        <p className="text-6xl font-semibold tracking-tight text-primary">404</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">Página não encontrada</h1>
        <p className="mt-1 text-muted-foreground">
          O conteúdo que você procura não existe ou foi movido.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants()}>
        Voltar ao painel
      </Link>
    </main>
  )
}
