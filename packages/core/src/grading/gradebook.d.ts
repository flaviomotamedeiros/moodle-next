import { Entity } from '../shared/entity.js';
import type { Grade } from './grade.js';
export type AggregationMethod = 'mean' | 'weighted_mean' | 'highest' | 'lowest' | 'natural';
export interface GradebookProps {
    courseId: string;
    aggregationMethod: AggregationMethod;
    grades: Grade[];
}
export declare class Gradebook extends Entity {
    private props;
    constructor(id: string, props: GradebookProps);
    get courseId(): string;
    get aggregationMethod(): AggregationMethod;
    get grades(): readonly Grade[];
    gradesFor(enrollmentId: string): Grade[];
    /**
     * Calculates the final grade for an enrollment using the configured method.
     * Returns null if no grades have been assigned yet.
     */
    calculateFinalGrade(enrollmentId: string): number | null;
}
//# sourceMappingURL=gradebook.d.ts.map