import { AggregateRoot } from '../shared/aggregate-root.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
import type { Submission } from './submission.js';
import type { Completion } from './completion.js';
export declare class ActivityCreated extends BaseDomainEvent {
    readonly activityId: string;
    readonly courseId: string;
    readonly pluginId: string;
    constructor(activityId: string, courseId: string, pluginId: string);
}
export interface ActivityProps {
    courseId: string;
    sectionId: string;
    /** Plugin that provides this activity, e.g. "mod_assign" */
    pluginId: string;
    name: string;
    visible: boolean;
    submissions: Submission[];
    completions: Completion[];
}
export type ActivityError = 'SUBMISSION_NOT_FOUND' | 'ALREADY_GRADING';
export declare class Activity extends AggregateRoot {
    private props;
    private constructor();
    static create(id: string, props: Omit<ActivityProps, 'submissions' | 'completions'>): Activity;
    static reconstitute(id: string, props: ActivityProps): Activity;
    get courseId(): string;
    get sectionId(): string;
    get pluginId(): string;
    get name(): string;
    get visible(): boolean;
    get submissions(): readonly Submission[];
    get completions(): readonly Completion[];
    addSubmission(submission: Submission): void;
    findSubmission(id: string): Submission | undefined;
    markComplete(completion: Completion): void;
    isCompletedBy(enrollmentId: string): boolean;
}
//# sourceMappingURL=activity.d.ts.map