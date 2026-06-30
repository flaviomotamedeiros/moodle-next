export interface DomainEvent {
    readonly eventName: string;
    readonly occurredAt: Date;
    readonly aggregateId: string;
}
export declare abstract class BaseDomainEvent implements DomainEvent {
    readonly eventName: string;
    readonly aggregateId: string;
    readonly occurredAt: Date;
    constructor(eventName: string, aggregateId: string);
}
//# sourceMappingURL=domain-event.d.ts.map