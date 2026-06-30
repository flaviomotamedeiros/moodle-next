import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller.js'
import { ActivityService } from './activity.service.js'
import { PrismaActivityRepository } from '../../infrastructure/database/prisma-activity.repository.js'
import { PrismaSubmissionRepository } from '../../infrastructure/database/prisma-submission.repository.js'
import { PrismaCompletionRepository } from '../../infrastructure/database/prisma-completion.repository.js'
import { StranglerActivityRepository } from '../../infrastructure/legacy/strangler-activity.repository.js'

/**
 * Stage 2 (coexist):
 * - Activity definitions: strangler (merge new DB + legacy).
 * - Submissions & Completions: owned by the new system (Prisma).
 */
@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    PrismaActivityRepository,
    PrismaSubmissionRepository,
    PrismaCompletionRepository,
    StranglerActivityRepository,
    { provide: 'ACTIVITY_REPOSITORY', useExisting: StranglerActivityRepository },
    { provide: 'SUBMISSION_REPOSITORY', useExisting: PrismaSubmissionRepository },
    { provide: 'COMPLETION_REPOSITORY', useExisting: PrismaCompletionRepository },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
