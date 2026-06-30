import { Injectable } from '@nestjs/common'
import { Enrollment, type EnrollmentRepository, type EnrollmentRole } from '@moodle-next/core'
import { PrismaService } from './prisma.service.js'

type Row = {
  id: string
  userId: string
  courseId: string
  role: string
  status: string
  enrolledAt: Date
  deletedAt: Date | null
}

/** Enrollment repository backed by the NEW system database (SQLite via Prisma). */
@Injectable()
export class PrismaEnrollmentRepository implements EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(row: Row): Enrollment {
    return Enrollment.reconstitute(row.id, {
      userId: row.userId,
      courseId: row.courseId,
      role: row.role as EnrollmentRole,
      status: row.status as 'active' | 'suspended',
      enrolledAt: row.enrolledAt,
      deletedAt: row.deletedAt ?? undefined,
    })
  }

  async findById(id: string): Promise<Enrollment | null> {
    const row = await this.prisma.enrollment.findUnique({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    const row = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
    return row ? this.toDomain(row) : null
  }

  async findByCourse(courseId: string, role?: EnrollmentRole): Promise<Enrollment[]> {
    const rows = await this.prisma.enrollment.findMany({
      where: { courseId, ...(role ? { role } : {}) },
    })
    return rows.map(r => this.toDomain(r))
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    const rows = await this.prisma.enrollment.findMany({ where: { userId } })
    return rows.map(r => this.toDomain(r))
  }

  async save(enrollment: Enrollment): Promise<void> {
    const data = {
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      role: enrollment.role,
      status: enrollment.status,
      enrolledAt: new Date(),
      deletedAt: enrollment.isDeleted ? new Date() : null,
    }
    await this.prisma.enrollment.upsert({
      where: { id: enrollment.id },
      create: { id: enrollment.id, ...data },
      update: { status: data.status, role: data.role, deletedAt: data.deletedAt },
    })
  }
}
