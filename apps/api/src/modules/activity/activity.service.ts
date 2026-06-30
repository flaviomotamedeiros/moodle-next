import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import {
  Activity,
  Submission,
  Completion,
  type ActivityRepository,
  type SubmissionRepository,
  type CompletionRepository,
} from '@moodle-next/core'
import { PluginRegistryService } from '../../infrastructure/plugin-registry/plugin-registry.service.js'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { DomainException } from '../../shared/filters/domain-exception.filter.js'
import type { CreateSubmissionDto } from './dto/create-submission.dto.js'

@Injectable()
export class ActivityService {
  constructor(
    @Inject('ACTIVITY_REPOSITORY') private readonly activities: ActivityRepository,
    @Inject('SUBMISSION_REPOSITORY') private readonly submissions: SubmissionRepository,
    @Inject('COMPLETION_REPOSITORY') private readonly completions: CompletionRepository,
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

  /** Current user's submission for an activity (or null). */
  async getSubmission(activityId: string, enrollmentId: string): Promise<Submission | null> {
    return this.submissions.findByActivityAndEnrollment(activityId, enrollmentId)
  }

  /**
   * Student submits (or edits) their response. The Submission is persisted in the
   * NEW database, decoupled from the legacy-authored Activity definition.
   */
  async submit(activityId: string, dto: CreateSubmissionDto): Promise<Submission> {
    const activity = await this.findById(activityId)

    const existing = await this.submissions.findByActivityAndEnrollment(activityId, dto.enrollmentId)
    const id = existing?.id ?? crypto.randomUUID()
    const attemptNumber = existing ? existing.attemptNumber + 1 : 1

    const submission = Submission.create(id, {
      activityId,
      enrollmentId: dto.enrollmentId,
      attemptNumber,
      content: dto.content,
    })

    const result = submission.submit()
    if (!result.ok) throw new DomainException(result.error, result.error)

    await this.submissions.save(submission)
    await this.eventBus.dispatch(submission.pullEvents())

    await this.evaluateCompletion(activity, dto.enrollmentId)
    return submission
  }

  /** Re-evaluates completion via the activity's plugin (if any). */
  private async evaluateCompletion(activity: Activity, enrollmentId: string): Promise<void> {
    const plugin = this.plugins.getActivity(activity.pluginId)
    if (!plugin) return

    const isComplete = await plugin.checkCompletion({ activityId: activity.id, enrollmentId })
    if (!isComplete) return

    const completion =
      (await this.completions.findByActivityAndEnrollment(activity.id, enrollmentId)) ??
      Completion.create(crypto.randomUUID(), { activityId: activity.id, enrollmentId })
    completion.markComplete()
    await this.completions.save(completion)
    await this.eventBus.dispatch(completion.pullEvents())
  }

  async getCompletionStatus(activityId: string, enrollmentId: string): Promise<boolean> {
    const completion = await this.completions.findByActivityAndEnrollment(activityId, enrollmentId)
    return completion?.isComplete ?? false
  }
}
