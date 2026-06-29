import { Module } from '@nestjs/common'
import { GradingController } from './grading.controller.js'
import { GradingService } from './grading.service.js'
import { InMemoryGradeRepository } from './in-memory-grade.repository.js'

@Module({
  controllers: [GradingController],
  providers: [
    GradingService,
    { provide: 'GRADE_REPOSITORY', useClass: InMemoryGradeRepository },
  ],
  exports: [GradingService],
})
export class GradingModule {}
