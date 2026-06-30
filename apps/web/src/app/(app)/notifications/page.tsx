import { Card } from '@/components/ui/card'
import { CheckCircle2, MessageSquare, GraduationCap, CalendarClock } from 'lucide-react'

const NOTIFICATIONS = [
  { id: 'n1', icon: GraduationCap, title: 'Nota lançada', body: 'Você recebeu 92 em "Topologias de rede".', time: 'há 2 horas', unread: true },
  { id: 'n2', icon: MessageSquare, title: 'Nova resposta no fórum', body: 'Carlos respondeu em "Sub-redes na prática".', time: 'há 5 horas', unread: true },
  { id: 'n3', icon: CalendarClock, title: 'Prazo se aproximando', body: 'A tarefa "Projeto: Cabeamento estruturado" vence em 3 dias.', time: 'ontem', unread: false },
  { id: 'n4', icon: CheckCircle2, title: 'Atividade concluída', body: 'Você concluiu "Quiz: Modelo OSI".', time: 'há 3 dias', unread: false },
]

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter(n => n.unread).length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Notificações</h1>
        <p className="mt-1 text-muted-foreground">
          {unread > 0 ? `${unread} não lidas` : 'Tudo em dia'}
        </p>
      </header>

      <Card>
        <ul className="divide-y divide-border">
          {NOTIFICATIONS.map(({ id, icon: Icon, title, body, time, unread }) => (
            <li
              key={id}
              className={`flex gap-4 p-4 transition-colors hover:bg-muted/40 ${unread ? 'bg-accent/30' : ''}`}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{title}</p>
                  {unread && <span className="size-2 rounded-full bg-primary" aria-label="não lida" />}
                </div>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
