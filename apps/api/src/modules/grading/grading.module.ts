import { Module } from '@nestjs/common'
import { GradingController } from './grading.controller.js'
import { GradingService } from './grading.service.js'
import { LegacyGradeRepository } from '../../infrastructure/legacy/repositories/legacy-grade.repository.js'

/** Stage 1 (read-only): reads 100% from the legacy database via the ACL. */
@Module({
  controllers: [GradingController],
  providers: [
    GradingService,
    { provide: 'GRADE_REPOSITORY', useExisting: LegacyGradeRepository },
  ],
  exports: [GradingService],
})
export class GradingModule {}
