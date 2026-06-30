'use client'

import { use } from 'react'
import Link from 'next/link'
import { FileText, MessageSquare, ListChecks, ChevronRight, BookText, CalendarCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { PluginSlot } from '@/plugins/plugin-slot'
import { useApi } from '@/lib/use-api'

interface CourseDto {
  id: string
  fullName: string
  shortName: string
  categoryId: string
}

interface ActivityDto {
  id: string
  pluginId: string
  name: string
  sectionId: string
}

const ICON: Record<string, typeof FileText> = {
  mod_assign: FileText,
  mod_quiz: ListChecks,
  mod_forum: MessageSquare,
  mod_page: BookText,
  mod_attendance: CalendarCheck,
}

function modLabel(pluginId: string): string {
  return pluginId.replace('mod_', '')
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const course = useApi<CourseDto>(`/courses/${id}`)
  const activities = useApi<ActivityDto[]>(`/activities?courseId=${id}`)

  if (course.loading) return <LoadingState />
  if (course.error || !course.data) return <ErrorState message={course.error ?? 'Curso não encontrado'} />

  const c = course.data

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground">Meus cursos</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{c.shortName}</span>
      </nav>

      <div className="gradient-brand relative overflow-hidden rounded-xl p-8 text-white shadow-sm">
        <p className="text-sm font-medium text-white/75">{c.shortName}</p>
        <h1 className="mt-1 max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-balance">
          {c.fullName}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">Atividades</h2>

          {activities.loading ? (
            <LoadingState />
          ) : activities.error ? (
            <ErrorState message={activities.error} />
          ) : (
            <Card>
              <ul className="divide-y divide-border">
                {(activities.data ?? []).map(a => {
                  const Icon = ICON[a.pluginId] ?? FileText
                  return (
                    <li key={a.id}>
                      <Link
                        href={`/courses/${c.id}/activities/${a.id}`}
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                      >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{a.name}</p>
                          <p className="text-sm capitalize text-muted-foreground">{modLabel(a.pluginId)}</p>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <PluginSlot
            name="course.sidebar"
            context={{ courseId: c.id, pagePath: `/courses/${c.id}` }}
          />
        </aside>
      </div>
    </div>
  )
}
