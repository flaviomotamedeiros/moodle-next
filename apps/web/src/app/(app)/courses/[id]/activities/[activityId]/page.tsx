'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ChevronRight, FileText, ListChecks, MessageSquare, BookText, CalendarCheck, Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { useApi } from '@/lib/use-api'

interface ActivityDto {
  id: string
  courseId: string
  pluginId: string
  name: string
}
interface CourseDto { id: string; shortName: string }

const ICON: Record<string, typeof FileText> = {
  mod_assign: FileText,
  mod_quiz: ListChecks,
  mod_forum: MessageSquare,
  mod_page: BookText,
  mod_attendance: CalendarCheck,
}

export default function ActivityPage({
  params,
}: {
  params: Promise<{ id: string; activityId: string }>
}) {
  const { id, activityId } = use(params)
  const activity = useApi<ActivityDto>(`/activities/${activityId}`)
  const course = useApi<CourseDto>(`/courses/${id}`)

  if (activity.loading) return <LoadingState />
  if (activity.error || !activity.data)
    return <ErrorState message={activity.error ?? 'Atividade não encontrada'} />

  const a = activity.data
  const Icon = ICON[a.pluginId] ?? FileText
  const modType = a.pluginId.replace('mod_', '')

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground">Meus cursos</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/courses/${id}`} className="hover:text-foreground">
          {course.data?.shortName ?? 'Curso'}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{a.name}</span>
      </nav>

      <div className="flex items-start gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <Badge variant="outline" className="capitalize">{modType}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance">{a.name}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descrição</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Atividade do tipo <span className="font-medium capitalize text-foreground">{modType}</span>,
          carregada diretamente do Moodle. O conteúdo completo e o material da seção
          ficam disponíveis na plataforma.
        </CardContent>
      </Card>

      {/* Stage 1: writes still live in the legacy system. */}
      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium">Envios e avaliação são feitos no Moodle atual</p>
            <p className="mt-1 text-muted-foreground">
              Nesta fase de migração, a nova plataforma exibe os dados em modo leitura.
              Submeter respostas e lançar notas continua no sistema legado até a próxima etapa.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
