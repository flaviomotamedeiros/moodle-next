"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = exports.ActivityCreated = void 0;
const aggregate_root_js_1 = require("../shared/aggregate-root.js");
const domain_event_js_1 = require("../shared/domain-event.js");
class ActivityCreated extends domain_event_js_1.BaseDomainEvent {
    activityId;
    courseId;
    pluginId;
    constructor(activityId, courseId, pluginId) {
        super('activity.created', activityId);
        this.activityId = activityId;
        this.courseId = courseId;
        this.pluginId = pluginId;
    }
}
exports.ActivityCreated = ActivityCreated;
class Activity extends aggregate_root_js_1.AggregateRoot {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        const activity = new Activity(id, { ...props, submissions: [], completions: [] });
        activity.emit(new ActivityCreated(id, props.courseId, props.pluginId));
        return activity;
    }
    static reconstitute(id, props) {
        return new Activity(id, props);
    }
    get courseId() { return this.props.courseId; }
    get sectionId() { return this.props.sectionId; }
    get pluginId() { return this.props.pluginId; }
    get name() { return this.props.name; }
    get visible() { return this.props.visible; }
    get submissions() { return this.props.submissions; }
    get completions() { return this.props.completions; }
    addSubmission(submission) {
        this.props.submissions.push(submission);
    }
    findSubmission(id) {
        return this.props.submissions.find(s => s.id === id);
    }
    markComplete(completion) {
        const existing = this.props.completions.findIndex(c => c.enrollmentId === completion.enrollmentId);
        if (existing >= 0) {
            this.props.completions[existing] = completion;
        }
        else {
            this.props.completions.push(completion);
        }
    }
    isCompletedBy(enrollmentId) {
        return this.props.completions.some(c => c.enrollmentId === enrollmentId && c.completedAt != null);
    }
}
exports.Activity = Activity;
//# sourceMappingURL=activity.js.map