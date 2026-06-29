import { Module } from '@nestjs/common'
import { CourseController } from './course.controller.js'
import { CourseService } from './course.service.js'
import { InMemoryCourseRepository } from './in-memory-course.repository.js'
import { type CourseRepository } from '@moodle-next/core'

/** Token used for DI — decouples the service from the concrete repository. */
export const COURSE_REPOSITORY = 'COURSE_REPOSITORY'

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: COURSE_REPOSITORY,
      useClass: InMemoryCourseRepository,
    },
  ],
  exports: [CourseService],
})
export class CourseModule {}
