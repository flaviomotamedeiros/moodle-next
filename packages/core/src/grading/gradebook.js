"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gradebook = void 0;
const entity_js_1 = require("../shared/entity.js");
class Gradebook extends entity_js_1.Entity {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    get courseId() { return this.props.courseId; }
    get aggregationMethod() { return this.props.aggregationMethod; }
    get grades() { return this.props.grades; }
    gradesFor(enrollmentId) {
        return this.props.grades.filter(g => g.enrollmentId === enrollmentId);
    }
    /**
     * Calculates the final grade for an enrollment using the configured method.
     * Returns null if no grades have been assigned yet.
     */
    calculateFinalGrade(enrollmentId) {
        const grades = this.gradesFor(enrollmentId).filter(g => g.value !== null);
        if (grades.length === 0)
            return null;
        const percentages = grades.map(g => g.percentage);
        switch (this.props.aggregationMethod) {
            case 'mean':
            case 'weighted_mean':
            case 'natural':
                return percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
            case 'highest':
                return Math.max(...percentages);
            case 'lowest':
                return Math.min(...percentages);
        }
    }
}
exports.Gradebook = Gradebook;
//# sourceMappingURL=gradebook.js.map