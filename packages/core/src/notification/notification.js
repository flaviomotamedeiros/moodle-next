"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationDelivered = void 0;
const aggregate_root_js_1 = require("../shared/aggregate-root.js");
const domain_event_js_1 = require("../shared/domain-event.js");
class NotificationDelivered extends domain_event_js_1.BaseDomainEvent {
    notificationId;
    channel;
    constructor(notificationId, channel) {
        super('notification.delivered', notificationId);
        this.notificationId = notificationId;
        this.channel = channel;
    }
}
exports.NotificationDelivered = NotificationDelivered;
class Notification extends aggregate_root_js_1.AggregateRoot {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        return new Notification(id, { ...props, status: 'pending', retryCount: 0 });
    }
    static reconstitute(id, props) {
        return new Notification(id, props);
    }
    get recipientId() { return this.props.recipientId; }
    get channel() { return this.props.channel; }
    get status() { return this.props.status; }
    get retryCount() { return this.props.retryCount; }
    markDelivered() {
        this.props.status = 'delivered';
        this.props.deliveredAt = new Date();
        this.emit(new NotificationDelivered(this.id, this.props.channel));
    }
    /** Exponential backoff retry handled by the infrastructure layer. */
    markFailed(reason) {
        this.props.status = 'failed';
        this.props.failureReason = reason;
        this.props.retryCount++;
    }
    retry() {
        this.props.status = 'pending';
    }
}
exports.Notification = Notification;
//# sourceMappingURL=notification.js.map