import { Entity } from './entity.js';
import type { DomainEvent } from './domain-event.js';
export declare abstract class AggregateRoot<TId extends string = string> extends Entity<TId> {
    private _events;
    protected emit(event: DomainEvent): void;
    pullEvents(): DomainEvent[];
}
//# sourceMappingURL=aggregate-root.d.ts.map