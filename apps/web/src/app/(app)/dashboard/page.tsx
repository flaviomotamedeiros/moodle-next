import { CourseCard } from '@/components/course/course-card'
import { Card, CardContent } from '@/components/ui/card'
import { COURSES, CURRENT_USER, ACTIVITIES } from '@/lib/mock-data'
import { CompletionBadge } from '@/components/course/completion-badge'
import { CalendarDays, GraduationCap, TrendingUp } from 'lucide-react'

const upcoming = ACTIVITIES['2'].filter(a => a.status !== 'complete').slice(0, 3)

const STATS = [
  { label: 'Cursos ativos', value: COURSES.length, icon: GraduationCap },
  { label: 'Atividades pendentes', value: upcoming.length, icon: CalendarDays },
  { label: 'Progresso médio', value: '59%', icon: TrendingUp },
]

export default function DashboardPage() {
  const firstName = CURRENT_USER.name.split(' ')[0]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Olá, {firstName} 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Aqui está um resumo da sua jornada de aprendizagem.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <div>
                <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Meus cursos</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Próximas atividades</h2>
        <Card>
          <ul className="divide-y divide-border">
            {upcoming.map(a => (
              <li key={a.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Entrega em {new Date(a.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </p>
                </div>
                <CompletionBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  )
}
