"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = exports.GradeOverridden = exports.GradeUpdated = exports.GradeCreated = void 0;
const aggregate_root_js_1 = require("../shared/aggregate-root.js");
const domain_event_js_1 = require("../shared/domain-event.js");
const result_js_1 = require("../shared/result.js");
class GradeCreated extends domain_event_js_1.BaseDomainEvent {
    gradeId;
    enrollmentId;
    activityId;
    constructor(gradeId, enrollmentId, activityId) {
        super('grade.created', gradeId);
        this.gradeId = gradeId;
        this.enrollmentId = enrollmentId;
        this.activityId = activityId;
    }
}
exports.GradeCreated = GradeCreated;
class GradeUpdated extends domain_event_js_1.BaseDomainEvent {
    gradeId;
    value;
    constructor(gradeId, value) {
        super('grade.updated', gradeId);
        this.gradeId = gradeId;
        this.value = value;
    }
}
exports.GradeUpdated = GradeUpdated;
class GradeOverridden extends domain_event_js_1.BaseDomainEvent {
    gradeId;
    previousValue;
    overriddenValue;
    reason;
    constructor(gradeId, previousValue, overriddenValue, reason) {
        super('grade.overridden', gradeId);
        this.gradeId = gradeId;
        this.previousValue = previousValue;
        this.overriddenValue = overriddenValue;
        this.reason = reason;
    }
}
exports.GradeOverridden = GradeOverridden;
class Grade extends aggregate_root_js_1.AggregateRoot {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        const grade = new Grade(id, props);
        grade.emit(new GradeCreated(id, props.enrollmentId, props.activityId));
        return grade;
    }
    static reconstitute(id, props) {
        return new Grade(id, props);
    }
    get enrollmentId() { return this.props.enrollmentId; }
    get activityId() { return this.props.activityId; }
    get value() { return this.props.value; }
    get maxValue() { return this.props.maxValue; }
    get feedback() { return this.props.feedback; }
    get percentage() {
        if (this.props.value === null)
            return null;
        return (this.props.value / this.props.maxValue) * 100;
    }
    assign(value, feedback) {
        if (value < 0)
            return (0, result_js_1.fail)('NEGATIVE_VALUE');
        if (value > this.props.maxValue)
            return (0, result_js_1.fail)('EXCEEDS_MAX');
        this.props.value = value;
        this.props.feedback = feedback;
        this.props.gradedAt = new Date();
        this.emit(new GradeUpdated(this.id, value));
        return (0, result_js_1.ok)(undefined);
    }
    /** Manual override is allowed but must be logged per domain rule. */
    override(value, reason) {
        if (value < 0)
            return (0, result_js_1.fail)('NEGATIVE_VALUE');
        if (value > this.props.maxValue)
            return (0, result_js_1.fail)('EXCEEDS_MAX');
        const previous = this.props.value;
        this.props.value = value;
        this.props.overriddenAt = new Date();
        this.props.overrideReason = reason;
        this.emit(new GradeOverridden(this.id, previous, value, reason));
        return (0, result_js_1.ok)(undefined);
    }
}
exports.Grade = Grade;
//# sourceMappingURL=grade.js.map