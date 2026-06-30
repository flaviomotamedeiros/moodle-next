import { Module, Global } from '@nestjs/common'
import { LegacyDbService } from './legacy-db.service.js'
import { MigrationFlagsService } from './migration-flags.service.js'
import { LegacyUserRepository } from './repositories/legacy-user.repository.js'
import { LegacyCourseRepository } from './repositories/legacy-course.repository.js'
import { LegacyEnrollmentRepository } from './repositories/legacy-enrollment.repository.js'
import { LegacyGradeRepository } from './repositories/legacy-grade.repository.js'
import { LegacyActivityRepository } from './repositories/legacy-activity.repository.js'

@Global()
@Module({
  providers: [
    LegacyDbService,
    MigrationFlagsService,
    LegacyUserRepository,
    LegacyCourseRepository,
    LegacyEnrollmentRepository,
    LegacyGradeRepository,
    LegacyActivityRepository,
  ],
  exports: [
    LegacyDbService,
    MigrationFlagsService,
    LegacyUserRepository,
    LegacyCourseRepository,
    LegacyEnrollmentRepository,
    LegacyGradeRepository,
    LegacyActivityRepository,
  ],
})
export class LegacyModule {}
