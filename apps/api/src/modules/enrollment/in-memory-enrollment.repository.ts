import { Injectable } from '@nestjs/common'
import { Enrollment, type EnrollmentRepository, type EnrollmentRole } from '@moodle-next/core'

@Injectable()
export class InMemoryEnrollmentRepository implements EnrollmentRepository {
  private readonly store = new Map<string, Enrollment>()

  async findById(id: string) {
    return this.store.get(id) ?? null
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    return [...this.store.values()].find(
      e => e.userId === userId && e.courseId === courseId,
    ) ?? null
  }

  async findByCourse(courseId: string, role?: EnrollmentRole) {
    return [...this.store.values()].filter(
      e => e.courseId === courseId && (!role || e.role === role),
    )
  }

  async findByUser(userId: string) {
    return [...this.store.values()].filter(e => e.userId === userId)
  }

  async save(enrollment: Enrollment) {
    this.store.set(enrollment.id, enrollment)
  }
}
