import { Injectable } from '@nestjs/common'
import { Enrollment, type EnrollmentRepository, type EnrollmentRole } from '@moodle-next/core'
import { LegacyDbService } from '../legacy-db.service.js'
import { EnrollmentMapper, type MdlEnrollment } from '../mappers/enrollment.mapper.js'

/**
 * Reads enrollments from the legacy schema.
 * Moodle stores enrollment in two tables:
 *   mdl_user_enrolments — the student↔course relationship
 *   mdl_enrol           — the enrollment method (manual, self, ldap, etc.)
 * Role is obtained from mdl_role_assignments + mdl_role.
 */
@Injectable()
export class LegacyEnrollmentRepository implements EnrollmentRepository {
  private readonly BASE_SQL = `
    SELECT
      ue.id,
      ue.userid,
      e.courseid,
      ue.status,
      ue.timecreated,
      r.shortname AS role_shortname
    FROM mdl_user_enrolments ue
    JOIN mdl_enrol e ON e.id = ue.enrolid
    LEFT JOIN mdl_role_assignments ra
      ON ra.userid = ue.userid
      AND ra.contextid = (
        SELECT id FROM mdl_context
        WHERE contextlevel = 50 AND instanceid = e.courseid
        LIMIT 1
      )
    LEFT JOIN mdl_role r ON r.id = ra.roleid
  `

  constructor(private readonly db: LegacyDbService) {}

  async findById(id: string): Promise<Enrollment | null> {
    const rows = await this.db.query<MdlEnrollment>(
      `${this.BASE_SQL} WHERE ue.id = ?`,
      [id],
    )
    return rows[0] ? EnrollmentMapper.toDomain(rows[0]) : null
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    const rows = await this.db.query<MdlEnrollment>(
      `${this.BASE_SQL} WHERE ue.userid = ? AND e.courseid = ? LIMIT 1`,
      [userId, courseId],
    )
    return rows[0] ? EnrollmentMapper.toDomain(rows[0]) : null
  }

  async findByCourse(courseId: string, role?: EnrollmentRole): Promise<Enrollment[]> {
    const rows = await this.db.query<MdlEnrollment>(
      `${this.BASE_SQL} WHERE e.courseid = ?`,
      [courseId],
    )
    const enrollments = rows.map(EnrollmentMapper.toDomain)
    return role ? enrollments.filter(e => e.role === role) : enrollments
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    const rows = await this.db.query<MdlEnrollment>(
      `${this.BASE_SQL} WHERE ue.userid = ?`,
      [userId],
    )
    return rows.map(EnrollmentMapper.toDomain)
  }

  async save(_enrollment: Enrollment): Promise<void> {
    throw new Error('LegacyEnrollmentRepository is read-only.')
  }
}
