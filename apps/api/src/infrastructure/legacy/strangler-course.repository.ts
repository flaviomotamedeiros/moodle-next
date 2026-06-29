import { Injectable } from '@nestjs/common'
import { type CourseRepository, type Course } from '@moodle-next/core'
import { MigrationFlagsService } from './migration-flags.service.js'
import { LegacyCourseRepository } from './repositories/legacy-course.repository.js'
import { InMemoryCourseRepository } from '../../modules/course/in-memory-course.repository.js'

/**
 * Strangler Fig repository for the Course context.
 *
 * Reads: legacy DB while MIGRATED_COURSE=false, new DB when true.
 * Writes: always go to the new DB (legacy is read-only).
 *
 * This is the coexistence layer described in Newman (2019).
 * Replace InMemoryCourseRepository with PrismaCourseRepository
 * when the new database schema is ready.
 */
@Injectable()
export class StranglerCourseRepository implements CourseRepository {
  constructor(
    private readonly flags: MigrationFlagsService,
    private readonly legacy: LegacyCourseRepository,
    private readonly next: InMemoryCourseRepository,
  ) {}

  async findById(id: string): Promise<Course | null> {
    if (this.flags.isMigrated('course')) return this.next.findById(id)
    // Try new DB first (newly created courses), fall back to legacy
    const fromNew = await this.next.findById(id)
    return fromNew ?? this.legacy.findById(id)
  }

  async findByShortName(shortName: string): Promise<Course | null> {
    if (this.flags.isMigrated('course')) return this.next.findByShortName(shortName)
    const fromNew = await this.next.findByShortName(shortName)
    return fromNew ?? this.legacy.findByShortName(shortName)
  }

  async findByCategory(categoryId: string): Promise<Course[]> {
    if (this.flags.isMigrated('course')) return this.next.findByCategory(categoryId)
    const [fromNew, fromLegacy] = await Promise.all([
      this.next.findByCategory(categoryId),
      this.legacy.findByCategory(categoryId),
    ])
    // Merge: new DB wins on ID conflicts
    const newIds = new Set(fromNew.map(c => c.id))
    return [...fromNew, ...fromLegacy.filter(c => !newIds.has(c.id))]
  }

  async save(course: Course): Promise<void> {
    return this.next.save(course)
  }

  async delete(id: string): Promise<void> {
    return this.next.delete(id)
  }
}
