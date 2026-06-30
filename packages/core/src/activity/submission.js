"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = exports.SubmissionCreated = void 0;
const entity_js_1 = require("../shared/entity.js");
const domain_event_js_1 = require("../shared/domain-event.js");
const result_js_1 = require("../shared/result.js");
class SubmissionCreated extends domain_event_js_1.BaseDomainEvent {
    submissionId;
    activityId;
    enrollmentId;
    constructor(submissionId, activityId, enrollmentId) {
        super('activity.submission_created', submissionId);
        this.submissionId = submissionId;
        this.activityId = activityId;
        this.enrollmentId = enrollmentId;
    }
}
exports.SubmissionCreated = SubmissionCreated;
class Submission extends entity_js_1.Entity {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        return new Submission(id, { ...props, status: 'draft' });
    }
    static reconstitute(id, props) {
        return new Submission(id, props);
    }
    get enrollmentId() { return this.props.enrollmentId; }
    get activityId() { return this.props.activityId; }
    get attemptNumber() { return this.props.attemptNumber; }
    get status() { return this.props.status; }
    get content() { return this.props.content; }
    get submittedAt() { return this.props.submittedAt; }
    submit() {
        if (this.props.status === 'submitted' || this.props.status === 'graded') {
            return (0, result_js_1.fail)('ALREADY_SUBMITTED');
        }
        if (this.props.status === 'grading') {
            return (0, result_js_1.fail)('ALREADY_BEING_GRADED');
        }
        this.props.status = 'submitted';
        this.props.submittedAt = new Date();
        return (0, result_js_1.ok)(undefined);
    }
    /** Immutable once grading begins — enforced by this rule. */
    startGrading() {
        if (this.props.status !== 'submitted')
            return (0, result_js_1.fail)('ALREADY_BEING_GRADED');
        this.props.status = 'grading';
        return (0, result_js_1.ok)(undefined);
    }
    markGraded() {
        this.props.status = 'graded';
    }
}
exports.Submission = Submission;
//# sourceMappingURL=submission.js.map