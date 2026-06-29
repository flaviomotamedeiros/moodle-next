import { Course } from '@moodle-next/core'

/** Raw row from mdl_course */
export interface MdlCourse {
  id: number
  fullname: string
  shortname: string
  category: number
  visible: number
  startdate: number
  enddate: number
}

export class CourseMapper {
  static toDomain(row: MdlCourse): Course {
    return Course.reconstitute(String(row.id), {
      fullName: row.fullname,
      shortName: row.shortname,
      categoryId: String(row.category),
      visible: row.visible === 1,
      startDate: row.startdate ? new Date(row.startdate * 1000).toISOString() : undefined,
      endDate: row.enddate ? new Date(row.enddate * 1000).toISOString() : undefined,
      sections: [],
    })
  }
}
