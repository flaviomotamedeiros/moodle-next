import { Check, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type CompletionStatus = 'complete' | 'in_progress' | 'overdue' | 'not_started'

const CONFIG: Record<
  CompletionStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral'; icon: typeof Check }
> = {
  complete: { label: 'Concluído', variant: 'success', icon: Check },
  in_progress: { label: 'Em andamento', variant: 'warning', icon: Clock },
  overdue: { label: 'Atrasado', variant: 'danger', icon: AlertCircle },
  not_started: { label: 'Não iniciado', variant: 'neutral', icon: Clock },
}

export function CompletionBadge({ status }: { status: CompletionStatus }) {
  const { label, variant, icon: Icon } = CONFIG[status]
  return (
    <Badge variant={variant} data-status={status}>
      <Icon />
      {label}
    </Badge>
  )
}
