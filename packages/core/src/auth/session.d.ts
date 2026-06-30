import { Entity } from '../shared/entity.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
export declare class LoginSucceeded extends BaseDomainEvent {
    readonly userId: string;
    readonly sessionId: string;
    constructor(userId: string, sessionId: string);
}
export declare class LoginFailed extends BaseDomainEvent {
    readonly username: string;
    readonly reason: string;
    constructor(username: string, reason: string);
}
export declare class LogoutPerformed extends BaseDomainEvent {
    readonly sessionId: string;
    constructor(sessionId: string);
}
export interface SessionProps {
    userId: string;
    /** JWT token */
    accessToken: string;
    /** Opaque refresh token */
    refreshToken: string;
    expiresAt: Date;
    revokedAt?: Date;
}
export declare class Session extends Entity {
    private props;
    constructor(id: string, props: SessionProps);
    get userId(): string;
    get accessToken(): string;
    get refreshToken(): string;
    get expiresAt(): Date;
    get isExpired(): boolean;
    get isRevoked(): boolean;
    get isValid(): boolean;
    revoke(): void;
}
//# sourceMappingURL=session.d.ts.map