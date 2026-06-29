import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COURSES, ACTIVITIES } from '@/lib/mock-data'

/** Flattened gradebook view across all courses with assigned grades. */
const rows = COURSES.flatMap(course =>
  (ACTIVITIES[course.id] ?? [])
    .filter(a => a.grade !== null)
    .map(a => ({
      course: course.shortName,
      courseFull: course.fullName,
      activity: a.name,
      grade: a.grade!,
      maxGrade: a.maxGrade,
    })),
)

function gradeTone(pct: number): 'success' | 'warning' | 'danger' {
  if (pct >= 70) return 'success'
  if (pct >= 50) return 'warning'
  return 'danger'
}

export default function GradesPage() {
  const average =
    rows.length > 0
      ? Math.round(rows.reduce((sum, r) => sum + (r.grade / r.maxGrade) * 100, 0) / rows.length)
      : 0

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notas</h1>
          <p className="mt-1 text-muted-foreground">Seu desempenho em todas as atividades avaliadas.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums tracking-tight">{average}%</div>
          <div className="text-sm text-muted-foreground">Média geral</div>
        </div>
      </header>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Curso</th>
              <th className="px-5 py-3 font-medium">Atividade</th>
              <th className="px-5 py-3 text-right font-medium">Nota</th>
              <th className="px-5 py-3 text-right font-medium">Percentual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => {
              const pct = Math.round((r.grade / r.maxGrade) * 100)
              return (
                <tr key={i} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <Badge variant="outline">{r.course}</Badge>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{r.activity}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {r.grade}
                    <span className="text-muted-foreground">/{r.maxGrade}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Badge variant={gradeTone(pct)}>{pct}%</Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
