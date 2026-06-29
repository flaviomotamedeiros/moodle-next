import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export interface CourseCardData {
  id: string
  fullName: string
  shortName: string
  category: string
  progress: number
  /** Deterministic accent hue for the cover, derived from the course id */
  hue: number
}

export function CourseCard({ course }: { course: CourseCardData }) {
  const tone = course.progress === 100 ? 'success' : 'primary'

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <Card interactive className="h-full overflow-hidden">
        {/* Cover — a calm gradient keyed to the course, not a stock photo */}
        <div
          className="h-24 w-full"
          style={{
            background: `linear-gradient(135deg, hsl(${course.hue} 70% 56%), hsl(${course.hue + 30} 65% 48%))`,
          }}
        />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{course.shortName}</Badge>
            <span className="text-xs text-muted-foreground">{course.category}</span>
          </div>
          <h3 className="line-clamp-2 font-semibold leading-snug tracking-tight text-balance group-hover:text-primary">
            {course.fullName}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span className="font-medium tabular-nums text-foreground">{course.progress}%</span>
          </div>
          <Progress value={course.progress} tone={tone} className="mt-2" />
        </CardContent>
      </Card>
    </Link>
  )
}
