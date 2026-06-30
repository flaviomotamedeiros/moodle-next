import { Injectable } from '@nestjs/common'
import { Submission, type SubmissionRepository, type SubmissionStatus } from '@moodle-next/core'
import { PrismaService } from './prisma.service.js'

type Row = {
  id: string
  activityId: string
  enrollmentId: string
  attemptNumber: number
  status: string
  content: string
  submittedAt: Date | null
}

/** Submission repository backed by the NEW system database (SQLite via Prisma). */
@Injectable()
export class PrismaSubmissionRepository implements SubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(r: Row): Submission {
    return Submission.reconstitute(r.id, {
      activityId: r.activityId,
      enrollmentId: r.enrollmentId,
      attemptNumber: r.attemptNumber,
      status: r.status as SubmissionStatus,
      content: JSON.parse(r.content) as Record<string, unknown>,
      submittedAt: r.submittedAt ?? undefined,
    })
  }

  async findById(id: string): Promise<Submission | null> {
    const r = await this.prisma.submission.findUnique({ where: { id } })
    return r ? this.toDomain(r) : null
  }

  async findByActivityAndEnrollment(activityId: string, enrollmentId: string): Promise<Submission | null> {
    const r = await this.prisma.submission.findUnique({
      where: { activityId_enrollmentId: { activityId, enrollmentId } },
    })
    return r ? this.toDomain(r) : null
  }

  async findByActivity(activityId: string): Promise<Submission[]> {
    const rows = await this.prisma.submission.findMany({ where: { activityId } })
    return rows.map(r => this.toDomain(r))
  }

  async save(submission: Submission): Promise<void> {
    const data = {
      activityId: submission.activityId,
      enrollmentId: submission.enrollmentId,
      attemptNumber: submission.attemptNumber,
      status: submission.status,
      content: JSON.stringify(submission.content),
      submittedAt: submission.submittedAt ?? null,
    }
    await this.prisma.submission.upsert({
      where: { id: submission.id },
      create: { id: submission.id, ...data },
      update: { status: data.status, content: data.content, submittedAt: data.submittedAt },
    })
  }
}
