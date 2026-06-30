import { Module } from '@nestjs/common'
import { GradingController } from './grading.controller.js'
import { GradingService } from './grading.service.js'
import { PrismaGradeRepository } from '../../infrastructure/database/prisma-grade.repository.js'
import { StranglerGradeRepository } from '../../infrastructure/legacy/strangler-grade.repository.js'

/** Stage 2 (coexist): reads merge new DB + legacy; writes go to the new DB. */
@Module({
  controllers: [GradingController],
  providers: [
    GradingService,
    PrismaGradeRepository,
    StranglerGradeRepository,
    { provide: 'GRADE_REPOSITORY', useExisting: StranglerGradeRepository },
  ],
  exports: [GradingService],
})
export class GradingModule {}
