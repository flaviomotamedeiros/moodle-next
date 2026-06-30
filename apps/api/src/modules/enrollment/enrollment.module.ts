import { Module } from '@nestjs/common'
import { EnrollmentController } from './enrollment.controller.js'
import { EnrollmentService } from './enrollment.service.js'
import { PrismaEnrollmentRepository } from '../../infrastructure/database/prisma-enrollment.repository.js'
import { StranglerEnrollmentRepository } from '../../infrastructure/legacy/strangler-enrollment.repository.js'

/**
 * Stage 2 (coexist): the Enrollment module now uses the Strangler repository —
 * reads merge new DB + legacy, writes go to the new DB (Prisma/SQLite).
 */
@Module({
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    PrismaEnrollmentRepository,
    StranglerEnrollmentRepository,
    { provide: 'ENROLLMENT_REPOSITORY', useExisting: StranglerEnrollmentRepository },
  ],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
