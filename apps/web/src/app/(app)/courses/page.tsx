import { CourseCard } from '@/components/course/course-card'
import { COURSES } from '@/lib/mock-data'

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Meus cursos</h1>
        <p className="mt-1 text-muted-foreground">
          {COURSES.length} cursos · {COURSES.filter(c => c.progress === 100).length} concluídos
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
