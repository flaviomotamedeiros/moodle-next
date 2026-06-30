import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import {
  EnrollUserService,
  Enrollment,
  type EnrollmentRepository,
} from '@moodle-next/core'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { DomainException } from '../../shared/filters/domain-exception.filter.js'
import type { EnrollUserDto } from './dto/enroll-user.dto.js'

const DOMAIN_ERRORS: Record<string, string> = {
  ALREADY_ENROLLED: 'User is already enrolled in this course',
  USER_NOT_FOUND: 'User not found',
  COURSE_NOT_FOUND: 'Course not found',
}

@Injectable()
export class EnrollmentService {
  private readonly enrollUserService: EnrollUserService

  constructor(
    @Inject('ENROLLMENT_REPOSITORY') private readonly enrollments: EnrollmentRepository,
    private readonly eventBus: EventBusService,
  ) {
    this.enrollUserService = new EnrollUserService({
      enrollments,
      generateId: () => crypto.randomUUID(),
    })
  }

  async enroll(courseId: string, dto: EnrollUserDto): Promise<Enrollment> {
    const result = await this.enrollUserService.execute(dto.userId, courseId, dto.role)

    if (!result.ok) {
      throw new DomainException(result.error, DOMAIN_ERRORS[result.error] ?? result.error)
    }

    await this.eventBus.dispatch(result.value.pullEvents())
    return result.value
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollments.findByCourse(courseId)
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    return this.enrollments.findByUser(userId)
  }

  async suspend(enrollmentId: string): Promise<void> {
    const enrollment = await this.enrollments.findById(enrollmentId)
    if (!enrollment) throw new NotFoundException(`Enrollment ${enrollmentId} not found`)

    const result = enrollment.suspend()
    if (!result.ok) throw new DomainException(result.error, result.error)

    await this.enrollments.save(enrollment)
    await this.eventBus.dispatch(enrollment.pullEvents())
  }

  async unenroll(enrollmentId: string): Promise<void> {
    const enrollment = await this.enrollments.findById(enrollmentId)
    if (!enrollment) throw new NotFoundException(`Enrollment ${enrollmentId} not found`)

    const result = enrollment.delete()
    if (!result.ok) throw new DomainException(result.error, result.error)

    await this.enrollments.save(enrollment)
    await this.eventBus.dispatch(enrollment.pullEvents())
  }
}
