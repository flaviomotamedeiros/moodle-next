import { Injectable } from '@nestjs/common'
import { Completion, type CompletionRepository } from '@moodle-next/core'
import { PrismaService } from './prisma.service.js'

type Row = { id: string; activityId: string; enrollmentId: string; completedAt: Date | null }

/** Completion repository backed by the NEW system database (SQLite via Prisma). */
@Injectable()
export class PrismaCompletionRepository implements CompletionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(r: Row): Completion {
    const c = Completion.reconstitute(r.id, {
      activityId: r.activityId,
      enrollmentId: r.enrollmentId,
      completedAt: r.completedAt ?? undefined,
      satisfiedCriteria: [],
    })
    return c
  }

  async findByActivityAndEnrollment(activityId: string, enrollmentId: string): Promise<Completion | null> {
    const r = await this.prisma.completion.findUnique({
      where: { activityId_enrollmentId: { activityId, enrollmentId } },
    })
    return r ? this.toDomain(r) : null
  }

  async save(completion: Completion): Promise<void> {
    const data = {
      activityId: completion.activityId,
      enrollmentId: completion.enrollmentId,
      completedAt: completion.completedAt ?? null,
    }
    await this.prisma.completion.upsert({
      where: { id: completion.id },
      create: { id: completion.id, ...data },
      update: { completedAt: data.completedAt },
    })
  }
}
