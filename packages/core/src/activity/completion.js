"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Completion = exports.CompletionAchieved = void 0;
const entity_js_1 = require("../shared/entity.js");
const domain_event_js_1 = require("../shared/domain-event.js");
class CompletionAchieved extends domain_event_js_1.BaseDomainEvent {
    activityId;
    enrollmentId;
    constructor(activityId, enrollmentId) {
        super('activity.completion_achieved', activityId);
        this.activityId = activityId;
        this.enrollmentId = enrollmentId;
    }
}
exports.CompletionAchieved = CompletionAchieved;
class Completion extends entity_js_1.Entity {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        return new Completion(id, { ...props, satisfiedCriteria: [] });
    }
    static reconstitute(id, props) {
        return new Completion(id, props);
    }
    get enrollmentId() { return this.props.enrollmentId; }
    get activityId() { return this.props.activityId; }
    get completedAt() { return this.props.completedAt; }
    get isComplete() { return !!this.props.completedAt; }
    satisfy(criterionKey) {
        if (!this.props.satisfiedCriteria.includes(criterionKey)) {
            this.props.satisfiedCriteria.push(criterionKey);
        }
    }
    markComplete() {
        if (!this.props.completedAt) {
            this.props.completedAt = new Date();
        }
    }
}
exports.Completion = Completion;
//# sourceMappingURL=completion.js.map