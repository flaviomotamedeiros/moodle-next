import { Controller, Get, Post, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { CurrentUser } from '../../shared/current-user.decorator.js'
import type { JwtPayload } from '../auth/auth.service.js'
import { EnrollmentService } from '../enrollment/enrollment.service.js'
import { CourseService } from '../course/course.service.js'
import { presentCourse, presentEnrollment } from '../../shared/presenters.js'

/** Endpoints scoped to the authenticated user. */
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly enrollments: EnrollmentService,
    private readonly courses: CourseService,
  ) {}

  /** Courses the current user is enrolled in, with their role. */
  @Get('courses')
  async myCourses(@CurrentUser() user: JwtPayload) {
    const enrollments = await this.enrollments.findByUser(user.sub)

    const results = await Promise.all(
      enrollments
        .filter(e => e.isActive)
        .map(async e => {
          const course = await this.courses.findById(e.courseId).catch(() => null)
          if (!course) return null
          return { ...presentCourse(course), role: e.role }
        }),
    )

    return results.filter((c): c is NonNullable<typeof c> => c !== null)
  }

  /**
   * Self-enroll the current user into a course as a student.
   * Persisted in the new database.
   */
  @Post('courses/:courseId/enroll')
  @HttpCode(HttpStatus.CREATED)
  async enroll(@CurrentUser() user: JwtPayload, @Param('courseId') courseId: string) {
    const enrollment = await this.enrollments.enroll(courseId, {
      userId: user.sub,
      role: 'student',
    })
    return presentEnrollment(enrollment)
  }
}

