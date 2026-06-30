import { AggregateRoot } from '../shared/aggregate-root.js';
import { BaseDomainEvent } from '../shared/domain-event.js';
export type NotificationChannel = 'email' | 'in_app' | 'push';
export type NotificationStatus = 'pending' | 'delivered' | 'failed';
export declare class NotificationDelivered extends BaseDomainEvent {
    readonly notificationId: string;
    readonly channel: NotificationChannel;
    constructor(notificationId: string, channel: NotificationChannel);
}
export interface NotificationProps {
    recipientId: string;
    channel: NotificationChannel;
    templateId: string;
    context: Record<string, unknown>;
    status: NotificationStatus;
    /** ISO 8601 */
    scheduledFor?: string;
    deliveredAt?: Date;
    failureReason?: string;
    retryCount: number;
}
export declare class Notification extends AggregateRoot {
    private props;
    private constructor();
    static create(id: string, props: Omit<NotificationProps, 'status' | 'retryCount'>): Notification;
    static reconstitute(id: string, props: NotificationProps): Notification;
    get recipientId(): string;
    get channel(): NotificationChannel;
    get status(): NotificationStatus;
    get retryCount(): number;
    markDelivered(): void;
    /** Exponential backoff retry handled by the infrastructure layer. */
    markFailed(reason: string): void;
    retry(): void;
}
//# sourceMappingURL=notification.d.ts.map