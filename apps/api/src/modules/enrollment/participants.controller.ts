import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { EnrollmentService } from './enrollment.service.js'
import { LegacyUserRepository } from '../../infrastructure/legacy/repositories/legacy-user.repository.js'

/** Course participants with their display names — for the teacher grading screen. */
@Controller('courses/:courseId/participants')
@UseGuards(JwtAuthGuard)
export class ParticipantsController {
  constructor(
    private readonly enrollments: EnrollmentService,
    private readonly users: LegacyUserRepository,
  ) {}

  @Get()
  async list(@Param('courseId') courseId: string) {
    const enrollments = await this.enrollments.findByCourse(courseId)
    const students = enrollments.filter(e => e.role === 'student' && e.isActive)

    return Promise.all(
      students.map(async e => {
        const user = await this.users.findById(e.userId).catch(() => null)
        return {
          userId: e.userId,
          name: user?.fullName ?? `Usuário ${e.userId}`,
          /** The enrollment reference used by grades and submissions. */
          enrollmentRef: `legacy-user-${e.userId}`,
        }
      }),
    )
  }
}
