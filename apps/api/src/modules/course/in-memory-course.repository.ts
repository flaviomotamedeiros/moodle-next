import { Injectable } from '@nestjs/common'
import { Course, type CourseRepository } from '@moodle-next/core'

/**
 * In-memory repository for development and testing.
 * Replace with PrismaCoursesRepository when the database schema is ready.
 */
@Injectable()
export class InMemoryCourseRepository implements CourseRepository {
  private readonly store = new Map<string, Course>()

  async findById(id: string) {
    return this.store.get(id) ?? null
  }

  async findByShortName(shortName: string) {
    return [...this.store.values()].find(c => c.shortName === shortName) ?? null
  }

  async findByCategory(categoryId: string) {
    return [...this.store.values()].filter(c => c.categoryId === categoryId)
  }

  async save(course: Course) {
    this.store.set(course.id, course)
  }

  async delete(id: string) {
    this.store.delete(id)
  }
}
