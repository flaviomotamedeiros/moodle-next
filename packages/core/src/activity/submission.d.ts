import { Entity } from '../shared/entity.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
import { type Result } from '../shared/result.js';
export declare class SubmissionCreated extends BaseDomainEvent {
    readonly submissionId: string;
    readonly activityId: string;
    readonly enrollmentId: string;
    constructor(submissionId: string, activityId: string, enrollmentId: string);
}
export type SubmissionStatus = 'draft' | 'submitted' | 'grading' | 'graded';
export interface SubmissionProps {
    activityId: string;
    enrollmentId: string;
    attemptNumber: number;
    status: SubmissionStatus;
    content: Record<string, unknown>;
    submittedAt?: Date;
}
export type SubmissionError = 'ALREADY_SUBMITTED' | 'ALREADY_BEING_GRADED';
export declare class Submission extends Entity {
    private props;
    private constructor();
    static create(id: string, props: Omit<SubmissionProps, 'status' | 'submittedAt'>): Submission;
    static reconstitute(id: string, props: SubmissionProps): Submission;
    get enrollmentId(): string;
    get activityId(): string;
    get attemptNumber(): number;
    get status(): SubmissionStatus;
    get content(): Record<string, unknown>;
    get submittedAt(): Date | undefined;
    submit(): Result<void, SubmissionError>;
    /** Immutable once grading begins — enforced by this rule. */
    startGrading(): Result<void, SubmissionError>;
    markGraded(): void;
}
//# sourceMappingURL=submission.d.ts.map