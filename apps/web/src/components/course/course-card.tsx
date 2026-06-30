import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export interface CourseCardData {
  id: string
  fullName: string
  shortName: string
  /** Optional context chip (category name or the user's role). */
  tag?: string
  /** Per-user progress 0–100. Undefined when not available (Stage 1). */
  progress?: number
  /** Kept for compatibility; no longer used for coloring. */
  hue?: number
}

export function CourseCard({ course }: { course: CourseCardData }) {
  const tone = course.progress === 100 ? 'success' : 'primary'

  return (
    <Link href={`/courses/${course.id}`} className="group block focus-visible:outline-none">
      <Card interactive className="h-full overflow-hidden">
        {/* Flat brand-tinted cover with a quiet sigla watermark — no gradient */}
        <div className="relative h-16 w-full overflow-hidden border-b border-border bg-accent">
          <span className="absolute -right-1 -top-1.5 select-none text-6xl font-bold leading-none text-primary/10">
            {course.shortName.slice(0, 3)}
          </span>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{course.shortName}</Badge>
            {course.tag && <span className="text-xs text-muted-foreground">{course.tag}</span>}
          </div>
          <h3 className="line-clamp-2 font-semibold leading-snug tracking-tight text-balance transition-colors group-hover:text-primary">
            {course.fullName}
          </h3>
        </CardHeader>

        <CardContent>
          {course.progress !== undefined ? (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span className="font-medium tabular-nums text-foreground">{course.progress}%</span>
              </div>
              <Progress value={course.progress} tone={tone} className="mt-2" />
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Acessar curso <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
