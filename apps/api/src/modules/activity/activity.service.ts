import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import {
  Activity,
  Submission,
  Completion,
  type ActivityRepository,
} from '@moodle-next/core'
import { PluginRegistryService } from '../../infrastructure/plugin-registry/plugin-registry.service.js'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { DomainException } from '../../shared/filters/domain-exception.filter.js'
import type { CreateSubmissionDto } from './dto/create-submission.dto.js'

@Injectable()
export class ActivityService {
  constructor(
    @Inject('ACTIVITY_REPOSITORY') private readonly activities: ActivityRepository,
    private readonly plugins: PluginRegistryService,
    private readonly eventBus: EventBusService,
  ) {}

  async findById(id: string): Promise<Activity> {
    const activity = await this.activities.findById(id)
    if (!activity) throw new NotFoundException(`Activity ${id} not found`)
    return activity
  }

  async findByCourse(courseId: string): Promise<Activity[]> {
    return this.activities.findByCourse(courseId)
  }

  async submit(activityId: string, dto: CreateSubmissionDto): Promise<Submission> {
    const activity = await this.findById(activityId)

    const submission = Submission.create(crypto.randomUUID(), {
      activityId,
      enrollmentId: dto.enrollmentId,
      attemptNumber: activity.submissions.filter(
        s => s.enrollmentId === dto.enrollmentId,
      ).length + 1,
      content: dto.content,
    })

    const submitResult = submission.submit()
    if (!submitResult.ok) {
      throw new DomainException(submitResult.error, submitResult.error)
    }

    activity.addSubmission(submission)
    await this.activities.save(activity)
    await this.checkCompletion(activity, dto.enrollmentId)

    return submission
  }

  private async checkCompletion(activity: Activity, enrollmentId: string): Promise<void> {
    const plugin = this.plugins.getActivity(activity.pluginId)
    if (!plugin) return

    const isComplete = await plugin.checkCompletion({
      activityId: activity.id,
      enrollmentId,
    })

    if (isComplete) {
      const completion = Completion.create(crypto.randomUUID(), {
        activityId: activity.id,
        enrollmentId,
      })
      completion.markComplete()
      activity.markComplete(completion)
      await this.activities.save(activity)

      await this.eventBus.dispatch(activity.pullEvents())
    }
  }

  async getCompletionStatus(activityId: string, enrollmentId: string): Promise<boolean> {
    const activity = await this.findById(activityId)
    return activity.isCompletedBy(enrollmentId)
  }
}
