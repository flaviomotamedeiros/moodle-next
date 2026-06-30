'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'
import { api } from '@/lib/api-client'
import { getStoredUser } from '@/lib/auth'

interface MyCourse { id: string; fullName: string; shortName: string }
interface GradeItem { id: string; activityId: string; value: number | null; maxValue: number; percentage: number | null }
interface Gradebook { finalGrade: number | null; grades: GradeItem[] }

interface CourseGrades { course: MyCourse; book: Gradebook }

function tone(pct: number): 'success' | 'warning' | 'danger' {
  if (pct >= 70) return 'success'
  if (pct >= 50) return 'warning'
  return 'danger'
}

export default function GradesPage() {
  const [data, setData] = useState<CourseGrades[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const user = getStoredUser()
    if (!user) return

    ;(async () => {
      try {
        const courses = await api.get<MyCourse[]>('/me/courses')
        const enrollmentId = `legacy-user-${user.id}`
        const books = await Promise.all(
          courses.map(async course => {
            const book = await api.get<Gradebook>(
              `/grades/courses/${course.id}?enrollmentId=${enrollmentId}`,
            )
            return { course, book }
          }),
        )
        if (active) setData(books.filter(b => b.book.grades.length > 0))
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar notas')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => { active = false }
  }, [])

  if (loading) return <LoadingState label="Carregando notas…" />
  if (error) return <ErrorState message={error} />
  if (!data || data.length === 0) return <EmptyState message="Nenhuma nota lançada ainda." />

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Notas</h1>
        <p className="mt-1 text-muted-foreground">Seu desempenho por curso, direto do Moodle.</p>
      </header>

      <div className="space-y-5">
        {data.map(({ course, book }) => (
          <Card key={course.id}>
            <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
              <div className="min-w-0">
                <CardTitle className="truncate text-base">{course.fullName}</CardTitle>
                <Badge variant="outline" className="mt-1">{course.shortName}</Badge>
              </div>
              {book.finalGrade !== null && (
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums tracking-tight">
                    {book.finalGrade.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Média</div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border border-t border-border">
                {book.grades.filter(g => g.value !== null).map(g => (
                  <li key={g.id} className="flex items-center justify-between gap-4 px-6 py-3">
                    <span className="truncate text-sm capitalize text-muted-foreground">
                      {g.activityId.replace('-', ' ')}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums">
                        {g.value}<span className="text-muted-foreground">/{g.maxValue}</span>
                      </span>
                      {g.percentage !== null && (
                        <Badge variant={tone(g.percentage)}>{Math.round(g.percentage)}%</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
