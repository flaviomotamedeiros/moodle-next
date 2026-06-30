'use client'

import { CourseCard, type CourseCardData } from '@/components/course/course-card'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'
import { useApi, hueFromId } from '@/lib/use-api'

interface MyCourse {
  id: string
  fullName: string
  shortName: string
  role: 'student' | 'teacher' | 'guest'
}

const ROLE_LABEL = { student: 'Estudante', teacher: 'Professor', guest: 'Visitante' } as const

export default function CoursesPage() {
  const { data: courses, loading, error } = useApi<MyCourse[]>('/me/courses')

  const cards: CourseCardData[] = (courses ?? []).map(c => ({
    id: c.id,
    fullName: c.fullName,
    shortName: c.shortName,
    tag: ROLE_LABEL[c.role],
    hue: hueFromId(c.id),
  }))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Meus cursos</h1>
        <p className="mt-1 text-muted-foreground">
          {loading ? 'Carregando…' : `${cards.length} cursos`}
        </p>
      </header>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : cards.length === 0 ? (
        <EmptyState message="Nenhum curso encontrado." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
