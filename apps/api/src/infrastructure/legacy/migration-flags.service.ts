import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export type MigrationModule = 'course' | 'enrollment' | 'grading' | 'identity' | 'activity'

/**
 * Controls which modules read from the legacy ACL versus the new database.
 * Set via environment variables: MIGRATED_COURSE=true, MIGRATED_ENROLLMENT=true, etc.
 *
 * A module is eligible for legacy decommissioning when:
 *   (a) its flag is set to true, AND
 *   (b) all translated behavioral tests pass in the new system.
 */
@Injectable()
export class MigrationFlagsService {
  constructor(private readonly config: ConfigService) {}

  isMigrated(module: MigrationModule): boolean {
    return this.config.get(`MIGRATED_${module.toUpperCase()}`) === 'true'
  }

  status(): Record<MigrationModule, boolean> {
    const modules: MigrationModule[] = ['course', 'enrollment', 'grading', 'identity', 'activity']
    return Object.fromEntries(
      modules.map(m => [m, this.isMigrated(m)]),
    ) as Record<MigrationModule, boolean>
  }
}
