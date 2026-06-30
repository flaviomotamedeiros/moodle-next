import { Injectable } from '@nestjs/common'
import { type GradeRepository, type Grade } from '@moodle-next/core'
import { MigrationFlagsService } from './migration-flags.service.js'
import { LegacyGradeRepository } from './repositories/legacy-grade.repository.js'
import { PrismaGradeRepository } from '../database/prisma-grade.repository.js'

/**
 * Coexist-stage repository for Grading.
 * Reads merge new DB + legacy; writes go to the new DB. Legacy stays read-only.
 */
@Injectable()
export class StranglerGradeRepository implements GradeRepository {
  constructor(
    private readonly flags: MigrationFlagsService,
    private readonly legacy: LegacyGradeRepository,
    private readonly next: PrismaGradeRepository,
  ) {}

  async findById(id: string): Promise<Grade | null> {
    if (this.flags.isMigrated('grading')) return this.next.findById(id)
    return (await this.next.findById(id)) ?? this.legacy.findById(id)
  }

  async findByEnrollmentAndActivity(enrollmentId: string, activityId: string): Promise<Grade | null> {
    if (this.flags.isMigrated('grading')) return this.next.findByEnrollmentAndActivity(enrollmentId, activityId)
    const fromNew = await this.next.findByEnrollmentAndActivity(enrollmentId, activityId)
    return fromNew ?? this.legacy.findByEnrollmentAndActivity(enrollmentId, activityId)
  }

  async findByEnrollment(enrollmentId: string): Promise<Grade[]> {
    if (this.flags.isMigrated('grading')) return this.next.findByEnrollment(enrollmentId)
    const [fromNew, fromLegacy] = await Promise.all([
      this.next.findByEnrollment(enrollmentId),
      this.legacy.findByEnrollment(enrollmentId),
    ])
    const newKeys = new Set(fromNew.map(g => g.activityId))
    return [...fromNew, ...fromLegacy.filter(g => !newKeys.has(g.activityId))]
  }

  async findByCourse(courseId: string): Promise<Grade[]> {
    if (this.flags.isMigrated('grading')) return this.next.findByCourse(courseId)
    return this.legacy.findByCourse(courseId)
  }

  async save(grade: Grade): Promise<void> {
    return this.next.save(grade)
  }
}
