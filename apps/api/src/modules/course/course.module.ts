import { Module } from '@nestjs/common'
import { CourseController } from './course.controller.js'
import { CourseService } from './course.service.js'
import { PrismaCourseRepository } from '../../infrastructure/database/prisma-course.repository.js'

export const COURSE_REPOSITORY = 'COURSE_REPOSITORY'

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    { provide: COURSE_REPOSITORY, useExisting: PrismaCourseRepository },
  ],
  exports: [CourseService],
})
export class CourseModule {}
