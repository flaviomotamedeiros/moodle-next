"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDomainEvent = void 0;
class BaseDomainEvent {
    eventName;
    aggregateId;
    occurredAt;
    constructor(eventName, aggregateId) {
        this.eventName = eventName;
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
    }
}
exports.BaseDomainEvent = BaseDomainEvent;
//# sourceMappingURL=domain-event.js.map