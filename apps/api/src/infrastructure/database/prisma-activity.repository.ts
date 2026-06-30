import { Injectable } from '@nestjs/common'
import { Activity, type ActivityRepository } from '@moodle-next/core'
import { PrismaService } from './prisma.service.js'

type Row = {
  id: string
  courseId: string
  sectionId: string
  pluginId: string
  name: string
  visible: boolean
}

/** Activity repository backed by the NEW system database (SQLite via Prisma). */
@Injectable()
export class PrismaActivityRepository implements ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(r: Row): Activity {
    return Activity.reconstitute(r.id, {
      courseId: r.courseId,
      sectionId: r.sectionId,
      pluginId: r.pluginId,
      name: r.name,
      visible: r.visible,
    })
  }

  async findById(id: string): Promise<Activity | null> {
    const r = await this.prisma.activity.findUnique({ where: { id } })
    return r ? this.toDomain(r) : null
  }

  async findByCourse(courseId: string): Promise<Activity[]> {
    const rows = await this.prisma.activity.findMany({ where: { courseId } })
    return rows.map(r => this.toDomain(r))
  }

  async save(activity: Activity): Promise<void> {
    const data = {
      courseId: activity.courseId,
      sectionId: activity.sectionId,
      pluginId: activity.pluginId,
      name: activity.name,
      visible: activity.visible,
    }
    await this.prisma.activity.upsert({
      where: { id: activity.id },
      create: { id: activity.id, ...data },
      update: data,
    })
  }
}
