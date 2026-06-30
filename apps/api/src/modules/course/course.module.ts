import { Module } from '@nestjs/common'
import { CourseController } from './course.controller.js'
import { CourseService } from './course.service.js'
import { LegacyCourseRepository } from '../../infrastructure/legacy/repositories/legacy-course.repository.js'

/** Token used for DI — decouples the service from the concrete repository. */
export const COURSE_REPOSITORY = 'COURSE_REPOSITORY'

/**
 * Stage 1 (read-only): the Course module reads 100% from the legacy Moodle
 * database via the Anticorruption Layer. Writes throw (legacy is read-only).
 * To advance to Stage 2 (coexist), swap useExisting for the StranglerCourseRepository.
 */
@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    { provide: COURSE_REPOSITORY, useExisting: LegacyCourseRepository },
  ],
  exports: [CourseService],
})
export class CourseModule {}
