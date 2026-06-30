import { AggregateRoot } from '../shared/aggregate-root.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
import { type Result } from '../shared/result.js';
export type EnrollmentRole = 'student' | 'teacher' | 'guest';
export declare class EnrollmentCreated extends BaseDomainEvent {
    readonly enrollmentId: string;
    readonly userId: string;
    readonly courseId: string;
    readonly role: EnrollmentRole;
    constructor(enrollmentId: string, userId: string, courseId: string, role: EnrollmentRole);
}
export declare class EnrollmentSuspended extends BaseDomainEvent {
    readonly enrollmentId: string;
    constructor(enrollmentId: string);
}
export declare class EnrollmentRoleChanged extends BaseDomainEvent {
    readonly enrollmentId: string;
    readonly previousRole: EnrollmentRole;
    readonly newRole: EnrollmentRole;
    constructor(enrollmentId: string, previousRole: EnrollmentRole, newRole: EnrollmentRole);
}
export declare class EnrollmentDeleted extends BaseDomainEvent {
    readonly enrollmentId: string;
    readonly userId: string;
    readonly courseId: string;
    constructor(enrollmentId: string, userId: string, courseId: string);
}
export type EnrollmentStatus = 'active' | 'suspended';
export interface EnrollmentProps {
    userId: string;
    courseId: string;
    role: EnrollmentRole;
    status: EnrollmentStatus;
    enrolledAt: Date;
    /** Soft delete timestamp — history is preserved for audit. */
    deletedAt?: Date;
}
export type EnrollmentError = 'ALREADY_DELETED' | 'ALREADY_SUSPENDED' | 'ALREADY_ACTIVE';
export declare class Enrollment extends AggregateRoot {
    private props;
    private constructor();
    static create(id: string, props: Omit<EnrollmentProps, 'status' | 'enrolledAt'>): Enrollment;
    static reconstitute(id: string, props: EnrollmentProps): Enrollment;
    get userId(): string;
    get courseId(): string;
    get role(): EnrollmentRole;
    get status(): EnrollmentStatus;
    get isDeleted(): boolean;
    get isActive(): boolean;
    changeRole(newRole: EnrollmentRole): Result<void, EnrollmentError>;
    suspend(): Result<void, EnrollmentError>;
    /** Soft delete. History preserved for grading and audit. */
    delete(): Result<void, EnrollmentError>;
}
//# sourceMappingURL=enrollment.d.ts.map