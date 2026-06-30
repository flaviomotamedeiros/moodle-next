"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.SectionReordered = exports.CourseDeleted = exports.CourseCreated = void 0;
const aggregate_root_js_1 = require("../shared/aggregate-root.js");
const domain_event_js_1 = require("../shared/domain-event.js");
const result_js_1 = require("../shared/result.js");
class CourseCreated extends domain_event_js_1.BaseDomainEvent {
    courseId;
    categoryId;
    constructor(courseId, categoryId) {
        super('course.created', courseId);
        this.courseId = courseId;
        this.categoryId = categoryId;
    }
}
exports.CourseCreated = CourseCreated;
class CourseDeleted extends domain_event_js_1.BaseDomainEvent {
    courseId;
    constructor(courseId) {
        super('course.deleted', courseId);
        this.courseId = courseId;
    }
}
exports.CourseDeleted = CourseDeleted;
class SectionReordered extends domain_event_js_1.BaseDomainEvent {
    courseId;
    sectionId;
    newOrder;
    constructor(courseId, sectionId, newOrder) {
        super('course.section_reordered', courseId);
        this.courseId = courseId;
        this.sectionId = sectionId;
        this.newOrder = newOrder;
    }
}
exports.SectionReordered = SectionReordered;
class Course extends aggregate_root_js_1.AggregateRoot {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        if (!props.fullName.trim())
            return (0, result_js_1.fail)('FULL_NAME_REQUIRED');
        if (!props.shortName.trim())
            return (0, result_js_1.fail)('SHORT_NAME_REQUIRED');
        if (props.startDate && props.endDate && props.startDate >= props.endDate) {
            return (0, result_js_1.fail)('INVALID_DATE_RANGE');
        }
        const course = new Course(id, { ...props, visible: true, sections: [] });
        course.emit(new CourseCreated(id, props.categoryId));
        return (0, result_js_1.ok)(course);
    }
    static reconstitute(id, props) {
        return new Course(id, props);
    }
    get fullName() { return this.props.fullName; }
    get shortName() { return this.props.shortName; }
    get categoryId() { return this.props.categoryId; }
    get visible() { return this.props.visible; }
    get sections() { return this.props.sections; }
    reorderSection(sectionId, newOrder) {
        const section = this.props.sections.find(s => s.id === sectionId);
        if (!section)
            return (0, result_js_1.fail)('SECTION_NOT_FOUND');
        section.reorder(newOrder);
        this.emit(new SectionReordered(this.id, sectionId, newOrder));
        return (0, result_js_1.ok)(undefined);
    }
    delete() {
        this.emit(new CourseDeleted(this.id));
    }
}
exports.Course = Course;
//# sourceMappingURL=course.js.map