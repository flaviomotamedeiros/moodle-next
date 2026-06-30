import { Entity } from '../shared/entity.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
export declare class CompletionAchieved extends BaseDomainEvent {
    readonly activityId: string;
    readonly enrollmentId: string;
    constructor(activityId: string, enrollmentId: string);
}
export interface CompletionProps {
    activityId: string;
    enrollmentId: string;
    completedAt?: Date;
    /** Which criteria were satisfied, keyed by criterion key */
    satisfiedCriteria: string[];
}
export declare class Completion extends Entity {
    private props;
    private constructor();
    static create(id: string, props: Omit<CompletionProps, 'completedAt' | 'satisfiedCriteria'>): Completion;
    static reconstitute(id: string, props: CompletionProps): Completion;
    get enrollmentId(): string;
    get activityId(): string;
    get completedAt(): Date | undefined;
    get isComplete(): boolean;
    satisfy(criterionKey: string): void;
    markComplete(): void;
}
//# sourceMappingURL=completion.d.ts.map