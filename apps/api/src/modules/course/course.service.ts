import { Injectable, NotFoundException } from '@nestjs/common'
import { Course, type CourseRepository } from '@moodle-next/core'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { DomainException } from '../../shared/filters/domain-exception.filter.js'
import type { CreateCourseDto } from './dto/create-course.dto.js'

const DOMAIN_ERRORS: Record<string, string> = {
  FULL_NAME_REQUIRED: 'Course full name is required',
  SHORT_NAME_REQUIRED: 'Course short name is required',
  INVALID_DATE_RANGE: 'End date must be after start date',
}

@Injectable()
export class CourseService {
  constructor(
    private readonly courses: CourseRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    const result = Course.create(crypto.randomUUID(), dto)

    if (!result.ok) {
      throw new DomainException(result.error, DOMAIN_ERRORS[result.error] ?? result.error)
    }

    await this.courses.save(result.value)
    await this.eventBus.dispatch(result.value.pullEvents())
    return result.value
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courses.findById(id)
    if (!course) throw new NotFoundException(`Course ${id} not found`)
    return course
  }

  async findByCategory(categoryId: string): Promise<Course[]> {
    return this.courses.findByCategory(categoryId)
  }

  async delete(id: string): Promise<void> {
    const course = await this.findById(id)
    course.delete()
    await this.courses.delete(id)
    await this.eventBus.dispatch(course.pullEvents())
  }
}
