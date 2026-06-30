import { Activity } from '@moodle-next/core'

/** Raw row from mdl_course_modules joined with mdl_modules and instance tables. */
export interface MdlActivity {
  cmid: number
  course: number
  section: number
  modtype: string
  /** Resolved from the module's instance table (mdl_assign.name, etc.); may be null. */
  name: string | null
  visible: number
}

export class ActivityMapper {
  static toDomain(row: MdlActivity): Activity {
    return Activity.reconstitute(String(row.cmid), {
      courseId: String(row.course),
      sectionId: String(row.section),
      pluginId: `mod_${row.modtype}`,
      // Fallback to the module type when the instance has no name (e.g. label).
      name: row.name ?? row.modtype,
      visible: row.visible === 1,
      // Read-only catalog: submissions/completions are loaded on demand later.
      submissions: [],
      completions: [],
    })
  }
}
