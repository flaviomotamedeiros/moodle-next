'use client'

import { CourseCard, type CourseCardData } from '@/components/course/course-card'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardHero } from '@/components/dashboard/hero'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'
import { useApi, hueFromId } from '@/lib/use-api'
import { GraduationCap, BookOpen, ArrowUpRight } from 'lucide-react'

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

  const teaching = cards.filter(c => c.tag === 'Professor').length

  return (
    <div className="space-y-8">
      <DashboardHero courseCount={loading ? undefined : cards.length} />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={GraduationCap} value={loading ? '—' : cards.length} label="Cursos matriculados" />
        <StatCard icon={BookOpen} value={loading ? '—' : teaching} label="Como professor" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Meus cursos</h2>
        </div>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : cards.length === 0 ? (
          <EmptyState message="Você ainda não está matriculado em nenhum curso." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((course, i) => (
              <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof GraduationCap
  value: string | number
  label: string
}) {
  return (
    <Card className="group relative overflow-hidden">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-inset ring-primary/10 transition-transform group-hover:scale-105">
          <Icon className="size-5" />
        </span>
        <div>
          <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        <ArrowUpRight className="ml-auto size-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
      </CardContent>
    </Card>
  )
}
