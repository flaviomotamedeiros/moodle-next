'use client'

import { useEffect, useState } from 'react'
import { Loader2, Check, ClipboardCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api-client'

interface MyCourse { id: string; fullName: string; shortName: string; role: string }
interface ActivityDto { id: string; name: string; pluginId: string }
interface Participant { userId: string; name: string; enrollmentRef: string }
interface SubmissionDto { content: { text?: string }; status: string }
interface GradeItem { activityId: string; value: number | null }
interface Gradebook { grades: GradeItem[] }

interface Row {
  participant: Participant
  submissionText: string | null
  grade: string // input value
  saving: boolean
  saved: boolean
}

export default function TeachPage() {
  const [courses, setCourses] = useState<MyCourse[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)
  const [activities, setActivities] = useState<ActivityDto[]>([])
  const [activityId, setActivityId] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[] | null>(null)
  const [loadingRows, setLoadingRows] = useState(false)

  // Teacher's courses
  useEffect(() => {
    api.get<MyCourse[]>('/me/courses')
      .then(cs => setCourses(cs.filter(c => c.role === 'teacher')))
      .catch(e => setError(e instanceof Error ? e.message : 'Erro'))
  }, [])

  // Assignments of the selected course
  useEffect(() => {
    if (!courseId) return
    setActivityId(null); setRows(null)
    api.get<ActivityDto[]>(`/activities?courseId=${courseId}`)
      .then(as => setActivities(as.filter(a => a.pluginId === 'mod_assign')))
      .catch(e => setError(e instanceof Error ? e.message : 'Erro'))
  }, [courseId])

  // Students + their submission/grade for the selected assignment
  useEffect(() => {
    if (!courseId || !activityId) return
    setLoadingRows(true)
    ;(async () => {
      try {
        const participants = await api.get<Participant[]>(`/courses/${courseId}/participants`)
        const built = await Promise.all(
          participants.map(async p => {
            const [sub, book] = await Promise.all([
              api.get<SubmissionDto | null>(`/activities/${activityId}/submission?enrollmentId=${p.enrollmentRef}`),
              api.get<Gradebook>(`/grades/courses/${courseId}?enrollmentId=${p.enrollmentRef}`),
            ])
            const existing = book.grades.find(g => g.activityId === activityId)
            return {
              participant: p,
              submissionText: sub?.content?.text ?? null,
              grade: existing?.value != null ? String(existing.value) : '',
              saving: false,
              saved: false,
            } satisfies Row
          }),
        )
        setRows(built)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro')
      } finally {
        setLoadingRows(false)
      }
    })()
  }, [courseId, activityId])

  function updateRow(userId: string, patch: Partial<Row>) {
    setRows(rs => rs?.map(r => (r.participant.userId === userId ? { ...r, ...patch } : r)) ?? null)
  }

  async function saveGrade(row: Row) {
    if (!activityId) return
    updateRow(row.participant.userId, { saving: true, saved: false })
    try {
      await api.post(`/grades/activities/${activityId}`, {
        enrollmentId: row.participant.enrollmentRef,
        value: Number(row.grade),
      })
      updateRow(row.participant.userId, { saving: false, saved: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar nota')
      updateRow(row.participant.userId, { saving: false })
    }
  }

  if (error) return <ErrorState message={error} />
  if (!courses) return <LoadingState />
  if (courses.length === 0)
    return <EmptyState message="Você não leciona nenhum curso para avaliar." />

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Avaliar</h1>
        <p className="mt-1 text-muted-foreground">
          Lance notas das tarefas. As notas são gravadas no sistema novo e aparecem no boletim do aluno.
        </p>
      </header>

      {/* Course selector */}
      <div className="flex flex-wrap gap-2">
        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setCourseId(c.id)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              courseId === c.id ? 'border-primary bg-accent text-accent-foreground' : 'border-border hover:bg-muted',
            )}
          >
            {c.shortName}
          </button>
        ))}
      </div>

      {/* Assignment selector */}
      {courseId && (
        activities.length === 0 ? (
          <EmptyState message="Nenhuma tarefa (assign) neste curso." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {activities.map(a => (
              <button
                key={a.id}
                onClick={() => setActivityId(a.id)}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  activityId === a.id ? 'border-primary bg-accent text-accent-foreground' : 'border-border hover:bg-muted',
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
        )
      )}

      {/* Grading table */}
      {activityId && (
        loadingRows ? (
          <LoadingState label="Carregando alunos…" />
        ) : !rows || rows.length === 0 ? (
          <EmptyState message="Nenhum aluno matriculado neste curso." />
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="size-4 text-primary" /> Alunos ({rows.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border border-t border-border">
                {rows.map(row => (
                  <li key={row.participant.userId} className="flex items-center gap-4 px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{row.participant.name}</p>
                      {row.submissionText ? (
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          “{row.submissionText}”
                        </p>
                      ) : (
                        <Badge variant="neutral" className="mt-1">Sem envio</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={row.grade}
                        onChange={e => updateRow(row.participant.userId, { grade: e.target.value, saved: false })}
                        className="w-20 text-right"
                        placeholder="0–100"
                      />
                      <Button
                        size="sm"
                        variant={row.saved ? 'secondary' : 'primary'}
                        onClick={() => saveGrade(row)}
                        disabled={row.saving || row.grade === ''}
                      >
                        {row.saving ? <Loader2 className="animate-spin" /> : row.saved ? <Check /> : null}
                        {row.saved ? 'Salvo' : 'Salvar'}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
