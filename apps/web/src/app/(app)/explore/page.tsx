'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, Plus, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { api } from '@/lib/api-client'

interface CourseDto { id: string; fullName: string; shortName: string }
interface MyCourse { id: string }

/** The category that holds the IFAL courses in the seed. */
const CATALOG_CATEGORY = '2'

export default function ExplorePage() {
  const [courses, setCourses] = useState<CourseDto[] | null>(null)
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Course creation (Stage 2 write → new DB)
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [shortName, setShortName] = useState('')
  const [creating, setCreating] = useState(false)

  async function loadCatalog() {
    const [catalog, mine] = await Promise.all([
      api.get<CourseDto[]>(`/courses/category/${CATALOG_CATEGORY}`),
      api.get<MyCourse[]>('/me/courses'),
    ])
    setCourses(catalog)
    setEnrolledIds(new Set(mine.map(c => c.id)))
  }

  useEffect(() => {
    let active = true
    loadCatalog().catch(err => {
      if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar')
    })
    return () => { active = false }
  }, [])

  async function createCourse(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/courses', { fullName, shortName, categoryId: CATALOG_CATEGORY })
      setFullName(''); setShortName(''); setShowForm(false)
      await loadCatalog()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar o curso')
    } finally {
      setCreating(false)
    }
  }

  async function enroll(courseId: string) {
    setPending(courseId)
    try {
      await api.post(`/me/courses/${courseId}/enroll`, {})
      setEnrolledIds(prev => new Set(prev).add(courseId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível matricular')
    } finally {
      setPending(null)
    }
  }

  if (error) return <ErrorState message={error} />
  if (!courses) return <LoadingState />

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Explorar cursos</h1>
          <p className="mt-1 text-muted-foreground">
            Matricule-se em novos cursos. A matrícula é gravada no sistema novo e aparece no seu painel.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowForm(v => !v)}>
          <Sparkles /> Novo curso
        </Button>
      </header>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Criar curso (grava no sistema novo)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createCourse} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fullName">Nome do curso</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Inteligência Artificial Aplicada" />
              </div>
              <div className="space-y-2 sm:w-40">
                <Label htmlFor="shortName">Sigla</Label>
                <Input id="shortName" value={shortName} onChange={e => setShortName(e.target.value)} required placeholder="IA-APL" />
              </div>
              <Button type="submit" disabled={creating || !fullName.trim() || !shortName.trim()}>
                {creating ? <Loader2 className="animate-spin" /> : <Plus />} Criar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => {
          const enrolled = enrolledIds.has(course.id)
          return (
            <Card key={course.id} className="flex flex-col overflow-hidden">
              <div className="relative h-16 w-full overflow-hidden border-b border-border bg-accent">
                <span className="absolute -right-1 -top-1.5 select-none text-6xl font-bold leading-none text-primary/10">
                  {course.shortName.slice(0, 3)}
                </span>
              </div>
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit">{course.shortName}</Badge>
                <CardTitle className="line-clamp-2 text-base leading-snug">{course.fullName}</CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                {enrolled ? (
                  <Button variant="secondary" className="w-full" disabled>
                    <Check /> Matriculado
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => enroll(course.id)}
                    disabled={pending === course.id}
                  >
                    {pending === course.id ? <Loader2 className="animate-spin" /> : <Plus />}
                    Matricular-me
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
