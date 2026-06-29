import { Enrollment, type EnrollmentRole } from '@moodle-next/core'

/** Raw row from joined mdl_user_enrolments + mdl_enrol + mdl_role */
export interface MdlEnrollment {
  id: number
  userid: number
  courseid: number
  status: number
  timecreated: number
  role_shortname: string | null
}

/** Maps Moodle role shortnames to the ubiquitous language. */
function toRole(shortname: string | null): EnrollmentRole {
  switch (shortname) {
    case 'editingteacher':
    case 'teacher':
      return 'teacher'
    case 'guest':
      return 'guest'
    default:
      return 'student'
  }
}

export class EnrollmentMapper {
  static toDomain(row: MdlEnrollment): Enrollment {
    return Enrollment.reconstitute(String(row.id), {
      userId: String(row.userid),
      courseId: String(row.courseid),
      role: toRole(row.role_shortname),
      status: row.status === 0 ? 'active' : 'suspended',
      enrolledAt: new Date(row.timecreated * 1000),
    })
  }
}
