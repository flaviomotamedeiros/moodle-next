import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller.js'
import { ActivityService } from './activity.service.js'
import { PrismaActivityRepository } from '../../infrastructure/database/prisma-activity.repository.js'
import { PrismaSubmissionRepository } from '../../infrastructure/database/prisma-submission.repository.js'
import { PrismaCompletionRepository } from '../../infrastructure/database/prisma-completion.repository.js'

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    { provide: 'ACTIVITY_REPOSITORY', useExisting: PrismaActivityRepository },
    { provide: 'SUBMISSION_REPOSITORY', useExisting: PrismaSubmissionRepository },
    { provide: 'COMPLETION_REPOSITORY', useExisting: PrismaCompletionRepository },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
