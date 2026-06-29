import { Injectable } from '@nestjs/common'
import { Course, type CourseRepository } from '@moodle-next/core'
import { LegacyDbService } from '../legacy-db.service.js'
import { CourseMapper, type MdlCourse } from '../mappers/course.mapper.js'

@Injectable()
export class LegacyCourseRepository implements CourseRepository {
  constructor(private readonly db: LegacyDbService) {}

  async findById(id: string): Promise<Course | null> {
    const rows = await this.db.query<MdlCourse>(
      'SELECT id, fullname, shortname, category, visible, startdate, enddate FROM mdl_course WHERE id = ?',
      [id],
    )
    return rows[0] ? CourseMapper.toDomain(rows[0]) : null
  }

  async findByShortName(shortName: string): Promise<Course | null> {
    const rows = await this.db.query<MdlCourse>(
      'SELECT id, fullname, shortname, category, visible, startdate, enddate FROM mdl_course WHERE shortname = ?',
      [shortName],
    )
    return rows[0] ? CourseMapper.toDomain(rows[0]) : null
  }

  async findByCategory(categoryId: string): Promise<Course[]> {
    const rows = await this.db.query<MdlCourse>(
      'SELECT id, fullname, shortname, category, visible, startdate, enddate FROM mdl_course WHERE category = ? ORDER BY sortorder',
      [categoryId],
    )
    return rows.map(CourseMapper.toDomain)
  }

  async save(_course: Course): Promise<void> {
    throw new Error('LegacyCourseRepository is read-only.')
  }

  async delete(_id: string): Promise<void> {
    throw new Error('LegacyCourseRepository is read-only.')
  }
}
