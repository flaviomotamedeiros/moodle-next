import { Module } from '@nestjs/common'
import { GradingController } from './grading.controller.js'
import { GradingService } from './grading.service.js'
import { PrismaGradeRepository } from '../../infrastructure/database/prisma-grade.repository.js'

@Module({
  controllers: [GradingController],
  providers: [
    GradingService,
    { provide: 'GRADE_REPOSITORY', useExisting: PrismaGradeRepository },
  ],
  exports: [GradingService],
})
export class GradingModule {}
