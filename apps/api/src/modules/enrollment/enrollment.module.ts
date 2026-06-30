import { Module } from '@nestjs/common'
import { EnrollmentController } from './enrollment.controller.js'
import { ParticipantsController } from './participants.controller.js'
import { EnrollmentService } from './enrollment.service.js'
import { PrismaEnrollmentRepository } from '../../infrastructure/database/prisma-enrollment.repository.js'

@Module({
  controllers: [EnrollmentController, ParticipantsController],
  providers: [
    EnrollmentService,
    { provide: 'ENROLLMENT_REPOSITORY', useExisting: PrismaEnrollmentRepository },
  ],
  exports: [EnrollmentService, 'ENROLLMENT_REPOSITORY'],
})
export class EnrollmentModule {}
