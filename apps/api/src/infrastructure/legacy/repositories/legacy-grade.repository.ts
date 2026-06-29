import { Injectable } from '@nestjs/common'
import { Grade, type GradeRepository } from '@moodle-next/core'
import { LegacyDbService } from '../legacy-db.service.js'
import { GradeMapper, type MdlGrade } from '../mappers/grade.mapper.js'

@Injectable()
export class LegacyGradeRepository implements GradeRepository {
  private readonly BASE_SQL = `
    SELECT
      gg.id,
      gg.itemid,
      gg.userid,
      gg.finalgrade,
      gg.rawgrademax,
      gg.feedback,
      gg.overridden,
      gg.timemodified,
      gi.itemmodule,
      gi.iteminstance,
      gi.courseid
    FROM mdl_grade_grades gg
    JOIN mdl_grade_items gi ON gi.id = gg.itemid
    WHERE gi.itemtype = 'mod'
  `

  constructor(private readonly db: LegacyDbService) {}

  async findById(id: string): Promise<Grade | null> {
    const rows = await this.db.query<MdlGrade>(
      `${this.BASE_SQL} AND gg.id = ?`,
      [id],
    )
    if (!rows[0]) return null
    // Without enrollment ID in the legacy schema, we reconstruct from userid
    return GradeMapper.toDomain(rows[0], `legacy-user-${rows[0].userid}`)
  }

  async findByEnrollmentAndActivity(enrollmentId: string, activityId: string): Promise<Grade | null> {
    // enrollmentId in legacy ACL = "legacy-user-{userid}"
    const userId = enrollmentId.replace('legacy-user-', '')
    const [module, instance] = activityId.split('-')
    const rows = await this.db.query<MdlGrade>(
      `${this.BASE_SQL} AND gg.userid = ? AND gi.itemmodule = ? AND gi.iteminstance = ? LIMIT 1`,
      [userId, module, instance],
    )
    return rows[0] ? GradeMapper.toDomain(rows[0], enrollmentId) : null
  }

  async findByEnrollment(enrollmentId: string): Promise<Grade[]> {
    const userId = enrollmentId.replace('legacy-user-', '')
    const rows = await this.db.query<MdlGrade>(
      `${this.BASE_SQL} AND gg.userid = ?`,
      [userId],
    )
    return rows.map(r => GradeMapper.toDomain(r, enrollmentId))
  }

  async findByCourse(courseId: string): Promise<Grade[]> {
    const rows = await this.db.query<MdlGrade>(
      `${this.BASE_SQL} AND gi.courseid = ?`,
      [courseId],
    )
    return rows.map(r => GradeMapper.toDomain(r, `legacy-user-${r.userid}`))
  }

  async save(_grade: Grade): Promise<void> {
    throw new Error('LegacyGradeRepository is read-only.')
  }
}
