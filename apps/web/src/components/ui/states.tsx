import { AlertCircle, Inbox } from 'lucide-react'

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
      <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
      {label}
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <AlertCircle className="size-8 text-danger" />
      <p className="font-medium">Não foi possível carregar</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
