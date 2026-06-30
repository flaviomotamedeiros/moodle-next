import { AggregateRoot } from '../shared/aggregate-root.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
import { type Result } from '../shared/result.js';
import type { Section } from './section.js';
export declare class CourseCreated extends BaseDomainEvent {
    readonly courseId: string;
    readonly categoryId: string;
    constructor(courseId: string, categoryId: string);
}
export declare class CourseDeleted extends BaseDomainEvent {
    readonly courseId: string;
    constructor(courseId: string);
}
export declare class SectionReordered extends BaseDomainEvent {
    readonly courseId: string;
    readonly sectionId: string;
    readonly newOrder: number;
    constructor(courseId: string, sectionId: string, newOrder: number);
}
export interface CourseProps {
    fullName: string;
    shortName: string;
    categoryId: string;
    /** ISO 8601 date string */
    startDate?: string;
    endDate?: string;
    visible: boolean;
    sections: Section[];
}
export type CourseError = 'SHORT_NAME_REQUIRED' | 'FULL_NAME_REQUIRED' | 'INVALID_DATE_RANGE' | 'SECTION_NOT_FOUND';
export declare class Course extends AggregateRoot {
    private props;
    private constructor();
    static create(id: string, props: Omit<CourseProps, 'sections' | 'visible'>): Result<Course, CourseError>;
    static reconstitute(id: string, props: CourseProps): Course;
    get fullName(): string;
    get shortName(): string;
    get categoryId(): string;
    get visible(): boolean;
    get sections(): readonly Section[];
    reorderSection(sectionId: string, newOrder: number): Result<void, CourseError>;
    delete(): void;
}
//# sourceMappingURL=course.d.ts.map