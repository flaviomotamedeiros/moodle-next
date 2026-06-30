import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller.js'
import { ActivityService } from './activity.service.js'
import { LegacyActivityRepository } from '../../infrastructure/legacy/repositories/legacy-activity.repository.js'

/** Stage 1 (read-only): reads 100% from the legacy database via the ACL. */
@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    { provide: 'ACTIVITY_REPOSITORY', useExisting: LegacyActivityRepository },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
