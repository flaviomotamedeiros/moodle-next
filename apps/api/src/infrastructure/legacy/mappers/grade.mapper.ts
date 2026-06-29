import { Grade } from '@moodle-next/core'

/** Raw row from mdl_grade_grades joined with mdl_grade_items */
export interface MdlGrade {
  id: number
  itemid: number
  userid: number
  finalgrade: number | null
  rawgrademax: number
  feedback: string | null
  overridden: number
  timemodified: number | null
  /** Joined from mdl_grade_items */
  itemmodule: string | null
  iteminstance: number | null
  courseid: number
}

export class GradeMapper {
  static toDomain(row: MdlGrade, enrollmentId: string): Grade {
    return Grade.reconstitute(String(row.id), {
      enrollmentId,
      activityId: `${row.itemmodule}-${row.iteminstance}`,
      value: row.finalgrade !== null ? Number(row.finalgrade) : null,
      maxValue: Number(row.rawgrademax),
      feedback: row.feedback ?? undefined,
      gradingStrategyType: 'points',
      gradedAt: row.timemodified ? new Date(row.timemodified * 1000) : undefined,
      overriddenAt: row.overridden ? new Date() : undefined,
    })
  }
}
