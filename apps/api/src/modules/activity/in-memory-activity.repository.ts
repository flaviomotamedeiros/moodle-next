import { Injectable } from '@nestjs/common'
import { Activity, type ActivityRepository } from '@moodle-next/core'

@Injectable()
export class InMemoryActivityRepository implements ActivityRepository {
  private readonly store = new Map<string, Activity>()

  async findById(id: string) { return this.store.get(id) ?? null }
  async findByCourse(courseId: string) {
    return [...this.store.values()].filter(a => a.courseId === courseId)
  }
  async save(activity: Activity) { this.store.set(activity.id, activity) }
}
