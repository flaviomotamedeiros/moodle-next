import { Injectable } from '@nestjs/common'
import { Grade, type GradeRepository } from '@moodle-next/core'
import { PrismaService } from './prisma.service.js'

type Row = {
  id: string
  enrollmentId: string
  activityId: string
  value: number | null
  maxValue: number
  feedback: string | null
  gradingStrategyType: string
}

/** Grade repository backed by the NEW system database (SQLite via Prisma). */
@Injectable()
export class PrismaGradeRepository implements GradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(r: Row): Grade {
    return Grade.reconstitute(r.id, {
      enrollmentId: r.enrollmentId,
      activityId: r.activityId,
      value: r.value,
      maxValue: r.maxValue,
      feedback: r.feedback ?? undefined,
      gradingStrategyType: r.gradingStrategyType,
    })
  }

  async findById(id: string): Promise<Grade | null> {
    const r = await this.prisma.grade.findUnique({ where: { id } })
    return r ? this.toDomain(r) : null
  }

  async findByEnrollmentAndActivity(enrollmentId: string, activityId: string): Promise<Grade | null> {
    const r = await this.prisma.grade.findUnique({
      where: { enrollmentId_activityId: { enrollmentId, activityId } },
    })
    return r ? this.toDomain(r) : null
  }

  async findByEnrollment(enrollmentId: string): Promise<Grade[]> {
    const rows = await this.prisma.grade.findMany({ where: { enrollmentId } })
    return rows.map(r => this.toDomain(r))
  }

  async findByCourse(_courseId: string): Promise<Grade[]> {
    // Course→grade index not modeled in the new DB yet; legacy provides this.
    return []
  }

  async save(grade: Grade): Promise<void> {
    const data = {
      enrollmentId: grade.enrollmentId,
      activityId: grade.activityId,
      value: grade.value,
      maxValue: grade.maxValue,
      feedback: grade.feedback ?? null,
      gradingStrategyType: 'points',
    }
    await this.prisma.grade.upsert({
      where: { id: grade.id },
      create: { id: grade.id, ...data },
      update: { value: data.value, feedback: data.feedback },
    })
  }
}
