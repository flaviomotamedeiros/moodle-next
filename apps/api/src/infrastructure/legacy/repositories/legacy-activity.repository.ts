import { Injectable } from '@nestjs/common'
import { Activity, type ActivityRepository } from '@moodle-next/core'
import { LegacyDbService } from '../legacy-db.service.js'
import { ActivityMapper, type MdlActivity } from '../mappers/activity.mapper.js'

/**
 * Reads activities from the legacy schema.
 * Moodle models an activity as a row in mdl_course_modules pointing to a row in
 * the module's own instance table (mdl_assign, mdl_forum, ...). The display name
 * lives in that instance table, so we COALESCE across the common module types.
 */
@Injectable()
export class LegacyActivityRepository implements ActivityRepository {
  private readonly BASE_SQL = `
    SELECT
      cm.id       AS cmid,
      cm.course   AS course,
      cm.section  AS section,
      cm.visible  AS visible,
      m.name      AS modtype,
      COALESCE(a.name, f.name, q.name, p.name, r.name, u.name) AS name
    FROM mdl_course_modules cm
    JOIN mdl_modules m ON m.id = cm.module
    LEFT JOIN mdl_assign   a ON m.name = 'assign'   AND a.id = cm.instance
    LEFT JOIN mdl_forum    f ON m.name = 'forum'    AND f.id = cm.instance
    LEFT JOIN mdl_quiz     q ON m.name = 'quiz'     AND q.id = cm.instance
    LEFT JOIN mdl_page     p ON m.name = 'page'     AND p.id = cm.instance
    LEFT JOIN mdl_resource r ON m.name = 'resource' AND r.id = cm.instance
    LEFT JOIN mdl_url      u ON m.name = 'url'      AND u.id = cm.instance
    WHERE cm.deletioninprogress = 0
  `

  constructor(private readonly db: LegacyDbService) {}

  async findById(id: string): Promise<Activity | null> {
    const rows = await this.db.query<MdlActivity>(
      `${this.BASE_SQL} AND cm.id = ?`,
      [id],
    )
    return rows[0] ? ActivityMapper.toDomain(rows[0]) : null
  }

  async findByCourse(courseId: string): Promise<Activity[]> {
    const rows = await this.db.query<MdlActivity>(
      `${this.BASE_SQL} AND cm.course = ? ORDER BY cm.section`,
      [courseId],
    )
    return rows.map(ActivityMapper.toDomain)
  }

  async save(_activity: Activity): Promise<void> {
    throw new Error('LegacyActivityRepository is read-only.')
  }
}
