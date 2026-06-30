import { type Result } from '../shared/result.js';
import { Enrollment, type EnrollmentRole } from './enrollment.js';
import type { EnrollmentRepository } from './enrollment.repository.js';
export type EnrollUserError = 'ALREADY_ENROLLED' | 'USER_NOT_FOUND' | 'COURSE_NOT_FOUND';
interface Deps {
    enrollments: EnrollmentRepository;
    generateId: () => string;
}
/**
 * Domain service: enrolling a user does not belong to Enrollment alone
 * (it needs to check course existence) nor to Course (it owns no enrollment data).
 */
export declare class EnrollUserService {
    private readonly deps;
    constructor(deps: Deps);
    execute(userId: string, courseId: string, role: EnrollmentRole): Promise<Result<Enrollment, EnrollUserError>>;
}
export {};
//# sourceMappingURL=enroll-user.service.d.ts.map