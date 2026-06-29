import { Injectable } from '@nestjs/common'
import { Grade, type GradeRepository } from '@moodle-next/core'

@Injectable()
export class InMemoryGradeRepository implements GradeRepository {
  private readonly store = new Map<string, Grade>()

  async findById(id: string) { return this.store.get(id) ?? null }

  async findByEnrollmentAndActivity(enrollmentId: string, activityId: string) {
    return [...this.store.values()].find(
      g => g.enrollmentId === enrollmentId && g.activityId === activityId,
    ) ?? null
  }

  async findByEnrollment(enrollmentId: string) {
    return [...this.store.values()].filter(g => g.enrollmentId === enrollmentId)
  }

  async findByCourse(courseId: string) {
    // Without a course→activity index this is a stub — replace with Prisma query
    return []
  }

  async save(grade: Grade) { this.store.set(grade.id, grade) }
}
