"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = exports.EnrollmentDeleted = exports.EnrollmentRoleChanged = exports.EnrollmentSuspended = exports.EnrollmentCreated = void 0;
const aggregate_root_js_1 = require("../shared/aggregate-root.js");
const domain_event_js_1 = require("../shared/domain-event.js");
const result_js_1 = require("../shared/result.js");
class EnrollmentCreated extends domain_event_js_1.BaseDomainEvent {
    enrollmentId;
    userId;
    courseId;
    role;
    constructor(enrollmentId, userId, courseId, role) {
        super('enrollment.created', enrollmentId);
        this.enrollmentId = enrollmentId;
        this.userId = userId;
        this.courseId = courseId;
        this.role = role;
    }
}
exports.EnrollmentCreated = EnrollmentCreated;
class EnrollmentSuspended extends domain_event_js_1.BaseDomainEvent {
    enrollmentId;
    constructor(enrollmentId) {
        super('enrollment.suspended', enrollmentId);
        this.enrollmentId = enrollmentId;
    }
}
exports.EnrollmentSuspended = EnrollmentSuspended;
class EnrollmentRoleChanged extends domain_event_js_1.BaseDomainEvent {
    enrollmentId;
    previousRole;
    newRole;
    constructor(enrollmentId, previousRole, newRole) {
        super('enrollment.role_changed', enrollmentId);
        this.enrollmentId = enrollmentId;
        this.previousRole = previousRole;
        this.newRole = newRole;
    }
}
exports.EnrollmentRoleChanged = EnrollmentRoleChanged;
class EnrollmentDeleted extends domain_event_js_1.BaseDomainEvent {
    enrollmentId;
    userId;
    courseId;
    constructor(enrollmentId, userId, courseId) {
        super('enrollment.deleted', enrollmentId);
        this.enrollmentId = enrollmentId;
        this.userId = userId;
        this.courseId = courseId;
    }
}
exports.EnrollmentDeleted = EnrollmentDeleted;
class Enrollment extends aggregate_root_js_1.AggregateRoot {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        const enrollment = new Enrollment(id, {
            ...props,
            status: 'active',
            enrolledAt: new Date(),
        });
        enrollment.emit(new EnrollmentCreated(id, props.userId, props.courseId, props.role));
        return enrollment;
    }
    static reconstitute(id, props) {
        return new Enrollment(id, props);
    }
    get userId() { return this.props.userId; }
    get courseId() { return this.props.courseId; }
    get role() { return this.props.role; }
    get status() { return this.props.status; }
    get isDeleted() { return !!this.props.deletedAt; }
    get isActive() { return this.props.status === 'active' && !this.isDeleted; }
    changeRole(newRole) {
        if (this.isDeleted)
            return (0, result_js_1.fail)('ALREADY_DELETED');
        const previous = this.props.role;
        this.props.role = newRole;
        this.emit(new EnrollmentRoleChanged(this.id, previous, newRole));
        return (0, result_js_1.ok)(undefined);
    }
    suspend() {
        if (this.isDeleted)
            return (0, result_js_1.fail)('ALREADY_DELETED');
        if (this.props.status === 'suspended')
            return (0, result_js_1.fail)('ALREADY_SUSPENDED');
        this.props.status = 'suspended';
        this.emit(new EnrollmentSuspended(this.id));
        return (0, result_js_1.ok)(undefined);
    }
    /** Soft delete. History preserved for grading and audit. */
    delete() {
        if (this.isDeleted)
            return (0, result_js_1.fail)('ALREADY_DELETED');
        this.props.deletedAt = new Date();
        this.emit(new EnrollmentDeleted(this.id, this.props.userId, this.props.courseId));
        return (0, result_js_1.ok)(undefined);
    }
}
exports.Enrollment = Enrollment;
//# sourceMappingURL=enrollment.js.map