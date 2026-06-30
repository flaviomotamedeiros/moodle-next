import { AggregateRoot } from '../shared/aggregate-root.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
export declare class UserCreated extends BaseDomainEvent {
    readonly userId: string;
    readonly email: string;
    constructor(userId: string, email: string);
}
export declare class UserDeleted extends BaseDomainEvent {
    readonly userId: string;
    constructor(userId: string);
}
export interface UserProps {
    email: string;
    firstName: string;
    lastName: string;
    /** Soft delete: deleted users are preserved for audit */
    deletedAt?: Date;
}
export declare class User extends AggregateRoot {
    private props;
    private constructor();
    static create(id: string, props: UserProps): User;
    static reconstitute(id: string, props: UserProps): User;
    get email(): string;
    get firstName(): string;
    get lastName(): string;
    get fullName(): string;
    get isDeleted(): boolean;
    updateProfile(firstName: string, lastName: string): void;
    /** Soft delete — grades and submissions are preserved for audit. */
    delete(): void;
}
//# sourceMappingURL=user.d.ts.map