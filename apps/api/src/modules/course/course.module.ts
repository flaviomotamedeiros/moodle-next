import { Module } from '@nestjs/common'
import { CourseController } from './course.controller.js'
import { CourseService } from './course.service.js'
import { PrismaCourseRepository } from '../../infrastructure/database/prisma-course.repository.js'
import { StranglerCourseRepository } from '../../infrastructure/legacy/strangler-course.repository.js'

export const COURSE_REPOSITORY = 'COURSE_REPOSITORY'

/** Stage 2 (coexist): reads merge new DB + legacy; writes go to the new DB. */
@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    PrismaCourseRepository,
    StranglerCourseRepository,
    { provide: COURSE_REPOSITORY, useExisting: StranglerCourseRepository },
  ],
  exports: [CourseService],
})
export class CourseModule {}
