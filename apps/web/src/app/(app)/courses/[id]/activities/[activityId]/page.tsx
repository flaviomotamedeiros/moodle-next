'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight, FileText, ListChecks, MessageSquare, BookText, CalendarCheck,
  Send, CheckCircle2, Loader2, Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { useApi } from '@/lib/use-api'
import { api } from '@/lib/api-client'
import { getStoredUser } from '@/lib/auth'

interface ActivityDto { id: string; courseId: string; pluginId: string; name: string }
interface CourseDto { id: string; shortName: string }
interface SubmissionDto { id: string; status: string; content: { text?: string }; submittedAt: string | null }

const ICON: Record<string, typeof FileText> = {
  mod_assign: FileText, mod_quiz: ListChecks, mod_forum: MessageSquare,
  mod_page: BookText, mod_attendance: CalendarCheck,
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
        <CardHeader><CardTitle className="text-base">Descrição</CardTitle></CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Atividade do tipo <span className="font-medium capitalize text-foreground">{modType}</span>,
          carregada do Moodle. O material completo fica disponível na seção do curso.
        </CardContent>
      </Card>

      {a.pluginId === 'mod_assign' ? (
        <SubmissionSection activityId={a.id} />
      ) : (
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Este tipo de atividade é exibido em modo leitura nesta etapa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/** Real submission widget — writes to the new system (Stage 2). */
function SubmissionSection({ activityId }: { activityId: string }) {
  const user = getStoredUser()
  const enrollmentId = user ? `legacy-user-${user.id}` : ''

  const [submission, setSubmission] = useState<SubmissionDto | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    let active = true
    api.get<SubmissionDto | null>(`/activities/${activityId}/submission?enrollmentId=${enrollmentId}`)
      .then(s => { if (active) { setSubmission(s); setText(s?.content?.text ?? '') } })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [activityId, enrollmentId])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const s = await api.post<SubmissionDto>(`/activities/${activityId}/submissions`, {
        enrollmentId, content: { text },
      })
      setSubmission(s)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const submitted = submission?.status === 'submitted' && !editing

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Sua resposta</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : submitted ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-md bg-success-subtle px-4 py-3 text-sm text-success">
              <CheckCircle2 className="size-4" /> Enviado para avaliação.
            </div>
            <p className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm">
              {submission?.content?.text}
            </p>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar resposta</Button>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-3">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={6}
              placeholder="Digite sua resposta…"
              className="w-full rounded-md border border-input bg-background p-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring"
            />
            <Button type="submit" disabled={saving || !text.trim()}>
              {saving ? <Loader2 className="animate-spin" /> : <Send />} Enviar resposta
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
