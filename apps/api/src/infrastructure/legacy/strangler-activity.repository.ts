import { Injectable } from '@nestjs/common'
import { type ActivityRepository, type Activity } from '@moodle-next/core'
import { MigrationFlagsService } from './migration-flags.service.js'
import { LegacyActivityRepository } from './repositories/legacy-activity.repository.js'
import { PrismaActivityRepository } from '../database/prisma-activity.repository.js'

/**
 * Coexist-stage repository for Activity definitions.
 * Reads merge new DB + legacy; writes go to the new DB. Legacy stays read-only.
 * (Activity definitions are still authored in the legacy system in practice,
 * so the new side starts empty and reads fall through to legacy.)
 */
@Injectable()
export class StranglerActivityRepository implements ActivityRepository {
  constructor(
    private readonly flags: MigrationFlagsService,
    private readonly legacy: LegacyActivityRepository,
    private readonly next: PrismaActivityRepository,
  ) {}

  async findById(id: string): Promise<Activity | null> {
    if (this.flags.isMigrated('activity')) return this.next.findById(id)
    return (await this.next.findById(id)) ?? this.legacy.findById(id)
  }

  async findByCourse(courseId: string): Promise<Activity[]> {
    if (this.flags.isMigrated('activity')) return this.next.findByCourse(courseId)
    const [fromNew, fromLegacy] = await Promise.all([
      this.next.findByCourse(courseId),
      this.legacy.findByCourse(courseId),
    ])
    const newIds = new Set(fromNew.map(a => a.id))
    return [...fromNew, ...fromLegacy.filter(a => !newIds.has(a.id))]
  }

  async save(activity: Activity): Promise<void> {
    return this.next.save(activity)
  }
}
