import { Injectable } from '@nestjs/common'
import { type EnrollmentRepository, Enrollment, type EnrollmentRole } from '@moodle-next/core'
import { MigrationFlagsService } from './migration-flags.service.js'
import { LegacyEnrollmentRepository } from './repositories/legacy-enrollment.repository.js'
import { InMemoryEnrollmentRepository } from '../../modules/enrollment/in-memory-enrollment.repository.js'

@Injectable()
export class StranglerEnrollmentRepository implements EnrollmentRepository {
  constructor(
    private readonly flags: MigrationFlagsService,
    private readonly legacy: LegacyEnrollmentRepository,
    private readonly next: InMemoryEnrollmentRepository,
  ) {}

  async findById(id: string): Promise<Enrollment | null> {
    if (this.flags.isMigrated('enrollment')) return this.next.findById(id)
    const fromNew = await this.next.findById(id)
    return fromNew ?? this.legacy.findById(id)
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    if (this.flags.isMigrated('enrollment')) return this.next.findByUserAndCourse(userId, courseId)
    const fromNew = await this.next.findByUserAndCourse(userId, courseId)
    return fromNew ?? this.legacy.findByUserAndCourse(userId, courseId)
  }

  async findByCourse(courseId: string, role?: EnrollmentRole): Promise<Enrollment[]> {
    if (this.flags.isMigrated('enrollment')) return this.next.findByCourse(courseId, role)
    const [fromNew, fromLegacy] = await Promise.all([
      this.next.findByCourse(courseId, role),
      this.legacy.findByCourse(courseId, role),
    ])
    const newIds = new Set(fromNew.map(e => e.id))
    return [...fromNew, ...fromLegacy.filter(e => !newIds.has(e.id))]
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    if (this.flags.isMigrated('enrollment')) return this.next.findByUser(userId)
    const [fromNew, fromLegacy] = await Promise.all([
      this.next.findByUser(userId),
      this.legacy.findByUser(userId),
    ])
    const newIds = new Set(fromNew.map(e => e.id))
    return [...fromNew, ...fromLegacy.filter(e => !newIds.has(e.id))]
  }

  async save(enrollment: Enrollment): Promise<void> {
    return this.next.save(enrollment)
  }
}
