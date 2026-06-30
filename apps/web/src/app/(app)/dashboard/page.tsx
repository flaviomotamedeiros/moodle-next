'use client'

import { CourseCard, type CourseCardData } from '@/components/course/course-card'
import { Card, CardContent } from '@/components/ui/card'
import { Greeting } from '@/components/dashboard/greeting'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'
import { useApi, hueFromId } from '@/lib/use-api'
import { GraduationCap, BookOpen } from 'lucide-react'

interface MyCourse {
  id: string
  fullName: string
  shortName: string
  role: 'student' | 'teacher' | 'guest'
}

const ROLE_LABEL = { student: 'Estudante', teacher: 'Professor', guest: 'Visitante' } as const

export default function DashboardPage() {
  const { data: courses, loading, error } = useApi<MyCourse[]>('/me/courses')

  const cards: CourseCardData[] = (courses ?? []).map(c => ({
    id: c.id,
    fullName: c.fullName,
    shortName: c.shortName,
    tag: ROLE_LABEL[c.role],
    hue: hueFromId(c.id),
  }))

  return (
    <div className="space-y-8">
      <Greeting />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">
                {loading ? '—' : cards.length}
              </div>
              <div className="text-sm text-muted-foreground">Cursos matriculados</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <BookOpen className="size-5" />
            </span>
            <div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">
                {loading ? '—' : cards.filter(c => c.tag === 'Professor').length}
              </div>
              <div className="text-sm text-muted-foreground">Como professor</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Meus cursos</h2>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : cards.length === 0 ? (
          <EmptyState message="Você ainda não está matriculado em nenhum curso." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
