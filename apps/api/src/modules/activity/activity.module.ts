import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller.js'
import { ActivityService } from './activity.service.js'
import { InMemoryActivityRepository } from './in-memory-activity.repository.js'

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    { provide: 'ACTIVITY_REPOSITORY', useClass: InMemoryActivityRepository },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
