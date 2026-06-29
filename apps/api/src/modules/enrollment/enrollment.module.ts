import { Module } from '@nestjs/common'
import { EnrollmentController } from './enrollment.controller.js'
import { EnrollmentService } from './enrollment.service.js'
import { InMemoryEnrollmentRepository } from './in-memory-enrollment.repository.js'

@Module({
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    { provide: 'ENROLLMENT_REPOSITORY', useClass: InMemoryEnrollmentRepository },
  ],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
