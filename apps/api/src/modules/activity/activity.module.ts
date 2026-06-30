import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller.js'
import { ActivityService } from './activity.service.js'
import { PrismaActivityRepository } from '../../infrastructure/database/prisma-activity.repository.js'
import { StranglerActivityRepository } from '../../infrastructure/legacy/strangler-activity.repository.js'

/** Stage 2 (coexist): reads merge new DB + legacy; writes go to the new DB. */
@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    PrismaActivityRepository,
    StranglerActivityRepository,
    { provide: 'ACTIVITY_REPOSITORY', useExisting: StranglerActivityRepository },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
