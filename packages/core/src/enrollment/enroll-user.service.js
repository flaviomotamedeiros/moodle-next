"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollUserService = void 0;
const result_js_1 = require("../shared/result.js");
const enrollment_js_1 = require("./enrollment.js");
/**
 * Domain service: enrolling a user does not belong to Enrollment alone
 * (it needs to check course existence) nor to Course (it owns no enrollment data).
 */
class EnrollUserService {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async execute(userId, courseId, role) {
        const existing = await this.deps.enrollments.findByUserAndCourse(userId, courseId);
        if (existing && !existing.isDeleted) {
            return (0, result_js_1.fail)('ALREADY_ENROLLED');
        }
        const enrollment = enrollment_js_1.Enrollment.create(this.deps.generateId(), {
            userId,
            courseId,
            role,
        });
        await this.deps.enrollments.save(enrollment);
        return (0, result_js_1.ok)(enrollment);
    }
}
exports.EnrollUserService = EnrollUserService;
//# sourceMappingURL=enroll-user.service.js.map