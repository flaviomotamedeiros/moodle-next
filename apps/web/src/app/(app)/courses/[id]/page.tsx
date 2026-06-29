import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FileText, MessageSquare, ListChecks, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CompletionBadge } from '@/components/course/completion-badge'
import { PluginSlot } from '@/plugins/plugin-slot'
import { COURSES, ACTIVITIES, type ActivityRow } from '@/lib/mock-data'

const TYPE_ICON = {
  assign: FileText,
  quiz: ListChecks,
  forum: MessageSquare,
} as const

const TYPE_LABEL = {
  assign: 'Tarefa',
  quiz: 'Questionário',
  forum: 'Fórum',
} as const

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const course = COURSES.find(c => c.id === id)
  if (!course) notFound()

  const activities = ACTIVITIES[id] ?? []
  const done = activities.filter(a => a.status === 'complete').length

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground">Meus cursos</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{course.shortName}</span>
      </nav>

      {/* Header */}
      <div
        className="relative overflow-hidden rounded-lg p-8 text-white"
        style={{
          background: `linear-gradient(135deg, hsl(${course.hue} 70% 50%), hsl(${course.hue + 30} 65% 42%))`,
        }}
      >
        <p className="text-sm font-medium text-white/80">{course.category}</p>
        <h1 className="mt-1 max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-balance">
          {course.fullName}
        </h1>
        <div className="mt-6 max-w-xs">
          <div className="flex items-center justify-between text-sm text-white/90">
            <span>Progresso do curso</span>
            <span className="font-semibold tabular-nums">{course.progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activities */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Atividades</h2>
            <span className="text-sm text-muted-foreground">
              {done} de {activities.length} concluídas
            </span>
          </div>

          <Card>
            <ul className="divide-y divide-border">
              {activities.map(activity => (
                <ActivityItem key={activity.id} courseId={id} activity={activity} />
              ))}
            </ul>
          </Card>
        </div>

        {/* Sidebar — plugins inject here */}
        <aside className="space-y-4">
          <PluginSlot
            name="course.sidebar"
            context={{ courseId: id, pagePath: `/courses/${id}` }}
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Blocos da barra lateral</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Plugins registrados no slot{' '}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">course.sidebar</code>{' '}
                  aparecem aqui (ex.: prazos, atividade recente, progresso).
                </CardContent>
              </Card>
            }
          />
        </aside>
      </div>
    </div>
  )
}

function ActivityItem({ courseId, activity }: { courseId: string; activity: ActivityRow }) {
  const Icon = TYPE_ICON[activity.type]
  return (
    <li>
      <Link
        href={`/courses/${courseId}/activities/${activity.id}`}
        className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{activity.name}</p>
          <p className="text-sm text-muted-foreground">
            {TYPE_LABEL[activity.type]} ·{' '}
            {new Date(activity.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </p>
        </div>
        {activity.grade !== null && (
          <span className="text-sm font-semibold tabular-nums">
            {activity.grade}
            <span className="text-muted-foreground">/{activity.maxGrade}</span>
          </span>
        )}
        <CompletionBadge status={activity.status} />
      </Link>
    </li>
  )
}
