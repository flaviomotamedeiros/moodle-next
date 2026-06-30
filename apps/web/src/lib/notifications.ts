import { GraduationCap, MessageSquare, CalendarClock, CheckCircle2, type LucideIcon } from 'lucide-react'

export interface NotificationItem {
  id: string
  icon: LucideIcon
  title: string
  body: string
  /** Full message shown in the detail view. */
  detail: string
  time: string
  /** Optional link to the related resource. */
  href?: string
  hrefLabel?: string
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    icon: GraduationCap,
    title: 'Nota lançada',
    body: 'Você recebeu 92 em "Topologias de rede".',
    detail:
      'O professor lançou sua nota na tarefa "Topologias de rede" do curso Técnico em Redes de Computadores. Você obteve 92 de 100. O feedback do professor está disponível na página da atividade.',
    time: 'há 2 horas',
    href: '/grades',
    hrefLabel: 'Ver no boletim',
  },
  {
    id: 'n2',
    icon: MessageSquare,
    title: 'Nova resposta no fórum',
    body: 'Carlos respondeu em "Sub-redes na prática".',
    detail:
      'Carlos Mendonça respondeu à sua mensagem no fórum "Sub-redes na prática". Acesse o fórum para ler a resposta e continuar a discussão.',
    time: 'há 5 horas',
    href: '/courses/2',
    hrefLabel: 'Abrir o curso',
  },
  {
    id: 'n3',
    icon: CalendarClock,
    title: 'Prazo se aproximando',
    body: 'A tarefa "Projeto: Cabeamento estruturado" vence em 3 dias.',
    detail:
      'A entrega da tarefa "Projeto: Cabeamento estruturado" se encerra em 3 dias. Certifique-se de enviar sua resposta antes do prazo para não perder pontos.',
    time: 'ontem',
    href: '/courses/2',
    hrefLabel: 'Ir para o curso',
  },
  {
    id: 'n4',
    icon: CheckCircle2,
    title: 'Atividade concluída',
    body: 'Você concluiu "Quiz: Modelo OSI".',
    detail:
      'Sua conclusão da atividade "Quiz: Modelo OSI" foi registrada. Bom trabalho! Você pode revisar suas respostas na página da atividade.',
    time: 'há 3 dias',
  },
]
