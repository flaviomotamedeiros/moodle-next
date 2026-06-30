'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BookOpen, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingState, EmptyState } from '@/components/ui/states'
import { api } from '@/lib/api-client'

interface CourseDto { id: string; fullName: string; shortName: string }
interface ActivityDto { id: string; name: string; courseId: string; pluginId: string }

function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter(i => (seen.has(i.id) ? false : seen.add(i.id)))
}

function SearchResults() {
  const q = (useSearchParams().get('q') ?? '').trim()
  const needle = q.toLowerCase()

  const [courses, setCourses] = useState<CourseDto[]>([])
  const [activities, setActivities] = useState<ActivityDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) { setLoading(false); return }
    let active = true
    setLoading(true)
    ;(async () => {
      const [mine, catalog] = await Promise.all([
        api.get<CourseDto[]>('/me/courses'),
        api.get<CourseDto[]>('/courses/category/2').catch(() => [] as CourseDto[]),
      ])
      const allCourses = dedupe([...mine, ...catalog])

      // Activities within the user's own courses
      const acts = (
        await Promise.all(
          mine.map(c => api.get<ActivityDto[]>(`/activities?courseId=${c.id}`).catch(() => [])),
        )
      ).flat()

      if (!active) return
      setCourses(allCourses.filter(c =>
        c.fullName.toLowerCase().includes(needle) || c.shortName.toLowerCase().includes(needle),
      ))
      setActivities(acts.filter(a => a.name.toLowerCase().includes(needle)))
      setLoading(false)
    })()
    return () => { active = false }
  }, [q, needle])

  if (!q) return <EmptyState message="Digite algo na busca para começar." />
  if (loading) return <LoadingState label={`Buscando “${q}”…`} />

  const total = courses.length + activities.length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Resultados para “{q}”</h1>
        <p className="mt-1 text-muted-foreground">{total} resultado(s)</p>
      </header>

      {total === 0 && <EmptyState message="Nada encontrado." />}

      {courses.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cursos</h2>
          <Card>
            <ul className="divide-y divide-border">
              {courses.map(c => (
                <li key={c.id}>
                  <Link href={`/courses/${c.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <BookOpen className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{c.fullName}</span>
                    <Badge variant="outline">{c.shortName}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {activities.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Atividades</h2>
          <Card>
            <ul className="divide-y divide-border">
              {activities.map(a => (
                <li key={a.id}>
                  <Link href={`/courses/${a.courseId}/activities/${a.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <FileText className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{a.name}</span>
                    <Badge variant="neutral" className="capitalize">{a.pluginId.replace('mod_', '')}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SearchResults />
    </Suspense>
  )
}
