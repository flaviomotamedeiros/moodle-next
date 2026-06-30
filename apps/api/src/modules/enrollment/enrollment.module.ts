import { Module } from '@nestjs/common'
import { EnrollmentController } from './enrollment.controller.js'
import { EnrollmentService } from './enrollment.service.js'
import { LegacyEnrollmentRepository } from '../../infrastructure/legacy/repositories/legacy-enrollment.repository.js'

/** Stage 1 (read-only): reads 100% from the legacy database via the ACL. */
@Module({
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    { provide: 'ENROLLMENT_REPOSITORY', useExisting: LegacyEnrollmentRepository },
  ],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
