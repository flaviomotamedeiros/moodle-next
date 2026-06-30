import { AggregateRoot } from '../shared/aggregate-root.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
import { type Result } from '../shared/result.js';
export declare class GradeCreated extends BaseDomainEvent {
    readonly gradeId: string;
    readonly enrollmentId: string;
    readonly activityId: string;
    constructor(gradeId: string, enrollmentId: string, activityId: string);
}
export declare class GradeUpdated extends BaseDomainEvent {
    readonly gradeId: string;
    readonly value: number;
    constructor(gradeId: string, value: number);
}
export declare class GradeOverridden extends BaseDomainEvent {
    readonly gradeId: string;
    readonly previousValue: number | null;
    readonly overriddenValue: number;
    readonly reason: string;
    constructor(gradeId: string, previousValue: number | null, overriddenValue: number, reason: string);
}
export interface GradeProps {
    enrollmentId: string;
    activityId: string;
    /** Raw score — null until graded. */
    value: number | null;
    maxValue: number;
    feedback?: string;
    /** GradingStrategy type used at the time of grading, stored for audit. */
    gradingStrategyType: string;
    gradedAt?: Date;
    /** Manual override is allowed but logged. */
    overriddenAt?: Date;
    overrideReason?: string;
}
export type GradeError = 'EXCEEDS_MAX' | 'NEGATIVE_VALUE';
export declare class Grade extends AggregateRoot {
    private props;
    private constructor();
    static create(id: string, props: GradeProps): Grade;
    static reconstitute(id: string, props: GradeProps): Grade;
    get enrollmentId(): string;
    get activityId(): string;
    get value(): number | null;
    get maxValue(): number;
    get feedback(): string | undefined;
    get percentage(): number | null;
    assign(value: number, feedback?: string): Result<void, GradeError>;
    /** Manual override is allowed but must be logged per domain rule. */
    override(value: number, reason: string): Result<void, GradeError>;
}
//# sourceMappingURL=grade.d.ts.map