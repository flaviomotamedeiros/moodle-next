import { AggregateRoot } from '../shared/aggregate-root.js'
import { BaseDomainEvent } from '../shared/domain-event.js'
import { fail, ok, type Result } from '../shared/result.js'
import type { Submission } from './submission.js'
import type { Completion } from './completion.js'

export class ActivityCreated extends BaseDomainEvent {
  constructor(readonly activityId: string, readonly courseId: string, readonly pluginId: string) {
    super('activity.created', activityId)
  }
}

export interface ActivityProps {
  courseId: string
  sectionId: string
  /** Plugin that provides this activity, e.g. "mod_assign" */
  pluginId: string
  name: string
  visible: boolean
  submissions: Submission[]
  completions: Completion[]
}

export type ActivityError = 'SUBMISSION_NOT_FOUND' | 'ALREADY_GRADING'

export class Activity extends AggregateRoot {
  private constructor(
    id: string,
    private props: ActivityProps,
  ) {
    super(id)
  }

  static create(id: string, props: Omit<ActivityProps, 'submissions' | 'completions'>): Activity {
    const activity = new Activity(id, { ...props, submissions: [], completions: [] })
    activity.emit(new ActivityCreated(id, props.courseId, props.pluginId))
    return activity
  }

  static reconstitute(id: string, props: ActivityProps): Activity {
    return new Activity(id, props)
  }

  get courseId(): string { return this.props.courseId }
  get sectionId(): string { return this.props.sectionId }
  get pluginId(): string { return this.props.pluginId }
  get name(): string { return this.props.name }
  get visible(): boolean { return this.props.visible }
  get submissions(): readonly Submission[] { return this.props.submissions }
  get completions(): readonly Completion[] { return this.props.completions }

  addSubmission(submission: Submission): void {
    this.props.submissions.push(submission)
  }

  findSubmission(id: string): Submission | undefined {
    return this.props.submissions.find(s => s.id === id)
  }

  markComplete(completion: Completion): void {
    const existing = this.props.completions.findIndex(c => c.enrollmentId === completion.enrollmentId)
    if (existing >= 0) {
      this.props.completions[existing] = completion
    } else {
      this.props.completions.push(completion)
    }
  }

  isCompletedBy(enrollmentId: string): boolean {
    return this.props.completions.some(c => c.enrollmentId === enrollmentId && c.completedAt != null)
  }
}
