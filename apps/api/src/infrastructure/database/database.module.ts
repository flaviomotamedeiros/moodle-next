import { Module, Global } from '@nestjs/common'
import { PrismaService } from './prisma.service.js'
import { PrismaUserRepository } from './prisma-user.repository.js'
import { PrismaCourseRepository } from './prisma-course.repository.js'
import { PrismaEnrollmentRepository } from './prisma-enrollment.repository.js'
import { PrismaGradeRepository } from './prisma-grade.repository.js'
import { PrismaActivityRepository } from './prisma-activity.repository.js'
import { PrismaSubmissionRepository } from './prisma-submission.repository.js'
import { PrismaCompletionRepository } from './prisma-completion.repository.js'

const repositories = [
  PrismaUserRepository,
  PrismaCourseRepository,
  PrismaEnrollmentRepository,
  PrismaGradeRepository,
  PrismaActivityRepository,
  PrismaSubmissionRepository,
  PrismaCompletionRepository,
]

/**
 * The single source of persistence — the new database (Prisma).
 * The legacy ACL has been removed after the Stage 3 migration.
 */
@Global()
@Module({
  providers: [
    PrismaService,
    ...repositories,
    { provide: 'USER_REPOSITORY', useExisting: PrismaUserRepository },
  ],
  exports: [
    PrismaService,
    ...repositories,
    'USER_REPOSITORY',
  ],
})
export class DatabaseModule {}
