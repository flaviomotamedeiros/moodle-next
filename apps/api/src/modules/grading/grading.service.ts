import { Injectable, NotFoundException } from '@nestjs/common'
import { Grade, Gradebook, type GradeRepository } from '@moodle-next/core'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { DomainException } from '../../shared/filters/domain-exception.filter.js'
import type { AssignGradeDto, OverrideGradeDto } from './dto/assign-grade.dto.js'

const DOMAIN_ERRORS: Record<string, string> = {
  EXCEEDS_MAX: 'Grade value exceeds the maximum allowed',
  NEGATIVE_VALUE: 'Grade value cannot be negative',
}

@Injectable()
export class GradingService {
  constructor(
    private readonly grades: GradeRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async assign(activityId: string, dto: AssignGradeDto): Promise<Grade> {
    let grade = await this.grades.findByEnrollmentAndActivity(dto.enrollmentId, activityId)

    if (!grade) {
      grade = Grade.create(crypto.randomUUID(), {
        enrollmentId: dto.enrollmentId,
        activityId,
        value: null,
        maxValue: 100,
        gradingStrategyType: 'points',
      })
    }

    const result = grade.assign(dto.value, dto.feedback)
    if (!result.ok) {
      throw new DomainException(result.error, DOMAIN_ERRORS[result.error] ?? result.error)
    }

    await this.grades.save(grade)
    await this.eventBus.dispatch(grade.pullEvents())
    return grade
  }

  async override(gradeId: string, dto: OverrideGradeDto): Promise<Grade> {
    const grade = await this.grades.findById(gradeId)
    if (!grade) throw new NotFoundException(`Grade ${gradeId} not found`)

    const result = grade.override(dto.value, dto.reason)
    if (!result.ok) {
      throw new DomainException(result.error, DOMAIN_ERRORS[result.error] ?? result.error)
    }

    await this.grades.save(grade)
    await this.eventBus.dispatch(grade.pullEvents())
    return grade
  }

  async getGradebook(courseId: string, enrollmentId: string): Promise<{ finalGrade: number | null; grades: Grade[] }> {
    const grades = await this.grades.findByEnrollment(enrollmentId)

    const gradebook = new Gradebook(crypto.randomUUID(), {
      courseId,
      aggregationMethod: 'mean',
      grades,
    })

    return {
      finalGrade: gradebook.calculateFinalGrade(enrollmentId),
      grades,
    }
  }
}
